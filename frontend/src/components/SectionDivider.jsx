import React from "react";

/**
 * SectionDivider — smooth transition between adjacent sections.
 * Props:
 *  - from:  hex/CSS color of the section ABOVE the divider
 *  - to:    hex/CSS color of the section BELOW the divider
 *  - variant: "curve" (default) — subtle sinusoidal wave with mint tech line overlay
 *             "gradient" — pure vertical gradient bridge (no wave)
 *             "beam" — horizontal mint beam splitting the two colors
 *  - height: divider height in px (default 120)
 *
 *  The divider is rendered as an SVG that fills its container edge-to-edge
 *  and blends the two section colors via a smooth curved shape + mint accent line.
 */
const SectionDivider = ({ from, to, variant = "curve", height = 120, id = "" }) => {
  const uid = React.useId().replace(/:/g, "");

  if (variant === "gradient") {
    return (
      <div
        aria-hidden="true"
        data-testid={id ? `divider-${id}` : "section-divider"}
        style={{
          height,
          background: `linear-gradient(180deg, ${from} 0%, ${to} 100%)`,
        }}
      />
    );
  }

  if (variant === "beam") {
    return (
      <div
        aria-hidden="true"
        data-testid={id ? `divider-${id}` : "section-divider"}
        className="relative"
        style={{ height }}
      >
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${from} 0%, ${to} 100%)` }} />
        <div
          className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(73,173,165,0.85) 50%, transparent 100%)",
            boxShadow: "0 0 24px rgba(73,173,165,0.4)",
          }}
        />
      </div>
    );
  }

  // "curve" — the default
  return (
    <div
      aria-hidden="true"
      data-testid={id ? `divider-${id}` : "section-divider"}
      className="relative w-full overflow-hidden"
      style={{ height, background: to }}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1600 120"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={from} stopOpacity="1" />
            <stop offset="65%" stopColor={from} stopOpacity="1" />
            <stop offset="100%" stopColor={from} stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`line-${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#49ADA5" stopOpacity="0" />
            <stop offset="35%" stopColor="#49ADA5" stopOpacity="0.75" />
            <stop offset="65%" stopColor="#49ADA5" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#49ADA5" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`line2-${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0C5C62" stopOpacity="0" />
            <stop offset="50%" stopColor="#0C5C62" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0C5C62" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Wave shape: fills upper region with `from` color, blending into `to` below */}
        <path
          d="M0 0 L1600 0 L1600 60 C 1300 90, 1000 20, 800 55 C 600 90, 300 20, 0 65 Z"
          fill={`url(#bg-${uid})`}
        />

        {/* Primary mint curve — tech line */}
        <path
          d="M0 68 C 250 40, 500 100, 800 62 C 1100 24, 1350 100, 1600 60"
          fill="none"
          stroke={`url(#line-${uid})`}
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
        {/* Secondary deeper curve */}
        <path
          d="M0 90 C 300 60, 550 118, 850 82 C 1150 46, 1350 108, 1600 82"
          fill="none"
          stroke={`url(#line2-${uid})`}
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />

        {/* Tiny data-packet dots along the primary curve */}
        {[0.2, 0.5, 0.78].map((t, i) => (
          <circle
            key={i}
            cx={1600 * t}
            cy={62 + Math.sin(t * Math.PI * 2) * 8}
            r="2.4"
            fill="#49ADA5"
          >
            <animate
              attributeName="opacity"
              values="0.3;1;0.3"
              dur="2.4s"
              begin={`${i * 0.6}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </svg>
    </div>
  );
};

export default SectionDivider;
