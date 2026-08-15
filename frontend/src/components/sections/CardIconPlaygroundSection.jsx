import React from "react";
import {
  Server, Shield, Database, Cpu, Cloud, Lock, Zap, Layers,
  Network, HardDrive, Radar, Gauge, Rocket, Star, ArrowRight,
} from "lucide-react";

/**
 * CardIconPlaygroundSection — biblioteka 20 kart + 15 stylów ikon
 * w dwóch tłach (jasne + ciemne), spójna z cyanowym layoutem.
 * Klasy: cp-* (cards) i ip-* (icons).
 */

/* ============================ CARDS (20) ============================ */
const CARDS = [
  { n: 1, name: "Feature Basic",
    render: () => (
      <div className="cp-card cp-card--1">
        <div className="cp-icon"><Server size={22} /></div>
        <h4>NetApp AFF</h4>
        <p>Macierze all-flash klasy enterprise dla krytycznych workloadów.</p>
      </div>
    )},
  { n: 2, name: "Border-Left Accent",
    render: () => (
      <div className="cp-card cp-card--2">
        <h4>Ciągłość biznesowa</h4>
        <p>Projektujemy tak, by usługi działały nawet gdy jedno ogniwo zawiedzie.</p>
      </div>
    )},
  { n: 3, name: "Stats — Big Number",
    render: () => (
      <div className="cp-card cp-card--3">
        <span className="cp-big">99,99%</span>
        <span className="cp-lbl">Dostępność SLA</span>
      </div>
    )},
  { n: 4, name: "Testimonial",
    render: () => (
      <div className="cp-card cp-card--4">
        <div className="cp-quote">„Wdrożenie NetApp odbyło się bez jednej minuty przestoju."</div>
        <div className="cp-signature">
          <span className="cp-avatar" aria-hidden="true">MK</span>
          <div>
            <strong>Marek K.</strong>
            <em>Head of IT, Bank Polski</em>
          </div>
        </div>
      </div>
    )},
  { n: 5, name: "Pricing",
    render: () => (
      <div className="cp-card cp-card--5">
        <span className="cp-tier">Business</span>
        <div className="cp-price"><span>od</span><strong>4 900</strong><em>PLN/msc</em></div>
        <ul>
          <li>Monitoring 24/7</li>
          <li>SLA 99,9%</li>
          <li>Dedykowany opiekun</li>
        </ul>
      </div>
    )},
  { n: 6, name: "Icon Top Center",
    render: () => (
      <div className="cp-card cp-card--6">
        <div className="cp-icon cp-icon--center"><Shield size={22} /></div>
        <h4>Zero Trust</h4>
        <p>Warstwowe bezpieczeństwo od segmentacji sieci po tożsamość.</p>
      </div>
    )},
  { n: 7, name: "Glass Blur",
    render: () => (
      <div className="cp-card cp-card--7">
        <div className="cp-icon"><Cloud size={22} /></div>
        <h4>Hybrid Cloud</h4>
        <p>Bezpieczne pomosty między on-prem a chmurą publiczną.</p>
      </div>
    )},
  { n: 8, name: "Gradient Border",
    render: () => (
      <div className="cp-card cp-card--8">
        <div className="cp-icon"><Cpu size={22} /></div>
        <h4>Compute Density</h4>
        <p>Maksymalizacja mocy obliczeniowej na jednostkę U.</p>
      </div>
    )},
  { n: 9, name: "HUD Bracketed",
    render: () => (
      <div className="cp-card cp-card--9">
        <span className="cp-br cp-br--tl" aria-hidden="true" />
        <span className="cp-br cp-br--tr" aria-hidden="true" />
        <span className="cp-br cp-br--bl" aria-hidden="true" />
        <span className="cp-br cp-br--br" aria-hidden="true" />
        <h4>Monitoring 24/7</h4>
        <p>Podgląd stanu środowiska w czasie rzeczywistym.</p>
      </div>
    )},
  { n: 10, name: "Hover Lift",
    render: () => (
      <div className="cp-card cp-card--10">
        <div className="cp-icon"><Zap size={22} /></div>
        <h4>Optymalizacja TCO</h4>
        <p>Redukujemy koszty utrzymania nie tracąc na wydajności.</p>
      </div>
    )},
  { n: 11, name: "Split Media",
    render: () => (
      <div className="cp-card cp-card--11">
        <div className="cp-media" aria-hidden="true">
          <Layers size={30} />
        </div>
        <div>
          <h4>Warstwowa architektura</h4>
          <p>Segmenty compute, storage i sieć — każdy skalowany osobno.</p>
        </div>
      </div>
    )},
  { n: 12, name: "Inline Icon",
    render: () => (
      <div className="cp-card cp-card--12">
        <div className="cp-inline">
          <Lock size={18} />
          <h4>NGFW Palo Alto</h4>
        </div>
        <p>Next-gen firewall z inspekcją L7 i DPI.</p>
      </div>
    )},
  { n: 13, name: "Badge Card",
    render: () => (
      <div className="cp-card cp-card--13">
        <span className="cp-badge">Nowość</span>
        <h4>ThreatWise</h4>
        <p>Wczesne wykrywanie zagrożeń z decoy technology.</p>
      </div>
    )},
  { n: 14, name: "Timeline Node",
    render: () => (
      <div className="cp-card cp-card--14">
        <span className="cp-node" aria-hidden="true" />
        <div>
          <span className="cp-date">Q1 · 2026</span>
          <h4>Audyt architektury</h4>
          <p>Analiza obecnego stanu i identyfikacja pinch-pointów.</p>
        </div>
      </div>
    )},
  { n: 15, name: "Numbered Step",
    render: () => (
      <div className="cp-card cp-card--15">
        <span className="cp-num">01</span>
        <h4>Konsultacja</h4>
        <p>Rozmowa z architektem i mapowanie potrzeb biznesowych.</p>
      </div>
    )},
  { n: 16, name: "Compact Chip",
    render: () => (
      <div className="cp-card cp-card--16">
        <span className="cp-chip"><Network size={14} />&nbsp;SDN Ready</span>
        <p>Sieć programowalna zgodna z EVPN/VXLAN.</p>
      </div>
    )},
  { n: 17, name: "Minimal Outline",
    render: () => (
      <div className="cp-card cp-card--17">
        <h4>Bez ozdób</h4>
        <p>Sam kontent — bez tła, tylko cienka linia.</p>
      </div>
    )},
  { n: 18, name: "Gradient BG",
    render: () => (
      <div className="cp-card cp-card--18">
        <div className="cp-icon"><Rocket size={22} /></div>
        <h4>Fast Deploy</h4>
        <p>Od podpisu do produkcji w 30 dni.</p>
      </div>
    )},
  { n: 19, name: "Case Study",
    render: () => (
      <div className="cp-card cp-card--19">
        <div className="cp-cover" aria-hidden="true">
          <HardDrive size={34} />
        </div>
        <div className="cp-body">
          <span className="cp-tag">Case Study</span>
          <h4>Bank Polski — konsolidacja storage</h4>
          <p>Redukcja footprintu o 62% przy 3× wzroście wydajności.</p>
        </div>
      </div>
    )},
  { n: 20, name: "CTA Card",
    render: () => (
      <div className="cp-card cp-card--20">
        <div>
          <h4>Gotowy na start?</h4>
          <p>Umów bezpłatną konsultację architekta.</p>
        </div>
        <a href="#" onClick={(e)=>e.preventDefault()} className="cp-cta">
          Napisz do nas <ArrowRight size={14} />
        </a>
      </div>
    )},
];

/* ============================ ICONS (15) ============================ */
const ICONS = [
  { n: 1,  name: "Outline Neutral",     cls: "ip-1",  ic: <Server size={22} /> },
  { n: 2,  name: "Outline Cyan",        cls: "ip-2",  ic: <Shield size={22} /> },
  { n: 3,  name: "Filled Cyan",         cls: "ip-3",  ic: <Database size={22} /> },
  { n: 4,  name: "Circle BG Cyan",      cls: "ip-4",  ic: <Cpu size={22} /> },
  { n: 5,  name: "Circle BG Dark",      cls: "ip-5",  ic: <Cloud size={22} /> },
  { n: 6,  name: "Rounded Square Grad", cls: "ip-6",  ic: <Lock size={22} /> },
  { n: 7,  name: "Square Solid Cyan",   cls: "ip-7",  ic: <Zap size={22} /> },
  { n: 8,  name: "HUD Frame",           cls: "ip-8",  ic: <Layers size={22} /> },
  { n: 9,  name: "Duotone Halo",        cls: "ip-9",  ic: <Network size={22} /> },
  { n: 10, name: "Glow Icon",           cls: "ip-10", ic: <Radar size={22} /> },
  { n: 11, name: "Gradient Stroke",     cls: "ip-11", ic: <Gauge size={22} /> },
  { n: 12, name: "Icon + Underline",    cls: "ip-12", ic: <Rocket size={22} /> },
  { n: 13, name: "Dot Badge",           cls: "ip-13", ic: <HardDrive size={22} /> },
  { n: 14, name: "Cyan Disc Big",       cls: "ip-14", ic: <Star size={22} /> },
  { n: 15, name: "Minimal Outline Sq",  cls: "ip-15", ic: <Shield size={22} /> },
];

const CardsGrid = ({ theme }) => (
  <div className="cp-grid">
    {CARDS.map((c) => (
      <div key={c.n} className="cp-cell" data-testid={`cp-cell-${theme}-${c.n}`}>
        <div className="cp-cell__render">{c.render()}</div>
        <div className="cp-cell__label">
          <span className="cp-cell__num">{String(c.n).padStart(2, "0")}</span>
          <span className="cp-cell__name">{c.name}</span>
        </div>
      </div>
    ))}
  </div>
);

const IconsGrid = ({ theme }) => (
  <div className="ip-grid">
    {ICONS.map((i) => (
      <div key={i.n} className="ip-cell" data-testid={`ip-cell-${theme}-${i.n}`}>
        <div className={`ip-icon ${i.cls}`}>
          {i.n === 8 && (<>
            <span className="ip-br ip-br--tl" />
            <span className="ip-br ip-br--tr" />
            <span className="ip-br ip-br--bl" />
            <span className="ip-br ip-br--br" />
          </>)}
          {i.n === 13 && (<span className="ip-dot" aria-hidden="true" />)}
          {i.ic}
        </div>
        <div className="ip-label">
          <span className="ip-num">{String(i.n).padStart(2, "0")}</span>
          <span className="ip-name">{i.name}</span>
        </div>
      </div>
    ))}
  </div>
);

const Panel = ({ theme }) => (
  <div className={`ci-panel ci-panel--${theme}`} data-testid={`ci-panel-${theme}`}>
    <div className="ci-panel__inner">
      <div className="ci-panel__head">
        <span className="ci-panel__tag">Karty &amp; Ikony · Propozycje</span>
        <h2 className="ci-panel__title">
          {theme === "light" ? "Karty i ikony — jasne tło" : "Karty i ikony — ciemne tło"}
        </h2>
        <p className="ci-panel__sub">
          20 wariantów kart i 15 stylów ikon spójnych z aktualnym layoutem strony głównej.
        </p>
      </div>

      <h3 className="ci-panel__section">Karty (20)</h3>
      <CardsGrid theme={theme} />

      <h3 className="ci-panel__section">Ikony (15)</h3>
      <IconsGrid theme={theme} />
    </div>
  </div>
);

const CardIconPlaygroundSection = () => (
  <section id="card-icon-playground" data-testid="card-icon-playground" className="ci-section">
    <Panel theme="light" />
    <Panel theme="dark" />
  </section>
);

export default CardIconPlaygroundSection;
