# SmartClout — Asset Package

Kompletny pakiet zasobów do zaimportowania w nowym projekcie Emergent
(wariant z efektem dot-particle Three.js).

## Struktura

```
smartclout-assets/
├── README.md                    ← ten plik
├── i18n/
│   └── translations.json        ← pełny content PL + EN (11 KB)
├── brand/
│   ├── logo-black.webp          ← logo poziome, czarne (na jasnym tle)
│   ├── logo-white.webp          ← logo poziome, białe (na ciemnym tle)
│   └── logo-teal.webp           ← logo w kolorze deep teal
├── clients/
│   ├── azoty.webp               ← Grupa Azoty
│   ├── zero.webp                ← Kanał Zero
│   ├── oponeo.webp              ← Oponeo
│   ├── sescom.webp              ← Sescom Group
│   ├── kaufland.webp            ← Kaufland (horyzontalne)
│   ├── cedrob.webp              ← Cedrob
│   ├── doz.webp                 ← DOZ.pl
│   └── itcard.webp              ← IT CARD SA (białe — użyj CSS `filter: invert(1)`)
└── hero/
    └── hero-datacenter.jpg      ← domyślne tło Hero (jeśli nie używasz 100% dot-particle)
```

## Instrukcja migracji do nowego projektu Emergent

1. **Wgraj pakiet** — po utworzeniu nowego projektu Emergent, w oknie chatu
   przeciągnij ten ZIP (bądź poszczególne foldery) do wiadomości.

2. **Rozpakuj do struktury projektu**:

   | Źródło                        | Cel w nowym projekcie                                |
   |-------------------------------|------------------------------------------------------|
   | `i18n/translations.json`      | `/app/frontend/src/i18n/translations.js` (jako ESM export) |
   | `brand/*.webp`                | `/app/frontend/public/`                              |
   | `clients/*.webp`              | `/app/frontend/public/logos/`                        |
   | `hero/hero-datacenter.jpg`    | `/app/frontend/public/`                              |

3. **Konwersja `translations.json` → `translations.js`**:
   Na początku pliku dodaj `export const translations = ` i średnik na końcu.
   Można też zaimportować JSON bezpośrednio:
   ```js
   import translations from "./translations.json";
   export { translations };
   ```

## Paleta kolorów (obowiązująca)

| Rola              | Hex        | Użycie                          |
|-------------------|------------|---------------------------------|
| Deep Teal         | `#0C5C62`  | Nagłówki, akcenty, przyciski    |
| Accent Mint       | `#49ADA5`  | Highlighty, linie, dot-particle |
| Dark Charcoal     | `#1C2833`  | Body copy                       |
| Ink (Hero BG)     | `#040709`  | Ciemna sekcja Hero              |
| Light BG          | `#F8FAFA`  | Trusted By tło                  |
| White             | `#FFFFFF`  | Główne sekcje                   |

## Typografia

- **Serif editorial** (metryki, akcenty): **Fraunces** (weight 400, italic)
- **Sans body**: **Manrope** (300/400/600/700)
- Ładowanie: Google Fonts — `Manrope:wght@300;400;500;600;700` i
  `Fraunces:opsz,wght,ital@9..144,400;9..144,400,1;9..144,500,1`

## Kluczowe elementy wizualne do zaimplementowania w Three.js

Wszystkie ikony renderowane jako **point cloud** (~3000–8000 kropek):

| Sekcja        | Kształt dot-particle                         | Sugerowana liczba pkt |
|---------------|----------------------------------------------|-----------------------|
| Hero          | Serwer rack ↔ macierz dyskowa (morphing)     | 6000                  |
| About         | Kompas / warstwy / target (3 filary)         | 4000                  |
| Portfolio     | Server rack / tarcza / kod / chmura          | 3000 × 4              |
| Sektory       | Torba, gazeta, fabryka, bank, wieża, budynek | 2500 × 6              |
| Trusted By    | Bez particle — realne logotypy klientów      | —                     |
| Partnerzy     | Bez particle — logotypy dostawców            | —                     |
| Kontakt       | Sygnał / fala z kropek                       | 4000                  |

Rekomendowany stack: `three` + `@react-three/fiber` + `@react-three/drei` +
`@react-three/postprocessing` (Bloom).
