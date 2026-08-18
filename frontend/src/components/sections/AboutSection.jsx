import React, { useState } from "react";
import { useLang } from "@/i18n/LanguageContext";
import {
  Compass,
  Layers,
  Target,
  ArrowUpRight,
  CheckCircle2,
  Award,
  Rocket,
  Users,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import useSectionParallax from "@/hooks/useSectionParallax";
import AuroraBorealis from "@/components/fx/AuroraBorealis";

const PILLARS = [
  {
    id: "listen",
    Icon: Compass,
    label_pl: "Uważność",
    label_en: "Attentiveness",
    desc_pl: "Wsłuchujemy się w głos klienta — projektujemy pod jego procesy, ludzi i budżet.",
    desc_en: "We listen to the client — designing around their people, processes and budget.",
    badges_pl: ["Discovery", "Workshopy", "Mapowanie procesów"],
    badges_en: ["Discovery", "Workshops", "Process mapping"],
    metrics_pl: [
      { k: "Session", v: "Workshopy 1-on-1" },
      { k: "Deliverable", v: "Discovery Report" },
      { k: "Timeframe", v: "2–4 tygodnie" },
    ],
    metrics_en: [
      { k: "Session", v: "1-on-1 workshops" },
      { k: "Deliverable", v: "Discovery report" },
      { k: "Timeframe", v: "2–4 weeks" },
    ],
    load: 62,
  },
  {
    id: "holistic",
    Icon: Layers,
    label_pl: "Holistyczne spojrzenie",
    label_en: "Holistic view",
    desc_pl: "Widzimy ekosystem IT jako całość — sieć, storage, backup i security współpracujące spójnie.",
    desc_en: "We see IT as one ecosystem — network, storage, backup and security acting as one.",
    badges_pl: ["Architektura", "Integracja", "Bezpieczeństwo"],
    badges_en: ["Architecture", "Integration", "Security"],
    metrics_pl: [
      { k: "Warstwy", v: "Compute · Storage · Net · Sec · BR" },
      { k: "Standardy", v: "ISO 27001 · NIS2 · GDPR" },
      { k: "Deliverable", v: "Architektura HLD/LLD" },
    ],
    metrics_en: [
      { k: "Layers", v: "Compute · Storage · Net · Sec · BR" },
      { k: "Standards", v: "ISO 27001 · NIS2 · GDPR" },
      { k: "Deliverable", v: "HLD/LLD architecture" },
    ],
    load: 84,
  },
  {
    id: "optimize",
    Icon: Target,
    label_pl: "Optymalizacja",
    label_en: "Optimisation",
    desc_pl: "Nie szukamy najdroższych rozwiązań — szukamy tych najbardziej zoptymalizowanych.",
    desc_en: "We do not chase the most expensive solutions — we chase the most optimised ones.",
    badges_pl: ["TCO", "Skalowalność", "SLA"],
    badges_en: ["TCO", "Scalability", "SLA"],
    metrics_pl: [
      { k: "Redukcja TCO", v: "18–35%" },
      { k: "Uptime SLA", v: "99.95–99.99%" },
      { k: "RTO / RPO", v: "≤ 15 min / ≤ 5 min" },
    ],
    metrics_en: [
      { k: "TCO reduction", v: "18–35%" },
      { k: "Uptime SLA", v: "99.95–99.99%" },
      { k: "RTO / RPO", v: "≤ 15 min / ≤ 5 min" },
    ],
    load: 91,
  },
];

/** Technical blueprint panel — futuristic spec-sheet driven by the active pillar. */
const BlueprintPanel = ({ pillar, index, total, lang }) => {
  const metrics = lang === "pl" ? pillar.metrics_pl : pillar.metrics_en;

  return (
    <div className="sc-blueprint" key={pillar.id}>
      <div className="sc-blueprint__row">
        <span className="sc-blueprint__idx">
          {String(index + 1).padStart(2, "0")}
          <em>/ {String(total).padStart(2, "0")}</em>
        </span>
        <span className="sc-blueprint__status">
          <span className="sc-blueprint__pulse" />
          {lang === "pl" ? "AKTYWNE" : "ACTIVE"}
        </span>
      </div>

      <div className="sc-blueprint__title">
        {lang === "pl" ? pillar.label_pl : pillar.label_en}
      </div>

      <div className="sc-blueprint__bar">
        {Array.from({ length: 24 }).map((_, i) => {
          const filled = i / 24 * 100 < pillar.load;
          return <span key={i} className={filled ? "on" : ""} />;
        })}
      </div>
      <div className="sc-blueprint__bar-caption">
        <span>{lang === "pl" ? "Zaawansowanie procesu" : "Process coverage"}</span>
        <b>{pillar.load}%</b>
      </div>

      <div className="sc-blueprint__specs">
        {metrics.map((m) => (
          <div key={m.k} className="sc-blueprint__spec">
            <span className="sc-blueprint__spec-k">{m.k}</span>
            <span className="sc-blueprint__spec-dots" aria-hidden="true" />
            <span className="sc-blueprint__spec-v">{m.v}</span>
          </div>
        ))}
      </div>

      <svg className="sc-blueprint__schema" viewBox="0 0 240 90" preserveAspectRatio="none">
        <defs>
          <linearGradient id="bp-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00B8D4" stopOpacity="0" />
            <stop offset="20%" stopColor="#00B8D4" stopOpacity="1" />
            <stop offset="80%" stopColor="#00B8D4" stopOpacity="1" />
            <stop offset="100%" stopColor="#00B8D4" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="0" y1="75" x2="240" y2="75" stroke="url(#bp-line)" strokeWidth="0.6" strokeDasharray="1 3" />
        <path
          d={
            pillar.id === "listen"
              ? "M0 70 L 40 66 L 80 55 L 120 60 L 160 45 L 200 50 L 240 40"
              : pillar.id === "holistic"
                ? "M0 70 L 40 60 L 80 40 L 120 45 L 160 25 L 200 30 L 240 15"
                : "M0 70 L 40 55 L 80 42 L 120 30 L 160 22 L 200 15 L 240 8"
          }
          fill="none"
          stroke="#00B8D4"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {[0, 40, 80, 120, 160, 200, 240].map((x, i) => (
          <circle
            key={i}
            cx={x}
            cy={
              pillar.id === "listen"
                ? [70, 66, 55, 60, 45, 50, 40][i]
                : pillar.id === "holistic"
                  ? [70, 60, 40, 45, 25, 30, 15][i]
                  : [70, 55, 42, 30, 22, 15, 8][i]
            }
            r="1.6"
            fill="#00B8D4"
          />
        ))}
      </svg>

      <span className="sc-blueprint__bracket sc-blueprint__bracket--tl" />
      <span className="sc-blueprint__bracket sc-blueprint__bracket--tr" />
      <span className="sc-blueprint__bracket sc-blueprint__bracket--bl" />
      <span className="sc-blueprint__bracket sc-blueprint__bracket--br" />
    </div>
  );
};

const AboutSection = () => {
  const { t, lang } = useLang();
  const [active, setActive] = useState(PILLARS[1].id);
  const activePillar = PILLARS.find((p) => p.id === active) || PILLARS[0];
  const activeIndex = PILLARS.findIndex((p) => p.id === active);
  const parallaxRef = useSectionParallax();

  const STAT_ICONS = { experience: Award, projects: Rocket, clients: Users };

  return (
    <section
      id="about"
      data-testid="about-section"
      ref={parallaxRef}
      className="relative w-full overflow-hidden"
      style={{ background: "#FFFFFF", color: "#1C2833" }}
    >
      {/* Aurora Borealis (light tone) + parallax on it */}
      <div className="sc-slayer-wrap" aria-hidden="true">
        <div data-parallax="-0.18">
          <AuroraBorealis tone="light" intensity={1.1} />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 py-14 md:py-20">
        {/* 1. Section label */}
        <Reveal>
          <div
            className="flex items-center gap-4 text-[11px] uppercase tracking-[0.32em]"
            style={{ color: "#0C5C62" }}
          >
            <span className="inline-block h-px w-10" style={{ background: "#00B8D4" }} />
            {t.about.section_label}
          </div>
        </Reveal>

        {/* 2. Three-column row: narrative (left, 2/3) + interactive stat panels (right, 1/3) */}
        <div
          data-testid="about-intro-grid"
          className="mt-10 md:mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
        >
          <Reveal className="lg:col-span-8">
            <div
              data-testid="about-narrative"
              className="sc-about-copy"
            >
              {(Array.isArray(t.about.narrative)
                ? t.about.narrative
                : [t.about.narrative]
              ).map((para, i) => (
                <p key={i} data-testid={`about-narrative-p-${i}`}>
                  {para}
                </p>
              ))}
            </div>
          </Reveal>

          <Reveal className="lg:col-span-4">
            <div
              data-testid="about-stats-panel"
              className="sc-statcards"
              role="list"
            >
              {t.about.stat_cards.map((card) => {
                const Icon = STAT_ICONS[card.id];
                return (
                  <div
                    key={card.id}
                    role="listitem"
                    className="sc-statcard"
                    data-testid={`about-stat-${card.id}`}
                  >
                    <span className="sc-statcard__glow" aria-hidden="true" />
                    <span className="sc-statcard__icon" aria-hidden="true">
                      <Icon size={18} strokeWidth={1.7} />
                    </span>
                    <span className="sc-statcard__meta">
                      <span className="sc-statcard__value">{card.value}</span>
                      <span className="sc-statcard__label">{card.label}</span>
                    </span>
                    <span className="sc-statcard__bracket sc-statcard__bracket--tl" aria-hidden="true" />
                    <span className="sc-statcard__bracket sc-statcard__bracket--tr" aria-hidden="true" />
                    <span className="sc-statcard__bracket sc-statcard__bracket--bl" aria-hidden="true" />
                    <span className="sc-statcard__bracket sc-statcard__bracket--br" aria-hidden="true" />
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>

        {/* 4. Title — Trzy filary, jedno podejście. */}
        <Reveal>
          <h2
            data-testid="about-narrative-title"
            className="mt-20 md:mt-24 text-4xl md:text-6xl font-semibold leading-[1.02] tracking-tight max-w-3xl"
            style={{ color: "#0C5C62" }}
          >
            {lang === "pl"
              ? "Trzy filary, jedno podejście."
              : "Three pillars, one approach."}
          </h2>
        </Reveal>

        {/* 5. Pillars + blueprint row */}
        <div className="mt-10 md:mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          <div className="lg:col-span-7 flex flex-col gap-3">
            {PILLARS.map((p) => {
              const isActive = p.id === active;
              const Icon = p.Icon;
              return (
                <button
                  key={p.id}
                  type="button"
                  onMouseEnter={() => setActive(p.id)}
                  onClick={() => setActive(p.id)}
                  className={`sc-pillar sc-pillar--flex ${isActive ? "is-active" : ""}`}
                  data-testid={`about-pillar-${p.id}`}
                >
                  <span className="sc-pillar__icon">
                    <Icon size={20} strokeWidth={1.8} />
                  </span>
                  <span className="sc-pillar__body">
                    <span className="sc-pillar__label">
                      {lang === "pl" ? p.label_pl : p.label_en}
                    </span>
                    <span className="sc-pillar__desc">
                      {lang === "pl" ? p.desc_pl : p.desc_en}
                    </span>
                    <span className="sc-pillar__badges">
                      {(lang === "pl" ? p.badges_pl : p.badges_en).map((b) => (
                        <span key={b} className="sc-pillar__badge">
                          <CheckCircle2 size={11} strokeWidth={2.4} />
                          {b}
                        </span>
                      ))}
                    </span>
                  </span>
                  <ArrowUpRight
                    size={18}
                    className="sc-pillar__arrow"
                    strokeWidth={1.8}
                  />
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-5 flex">
            <Reveal className="w-full flex">
              <BlueprintPanel
                pillar={activePillar}
                index={activeIndex}
                total={PILLARS.length}
                lang={lang}
              />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
