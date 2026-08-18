import React from "react";
import { useLang } from "@/i18n/LanguageContext";
import {
  Briefcase,
  Newspaper,
  Factory,
  Landmark,
  RadioTower,
  Building2,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import useSectionParallax from "@/hooks/useSectionParallax";

/**
 * Sectors — market segments where SmartClout delivers IT.
 * Minimalist: monochrome outline icon + label + one-liner description.
 * Sits between Portfolio and Partners sections.
 */
const ICONS = {
  services: Briefcase,
  media: Newspaper,
  manufacturing: Factory,
  finance: Landmark,
  telecom: RadioTower,
  government: Building2,
};

const SectorsSection = () => {
  const { t } = useLang();
  const parallaxRef = useSectionParallax();

  return (
    <section
      id="sectors"
      data-testid="sectors-section"
      ref={parallaxRef}
      className="relative w-full overflow-hidden"
      style={{ background: "#FFFFFF", color: "#1C2833" }}
    >
      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 py-14 md:py-20">
        <Reveal>
          <div
            className="flex items-center gap-4 text-[11px] uppercase tracking-[0.32em]"
            style={{ color: "#0C5C62" }}
          >
            <span className="inline-block h-px w-10" style={{ background: "#00B8D4" }} />
            {t.sectors.section_label}
          </div>
          <h2
            data-testid="sectors-title"
            className="mt-4 text-4xl md:text-6xl font-semibold leading-[1.02] tracking-tight max-w-3xl"
            style={{ color: "#0C5C62" }}
          >
            {t.sectors.title}
          </h2>
          <p
            data-testid="sectors-subtitle"
            className="mt-5 max-w-2xl text-base md:text-lg leading-relaxed"
            style={{ color: "rgba(28,40,51,0.75)" }}
          >
            {t.sectors.subtitle}
          </p>
        </Reveal>

        <div className="mt-14 md:mt-16 grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
          {t.sectors.items.map((s, i) => {
            const Icon = ICONS[s.id];
            return (
              <Reveal key={s.id} delay={i * 60}>
                <div
                  className="sc-sector"
                  data-testid={`sector-${s.id}`}
                >
                  <span className="sc-sector__icon">
                    <Icon size={30} strokeWidth={1.5} />
                  </span>
                  <span className="sc-sector__name">{s.name}</span>
                  <span className="sc-sector__desc">{s.desc}</span>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SectorsSection;
