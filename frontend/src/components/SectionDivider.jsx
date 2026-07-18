import React from "react";

/**
 * SectionDivider — perceptual smooth transitions between adjacent sections.
 *
 *  Key upgrades over naive RGB gradients:
 *    1. Interpolation in **OKLAB** color space (via CSS `in oklab`) — kills the
 *       muddy grey/brown middle that appears when going dark→light in RGB.
 *    2. Layered gradient — the primary gradient carries color, a second
 *       gradient overlays a very soft mint glow at the seam so the eye
 *       reads it as light, not as a band.
 *    3. SVG grain overlay — masks residual GPU banding with organic noise.
 *
 *  Props:
 *    - from / to:  hex/CSS colors of the two adjacent sections
 *    - height:     divider height in px
 *    - glow:       "auto" (default) | "off" — whether to add the mint mid-glow
 */
const SectionDivider = ({ from, to, height = 220, glow = "auto", id = "" }) => {
  const testId = id ? `divider-${id}` : "section-divider";

  return (
    <div
      aria-hidden="true"
      data-testid={testId}
      style={{ height, position: "relative", overflow: "hidden" }}
    >
      {/* Base gradient in OKLAB — perceptually smooth */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(in oklab to bottom, ${from} 0%, ${to} 100%)`,
        }}
      />

      {/* Soft mid-glow — a wide radial mint hint sitting exactly on the seam.
          Keeps the transition visually alive, avoids the "flat rectangle" feel. */}
      {glow !== "off" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 65% 100% at 50% 50%, rgba(73,173,165,0.10) 0%, rgba(73,173,165,0) 65%)",
            mixBlendMode: "screen",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Grain — 3% opacity SVG noise breaks up GPU banding organically */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.29 0 0 0 0 0.68 0 0 0 0 0.65 0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.35'/></svg>\")",
          backgroundSize: "160px 160px",
          opacity: 0.35,
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

export default SectionDivider;
