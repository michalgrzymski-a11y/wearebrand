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
- ✅ **Section dividers removed (2026-02-22, iter 15)** — usunięto wszystkie `<SectionDivider>` z App.js. Sekcje płynnie przechodzą jedna w drugą bez przerywnika.
- ✅ **ValuesSection redesign (2026-02-22, iter 15)** — expand-in-place: hover dysku rozszerza go w miejscu (flex-grow 22:0.15), tekst pojawia się WEWNĄTRZ obudowy, pozostałe dyski kompresują się do wąskich pasków. Usunięto info panel pod obudową.
- ✅ **SwitchSection cables (2026-02-22, iter 15)** — z każdego portu wystaje "wkładka" RJ45 (mint boot) + zakrzywiony kabel (SVG) prowadzący do papierowej etykiety z nazwą obszaru rynkowego. Etykiety **zawsze widoczne**, bez potrzeby klikania.
- ✅ **RackServerSection — Cykl życia projektu (2026-02-22, iter 15)** — nowa sekcja: 6 serwerów 1U w vertykalnym stosie reprezentujących fazy współpracy (Audyt, Architektura, PoC, Wdrożenie, Utrzymanie, Rozwój). Ten sam expand-in-place mechanizm.
- ✅ **TapeLibrarySection (2026-02-22, iter 15)** — nowa sekcja lustrzana dla Portfolio: 4 kartridże LTO (Hardware/Security/Software/Services & DC) z kolorowymi kręgosłupami. Hover "wyjmuje" taśmę i pokazuje items list wewnątrz obudowy.
- ✅ **Testing agent** — iter 12 (100% padding fix), iter 13 (100% strukturalne zmiany iter 15), **iter 14 (100% P0 batch: fixed navbar + section-aware theme, powiększone logo/typografia, refab rack front-view, etykiety switcha fizycznie zamocowane do kabli — wszystkie 13 kryteriów zdanych)**. 0 console errors, mobile 390px OK, gap=0 przy etykietach kabli.

## Iteration 14 (2026-02-22) — P0 batch delivered
- **Navbar** (`Navbar.jsx`): teraz `position: fixed` (klasa `sc-nav--fixed`), zawsze widoczny nad każdą sekcją. IntersectionObserver mapuje id sekcji → theme (`dark`/`light`), przełącza klasy `sc-nav--dark`/`sc-nav--light`, wymienia logo (`logo-white.webp` ↔ `logo-black.webp`) i kolor tekstu/CTA. `html { scroll-padding-top: 92px }` zapewnia, że nagłówki sekcji nie chowają się pod navbarem. Logo powiększone do `h-12 md:h-14`.
- **Section H2 scale**: wszystkie sekcje poza Hero podniesione z `text-3xl md:text-5xl` do `text-4xl md:text-6xl` z `leading-[1.02]`.
- **RackServerSection** (`RackServerSection.jsx`): kompletny redesign. Duży front-view serwer 2U z panelem SMARTCLOUT, 24 zatokami dyskowymi (część z LEDami PWR/ACT), pasami wentylacyjnymi, uszami rack-mount i CTA. Po prawej kolumna 4 kart wartości refab (CAPEX, gwarancja, dostępność, ESG). Zero klikalnych komponentów wewnętrznych.
- **SwitchSection labels** (`SwitchSection.jsx`): etykiety `[data-testid=switch-label-*]` przeniesione WEWNĄTRZ `.sc-port__cable` z `top: 100%`, dodany metalowy klip `.sc-port__label-clip` z pinem LED na górze etykiety. Wizualnie i pomiarowo (gap=0 do bottom kabla) etykiety fizycznie chwytają koniec kabla dla wszystkich 6 portów.

## Backlog / next actions
- `/app/backend/server.py`, `/app/backend/tests/test_contact_api.py`
- `/app/frontend/src/App.js`, `App.css`
- `/app/frontend/src/i18n/{LanguageContext.jsx, translations.js}`
- `/app/frontend/src/components/Navbar.jsx`
- `/app/frontend/src/components/hero/{HeroSection, HeroCanvas, Datacenter3DScene, DatacenterTopology}.jsx`
- `/app/frontend/src/components/SectionDivider.jsx`
- `/app/frontend/src/components/sections/{AboutSection, TrustedBySection, PortfolioSection, SectorsSection, PartnersV2Section, PartnersSection, ContactSection}.jsx`

## Recent updates (Feb 2026)
- **GDPR/EU Cookie Consent (5 Feb 2026)** — Full compliance:
  - Bottom banner with 3 equally-weighted actions (Accept all / Reject all / Settings) — EU DSA compliant
  - Preferences modal with 4 categories: Necessary (always on) + Functional + Analytics + Marketing
  - Floating FAB (bottom-right) to reopen preferences at any time
  - Footer link + button in Contact section
  - localStorage key `smartclout_consent_v1` (versioned), fires `sc:consent-change` CustomEvent
  - `sc:open-cookie-settings` CustomEvent to reopen from anywhere
  - Bilingual PL/EN. Files: `/app/frontend/src/components/CookieConsent.jsx`, CSS `.sc-cc-*` in App.css line ~10837
- **Privacy Policy page** at `/polityka-prywatnosci` — Full GDPR/RODO PL policy, 9 sections, PL/EN bilingual. File: `/app/frontend/src/pages/PrivacyPolicyPage.jsx`
- **AboutV2Section** compact 2-col layout — CSS overrides in App.css.
- **SwitchSection** scaled down ~15% — CSS overrides in App.css. Verified via iteration_21.json (100%).
- **Hero Pin & Scrub + Cover (2026-02-12, P0 delivered — re-affirmed after user reverted an autoplay experiment)** — Cinematic two-phase intro:
  1. **SCRUB phase** (`scrollY` 0 → 200vh): Hero pinned via `position: sticky`, intro video (8s, `/public/video/intro.mp4` — 4K source re-encoded to 1920×1080 all-intra H.264 Main L4.0, 6.3MB, 193 keyframes / 193 frames for smooth arbitrary-second seek) scrubs 0 → 100% based on scroll distance. Parallax layers (photo, neon, particles, brackets) bound to scrub progress so they never fly off screen.
  2. **REVEAL phase** (`scrollY` 200vh → 300vh): Video freezes on last frame while Hero stays pinned. Next section (`#values` / Wartości) slides UP from viewport bottom OVER the pinned Hero, thanks to `z-index: 2` + `margin-top: -100vh`.
  3. **Release**: Sticky un-pins once outer 400vh scroller scrolls out, normal scroll continues to Zaufali Nam, Proces, etc.
  - **Root-cause bug fix**: `<main class="sc-app">` had `overflow-x: hidden`, which the CSS spec auto-promotes `overflow-y` from `visible` to `auto` — creating a scroll container that broke `position: sticky` on all descendants. Changed to `overflow-x: clip` (does not promote the other axis).
  - **Smooth scrubbing fix**: intro video re-encoded with `keyint=1:min-keyint=1:no-scenecut=1` so every frame is a keyframe → browser can seek to any `currentTime` without decoding from a distant I-frame. Lerp seek loop lowered damping factor from 0.15 → 0.22 and skip-threshold from 0.02 → 0.008 for tighter response.
  - Files: `/app/frontend/src/components/hero/Hero.jsx`, `/app/frontend/src/App.css` lines 37-42 (.sc-app) and 270-305 (.sc-hero-scroller + .sc-hero-sticky + #values). Verified 100% by testing_agent iteration_22 (fix) and iteration_23 (three-phase).

- **Hero — Copy state machine (2026-02-12)** — Copy 3-state animation:
  - **Copy 3-state machine** driven from `onScroll` in `Hero.jsx`:
    1. `scrollY < 40`  → `.sc-hero-copy--initial` — copy translates to the RIGHT half of the viewport via `.sc-hero-copy__col { margin-left: auto }`.
    2. `progress ∈ (0, 0.94)` → `.sc-hero-copy--hidden` — fades to `opacity: 0; pointer-events: none` so only the video reads during the scrub.
    3. `progress ≥ 0.94` → default state — copy reappears in its normal left-aligned position with buttons.
    CSS transitions: `opacity 350ms ease`, `transform 550ms cubic-bezier(.22, 1, .36, 1)`.
  - Note: Zoom-out (scale 0.8) experiment was reverted per user preference — video stays full-bleed at `scale(1.02)`.

- **UtilityBar (2026-02-12)** — right-side quiet section navigator at `/src/components/UtilityBar.jsx`:
  - Ultra-quiet 6px cyan dots for 7 sections (top, values, trusted, portfolio, savings, partners, contact).
  - Vertical page-progress rail (cyan gradient fill from top based on `window.scrollY / (docH - winH)`).
  - Section index (01/07) + label reveal on `:hover`/`focus-within` with 260ms ease.
  - Active state driven by `IntersectionObserver` with multi-threshold (0/.15/.35/.55/.75/.95) picking highest visibility ratio.
  - Click = smooth-scroll to section, offsetting by fixed navbar height.
  - Hidden below 768px. Mounted in `/src/App.js` Home route.

## Backlog / next actions
- **P1** — Real brand SVG logos for Trusted-By and Partners (once assets provided)
- **P1** — Enable outgoing email on `/api/contact` (SendGrid or Resend) when user provides API key
- **P2** — Admin view at `/admin/messages` with basic auth
- **P2** — Cookie/consent banner (GDPR PL)
- **P2** — Case studies section (strong B2B conversion driver)
- **P3** — SEO: JSON-LD Organization, sitemap.xml, hreflang PL/EN
- **P3** — Blog / knowledge base
- **P3** — Refactor `Datacenter3DScene.jsx` into hooks (currently ~600 lines)
- **P3** — Cleanup obsolete CSS/components: `.sc-svr`, `.sc-part*`, `.sc-fan*`, `.sc-rserv*` (dead after refab redesign), `SectionDivider.jsx`, `SupportChatSection.jsx`, `FuturisticMetric.jsx`

## Test credentials
N/A — the site has no authentication surface.
