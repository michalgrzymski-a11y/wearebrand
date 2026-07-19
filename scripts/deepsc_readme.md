# DEEPsc — Asset Package

Pakiet startowy dla projektu **DEEPsc** (SmartClout w koncepcji "Iceberg Rack").
Cały content jest identyczny z projektem referencyjnym `teal-node-visual`,
warstwa wizualna to filmowe scroll-storytelling z Three.js + GSAP.

## Struktura

```
deepsc-assets/
├── README.md                    ← ten plik
├── i18n/
│   └── translations.json        ← pełny content PL + EN (11 KB)
├── brand/
│   ├── logo-black.webp          ← poziome, czarne (na jasnym tle)
│   ├── logo-white.webp          ← poziome, białe (na ciemnym tle)
│   └── logo-teal.webp           ← w kolorze deep teal
├── clients/
│   ├── azoty.webp, zero.webp, oponeo.webp, sescom.webp,
│   ├── kaufland.webp, cedrob.webp, doz.webp
│   └── itcard.webp              ← ⚠️ białe — CSS: filter: invert(1)
└── hero/
    └── hero-datacenter.jpg      ← fallback / referencja
```

## Instrukcja migracji

1. Utwórz nowy projekt Emergent: **+ New Project → nazwa: `deepsc`**
2. Wgraj ten ZIP w pierwszej wiadomości chatu
3. Wklej "Prompt startowy" (poniżej) — agent zrobi resztę

## Mapowanie plików

| Źródło                        | Cel w nowym projekcie                                |
|-------------------------------|------------------------------------------------------|
| `i18n/translations.json`      | `/app/frontend/src/i18n/translations.js` (jako ESM)  |
| `brand/*.webp`                | `/app/frontend/public/`                              |
| `clients/*.webp`              | `/app/frontend/public/logos/`                        |
| `hero/hero-datacenter.jpg`    | `/app/frontend/public/`                              |

Konwersja translations JSON → ESM:
```js
import translations from "./translations.json";
export { translations };
```

## Paleta kolorów DEEPsc

Bazowa paleta SmartClout + dodatkowe tony głębi (od powierzchni do dna):

| Rola                     | Hex        | Użycie                            |
|--------------------------|------------|-----------------------------------|
| Deep Teal (brand)        | `#0C5C62`  | Nagłówki, CTA, akcenty            |
| Accent Mint (brand)      | `#49ADA5`  | Highlighty, LED, świecenia        |
| Charcoal (brand)         | `#1C2833`  | Body copy                         |
| Surface Ice              | `#E8F4F5`  | Warstwa nad wodą                  |
| Waterline                | `#7CC4C0`  | Linia zmiany strefy               |
| Deep Water               | `#0A3E44`  | Warstwa −20 do −80 m              |
| Abyss                    | `#031316`  | Warstwa −80+ m                    |
| Bioluminescence          | `#7BFFC9`  | Głęboki mint dla efektów świetlnych |

## Typografia

- **Serif editorial**: Fraunces (400 / 400 italic / 500)
- **Sans body**: Manrope (300/400/500/600/700)
- Google Fonts:
  ```
  Manrope:wght@300;400;500;600;700
  Fraunces:opsz,wght,ital@9..144,400;9..144,400,1;9..144,500,1
  ```

## Koncepcja wizualna — Iceberg Rack

Góra lodowa **ma formę serwerowej szafy rack**. Jej korpus prostopadłościenny
schodzi w głąb jak górkę lodową (odwrócona proporcja: 10% nad wodą, 90% pod
wodą). Wewnątrz rack widać szuflady (U-slots), macierze, kable, drivy — im
głębiej, tym gęstsze i bardziej "sekretne" dla klienta.

## Mapa warstw głębi (scroll = nurkowanie)

| Głębokość | Sekcja       | Wizualizacja Iceberg-Rack                            |
|-----------|--------------|------------------------------------------------------|
|   0 m     | HERO         | Czubek rack nad wodą: LED, kable, jeden serwer 1U, słońce w tle |
| −5 m      | ABOUT        | Waterline: przekrój ukazujący pierwsze U-sloty pod wodą + metryki futurystyczne, narracja |
| −25 m     | PORTFOLIO    | Warstwa hardware — drives, macierze, security appliance jako świecące moduły |
| −65 m     | SEKTORY      | Widok szerszy: 6 podwodnych "cel" dla różnych branż (mini-racki obok głównego) |
| −100 m    | TRUSTED BY   | Logotypy klientów na dnie oceanu, bioluminescencja mint |
| −140 m    | PARTNERZY    | Fundament — logotypy dostawców (NetApp/VMware/Cisco/MS) jako kolumny bazowe |
| −180 m    | KONTAKT      | Deep dive CTA: "Zanurkuj z nami" — formularz w abyss |

## Stack technologiczny

```json
{
  "dependencies": {
    "three": "^0.160.0",
    "@react-three/fiber": "^8.15.0",
    "@react-three/drei": "^9.92.0",
    "@react-three/postprocessing": "^2.15.0",
    "gsap": "^3.12.5",
    "@studio-freight/lenis": "^1.0.42",
    "framer-motion": "^11.0.0"
  }
}
```

## Wymagane efekty (must-have)

1. **Lenis smooth scroll** globalnie (60 fps easing)
2. **GSAP ScrollTrigger** dla pinned scenes:
   - Hero pinowany podczas nurkowania czubka rack pod wodę
   - Depth-meter po prawej (fixed) synchronizowany ze scrollem
   - Kamera 3D scrubs = użytkownik "zjeżdża" kamerą w dół
3. **Three.js scene** globalna (fixed w tle):
   - Model szafy rack z proporcją góry lodowej (Blender lub proceduralnie)
   - Water surface shader (waves + refraction)
   - Warstwy koloru + fog zależne od głębokości
   - Bubble particles w warstwie deep-water
   - Bioluminescence emissive na wybranych elementach (LED)
4. **Waterline crossing** — SVG cross-section warstwy na sekcji ABOUT, gdzie
   scroll przekracza linię wody: paleta przełącza się z surface-ice do
   deep-water (transition color grade)
5. **Depth meter** po prawej: `−45 m · KONFIGURACJA`, `−105 m · KLIENCI`
6. **Cursor bubble trail** — subtelne bąbelki podążające za kursorem w
   warstwie −20 m i głębiej
7. **Rack element highlights** — każdy komponent (drive/moduł) podświetla
   się gdy jego sekcja jest aktywna, wypuszcza mint tooltip z spec

## Prompt startowy do wklejenia w nowym projekcie Emergent

```
Zbuduj kinematograficzną stronę korporacyjną DEEPsc dla IT SMARTCLOUT
(integrator infrastruktury IT, partner NetApp) w koncepcji "Iceberg Rack".

METAFORA CENTRALNA
Góra lodowa MA FORMĘ SZAFY RACK. Nad wodą (10%) widać czubek: LED, kable,
serwer 1U — to co widzi konkurencja. Pod wodą (90%) ukryta prawdziwa
głębia infrastruktury. Scroll = nurkowanie. Im głębiej, tym więcej
warstw SmartClout ujawnia (hardware, software, sektory, zaufanie, partnerzy).

Przesłanie: "Konkurencja widzi powierzchnię. My analizujemy to, co ukryte
— żeby doprowadzić infrastrukturę do perfekcji."

STACK
- React + Tailwind + FastAPI + MongoDB
- Three.js + @react-three/fiber + @react-three/drei + @react-three/postprocessing
- GSAP + ScrollTrigger, Lenis (smooth scroll), Framer Motion

CONTENT
Identyczny jak w referencyjnym projekcie SmartClout (dostarczam w ZIP
w folderze i18n/). Sekcje: Hero, O nas, Portfolio Usług, Sektory rynku,
Zaufali nam, Partnerzy, Kontakt (formularz → POST /api/contact → MongoDB
+ e-mail).

MAPA GŁĘBI (scroll top → down)
0 m    HERO         Czubek rack + LED + słońce w tle
−5 m   ABOUT        Waterline, metryki futurystyczne, narracja + 3 filary
−25 m  PORTFOLIO    Warstwa hardware jako świecące moduły w rack
−65 m  SEKTORY      6 mini-racków dla branż wokół głównego rack
−100 m TRUSTED BY   Logotypy klientów na dnie, bioluminescencja mint
−140 m PARTNERZY    Fundament — kolumny bazowe z logotypów dostawców
−180 m KONTAKT      Deep dive CTA + formularz w abyss

EFEKTY MUST-HAVE
- Lenis smooth scroll globalnie
- GSAP ScrollTrigger dla pinned scenes (Hero pinowany podczas zjazdu)
- Three.js scene fixed w tle: rack-iceberg, water shader, fog głębinowy,
  bubble particles, bioluminescence emissive
- Depth meter fixed po prawej (`−45 m · KONFIGURACJA`)
- Waterline crossing: paleta z surface-ice do deep-water
- Cursor bubble trail w warstwach głębinowych
- Highlight komponentów rack synchroniczny ze scroll offset

PALETA
Deep Teal #0C5C62, Accent Mint #49ADA5, Surface Ice #E8F4F5,
Waterline #7CC4C0, Deep Water #0A3E44, Abyss #031316, Bioluminescence #7BFFC9

TYPOGRAFIA
Fraunces (serif italic dla akcentów, metryk) + Manrope (sans body)

ZACZNIJ OD
1. Setup Three.js + R3F + GSAP + Lenis + postprocessing
2. Proceduralny model rack (BoxGeometry + inset details) w proporcji góry
   lodowej + water plane z shader-waves
3. Hero pinowany z depth-meter i scrollem "zjeżdżającym" kamerą pod wodę
4. Warstwa ABOUT z waterline crossing + narracja z assetów
5. Kolejne sekcje analogicznie zgodnie z mapą głębi
```

## Uwagi implementacyjne

- **Wydajność**: Three.js scene fixed jednorazowo, sekcje overlay HTML nad
  canvas. Unikaj re-mountowania sceny — sterujemy kamerą przez ref + gsap.
- **Fallback mobilny**: na małych ekranach zamień shader-water na static
  gradient background + statyczny SVG cross-section rack. Trzymaj 60 fps.
- **Preload**: bubble textures, drive models, logo webp — wszystko
  pre-loaded w Loader przed pierwszym reveal.
- **Accessibility**: `prefers-reduced-motion` respektujemy — wyłączaj
  autoplay animations i skomplikowane scrub effects.

Powodzenia w DEEPsc! 🚀
