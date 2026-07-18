# IT SMARTCLOUT — Corporate Website (PRD)

## Original problem statement
Build a corporate landing page for **IT SMARTCLOUT** (Polish IT infrastructure company, NetApp partner) using a strict brand palette:
- Deep Teal `#0C5C62`, Accent Mint `#49ADA5`, White `#FFFFFF`, Light gray `#F8FAFA`, Charcoal `#1C2833`.
6 sections: Hero (Three.js constellation + 7 industry-term nodes), About (metrics + narrative), Trusted-By marquee, Portfolio bento, Strategic Partners marquee (NetApp highlighted), Contact form + registry footer.

## User choices (confirmed via ask_human)
- Contact form: **save to MongoDB only** (no email service, no third-party integration).
- Client / partner logos: **text-based monochrome logotypes** (per-brand hover color), until real assets are provided.
- Languages: **Polish + English** (client-side toggle, localStorage-persisted).
- Company registry info supplied by user (KRS 0000952777, NIP 5842813752, REGON 521229601, phone +48 533 956 934, address Turek).
- Hero: **full Three.js WebGL** preferred.

## Architecture
- Backend: FastAPI (`/app/backend/server.py`)
  - `GET  /api/`               → health
  - `POST /api/contact`        → validate + persist `ContactMessage` in MongoDB (`contact_messages` collection)
  - `GET  /api/contact`        → list (admin/testing use)
- Frontend: React (CRA + Craco), React 19, Tailwind, Framer Motion, Three.js 0.161, lucide-react
- i18n: custom `LanguageContext` (`/app/frontend/src/i18n/`)
- Styling: Manrope (UI) + Fraunces (accent italic display)

## Sections implemented
1. **Hero** — deep-tech dark backdrop (`#060B12` base + radial teal glow) with:
   - Three.js ambient particle field + horizontal light-rays (`HeroCanvas.jsx`)
   - Interactive SVG datacenter topology (`DatacenterTopology.jsx`) — 1 central `DATACENTER` hub + 6 satellites (Server, Storage, Network, DR Site, Backup, Security), curved connections with animated data packets, hover-highlight, click-select
   - Bilingual title with Fraunces italic accent on the "continuity" word
   - Corner tech brackets + scanline overlay + status ticker (`SYSTEMS ONLINE / LATENCY / EU-CENTRAL`)
2. **About** — 3 metric cards (20+ / 500+ / 130+) with hover-reveal sparklines + interactive 3-pillar accordion driving a rotating hex infographic
3. **Trusted-By** — RTL infinite marquee with 11 monochrome text-logos, coloured on hover
4. **Portfolio (bento)** — 4 tiles (Sprzęt IT, Security, Oprogramowanie, Usługi & DataCenter) with chip lists, hover lift + under-glow shadow, animated icon fill
5. **Strategic Partners** — RTL marquee with 13 vendor cards; **NetApp** enclosed in a highlight card bordered `#0C5C62` with "Partner NetApp" badge
6. **Contact & Footer** — registry column (KRS/NIP/REGON, phone, `kontakt@smartclout.pl`) + high-fidelity form (name/company, email, message) with focus animations, POSTs to `/api/contact`

## What has been implemented (2026-01)
- ✅ Backend `/api/contact` (create + list) with EmailStr validation, tests at `/app/backend/tests/test_contact_api.py` (8/8)
- ✅ All 6 sections with strict brand palette adherence and bilingual (PL/EN) toggle
- ✅ Three.js hero with datacenter topology (iteration 2 upgrade per user request)
- ✅ Interactive About with 3 pillars + hex infographic (iteration 2 upgrade)
- ✅ Dark-tech Hero backdrop + removed industry-term chips (iteration 3 per user request)
- ✅ Testing agent verification 100% on iteration 1 and iteration 2
- ✅ Data-testid attributes on every interactive/critical element

## Files of interest
- `/app/backend/server.py`
- `/app/backend/tests/test_contact_api.py`
- `/app/frontend/src/App.js`, `App.css`
- `/app/frontend/src/i18n/{LanguageContext.jsx, translations.js}`
- `/app/frontend/src/components/Navbar.jsx`
- `/app/frontend/src/components/hero/{HeroSection, HeroCanvas, DatacenterTopology}.jsx`
- `/app/frontend/src/components/sections/{AboutSection, TrustedBySection, PortfolioSection, PartnersSection, ContactSection}.jsx`

## Backlog / next actions
- **P1** — plug real brand SVG logos for Trusted-By and Partners marquees once user provides assets (currently monochrome text-based logotypes).
- **P1** — enable outgoing email on `/api/contact` (SendGrid or Resend) when the user provides an API key.
- **P2** — Admin view at `/admin/messages` (read-only list of `contact_messages`) with basic auth.
- **P2** — Add cookie/consent banner (GDPR — Polish market).
- **P2** — Case studies section with client anonymised stories (revenue driver).
- **P3** — Sitemap + structured data (JSON-LD Organization) for SEO.
- **P3** — Blog / knowledge base for organic acquisition.

## Test credentials
N/A — the site has no authentication surface.
