import React, { useMemo } from "react";

/**
 * SectionDivider — smart transition between two colored sections.
 *
 * Behaviour depends on the contrast between `top` and `bottom`:
 *  - **High contrast** (dark ↔ light, ≥ 100 luminance delta): renders a
 *    **pixel dither** mosaic — a grid of 48x8 tiny squares that gradually
 *    interleave from `top` color to `bottom` color. Rows in the middle mix
 *    both colors so the eye sees a "bit-pattern" hand-off.
 *  - **Low contrast** (same tone family): renders a soft linear gradient.
 *
 * Props:
 *  - top / bottom : background colors of adjacent sections
 *  - height       : divider height in px
 *  - id           : test id suffix
 */
const luminance = (hex) => {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const COLS = 128;
const ROWS = 8;

const buildDitherMap = (seed) => {
  // Deterministic pattern per seed to avoid re-renders shuffling the mosaic.
  const map = new Uint8Array(COLS * ROWS);
  let s = seed >>> 0;
  const rand = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
  for (let y = 0; y < ROWS; y++) {
    // Probability of being `bottom` color grows from row 0 (0) to row ROWS-1 (1)
    const pBottom = y / (ROWS - 1);
    for (let x = 0; x < COLS; x++) {
      map[y * COLS + x] = rand() < pBottom ? 1 : 0;
    }
  }
  return map;
};

const SectionDivider = ({ top, bottom, height = 100, id = "" }) => {
  const contrast = Math.abs(luminance(top) - luminance(bottom));
  const useDither = contrast >= 100;

  const map = useMemo(() => {
    if (!useDither) return null;
    // Seed the mosaic from the colors so it's stable across renders.
    const seed =
      parseInt(top.replace("#", ""), 16) ^
      parseInt(bottom.replace("#", ""), 16);
    return buildDitherMap(seed || 1);
  }, [top, bottom, useDither]);

  if (useDither) {
    return (
      <div
        aria-hidden="true"
        data-testid={id ? `divider-${id}` : "section-divider"}
        className="sc-dither"
        style={{ height: `${height}px`, aspectRatio: "unset" }}
      >
        {Array.from(map).map((v, i) => (
          <span
            key={i}
            className="sc-dither__cell"
            style={{ background: v ? bottom : top }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      data-testid={id ? `divider-${id}` : "section-divider"}
      className="sc-blend"
      style={{
        height: `${height}px`,
        background: `linear-gradient(180deg, ${top} 0%, ${top} 12%, ${bottom} 88%, ${bottom} 100%)`,
      }}
    >
      <span className="sc-blend__line" />
    </div>
  );
};

export default SectionDivider;
