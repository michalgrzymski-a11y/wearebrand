import React, { useState } from "react";
import { useLang } from "@/i18n/LanguageContext";
import {
  ClipboardList,
  DraftingCompass,
  FlaskConical,
  Rocket,
  Wrench,
  TrendingUp,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import useSectionParallax from "@/hooks/useSectionParallax";

/**
 * RackServerSection — vertical stack of 6 × 1U rack servers.
 * Each server represents one phase of our project lifecycle with a client.
 * Hover a server → the row expands in place, revealing the phase name and
 * a short copy inside the same rack unit. Other rows compress.
 */

const PHASES = [
  { id: "audit",    Icon: ClipboardList,   u: 1 },
  { id: "design",   Icon: DraftingCompass, u: 2 },
  { id: "poc",      Icon: FlaskConical,    u: 3 },
  { id: "deploy",   Icon: Rocket,          u: 4 },
  { id: "operate",  Icon: Wrench,          u: 5 },
  { id: "grow",     Icon: TrendingUp,      u: 6 },
];

const COPY = {
  pl: {
    section_label: "Cykl życia projektu",
    title:         "Sześć rackowych jednostek. Jedna historia współpracy.",
    subtitle:      "Nasze projekty są długoterminowe. Najedź na wybraną fazę, aby zobaczyć co dokładnie robimy dla Ciebie w tym etapie.",
    chassis_code:  "SC · 6U · LIFECYCLE",
    phases: {
      audit:   { name: "Audyt & Analiza",           desc: "Zaczynamy od słuchania. Analizujemy Twoje procesy, ograniczenia i cele, potem inwentaryzujemy infrastrukturę i identyfikujemy ryzyka." },
      design:  { name: "Projekt architektury",      desc: "Projektujemy rozwiązanie szyte na miarę — dokument HLD/LLD, dobór warstw, kalkulacja TCO i harmonogram wdrożenia." },
      poc:     { name: "PoC & Testy",               desc: "Zanim wydasz jedną złotówkę, sprawdzamy założenia w środowisku testowym. Realne obciążenia, realne dane, realne wyniki." },
      deploy:  { name: "Wdrożenie",                 desc: "Wdrażamy zgodnie z projektem, ale zawsze z buforem na rzeczywistość. Migracja z zerowym oknem serwisowym tam, gdzie to możliwe." },
      operate: { name: "Utrzymanie & Serwis",       desc: "Codzienne operacje, monitoring 24/7, patch management, plany DR. Twoje IT po prostu działa — bez zaskoczeń." },
      grow:    { name: "Optymalizacja & Rozwój",    desc: "Regularne przeglądy, optymalizacja kosztów, roadmap kolejnych etapów. Rośniemy razem z Twoim biznesem." },
    },
  },
  en: {
    section_label: "Project lifecycle",
    title:         "Six rack units. One partnership story.",
    subtitle:      "Our projects are long-term. Hover a phase to see exactly what we do for you at that stage.",
    chassis_code:  "SC · 6U · LIFECYCLE",
    phases: {
      audit:   { name: "Audit & Analysis",         desc: "We start by listening. We analyse your processes, constraints and goals, then inventory the infrastructure and identify the risks." },
      design:  { name: "Architecture Design",      desc: "We design a bespoke solution — HLD/LLD documents, layer selection, TCO calculation and rollout plan." },
      poc:     { name: "PoC & Testing",            desc: "Before you spend a złoty, we validate assumptions in a test environment. Real workloads, real data, real results." },
      deploy:  { name: "Deployment",               desc: "We deploy per design, always with a buffer for reality. Zero-downtime migration wherever possible." },
      operate: { name: "Operations & Support",     desc: "Daily operations, 24/7 monitoring, patch management, DR plans. Your IT just works — no surprises." },
      grow:    { name: "Optimization & Growth",    desc: "Regular reviews, cost optimization, roadmap for the next phases. We grow together with your business." },
    },
  },
};

const RackServerSection = () => {
  const { lang } = useLang();
  const copy = COPY[lang] || COPY.pl;
  const [hovered, setHovered] = useState(null);
  const parallaxRef = useSectionParallax();

  return (
    <section
      id="lifecycle"
      data-testid="lifecycle-section"
      ref={parallaxRef}
      className="relative w-full overflow-hidden"
      style={{ background: "#040709", color: "#E8F4F5" }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-70 pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 55% at 15% 40%, rgba(6, 255, 224, 0.05) 0%, rgba(6, 255, 224, 0) 60%)," +
            " radial-gradient(50% 60% at 85% 60%, rgba(6, 184, 212, 0.05) 0%, rgba(6, 184, 212, 0) 60%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 py-14 md:py-20">
        <Reveal>
          <div
            className="flex items-center gap-4 text-[11px] uppercase tracking-[0.32em]"
            style={{ color: "#7CC4C0" }}
          >
            <span className="inline-block h-px w-10" style={{ background: "#49ADA5" }} />
            {copy.section_label}
          </div>
          <h2
            data-testid="lifecycle-title"
            className="mt-4 text-3xl md:text-5xl font-semibold leading-[1.05] tracking-tight text-white max-w-3xl"
          >
            {copy.title}
          </h2>
          <p
            data-testid="lifecycle-subtitle"
            className="mt-4 max-w-2xl text-base md:text-lg text-white/70"
          >
            {copy.subtitle}
          </p>
        </Reveal>

        <div
          data-testid="lifecycle-chassis"
          className={`sc-rserv mt-12 md:mt-14 ${hovered ? "is-hovered" : ""}`}
          onMouseLeave={() => setHovered(null)}
        >
          <div className="sc-rserv__ear sc-rserv__ear--l" aria-hidden="true">
            <span className="sc-rserv__mount" />
            <span className="sc-rserv__mount" />
            <span className="sc-rserv__mount" />
          </div>

          <div className="sc-rserv__body">
            <div className="sc-rserv__head">
              <span className="sc-rserv__led sc-rserv__led--pwr" />
              <span className="sc-rserv__code">{copy.chassis_code}</span>
              <span className="sc-rserv__led sc-rserv__led--act" />
            </div>

            <div className="sc-rserv__units">
              {PHASES.map((phase, idx) => {
                const Icon = phase.Icon;
                const isActive = hovered === phase.id;
                const info = copy.phases[phase.id];
                return (
                  <button
                    key={phase.id}
                    type="button"
                    className={`sc-runit ${isActive ? "is-active" : ""}`}
                    onMouseEnter={() => setHovered(phase.id)}
                    onFocus={() => setHovered(phase.id)}
                    aria-label={info.name}
                    data-testid={`lifecycle-unit-${phase.id}`}
                  >
                    <span className="sc-runit__ubadge">
                      {String(phase.u).padStart(2, "0")}U
                    </span>
                    <span className="sc-runit__leds" aria-hidden="true">
                      <span className="sc-runit__led sc-runit__led--pwr" />
                      <span className="sc-runit__led sc-runit__led--hdd" />
                      <span className="sc-runit__led sc-runit__led--net" />
                    </span>
                    <span className="sc-runit__icon">
                      <Icon size={20} strokeWidth={1.7} />
                    </span>
                    <span className="sc-runit__vents" aria-hidden="true">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <span key={i} />
                      ))}
                    </span>
                    <span className="sc-runit__body">
                      <span
                        className="sc-runit__name"
                        data-testid={`lifecycle-name-${phase.id}`}
                      >
                        {info.name}
                      </span>
                      <span
                        className="sc-runit__desc"
                        data-testid={`lifecycle-desc-${phase.id}`}
                      >
                        {info.desc}
                      </span>
                    </span>
                    <span className="sc-runit__eject" aria-hidden="true" />
                  </button>
                );
              })}
            </div>

            <div className="sc-rserv__foot" aria-hidden="true">
              <span className="sc-rserv__foot-line" />
              <span className="sc-rserv__foot-code">
                IT SMARTCLOUT · JOURNEY v2.0
              </span>
            </div>
          </div>

          <div className="sc-rserv__ear sc-rserv__ear--r" aria-hidden="true">
            <span className="sc-rserv__mount" />
            <span className="sc-rserv__mount" />
            <span className="sc-rserv__mount" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default RackServerSection;
