import React from "react";
import { useLang } from "@/i18n/LanguageContext";
import Reveal from "@/components/Reveal";
import HERO_PARTNERS from "@/data/heroPartners";

/**
 * PartnersSection — dedicated "strategic partners" section with a two-row
 * marquee of vendor logos. Placed on the home page right above ContactSection.
 * Dark aesthetic matching the rest of the site (cyan accents).
 */
const PartnersSection = () => {
  const { t } = useLang();
  const half = Math.ceil(HERO_PARTNERS.length / 2);
  const row1 = HERO_PARTNERS.slice(0, half);
  const row2 = HERO_PARTNERS.slice(half);

  return (
    <section
      id="partners"
      data-testid="partners-section"
      className="relative w-full overflow-hidden"
      style={{ background: "#040709", color: "#E8F4F5" }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(55% 55% at 30% 40%, rgba(6,255,224,0.06) 0%, rgba(6,255,224,0) 60%)," +
            " radial-gradient(45% 55% at 70% 60%, rgba(0,184,212,0.06) 0%, rgba(0,184,212,0) 60%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 py-16 md:py-24">
        <Reveal>
          <div
            className="flex items-center gap-4 text-[12px] uppercase tracking-[0.34em]"
            style={{ color: "#7CC4C0" }}
          >
            <span className="inline-block h-px w-12" style={{ background: "#49ADA5" }} />
            {t.partners.section_label}
          </div>
          <h2
            data-testid="partners-title"
            className="mt-5 text-4xl md:text-6xl font-semibold leading-[1.02] tracking-tight text-white max-w-4xl"
          >
            {t.partners.title}
          </h2>
          <p className="mt-6 max-w-3xl text-lg md:text-xl leading-relaxed text-white/70">
            {t.partners.subtitle}
          </p>
        </Reveal>

        <div className="sc-partners__wrap">
          <div
            className="sc-partners__row-mask"
            style={{
              maskImage: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)",
              WebkitMaskImage: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)",
            }}
          >
            <div className="sc-marquee sc-marquee--rtl sc-marquee--slow sc-partners__row">
              {[...row1, ...row1].map((p, i) => (
                <div
                  key={`r1-${p.name}-${i}`}
                  className={`sc-partners__item ${p.highlight ? "is-highlight" : ""}`}
                  data-testid={`partners-logo-r1-${i}`}
                >
                  <img src={p.logo} alt={p.name} className="sc-partners__logo" loading="lazy" draggable="false" />
                </div>
              ))}
            </div>
          </div>

          <div
            className="sc-partners__row-mask"
            style={{
              maskImage: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)",
              WebkitMaskImage: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)",
            }}
          >
            <div className="sc-marquee sc-marquee--slow sc-partners__row">
              {[...row2, ...row2].map((p, i) => (
                <div
                  key={`r2-${p.name}-${i}`}
                  className="sc-partners__item"
                  data-testid={`partners-logo-r2-${i}`}
                >
                  <img src={p.logo} alt={p.name} className="sc-partners__logo" loading="lazy" draggable="false" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
