import React, { useMemo } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { ChevronDown } from "lucide-react";
import useScrollProgress from "@/hooks/useScrollProgress";

/**
 * CorridorHeroSection — immersive scroll-driven "walk" through a server-rack
 * corridor. Pseudo-3D via CSS scale + positioning transforms (no rotateY),
 * which is far more reliable across browsers than true CSS 3D.
 *
 * Each rack has a `depth` value in [0,1] where 0 is the vanishing point and 1
 * is closest to the camera. As the user scrolls, every rack's depth advances
 * forward and wraps back to 0 — simulating continuous forward movement.
 * At the end of the scroll the doors split open and a soft glow appears.
 */

const COPY = {
  pl: {
    label: "Infrastruktura · IT SmartClout",
    title: "Infrastruktura IT stworzona dla ciągłości",
    accent: "Twojego biznesu",
    subtitle:
      "Zajrzyj do naszej hali. Każdy serwer, który dostarczamy, przechodzi tę samą, uważną drogę — od komponentu do plomby.",
    hint: "Scrolluj, aby wejść",
  },
  en: {
    label: "Infrastructure · IT SmartClout",
    title: "IT infrastructure built for the continuity of",
    accent: "your business",
    subtitle:
      "Step into our build floor. Every server we ship walks the same careful path — from component to seal.",
    hint: "Scroll to enter",
  },
};

// Number of rack pairs (each pair = one on the left, one on the right)
const RACK_PAIRS = 8;

const CorridorHeroSection = () => {
  const { lang } = useLang();
  const copy = COPY[lang] || COPY.pl;
  const [sectionRef, progress] = useScrollProgress();

  const pairs = useMemo(
    () => Array.from({ length: RACK_PAIRS }, (_, i) => i),
    []
  );

  // 0..0.05  — idle intro
  // 0.05..0.75 — camera walks forward
  // 0.75..1  — doors open + glow ramps up
  const travel = Math.min(1, Math.max(0, (progress - 0.05) / 0.72));
  const doorOpen = Math.min(1, Math.max(0, (progress - 0.74) / 0.24));
  const glowAlpha = 0.12 + doorOpen * 0.55;

  return (
    <section
      id="corridor-hero"
      data-testid="corridor-hero-section"
      ref={sectionRef}
      className="sc-corr"
      style={{
        "--corr-progress": progress,
        "--corr-travel": travel,
        "--corr-door": doorOpen,
        "--corr-glow-a": glowAlpha,
      }}
    >
      <div className="sc-corr__viewport">
        <div className="sc-corr__stage">
          {/* Floor + ceiling illusion via skewed gradients */}
          <div className="sc-corr__floor" aria-hidden="true" />
          <div className="sc-corr__ceiling" aria-hidden="true" />
          <div className="sc-corr__farglow" aria-hidden="true" />

          {/* Rack "walls" — one on each side */}
          <div className="sc-corr__walls" aria-hidden="true">
            {pairs.map((i) => {
              // base depth of each rack, distributed evenly over the range [0,1]
              const base = i / RACK_PAIRS;
              // as user "walks", every rack's depth advances; wrap around at 1
              const depth = (base + travel * 1.15) % 1;
              return (
                <React.Fragment key={i}>
                  <div
                    className="sc-corr__rack sc-corr__rack--left"
                    style={{ "--depth": depth, "--side": -1 }}
                  >
                    <div className="sc-corr__rack-face">
                      <span className="sc-corr__rack-strip" />
                      <span className="sc-corr__rack-strip is-blink" />
                      <span className="sc-corr__rack-strip" />
                      <span className="sc-corr__rack-strip is-blink2" />
                      <span className="sc-corr__rack-strip" />
                      <span className="sc-corr__rack-strip is-blink" />
                    </div>
                  </div>
                  <div
                    className="sc-corr__rack sc-corr__rack--right"
                    style={{ "--depth": depth, "--side": 1 }}
                  >
                    <div className="sc-corr__rack-face">
                      <span className="sc-corr__rack-strip is-blink2" />
                      <span className="sc-corr__rack-strip" />
                      <span className="sc-corr__rack-strip is-blink" />
                      <span className="sc-corr__rack-strip" />
                      <span className="sc-corr__rack-strip is-blink2" />
                      <span className="sc-corr__rack-strip" />
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          {/* Doors at the vanishing point — split open at the end of scroll */}
          <div className="sc-corr__doorframe" aria-hidden="true">
            <div className="sc-corr__door sc-corr__door--left" />
            <div className="sc-corr__door sc-corr__door--right" />
            <div className="sc-corr__door-shine" />
          </div>

          {/* Vignette + soft mist */}
          <div className="sc-corr__vignette" aria-hidden="true" />
          <div className="sc-corr__mist" aria-hidden="true" />

          {/* Copy overlay — fades out as user gets close to the doors */}
          <div className="sc-corr__copy">
            <div className="sc-corr__label">
              <span className="sc-corr__label-line" />
              {copy.label}
            </div>
            <h2 className="sc-corr__title">
              {copy.title}{" "}
              <span className="sc-corr__accent">{copy.accent}</span>
            </h2>
            <p className="sc-corr__subtitle">{copy.subtitle}</p>
            <div className="sc-corr__hint" data-testid="corridor-hint">
              <ChevronDown size={16} strokeWidth={2} />
              <span>{copy.hint}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CorridorHeroSection;
