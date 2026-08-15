import React, { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, TrendingDown, TrendingUp, Recycle, KeySquare, GaugeCircle, LineChart, Sparkles, ArrowRight, Plus, Minus } from "lucide-react";

/**
 * Trzy alternatywne wersje sekcji „Optymalizacja kosztów" — do wyboru.
 * Każda wersja to samodzielny komponent eksportowany osobno.
 * Cel: klient od razu widzi „-30% niższy TCO", mało tekstu, dużo wizualizacji.
 */

/* Helper: counter animation on scroll into view */
const useCountUp = (target = 30, duration = 1600) => {
  const ref = useRef(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf, start;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !start) {
        start = performance.now();
        const step = (t) => {
          const p = Math.min(1, (t - start) / duration);
          setVal(Math.round(target * (1 - Math.pow(1 - p, 3))));
          if (p < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [target, duration]);
  return [ref, val];
};

/* Mouse-drift parallax hook — moves layers slightly with cursor */
const useDrift = () => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const dx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      const dy = ((e.clientY - r.top)  / r.height - 0.5) * 2;
      el.style.setProperty("--dx", dx.toFixed(3));
      el.style.setProperty("--dy", dy.toFixed(3));
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);
  return ref;
};

/* ==========================================================================
   Wersja 1 — „BIG BANG -30%"
   Ogromne -30% jako centrum, strzałka w dół pulsuje, 4 ikony jako mikro-filary
   ========================================================================== */
export const SavingsV1 = () => {
  const [countRef, val] = useCountUp(30, 1600);
  const driftRef = useDrift();
  return (
    <section className="sv1" data-testid="savings-v1" ref={driftRef}>
      {/* Parallax layers */}
      <div className="sv1__layer sv1__layer--a" aria-hidden="true" />
      <div className="sv1__layer sv1__layer--b" aria-hidden="true" />

      <div className="sv1__inner">
        <span className="sv1__eyebrow">Optymalizacja kosztów</span>

        <div ref={countRef} className="sv1__hero">
          <ArrowDown size={80} className="sv1__arrow" strokeWidth={2.5} aria-hidden="true" />
          <div className="sv1__number-wrap">
            <span className="sv1__minus">−</span>
            <span className="sv1__number">{val}</span>
            <span className="sv1__pct">%</span>
          </div>
          <p className="sv1__label">niższy koszt TCO po audycie SMARTCLOUT</p>
        </div>

        <div className="sv1__pillars">
          {[
            { Icon: Recycle,     label: "Refab enterprise" },
            { Icon: KeySquare,   label: "Optymalizacja licencji" },
            { Icon: GaugeCircle, label: "Lifecycle sprzętu" },
            { Icon: LineChart,   label: "Rightsizing" },
          ].map((p, i) => (
            <div key={i} className="sv1__pill" data-testid={`sv1-pill-${i}`}>
              <p.Icon size={20} strokeWidth={2}/>
              <span>{p.label}</span>
            </div>
          ))}
        </div>

        <a href="#contact" className="sv1__cta" data-testid="sv1-cta">
          Umów audyt kosztów IT <ArrowRight size={16}/>
        </a>
      </div>
    </section>
  );
};

/* ==========================================================================
   Wersja 2 — „PRZED / PO" Split
   Dwie kolumny z animowanymi słupkami: PRZED 100% ↑ czerwone, PO 70% ↓ cyan
   ========================================================================== */
export const SavingsV2 = () => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <section className="sv2" data-testid="savings-v2" ref={ref}>
      <div className="sv2__inner">
        <div className="sv2__head">
          <span className="sv2__eyebrow">Optymalizacja kosztów</span>
          <h2>Ten sam sprzęt. <span className="sv2__accent">-30% niższy rachunek.</span></h2>
        </div>

        <div className="sv2__viz">
          <div className={`sv2__col sv2__col--before ${inView ? "is-in" : ""}`} data-testid="sv2-before">
            <span className="sv2__col-label">PRZED</span>
            <div className="sv2__bar sv2__bar--red">
              <span className="sv2__bar-value">100%</span>
              <ArrowUp size={24} className="sv2__bar-arrow" />
            </div>
            <p className="sv2__col-note">Ceny listy vendorów<br/>Wysokie OPEX, spirala licencji</p>
          </div>

          <div className="sv2__equal">
            <span className="sv2__equal-txt">SMARTCLOUT</span>
            <ArrowRight size={40}/>
          </div>

          <div className={`sv2__col sv2__col--after ${inView ? "is-in" : ""}`} data-testid="sv2-after">
            <span className="sv2__col-label">PO</span>
            <div className="sv2__bar sv2__bar--cyan">
              <span className="sv2__bar-value">70%</span>
              <ArrowDown size={24} className="sv2__bar-arrow" />
            </div>
            <p className="sv2__col-note">Refab + rightsizing<br/>Zoptymalizowane licencje</p>
          </div>
        </div>

        <div className="sv2__mini">
          {[
            { v: "-30%", l: "TCO" },
            { v: "-40%", l: "Licencje" },
            { v: "-25%", l: "Energia" },
            { v: "-50%", l: "Nowy sprzęt vs refab" },
          ].map((m, i) => (
            <div key={i} className="sv2__mini-item">
              <strong>{m.v}</strong>
              <span>{m.l}</span>
            </div>
          ))}
        </div>

        <a href="#contact" className="sv2__cta">Zobacz oszczędności dla Twojej firmy <ArrowRight size={16}/></a>
      </div>
    </section>
  );
};

/* ==========================================================================
   Wersja 3 — „GAUGE + Ticker"
   Kołowy wskaźnik napełniający się do -30% + ticker z kolejnymi statystykami
   ========================================================================== */
export const SavingsV3 = () => {
  const [gRef, val] = useCountUp(30, 2000);
  const R = 90; // radius
  const CIRC = 2 * Math.PI * R;
  const offset = CIRC * (1 - val / 100);
  return (
    <section className="sv3" data-testid="savings-v3">
      <div className="sv3__grid">
        <div className="sv3__left">
          <span className="sv3__eyebrow">Optymalizacja kosztów</span>
          <h2>
            Więcej z każdej złotówki. <br/>
            <span className="sv3__accent">Mniej wydatków każdego roku.</span>
          </h2>
          <div className="sv3__stats">
            {[
              { Icon: TrendingDown, v: "-30%", l: "TCO w 12 miesięcy" },
              { Icon: TrendingDown, v: "-40%", l: "OPEX licencyjny" },
              { Icon: TrendingUp,   v: "+3×",  l: "ROI z audytu" },
              { Icon: Sparkles,     v: "0 zł", l: "audyt wstępny" },
            ].map((s, i) => (
              <div key={i} className="sv3__stat">
                <s.Icon size={16}/><strong>{s.v}</strong><span>{s.l}</span>
              </div>
            ))}
          </div>
          <a href="#contact" className="sv3__cta">Zamów bezpłatny audyt <ArrowRight size={16}/></a>
        </div>

        <div className="sv3__right" ref={gRef}>
          <svg className="sv3__gauge" viewBox="0 0 220 220" aria-hidden="true">
            <defs>
              <linearGradient id="sv3-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%"  stopColor="#06FFE0"/>
                <stop offset="100%" stopColor="#00B8D4"/>
              </linearGradient>
            </defs>
            <circle cx="110" cy="110" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12"/>
            <circle
              cx="110" cy="110" r={R} fill="none" stroke="url(#sv3-grad)" strokeWidth="12"
              strokeLinecap="round"
              transform="rotate(-90 110 110)"
              style={{
                strokeDasharray: CIRC,
                strokeDashoffset: offset,
                transition: "stroke-dashoffset 400ms linear",
              }}
            />
            <text x="110" y="106" textAnchor="middle" className="sv3__gauge-num">−{val}%</text>
            <text x="110" y="132" textAnchor="middle" className="sv3__gauge-lbl">TCO</text>
          </svg>

          <div className="sv3__ticker" aria-hidden="true">
            <div className="sv3__ticker-track">
              {["-30% TCO", "-40% Licencje", "-25% Energia", "-50% Sprzęt vs. nowy", "+3× ROI",
                "-30% TCO", "-40% Licencje", "-25% Energia", "-50% Sprzęt vs. nowy", "+3× ROI"].map((t, i) => (
                <span key={i} className="sv3__ticker-item">{t} <span className="sv3__ticker-sep">·</span></span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* Wspólne dane treściowe dla V4-V6 (zachowujemy pełny content) */
const PILLARS_FULL = [
  { id: "refab",     Icon: Recycle,     title: "Refabrykowany hardware enterprise",
    desc: "Certyfikowane serwery, macierze i przełączniki z pełną gwarancją, w cenie ułamka listy producenta. Ta sama wydajność, dostępność od ręki." },
  { id: "license",   Icon: KeySquare,   title: "Konsolidacja i optymalizacja licencji",
    desc: "Audyt subskrypcji, downgrade nadmiarowych edycji, migracja do właściwych metryk. W wielu przypadkach redukcja OPEX o kilkadziesiąt procent." },
  { id: "lifecycle", Icon: GaugeCircle, title: "Zarządzanie cyklem życia sprzętu",
    desc: "Kupujemy, odsprzedajemy i redystrybuujemy sprzęt tak, by amortyzacja i moment wymiany były pod kontrolą, a nie narzucone przez producenta." },
  { id: "rightsize", Icon: LineChart,   title: "Monitoring i rightsizing",
    desc: "Realne metryki obciążenia zamiast przewymiarowanych projektów. Skalujemy zasoby dokładnie do potrzeb — bez przepłacania na zapas." },
];

const SUBTITLE_FULL = "W dobie dwu/trzycyfrowych wzrostów cen sprzętu enterprise, tradycyjne podejście do zakupów IT przestaje się opłacać. Patrzymy na budżet IT szerzej niż przez pryzmat samej wyceny — projektujemy rozwiązania tak, aby realnie chronić Twój kapitał.";

/* Wersja 4 — Accordion progressive disclosure */
export const SavingsV4 = () => {
  const [open, setOpen] = useState("refab");
  return (
    <section className="sv4" data-testid="savings-v4">
      <div className="sv4__grid">
        <aside className="sv4__aside">
          <span className="sv4__eyebrow">Optymalizacja kosztów</span>
          <h2>Ceny rosną. <span className="sv4__accent">Twój rachunek nie musi.</span></h2>
          <div className="sv4__metric">
            <span className="sv4__metric-kicker">TCO</span>
            <strong className="sv4__metric-val">−30%</strong>
            <span className="sv4__metric-lbl">typowa oszczędność po audycie SMARTCLOUT</span>
          </div>
          <a href="#contact" className="sv4__cta">Umów audyt <ArrowRight size={14}/></a>
        </aside>
        <div className="sv4__accordion">
          <p className="sv4__lead">{SUBTITLE_FULL}</p>
          {PILLARS_FULL.map((p) => {
            const isOpen = open === p.id;
            return (
              <div key={p.id} className={`sv4__row ${isOpen ? "is-open" : ""}`} data-testid={`sv4-row-${p.id}`}>
                <button type="button" className="sv4__row-head"
                  onClick={() => setOpen(isOpen ? null : p.id)} aria-expanded={isOpen}>
                  <span className="sv4__row-icon"><p.Icon size={20}/></span>
                  <span className="sv4__row-title">{p.title}</span>
                  <span className="sv4__row-toggle">{isOpen ? <Minus size={18}/> : <Plus size={18}/>}</span>
                </button>
                <div className="sv4__row-body"><p>{p.desc}</p></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* Wersja 5 — Tabs Switcher (widoczny 1 filar naraz) */
export const SavingsV5 = () => {
  const [active, setActive] = useState(0);
  const p = PILLARS_FULL[active];
  return (
    <section className="sv5" data-testid="savings-v5">
      <div className="sv5__head">
        <span className="sv5__eyebrow">Optymalizacja kosztów</span>
        <h2>Ceny rosną. <span className="sv5__accent">Twój rachunek nie musi.</span></h2>
        <p className="sv5__lead">{SUBTITLE_FULL}</p>
      </div>
      <div className="sv5__grid">
        <div className="sv5__metric-col">
          <div className="sv5__metric">
            <span className="sv5__metric-kicker">TCO</span>
            <strong className="sv5__metric-val">−30%</strong>
            <span className="sv5__metric-lbl">po audycie SMARTCLOUT</span>
          </div>
          <ul className="sv5__tabs">
            {PILLARS_FULL.map((it, i) => (
              <li key={it.id}>
                <button type="button" className={`sv5__tab ${i === active ? "is-active" : ""}`}
                  onClick={() => setActive(i)} data-testid={`sv5-tab-${it.id}`}>
                  <span className="sv5__tab-num">0{i+1}</span>
                  <it.Icon size={18}/>
                  <span className="sv5__tab-title">{it.title}</span>
                  <ArrowRight size={14} className="sv5__tab-arrow"/>
                </button>
              </li>
            ))}
          </ul>
          <a href="#contact" className="sv5__cta">Umów audyt kosztów IT <ArrowRight size={14}/></a>
        </div>
        <div className="sv5__panel" key={p.id} data-testid={`sv5-panel-${p.id}`}>
          <div className="sv5__panel-visual" aria-hidden="true"><p.Icon size={96} strokeWidth={1.2}/></div>
          <span className="sv5__panel-tag">{`Filar 0${active+1} / 04`}</span>
          <h3 className="sv5__panel-title">{p.title}</h3>
          <p className="sv5__panel-desc">{p.desc}</p>
        </div>
      </div>
    </section>
  );
};

/* Wersja 6 — Bento asymmetric layout */
export const SavingsV6 = () => (
  <section className="sv6" data-testid="savings-v6">
    <div className="sv6__inner">
      <div className="sv6__intro">
        <span className="sv6__eyebrow">Optymalizacja kosztów</span>
        <h2>Ceny rosną. <span className="sv6__accent">Twój rachunek nie musi.</span></h2>
        <p className="sv6__lead">{SUBTITLE_FULL}</p>
      </div>
      <div className="sv6__grid">
        <div className="sv6__tile sv6__tile--metric" data-testid="sv6-metric">
          <span className="sv6__t-kicker">TCO</span>
          <strong className="sv6__t-val">−30%</strong>
          <ArrowDown size={26} className="sv6__t-arrow"/>
          <span className="sv6__t-lbl">typowa oszczędność po audycie</span>
        </div>
        {PILLARS_FULL.map((p, i) => (
          <article key={p.id} className={`sv6__tile sv6__tile--pillar sv6__tile--${i}`} data-testid={`sv6-pillar-${p.id}`}>
            <span className="sv6__t-num">0{i+1}</span>
            <div className="sv6__t-icon"><p.Icon size={22}/></div>
            <h3 className="sv6__t-title">{p.title}</h3>
            <p className="sv6__t-desc">{p.desc}</p>
          </article>
        ))}
        <a href="#contact" className="sv6__tile sv6__tile--cta" data-testid="sv6-cta">
          <span>Umów audyt kosztów IT</span>
          <ArrowRight size={20}/>
        </a>
      </div>
    </div>
  </section>
);



const SavingsVariantsSection = () => (
  <section className="sv-variants" data-testid="savings-variants">
    <div className="sv-variants__intro">
      <span className="sv-variants__tag">Sekcja „Optymalizacja kosztów" · 6 propozycji</span>
      <h2>Wybierz wersję która najlepiej sprzedaje wartość</h2>
      <p>V1-V3: minimum tekstu, wizualny impakt. V4-V6: pełna treść ale wizualnie odciążona.</p>
    </div>
    <div className="sv-variants__list">
      <div className="sv-variants__item"><span className="sv-variants__num">01 · Big Bang -30%</span><SavingsV1/></div>
      <div className="sv-variants__item"><span className="sv-variants__num">02 · Przed / Po</span><SavingsV2/></div>
      <div className="sv-variants__item"><span className="sv-variants__num">03 · Gauge + Ticker</span><SavingsV3/></div>
      <div className="sv-variants__item"><span className="sv-variants__num">04 · Accordion</span><SavingsV4/></div>
      <div className="sv-variants__item"><span className="sv-variants__num">05 · Tabs Switcher</span><SavingsV5/></div>
      <div className="sv-variants__item"><span className="sv-variants__num">06 · Bento Layout</span><SavingsV6/></div>
    </div>
  </section>
);

export default SavingsVariantsSection;
