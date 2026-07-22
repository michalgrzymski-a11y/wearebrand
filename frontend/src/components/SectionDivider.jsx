import React from "react";

/**
 * SectionDivider — soft gradient blend between two adjacent section
 * background colors. Replaces the previous hard-cut design so that
 * transitions look organic and cinematic.
 *
 * Props:
 *  - top:    background color of the section above
 *  - bottom: background color of the section below
 *  - height: divider height in px (default 120 — generous blend)
 */
const SectionDivider = ({ top, bottom, height = 120, id = "" }) => {
  return (
    <div
      aria-hidden="true"
      data-testid={id ? `divider-${id}` : "section-divider"}
      className="sc-blend"
      style={{
        height: `${height}px`,
        background: `linear-gradient(180deg, ${top} 0%, ${top} 8%, ${bottom} 92%, ${bottom} 100%)`,
      }}
    >
      <span className="sc-blend__line" />
    </div>
  );
};

export default SectionDivider;
