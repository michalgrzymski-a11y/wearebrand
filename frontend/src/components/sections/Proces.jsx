import React, { useState } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { ArrowDown } from "lucide-react";
import Reveal from "@/components/Reveal";
import useSectionParallax from "@/hooks/useSectionParallax";

/**
 * Proces — "Three pillars, one approach" reimagined as a horizontal
 * PROCESS TIMELINE. Three stages (Listen → Analyse → Optimise) sit on a
 * single flowing baseline; the currently active stage displays a blueprint
 * chart on the right. Dark cyan aesthetic to match the rest of the site.
 */

const STAGES = [
  {
    id: "listen",
    stepPL: "Słuchamy",
    stepEN: "Listen",
    label_pl: "Uważność",
    label_en: "Attentiveness",
    desc_pl:
      "Rozpoczynamy każdy projekt od uważnej rozmowy — poznajemy Twoje procesy, ludzi, budżet i realia biznesowe. Bez tego nie ma dobrego wdrożenia.",
    desc_en:
      "Every project starts with careful conversation — we learn your processes, people, budget and business context. Without that, there is no good deployment.",
    badges_pl: ["Discovery", "Workshopy 1-on-1", "Mapowanie procesów"],
    badges_en: ["Discovery", "1-on-1 workshops", "Process mapping"],
    metrics_pl: [
      { k: "Format",   v: "Workshopy 1-on-1" },
      { k: "Rezultat", v: "Discovery Report" },
      { k: "Czas",     v: "2–4 tygodnie" },
    ],
    metrics_en: [
      { k: "Format",      v: "1-on-1 workshops" },
      { k: "Deliverable", v: "Discovery report" },
      { k: "Timeframe",   v: "2–4 weeks" },
    ],
    // Chart series (0..100 across 7 sample points) — how much of the domain
    // is uncovered by this stage
    chart: [12, 22, 34, 45, 55, 60, 62],
    load: 62,
  },
  {
    id: "analyse",
    stepPL: "Analizujemy",
    stepEN: "Analyse",
    label_pl: "Holistyczne spojrzenie",
    label_en: "Holistic view",
    desc_pl:
      "Konfrontujemy stan zastany z możliwościami rynku i best practice. Widzimy IT jako jedną całość — compute, storage, sieć, backup i security jako spójny ekosystem.",
    desc_en:
      "We benchmark the current state against market options and best practices. IT is one ecosystem — compute, storage, network, backup and security as one whole.",
    badges_pl: ["Architektura", "Integracja", "Bezpieczeństwo"],
    badges_en: ["Architecture", "Integration", "Security"],
    metrics_pl: [
      { k: "Warstwy",  v: "Compute · Storage · Net · Sec · BR" },
      { k: "Standardy", v: "ISO 27001 · NIS2 · GDPR" },
      { k: "Rezultat", v: "Architektura HLD/LLD" },
    ],
    metrics_en: [
      { k: "Layers",      v: "Compute · Storage · Net · Sec · BR" },
      { k: "Standards",   v: "ISO 27001 · NIS2 · GDPR" },
      { k: "Deliverable", v: "HLD/LLD architecture" },
    ],
    chart: [20, 35, 50, 62, 72, 80, 84],
    load: 84,
  },
  {
    id: "optimise",
    stepPL: "Optymalizujemy",
    stepEN: "Optimise",
    label_pl: "Optymalizacja",
    label_en: "Optimisation",
    desc_pl:
      "Projektujemy infrastrukturę „szytą na miarę” — chroni dane, przyspiesza biznes i szanuje budżet. Nie najdroższe, tylko najbardziej zoptymalizowane.",
    desc_en:
      "We design tailor-made infrastructure — protecting data, accelerating business, respecting the budget. Not the most expensive, but the most optimised.",
    badges_pl: ["TCO", "Skalowalność", "SLA"],
    badges_en: ["TCO", "Scalability", "SLA"],
    metrics_pl: [
      { k: "Redukcja TCO", v: "18–35 %" },
      { k: "Uptime SLA",   v: "99.95–99.99 %" },
      { k: "RTO / RPO",    v: "≤ 15 min / ≤ 5 min" },
    ],
    metrics_en: [
      { k: "TCO reduction", v: "18–35 %" },
      { k: "Uptime SLA",    v: "99.95–99.99 %" },
      { k: "RTO / RPO",     v: "≤ 15 min / ≤ 5 min" },
    ],
    chart: [30, 45, 60, 72, 82, 88, 91],
    load: 91,
  },
];

/** Blueprint chart panel — driven by the currently active stage. */
const BlueprintPanel = ({ stage, index, total, lang }) => {
  const isPL = lang === "pl";
  const metrics = isPL ? stage.metrics_pl : stage.metrics_en;

  // Build the SVG polyline from the chart array (0..100 → viewBox 240×90)
  const xs = [0, 40, 80, 120, 160, 200, 240];
  const ys = stage.chart.map((v) => 85 - (v / 100) * 75);
  const path = xs
    .map((x, i) => `${i === 0 ? "M" : "L"} ${x} ${ys[i].toFixed(1)}`)
    .join(" ");

  return (
    <div className="sc-av2__blueprint" key={stage.id}>
      <div className="sc-av2__bp-row">
        <span className="sc-av2__bp-idx">
          {String(index + 1).padStart(2, "0")}
          <em>/ {String(total).padStart(2, "0")}</em>
        </span>
        <span className="sc-av2__bp-status">
          <span className="sc-av2__bp-pulse" />
          {isPL ? "AKTYWNE" : "ACTIVE"}
        </span>
      </div>

      <div className="sc-av2__bp-title">
        {isPL ? stage.label_pl : stage.label_en}
      </div>

      <div className="sc-av2__bp-bar">
        <span
          className="sc-av2__bp-bar-fill"
          style={{ width: `${stage.load}%` }}
        />
      </div>
      <div className="sc-av2__bp-bar-caption">
        <span>{isPL ? "Zaawansowanie procesu" : "Process coverage"}</span>
        <b>{stage.load}%</b>
      </div>

      <div className="sc-av2__bp-specs">
        {metrics.map((m) => (
          <div key={m.k} className="sc-av2__bp-spec">
            <span className="sc-av2__bp-spec-k">{m.k}</span>
            <span className="sc-av2__bp-spec-dots" aria-hidden="true" />
            <span className="sc-av2__bp-spec-v">{m.v}</span>
          </div>
        ))}
      </div>

      <svg
        className="sc-av2__bp-schema"
        viewBox="0 0 240 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="av2-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00B8D4" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#00B8D4" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="av2-stroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#06FFE0" />
            <stop offset="100%" stopColor="#00B8D4" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines at 25%, 50%, 75% */}
        {[25, 50, 75].map((v) => {
          const y = 85 - (v / 100) * 75;
          return (
            <line
              key={v}
              x1="0" y1={y} x2="240" y2={y}
              stroke="#0C5C62"
              strokeWidth="0.3"
              strokeDasharray="2 3"
              opacity="0.25"
            />
          );
        })}

        {/* Area fill */}
        <path d={`${path} L 240 85 L 0 85 Z`} fill="url(#av2-area)" />

        {/* Main line */}
        <path
          d={path}
          fill="none"
          stroke="url(#av2-stroke)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points — smaller intermediate, larger + glow at end */}
        {xs.map((x, i) => {
          const isLast = i === xs.length - 1;
          return isLast ? (
            <g key={i}>
              <circle cx={x} cy={ys[i]} r="4" fill="#00B8D4" opacity="0.15" />
              <circle cx={x} cy={ys[i]} r="2.4" fill="#00B8D4" />
              <circle cx={x} cy={ys[i]} r="1" fill="#FFFFFF" />
            </g>
          ) : (
            <circle key={i} cx={x} cy={ys[i]} r="1.4" fill="#00B8D4" opacity="0.7" />
          );
        })}

        {/* Y-axis anchors */}
        <text x="2" y="12" fontSize="4.5" fontFamily="JetBrains Mono, monospace" fill="#0C5C62" opacity="0.55" letterSpacing="0.5">100%</text>
        <text x="2" y="86" fontSize="4.5" fontFamily="JetBrains Mono, monospace" fill="#0C5C62" opacity="0.55" letterSpacing="0.5">0%</text>
      </svg>

      <span className="sc-av2__bp-bracket sc-av2__bp-bracket--tl" />
      <span className="sc-av2__bp-bracket sc-av2__bp-bracket--tr" />
      <span className="sc-av2__bp-bracket sc-av2__bp-bracket--bl" />
      <span className="sc-av2__bp-bracket sc-av2__bp-bracket--br" />
    </div>
  );
};

const Proces = () => {
  const { lang } = useLang();
  const parallaxRef = useSectionParallax();
  const [active, setActive] = useState(STAGES[0].id);
  const isPL = lang === "pl";
  const activeStage = STAGES.find((s) => s.id === active) || STAGES[0];
  const activeIndex = STAGES.findIndex((s) => s.id === active);

  return (
    <section
      id="about-v2"
      data-testid="about-v2-section"
      ref={parallaxRef}
      className="relative w-full overflow-hidden sc-av2--light"
      style={{ background: "#F7FAFA", color: "#1C2833" }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(55% 55% at 30% 30%, rgba(73,173,165,0.08) 0%, rgba(73,173,165,0) 60%)," +
            " radial-gradient(45% 55% at 75% 70%, rgba(12,92,98,0.06) 0%, rgba(12,92,98,0) 60%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-24">
        <Reveal>
          <div
            className="flex items-center gap-4 text-[11px] uppercase tracking-[0.32em]"
            style={{ color: "#0C5C62" }}
          >
            <span className="inline-block h-px w-10" style={{ background: "#49ADA5" }} />
            {isPL ? "Nasze podejście" : "Our approach"}
          </div>
          <h2
            data-testid="about-v2-title"
            className="mt-4 text-2xl md:text-3xl font-semibold leading-[1.05] tracking-tight max-w-4xl"
            style={{ color: "#0C5C62" }}
          >
            {isPL ? "Szanujemy Twój " : "We respect your "}
            <span
              className="font-semibold"
              style={{
                background: "linear-gradient(135deg,#06FFE0 0%,#00B8D4 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {isPL ? "biznes." : "business."}
            </span>
          </h2>
          <div className="mt-6 max-w-none text-base md:text-lg leading-relaxed" style={{ color: "#3C4A55", hyphens: "auto" }}>
            <p className="text-justify">
              {isPL
                ? "Posiadamy kompetencje do realizacji najbardziej wymagających projektów, ale naszą prawdziwą wartością dodaną jest uważność na głos klienta. Doświadczenie nauczyło nas jednego — najlepsze rozwiązania rodzą się z wyciągania wniosków."
                : "We have the competence to deliver the most demanding projects, but our real added value is listening closely to the client. Experience has taught us one thing — the best solutions are born from lessons learned."}
            </p>
          </div>
        </Reveal>

        {/* 2-column layout: horizontal timeline on left, blueprint chart on right */}
        <div className="sc-av2__layout" data-testid="about-v2-layout">
          {/* LEFT column: horizontal process timeline */}
          <div className="sc-av2__timeline" data-testid="about-v2-timeline">
            {/* Connecting flow line behind the nodes */}
            <div
              className="sc-av2__flow"
              aria-hidden="true"
              style={{
                "--flow-progress": `${((activeIndex + 1) / STAGES.length) * 100}%`,
              }}
            />

            {STAGES.map((s, idx) => {
              const isActive = s.id === active;
              const isPast   = idx <  activeIndex;
              return (
                <React.Fragment key={s.id}>
                  {idx > 0 && (
                    <div
                      className={`sc-av2__arrow ${idx <= activeIndex ? "is-past" : ""}`}
                      aria-hidden="true"
                    >
                      <ArrowDown size={18} strokeWidth={2.2} />
                    </div>
                  )}
                  <button
                    type="button"
                    onMouseEnter={() => setActive(s.id)}
                    onFocus={() => setActive(s.id)}
                    onClick={() => setActive(s.id)}
                    className={`sc-av2__stage ${isActive ? "is-active" : ""} ${isPast ? "is-past" : ""}`}
                    data-testid={`about-v2-stage-${s.id}`}
                  >
                    <span className="sc-av2__stage-node" aria-hidden="true">
                      <span className="sc-av2__stage-node-inner" />
                    </span>
                    <span className="sc-av2__stage-step">
                      {String(idx + 1).padStart(2, "0")} · {isPL ? s.stepPL : s.stepEN}
                    </span>
                    <span className="sc-av2__stage-title">
                      {isPL ? s.label_pl : s.label_en}
                    </span>
                    <span className="sc-av2__stage-desc">
                      {isPL ? s.desc_pl : s.desc_en}
                    </span>
                    <span className="sc-av2__stage-badges">
                      {(isPL ? s.badges_pl : s.badges_en).map((b) => (
                        <span key={b} className="sc-av2__stage-badge">
                          {b}
                        </span>
                      ))}
                    </span>
                  </button>
                </React.Fragment>
              );
            })}
          </div>

          {/* RIGHT column: blueprint panel for the active stage */}
          <div className="sc-av2__bpwrap" data-testid="about-v2-blueprint-wrap">
            <BlueprintPanel
              stage={activeStage}
              index={activeIndex}
              total={STAGES.length}
              lang={lang}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Proces;
