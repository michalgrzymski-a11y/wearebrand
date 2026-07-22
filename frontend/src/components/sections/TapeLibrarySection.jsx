import React, { useState } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { Server, ShieldCheck, Code2, Wrench } from "lucide-react";
import Reveal from "@/components/Reveal";
import useSectionParallax from "@/hooks/useSectionParallax";

/**
 * TapeLibrarySection — LTO-inspired horizontal library.
 * Top row: 4 tape DRIVES (napędy) — one per Portfolio category.
 * On hover of a drive → below it appears a stack of tape CARTRIDGES,
 * each representing one item inside that portfolio category.
 * Default state shows subtle preview of the first drive's tapes.
 */

const DRIVE_ICONS = [Server, ShieldCheck, Code2, Wrench];

const DRIVE_COLORS = [
  { top: "#06FFE0", accent: "rgba(6, 255, 224, 0.7)" },
  { top: "#F87171", accent: "rgba(248, 113, 113, 0.7)" },
  { top: "#FBBF24", accent: "rgba(251, 191, 36, 0.75)" },
  { top: "#8B5CF6", accent: "rgba(139, 92, 246, 0.7)" },
];

const TapeLibrarySection = () => {
  const { t } = useLang();
  const tiles = t.portfolio.tiles;
  const [hovered, setHovered] = useState(0); // default show first drive's tapes
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

        <div
          data-testid="tapelib-chassis"
          className="sc-tapelib2 mt-12 md:mt-14"
          onMouseLeave={() => setHovered(0)}
        >
          {/* Top row: 4 tape drives, horizontal */}
          <div className="sc-tapelib2__drives">
            {tiles.map((tile, idx) => {
              const Icon = DRIVE_ICONS[idx] || Server;
              const isActive = hovered === idx;
              const color = DRIVE_COLORS[idx % DRIVE_COLORS.length];
              return (
                <button
                  key={tile.tag}
                  type="button"
                  className={`sc-drive ${isActive ? "is-active" : ""}`}
                  onMouseEnter={() => setHovered(idx)}
                  onFocus={() => setHovered(idx)}
                  data-testid={`tape-drive-${idx}`}
                  aria-label={tile.title}
                  style={{
                    "--drive-accent": color.accent,
                    "--drive-top": color.top,
                  }}
                >
                  <span className="sc-drive__strip" aria-hidden="true" />
                  <span className="sc-drive__head">
                    <span className="sc-drive__leds">
                      <span className="sc-drive__led sc-drive__led--pwr" />
                      <span className="sc-drive__led sc-drive__led--rw" />
                    </span>
                    <span className="sc-drive__code">
                      {tile.tag} · {tile.subtitle}
                    </span>
                  </span>
                  <span className="sc-drive__slot" aria-hidden="true">
                    <span className="sc-drive__slot-inner" />
                  </span>
                  <span className="sc-drive__body">
                    <span
                      className="sc-drive__icon"
                      style={{ color: isActive ? color.top : "rgba(232,244,245,0.5)" }}
                    >
                      <Icon size={20} strokeWidth={1.7} />
                    </span>
                    <span
                      className="sc-drive__title"
                      data-testid={`tape-drive-title-${idx}`}
                    >
                      {tile.title}
                    </span>
                  </span>
                  <span className="sc-drive__foot" aria-hidden="true">
                    <span className="sc-drive__vent" />
                    <span className="sc-drive__vent" />
                    <span className="sc-drive__vent" />
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bottom row: cartridges of the hovered drive */}
          <div
            className="sc-tapelib2__tapes"
            data-testid={`tape-items-${hovered}`}
          >
            <div className="sc-tapelib2__tapes-head">
              <span className="sc-tapelib2__tapes-kicker">
                {tiles[hovered].tag} · {tiles[hovered].subtitle}
              </span>
              <span className="sc-tapelib2__tapes-title">
                {tiles[hovered].title}
              </span>
              <span className="sc-tapelib2__tapes-line" />
            </div>
            <div className="sc-tapelib2__tapes-row">
              {tiles[hovered].items.map((item, i) => {
                const color = DRIVE_COLORS[hovered % DRIVE_COLORS.length];
                return (
                  <div
                    key={`${hovered}-${item}`}
                    className="sc-lto"
                    data-testid={`tape-lto-${hovered}-${i}`}
                    style={{
                      "--lto-top": color.top,
                      animationDelay: `${i * 60}ms`,
                    }}
                  >
                    <span className="sc-lto__top" />
                    <span className="sc-lto__label">
                      <span className="sc-lto__label-tag">
                        LTO·{String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="sc-lto__label-name">{item}</span>
                    </span>
                    <span className="sc-lto__hub" aria-hidden="true" />
                    <span className="sc-lto__notch" aria-hidden="true" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TapeLibrarySection;
