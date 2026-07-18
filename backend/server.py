from fastapi import FastAPI, APIRouter, HTTPException
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
