import React, { useEffect, useRef } from "react";

/**
 * DigitalHorizonscape — SVG perspective grid receding to the horizon.
 * Scroll-reactive: the horizon Y position shifts as the user scrolls the section,
 * making the "camera" tilt subtly. Two tones (dark/light) share the same SVG.
 *
 * Props:
 *  - tone: "dark" | "light"
 *  - scrollReactive: enable scroll-driven horizon shift (default true)
 */
const DigitalHorizonscape = ({ tone = "dark", scrollReactive = true }) => {
  const wrapRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    if (!scrollReactive) return;
    const wrap = wrapRef.current;
    const grid = gridRef.current;
    if (!wrap || !grid) return;
    let raf = 0;
    let inView = false;

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => (inView = e.isIntersecting)),
      { threshold: 0 },
    );
    io.observe(wrap);

    const update = () => {
      if (inView) {
        const r = wrap.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        // Normalised progress -1..1 across viewport
        const p = (r.top + r.height / 2 - vh / 2) / (vh / 2);
        // Tilt bounded between -6 and 6 degrees + horizon Y shift
        const tilt = Math.max(-6, Math.min(6, -p * 6));
        const shift = Math.max(-30, Math.min(30, -p * 30));
        grid.style.transform = `perspective(700px) rotateX(${72 + tilt}deg) translateY(${shift}px)`;
      }
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [scrollReactive]);

  const stroke = tone === "dark" ? "#00B8D4" : "#0C5C62";
  const bright = tone === "dark" ? "#06FFE0" : "#00B8D4";

  return (
    <div
      ref={wrapRef}
      className={`sc-fx-horizon sc-fx-horizon--${tone}`}
      aria-hidden="true"
    >
      <div ref={gridRef} className="sc-fx-horizon__grid">
        <svg
          viewBox="0 0 1200 600"
          preserveAspectRatio="none"
          width="100%"
          height="100%"
        >
          <defs>
            <linearGradient id="hzn-fade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity="0" />
              <stop offset="30%" stopColor={stroke} stopOpacity="0.55" />
              <stop offset="100%" stopColor={stroke} stopOpacity="0.85" />
            </linearGradient>
          </defs>
          {/* Horizon line */}
          <line
            x1="0"
            y1="0"
            x2="1200"
            y2="0"
            stroke={bright}
            strokeWidth="1"
            opacity="0.6"
          />
          {/* Vertical (converging) lines */}
          {Array.from({ length: 21 }).map((_, i) => {
            const t = (i - 10) / 10;
            const x = 600 + t * 900;
            return (
              <line
                key={`v-${i}`}
                x1="600"
                y1="0"
                x2={x}
                y2="600"
                stroke="url(#hzn-fade)"
                strokeWidth={i === 10 ? 1.2 : 0.8}
              />
            );
          })}
          {/* Horizontal (receding) lines — spaced with easing so distant rows compress */}
          {Array.from({ length: 12 }).map((_, i) => {
            const p = i / 11;
            const y = Math.pow(p, 1.6) * 600;
            const alpha = 0.15 + 0.7 * p;
            return (
              <line
                key={`h-${i}`}
                x1="0"
                y1={y}
                x2="1200"
                y2={y}
                stroke={stroke}
                strokeWidth={0.7}
                opacity={alpha}
              />
            );
          })}
        </svg>
      </div>
      <span className="sc-fx-horizon__glow" style={{ background: bright }} />
    </div>
  );
};

export default DigitalHorizonscape;
