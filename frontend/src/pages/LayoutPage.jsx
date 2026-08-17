import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { Copy, Check, ChevronDown, ArrowRight } from "lucide-react";

/**
 * LayoutPage — /layout
 * Zebrane preferowane elementy systemu: paleta „Cyan Core", przycisk
 * „Gradient Primary" i style z Hero. Każda karta ma:
 *   - podgląd na żywo,
 *   - guzik „Kopiuj CSS",
 *   - rozwijany blok z pełnym kodem CSS (też do skopiowania).
 */

const CyanCoreCSS = `/* ===== Paleta „Cyan Core" — aktualny system ===== */
:root {
  --cc-cyan:      #06FFE0;  /* akcent neonowy */
  --cc-aqua:      #00B8D4;  /* drugi kolor gradientu */
  --cc-teal:      #0C5C62;  /* głęboki teal — tekst na jasnym */
  --cc-ink:       #040709;  /* główne tło ciemne */
  --cc-frost:     #F6F9FA;  /* główne tło jasne */
}

/* Główny gradient akcentowy */
.cc-gradient {
  background: linear-gradient(135deg, var(--cc-cyan) 0%, var(--cc-aqua) 100%);
}

/* Tekst z akcentem gradientowym */
.cc-gradient-text {
  background: linear-gradient(135deg, #06FFE0 0%, #00B8D4 100%);
  -webkit-background-clip: text;
          background-clip: text;
  color: transparent;
}`;

const GradientPrimaryCSS = `/* ===== Przycisk „01 Gradient Primary" ===== */
.sc-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  font-family: "Manrope", sans-serif;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.01em;
  line-height: 1;
  border: 1px solid transparent;
  border-radius: 10px;
  cursor: pointer;
  white-space: nowrap;
  background: linear-gradient(135deg, #06FFE0 0%, #00B8D4 100%);
  color: #001B20;
  box-shadow: 0 8px 20px -8px rgba(6, 255, 224, 0.55);
  transition:
    transform 0.2s ease,
    box-shadow 0.25s ease,
    filter 0.25s ease;
}

.sc-btn-primary:hover {
  transform: translateY(-1px);
  filter: brightness(1.05);
  box-shadow: 0 12px 26px -8px rgba(6, 255, 224, 0.75);
}

.sc-btn-primary:active { transform: translateY(0); }
.sc-btn-primary svg    { flex-shrink: 0; }`;

const HeroCSS = `/* ===== Hero — style bazowe (eyebrow, tytuł, gradient accent, CTA) ===== */

/* Kontener sekcji Hero */
.sc-hero {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: linear-gradient(180deg, #040709 0%, #071118 100%);
  color: #E8F4F5;
}

/* Warstwa treści nad canvas / obrazkiem */
.sc-hero-copy {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 6vw;
  z-index: 10;
}

/* Eyebrow — kicker nad tytułem */
.sc-hero-eyebrow {
  display: inline-block;
  font-family: "Manrope", sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: #06FFE0;
  opacity: 0.85;
  margin-bottom: 20px;
}

/* Główny tytuł */
.sc-hero-title {
  font-family: "Manrope", sans-serif;
  font-weight: 800;
  font-size: clamp(36px, 5vw, 72px);
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: #FFFFFF;
  max-width: 20ch;
  margin: 0 0 20px;
}

/* Akcent gradientowy na wybranym słowie */
.sc-hero-accent {
  background: linear-gradient(135deg, #06FFE0 0%, #00B8D4 100%);
  -webkit-background-clip: text;
          background-clip: text;
  color: transparent;
}

/* Subtitle / lead */
.sc-hero-sub {
  font-family: "Manrope", sans-serif;
  font-size: clamp(15px, 1.4vw, 18px);
  line-height: 1.6;
  opacity: 0.78;
  max-width: 52ch;
  margin: 0 0 32px;
}

/* Wiersz CTA */
.sc-hero-cta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* Neonowe linie w tle Hero */
.sc-hero-neon-line {
  position: absolute;
  left: -10%;
  width: 120%;
  height: 1px;
  background: linear-gradient(90deg, transparent, #06FFE0 50%, transparent);
  opacity: 0.7;
  pointer-events: none;
}
.sc-hero-neon-line--a { top: 30%; box-shadow: 0 0 12px rgba(6,255,224,0.6); }
.sc-hero-neon-line--b { top: 66%; box-shadow: 0 0 10px rgba(0,184,212,0.5); }
.sc-hero-neon-line--c { top: 82%; height: 0.6px; }`;

/* Kod przekolorowania Hero — z zielonego na cyan (#06FFE0) */
const HeroRecolorCSS = `# ===== Rekoloryzacja Hero: zielony → cyan (#06FFE0) =====
#
# Podejście: ffmpeg permanentne re-encoding klatek 4K.
# Zielony (~120° na kole HSL) obracamy o +60° → cyan (~180°),
# z podbiciem nasycenia i jasności. Kolor jest zaszyty w plikach
# źródłowych — brak narzutu na klient, spójny wygląd w każdej
# przeglądarce. Wymaga ffmpeg 5.0+.
#
# Uwaga: parametr h= w ffmpeg jest w tej samej skali stopni co
# CSS hue-rotate — 60° to poprawny obrót green→cyan.

# 1) Rekoloryzacja pełnego wideo źródłowego:
ffmpeg -i hero-source-4k.mov \\
       -vf "hue=h=60:s=1.5,eq=brightness=0.08:contrast=1.05" \\
       -c:v libx264 -crf 18 -pix_fmt yuv420p \\
       hero-cyan.mp4

# 2) Ekstrakcja 193 klatek do AVIF (desktop 4K, ~30fps):
ffmpeg -i hero-cyan.mp4 -vf "fps=30,scale=3840:2160" \\
       -c:v libaom-av1 -crf 30 \\
       frames-desktop/frame_%03d.avif

# 3) Wariant mobile 1080p WebP (fallback dla urządzeń < 768px):
ffmpeg -i hero-cyan.mp4 -vf "fps=30,scale=1920:1080" \\
       -c:v libwebp -quality 85 \\
       frames-mobile/frame_%03d.webp

# 4) Sprawdzenie ile klatek zostało wygenerowanych:
ls -1 frames-desktop/*.avif | wc -l    # ⇒ 193
ls -1 frames-mobile/*.webp  | wc -l    # ⇒ 30 (zredukowane dla mobile)`;

/* --------------------------- UI --------------------------- */

const CopyButton = ({ text, label = "Kopiuj CSS" }) => {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try { await navigator.clipboard.writeText(text); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  return (
    <button
      type="button"
      onClick={onCopy}
      className={`lp-copy ${copied ? "is-ok" : ""}`}
      data-testid="lp-copy-btn"
    >
      {copied ? <Check size={14}/> : <Copy size={14}/>}
      {copied ? "Skopiowano" : label}
    </button>
  );
};

const CodeBlock = ({ code }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`lp-code ${open ? "is-open" : ""}`}>
      <button
        type="button"
        className="lp-code__toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        data-testid="lp-code-toggle"
      >
        <ChevronDown size={16} className="lp-code__chev"/>
        <span>{open ? "Ukryj kod" : "Pokaż kod CSS"}</span>
      </button>
      <div className="lp-code__body">
        <div className="lp-code__actions">
          <CopyButton text={code} label="Kopiuj z bloku"/>
        </div>
        <pre className="lp-code__pre"><code>{code}</code></pre>
      </div>
    </div>
  );
};

const Card = ({ n, title, subtitle, code, preview, testid }) => (
  <article className="lp-card" data-testid={testid}>
    <header className="lp-card__head">
      <div>
        <span className="lp-card__num">{String(n).padStart(2, "0")}</span>
        <h2 className="lp-card__title">{title}</h2>
        <p className="lp-card__sub">{subtitle}</p>
      </div>
      <CopyButton text={code}/>
    </header>
    <div className="lp-card__preview">{preview}</div>
    <CodeBlock code={code}/>
  </article>
);

/* --------------------------- Podglądy --------------------------- */

const PalettePreview = () => (
  <div className="lp-palette">
    {[
      { c: "#06FFE0", n: "Cyan neon"  },
      { c: "#00B8D4", n: "Aqua"        },
      { c: "#0C5C62", n: "Deep Teal"   },
      { c: "#040709", n: "Ink"         },
      { c: "#F6F9FA", n: "Frost"       },
    ].map((s) => (
      <button
        key={s.c}
        className="lp-swatch"
        style={{ background: s.c }}
        onClick={() => navigator.clipboard?.writeText(s.c)}
        data-testid={`lp-swatch-${s.c.replace("#","").toLowerCase()}`}
        title={`Kliknij aby skopiować ${s.c}`}
      >
        <span className="lp-swatch__code">{s.c}</span>
        <span className="lp-swatch__name">{s.n}</span>
      </button>
    ))}
    <div className="lp-gradient-bar" title="linear-gradient(135deg, #06FFE0 0%, #00B8D4 100%)">
      <span>linear-gradient(135deg, #06FFE0 → #00B8D4)</span>
    </div>
  </div>
);

const ButtonPreview = () => (
  <div className="lp-btn-preview">
    <button type="button" className="lp-preview-btn" data-testid="lp-preview-btn">
      <span>Sprawdź ofertę</span>
      <ArrowRight size={14}/>
    </button>
  </div>
);

const HeroPreview = () => (
  <div className="lp-hero-preview">
    <span className="lp-hero-preview__eyebrow">Enterprise Infrastructure</span>
    <h3 className="lp-hero-preview__title">
      Serwerownie <span className="lp-hero-preview__accent">bez kompromisów</span>
    </h3>
    <p className="lp-hero-preview__sub">
      NetApp, Cisco, Palo Alto — od projektu do utrzymania produkcji 24/7.
    </p>
    <div className="lp-hero-preview__cta">
      <button className="lp-preview-btn"><span>Umów konsultację</span><ArrowRight size={14}/></button>
      <button className="lp-preview-btn-ghost">Zobacz wdrożenia</button>
    </div>
    <span className="lp-hero-preview__neon lp-hero-preview__neon--a"/>
    <span className="lp-hero-preview__neon lp-hero-preview__neon--b"/>
  </div>
);

/* Podgląd rekoloryzacji — dwa kwadraty obok siebie: „przed" (zielone)
   i „po" (cyan po filtrze hue-rotate). */
const HeroRecolorPreview = () => (
  <div className="lp-recolor" data-testid="lp-recolor-preview">
    <div className="lp-recolor__col">
      <span className="lp-recolor__label">Przed (zielony)</span>
      <div className="lp-recolor__frame lp-recolor__frame--green" />
    </div>
    <div className="lp-recolor__arrow" aria-hidden="true">
      <ArrowRight size={20}/>
      <span>hue=h=60 (ffmpeg)</span>
    </div>
    <div className="lp-recolor__col">
      <span className="lp-recolor__label">Po (cyan)</span>
      <div className="lp-recolor__frame lp-recolor__frame--cyan" />
    </div>
  </div>
);

const LayoutPage = () => (
  <main data-testid="layout-main" className="sc-app lp-page">
    <Navbar />

    <section className="lp-hero">
      <div className="lp-hero__inner">
        <span className="lp-hero__tag">Design System · Layout</span>
        <h1 className="lp-hero__title">
          Preferowane elementy w <span className="lp-hero__accent">jednym miejscu</span>
        </h1>
        <p className="lp-hero__sub">
          Zebrane style, palety i przyciski — gotowe do kopiowania. Każdy element ma podgląd,
          szybki „Kopiuj CSS" oraz rozwijany kod źródłowy.
        </p>
      </div>
    </section>

    <div className="lp-list">
      <Card
        n={1}
        title="Paleta kolorów — Cyan Core"
        subtitle="Aktualny system: cyan → aqua na graficie. Kliknij próbkę aby skopiować hex."
        code={CyanCoreCSS}
        preview={<PalettePreview />}
        testid="lp-card-palette"
      />
      <Card
        n={2}
        title="Przycisk — 01 Gradient Primary"
        subtitle="Bazowy CTA strony: cyan → aqua gradient, ciemny tekst, subtelny lift na hover."
        code={GradientPrimaryCSS}
        preview={<ButtonPreview />}
        testid="lp-card-button"
      />
      <Card
        n={3}
        title="Hero — style bazowe"
        subtitle="Eyebrow · Tytuł z akcentem gradientowym · Subtitle · CTA · Neon lines."
        code={HeroCSS}
        preview={<HeroPreview />}
        testid="lp-card-hero"
      />
      <Card
        n={4}
        title="Hero — rekoloryzacja (zielony → cyan)"
        subtitle="ffmpeg — permanentne re-encoding klatek 4K. Kolor zaszyty w plikach źródłowych, brak narzutu na klient."
        code={HeroRecolorCSS}
        preview={<HeroRecolorPreview />}
        testid="lp-card-recolor"
      />
    </div>
  </main>
);

export default LayoutPage;
