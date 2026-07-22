import React, { useState } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { Award, LifeBuoy, Handshake, Users } from "lucide-react";
import Reveal from "@/components/Reveal";
import useSectionParallax from "@/hooks/useSectionParallax";

/**
 * ValuesSection — a horizontal disk-array module inspired by NetApp FAS A30.
 * Chassis renders 12 drive bays (2U shelf style). Four bays are "value drives":
 * each represents one core company value and carries an icon + activity LED.
 * Hovering a value-drive:
 *   • The drive lifts out slightly (translateY-up)
 *   • The bay LED locks green
 *   • The info panel below the chassis updates with the value title + copy
 * The remaining 8 bays are decorative fillers (unlit drives) that give the
 * shelf a realistic density.
 */

const VALUES_LAYOUT = [
  { type: "filler", i: 0 },
  { type: "value",  id: "competence" },   // slot 1
  { type: "filler", i: 2 },
  { type: "filler", i: 3 },
  { type: "value",  id: "service" },      // slot 4
  { type: "filler", i: 5 },
  { type: "filler", i: 6 },
  { type: "value",  id: "partnership" },  // slot 7
  { type: "filler", i: 8 },
  { type: "filler", i: 9 },
  { type: "value",  id: "trust" },        // slot 10
  { type: "filler", i: 11 },
];

const VALUE_ICONS = {
  competence:  Award,
  service:     LifeBuoy,
  partnership: Handshake,
  trust:       Users,
};

const VALUES_COPY = {
  pl: {
    section_label: "Nasze wartości",
    title:         "Cztery dyski. Jedna filozofia.",
    subtitle:      "Najedź na dysk, aby odczytać wartość zapisaną na nośniku.",
    idle_hint:     "Wybierz dysk, aby wyświetlić jego zawartość",
    chassis_code:  "SC · 12-BAY · VALUES ARRAY",
    values: {
      competence: {
        name: "Kompetencje i doświadczenie",
        desc: "Od 20 lat budujemy IT dla klientów — wiedza wyrasta z projektów, nie z ulotek.",
      },
      service: {
        name: "Obsługa IT / Serwis",
        desc: "Pomagamy w rozwoju Twojego IT oraz w codziennym zarządzaniu środowiskiem.",
      },
      partnership: {
        name: "Partnerstwa technologiczne",
        desc: "Oferujemy, wdrażamy i utrzymujemy technologie największych i najbardziej stabilnych producentów na świecie.",
      },
      trust: {
        name: "Zaufanie klientów",
        desc: "130+ zaufanych klientów i ponad 400 zamkniętych projektów — najlepszy dowód, że działamy tak, jak obiecujemy.",
      },
    },
  },
  en: {
    section_label: "Our values",
    title:         "Four drives. One philosophy.",
    subtitle:      "Hover a drive to read the value stored on it.",
    idle_hint:     "Pick a drive to reveal its contents",
    chassis_code:  "SC · 12-BAY · VALUES ARRAY",
    values: {
      competence: {
        name: "Competence & Experience",
        desc: "20 years of building IT for real customers — knowledge grows from projects, not from brochures.",
      },
      service: {
        name: "IT Operations & Support",
        desc: "We help you grow your IT and manage the day-to-day environment.",
      },
      partnership: {
        name: "Technology Partnerships",
        desc: "We deliver, deploy and operate the technologies of the world's largest and most stable vendors.",
      },
      trust: {
        name: "Client Trust",
        desc: "130+ trusted clients and 400+ closed projects — the best proof that we deliver what we promise.",
      },
    },
  },
};

const ValuesSection = () => {
  const { lang } = useLang();
  const copy = VALUES_COPY[lang] || VALUES_COPY.pl;
  const [hovered, setHovered] = useState(null);
  const parallaxRef = useSectionParallax();

  const activeValue = hovered ? copy.values[hovered] : null;

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

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 py-24 md:py-32">
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
            className="mt-4 text-3xl md:text-5xl font-semibold leading-[1.05] tracking-tight text-white max-w-3xl"
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

        {/* Disk array chassis */}
        <div
          data-testid="values-array"
          className="sc-varray mt-12 md:mt-14"
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
                return (
                  <button
                    key={slot.id}
                    type="button"
                    className={`sc-vbay sc-vbay--value ${isActive ? "is-active" : ""}`}
                    onMouseEnter={() => setHovered(slot.id)}
                    onFocus={() => setHovered(slot.id)}
                    onMouseLeave={() => setHovered(null)}
                    onBlur={() => setHovered(null)}
                    data-testid={`value-drive-${slot.id}`}
                    aria-label={copy.values[slot.id].name}
                  >
                    <span className="sc-vbay__led sc-vbay__led--on" />
                    <span className="sc-vbay__handle" aria-hidden="true" />
                    <span className="sc-vbay__icon">
                      <Icon size={20} strokeWidth={1.7} />
                    </span>
                    <span className="sc-vbay__ridges" />
                    <span className="sc-vbay__label">
                      {copy.values[slot.id].name.split(" ")[0].toUpperCase()}
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

        {/* Info panel — reveals the currently-hovered value */}
        <div
          data-testid="values-info"
          className={`sc-vinfo ${activeValue ? "is-open" : ""}`}
        >
          {activeValue ? (
            <div className="sc-vinfo__inner">
              <div className="sc-vinfo__kicker">
                {lang === "pl" ? "Odczyt wartości" : "Value read-out"}
                <span className="sc-vinfo__blink" aria-hidden="true" />
              </div>
              <div
                data-testid="values-info-name"
                className="sc-vinfo__name"
              >
                {activeValue.name}
              </div>
              <p
                data-testid="values-info-desc"
                className="sc-vinfo__desc"
              >
                {activeValue.desc}
              </p>
            </div>
          ) : (
            <div className="sc-vinfo__idle" data-testid="values-info-idle">
              <span className="sc-vinfo__blink" aria-hidden="true" />
              {copy.idle_hint}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
