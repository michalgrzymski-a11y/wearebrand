import React from "react";
import IsometricDatacenter from "./IsometricDatacenter";
import { useLang } from "@/i18n/LanguageContext";
import { ArrowRight, Zap } from "lucide-react";

/**
 * Hero — full-bleed constellation (option D)
 *  The Isometric datacenter scene occupies the entire hero. Grid & devices
 *  are visually shifted to the right half, so the copy on the left sits over
 *  a clean darker area. No frame, no boundaries — the grid dissolves radially
 *  across the whole viewport.
 */
const HeroSection = () => {
  const { t, lang } = useLang();

  return (
    <section
      id="top"
      data-testid="hero-section"
      className="relative w-full overflow-hidden sc-hero"
      style={{
        background:
          "radial-gradient(1500px 900px at 72% 48%, rgba(12,92,98,0.5) 0%, rgba(12,92,98,0) 60%), radial-gradient(900px 600px at 15% 85%, rgba(73,173,165,0.12) 0%, transparent 60%), #060B12",
      }}
    >
      {/* Full-bleed WebGL scene */}
      <div className="absolute inset-0 sc-hero-scene-bleed">
        <IsometricDatacenter lang={lang} />
      </div>

      {/* Left-side darkening for text readability */}
      <div className="pointer-events-none absolute inset-0 sc-hero-lreadable" aria-hidden="true" />

      {/* Corner tech brackets */}
      <div className="sc-hero-bracket sc-hero-bracket--tl" aria-hidden="true" />
      <div className="sc-hero-bracket sc-hero-bracket--tr" aria-hidden="true" />
      <div className="sc-hero-bracket sc-hero-bracket--bl" aria-hidden="true" />
      <div className="sc-hero-bracket sc-hero-bracket--br" aria-hidden="true" />

      {/* Scanline overlay */}
      <div className="pointer-events-none absolute inset-0 sc-hero-scan" aria-hidden="true" />

      {/* Copy overlay */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center px-6 pb-16 pt-24 md:px-10 md:pt-28">
        <div className="flex max-w-2xl flex-col">
          <div
            data-testid="hero-eyebrow"
            className="inline-flex items-center self-start gap-3 rounded-full border px-4 py-1.5 text-[11px] uppercase tracking-[0.28em] text-white/85"
            style={{
              borderColor: "rgba(73,173,165,0.4)",
              background: "rgba(6,11,18,0.55)",
              backdropFilter: "blur(6px)",
            }}
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: "#49ADA5" }} />
            {t.hero.eyebrow}
            <span className="opacity-40">·</span>
            <span className="text-white/50">v.2026</span>
          </div>

          <h1 data-testid="hero-title" className="sc-hero-title mt-7 text-white">
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
              style={{ background: "#49ADA5", color: "#0A1524" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#FFFFFF")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#49ADA5")}
            >
              {t.hero.cta_primary}
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
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

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.28em] text-white/50">
            <span className="inline-flex items-center gap-2">
              <span className="sc-tick-dot" />
              SYSTEMS ONLINE
            </span>
            <span className="inline-flex items-center gap-2">
              <Zap size={12} style={{ color: "#49ADA5" }} />
              Latency &lt; 4ms
            </span>
            <span className="inline-flex items-center gap-2 text-white/40">
              <span className="inline-block h-px w-3 bg-white/30" />
              PL / EU-CENTRAL
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
