import React from "react";
import { useLang } from "@/i18n/LanguageContext";

const PARTNERS = [
  { name: "NetApp", font: "'Manrope', sans-serif", weight: 800, tracking: "-0.02em", highlight: true },
  { name: "Dell", font: "'Manrope', sans-serif", weight: 800, tracking: "0.04em" },
  { name: "Arista", font: "'Fraunces', serif", weight: 600, tracking: "-0.01em" },
  { name: "Baramundi", font: "'Manrope', sans-serif", weight: 700, tracking: "-0.01em" },
  { name: "Lenovo", font: "'Manrope', sans-serif", weight: 800, tracking: "-0.02em" },
  { name: "HPE", font: "'Manrope', sans-serif", weight: 900, tracking: "0.08em" },
  { name: "Cisco", font: "'Manrope', sans-serif", weight: 700, tracking: "-0.01em" },
  { name: "F5", font: "'Manrope', sans-serif", weight: 900, tracking: "0em" },
  { name: "Google", font: "'Fraunces', serif", weight: 500, tracking: "-0.02em" },
  { name: "Microsoft", font: "'Manrope', sans-serif", weight: 600, tracking: "-0.01em" },
  { name: "Huawei", font: "'Manrope', sans-serif", weight: 700, tracking: "-0.01em" },
  { name: "Commvault", font: "'Manrope', sans-serif", weight: 700, tracking: "-0.01em" },
  { name: "Veeam", font: "'Manrope', sans-serif", weight: 800, tracking: "-0.02em" },
];

const PartnersSection = () => {
  const { t } = useLang();
  const doubled = [...PARTNERS, ...PARTNERS];

  return (
    <section
      id="partners"
      data-testid="partners-section"
      className="relative w-full"
      style={{ background: "#F8FAFA", color: "#1C2833" }}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10 pt-14">
        <div
          className="flex items-center gap-4 text-[11px] uppercase tracking-[0.32em]"
          style={{ color: "#0C5C62" }}
        >
          <span className="inline-block h-px w-10" style={{ background: "#49ADA5" }} />
          {t.partners.section_label}
        </div>
        <h2
          data-testid="partners-title"
          className="mt-4 max-w-3xl text-2xl md:text-3xl font-semibold leading-[1.1] tracking-tight"
          style={{ color: "#0C5C62" }}
        >
          {t.partners.title}
        </h2>
      </div>

      <div
        className="sc-marquee-wrap mt-8 pb-14"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
        }}
      >
        <div
          className="sc-marquee sc-marquee--rtl sc-marquee--slow sc-marquee--muted"
          data-testid="partners-marquee"
        >
          {doubled.map((p, i) => (
            <div
              key={`${p.name}-${i}`}
              data-testid={`partner-logo-${i}`}
              className={
                p.highlight
                  ? "sc-partner-card sc-partner-card--highlight"
                  : "sc-partner-card"
              }
            >
              {p.highlight && (
                <span className="sc-partner-badge">
                  {t.partners.netapp_badge}
                </span>
              )}
              <span
                className="sc-partner-name"
                style={{
                  fontFamily: p.font,
                  fontWeight: p.weight,
                  letterSpacing: p.tracking,
                }}
              >
                {p.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
