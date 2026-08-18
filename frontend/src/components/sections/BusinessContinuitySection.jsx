import React from "react";
import { useLang } from "@/i18n/LanguageContext";
import { Zap, ShieldCheck, Activity, Server } from "lucide-react";
import Reveal from "@/components/Reveal";
import useSectionParallax from "@/hooks/useSectionParallax";

/**
 * BusinessContinuitySection — light-background section showcasing power
 * continuity through a rack-mounted PDU (Power Distribution Unit)
 * visualization paired with 4 value cards about resilience.
 */

const COPY = {
  pl: {
    section_label: "Ciągłość działania",
    title: "Biznes, który nigdy",
    title_accent: "nie milknie.",
    subtitle:
      "Projektujemy infrastrukturę tak, aby awaria pojedynczego elementu nigdy nie oznaczała przerwy w usłudze. Redundantne ścieżki danych, geo-replikacja i mierzalne parametry SLA — ciągłość nie z hasła, a z architektury.",
    pdu_code: "SC · CORE · UPTIME 99.99%",
    pdu_meter: "99.99",
    pdu_amps: "% SLA",
    pdu_load: "UPTIME · Q4",
    values: [
      {
        id: "redundancy",
        Icon: Zap,
        title: "Architektura N+1 i active-active",
        desc: "Dwa niezależne tory produkcyjne, replikacja synchroniczna między lokalizacjami, brak pojedynczego punktu awarii w warstwie krytycznej.",
      },
      {
        id: "geo",
        Icon: ShieldCheck,
        title: "Geo-redundancja",
        desc: "Dane i usługi rozproszone między co najmniej dwoma ośrodkami. Przełączenie ruchu użytkowników w minutach, nie w godzinach.",
      },
      {
        id: "monitor",
        Icon: Activity,
        title: "Monitoring 24/7",
        desc: "Obserwowalność end-to-end — od aplikacji po infrastrukturę. Alarmy trafiają do NOC zanim użytkownik zdąży zauważyć problem.",
      },
      {
        id: "dr",
        Icon: Server,
        title: "RTO / RPO w SLA",
        desc: "Mierzalne parametry disaster recovery zapisane w kontrakcie. Kwartalne testy fail-over potwierdzają, że plan działa, gdy jest potrzebny.",
      },
    ],
    cta: "Zaplanuj audyt ciągłości",
  },
  en: {
    section_label: "Business continuity",
    title: "A business that",
    title_accent: "never goes silent.",
    subtitle:
      "We design infrastructure so a single failure never means a service outage. Redundant data paths, geo-replication and measurable SLA parameters — continuity by architecture, not by slogan.",
    pdu_code: "SC · CORE · UPTIME 99.99%",
    pdu_meter: "99.99",
    pdu_amps: "% SLA",
    pdu_load: "UPTIME · Q4",
    values: [
      {
        id: "redundancy",
        Icon: Zap,
        title: "N+1 & active-active architecture",
        desc: "Two independent production paths, synchronous replication between sites, no single point of failure in the critical layer.",
      },
      {
        id: "geo",
        Icon: ShieldCheck,
        title: "Geo-redundancy",
        desc: "Data and services spread across at least two sites. User traffic can be switched over in minutes, not hours.",
      },
      {
        id: "monitor",
        Icon: Activity,
        title: "24/7 monitoring",
        desc: "End-to-end observability — from application to infrastructure. Alerts reach NOC before a user notices anything is wrong.",
      },
      {
        id: "dr",
        Icon: Server,
        title: "RTO / RPO in SLA",
        desc: "Measurable disaster recovery parameters written in the contract. Quarterly fail-over tests prove the plan works when it matters.",
      },
    ],
    cta: "Plan a continuity audit",
  },
};

const BANK_A_OUTLETS = 6;
const BANK_B_OUTLETS = 6;

const BusinessContinuitySection = () => {
  const { lang } = useLang();
  const copy = COPY[lang] || COPY.pl;
  const parallaxRef = useSectionParallax();

  return (
    <section
      id="continuity"
      data-testid="continuity-section"
      ref={parallaxRef}
      className="relative w-full overflow-hidden"
      style={{ background: "#F8FAFA", color: "#1C2833" }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(55% 55% at 85% 20%, rgba(12,92,98,0.05) 0%, rgba(12,92,98,0) 60%)," +
            " radial-gradient(50% 60% at 10% 80%, rgba(73,173,165,0.06) 0%, rgba(73,173,165,0) 60%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-28">
        <Reveal>
          <div
            className="flex items-center gap-4 text-[12px] uppercase tracking-[0.34em]"
            style={{ color: "#0C5C62" }}
          >
            <span className="inline-block h-px w-12" style={{ background: "#00B8D4" }} />
            {copy.section_label}
          </div>
          <h2
            data-testid="continuity-title"
            className="mt-5 text-4xl md:text-6xl font-semibold leading-[1.02] tracking-tight max-w-4xl"
          >
            {copy.title}{" "}
            <span
              className="font-semibold"
              style={{ color: "#0C5C62" }}
            >
              {copy.title_accent}
            </span>
          </h2>
          <p className="mt-6 max-w-3xl text-lg md:text-xl leading-relaxed" style={{ color: "rgba(28,40,51,0.72)" }}>
            {copy.subtitle}
          </p>
        </Reveal>

        <div className="mt-14 md:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* PDU visualization */}
          <div className="lg:col-span-7">
            <div className="sc-pdu" data-testid="pdu-device">
              <div className="sc-pdu__ear sc-pdu__ear--l" aria-hidden="true">
                <span className="sc-pdu__mount" />
                <span className="sc-pdu__mount" />
              </div>

              <div className="sc-pdu__body">
                <div className="sc-pdu__head">
                  <span className="sc-pdu__breaker" aria-hidden="true">
                    <span className="sc-pdu__breaker-toggle" />
                    <span className="sc-pdu__breaker-label">CORE · ONLINE</span>
                  </span>
                  <span className="sc-pdu__display" aria-label="Continuity meter">
                    <span className="sc-pdu__display-value">{copy.pdu_meter}</span>
                    <span className="sc-pdu__display-sub">{copy.pdu_amps}</span>
                    <span className="sc-pdu__display-bar">
                      <span className="sc-pdu__display-bar-fill" />
                    </span>
                    <span className="sc-pdu__display-label">{copy.pdu_load}</span>
                  </span>
                </div>

                <div className="sc-pdu__banks">
                  <div className="sc-pdu__bank" data-testid="pdu-bank-a">
                    <span className="sc-pdu__bank-label">SITE A · PRIMARY</span>
                    <div className="sc-pdu__outlets">
                      {Array.from({ length: BANK_A_OUTLETS }).map((_, i) => (
                        <span
                          key={`a-${i}`}
                          className={`sc-pdu__outlet ${i % 3 === 2 ? "is-idle" : "is-live"}`}
                        >
                          <span className="sc-pdu__outlet-slot" />
                          <span className="sc-pdu__outlet-slot" />
                          <span className="sc-pdu__outlet-ground" />
                          <span className="sc-pdu__outlet-led" />
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="sc-pdu__divider" aria-hidden="true" />

                  <div className="sc-pdu__bank" data-testid="pdu-bank-b">
                    <span className="sc-pdu__bank-label">SITE B · DR</span>
                    <div className="sc-pdu__outlets">
                      {Array.from({ length: BANK_B_OUTLETS }).map((_, i) => (
                        <span
                          key={`b-${i}`}
                          className={`sc-pdu__outlet ${i % 4 === 3 ? "is-idle" : "is-live"}`}
                        >
                          <span className="sc-pdu__outlet-slot" />
                          <span className="sc-pdu__outlet-slot" />
                          <span className="sc-pdu__outlet-ground" />
                          <span className="sc-pdu__outlet-led" />
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="sc-pdu__foot" aria-hidden="true">
                  <span className="sc-pdu__foot-line" />
                  <span className="sc-pdu__foot-code">{copy.pdu_code}</span>
                </div>
              </div>

              <div className="sc-pdu__ear sc-pdu__ear--r" aria-hidden="true">
                <span className="sc-pdu__mount" />
                <span className="sc-pdu__mount" />
              </div>
            </div>

            {/* Site links (primary / DR) */}
            <div className="sc-pdu-feeds" aria-hidden="true">
              <span className="sc-pdu-feed sc-pdu-feed--a">
                <span className="sc-pdu-feed__tag">SITE A</span>
                <span className="sc-pdu-feed__line" />
              </span>
              <span className="sc-pdu-feed sc-pdu-feed--b">
                <span className="sc-pdu-feed__tag">SITE B · DR</span>
                <span className="sc-pdu-feed__line" />
              </span>
            </div>
          </div>

          {/* Value cards */}
          <div className="lg:col-span-5">
            <ul className="sc-continuity-values" data-testid="continuity-values">
              {copy.values.map((v) => {
                const Icon = v.Icon;
                return (
                  <li
                    key={v.id}
                    className="sc-continuity-value"
                    data-testid={`continuity-value-${v.id}`}
                  >
                    <span className="sc-continuity-value__icon">
                      <Icon size={20} strokeWidth={1.7} />
                    </span>
                    <div>
                      <h3 className="sc-continuity-value__title">{v.title}</h3>
                      <p className="sc-continuity-value__desc">{v.desc}</p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <a
              href="#contact"
              data-testid="continuity-cta"
              className="sc-continuity-cta"
            >
              {copy.cta}
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessContinuitySection;
