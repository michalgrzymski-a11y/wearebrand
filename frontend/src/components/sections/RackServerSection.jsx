import React from "react";
import { useLang } from "@/i18n/LanguageContext";
import { CircleDollarSign, ShieldCheck, Timer, Recycle } from "lucide-react";
import Reveal from "@/components/Reveal";
import useSectionParallax from "@/hooks/useSectionParallax";

/**
 * RackServerSection — hero visual: large front-view 2U server chassis
 * (drive bays, LEDs, ventilation, brand strip) paired with a "why refab"
 * value proposition column. No clickable interior components — the story
 * is purely narrative: refabricated hardware is a smart business choice.
 */

const COPY = {
  pl: {
    section_label: "Sprzęt refabrykowany",
    title: "Enterprise-owy sprzęt.",
    title_accent: "Rozsądna cena.",
    subtitle:
      "Refabrykacja to fabryczna regeneracja serwerów, macierzy i komponentów sieciowych. Ta sama jakość, jaką znasz z premiery — z gwarancją SMARTCLOUT i dostępnością od ręki.",
    server_code: "SC · 2U · REFAB HW",
    server_status: "STATUS · READY · CERTIFIED",
    values: [
      {
        id: "cost",
        Icon: CircleDollarSign,
        title: "40–60% niższy CAPEX",
        desc: "Ta sama wydajność Xeon Gold/Silver, DIMM ECC, dysków SAS/NVMe — za ułamek ceny listy producenta.",
      },
      {
        id: "warranty",
        Icon: ShieldCheck,
        title: "Gwarancja 12–36 mies.",
        desc: "Testy funkcjonalne, burn-in i pełna gwarancja SMARTCLOUT. Wsparcie inżynierskie w Polsce.",
      },
      {
        id: "availability",
        Icon: Timer,
        title: "Dostępność od ręki",
        desc: "Magazyn w Polsce, konfiguracje pod projekt, brak długich leadtime’ów typowych dla nowych zamówień.",
      },
      {
        id: "esg",
        Icon: Recycle,
        title: "Odpowiedzialny cykl życia",
        desc: "Ponowne wykorzystanie sprzętu enterprise ogranicza e-waste i ślad węglowy działu IT.",
      },
    ],
    cta: "Zapytaj o wycenę refab",
  },
  en: {
    section_label: "Refabricated hardware",
    title: "Enterprise hardware.",
    title_accent: "Sensible price.",
    subtitle:
      "Refabrication is a factory-grade regeneration of servers, storage and networking gear. The same quality you know from launch — with SMARTCLOUT warranty and off-the-shelf availability.",
    server_code: "SC · 2U · REFAB HW",
    server_status: "STATUS · READY · CERTIFIED",
    values: [
      {
        id: "cost",
        Icon: CircleDollarSign,
        title: "40–60% lower CAPEX",
        desc: "Same Xeon Gold/Silver, ECC DIMMs and SAS/NVMe drives — at a fraction of the vendor list price.",
      },
      {
        id: "warranty",
        Icon: ShieldCheck,
        title: "12–36 months warranty",
        desc: "Functional tests, burn-in and full SMARTCLOUT warranty. Engineering support in Poland.",
      },
      {
        id: "availability",
        Icon: Timer,
        title: "Available off the shelf",
        desc: "Polish warehouse, project-specific configurations, no long lead-times typical for new orders.",
      },
      {
        id: "esg",
        Icon: Recycle,
        title: "Responsible lifecycle",
        desc: "Reusing enterprise hardware cuts e-waste and reduces the carbon footprint of your IT department.",
      },
    ],
    cta: "Ask for a refab quote",
  },
};

const RackServerSection = () => {
  const { lang } = useLang();
  const copy = COPY[lang] || COPY.pl;
  const parallaxRef = useSectionParallax();

  return (
    <section
      id="hardware"
      data-testid="hardware-section"
      ref={parallaxRef}
      className="relative w-full overflow-hidden"
      style={{ background: "#040709", color: "#E8F4F5" }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-70 pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 55% at 20% 30%, rgba(6,255,224,0.06) 0%, rgba(6,255,224,0) 60%)," +
            " radial-gradient(50% 60% at 85% 70%, rgba(6,184,212,0.05) 0%, rgba(6,184,212,0) 60%)",
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
            data-testid="hardware-title"
            className="mt-5 text-4xl md:text-6xl font-semibold leading-[1.02] tracking-tight text-white max-w-4xl"
          >
            {copy.title}{" "}
            <span
              className="italic font-medium"
              style={{ fontFamily: '"Fraunces", serif', color: "#06FFE0" }}
            >
              {copy.title_accent}
            </span>
          </h2>
          <p className="mt-6 max-w-3xl text-lg md:text-xl leading-relaxed text-white/70">
            {copy.subtitle}
          </p>
        </Reveal>

        <div className="mt-14 md:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: front-view 2U server visualization */}
          <div className="lg:col-span-7">
            <div className="sc-refab" data-testid="refab-server">
              <div className="sc-refab__header">
                <div className="sc-refab__code">{copy.server_code}</div>
                <div className="sc-refab__status">
                  <span className="sc-refab__dot sc-refab__dot--pwr" />
                  <span className="sc-refab__dot sc-refab__dot--sys" />
                  <span className="sc-refab__dot sc-refab__dot--net" />
                  <span className="sc-refab__status-text">{copy.server_status}</span>
                </div>
              </div>

              {/* Server body */}
              <div className="sc-refab__body">
                {/* Left ear with mount holes and brand strip */}
                <div className="sc-refab__ear" aria-hidden="true">
                  <span className="sc-refab__mount" />
                  <span className="sc-refab__mount" />
                  <span className="sc-refab__mount" />
                  <span className="sc-refab__mount" />
                </div>

                {/* Front panel */}
                <div className="sc-refab__front" aria-hidden="true">
                  <div className="sc-refab__brand">
                    <span className="sc-refab__brand-strip" />
                    <span className="sc-refab__brand-name">SMARTCLOUT</span>
                    <span className="sc-refab__brand-model">REFAB · SR-2U</span>
                  </div>

                  {/* Drive bays — 2 rows × 12 */}
                  <div className="sc-refab__bays">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <span
                        key={i}
                        className={`sc-refab__bay ${i % 7 === 0 ? "is-lit" : ""} ${i % 5 === 0 ? "is-act" : ""}`}
                      >
                        <span className="sc-refab__bay-handle" />
                        <span className="sc-refab__bay-led" />
                      </span>
                    ))}
                  </div>

                  {/* Vents */}
                  <div className="sc-refab__vents">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <span key={i} className="sc-refab__vent" />
                    ))}
                  </div>
                </div>

                {/* Right ear with power btn + USB */}
                <div className="sc-refab__ear sc-refab__ear--r" aria-hidden="true">
                  <span className="sc-refab__mount" />
                  <span className="sc-refab__mount" />
                  <span className="sc-refab__pwr" />
                  <span className="sc-refab__usb" />
                </div>
              </div>

              <div className="sc-refab__foot" aria-hidden="true">
                <span className="sc-refab__foot-line" />
                <span className="sc-refab__foot-code">
                  IT SMARTCLOUT · REFAB · TESTED &amp; CERTIFIED
                </span>
              </div>
            </div>
          </div>

          {/* Right: value cards */}
          <div className="lg:col-span-5">
            <ul className="sc-refab-values" data-testid="refab-values">
              {copy.values.map((v) => {
                const Icon = v.Icon;
                return (
                  <li
                    key={v.id}
                    className="sc-refab-value"
                    data-testid={`refab-value-${v.id}`}
                  >
                    <span className="sc-refab-value__icon">
                      <Icon size={20} strokeWidth={1.7} />
                    </span>
                    <div>
                      <h3 className="sc-refab-value__title">{v.title}</h3>
                      <p className="sc-refab-value__desc">{v.desc}</p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <a
              href="#contact"
              data-testid="refab-cta"
              className="sc-refab-cta"
            >
              {copy.cta}
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RackServerSection;
