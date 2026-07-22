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
- ✅ **Real vendor logos (2026-02-22, iter 7)** — 18 brand `.webp` logotypes added to `/app/frontend/public/logos/vendors/`. Text fallback preserved for vendors without logo.
- ✅ **PartnersV2 cleanup + monochromatic mode (2026-02-22, iter 8)** — REMOVED scatter; groups always visible; monochromatic default + full colour on hover / rack-slot pick.
- ✅ **PartnersV2 flat list (2026-02-22, iter 9)** — before rack interaction: flat deduped 23-vendor list, no category headers; on rack hover: matching vendors highlighted, others dimmed.
- ✅ **PartnersV2 responsive grid mode (2026-02-22, iter 10)** — on rack hover switch flat list to responsive category-scoped grid with larger logos (44px) + category header (icon + label + rule + count badge).
- ✅ **Partner sub-pages (2026-02-22, iter 11)** — new `/partners/:slug` route + `PartnerDetailPage` component + 23-vendor catalogue in `/app/frontend/src/data/partners.js` (PL + EN content: tier, tagline, intro, highlights, products). Every vendor tile in PartnersV2 is a `<Link>` — clickable in both default and category states.
- ✅ **PartnersV2 always-grid + click-lock (2026-02-22, iter 12)** — default state now uses the same grid layout (bigger logos) but shows ALL unique vendors without category grouping. Clicking a rack slot **locks** the category (persistent filter until re-click); hover still previews. Clicking a vendor in the locked state opens the partner sub-page.
- ✅ **ValuesSection (2026-02-22, iter 13)** — new section between Hero and About: horizontal 12-bay disk shelf inspired by NetApp FAS A30. Four value-drives (Kompetencje, Obsługa, Partnerstwa, Zaufanie) with icons + activity LEDs; hover pulls the drive out and reveals the value name + short description in a dedicated read-out panel. Full PL + EN copy.
- ✅ **SwitchSection (2026-02-22, iter 13)** — new section after SectorsSection: 1U 6-port network switch. Each RJ45 port represents one market sector (Finance / Services / Industry / Telecom / Media / Government). Hover lights up link + activity LEDs, glows the port and updates a read-out panel with sector name + copy. Click locks a port; second click unlocks.
- ✅ **Testing agent** — iter 6 (17/17), iter 7 (11/11), iter 8 (11/11), iter 9 (11/11), iter 10-11 superseded, iter 12-13 verified via screenshot (both new visualisations render correctly in default and hover states; page-flow with new sections + dividers has no regressions).

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
