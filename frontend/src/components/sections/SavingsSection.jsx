import React from "react";
import { useLang } from "@/i18n/LanguageContext";
import { Recycle, KeySquare, GaugeCircle, LineChart } from "lucide-react";
import Reveal from "@/components/Reveal";
import useSectionParallax from "@/hooks/useSectionParallax";

/**
 * SavingsSection — light-background section positioned right after the
 * refab hardware section. Communicates that despite rising component
 * prices, SMARTCLOUT actively helps clients cut TCO through refab
 * hardware, license optimization, hardware lifecycle management and
 * continuous rightsizing.
 */

const COPY = {
  pl: {
    section_label: "Optymalizacja kosztów",
    title: "Ceny rosną.",
    title_accent: "Twój rachunek nie musi.",
    subtitle:
      "Od 2023 roku ceny serwerów, macierzy i pamięci enterprise wzrosły dwucyfrowo. Naszą rolą jest wchodzić w rozmowę o budżecie IT znacznie głębiej niż tylko oferta — projektujemy tak, żeby każda złotówka pracowała mocniej.",
    metric_value: "TCO",
    metric_unit: "-30% ↓",
    metric_label: "typowa oszczędność po audycie SMARTCLOUT",
    metric_note:
      "Konkretna liczba zależy od skali, wieku sprzętu i architektury. Nigdy nie obiecujemy widełek bez wglądu w Twoje środowisko.",
    pillars: [
      {
        id: "refab",
        Icon: Recycle,
        title: "Refabrykowany hardware enterprise",
        desc: "Certyfikowane serwery, macierze i przełączniki z pełną gwarancją, w cenie ułamka listy producenta. Ta sama wydajność, dostępność od ręki.",
      },
      {
        id: "license",
        Icon: KeySquare,
        title: "Konsolidacja i optymalizacja licencji",
        desc: "Audyt subskrypcji, downgrade nadmiarowych edycji, migracja do właściwych metryk. W wielu przypadkach redukcja OPEX o kilkadziesiąt procent.",
      },
      {
        id: "lifecycle",
        Icon: GaugeCircle,
        title: "Zarządzanie cyklem życia sprzętu",
        desc: "Kupujemy odsprzedajemy i redystrybuujemy sprzęt tak, by amortyzacja i moment wymiany były pod kontrolą, a nie narzucone przez producenta.",
      },
      {
        id: "rightsize",
        Icon: LineChart,
        title: "Monitoring i rightsizing",
        desc: "Realne metryki obciążenia zamiast przewymiarowanych projektów. Skalujemy zasoby dokładnie do potrzeb — bez przepłacania na zapas.",
      },
    ],
    cta: "Umów audyt kosztów IT",
  },
  en: {
    section_label: "Cost optimization",
    title: "Prices are rising.",
    title_accent: "Your bill doesn't have to.",
    subtitle:
      "Since 2023 enterprise server, storage and memory prices have grown double-digit year over year. Our job is to enter the IT budget conversation far deeper than just a quote — we design so every dollar works harder.",
    metric_value: "TCO",
    metric_unit: "-30% ↓",
    metric_label: "typical savings after a SMARTCLOUT audit",
    metric_note:
      "The exact number depends on scale, hardware age and architecture. We never promise a range without visibility into your environment.",
    pillars: [
      {
        id: "refab",
        Icon: Recycle,
        title: "Refabricated enterprise hardware",
        desc: "Certified servers, storage and switches with full warranty, at a fraction of vendor list price. Same performance, off-the-shelf availability.",
      },
      {
        id: "license",
        Icon: KeySquare,
        title: "License consolidation and optimization",
        desc: "Subscription audit, downgrade of excessive editions, migration to the right metrics. In many cases OPEX drops by tens of percent.",
      },
      {
        id: "lifecycle",
        Icon: GaugeCircle,
        title: "Hardware lifecycle management",
        desc: "We buy, resell and redistribute hardware so depreciation and refresh moments are under your control, not the vendor's.",
      },
      {
        id: "rightsize",
        Icon: LineChart,
        title: "Monitoring and rightsizing",
        desc: "Real workload metrics instead of oversized designs. We scale resources exactly to demand — no overpaying „just in case”.",
      },
    ],
    cta: "Book an IT cost audit",
  },
};

const SavingsSection = () => {
  const { lang } = useLang();
  const copy = COPY[lang] || COPY.pl;
  const parallaxRef = useSectionParallax();

  return (
    <section
      id="savings"
      data-testid="savings-section"
      ref={parallaxRef}
      className="relative w-full overflow-hidden"
      style={{ background: "#F8FAFA", color: "#1C2833" }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(45% 45% at 90% 10%, rgba(6,255,224,0.10) 0%, rgba(6,255,224,0) 60%)," +
            " radial-gradient(45% 55% at 5% 90%, rgba(0,184,212,0.08) 0%, rgba(0,184,212,0) 60%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-6">
            <Reveal>
              <div
                className="flex items-center gap-4 text-[12px] uppercase tracking-[0.34em]"
                style={{ color: "#0C5C62" }}
              >
                <span className="inline-block h-px w-12" style={{ background: "#49ADA5" }} />
                {copy.section_label}
              </div>
              <h2
                data-testid="savings-title"
                className="mt-5 text-4xl md:text-6xl font-semibold leading-[1.02] tracking-tight max-w-3xl"
              >
                {copy.title}{" "}
                <span
                  className="font-semibold"
                  style={{
                    background: "linear-gradient(135deg,#06FFE0 0%,#00B8D4 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {copy.title_accent}
                </span>
              </h2>
              <p
                className="mt-6 max-w-2xl text-lg md:text-xl leading-relaxed"
                style={{ color: "rgba(28,40,51,0.72)" }}
              >
                {copy.subtitle}
              </p>
            </Reveal>

            <div className="sc-savings-metric" data-testid="savings-metric">
              <div className="sc-savings-metric__frame">
                <span className="sc-savings-metric__kicker">
                  {copy.metric_value}
                </span>
                <span className="sc-savings-metric__value">{copy.metric_unit}</span>
                <span className="sc-savings-metric__label">{copy.metric_label}</span>
              </div>
              <p className="sc-savings-metric__note">{copy.metric_note}</p>
            </div>
          </div>

          <div className="lg:col-span-6">
            <ul className="sc-savings-pillars" data-testid="savings-pillars">
              {copy.pillars.map((p) => {
                const Icon = p.Icon;
                return (
                  <li
                    key={p.id}
                    className="sc-savings-pillar"
                    data-testid={`savings-pillar-${p.id}`}
                  >
                    <span className="sc-savings-pillar__icon">
                      <Icon size={22} strokeWidth={1.7} />
                    </span>
                    <div>
                      <h3 className="sc-savings-pillar__title">{p.title}</h3>
                      <p className="sc-savings-pillar__desc">{p.desc}</p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <a href="#contact" data-testid="savings-cta" className="sc-savings-cta">
              {copy.cta}
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SavingsSection;
