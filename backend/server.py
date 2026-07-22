from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone

from emergentintegrations.llm.chat import LlmChat, UserMessage, TextDelta, StreamDone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="IT SMARTCLOUT API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ==================== MODELS ====================
class ContactMessageCreate(BaseModel):
    model_config = ConfigDict(extra="ignore")

    name: str = Field(min_length=1, max_length=200)
    email: EmailStr
    company: Optional[str] = Field(default=None, max_length=200)
    message: str = Field(min_length=1, max_length=4000)
    lang: Optional[str] = Field(default="pl", max_length=5)


class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    company: Optional[str] = None
    message: str
    lang: str = "pl"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ==================== ROUTES ====================
@api_router.get("/")
async def root():
    return {"service": "IT SMARTCLOUT API", "status": "ok"}


@api_router.post("/contact", response_model=ContactMessage)
async def create_contact_message(payload: ContactMessageCreate):
    obj = ContactMessage(
        name=payload.name.strip(),
        email=payload.email.lower().strip(),
        company=(payload.company or "").strip() or None,
        message=payload.message.strip(),
        lang=(payload.lang or "pl"),
    )
    doc = obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.contact_messages.insert_one(doc)
    logger.info(f"New contact message from {obj.email}")
    return obj


@api_router.get("/contact", response_model=List[ContactMessage])
async def list_contact_messages(limit: int = 100):
    limit = max(1, min(limit, 500))
    docs = await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(limit)
    for d in docs:
        if isinstance(d.get('created_at'), str):
            d['created_at'] = datetime.fromisoformat(d['created_at'])
    return docs


# ==================== SUPPORT CHAT (Claude Sonnet 4.5, no persistence) ====================
SUPPORT_CHAT_SESSIONS: dict[str, LlmChat] = {}

SUPPORT_CHAT_SYSTEM_PL = (
    "Jesteś doradcą serwisu i wsparcia klienta w firmie IT SMARTCLOUT — polskim "
    "integratorze infrastruktury IT, partnerze NetApp, VMware, Cisco, Microsoft. "
    "Odpowiadasz zwięźle (2–5 zdań), rzeczowo, w języku polskim, w formalnym ale "
    "cieplym tonie. Twoje kluczowe obszary kompetencji: \n"
    "1) SERWIS i szybka reakcja — SLA 24/7, czas reakcji od 15 minut, ekipa "
    "z ponad 20-letnim doświadczeniem.\n"
    "2) UTRZYMANIE infrastruktury w datacenter klienta — monitoring, patchowanie, "
    "backup, DR, health-checki.\n"
    "3) WYNAJEM SPRZĘTU — serwery, macierze dyskowe (NetApp), przełączniki, "
    "urządzenia backup na dowolny okres, elastyczne warunki.\n"
    "4) KOMPETENCJE — certyfikowani inżynierowie NetApp / VMware / Cisco / "
    "Microsoft, ponad 500 zrealizowanych projektów, 130+ klientów.\n"
    "Jeśli pytanie wykracza poza IT lub serwis SmartClout — grzecznie odsyłasz "
    "do formularza kontaktowego. Nigdy nie wymyślasz cen ani konkretnych umów "
    "SLA — zapraszasz do rozmowy z konsultantem. Nie używaj markdown."
)

SUPPORT_CHAT_SYSTEM_EN = (
    "You are a service and customer-support advisor at IT SMARTCLOUT — a Polish "
    "IT-infrastructure integrator, partner of NetApp, VMware, Cisco and Microsoft. "
    "You answer concisely (2–5 sentences), factually, in English, in a formal but "
    "warm tone. Your core competencies: \n"
    "1) SERVICE and quick response — 24/7 SLA, response time from 15 minutes, "
    "team with 20+ years of experience.\n"
    "2) MAINTENANCE of infrastructure in the client's datacenter — monitoring, "
    "patching, backup, DR, health-checks.\n"
    "3) EQUIPMENT RENTAL — servers, disk arrays (NetApp), switches, backup "
    "appliances for any period, flexible terms.\n"
    "4) COMPETENCIES — certified NetApp / VMware / Cisco / Microsoft engineers, "
    "500+ projects delivered, 130+ clients.\n"
    "If a question is outside IT or SmartClout's services, politely redirect "
    "the user to the contact form. Never invent prices or specific SLA terms "
    "— invite the user to speak to a consultant. Do not use markdown."
)


class SupportChatRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    session_id: str = Field(min_length=1, max_length=100)
    message: str = Field(min_length=1, max_length=2000)
    lang: Optional[str] = Field(default="pl", max_length=5)


def _get_or_create_chat(session_id: str, lang: str) -> LlmChat:
    chat = SUPPORT_CHAT_SESSIONS.get(session_id)
    if chat is None:
        chat = LlmChat(
            api_key=os.environ["EMERGENT_LLM_KEY"],
            session_id=session_id,
            system_message=(
                SUPPORT_CHAT_SYSTEM_EN if lang == "en" else SUPPORT_CHAT_SYSTEM_PL
            ),
        ).with_model("anthropic", "claude-sonnet-4-5-20250929")
        SUPPORT_CHAT_SESSIONS[session_id] = chat
        # Simple memory cap — keep last 200 sessions in RAM (no persistence)
        if len(SUPPORT_CHAT_SESSIONS) > 200:
            oldest_key = next(iter(SUPPORT_CHAT_SESSIONS))
            SUPPORT_CHAT_SESSIONS.pop(oldest_key, None)
    return chat


@api_router.post("/support-chat")
async def support_chat(payload: SupportChatRequest):
    """Stream Claude Sonnet 4.5 response for the SmartClout support chatbot.
    Sessions are held in-memory only (no DB persistence per user request)."""
    chat = _get_or_create_chat(payload.session_id, (payload.lang or "pl"))

    async def event_generator():
        try:
            async for ev in chat.stream_message(UserMessage(text=payload.message)):
                if isinstance(ev, TextDelta):
                    # Escape newlines so SSE framing (blank-line = event boundary)
                    # never breaks mid-token.
                    safe = ev.content.replace("\r", "").replace("\n", "\\n")
                    yield f"data: {safe}\n\n"
                elif isinstance(ev, StreamDone):
                    yield "event: done\ndata: [DONE]\n\n"
                    break
        except Exception as e:  # noqa: BLE001
            logger.error(f"support_chat stream error: {e}")
            yield f"event: error\ndata: {str(e)[:200]}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
