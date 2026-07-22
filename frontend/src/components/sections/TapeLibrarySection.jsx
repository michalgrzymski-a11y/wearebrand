import React, { useState } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { Server, ShieldCheck, Code2, Wrench } from "lucide-react";
import Reveal from "@/components/Reveal";
import useSectionParallax from "@/hooks/useSectionParallax";

/**
 * TapeLibrarySection — mirrors the Portfolio content in the aesthetic of
 * an LTO tape library. Four cartridges = four portfolio areas (Hardware,
 * Security, Software, Services & DataCenter). Hover a cartridge → tape
 * slides out of the library and its content is revealed to the right
 * inside the same chassis.
 */

const TILE_ICONS = [Server, ShieldCheck, Code2, Wrench];

// Colored spines to differentiate the 4 cartridges (LTO-style)
const SPINES = [
  { top: "#06FFE0", body: "#0e2f36" },   // Hardware — mint
  { top: "#F87171", body: "#2a1010" },   // Security — red
  { top: "#FBBF24", body: "#2a1c05" },   // Software — amber
  { top: "#8B5CF6", body: "#160f2a" },   // Services — violet
];

const TapeLibrarySection = () => {
  const { t } = useLang();
  const tiles = t.portfolio.tiles;
  const [hovered, setHovered] = useState(null);
  const parallaxRef = useSectionParallax();

  return (
    <section
      id="tape-library"
      data-testid="tapelib-section"
      ref={parallaxRef}
      className="relative w-full overflow-hidden"
      style={{ background: "#040709", color: "#E8F4F5" }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-60 pointer-events-none"
        style={{
          background:
            "radial-gradient(55% 50% at 25% 30%, rgba(6, 255, 224, 0.05) 0%, rgba(6, 255, 224, 0) 60%)," +
            " radial-gradient(55% 50% at 75% 70%, rgba(6, 184, 212, 0.05) 0%, rgba(6, 184, 212, 0) 60%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 py-14 md:py-20">
        <Reveal>
          <div
            className="flex items-center gap-4 text-[11px] uppercase tracking-[0.32em]"
            style={{ color: "#7CC4C0" }}
          >
            <span
              className="inline-block h-px w-10"
              style={{ background: "#49ADA5" }}
            />
            {t.portfolio.section_label}
          </div>
          <h2
            data-testid="tapelib-title"
            className="mt-4 text-3xl md:text-5xl font-semibold leading-[1.05] tracking-tight text-white max-w-3xl"
          >
            {t.portfolio.title}
          </h2>
        </Reveal>

        {/* Tape library chassis */}
        <div
          data-testid="tapelib-chassis"
          className={`sc-tapelib mt-12 md:mt-14 ${hovered !== null ? "is-hovered" : ""}`}
          onMouseLeave={() => setHovered(null)}
        >
          <div className="sc-tapelib__ear sc-tapelib__ear--l" aria-hidden="true">
            <span className="sc-tapelib__mount" />
            <span className="sc-tapelib__mount" />
          </div>

          <div className="sc-tapelib__body">
            <div className="sc-tapelib__head">
              <span className="sc-tapelib__led sc-tapelib__led--pwr" />
              <span className="sc-tapelib__code">SC · LTO LIBRARY · 4 SLOTS</span>
              <span className="sc-tapelib__led sc-tapelib__led--rw" />
            </div>

            <div className="sc-tapelib__cartridges">
              {tiles.map((tile, idx) => {
                const Icon = TILE_ICONS[idx] || Server;
                const isActive = hovered === idx;
                const spine = SPINES[idx % SPINES.length];
                return (
                  <button
                    key={tile.tag}
                    type="button"
                    className={`sc-tape ${isActive ? "is-active" : ""}`}
                    onMouseEnter={() => setHovered(idx)}
                    onFocus={() => setHovered(idx)}
                    aria-label={tile.title}
                    data-testid={`tape-cartridge-${idx}`}
                    style={{
                      "--tape-top": spine.top,
                      "--tape-body": spine.body,
                    }}
                  >
                    <span className="sc-tape__spine" aria-hidden="true">
                      <span className="sc-tape__spine-top" />
                      <span className="sc-tape__spine-band" />
                      <span className="sc-tape__spine-code">{tile.tag}</span>
                      <span className="sc-tape__spine-hub" />
                    </span>
                    <span className="sc-tape__face">
                      <span className="sc-tape__icon">
                        <Icon size={18} strokeWidth={1.7} />
                      </span>
                      <span className="sc-tape__meta">
                        <span
                          className="sc-tape__title"
                          data-testid={`tape-title-${idx}`}
                        >
                          {tile.title}
                        </span>
                        <span className="sc-tape__subtitle">
                          {tile.subtitle}
                        </span>
                      </span>
                    </span>
                    <span className="sc-tape__expanded">
                      <span
                        className="sc-tape__x-title"
                        data-testid={`tape-x-title-${idx}`}
                      >
                        {tile.title}
                        <span className="sc-tape__x-sub">
                          {tile.subtitle}
                        </span>
                      </span>
                      <ul
                        className="sc-tape__x-items"
                        data-testid={`tape-x-items-${idx}`}
                      >
                        {tile.items.map((it, i) => (
                          <li key={i}>
                            <span className="sc-tape__x-dot" aria-hidden="true" />
                            {it}
                          </li>
                        ))}
                      </ul>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="sc-tapelib__foot" aria-hidden="true">
              <span className="sc-tapelib__foot-line" />
              <span className="sc-tapelib__foot-code">
                IT SMARTCLOUT · CATALOG v3.0
              </span>
            </div>
          </div>

          <div className="sc-tapelib__ear sc-tapelib__ear--r" aria-hidden="true">
            <span className="sc-tapelib__mount" />
            <span className="sc-tapelib__mount" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TapeLibrarySection;
