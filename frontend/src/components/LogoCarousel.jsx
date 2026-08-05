import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * LogoCarousel — RAF-driven infinite logo carousel with prev/next buttons.
 * Extracted from the original TrustedBySection so the same behaviour can be
 * used both inside the hero (client logos strip) and in the standalone
 * PartnersSection (vendor logos).
 *
 * Props:
 *  - logos:   array of { name, file, invert? } — file must resolve under
 *             /public/logos/<file>, unless `path` is supplied per-item.
 *  - label:   short uppercase tag rendered on the left of the header row.
 *  - variant: "light" (default) or "dark" — swaps colors for background.
 *  - showControls: whether to show prev/next arrows (default true).
 *  - speed:   px/s auto-play speed (default 40).
 *  - slotWidth: px width of each slot (default 190).
 *  - basePath: prefix for file paths (default `${PUBLIC_URL}/logos/`).
 *  - className: extra classes on outer element.
 *  - testIdPrefix: base for data-testid attributes (default "carousel").
 */
const LogoCarousel = ({
  logos,
  label,
  variant = "light",
  showControls = true,
  speed = 40,
  slotWidth = 190,
  basePath,
  className = "",
  testIdPrefix = "carousel",
}) => {
  const trackRef = useRef(null);
  const offsetRef = useRef(0);
  const hoverRef = useRef(false);
  const rafRef = useRef(0);
  const lastTsRef = useRef(0);
  const [singleWidth, setSingleWidth] = useState(0);
  const prefix = basePath || `${process.env.PUBLIC_URL || ""}/logos/`;
  const doubled = [...logos, ...logos];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    const measure = () => setSingleWidth(track.scrollWidth / 2);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    return () => ro.disconnect();
  }, [logos]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !singleWidth) return undefined;
    const step = (ts) => {
      if (!lastTsRef.current) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;
      if (!hoverRef.current && !document.hidden) {
        offsetRef.current += speed * dt;
        if (offsetRef.current >= singleWidth) offsetRef.current -= singleWidth;
        track.style.transform = `translateX(${-offsetRef.current}px)`;
      }
      rafRef.current = window.requestAnimationFrame(step);
    };
    rafRef.current = window.requestAnimationFrame(step);
    return () => {
      window.cancelAnimationFrame(rafRef.current);
      lastTsRef.current = 0;
    };
  }, [singleWidth, speed]);

  const shift = (dir) => {
    const track = trackRef.current;
    if (!track || !singleWidth) return;
    offsetRef.current += dir * slotWidth;
    while (offsetRef.current < 0) offsetRef.current += singleWidth;
    while (offsetRef.current >= singleWidth) offsetRef.current -= singleWidth;
    track.style.transform = `translateX(${-offsetRef.current}px)`;
  };

  return (
    <div className={`sc-logo-carousel sc-logo-carousel--${variant} ${className}`}>
      {(label || showControls) && (
        <div className="sc-logo-carousel__head">
          {label && (
            <div className="sc-logo-carousel__label">
              <span className="sc-logo-carousel__label-line" />
              {label}
            </div>
          )}
          {showControls && (
            <div className="sc-logo-carousel__controls">
              <button
                type="button"
                onClick={() => shift(-1)}
                data-testid={`${testIdPrefix}-prev`}
                className="sc-carousel-btn"
                aria-label="Prev"
              >
                <ChevronLeft size={16} strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => shift(1)}
                data-testid={`${testIdPrefix}-next`}
                className="sc-carousel-btn"
                aria-label="Next"
              >
                <ChevronRight size={16} strokeWidth={2} />
              </button>
            </div>
          )}
        </div>
      )}
      <div
        className="sc-carousel"
        onMouseEnter={() => (hoverRef.current = true)}
        onMouseLeave={() => (hoverRef.current = false)}
        style={{
          maskImage:
            "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)",
        }}
      >
        <div
          ref={trackRef}
          className="sc-carousel__track"
          data-testid={`${testIdPrefix}-track`}
        >
          {doubled.map((c, i) => (
            <span
              key={`${c.name}-${i}`}
              className={`sc-logo-slot ${c.invert ? "sc-logo-slot--invert" : ""}`}
              data-testid={`${testIdPrefix}-item-${i}`}
              title={c.name}
              style={{ width: slotWidth }}
            >
              <img
                src={c.path || `${prefix}${c.file}`}
                alt={c.name}
                loading="lazy"
                draggable="false"
              />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogoCarousel;
