import React from "react";

/**
 * ColorPlaygroundSection — 12 propozycji palet i gradientów.
 * Każda karta pokazuje: nazwę palety, 5 kolorów bazowych, gradient full-width,
 * przykładowy CTA + tekst na dwóch tłach (dark + light preview).
 */

const PALETTES = [
  {
    n: 1, name: "Cyan Core",
    desc: "Aktualny system — cyan → aqua na graficie.",
    colors: ["#06FFE0", "#00B8D4", "#0C5C62", "#040709", "#F6F9FA"],
    gradient: "linear-gradient(135deg, #06FFE0 0%, #00B8D4 100%)",
    dark: "#040709", light: "#F6F9FA",
    accent: "#06FFE0", accentTxt: "#001B20",
  },
  {
    n: 2, name: "Mint Ice",
    desc: "Miękka mięta, bardziej stonowana — spokojniejsze CTA.",
    colors: ["#4EE0C8", "#48A4A0", "#0C5C62", "#0A1D22", "#EFF6F5"],
    gradient: "linear-gradient(135deg, #4EE0C8 0%, #48A4A0 100%)",
    dark: "#0A1D22", light: "#EFF6F5",
    accent: "#4EE0C8", accentTxt: "#0A1D22",
  },
  {
    n: 3, name: "Deep Teal",
    desc: "Ciemniejszy teal — bardziej korporacyjny.",
    colors: ["#06FFE0", "#0C5C62", "#053C42", "#02181B", "#E8F0F1"],
    gradient: "linear-gradient(135deg, #0C5C62 0%, #06FFE0 100%)",
    dark: "#02181B", light: "#E8F0F1",
    accent: "#0C5C62", accentTxt: "#E8FCFB",
  },
  {
    n: 4, name: "Electric Blue",
    desc: "Cyan przechodzi w niebieski — techniczny, futurystyczny.",
    colors: ["#06FFE0", "#3B82F6", "#1E3A8A", "#050B1F", "#F3F6FF"],
    gradient: "linear-gradient(135deg, #06FFE0 0%, #3B82F6 100%)",
    dark: "#050B1F", light: "#F3F6FF",
    accent: "#3B82F6", accentTxt: "#FFFFFF",
  },
  {
    n: 5, name: "Neo Green",
    desc: "Cyan-lime — bardziej rzucający się, dobre dla startupów.",
    colors: ["#06FFE0", "#A3FF00", "#3B7A0A", "#0A1F00", "#F6FFEC"],
    gradient: "linear-gradient(135deg, #A3FF00 0%, #06FFE0 100%)",
    dark: "#0A1F00", light: "#F6FFEC",
    accent: "#A3FF00", accentTxt: "#0A1F00",
  },
  {
    n: 6, name: "Aurora",
    desc: "Cyan-fiolet — nowoczesny AI/SaaS look.",
    colors: ["#06FFE0", "#A855F7", "#6D28D9", "#0B0620", "#F5F0FF"],
    gradient: "linear-gradient(135deg, #06FFE0 0%, #A855F7 100%)",
    dark: "#0B0620", light: "#F5F0FF",
    accent: "#A855F7", accentTxt: "#FFFFFF",
  },
  {
    n: 7, name: "Sunset Circuit",
    desc: "Cyan + ciepła pomarańcz — kontrast, energia.",
    colors: ["#06FFE0", "#FF6B35", "#B84517", "#1A0A05", "#FFF3ED"],
    gradient: "linear-gradient(135deg, #06FFE0 0%, #FF6B35 100%)",
    dark: "#1A0A05", light: "#FFF3ED",
    accent: "#FF6B35", accentTxt: "#FFFFFF",
  },
  {
    n: 8, name: "Chrome Mono",
    desc: "Monochromatyczny szary z minimalnym cyan accentem.",
    colors: ["#06FFE0", "#94A3B8", "#475569", "#0F172A", "#F1F5F9"],
    gradient: "linear-gradient(135deg, #64748B 0%, #94A3B8 100%)",
    dark: "#0F172A", light: "#F1F5F9",
    accent: "#06FFE0", accentTxt: "#0F172A",
  },
  {
    n: 9, name: "Coral Warm",
    desc: "Coral + żółty — ciepłe, przyjazne (mniej techniczne).",
    colors: ["#FF6B6B", "#FFD166", "#8A2E2E", "#1F0808", "#FFF6EE"],
    gradient: "linear-gradient(135deg, #FF6B6B 0%, #FFD166 100%)",
    dark: "#1F0808", light: "#FFF6EE",
    accent: "#FF6B6B", accentTxt: "#FFFFFF",
  },
  {
    n: 10, name: "Midnight Amber",
    desc: "Ciemna baza + amber accent — premium enterprise.",
    colors: ["#F59E0B", "#B45309", "#78350F", "#0C0A09", "#FEF7EA"],
    gradient: "linear-gradient(135deg, #F59E0B 0%, #B45309 100%)",
    dark: "#0C0A09", light: "#FEF7EA",
    accent: "#F59E0B", accentTxt: "#0C0A09",
  },
  {
    n: 11, name: "Rose Quartz",
    desc: "Cyan + magenta — feminine tech, mocny akcent.",
    colors: ["#06FFE0", "#EC4899", "#9F1239", "#1B0410", "#FEF0F7"],
    gradient: "linear-gradient(135deg, #EC4899 0%, #06FFE0 100%)",
    dark: "#1B0410", light: "#FEF0F7",
    accent: "#EC4899", accentTxt: "#FFFFFF",
  },
  {
    n: 12, name: "Terminal Green",
    desc: "Retro terminal — hacker/security vibe.",
    colors: ["#00FF41", "#008F11", "#003B00", "#000A00", "#EAF5EA"],
    gradient: "linear-gradient(135deg, #00FF41 0%, #008F11 100%)",
    dark: "#000A00", light: "#EAF5EA",
    accent: "#00FF41", accentTxt: "#000A00",
  },
];

const PaletteCard = ({ p }) => (
  <article
    className="col-card"
    data-testid={`col-card-${p.n}`}
    style={{
      "--acc": p.accent,
      "--acc-txt": p.accentTxt,
      "--dark": p.dark,
      "--light": p.light,
    }}
  >
    <header className="col-card__head">
      <span className="col-card__num">{String(p.n).padStart(2, "0")}</span>
      <div>
        <h3 className="col-card__name">{p.name}</h3>
        <p className="col-card__desc">{p.desc}</p>
      </div>
    </header>

    <div className="col-swatches" role="list" aria-label={`Paleta ${p.name}`}>
      {p.colors.map((c, i) => (
        <button
          key={i}
          type="button"
          className="col-swatch"
          style={{ background: c }}
          data-testid={`col-swatch-${p.n}-${i + 1}`}
          onClick={() => navigator.clipboard?.writeText(c)}
          title={`Kliknij aby skopiować ${c}`}
        >
          <span className="col-swatch__code">{c}</span>
        </button>
      ))}
    </div>

    <div className="col-gradient" style={{ background: p.gradient }}>
      <span className="col-gradient__code">{p.gradient}</span>
    </div>

    <div className="col-preview">
      <div className="col-preview__pane col-preview__pane--dark" style={{ background: p.dark }}>
        <span className="col-preview__tag" style={{ color: p.accent }}>ENTERPRISE</span>
        <h4 style={{ color: "#FFF" }}>Nagłówek testowy</h4>
        <p style={{ color: "rgba(255,255,255,0.7)" }}>Krótki tekst opisowy na ciemnym tle palety.</p>
        <button
          type="button"
          className="col-preview__btn"
          style={{ background: p.gradient, color: p.accentTxt }}
        >Sprawdź ofertę</button>
      </div>
      <div className="col-preview__pane col-preview__pane--light" style={{ background: p.light }}>
        <span className="col-preview__tag" style={{ color: p.accent }}>ENTERPRISE</span>
        <h4 style={{ color: p.dark }}>Nagłówek testowy</h4>
        <p style={{ color: `${p.dark}B3` }}>Krótki tekst opisowy na jasnym tle palety.</p>
        <button
          type="button"
          className="col-preview__btn"
          style={{ background: p.gradient, color: p.accentTxt }}
        >Sprawdź ofertę</button>
      </div>
    </div>
  </article>
);

const ColorPlaygroundSection = () => (
  <section id="color-playground" data-testid="color-playground" className="col-section">
    <div className="col-intro">
      <span className="col-intro__tag">Palety &amp; Gradienty · Propozycje</span>
      <h2 className="col-intro__title">12 propozycji palet</h2>
      <p className="col-intro__sub">
        Każda paleta: 5 kolorów bazowych, gradient akcentowy i podgląd CTA na ciemnym oraz jasnym tle.
        Kliknij na kolor aby skopiować kod hex.
      </p>
    </div>
    <div className="col-grid">
      {PALETTES.map((p) => <PaletteCard key={p.n} p={p} />)}
    </div>
  </section>
);

export default ColorPlaygroundSection;
