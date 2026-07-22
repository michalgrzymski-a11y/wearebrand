import React from "react";

/**
 * AuroraBorealis — pure CSS layered wave gradients that undulate.
 * Two variants controlled by `tone`: "dark" (neon on black) | "light" (subtle mint on white).
 * No JS; GPU-accelerated via transform + filter animations.
 */
const AuroraBorealis = ({ tone = "dark", intensity = 1 }) => {
  const className = `sc-fx-aurora sc-fx-aurora--${tone}`;
  return (
    <div className={className} style={{ "--fx-i": intensity }} aria-hidden="true">
      <span className="sc-fx-aurora__band sc-fx-aurora__band--a" />
      <span className="sc-fx-aurora__band sc-fx-aurora__band--b" />
      <span className="sc-fx-aurora__band sc-fx-aurora__band--c" />
      <span className="sc-fx-aurora__band sc-fx-aurora__band--d" />
    </div>
  );
};

export default AuroraBorealis;
