import React from "react";
import { useLang } from "@/i18n/LanguageContext";

const AboutSection = () => {
  const { t } = useLang();
  return (
    <section
      id="about"
      data-testid="about-section"
      className="relative w-full"
      style={{ background: "#FFFFFF", color: "#1C2833" }}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-24 md:py-32">
        <div className="mb-14 flex items-center gap-4 text-[11px] uppercase tracking-[0.32em]" style={{ color: "#0C5C62" }}>
          <span className="inline-block h-px w-10" style={{ background: "#49ADA5" }} />
          {t.about.section_label}
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          {/* 2a - Metrics dashboard */}
          <div className="md:col-span-5">
            <div className="flex flex-col gap-5">
              {t.about.metrics.map((m, i) => (
                <div
                  key={m.label}
                  data-testid={`about-metric-${i}`}
                  className="sc-metric-card group"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <span
                      className="sc-metric-value"
                      style={{ color: "#0C5C62" }}
                    >
                      {m.value}
                    </span>
                    <span
                      className="text-[10px] uppercase tracking-[0.32em]"
                      style={{ color: "#49ADA5" }}
                    >
                      0{i + 1}
                    </span>
                  </div>
                  <div
                    className="mt-2 text-sm md:text-base"
                    style={{ color: "#1C2833" }}
                  >
                    {m.label}
                  </div>
                  <div className="sc-metric-underline" />
                </div>
              ))}
            </div>
          </div>

          {/* 2b - Narrative */}
          <div className="md:col-span-7">
            <p
              data-testid="about-narrative"
              className="sc-narrative"
              style={{ color: "#1C2833" }}
            >
              {t.about.narrative}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
