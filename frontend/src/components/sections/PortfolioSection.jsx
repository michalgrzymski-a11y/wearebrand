import React from "react";
import { useLang } from "@/i18n/LanguageContext";
import { Server, ShieldCheck, Code2, Building2 } from "lucide-react";

const ICONS = [Server, ShieldCheck, Code2, Building2];

const PortfolioSection = () => {
  const { t } = useLang();

  return (
    <section
      id="portfolio"
      data-testid="portfolio-section"
      className="relative w-full"
      style={{ background: "#FFFFFF", color: "#1C2833" }}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-24 md:py-32">
        <div className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div
              className="flex items-center gap-4 text-[11px] uppercase tracking-[0.32em]"
              style={{ color: "#0C5C62" }}
            >
              <span className="inline-block h-px w-10" style={{ background: "#49ADA5" }} />
              {t.portfolio.section_label}
            </div>
            <h2
              data-testid="portfolio-title"
              className="mt-5 max-w-2xl text-3xl md:text-5xl font-semibold leading-[1.05] tracking-tight"
              style={{ color: "#0C5C62" }}
            >
              {t.portfolio.title}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-7">
          {t.portfolio.tiles.map((tile, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <div
                key={tile.title}
                data-testid={`portfolio-tile-${i}`}
                className="sc-bento group"
              >
                <div className="flex items-start justify-between">
                  <div className="sc-bento__icon" style={{ color: "#0C5C62" }}>
                    <Icon size={28} strokeWidth={1.7} />
                  </div>
                  <span
                    className="text-[10px] uppercase tracking-[0.32em]"
                    style={{ color: "#49ADA5" }}
                  >
                    {tile.tag} — {tile.subtitle}
                  </span>
                </div>

                <h3
                  className="mt-8 text-2xl md:text-3xl font-semibold tracking-tight"
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
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
