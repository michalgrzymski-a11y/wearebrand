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
2. **About** (2026-02-19, 2. iteracja) — czysta struktura: label `O NAS` → Apple-style metrics row (Fraunces italic z gradientem mint-teal, mint hairlines) → wyjustowana narracja bez efektów → tytuł `Trzy filary, jedno podejście.` → 3 filary + blueprint panel wyrównane na tej samej osi.
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

## What has been implemented (2026-02, iterations 5–7)
- ✅ **SectionDivider (2026-02-22)** — pixel-dither mosaic (COLS=512 × ROWS=8, ~4096 span cells) for dark↔light transitions only; `.sc-blend` gradient for light↔light. CSS syntax fix (stray `*/` removed).
- ✅ **About redesign (2026-02-22)** — 3-column layout: narrative on left (lg:col-span-8) + 3 clean stat cards on right (lg:col-span-4) in unified `.sc-pillar`-style (white bg, radius 16, mint borders, hover translateX + glow + brackets). Cards contain only icon + value + label (no accordion). Values updated: 20+ / 350+ / 130+.
- ✅ **About narrative expanded (2026-02-22)** — was single dry paragraph, now **3 storytelling paragraphs** (PL + EN) covering 20-year experience, NetApp partnership + client-first attentiveness, holistic ecosystem view + optimisation philosophy.
- ✅ **PartnersV2 rack (2026-02-22)** — layout re-balanced: rack `lg:col-span-5` (moved slightly left), vendors column `lg:col-span-7` (more breathing room). Right column is now **frameless** (no border/background/padding).
- ✅ **PartnersV2 scatter (2026-02-22)** — pre-interaction shows 8 floating vendor logotypes on a virtual 2×4 grid so tiles **never overlap**. Each slot has an **independent cycle 3.5–6s** with per-slot setTimeout recursion (not synchronised). After hover on any rack slot → scatter is replaced by the picked category grid; scatter never returns.
- ✅ **Real vendor logos (2026-02-22, iter 7)** — 18 brand `.webp` logotypes added to `/app/frontend/public/logos/vendors/` (NetApp, DELL, ASUS, Lenovo, Nutanix, Microsoft, VMware, Commvault, Veeam, ARISTA, HPE, Extreme Networks, Cisco, Brocade, SailPoint, baramundi, Google, AWS). Rendered inside white "pill" tiles in PartnersV2 (scatter + grid) and PartnersSection (marquee). Text fallback preserved for vendors without logo (proxmox, Huawei, Pure Storage, uptime DC, xorux, F5).
- ✅ **PartnersV2 cleanup + monochromatic mode (2026-02-22, iter 8)** — REMOVED scatter/floating/blinking behaviour. Right column now shows **all 6 categories always visible**, transparent bg (no pills, no borders), each vendor group with kicker + rule. All logos are **monochromatic by default** (`filter: grayscale(1) brightness(1.9) contrast(0.7)`, opacity 0.55). Hover a rack slot → matching group gets `.is-highlighted` (full colour), other 5 groups get `.is-dimmed`. Hover individual logo → group-level highlight (same UX linkage). Same monochromatic-by-default + colour-on-hover applied to PartnersSection marquee for consistency.
- ✅ **PartnersV2 flat list (2026-02-22, iter 9)** — before any rack interaction the right column now shows a **flat, deduped list of 23 unique vendors** (no category headers). Each vendor knows its categories (`v.cats: Set`); on rack slot hover the matching vendors get `.is-highlighted` (full colour), the others get `.is-dimmed` (opacity 0.28). Individual vendor hover still works independently (no cross-contamination). Data-testids switched to slug pattern (`vendor-dell`, `vendor-pure-storage`, `vendor-uptime-dc`).
- ✅ **Testing agent** — iter 6 (17/17), iter 7 (11/11), iter 8 (11/11), iter 9 (11/11). All logos HTTP 200, 0 console errors, mobile 390px 0 overflow, hover semantics verified per state.

## Backlog / next actions
- `/app/backend/server.py`, `/app/backend/tests/test_contact_api.py`
- `/app/frontend/src/App.js`, `App.css`
- `/app/frontend/src/i18n/{LanguageContext.jsx, translations.js}`
- `/app/frontend/src/components/Navbar.jsx`
- `/app/frontend/src/components/hero/{HeroSection, HeroCanvas, Datacenter3DScene, DatacenterTopology}.jsx`
- `/app/frontend/src/components/SectionDivider.jsx`
- `/app/frontend/src/components/sections/{AboutSection, TrustedBySection, PortfolioSection, SectorsSection, PartnersV2Section, PartnersSection, ContactSection}.jsx`

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
