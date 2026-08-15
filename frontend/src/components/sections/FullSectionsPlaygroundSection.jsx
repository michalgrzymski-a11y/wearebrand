import React from "react";
import {
  ArrowRight, Server, Shield, Cpu, Cloud, Database, Zap, Star, Quote,
} from "lucide-react";

/**
 * FullSectionsPlaygroundSection — 10 gotowych układów sekcji
 * do dosypywania na kolejne podstrony. Wystawione na /robocze.
 */

const Section = ({ n, name, theme = "dark", children }) => (
  <div
    className={`fs-wrap fs-wrap--${theme}`}
    data-testid={`fs-wrap-${n}`}
  >
    <div className="fs-header">
      <span className="fs-num">{String(n).padStart(2, "0")}</span>
      <span className="fs-name">{name}</span>
    </div>
    <div className="fs-inner">{children}</div>
  </div>
);

/* 01 — Hero Split */
const HeroSplit = () => (
  <div className="fs-hero-split">
    <div className="fs-hero-split__col">
      <span className="fs-eyebrow">Enterprise Infrastructure</span>
      <h2>Serwerownie zaprojektowane <span className="fs-accent">bez kompromisów</span></h2>
      <p>Od koncepcji, przez sprzęt NetApp/Cisco/Palo Alto, aż po utrzymanie produkcji 24/7.</p>
      <div className="fs-actions">
        <a href="#" className="fs-btn-primary" onClick={(e)=>e.preventDefault()}>Umów konsultację <ArrowRight size={14} /></a>
        <a href="#" className="fs-btn-ghost" onClick={(e)=>e.preventDefault()}>Zobacz wdrożenia</a>
      </div>
    </div>
    <div className="fs-hero-split__media" aria-hidden="true">
      <Server size={80} />
    </div>
  </div>
);

/* 02 — Feature 3-Col */
const Feature3Col = () => (
  <div className="fs-f3">
    {[
      { ic: <Shield size={22} />, t: "Zero Trust",        d: "Warstwowe bezpieczeństwo od sieci do tożsamości." },
      { ic: <Database size={22} />, t: "Storage NetApp",  d: "All-flash macierze dla krytycznych workloadów." },
      { ic: <Cloud size={22} />,  t: "Hybrid Cloud",      d: "Bezpieczne pomosty on-prem ↔ chmura publiczna." },
    ].map((c, i) => (
      <div key={i} className="fs-f3__card">
        <div className="fs-f3__icon">{c.ic}</div>
        <h3>{c.t}</h3>
        <p>{c.d}</p>
      </div>
    ))}
  </div>
);

/* 03 — CTA Banner */
const CtaBanner = () => (
  <div className="fs-cta">
    <div>
      <h2>Gotowy zaprojektować swoją serwerownię?</h2>
      <p>Bezpłatna konsultacja architekta — 45 minut, konkretne rekomendacje.</p>
    </div>
    <a href="#" className="fs-btn-primary" onClick={(e)=>e.preventDefault()}>
      Umów rozmowę <ArrowRight size={14} />
    </a>
  </div>
);

/* 04 — Quote Row (3 testimonials) */
const QuoteRow = () => (
  <div className="fs-quotes">
    {[
      { q: "Wdrożenie NetApp przebiegło bez jednej minuty przestoju.", a: "Marek K.", r: "Head of IT, Bank Polski" },
      { q: "Pierwsza firma która rozumie nasze SLA lepiej niż my sami.", a: "Anna W.", r: "CTO, MediSoft" },
      { q: "Konsolidacja storage cięła nam koszty o 62%.", a: "Tomasz L.", r: "IT Manager, Logistics24" },
    ].map((it, i) => (
      <div key={i} className="fs-quote">
        <Quote size={22} className="fs-quote__mark" />
        <p>{it.q}</p>
        <footer>
          <strong>{it.a}</strong>
          <em>{it.r}</em>
        </footer>
      </div>
    ))}
  </div>
);

/* 05 — Stats Row (4 numbers) */
const StatsRow = () => (
  <div className="fs-stats">
    {[
      { v: "250+", l: "Wdrożeń" },
      { v: "14",   l: "Lat doświadczenia" },
      { v: "99,99%", l: "SLA" },
      { v: "24/7", l: "Monitoring" },
    ].map((s, i) => (
      <div key={i} className="fs-stat">
        <strong>{s.v}</strong>
        <span>{s.l}</span>
      </div>
    ))}
  </div>
);

/* 06 — Split Screen (image + text) */
const SplitScreen = () => (
  <div className="fs-split">
    <div className="fs-split__media" aria-hidden="true"><Cpu size={64} /></div>
    <div className="fs-split__body">
      <span className="fs-eyebrow">Compute Density</span>
      <h2>Więcej mocy w mniejszej szafie.</h2>
      <p>Nowoczesne CPU + smart cooling pozwalają zmieścić 3× więcej rdzeni na jednostkę U.</p>
      <a href="#" className="fs-btn-ghost" onClick={(e)=>e.preventDefault()}>Zobacz specyfikację →</a>
    </div>
  </div>
);

/* 07 — Timeline Vertical */
const TimelineVertical = () => (
  <div className="fs-timeline">
    {[
      { d: "Tydzień 1", t: "Konsultacja", p: "Rozmowa z architektem i mapowanie potrzeb biznesowych." },
      { d: "Tydzień 2-3", t: "Audyt", p: "Analiza istniejącego środowiska i identyfikacja bottlenecków." },
      { d: "Tydzień 4-6", t: "Projekt", p: "Architektura docelowa, dobór sprzętu, kalkulacja TCO." },
      { d: "Tydzień 7-12", t: "Wdrożenie", p: "Instalacja, migracja danych, testy, przekazanie do produkcji." },
    ].map((it, i) => (
      <div key={i} className="fs-tl__row">
        <div className="fs-tl__marker">
          <span className="fs-tl__dot" />
          {i !== 3 && <span className="fs-tl__line" />}
        </div>
        <div className="fs-tl__content">
          <span className="fs-tl__date">{it.d}</span>
          <h3>{it.t}</h3>
          <p>{it.p}</p>
        </div>
      </div>
    ))}
  </div>
);

/* 08 — Bento Grid */
const BentoGrid = () => (
  <div className="fs-bento">
    <div className="fs-bento__tile fs-bento__tile--wide">
      <Zap size={26} />
      <h3>Fast Deploy</h3>
      <p>Od projektu do produkcji w 30 dni — sprawdzona metodologia.</p>
    </div>
    <div className="fs-bento__tile">
      <Shield size={22} />
      <h3>Bezpieczeństwo</h3>
    </div>
    <div className="fs-bento__tile">
      <Database size={22} />
      <h3>Storage</h3>
    </div>
    <div className="fs-bento__tile fs-bento__tile--tall">
      <Server size={26} />
      <h3>Enterprise Hardware</h3>
      <p>NetApp, Cisco, Palo Alto — sprzęt klasy produkcyjnej.</p>
    </div>
    <div className="fs-bento__tile fs-bento__tile--accent">
      <Star size={22} />
      <h3>Wsparcie 24/7</h3>
    </div>
  </div>
);

/* 09 — Pricing 3-tier */
const Pricing3Tier = () => (
  <div className="fs-pricing">
    {[
      { t: "Starter",  p: "1 900",  hi: false, feats: ["Monitoring 8/5", "SLA 99%", "Wsparcie email"] },
      { t: "Business", p: "4 900",  hi: true,  feats: ["Monitoring 24/7", "SLA 99,9%", "Opiekun techniczny"] },
      { t: "Enterprise", p: "Wycena", hi: false, feats: ["Dedykowany zespół", "SLA 99,99%", "On-site engineer"] },
    ].map((tier, i) => (
      <div key={i} className={`fs-price ${tier.hi ? "fs-price--hi" : ""}`}>
        {tier.hi && <span className="fs-price__badge">Najczęściej wybierany</span>}
        <h3>{tier.t}</h3>
        <div className="fs-price__num"><strong>{tier.p}</strong>{tier.p !== "Wycena" && <em>PLN/msc</em>}</div>
        <ul>{tier.feats.map((f, j) => <li key={j}>✓ {f}</li>)}</ul>
        <a href="#" className={tier.hi ? "fs-btn-primary" : "fs-btn-ghost"} onClick={(e)=>e.preventDefault()}>Wybierz</a>
      </div>
    ))}
  </div>
);

/* 10 — Logo Cloud */
const LogoCloud = () => (
  <div className="fs-logos">
    <div className="fs-logos__head">
      <span className="fs-eyebrow">Zaufali nam</span>
      <h2>Liderzy branży od 2010 roku</h2>
    </div>
    <div className="fs-logos__row">
      {["ACME", "Nova", "OrbitOne", "Vertex", "Kernel", "Ridge", "Sonar", "Praxis"].map((n) => (
        <span key={n} className="fs-logo-tile">{n}</span>
      ))}
    </div>
  </div>
);

const LAYOUTS = [
  { n: 1,  name: "Hero Split",         theme: "dark",  R: HeroSplit },
  { n: 2,  name: "Feature 3-Col",      theme: "light", R: Feature3Col },
  { n: 3,  name: "CTA Banner",         theme: "dark",  R: CtaBanner },
  { n: 4,  name: "Quote Row",          theme: "light", R: QuoteRow },
  { n: 5,  name: "Stats Row",          theme: "dark",  R: StatsRow },
  { n: 6,  name: "Split Screen",       theme: "light", R: SplitScreen },
  { n: 7,  name: "Timeline Vertical",  theme: "dark",  R: TimelineVertical },
  { n: 8,  name: "Bento Grid",         theme: "light", R: BentoGrid },
  { n: 9,  name: "Pricing 3-Tier",     theme: "dark",  R: Pricing3Tier },
  { n: 10, name: "Logo Cloud",         theme: "light", R: LogoCloud },
];

const FullSectionsPlaygroundSection = () => (
  <section id="full-sections-playground" data-testid="full-sections-playground" className="fs-section">
    <div className="fs-intro">
      <span className="fs-intro__tag">Sekcje · Propozycje układów</span>
      <h2 className="fs-intro__title">10 gotowych klocków sekcji</h2>
      <p className="fs-intro__sub">Wpadaj każdy z nich do dowolnej podstrony. Ciemne i jasne warianty naprzemiennie.</p>
    </div>
    {LAYOUTS.map((L) => (
      <Section key={L.n} n={L.n} name={L.name} theme={L.theme}>
        <L.R />
      </Section>
    ))}
  </section>
);

export default FullSectionsPlaygroundSection;
