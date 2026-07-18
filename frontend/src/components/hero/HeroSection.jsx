import React from "react";
import HeroCanvas from "./HeroCanvas";
import DatacenterTopology from "./DatacenterTopology";
import { useLang } from "@/i18n/LanguageContext";
import { ArrowRight, Sparkles } from "lucide-react";

/**
 * Hero — split layout:
 *  Left: copy + CTAs + industry-term chips (data-testid nodes preserved)
 *  Right: DatacenterTopology (animated infrastructure graph)
 *  Background: Three.js ambient particles + horizontal light rays
 */
const HeroSection = () => {
  const { t, lang } = useLang();

  return (
    <section
      id="top"
      data-testid="hero-section"
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: "#0C5C62", minHeight: "100vh" }}
    >
      <HeroCanvas />

      {/* Vignette + grid */}
      <div className="pointer-events-none absolute inset-0 sc-hero-vignette" />
      <div className="pointer-events-none absolute inset-0 sc-hero-grid" />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl grid-cols-1 gap-10 px-6 pb-16 pt-28 md:grid-cols-12 md:gap-6 md:px-10 md:pt-32">
        {/* LEFT copy */}
        <div className="flex flex-col justify-between md:col-span-6">
          <div>
            <div
              data-testid="hero-eyebrow"
              className="inline-flex items-center gap-3 rounded-full border px-4 py-1.5 text-[11px] uppercase tracking-[0.28em] text-white/80"
              style={{
                borderColor: "rgba(73,173,165,0.45)",
                background: "rgba(12,92,98,0.35)",
              }}
            >
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: "#49ADA5" }}
              />
              {t.hero.eyebrow}
            </div>

            <h1 data-testid="hero-title" className="sc-hero-title mt-8 text-white">
              {t.hero.title_pre}{" "}
              <span className="sc-hero-accent">{t.hero.title_accent}</span>{" "}
              {t.hero.title_post}
            </h1>

            <p
              data-testid="hero-subtitle"
              className="mt-6 max-w-xl text-base md:text-lg text-white/75"
            >
              {t.hero.subtitle}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#contact"
                data-testid="hero-cta-primary"
                className="group inline-flex items-center gap-3 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300"
                style={{ background: "#49ADA5", color: "#0C5C62" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#FFFFFF")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#49ADA5")}
              >
                {t.hero.cta_primary}
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>
              <a
                href="#portfolio"
                data-testid="hero-cta-secondary"
                className="inline-flex items-center gap-3 rounded-full border px-6 py-3 text-sm font-semibold text-white transition-all duration-300"
                style={{ borderColor: "rgba(255,255,255,0.35)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#49ADA5";
                  e.currentTarget.style.color = "#49ADA5";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)";
                  e.currentTarget.style.color = "#ffffff";
                }}
              >
                {t.hero.cta_secondary}
              </a>
            </div>
          </div>

          {/* Industry term chips */}
          <div className="mt-10 md:mt-0">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.32em] text-white/55">
              <Sparkles size={14} style={{ color: "#49ADA5" }} />
              {t.hero.nodes_hint}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {t.hero.terms.map((term, i) => (
                <a
                  key={term}
                  href="#portfolio"
                  data-testid={`hero-node-${i}`}
                  className="sc-hero-chip"
                >
                  <span className="sc-hero-chip__dot" />
                  {term}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT topology */}
        <div className="relative md:col-span-6">
          <div className="sc-topo-frame" data-testid="topology-frame">
            <div className="sc-topo-frame__label">
              <span className="sc-topo-frame__dot" />
              {lang === "pl"
                ? "LIVE — Topologia infrastruktury"
                : "LIVE — Infrastructure topology"}
            </div>
            <DatacenterTopology lang={lang} />
            <div className="sc-topo-frame__legend">
              <span>
                <b>7</b> {lang === "pl" ? "warstw" : "layers"}
              </span>
              <span className="sc-topo-frame__legend-sep">—</span>
              <span>
                <b>24/7</b> {lang === "pl" ? "monitoring" : "monitoring"}
              </span>
              <span className="sc-topo-frame__legend-sep">—</span>
              <span>
                <b>99.99%</b> {lang === "pl" ? "dostępność" : "uptime"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
