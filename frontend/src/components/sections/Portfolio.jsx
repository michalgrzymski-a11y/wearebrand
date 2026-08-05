import React from "react";
import { useLang } from "@/i18n/LanguageContext";
import { Server, ShieldCheck, Code2, Building2 } from "lucide-react";
import Reveal from "@/components/Reveal";
import useSectionParallax from "@/hooks/useSectionParallax";

const ICONS = [Server, ShieldCheck, Code2, Building2];

const Portfolio = () => {
  const { t } = useLang();
  const parallaxRef = useSectionParallax();

  return (
    <section
      id="portfolio"
      data-testid="portfolio-section"
      ref={parallaxRef}
      className="relative w-full overflow-hidden"
      style={{ background: "#F8FAFA", color: "#1C2833" }}
    >
      {/* Ambient radial glows matching Proces + TCO */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(50% 55% at 15% 20%, rgba(6,255,224,0.08) 0%, rgba(6,255,224,0) 60%)," +
            " radial-gradient(50% 60% at 85% 80%, rgba(0,184,212,0.06) 0%, rgba(0,184,212,0) 60%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-24">
        <Reveal>
          <div className="mb-14">
            <div
              className="flex items-center gap-4 text-[11px] uppercase tracking-[0.32em]"
              style={{ color: "#0C5C62" }}
            >
              <span className="inline-block h-px w-10" style={{ background: "#49ADA5" }} />
              {t.portfolio.section_label}
            </div>
            <h2
              data-testid="portfolio-title"
              className="mt-4 max-w-3xl text-2xl md:text-3xl font-semibold leading-[1.05] tracking-tight"
              style={{ color: "#0C5C62" }}
            >
              {t.portfolio.title_pre}{" "}
              <span
                className="font-semibold"
                style={{
                  background: "linear-gradient(135deg,#06FFE0 0%,#00B8D4 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {t.portfolio.title_accent}
              </span>
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-7">
          {t.portfolio.tiles.map((tile, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <Reveal key={tile.title} delay={i * 140}>
                <div
                  data-testid={`portfolio-tile-${i}`}
                  className="sc-bento group"
                >
                  <div className="flex items-start justify-between">
                    <div className="sc-bento__icon">
                      <Icon size={24} strokeWidth={1.7} />
                    </div>
                    <span
                      className="text-[10px] uppercase tracking-[0.32em]"
                      style={{ color: "#49ADA5" }}
                    >
                      {tile.subtitle}
                    </span>
                  </div>

                  <h3
                    className="mt-8 text-xl md:text-2xl font-semibold tracking-tight"
                    style={{ color: "#0C5C62" }}
                  >
                    {tile.title}
                  </h3>

                  <ul className="mt-6 flex flex-wrap gap-2">
                    {tile.items.map((item) => (
                      <li key={item} className="sc-chip">{item}</li>
                    ))}
                  </ul>

                  <div className="sc-bento__glow" />
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
