import React, { useState } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { Ear, PenTool, FileText, Rocket, LifeBuoy } from "lucide-react";
import Reveal from "@/components/Reveal";
import useSectionParallax from "@/hooks/useSectionParallax";

/**
 * ProcessRackSection — dark section presenting a large 42U server rack
 * containing a KVM tray + monitor, servers, switches, storage array and
 * tape library. Users click one of the 5 process steps and the KVM
 * monitor renders the corresponding phase copy; the matching rack unit
 * is highlighted to visually anchor the story.
 */

const COPY = {
  pl: {
    section_label: "Jak budujemy projekt",
    title: "Od pierwszej rozmowy",
    title_accent: "do 24/7 serwisu.",
    subtitle:
      "Każde wdrożenie SMARTCLOUT ma tę samą strukturę: słuchamy, projektujemy, wyceniamy, uruchamiamy i pilnujemy. Kliknij etap, żeby zobaczyć co robimy na każdym kroku.",
    steps: [
      {
        id: "consult",
        Icon: Ear,
        title: "Konsultacja",
        highlight: "kvm",
        monitor_title: "01 · KONSULTACJA",
        monitor_lines: [
          "> Warsztaty z zespołem klienta.",
          "> Inwentaryzacja obecnej infrastruktury.",
          "> Identyfikacja wąskich gardeł i celów biznesowych.",
          "> Definicja SLA, RTO/RPO i budżetu.",
        ],
      },
      {
        id: "design",
        Icon: PenTool,
        title: "Projekt",
        highlight: "server",
        monitor_title: "02 · PROJEKT",
        monitor_lines: [
          "> Architektura serwerów, sieci i macierzy.",
          "> Warstwa backupu, DR, cyberbezpieczeństwa.",
          "> Diagramy L1/L2/L3 i dokumentacja HLD/LLD.",
          "> Weryfikacja z producentami sprzętu.",
        ],
      },
      {
        id: "quote",
        Icon: FileText,
        title: "Wycena",
        highlight: "storage",
        monitor_title: "03 · WYCENA",
        monitor_lines: [
          "> Konfiguracje sprzętu (nowe / refab).",
          "> BOM licencji i wsparcia producenta.",
          "> Rozliczenie CAPEX / OPEX / leasing.",
          "> Bezpłatne warianty i optymalizacje.",
        ],
      },
      {
        id: "deploy",
        Icon: Rocket,
        title: "Wdrożenie",
        highlight: "switch",
        monitor_title: "04 · WDROŻENIE",
        monitor_lines: [
          "> Staging w naszym lab, testy funkcjonalne.",
          "> Dostawa, montaż i okablowanie na site.",
          "> Migracja danych i cutover w oknie serwisowym.",
          "> Odbiór i przekazanie dokumentacji.",
        ],
      },
      {
        id: "service",
        Icon: LifeBuoy,
        title: "Serwis",
        highlight: "tape",
        monitor_title: "05 · SERWIS",
        monitor_lines: [
          "> Monitoring 24/7 z alarmami do NOC.",
          "> Kontrakt SLA z gwarantowanym czasem reakcji.",
          "> Regularne przeglądy i aktualizacje firmware.",
          "> Test fail-over i raport kwartalny.",
        ],
      },
    ],
  },
  en: {
    section_label: "How we build a project",
    title: "From the first call",
    title_accent: "to 24/7 support.",
    subtitle:
      "Every SMARTCLOUT deployment follows the same structure: listen, design, quote, deploy and watch over. Click a phase to see exactly what happens at each step.",
    steps: [
      {
        id: "consult",
        Icon: Ear,
        title: "Consulting",
        highlight: "kvm",
        monitor_title: "01 · CONSULTING",
        monitor_lines: [
          "> Workshops with the customer team.",
          "> Inventory of the current infrastructure.",
          "> Identify bottlenecks and business goals.",
          "> Define SLA, RTO/RPO and budget.",
        ],
      },
      {
        id: "design",
        Icon: PenTool,
        title: "Design",
        highlight: "server",
        monitor_title: "02 · DESIGN",
        monitor_lines: [
          "> Server, network and storage architecture.",
          "> Backup, DR and cybersecurity layer.",
          "> L1/L2/L3 diagrams and HLD/LLD docs.",
          "> Verification with hardware vendors.",
        ],
      },
      {
        id: "quote",
        Icon: FileText,
        title: "Quote",
        highlight: "storage",
        monitor_title: "03 · QUOTE",
        monitor_lines: [
          "> Hardware configurations (new / refab).",
          "> BOM of licenses and vendor support.",
          "> CAPEX / OPEX / lease breakdown.",
          "> Alternative options and optimizations.",
        ],
      },
      {
        id: "deploy",
        Icon: Rocket,
        title: "Deployment",
        highlight: "switch",
        monitor_title: "04 · DEPLOYMENT",
        monitor_lines: [
          "> Staging in our lab, functional tests.",
          "> Delivery, mounting and cabling on-site.",
          "> Data migration and cut-over in change window.",
          "> Sign-off and documentation handover.",
        ],
      },
      {
        id: "service",
        Icon: LifeBuoy,
        title: "Service",
        highlight: "tape",
        monitor_title: "05 · SERVICE",
        monitor_lines: [
          "> 24/7 monitoring with alerts to NOC.",
          "> SLA contract with guaranteed response time.",
          "> Regular reviews and firmware updates.",
          "> Fail-over tests and quarterly report.",
        ],
      },
    ],
  },
};

const RACK_UNITS = [
  { key: "kvm", label: "KVM · CONSOLE", u: 1, kind: "kvm" },
  { key: "server", label: "SERVER · SR-2U", u: 2, kind: "server" },
  { key: "server", label: "SERVER · SR-2U", u: 2, kind: "server" },
  { key: "switch", label: "SW · 48P", u: 1, kind: "switch" },
  { key: "switch", label: "SW · 24P", u: 1, kind: "switch" },
  { key: "storage", label: "STG · 24× NVMe", u: 3, kind: "storage" },
  { key: "gap", label: "", u: 1, kind: "gap" },
  { key: "tape", label: "LTO · LIBRARY", u: 5, kind: "tape" },
  { key: "gap", label: "", u: 2, kind: "gap" },
];

const ProcessRackSection = () => {
  const { lang } = useLang();
  const copy = COPY[lang] || COPY.pl;
  const [activeIdx, setActiveIdx] = useState(0);
  const active = copy.steps[activeIdx];
  const parallaxRef = useSectionParallax();

  return (
    <section
      id="process"
      data-testid="process-section"
      ref={parallaxRef}
      className="relative w-full overflow-hidden"
      style={{ background: "#040709", color: "#E8F4F5" }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(55% 55% at 20% 25%, rgba(6,255,224,0.05) 0%, rgba(6,255,224,0) 60%)," +
            " radial-gradient(50% 60% at 85% 75%, rgba(6,184,212,0.04) 0%, rgba(6,184,212,0) 60%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-28">
        <Reveal>
          <div
            className="flex items-center gap-4 text-[12px] uppercase tracking-[0.34em]"
            style={{ color: "#7CC4C0" }}
          >
            <span className="inline-block h-px w-12" style={{ background: "#49ADA5" }} />
            {copy.section_label}
          </div>
          <h2
            data-testid="process-title"
            className="mt-5 text-4xl md:text-6xl font-semibold leading-[1.02] tracking-tight text-white max-w-4xl"
          >
            {copy.title}{" "}
            <span className="font-semibold" style={{ color: "#06FFE0" }}>
              {copy.title_accent}
            </span>
          </h2>
          <p className="mt-6 max-w-3xl text-lg md:text-xl leading-relaxed text-white/70">
            {copy.subtitle}
          </p>
        </Reveal>

        <div className="mt-14 md:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Rack visualization */}
          <div className="lg:col-span-7">
            <div className="sc-rack" data-testid="process-rack">
              <div className="sc-rack__frame">
                {/* Top ventilation */}
                <div className="sc-rack__vents" aria-hidden="true">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <span key={i} className="sc-rack__vent" />
                  ))}
                </div>

                {/* U slots */}
                <div className="sc-rack__slots">
                  {RACK_UNITS.map((unit, idx) => {
                    const isActive = unit.kind === active.highlight;
                    return (
                      <div
                        key={idx}
                        className={`sc-rack-unit sc-rack-unit--${unit.kind} ${isActive ? "is-active" : ""}`}
                        style={{ "--u": unit.u }}
                        data-testid={`rack-unit-${unit.kind}-${idx}`}
                      >
                        {unit.kind === "kvm" && (
                          <div className="sc-rack-unit__inner sc-rack-unit__kvm">
                            <span className="sc-rack-unit__kvm-tray" />
                            <span className="sc-rack-unit__label">{unit.label}</span>
                            <span className="sc-rack-unit__leds">
                              <span className="sc-rack-unit__led is-on" />
                              <span className="sc-rack-unit__led" />
                            </span>
                          </div>
                        )}
                        {unit.kind === "server" && (
                          <div className="sc-rack-unit__inner sc-rack-unit__server">
                            <span className="sc-rack-unit__ears" aria-hidden="true">
                              <span /><span />
                            </span>
                            <span className="sc-rack-unit__bays">
                              {Array.from({ length: 8 }).map((_, i) => (
                                <span key={i} className={`sc-rack-unit__bay ${i % 3 === 0 ? "is-on" : ""}`} />
                              ))}
                            </span>
                            <span className="sc-rack-unit__label">{unit.label}</span>
                          </div>
                        )}
                        {unit.kind === "switch" && (
                          <div className="sc-rack-unit__inner sc-rack-unit__switch">
                            <span className="sc-rack-unit__label">{unit.label}</span>
                            <span className="sc-rack-unit__ports" aria-hidden="true">
                              {Array.from({ length: 18 }).map((_, i) => (
                                <span key={i} className="sc-rack-unit__port" />
                              ))}
                            </span>
                          </div>
                        )}
                        {unit.kind === "storage" && (
                          <div className="sc-rack-unit__inner sc-rack-unit__storage">
                            <span className="sc-rack-unit__label">{unit.label}</span>
                            <span className="sc-rack-unit__drives">
                              {Array.from({ length: 24 }).map((_, i) => (
                                <span key={i} className={`sc-rack-unit__drive ${i % 6 === 1 ? "is-on" : ""}`} />
                              ))}
                            </span>
                          </div>
                        )}
                        {unit.kind === "tape" && (
                          <div className="sc-rack-unit__inner sc-rack-unit__tape">
                            <span className="sc-rack-unit__tape-face">
                              <span className="sc-rack-unit__tape-window" aria-hidden="true">
                                {Array.from({ length: 8 }).map((_, i) => (
                                  <span key={i} className="sc-rack-unit__tape-cart" />
                                ))}
                              </span>
                              <span className="sc-rack-unit__label">{unit.label}</span>
                            </span>
                          </div>
                        )}
                        {unit.kind === "gap" && (
                          <div className="sc-rack-unit__inner sc-rack-unit__gap" aria-hidden="true" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* KVM monitor floats above the rack */}
              <div className="sc-kvm-monitor" data-testid="kvm-monitor">
                <div className="sc-kvm-monitor__frame">
                  <div className="sc-kvm-monitor__scanlines" aria-hidden="true" />
                  <div className="sc-kvm-monitor__content">
                    <div className="sc-kvm-monitor__header">
                      <span className="sc-kvm-monitor__prompt">smartclout@rack:~$</span>
                      <span className="sc-kvm-monitor__title">{active.monitor_title}</span>
                    </div>
                    <ul className="sc-kvm-monitor__lines">
                      {active.monitor_lines.map((line, i) => (
                        <li key={i} className="sc-kvm-monitor__line">{line}</li>
                      ))}
                      <li className="sc-kvm-monitor__cursor" aria-hidden="true">_</li>
                    </ul>
                  </div>
                </div>
                <div className="sc-kvm-monitor__stand" aria-hidden="true">
                  <span className="sc-kvm-monitor__neck" />
                  <span className="sc-kvm-monitor__base" />
                </div>
              </div>
            </div>
          </div>

          {/* Steps timeline */}
          <div className="lg:col-span-5">
            <ol className="sc-process-steps" data-testid="process-steps">
              {copy.steps.map((step, i) => {
                const Icon = step.Icon;
                const isActive = i === activeIdx;
                return (
                  <li key={step.id}>
                    <button
                      type="button"
                      onClick={() => setActiveIdx(i)}
                      className={`sc-process-step ${isActive ? "is-active" : ""}`}
                      data-testid={`process-step-${step.id}`}
                      aria-pressed={isActive}
                    >
                      <span className="sc-process-step__num">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="sc-process-step__icon">
                        <Icon size={20} strokeWidth={1.7} />
                      </span>
                      <span className="sc-process-step__title">{step.title}</span>
                      <span className="sc-process-step__arrow" aria-hidden="true">→</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessRackSection;
