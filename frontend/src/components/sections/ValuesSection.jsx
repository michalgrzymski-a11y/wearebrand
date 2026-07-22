import React, { useState } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { Award, LifeBuoy, Handshake, Users } from "lucide-react";
import Reveal from "@/components/Reveal";
import useSectionParallax from "@/hooks/useSectionParallax";

/**
 * ValuesSection — horizontal 12-bay disk shelf (FAS A30 inspired).
 * On hover of a value drive, the hovered drive expands IN-PLACE inside the
 * chassis, revealing the value name + short description as its own content.
 * Filler drives + non-hovered value drives collapse to slim strips at the
 * far right of the chassis (flex-grow: 0.15 vs hovered flex-grow: 22).
 */

const VALUES_LAYOUT = [
  { type: "filler", i: 0 },
  { type: "value",  id: "competence" },
  { type: "filler", i: 2 },
  { type: "filler", i: 3 },
  { type: "value",  id: "service" },
  { type: "filler", i: 5 },
  { type: "filler", i: 6 },
  { type: "value",  id: "partnership" },
  { type: "filler", i: 8 },
  { type: "filler", i: 9 },
  { type: "value",  id: "trust" },
  { type: "filler", i: 11 },
];

const VALUE_ICONS = {
  competence:  Award,
  service:     LifeBuoy,
  partnership: Handshake,
  trust:       Users,
};

const COPY = {
  pl: {
    section_label: "Nasze wartości",
    title:         "Cztery dyski. Jedna filozofia.",
    subtitle:      "Najedź na dysk, aby odczytać wartość zapisaną na nośniku.",
    chassis_code:  "SC · 12-BAY · VALUES ARRAY",
    values: {
      competence: {
        name: "Kompetencje i doświadczenie",
        desc: "Od 20 lat budujemy IT dla klientów — wiedza wyrasta z projektów, nie z ulotek.",
        short: "20+ lat",
      },
      service: {
        name: "Obsługa IT / Serwis",
        desc: "Pomagamy w rozwoju Twojego IT oraz w codziennym zarządzaniu środowiskiem.",
        short: "Serwis",
      },
      partnership: {
        name: "Partnerstwa technologiczne",
        desc: "Oferujemy, wdrażamy i utrzymujemy technologie największych i najbardziej stabilnych producentów na świecie.",
        short: "Partner",
      },
      trust: {
        name: "Zaufanie klientów",
        desc: "130+ zaufanych klientów i ponad 400 zamkniętych projektów — najlepszy dowód, że działamy tak, jak obiecujemy.",
        short: "Zaufanie",
      },
    },
  },
  en: {
    section_label: "Our values",
    title:         "Four drives. One philosophy.",
    subtitle:      "Hover a drive to read the value stored on it.",
    chassis_code:  "SC · 12-BAY · VALUES ARRAY",
    values: {
      competence: {
        name: "Competence & Experience",
        desc: "20 years of building IT for real customers — knowledge grows from projects, not from brochures.",
        short: "20+ y.",
      },
      service: {
        name: "IT Operations & Support",
        desc: "We help you grow your IT and manage the day-to-day environment.",
        short: "Support",
      },
      partnership: {
        name: "Technology Partnerships",
        desc: "We deliver, deploy and operate the technologies of the world's largest and most stable vendors.",
        short: "Partner",
      },
      trust: {
        name: "Client Trust",
        desc: "130+ trusted clients and 400+ closed projects — the best proof that we deliver what we promise.",
        short: "Trust",
      },
    },
  },
};

const ValuesSection = () => {
  const { lang } = useLang();
  const copy = COPY[lang] || COPY.pl;
  const [hovered, setHovered] = useState(null);
  const parallaxRef = useSectionParallax();

  return (
    <section
      id="values"
      data-testid="values-section"
      ref={parallaxRef}
      className="relative w-full overflow-hidden"
      style={{ background: "#040709", color: "#E8F4F5" }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-70 pointer-events-none"
        style={{
          background:
            "radial-gradient(70% 55% at 20% 30%, rgba(6, 255, 224, 0.06) 0%, rgba(6, 255, 224, 0) 60%)," +
            " radial-gradient(50% 60% at 80% 70%, rgba(6, 184, 212, 0.05) 0%, rgba(6, 184, 212, 0) 60%)",
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
            data-testid="values-title"
            className="mt-4 text-4xl md:text-6xl font-semibold leading-[1.02] tracking-tight text-white max-w-3xl"
          >
            {copy.title}
          </h2>
          <p
            data-testid="values-subtitle"
            className="mt-4 max-w-2xl text-base md:text-lg text-white/70"
          >
            {copy.subtitle}
          </p>
        </Reveal>

        <div
          data-testid="values-array"
          className={`sc-varray mt-12 md:mt-14 ${hovered ? "is-hovered" : ""}`}
          onMouseLeave={() => setHovered(null)}
        >
          <div className="sc-varray__ear sc-varray__ear--l" aria-hidden="true">
            <span className="sc-varray__mount" />
            <span className="sc-varray__mount" />
          </div>

          <div className="sc-varray__body">
            <div className="sc-varray__head">
              <span className="sc-varray__led sc-varray__led--pwr" />
              <span className="sc-varray__code">{copy.chassis_code}</span>
              <span className="sc-varray__led sc-varray__led--act" />
            </div>

            <div className="sc-varray__bays">
              {VALUES_LAYOUT.map((slot, idx) => {
                if (slot.type === "filler") {
                  return (
                    <div
                      key={`f-${idx}`}
                      aria-hidden="true"
                      className="sc-vbay sc-vbay--filler"
                    >
                      <span className="sc-vbay__led" />
                      <span className="sc-vbay__ridges" />
                    </div>
                  );
                }
                const Icon = VALUE_ICONS[slot.id];
                const isActive = hovered === slot.id;
                const value = copy.values[slot.id];
                return (
                  <button
                    key={slot.id}
                    type="button"
                    className={`sc-vbay sc-vbay--value ${isActive ? "is-active" : ""}`}
                    onMouseEnter={() => setHovered(slot.id)}
                    onFocus={() => setHovered(slot.id)}
                    data-testid={`value-drive-${slot.id}`}
                    aria-label={value.name}
                  >
                    <span className="sc-vbay__led sc-vbay__led--on" />
                    <span className="sc-vbay__handle" aria-hidden="true" />
                    <span className="sc-vbay__ridges" />
                    <span className="sc-vbay__compact">
                      <span className="sc-vbay__icon">
                        <Icon size={20} strokeWidth={1.7} />
                      </span>
                      <span className="sc-vbay__label">{value.short}</span>
                    </span>
                    <span className="sc-vbay__expanded" aria-hidden={!isActive}>
                      <span className="sc-vbay__x-icon">
                        <Icon size={22} strokeWidth={1.7} />
                      </span>
                      <span className="sc-vbay__x-body">
                        <span
                          className="sc-vbay__x-name"
                          data-testid={`value-name-${slot.id}`}
                        >
                          {value.name}
                        </span>
                        <span
                          className="sc-vbay__x-desc"
                          data-testid={`value-desc-${slot.id}`}
                        >
                          {value.desc}
                        </span>
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="sc-varray__foot" aria-hidden="true">
              <span className="sc-varray__foot-line" />
              <span className="sc-varray__foot-code">IT SMARTCLOUT · CORE v1.0</span>
            </div>
          </div>

          <div className="sc-varray__ear sc-varray__ear--r" aria-hidden="true">
            <span className="sc-varray__mount" />
            <span className="sc-varray__mount" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
