import React, { useState } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { Award, LifeBuoy, Handshake, Users, FolderKanban, GraduationCap } from "lucide-react";
import Reveal from "@/components/Reveal";
import useSectionParallax from "@/hooks/useSectionParallax";

/**
 * Wartosci — horizontal 12-bay disk shelf (FAS A30 inspired).
 * Six value "drives" are visible in the chassis; hover expands one drive in
 * place while the rest collapse to slim strips. Below the array a longer
 * descriptive paragraph explains the SmartClout approach.
 */

// 6 value drives + 6 filler bays = 12 total. Values placed at every second
// slot so each drive stands out visually.
const VALUES_LAYOUT = [
  { type: "value",  id: "experience"     },
  { type: "filler", i: 1 },
  { type: "value",  id: "clients"        },
  { type: "filler", i: 3 },
  { type: "value",  id: "projects"       },
  { type: "filler", i: 5 },
  { type: "value",  id: "certifications" },
  { type: "filler", i: 7 },
  { type: "value",  id: "partnership"    },
  { type: "filler", i: 9 },
  { type: "value",  id: "service"        },
  { type: "filler", i: 11 },
];

const VALUE_ICONS = {
  experience:     Award,
  clients:        Users,
  projects:       FolderKanban,
  partnership:    Handshake,
  service:        LifeBuoy,
  certifications: GraduationCap,
};

const COPY = {
  pl: {
    section_label: "Nasze wartości",
    title_pre:     "Kompetencje",
    title_accent:  "i Rzetelność.",
    chassis_code:  "SC · 12-BAY · VALUES ARRAY",
    story: [
      "Doświadczenie nauczyło nas jednego — najlepsze rozwiązania rodzą się z wyciągania wniosków.",
      "Projektujemy infrastrukturę „szytą na miarę” — chroni dane, przyspiesza biznes i szanuje budżet. Nie szukamy najdroższych rozwiązań, tylko tych najbardziej zoptymalizowanych.",
    ],
    values: {
      experience: {
        name:  "20+ lat doświadczenia",
        desc:  "Od dwóch dekad budujemy IT dla realnych klientów — wiedza wyrasta z projektów, nie z ulotek.",
        short: "20+ lat",
      },
      clients: {
        name:  "130+ klientów",
        desc:  "Ponad 130 zaufanych klientów — najlepszy dowód, że działamy tak, jak obiecujemy.",
        short: "130+ klientów",
      },
      projects: {
        name:  "600+ projektów",
        desc:  "Ponad 600 zamkniętych projektów — od jednorazowych wdrożeń po wieloletnie programy transformacji IT.",
        short: "600+ projektów",
      },
      partnership: {
        name:  "Partnerstwa technologiczne",
        desc:  "Oferujemy, wdrażamy i utrzymujemy technologie największych i najbardziej stabilnych producentów na świecie.",
        short: "Partnerstwa",
      },
      service: {
        name:  "Obsługa i serwis",
        desc:  "Pomagamy w rozwoju Twojego IT oraz w codziennym zarządzaniu środowiskiem — od monitoringu po SLA.",
        short: "Obsługa",
      },
      certifications: {
        name:  "400+ certyfikatów",
        desc:  "Ponad 400 uzyskanych certyfikatów potwierdzających nasze kompetencje — od inżynierów po architektów.",
        short: "400+ certyfikatów",
      },
    },
  },
  en: {
    section_label: "Our values",
    title_pre:     "Competence",
    title_accent:  "and Integrity.",
    chassis_code:  "SC · 12-BAY · VALUES ARRAY",
    story: [
      "Experience has taught us one thing — the best solutions are born from lessons learned.",
      "We design tailor-made infrastructure — one that protects data, accelerates business and respects the budget. We don't look for the most expensive solutions, only the most optimised ones.",
    ],
    values: {
      experience: {
        name:  "20+ years of experience",
        desc:  "For two decades we've been building IT for real customers — knowledge grows from projects, not from brochures.",
        short: "20+ years",
      },
      clients: {
        name:  "130+ clients",
        desc:  "More than 130 trusted clients — the best proof that we deliver what we promise.",
        short: "130+ clients",
      },
      projects: {
        name:  "600+ projects",
        desc:  "Over 600 closed projects — from one-off deployments to multi-year IT transformation programs.",
        short: "600+ projects",
      },
      partnership: {
        name:  "Technology partnerships",
        desc:  "We deliver, deploy and operate the technologies of the world's largest and most stable vendors.",
        short: "Partnerships",
      },
      service: {
        name:  "Service & support",
        desc:  "We help you grow your IT and manage the day-to-day environment — from monitoring to SLA.",
        short: "Service",
      },
      certifications: {
        name:  "400+ certifications",
        desc:  "More than 400 earned certifications backing our competence — from engineers to architects.",
        short: "400+ certs",
      },
    },
  },
};

const Wartosci = () => {
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
            className="mt-4 text-2xl md:text-3xl font-semibold leading-[1.05] tracking-tight text-white max-w-4xl"
          >
            {copy.title_pre}{" "}
            <span
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

        {/* Story paragraph — the SmartClout approach in prose */}
        <Reveal>
          <div className="sc-values__story" data-testid="values-story">
            {copy.story.map((para, i) => (
              <p key={i} className="sc-values__story-p" data-testid={`values-story-p-${i}`}>
                {para}
              </p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Wartosci;
