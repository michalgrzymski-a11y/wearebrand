import React from "react";
import { useLang } from "@/i18n/LanguageContext";

/**
 * Real client logotypes rendered as monochrome images that reveal their brand
 * color on hover. Grayscale + reduced opacity in resting state, full color on hover.
 */
const CLIENTS = [
  { name: "Grupa Azoty",         file: "azoty.webp" },
  { name: "Kanał Zero",          file: "zero.webp" },
  { name: "Oponeo",              file: "oponeo.webp" },
  { name: "Sescom",              file: "sescom.webp" },
  { name: "Kaufland",            file: "kaufland.webp" },
  { name: "Cedrob",              file: "cedrob.webp" },
  { name: "CRIST",               file: "crist.webp",   dark: true },
  { name: "DOZ.pl",              file: "doz.webp" },
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
      <div className="mx-auto max-w-7xl px-6 md:px-10 pt-8 pb-3">
        <div
          className="flex items-center gap-4 text-[11px] uppercase tracking-[0.32em]"
          style={{ color: "#0C5C62" }}
        >
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
              className={`sc-logo-img ${c.dark ? "sc-logo-img--dark" : ""}`}
              data-testid={`client-logo-${i}`}
              title={c.name}
            >
              <img
                src={`${process.env.PUBLIC_URL}/logos/${c.file}`}
                alt={c.name}
                loading="lazy"
                draggable="false"
              />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBySection;
