import React, { useMemo } from "react";

/**
 * SectionDivider — pixel-dither mosaic used for EVERY section transition.
 *
 * Cells render as **perfect squares** (aspect-ratio 1:1); the divider's
 * total height is derived from the column count so the mosaic always tiles
 * cleanly across the section width.
 *
 * For low-contrast (light ↔ light) pairs, a subtle mint accent is used
 * as the "bottom" tone so the pixel texture stays visible without shouting.
 *
 * Hover UX: each cell inverts its color on hover (top→bottom, bottom→top),
 * giving the pattern a tactile "flip the bit" feel.
 */
const luminance = (hex) => {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const COLS = 512;
const ROWS = 8;
const LIGHT_ACCENT = "rgba(73, 173, 165, 0.14)"; // subtle mint tint

const buildDitherMap = (seed) => {
  const map = new Uint8Array(COLS * ROWS);
  let s = seed >>> 0;
  const rand = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
  for (let y = 0; y < ROWS; y++) {
    const pBottom = y / (ROWS - 1);
    for (let x = 0; x < COLS; x++) {
      map[y * COLS + x] = rand() < pBottom ? 1 : 0;
    }
  }
  return map;
};

const SectionDivider = ({ top, bottom, id = "" }) => {
  const contrast = Math.abs(luminance(top) - luminance(bottom));
  const lowContrast = contrast < 40;
  const effectiveBottom = lowContrast ? LIGHT_ACCENT : bottom;

  const map = useMemo(() => {
    const seed =
      parseInt(top.replace("#", ""), 16) ^
      parseInt(bottom.replace("#", ""), 16);
    return buildDitherMap(seed || 1);
  }, [top, bottom]);

  return (
    <div
      aria-hidden="true"
      data-testid={id ? `divider-${id}` : "section-divider"}
      className="sc-dither"
      style={{
        "--sc-top": top,
        "--sc-bot": effectiveBottom,
        "--sc-cols": COLS,
        "--sc-cols-mobile": COLS / 2,
      }}
    >
      {Array.from(map).map((v, i) => (
        <span
          key={i}
          className={`sc-dither__cell ${v ? "is-bot" : "is-top"}`}
        />
      ))}
    </div>
  );
};

export default SectionDivider;
