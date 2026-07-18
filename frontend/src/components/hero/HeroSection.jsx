import React, { useState } from "react";
import HeroCanvas from "./HeroCanvas";
import { useLang } from "@/i18n/LanguageContext";
import { ArrowRight, MousePointerClick } from "lucide-react";

/**
 * Positions for interactive word-nodes (percent of container).
 * Kept deterministic so the layout is stable but varied.
 */
const NODE_POSITIONS = [
  { top: "18%", left: "8%" },
  { top: "28%", left: "82%" },
  { top: "62%", left: "6%" },
  { top: "72%", left: "78%" },
  { top: "12%", left: "58%" },
  { top: "82%", left: "42%" },
  { top: "45%", left: "88%" },
];

const InteractiveNode = ({ label, style, index }) => {
  const [rippled, setRippled] = useState(false);
  const trigger = () => {
    setRippled(true);
    setTimeout(() => setRippled(false), 700);
  };
  return (
    <button
      type="button"
      onMouseEnter={trigger}
      onClick={trigger}
      style={{ ...style, animationDelay: `${index * 0.15}s` }}
      className="sc-hero-node group"
      data-testid={`hero-node-${index}`}
    >
      <span className="sc-hero-node__dot" />
      <span className="sc-hero-node__label">{label}</span>
      {rippled && <span className="sc-hero-node__ripple" />}
    </button>
  );
};

const HeroSection = () => {
  const { t } = useLang();

  return (
    <section
      id="top"
      data-testid="hero-section"
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: "#0C5C62", minHeight: "100vh" }}
    >
      {/* WebGL constellation */}
      <HeroCanvas />

      {/* Soft radial vignette to lift typography */}
      <div className="pointer-events-none absolute inset-0 sc-hero-vignette" />

      {/* Grid frame */}
      <div className="pointer-events-none absolute inset-0 sc-hero-grid" />

      {/* Interactive word nodes */}
      <div className="pointer-events-none absolute inset-0">
        {t.hero.terms.map((term, i) => (
          <div
            key={term}
            className="pointer-events-auto absolute"
            style={NODE_POSITIONS[i % NODE_POSITIONS.length]}
          >
            <InteractiveNode
              label={term}
              index={i}
              style={{ position: "relative" }}
            />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-between px-6 pt-28 pb-16 md:px-10">
        <div>
          <div
            className="inline-flex items-center gap-3 rounded-full border px-4 py-1.5 text-[11px] uppercase tracking-[0.28em] text-white/80"
            style={{ borderColor: "rgba(73,173,165,0.45)", background: "rgba(12,92,98,0.35)" }}
            data-testid="hero-eyebrow"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: "#49ADA5" }} />
            {t.hero.eyebrow}
          </div>
        </div>

        <div className="max-w-4xl">
          <h1
            data-testid="hero-title"
            className="sc-hero-title text-white"
          >
            {t.hero.title_pre}{" "}
            <span className="sc-hero-accent">{t.hero.title_accent}</span>{" "}
            {t.hero.title_post}
          </h1>
          <p
            className="mt-8 max-w-2xl text-lg md:text-xl text-white/75"
            data-testid="hero-subtitle"
          >
            {t.hero.subtitle}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#contact"
              data-testid="hero-cta-primary"
              className="group inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-sm font-semibold transition-all duration-300"
              style={{ background: "#49ADA5", color: "#0C5C62" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#FFFFFF";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#49ADA5";
              }}
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
              className="inline-flex items-center gap-3 rounded-full border px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300"
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

        <div className="mt-14 flex items-center gap-3 text-[11px] uppercase tracking-[0.35em] text-white/55">
          <MousePointerClick size={14} style={{ color: "#49ADA5" }} />
          {t.hero.nodes_hint}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
