import React from "react";
import { useLang } from "@/i18n/LanguageContext";
import {
  Compass,
  Layers,
  Target,
  CheckCircle2,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import useSectionParallax from "@/hooks/useSectionParallax";
import AuroraBorealis from "@/components/fx/AuroraBorealis";

/**
 * AboutV2Section — alternative layout for the "Trzy filary, jedno podejście"
 * story. Three pillars are shown side-by-side as parallel cards (no tabbing),
 * each carrying its own blueprint-style metrics and mini load bar. Keeps the
 * bright/light aesthetic of the original AboutSection.
 */

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
      { k: "Format", v: "Workshopy 1-on-1" },
      { k: "Rezultat", v: "Discovery Report" },
      { k: "Czas", v: "2–4 tygodnie" },
    ],
    metrics_en: [
      { k: "Format", v: "1-on-1 workshops" },
      { k: "Deliverable", v: "Discovery report" },
      { k: "Timeframe", v: "2–4 weeks" },
    ],
    load: 62,
    accent: "#22B8B0",
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
      { k: "Rezultat", v: "Architektura HLD/LLD" },
    ],
    metrics_en: [
      { k: "Layers", v: "Compute · Storage · Net · Sec · BR" },
      { k: "Standards", v: "ISO 27001 · NIS2 · GDPR" },
      { k: "Deliverable", v: "HLD/LLD architecture" },
    ],
    load: 84,
    accent: "#0C7A82",
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
      { k: "Redukcja TCO", v: "18–35 %" },
      { k: "Uptime SLA", v: "99.95–99.99 %" },
      { k: "RTO / RPO", v: "≤ 15 min / ≤ 5 min" },
    ],
    metrics_en: [
      { k: "TCO reduction", v: "18–35 %" },
      { k: "Uptime SLA", v: "99.95–99.99 %" },
      { k: "RTO / RPO", v: "≤ 15 min / ≤ 5 min" },
    ],
    load: 91,
    accent: "#0C5C62",
  },
];

const AboutV2Section = () => {
  const { lang } = useLang();
  const parallaxRef = useSectionParallax();

  const isPL = lang === "pl";

  return (
    <section
      id="about-v2"
      data-testid="about-v2-section"
      ref={parallaxRef}
      className="relative w-full overflow-hidden"
      style={{ background: "#FFFFFF", color: "#1C2833" }}
    >
      {/* Same bright ambient as original, at lower intensity */}
      <div className="sc-slayer-wrap" aria-hidden="true">
        <div data-parallax="-0.18">
          <AuroraBorealis tone="light" intensity={0.8} />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 py-14 md:py-20">
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
            className="mt-4 text-4xl md:text-6xl font-semibold leading-[1.02] tracking-tight max-w-3xl"
            style={{ color: "#0C5C62" }}
          >
            {isPL ? "Trzy filary, jedno podejście." : "Three pillars, one approach."}
          </h2>
          <p className="mt-5 max-w-2xl text-base md:text-lg" style={{ color: "#3C4A55" }}>
            {isPL
              ? "Każdy projekt IT SmartClout stoi na trzech niezależnych, równoprawnych filarach — dopiero razem układają się w spójny sposób pracy."
              : "Every IT SmartClout project rests on three independent, equal pillars — only together they form a coherent way of working."}
          </p>
        </Reveal>

        {/* Three parallel cards */}
        <div className="sc-a2__grid" data-testid="about-v2-grid">
          {PILLARS.map((p, idx) => (
            <Reveal key={p.id}>
              <article
                className="sc-a2__card"
                data-testid={`about-v2-pillar-${p.id}`}
                style={{ "--a2-accent": p.accent }}
              >
                <header className="sc-a2__head">
                  <span className="sc-a2__idx">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="sc-a2__icon">
                    <p.Icon size={22} strokeWidth={1.7} />
                  </span>
                </header>

                <h3 className="sc-a2__label">
                  {isPL ? p.label_pl : p.label_en}
                </h3>
                <p className="sc-a2__desc">
                  {isPL ? p.desc_pl : p.desc_en}
                </p>

                {/* Blueprint mini-panel inline */}
                <div className="sc-a2__panel" aria-hidden="true">
                  <div className="sc-a2__panel-head">
                    <span>{isPL ? "Zaawansowanie" : "Coverage"}</span>
                    <b>{p.load} %</b>
                  </div>
                  <div className="sc-a2__panel-bar">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <span
                        key={i}
                        className={(i / 20) * 100 < p.load ? "on" : ""}
                      />
                    ))}
                  </div>
                </div>

                {/* Metric rows */}
                <ul className="sc-a2__metrics">
                  {(isPL ? p.metrics_pl : p.metrics_en).map((m) => (
                    <li key={m.k} className="sc-a2__metric">
                      <span className="sc-a2__metric-k">{m.k}</span>
                      <span className="sc-a2__metric-dots" aria-hidden="true" />
                      <span className="sc-a2__metric-v">{m.v}</span>
                    </li>
                  ))}
                </ul>

                {/* Tag badges */}
                <div className="sc-a2__badges">
                  {(isPL ? p.badges_pl : p.badges_en).map((b) => (
                    <span key={b} className="sc-a2__badge">
                      <CheckCircle2 size={11} strokeWidth={2.4} />
                      {b}
                    </span>
                  ))}
                </div>

                {/* Corner brackets for the "spec sheet" feel */}
                <span className="sc-a2__bracket sc-a2__bracket--tl" aria-hidden="true" />
                <span className="sc-a2__bracket sc-a2__bracket--tr" aria-hidden="true" />
                <span className="sc-a2__bracket sc-a2__bracket--bl" aria-hidden="true" />
                <span className="sc-a2__bracket sc-a2__bracket--br" aria-hidden="true" />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutV2Section;
