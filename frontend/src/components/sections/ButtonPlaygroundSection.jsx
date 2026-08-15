import React from "react";
import { ArrowRight, ArrowUpRight, ChevronRight, Download, Play, Send, Plus, Sparkles, Zap, Terminal } from "lucide-react";

/**
 * ButtonPlaygroundSection — 20 propozycji przycisków w dwóch wariantach:
 *   1) sekcja jasna  (background: #F5F8F9)
 *   2) sekcja ciemna (background: #040709)
 * Każdy przycisk to inna estetyka pasująca do cyanowego layoutu strony.
 * Wystawione tylko na podstronie /robocze do wyboru docelowego stylu CTA.
 */

const BUTTONS = [
  { n: 1,  label: "Gradient Primary",   cls: "bp-btn bp-btn--1",  icon: <ArrowRight size={14} /> },
  { n: 2,  label: "Ghost Outline",      cls: "bp-btn bp-btn--2",  icon: <ArrowRight size={14} /> },
  { n: 3,  label: "Solid Cyan Flat",    cls: "bp-btn bp-btn--3",  icon: <ArrowRight size={14} /> },
  { n: 4,  label: "Neon Pill",          cls: "bp-btn bp-btn--4",  icon: <Sparkles size={14} /> },
  { n: 5,  label: "Sharp Cyan",         cls: "bp-btn bp-btn--5",  icon: <ChevronRight size={14} /> },
  { n: 6,  label: "Sharp Ghost",        cls: "bp-btn bp-btn--6",  icon: <ChevronRight size={14} /> },
  { n: 7,  label: "Underline CTA",      cls: "bp-btn bp-btn--7",  icon: null },
  { n: 8,  label: "Arrow Link",         cls: "bp-btn bp-btn--8",  icon: <ArrowUpRight size={14} /> },
  { n: 9,  label: "Cyan Chip",          cls: "bp-btn bp-btn--9",  icon: null },
  { n: 10, label: "Icon Circle",        cls: "bp-btn bp-btn--10 bp-btn--icon", icon: <Play size={16} />, text: "" },
  { n: 11, label: "Split Button",       cls: "bp-btn bp-btn--11", icon: <ArrowRight size={14} /> },
  { n: 12, label: "HUD Bracketed",      cls: "bp-btn bp-btn--12", icon: null },
  { n: 13, label: "Glass Blur",         cls: "bp-btn bp-btn--13", icon: <Download size={14} /> },
  { n: 14, label: "Glow Halo",          cls: "bp-btn bp-btn--14", icon: <Zap size={14} /> },
  { n: 15, label: "Dashed Border",      cls: "bp-btn bp-btn--15", icon: <Plus size={14} /> },
  { n: 16, label: "Terminal >",         cls: "bp-btn bp-btn--16", icon: null },
  { n: 17, label: "Elevated Card",      cls: "bp-btn bp-btn--17", icon: <ArrowRight size={14} /> },
  { n: 18, label: "Gradient Border",    cls: "bp-btn bp-btn--18", icon: <ArrowRight size={14} /> },
  { n: 19, label: "Duotone Split",      cls: "bp-btn bp-btn--19", icon: <Send size={14} /> },
  { n: 20, label: "Massive Hero CTA",   cls: "bp-btn bp-btn--20", icon: <ArrowRight size={16} /> },
];

const renderButton = (b) => {
  if (b.n === 10) {
    return (
      <button
        type="button"
        className={b.cls}
        aria-label={b.label}
        data-testid={`bp-btn-${b.n}`}
      >
        {b.icon}
      </button>
    );
  }
  if (b.n === 11) {
    return (
      <button type="button" className={b.cls} data-testid={`bp-btn-${b.n}`}>
        <span className="bp-btn__main">Sprawdź</span>
        <span className="bp-btn__sep" aria-hidden="true" />
        <span className="bp-btn__side">{b.icon}</span>
      </button>
    );
  }
  if (b.n === 12) {
    return (
      <button type="button" className={b.cls} data-testid={`bp-btn-${b.n}`}>
        <span className="bp-btn__bracket bp-btn__bracket--l" aria-hidden="true" />
        <span>Sprawdź ofertę</span>
        <span className="bp-btn__bracket bp-btn__bracket--r" aria-hidden="true" />
      </button>
    );
  }
  if (b.n === 16) {
    return (
      <button type="button" className={b.cls} data-testid={`bp-btn-${b.n}`}>
        <Terminal size={13} />
        <span className="bp-btn__prompt">&gt;_</span>
        <span>run consult</span>
      </button>
    );
  }
  return (
    <button type="button" className={b.cls} data-testid={`bp-btn-${b.n}`}>
      <span>Sprawdź ofertę</span>
      {b.icon}
    </button>
  );
};

const Panel = ({ theme, title, subtitle }) => (
  <div
    className={`bp-panel bp-panel--${theme}`}
    data-testid={`bp-panel-${theme}`}
  >
    <div className="bp-panel__inner">
      <div className="bp-panel__head">
        <span className="bp-panel__tag">Przycisk · Propozycje</span>
        <h2 className="bp-panel__title">{title}</h2>
        <p className="bp-panel__sub">{subtitle}</p>
      </div>
      <div className="bp-grid">
        {BUTTONS.map((b) => (
          <div key={b.n} className="bp-cell" data-testid={`bp-cell-${theme}-${b.n}`}>
            <div className="bp-cell__btn">{renderButton(b)}</div>
            <div className="bp-cell__label">
              <span className="bp-cell__num">{String(b.n).padStart(2, "0")}</span>
              <span className="bp-cell__name">{b.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ButtonPlaygroundSection = () => (
  <section
    id="button-playground"
    data-testid="button-playground"
    className="bp-section"
  >
    <Panel
      theme="light"
      title="Warianty na jasnym tle"
      subtitle="Wybierz styl przycisku który najlepiej pasuje do sekcji na białym."
    />
    <Panel
      theme="dark"
      title="Warianty na ciemnym tle"
      subtitle="Ten sam zestaw na tle Hero/serwerowni — spójny z aktualnym layoutem."
    />
  </section>
);

export default ButtonPlaygroundSection;
