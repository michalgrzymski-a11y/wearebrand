import React from "react";
import { useLang } from "@/i18n/LanguageContext";
import { Server, ShieldCheck, Code2, Wrench, ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import useSectionParallax from "@/hooks/useSectionParallax";

/**
 * TapeLibrarySection (Portfolio) — LIGHT redesign.
 * Clean, accessible portfolio grid: four category cards on white background.
 * Each card carries an icon, category title, a short description and a
 * bullet list of concrete items (from t.portfolio.tiles[].items).
 * No metaphors, no dark cyan — designed to be scanned in seconds.
 */

const CATEGORY_ICONS = [Server, ShieldCheck, Code2, Wrench];

const TapeLibrarySection = () => {
  const { t } = useLang();
  const tiles = t.portfolio.tiles;
  const parallaxRef = useSectionParallax();

  return (
    <section
      id="tape-library"
      data-testid="tapelib-section"
      ref={parallaxRef}
      className="relative w-full overflow-hidden sc-portfolio--light"
      style={{ background: "#F7FAFA", color: "#1C2833" }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(65% 55% at 15% 20%, rgba(73, 173, 165, 0.08) 0%, rgba(73, 173, 165, 0) 60%)," +
            " radial-gradient(55% 60% at 85% 80%, rgba(12, 92, 98, 0.06) 0%, rgba(12, 92, 98, 0) 60%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 py-16 md:py-24">
        <Reveal>
          <div
            className="flex items-center gap-4 text-[11px] uppercase tracking-[0.32em]"
            style={{ color: "#0C5C62" }}
          >
            <span className="inline-block h-px w-10" style={{ background: "#49ADA5" }} />
            {t.portfolio.section_label}
          </div>
          <h2
            data-testid="portfolio-title"
            className="mt-5 text-4xl md:text-6xl font-semibold leading-[1.02] tracking-tight max-w-4xl"
            style={{ color: "#0C5C62" }}
          >
            {t.portfolio.title}
          </h2>
          {t.portfolio.subtitle ? (
            <p className="mt-5 max-w-2xl text-base md:text-lg" style={{ color: "#3C4A55" }}>
              {t.portfolio.subtitle}
            </p>
          ) : null}
        </Reveal>

        <div className="sc-pf__grid" data-testid="portfolio-grid">
          {tiles.map((tile, i) => {
            const Icon = CATEGORY_ICONS[i] || Server;
            return (
              <Reveal key={tile.title}>
                <article
                  className="sc-pf__card"
                  data-testid={`portfolio-card-${i}`}
                >
                  <header className="sc-pf__card-head">
                    <span className="sc-pf__card-idx">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="sc-pf__card-icon">
                      <Icon size={22} strokeWidth={1.7} />
                    </span>
                  </header>

                  <h3 className="sc-pf__card-title">{tile.title}</h3>
                  {tile.subtitle ? (
                    <p className="sc-pf__card-sub">{tile.subtitle}</p>
                  ) : null}

                  {tile.items && tile.items.length > 0 && (
                    <ul className="sc-pf__card-items">
                      {tile.items.map((it) => (
                        <li key={it} className="sc-pf__card-item">
                          <span className="sc-pf__card-dot" />
                          {it}
                        </li>
                      ))}
                    </ul>
                  )}

                  <a href="#contact" className="sc-pf__card-cta">
                    {t.portfolio.card_cta || "Zapytaj o szczegóły"}
                    <ArrowUpRight size={14} strokeWidth={2} />
                  </a>

                  <span className="sc-pf__bracket sc-pf__bracket--tl" aria-hidden="true" />
                  <span className="sc-pf__bracket sc-pf__bracket--br" aria-hidden="true" />
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TapeLibrarySection;
