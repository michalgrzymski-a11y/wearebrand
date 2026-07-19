import React, { useEffect, useRef, useState } from "react";
import { useLang } from "@/i18n/LanguageContext";
import {
  Compass,
  Layers,
  Target,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
import Reveal from "@/components/Reveal";

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
      {/* header row: index + status */}
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

      {/* title */}
      <div className="sc-blueprint__title">
        {lang === "pl" ? pillar.label_pl : pillar.label_en}
      </div>

      {/* segmented progress */}
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

      {/* spec rows */}
      <div className="sc-blueprint__specs">
        {metrics.map((m) => (
          <div key={m.k} className="sc-blueprint__spec">
            <span className="sc-blueprint__spec-k">{m.k}</span>
            <span className="sc-blueprint__spec-dots" aria-hidden="true" />
            <span className="sc-blueprint__spec-v">{m.v}</span>
          </div>
        ))}
      </div>

      {/* mini schematic (SVG blueprint) */}
      <svg className="sc-blueprint__schema" viewBox="0 0 240 90" preserveAspectRatio="none">
        <defs>
          <linearGradient id="bp-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#49ADA5" stopOpacity="0" />
            <stop offset="20%" stopColor="#49ADA5" stopOpacity="1" />
            <stop offset="80%" stopColor="#49ADA5" stopOpacity="1" />
            <stop offset="100%" stopColor="#49ADA5" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* baseline */}
        <line x1="0" y1="75" x2="240" y2="75" stroke="url(#bp-line)" strokeWidth="0.6" strokeDasharray="1 3" />
        {/* activity curve based on pillar id */}
        <path
          d={
            pillar.id === "listen"
              ? "M0 70 L 40 66 L 80 55 L 120 60 L 160 45 L 200 50 L 240 40"
              : pillar.id === "holistic"
                ? "M0 70 L 40 60 L 80 40 L 120 45 L 160 25 L 200 30 L 240 15"
                : "M0 70 L 40 55 L 80 42 L 120 30 L 160 22 L 200 15 L 240 8"
          }
          fill="none"
          stroke="#49ADA5"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* node dots */}
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
            fill="#49ADA5"
          />
        ))}
      </svg>

      {/* corner brackets — blueprint feel */}
      <span className="sc-blueprint__bracket sc-blueprint__bracket--tl" />
      <span className="sc-blueprint__bracket sc-blueprint__bracket--tr" />
      <span className="sc-blueprint__bracket sc-blueprint__bracket--bl" />
      <span className="sc-blueprint__bracket sc-blueprint__bracket--br" />
    </div>
  );
};

/**
 * NarrativeReveal — editorial word-by-word cinematic reveal.
 *  - Splits each segment into words, each word animates staggered on scroll.
 *  - Accent segments render with mint color + subtle italic emphasis.
 *  - First word carries a large Fraunces drop-cap on the first character.
 */
const NarrativeReveal = ({ segments }) => {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setSeen(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Build a flat list of tokens across all segments while preserving type.
  let wordCounter = 0;
  const tokens = [];
  segments.forEach((seg, si) => {
    const parts = seg.text.split(/(\s+)/); // keep whitespace
    parts.forEach((part, pi) => {
      if (part.match(/^\s+$/)) {
        tokens.push({ kind: "space", key: `s-${si}-${pi}`, value: part });
      } else if (part.length > 0) {
        tokens.push({
          kind: "word",
          key: `w-${si}-${pi}`,
          value: part,
          type: seg.type || "plain",
          index: wordCounter++,
        });
      }
    });
  });

  return (
    <p
      ref={ref}
      data-testid="about-narrative"
      className={`sc-narr ${seen ? "is-in" : ""}`}
    >
      {tokens.map((tk, i) => {
        if (tk.kind === "space") return tk.value;
        const isFirstWord = tk.index === 0;
        const cls =
          tk.type === "accent"
            ? "sc-narr__w sc-narr__w--accent"
            : "sc-narr__w";
        const delay = Math.min(tk.index * 22, 900);

        // First word: split into dropcap (first char) + rest of the word.
        if (isFirstWord && tk.value.length >= 1) {
          const head = tk.value.charAt(0);
          const tail = tk.value.slice(1);
          return (
            <span
              key={tk.key}
              className={cls}
              style={{ transitionDelay: `${delay}ms` }}
            >
              <span className="sc-narr__dropcap">{head}</span>
              {tail}
            </span>
          );
        }
        return (
          <span
            key={tk.key}
            className={cls}
            style={{ transitionDelay: `${delay}ms` }}
          >
            {tk.value}
          </span>
        );
      })}
    </p>
  );
};

const NARRATIVE_PL = [
  { text: "W", type: "plain" },
  { text: "IT SMARTCLOUT", type: "accent" },
  {
    text:
      "doświadczenie nauczyło nas jednego: najlepsze rozwiązania rodzą się z wyciągania wniosków. Jako partner",
    type: "plain",
  },
  { text: "NetApp", type: "accent" },
  {
    text:
      ", wykraczamy poza standardowe wdrożenia. Posiadamy kompetencje do realizacji najbardziej wymagających projektów, ale naszą prawdziwą wartością dodaną jest",
    type: "plain",
  },
  { text: "uważność na głos klienta", type: "accent" },
  {
    text:
      ". Dzięki holistycznemu spojrzeniu na ekosystem IT, projektujemy infrastrukturę",
    type: "plain",
  },
  { text: "„szytą na miarę”", type: "accent" },
  {
    text:
      "– taką, która chroni dane, przyspiesza biznes i szanuje budżet. Nie szukamy najdroższych rozwiązań, szukamy tych",
    type: "plain",
  },
  { text: "najbardziej zoptymalizowanych", type: "accent" },
  { text: ".", type: "plain" },
];

const NARRATIVE_EN = [
  { text: "At", type: "plain" },
  { text: "IT SMARTCLOUT", type: "accent" },
  {
    text:
      "experience taught us one thing: the best solutions are born from drawing conclusions. As a",
    type: "plain",
  },
  { text: "NetApp", type: "accent" },
  {
    text:
      "partner we go beyond standard rollouts. We have the competencies to deliver the most demanding projects, but our true added value is",
    type: "plain",
  },
  { text: "attentiveness to the client's voice", type: "accent" },
  {
    text:
      ". Thanks to a holistic view of the IT ecosystem, we design",
    type: "plain",
  },
  { text: "“tailor-made”", type: "accent" },
  {
    text:
      "infrastructure – one that protects data, accelerates business and respects the budget. We do not seek the most expensive solutions, we seek the",
    type: "plain",
  },
  { text: "most optimised ones", type: "accent" },
  { text: ".", type: "plain" },
];

const AboutSection = () => {
  const { t, lang } = useLang();
  const [active, setActive] = useState(PILLARS[1].id);
  const activePillar = PILLARS.find((p) => p.id === active) || PILLARS[0];
  const activeIndex = PILLARS.findIndex((p) => p.id === active);
  const narrativeSegments = lang === "pl" ? NARRATIVE_PL : NARRATIVE_EN;

  return (
    <section
      id="about"
      data-testid="about-section"
      className="relative w-full"
      style={{ background: "#FFFFFF", color: "#1C2833" }}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-24 md:py-32">
        {/* 1. Section label */}
        <Reveal>
          <div
            className="flex items-center gap-4 text-[11px] uppercase tracking-[0.32em]"
            style={{ color: "#0C5C62" }}
          >
            <span className="inline-block h-px w-10" style={{ background: "#49ADA5" }} />
            {t.about.section_label}
          </div>
        </Reveal>

        {/* 2. Facts band directly under the label */}
        <Reveal>
          <div
            data-testid="about-metrics-band"
            className="sc-facts-band sc-facts-band--top mt-8"
          >
            {t.about.metrics.map((m, i) => (
              <div
                key={m.label}
                data-testid={`about-metric-${i}`}
                className="sc-facts-band__item"
              >
                <span className="sc-facts-band__val">{m.value}</span>
                <span className="sc-facts-band__lbl">{m.label}</span>
              </div>
            ))}
          </div>
        </Reveal>

        {/* 3. Editorial narrative with word-by-word cinematic reveal */}
        <div className="mt-14 md:mt-16 max-w-4xl">
          <NarrativeReveal segments={narrativeSegments} />
        </div>

        {/* 4. Title — Trzy filary, jedno podejście. */}
        <Reveal>
          <h2
            data-testid="about-narrative-title"
            className="mt-16 md:mt-20 text-3xl md:text-5xl font-semibold leading-[1.05] tracking-tight max-w-3xl"
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
