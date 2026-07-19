import React, { useEffect, useRef, useState } from "react";

/**
 * FuturisticMetric — count-up number reveal on scroll with tech brackets,
 * scanline sweep, mint pulse indicator and monospace tracking. Editorial +
 * spec-sheet blend.
 *
 * Props:
 *  - value: "20+" | "500+" | "130+" (may contain a suffix like "+" or "%")
 *  - label: string caption below
 *  - delay: ms before count-up starts (staggering)
 */
const parseValue = (v) => {
  const m = String(v).match(/^(\d+)(.*)$/);
  if (!m) return { num: 0, suffix: v };
  return { num: parseInt(m[1], 10), suffix: m[2] || "" };
};

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

const FuturisticMetric = ({ value, label, delay = 0 }) => {
  const { num, suffix } = parseValue(value);
  const ref = useRef(null);
  const [display, setDisplay] = useState(0);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !seen) {
            setSeen(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.4, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);

  useEffect(() => {
    if (!seen) return;
    let raf = 0;
    const duration = 1400;
    let start = 0;
    const step = (ts) => {
      if (!start) start = ts + delay;
      if (ts < start) {
        raf = requestAnimationFrame(step);
        return;
      }
      const p = Math.min(1, (ts - start) / duration);
      const v = Math.round(easeOutCubic(p) * num);
      setDisplay(v);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [seen, num, delay]);

  return (
    <div
      ref={ref}
      className={`sc-fx-metric ${seen ? "is-in" : ""}`}
      data-testid="fx-metric"
    >
      {/* Tech corner brackets */}
      <span className="sc-fx-metric__bk sc-fx-metric__bk--tl" />
      <span className="sc-fx-metric__bk sc-fx-metric__bk--tr" />
      <span className="sc-fx-metric__bk sc-fx-metric__bk--bl" />
      <span className="sc-fx-metric__bk sc-fx-metric__bk--br" />

      {/* Header row: index + live pulse */}
      <div className="sc-fx-metric__row">
        <span className="sc-fx-metric__pulse" />
        <span className="sc-fx-metric__code">LIVE</span>
      </div>

      {/* Value */}
      <div className="sc-fx-metric__value">
        <span className="sc-fx-metric__num">{display}</span>
        <span className="sc-fx-metric__suf">{suffix}</span>
      </div>

      {/* Scanline sweep across the metric */}
      <span className="sc-fx-metric__scan" aria-hidden="true" />

      {/* Micro spec-line */}
      <div className="sc-fx-metric__spec">
        <span className="sc-fx-metric__spec-dot" />
        <span className="sc-fx-metric__spec-line" />
      </div>

      {/* Label */}
      <div className="sc-fx-metric__label">{label}</div>
    </div>
  );
};

export default FuturisticMetric;
