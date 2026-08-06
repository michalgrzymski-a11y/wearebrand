import React, { useState } from "react";
import { useLang } from "@/i18n/LanguageContext";
import Reveal from "@/components/Reveal";
import useSectionParallax from "@/hooks/useSectionParallax";

/**
 * Proces — compact 3-step process.
 * Header (eyebrow + title + paragraph), then a slim tab-bar with 3 stages
 * and a single active-stage card below. No chart, no blueprint panel.
 */

const STAGES = [
  {
    id: "listen",
    stepPL: "Słuchamy",
    stepEN: "Listen",
    label_pl: "Uważność",
    label_en: "Attentiveness",
    desc_pl:
      "Rozpoczynamy każdy projekt od uważnej rozmowy — poznajemy Twoje procesy, ludzi, budżet i realia biznesowe.",
    desc_en:
      "Every project starts with careful conversation — we learn your processes, people, budget and business context.",
    badges_pl: ["Discovery", "Workshopy 1-on-1", "Mapowanie procesów"],
    badges_en: ["Discovery", "1-on-1 workshops", "Process mapping"],
    metrics_pl: [
      { k: "Format",   v: "Workshopy 1-on-1" },
      { k: "Rezultat", v: "Discovery Report" },
      { k: "Czas",     v: "2–4 tyg." },
    ],
    metrics_en: [
      { k: "Format",      v: "1-on-1 workshops" },
      { k: "Deliverable", v: "Discovery report" },
      { k: "Timeframe",   v: "2–4 weeks" },
    ],
  },
  {
    id: "analyse",
    stepPL: "Analizujemy",
    stepEN: "Analyse",
    label_pl: "Holistyczne spojrzenie",
    label_en: "Holistic view",
    desc_pl:
      "Konfrontujemy stan zastany z best practice. Widzimy IT jako jedną całość — compute, storage, sieć, backup i security.",
    desc_en:
      "We benchmark the current state against best practices. IT is one ecosystem — compute, storage, network, backup and security.",
    badges_pl: ["Architektura", "Integracja", "Bezpieczeństwo"],
    badges_en: ["Architecture", "Integration", "Security"],
    metrics_pl: [
      { k: "Standardy", v: "ISO 27001 · NIS2 · GDPR" },
      { k: "Rezultat",  v: "HLD / LLD" },
      { k: "Czas",      v: "3–6 tyg." },
    ],
    metrics_en: [
      { k: "Standards",   v: "ISO 27001 · NIS2 · GDPR" },
      { k: "Deliverable", v: "HLD / LLD" },
      { k: "Timeframe",   v: "3–6 weeks" },
    ],
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
      { k: "TCO",       v: "−18 do −35 %" },
      { k: "SLA",       v: "99.95–99.99 %" },
      { k: "RTO / RPO", v: "≤ 15 / 5 min" },
    ],
    metrics_en: [
      { k: "TCO",       v: "−18 to −35 %" },
      { k: "SLA",       v: "99.95–99.99 %" },
      { k: "RTO / RPO", v: "≤ 15 / 5 min" },
    ],
  },
];

const Proces = () => {
  const { lang } = useLang();
  const parallaxRef = useSectionParallax();
  const [active, setActive] = useState(STAGES[0].id);
  const isPL = lang === "pl";
  const activeStage = STAGES.find((s) => s.id === active) || STAGES[0];
  const activeIndex = STAGES.findIndex((s) => s.id === active);
  const metrics = isPL ? activeStage.metrics_pl : activeStage.metrics_en;
  const badges = isPL ? activeStage.badges_pl : activeStage.badges_en;

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

        {/* Slim horizontal tab bar */}
        <div className="sc-proc__tabs" data-testid="proces-tabs" role="tablist">
          {STAGES.map((s, idx) => {
            const isActive = s.id === active;
            const isPast = idx < activeIndex;
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(s.id)}
                className={`sc-proc__tab ${isActive ? "is-active" : ""} ${isPast ? "is-past" : ""}`}
                data-testid={`proces-tab-${s.id}`}
              >
                <span className="sc-proc__tab-num">{String(idx + 1).padStart(2, "0")}</span>
                <span className="sc-proc__tab-step">{isPL ? s.stepPL : s.stepEN}</span>
              </button>
            );
          })}
        </div>

        {/* Active stage — a single compact card */}
        <div
          className="sc-proc__card"
          data-testid={`proces-card-${activeStage.id}`}
          key={activeStage.id}
        >
          <div className="sc-proc__card-head">
            <span className="sc-proc__card-index">{String(activeIndex + 1).padStart(2, "0")} / {String(STAGES.length).padStart(2, "0")}</span>
            <h3 className="sc-proc__card-title">
              {isPL ? activeStage.label_pl : activeStage.label_en}
            </h3>
          </div>

          <p className="sc-proc__card-desc">
            {isPL ? activeStage.desc_pl : activeStage.desc_en}
          </p>

          <div className="sc-proc__card-badges">
            {badges.map((b) => (
              <span key={b} className="sc-proc__card-badge">{b}</span>
            ))}
          </div>

          <div className="sc-proc__card-metrics">
            {metrics.map((m) => (
              <div key={m.k} className="sc-proc__card-metric">
                <span className="sc-proc__card-metric-k">{m.k}</span>
                <span className="sc-proc__card-metric-v">{m.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Proces;
