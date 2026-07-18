import React from "react";
import HeroCanvas from "./HeroCanvas";
import DatacenterTopology from "./DatacenterTopology";
import { useLang } from "@/i18n/LanguageContext";
import { ArrowRight, Zap } from "lucide-react";

/**
 * Hero — deep-tech split layout:
 *  Left: copy + CTAs + system status ticker
 *  Right: DatacenterTopology (animated infrastructure graph)
 *  Background: dark navy-black with subtle teal glow and Three.js ambient particles.
 */
const HeroSection = () => {
  const { t, lang } = useLang();

  return (
    <section
      id="top"
      data-testid="hero-section"
      className="relative w-full overflow-hidden"
      style={{
        background:
          "radial-gradient(1400px 900px at 75% 40%, rgba(12,92,98,0.55) 0%, rgba(12,92,98,0) 55%), radial-gradient(900px 600px at 15% 90%, rgba(73,173,165,0.18) 0%, transparent 55%), #060B12",
        minHeight: "100vh",
      }}
    >
      <HeroCanvas />

      {/* Corner tech brackets */}
      <div className="sc-hero-bracket sc-hero-bracket--tl" aria-hidden="true" />
      <div className="sc-hero-bracket sc-hero-bracket--tr" aria-hidden="true" />
      <div className="sc-hero-bracket sc-hero-bracket--bl" aria-hidden="true" />
      <div className="sc-hero-bracket sc-hero-bracket--br" aria-hidden="true" />

      {/* Micro grid */}
      <div className="pointer-events-none absolute inset-0 sc-hero-grid" />
      {/* Scanline overlay */}
      <div className="pointer-events-none absolute inset-0 sc-hero-scan" aria-hidden="true" />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-10 px-6 pb-16 pt-28 md:grid-cols-12 md:gap-6 md:px-10 md:pt-32">
        {/* LEFT copy */}
        <div className="flex flex-col md:col-span-6">
          <div
            data-testid="hero-eyebrow"
            className="inline-flex items-center self-start gap-3 rounded-full border px-4 py-1.5 text-[11px] uppercase tracking-[0.28em] text-white/80"
            style={{
              borderColor: "rgba(73,173,165,0.35)",
              background: "rgba(6,11,18,0.6)",
            }}
          >
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: "#49ADA5" }}
            />
            {t.hero.eyebrow}
            <span className="opacity-40">·</span>
            <span className="text-white/50">v.2026</span>
          </div>

          <h1 data-testid="hero-title" className="sc-hero-title mt-8 text-white">
            {t.hero.title_pre}{" "}
            <span className="sc-hero-accent">{t.hero.title_accent}</span>{" "}
            {t.hero.title_post}
          </h1>

          <p
            data-testid="hero-subtitle"
            className="mt-6 max-w-xl text-base md:text-lg text-white/70"
          >
            {t.hero.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#contact"
              data-testid="hero-cta-primary"
              className="group inline-flex items-center gap-3 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300"
              style={{ background: "#49ADA5", color: "#0A1524" }}
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
              style={{ borderColor: "rgba(255,255,255,0.25)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#49ADA5";
                e.currentTarget.style.color = "#49ADA5";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
                e.currentTarget.style.color = "#ffffff";
              }}
            >
              {t.hero.cta_secondary}
            </a>
          </div>

          {/* Compact status ticker (replaces the removed chips) */}
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.28em] text-white/50">
            <span className="inline-flex items-center gap-2">
              <span className="sc-tick-dot" />
              {lang === "pl" ? "SYSTEMS ONLINE" : "SYSTEMS ONLINE"}
            </span>
            <span className="inline-flex items-center gap-2">
              <Zap size={12} style={{ color: "#49ADA5" }} />
              {lang === "pl" ? "Latency < 4ms" : "Latency < 4ms"}
            </span>
            <span className="inline-flex items-center gap-2 text-white/40">
              <span className="inline-block h-px w-3 bg-white/30" />
              PL / EU-CENTRAL
            </span>
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
