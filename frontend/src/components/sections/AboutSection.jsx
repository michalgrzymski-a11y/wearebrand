import React, { useState } from "react";
import { useLang } from "@/i18n/LanguageContext";
import {
  Compass,
  Layers,
  Target,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
import Reveal from "@/components/Reveal";

/**
 * Interactive infographic — three pillars of the SmartClout approach.
 * The active pillar drives an animated hex diagram on the right.
 */
const PILLARS = [
  {
    id: "listen",
    Icon: Compass,
    label_pl: "Uważność",
    label_en: "Attentiveness",
    desc_pl:
      "Wsłuchujemy się w głos klienta — projektujemy pod jego procesy, ludzi i budżet.",
    desc_en:
      "We listen to the client — designing around their people, processes and budget.",
    badges_pl: ["Discovery", "Workshopy", "Mapowanie procesów"],
    badges_en: ["Discovery", "Workshops", "Process mapping"],
    hex: ["OBSERWACJA", "WYWIAD", "AUDYT"],
    hex_en: ["OBSERVE", "INTERVIEW", "AUDIT"],
  },
  {
    id: "holistic",
    Icon: Layers,
    label_pl: "Holistyczne spojrzenie",
    label_en: "Holistic view",
    desc_pl:
      "Widzimy ekosystem IT jako całość — sieć, storage, backup i security współpracujące spójnie.",
    desc_en:
      "We view IT as one ecosystem — network, storage, backup and security acting as one.",
    badges_pl: ["Architektura", "Integracja", "Bezpieczeństwo"],
    badges_en: ["Architecture", "Integration", "Security"],
    hex: ["COMPUTE", "STORAGE", "NETWORK", "SECURITY"],
    hex_en: ["COMPUTE", "STORAGE", "NETWORK", "SECURITY"],
  },
  {
    id: "optimize",
    Icon: Target,
    label_pl: "Optymalizacja",
    label_en: "Optimisation",
    desc_pl:
      "Nie szukamy najdroższych rozwiązań — szukamy tych najbardziej zoptymalizowanych.",
    desc_en:
      "We do not chase the most expensive solutions — we chase the most optimised ones.",
    badges_pl: ["TCO", "Skalowalność", "SLA"],
    badges_en: ["TCO", "Scalability", "SLA"],
    hex: ["KOSZT", "WYDAJNOŚĆ", "RYZYKO"],
    hex_en: ["COST", "PERFORMANCE", "RISK"],
  },
];

const HexInfographic = ({ pillar, lang }) => {
  const items = lang === "pl" ? pillar.hex : pillar.hex_en;
  return (
    <div className="sc-hex" key={pillar.id}>
      <svg viewBox="0 0 200 200" className="sc-hex__svg" aria-hidden="true">
        <defs>
          <linearGradient id="hexFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#49ADA5" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0C5C62" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        {/* Outer hex frame */}
        <polygon
          points="100,10 175,52 175,148 100,190 25,148 25,52"
          fill="none"
          stroke="#49ADA5"
          strokeOpacity="0.35"
          strokeWidth="0.8"
        />
        {/* Rotating tick marks */}
        <g className="sc-hex__ticks">
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i / 24) * Math.PI * 2;
            const x1 = 100 + Math.cos(angle) * 72;
            const y1 = 100 + Math.sin(angle) * 72;
            const x2 = 100 + Math.cos(angle) * 78;
            const y2 = 100 + Math.sin(angle) * 78;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#49ADA5"
                strokeOpacity={i % 3 === 0 ? 0.6 : 0.2}
                strokeWidth="0.7"
              />
            );
          })}
        </g>
        {/* Center core */}
        <circle
          cx="100"
          cy="100"
          r="26"
          fill="url(#hexFill)"
          className="sc-hex__core"
        />
        <circle
          cx="100"
          cy="100"
          r="36"
          fill="none"
          stroke="#49ADA5"
          strokeOpacity="0.55"
          strokeWidth="0.6"
          className="sc-hex__ring"
        />
        {/* Orbiting dots for each item */}
        {items.map((label, i) => {
          const angle = (i / items.length) * Math.PI * 2 - Math.PI / 2;
          const x = 100 + Math.cos(angle) * 60;
          const y = 100 + Math.sin(angle) * 60;
          return (
            <g key={label}>
              <line
                x1="100"
                y1="100"
                x2={x}
                y2={y}
                stroke="#49ADA5"
                strokeOpacity="0.55"
                strokeWidth="0.6"
              />
              <circle cx={x} cy={y} r="4.5" fill="#0C5C62" stroke="#49ADA5" strokeWidth="1.2" />
              <text
                x={x}
                y={y - 8}
                textAnchor="middle"
                fill="#0C5C62"
                fontSize="7"
                fontWeight="700"
                fontFamily="Manrope, sans-serif"
                letterSpacing="1.5"
              >
                {label}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="sc-hex__core-label">
        {lang === "pl" ? pillar.label_pl : pillar.label_en}
      </div>
    </div>
  );
};

const AboutSection = () => {
  const { t, lang } = useLang();
  const [active, setActive] = useState(PILLARS[1].id);
  const activePillar = PILLARS.find((p) => p.id === active) || PILLARS[0];

  return (
    <section
      id="about"
      data-testid="about-section"
      className="relative w-full"
      style={{ background: "#FFFFFF", color: "#1C2833" }}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-24 md:py-32">
        <div className="mb-14 flex items-center gap-4 text-[11px] uppercase tracking-[0.32em]" style={{ color: "#0C5C62" }}>
          <span className="inline-block h-px w-10" style={{ background: "#49ADA5" }} />
          {t.about.section_label}
        </div>

        {/* Metrics row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mb-16">
          {t.about.metrics.map((m, i) => (
            <Reveal key={m.label} delay={i * 120}>
              <div
                data-testid={`about-metric-${i}`}
                className="sc-metric-card group"
              >
              <div className="flex items-baseline justify-between gap-4">
                <span className="sc-metric-value" style={{ color: "#0C5C62" }}>
                  {m.value}
                </span>
                <span
                  className="text-[10px] uppercase tracking-[0.32em]"
                  style={{ color: "#49ADA5" }}
                >
                  0{i + 1}
                </span>
              </div>
              <div className="mt-2 text-sm md:text-base" style={{ color: "#1C2833" }}>
                {m.label}
              </div>
              <div className="sc-metric-spark" aria-hidden="true">
                <svg viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path
                    d={
                      i === 0
                        ? "M0 15 Q 20 10 40 12 T 100 3"
                        : i === 1
                          ? "M0 18 Q 25 14 50 10 T 100 4"
                          : "M0 16 Q 30 12 60 8 T 100 2"
                    }
                    fill="none"
                    stroke="#49ADA5"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
              <div className="sc-metric-underline" />
              </div>
            </Reveal>
          ))}
        </div>

        {/* Interactive split */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-14 items-start">
          {/* Narrative + pillars */}
          <div className="md:col-span-7">
            <h2
              data-testid="about-narrative-title"
              className="text-3xl md:text-5xl font-semibold leading-[1.05] tracking-tight"
              style={{ color: "#0C5C62" }}
            >
              {lang === "pl"
                ? "Trzy filary, jedno podejście."
                : "Three pillars, one approach."}
            </h2>

            <p
              data-testid="about-narrative"
              className="sc-narrative mt-6"
              style={{ color: "#1C2833" }}
            >
              {t.about.narrative}
            </p>

            {/* Pillars accordion-like list */}
            <div className="mt-10 flex flex-col gap-3">
              {PILLARS.map((p) => {
                const isActive = p.id === active;
                const Icon = p.Icon;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onMouseEnter={() => setActive(p.id)}
                    onClick={() => setActive(p.id)}
                    className={`sc-pillar ${isActive ? "is-active" : ""}`}
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
          </div>

          {/* Interactive infographic */}
          <div className="md:col-span-5">
            <div className="sc-about-graphic">
              <div className="sc-about-graphic__tag">
                <span className="sc-topo-frame__dot" />
                {lang === "pl"
                  ? "Model współpracy"
                  : "Delivery model"}
              </div>
              <HexInfographic pillar={activePillar} lang={lang} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
