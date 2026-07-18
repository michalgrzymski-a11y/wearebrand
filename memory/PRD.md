# IT SMARTCLOUT — Corporate Website (PRD)

## Original problem statement
Corporate landing page for **IT SMARTCLOUT** (Polish IT infrastructure, NetApp partner). Strict brand palette:
Deep Teal `#0C5C62`, Accent Mint `#49ADA5`, White, Light gray `#F8FAFA`, Charcoal `#1C2833`.
6 sections: Hero (interactive datacenter viz), About, Trusted-By marquee, Portfolio bento, Strategic Partners marquee (NetApp highlighted), Contact + registry footer.

## User choices
- Contact form: **save to MongoDB only** (email service deferred).
- Client / partner logos: **text-based monochrome logotypes** with per-brand hover color.
- Languages: **Polish + English** (client-side toggle).
- Company data: KRS 0000952777 · NIP 5842813752 · REGON 521229601 · +48 533 956 934 · Turek.
- Hero: **full Three.js WebGL** (upgraded to a full 3D scene in iteration 4).

## Architecture
- Backend: FastAPI (`/app/backend/server.py`) with MongoDB persistence
  - `GET  /api/`               → health
  - `POST /api/contact`        → create `ContactMessage`
  - `GET  /api/contact`        → list
- Frontend: React 19 (CRA + Craco), Tailwind, Three.js 0.161, lucide-react
- i18n: custom `LanguageContext`
- Fonts: Manrope (UI) + Fraunces (accent italic display)

## Sections implemented
1. **Hero** (iteration 4) — compact height, deep-tech dark backdrop (`#060B12`) with:
   - **True 3D scene** (`Datacenter3DScene.jsx`): 1 central "DATACENTER" glass cube + 3 rotating rings, 6 satellite 3D server-rack meshes with LED strips, tube-geometry connections, animated packet spheres flowing along curves, grid floor, ambient dust, slow auto-orbit camera (pauses on hover)
   - **Raycaster hover** with label-fallback so hover state persists over the label region
   - Bilingual title with Fraunces italic accent
   - Corner tech brackets + scanline overlay + status ticker
2. **About** — 3 metric cards with sparklines + 3 interactive pillars (Uważność / Holistyczne spojrzenie / Optymalizacja) driving a rotating hex infographic
3. **Trusted-By** — RTL marquee with 11 monochrome text-logos, coloured on hover
4. **Portfolio (bento)** — 4 tiles (Sprzęt IT, Security, Oprogramowanie, Usługi & DataCenter) with chip lists, hover lift + under-glow
5. **Strategic Partners** — RTL marquee, 13 vendor cards; NetApp highlighted with `#0C5C62` border + badge
6. **Contact & Footer** — registry column + high-fidelity form with focus animations, POST to `/api/contact`

## What has been implemented (2026-01)
- ✅ Backend `/api/contact` (create + list) — 100% tests pass (`/app/backend/tests/test_contact_api.py`)
- ✅ All 6 sections, strict palette adherence, bilingual toggle
- ✅ Iter 1 → base build, ✅ Iter 2 → interactive About + SVG topology, ✅ Iter 3 → dark-tech Hero + chip removal, ✅ Iter 4 → compact Hero + real Three.js 3D datacenter scene with stable hover
- ✅ All interactive elements have unique `data-testid` attributes
- ✅ No console errors on load or interaction

## Files of interest
- `/app/backend/server.py`, `/app/backend/tests/test_contact_api.py`
- `/app/frontend/src/App.js`, `App.css`
- `/app/frontend/src/i18n/{LanguageContext.jsx, translations.js}`
- `/app/frontend/src/components/Navbar.jsx`
- `/app/frontend/src/components/hero/{HeroSection, HeroCanvas, Datacenter3DScene, DatacenterTopology}.jsx`
- `/app/frontend/src/components/sections/{AboutSection, TrustedBySection, PortfolioSection, PartnersSection, ContactSection}.jsx`

## Backlog / next actions
- **P1** — Real brand SVG logos for Trusted-By and Partners (once assets provided)
- **P1** — Enable outgoing email on `/api/contact` (SendGrid or Resend) when user provides API key
- **P2** — Admin view at `/admin/messages` with basic auth
- **P2** — Cookie/consent banner (GDPR PL)
- **P2** — Case studies section (strong B2B conversion driver)
- **P3** — SEO: JSON-LD Organization, sitemap.xml, hreflang PL/EN
- **P3** — Blog / knowledge base
- **P3** — Refactor `Datacenter3DScene.jsx` into `useThreeScene`/`useDeviceGraph`/`useLabelProjection` hooks (currently ~600 lines)

## Test credentials
N/A — the site has no authentication surface.
