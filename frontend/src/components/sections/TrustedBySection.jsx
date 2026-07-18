import React from "react";
import { useLang } from "@/i18n/LanguageContext";

/**
 * Monochrome text-based client "logos" that pop into their brand color on hover.
 * Uses distinctive typography per client to avoid the "same font" feel.
 */
const CLIENTS = [
  { name: "Cedrob SA", font: "'Manrope', sans-serif", weight: 800, tracking: "0em", color: "#c8102e" },
  { name: "Enel-med", font: "'Manrope', sans-serif", weight: 700, tracking: "-0.02em", color: "#003a70" },
  { name: "Prymat", font: "'Fraunces', serif", weight: 700, tracking: "-0.02em", color: "#c8102e" },
  { name: "KANAŁ ZERO", font: "'Manrope', sans-serif", weight: 900, tracking: "0.06em", color: "#111111" },
  { name: "IT CARD SA", font: "'Manrope', sans-serif", weight: 800, tracking: "0.08em", color: "#0a2540" },
  { name: "Urząd Miasta Gdańsk", font: "'Fraunces', serif", weight: 600, tracking: "-0.01em", color: "#b91c1c" },
  { name: "Eurocash", font: "'Manrope', sans-serif", weight: 800, tracking: "-0.02em", color: "#e11d48" },
  { name: "Evolia", font: "'Fraunces', serif", weight: 500, tracking: "0em", color: "#0f766e" },
  { name: "AMP Logistyka", font: "'Manrope', sans-serif", weight: 700, tracking: "0.02em", color: "#1e3a8a" },
  { name: "Lockheed Martin", font: "'Manrope', sans-serif", weight: 500, tracking: "0.32em", color: "#0b1f3a" },
  { name: "Wirtualna Polska", font: "'Manrope', sans-serif", weight: 800, tracking: "-0.02em", color: "#0f172a" },
];

const TrustedBySection = () => {
  const { t } = useLang();
  const doubled = [...CLIENTS, ...CLIENTS];

  return (
    <section
      id="trusted"
      data-testid="trusted-section"
      className="relative w-full"
      style={{ background: "#F8FAFA", color: "#1C2833" }}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10 pt-16 pb-6">
        <div className="flex items-center gap-4 text-[11px] uppercase tracking-[0.32em]" style={{ color: "#0C5C62" }}>
          <span className="inline-block h-px w-10" style={{ background: "#49ADA5" }} />
          {t.trusted.title}
        </div>
      </div>

      <div
        className="sc-marquee-wrap"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
        }}
      >
        <div className="sc-marquee sc-marquee--rtl" data-testid="trusted-marquee">
          {doubled.map((c, i) => (
            <span
              key={`${c.name}-${i}`}
              className="sc-logo-text group"
              style={{ fontFamily: c.font, fontWeight: c.weight, letterSpacing: c.tracking }}
              data-testid={`client-logo-${i}`}
            >
              <span
                className="sc-logo-text__inner"
                style={{ "--hover-color": c.color }}
              >
                {c.name}
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBySection;
