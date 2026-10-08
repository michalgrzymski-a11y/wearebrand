import React, { useRef, useCallback } from "react";

/**
 * Tilt — hover-triggered 3D tilt + cursor spotlight.
 * Sets CSS vars on the element: --rx/--ry (deg), --mx/--my (%).
 * Pair with `.sc-tilt` styles in NetAppPortfolioPage.css.
 */
const Tilt = ({ as: As = "div", max = 7, spot = true, tilt = true, className = "", children, style, ...rest }) => {
  const ref = useRef(null);
  const raf = useRef(0);

  const onMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      if (tilt) {
        el.style.setProperty("--rx", `${((0.5 - py) * max * 2).toFixed(2)}deg`);
        el.style.setProperty("--ry", `${((px - 0.5) * max * 2).toFixed(2)}deg`);
      }
      if (spot) {
        el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
        el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
      }
    });
  }, [max, spot, tilt]);

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(raf.current);
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  }, []);

  return (
    <As
      ref={ref}
      className={`sc-tilt ${tilt ? "sc-tilt--3d" : ""} ${spot ? "sc-tilt--spot" : ""} ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={style}
      {...rest}
    >
      {children}
    </As>
  );
};

export default Tilt;
