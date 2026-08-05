import React, { useState } from "react";
import { useLang } from "@/i18n/LanguageContext";
import {
  Landmark,
  Briefcase,
  Factory,
  RadioTower,
  Clapperboard,
  Building2,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import useSectionParallax from "@/hooks/useSectionParallax";

/**
 * Obszary — 6-port network switch visualization.
 * Each RJ45 port represents one industry area we serve.
 * Hover a port → link LED lights green, port glows, info panel below
 * updates with the sector name + short copy.
 */

const PORTS = [
  { id: "finance",   Icon: Landmark },
  { id: "services",  Icon: Briefcase },
  { id: "industry",  Icon: Factory },
  { id: "telecom",   Icon: RadioTower },
  { id: "media",     Icon: Clapperboard },
  { id: "gov",       Icon: Building2 },
];

const COPY = {
  pl: {
    section_label: "Obszary rynkowe",
    title_pre:     "Sześć portów.",
    title_accent:  "Sześć rynków, które łączymy.",
    title:         "Sześć portów. Sześć rynków, które łączymy.",
    subtitle:      "Najedź na port switcha, aby zobaczyć jak wspieramy dany sektor.",
    idle_hint:     "Wybierz port, aby zobaczyć obszar rynkowy",
    chassis_code:  "SC · 6-PORT · UP-LINK 10G",
    sectors: {
      finance:  { name: "Finanse",                        desc: "Banki, ubezpieczenia, fintech — środowiska z najwyższymi wymaganiami ciągłości, compliance i bezpieczeństwa danych." },
      services: { name: "Usługi",                         desc: "Sieci detaliczne, retail, e-commerce, transport, HoReCa — skalowalne środowiska pod dynamiczny wzrost." },
      industry: { name: "Przemysł",                       desc: "Produkcja ciężka, chemia, motoryzacja — infrastruktura dla OT/IT, MES i digital twins." },
      telecom:  { name: "Telekomunikacja i łączność",     desc: "Operatorzy, ISP, sieci szerokopasmowe — datacentry telco-grade z automatyzacją i observability." },
      media:    { name: "Media i Rozrywka",               desc: "Wydawcy, produkcja i dystrybucja treści, streaming — storage dla wielkich archiwów i workflow post-production." },
      gov:      { name: "Administracja państwowa i UE",   desc: "Instytucje publiczne, samorządy, projekty unijne — środowiska zgodne z KRI, KSC i wytycznymi UE." },
    },
  },
  en: {
    section_label: "Market areas",
    title_pre:     "Six ports.",
    title_accent:  "Six markets we connect.",
    title:         "Six ports. Six markets we connect.",
    subtitle:      "Hover a switch port to see how we support each sector.",
    idle_hint:     "Pick a port to reveal a market area",
    chassis_code:  "SC · 6-PORT · UP-LINK 10G",
    sectors: {
      finance:  { name: "Finance",                    desc: "Banking, insurance, fintech — environments with the highest continuity, compliance and data-security demands." },
      services: { name: "Services",                   desc: "Retail chains, e-commerce, transport, HoReCa — scalable environments for dynamic growth." },
      industry: { name: "Industry",                   desc: "Heavy manufacturing, chemicals, automotive — OT/IT infrastructure, MES and digital twins." },
      telecom:  { name: "Telecom & connectivity",     desc: "Carriers, ISPs, broadband — telco-grade datacenters with automation and observability." },
      media:    { name: "Media & Entertainment",      desc: "Publishers, content production and distribution, streaming — storage for massive archives and post-production workflows." },
      gov:      { name: "Government & EU affairs",    desc: "Public institutions, municipalities, EU projects — environments compliant with local and EU directives." },
    },
  },
};

const Obszary = () => {
  const { lang } = useLang();
  const copy = COPY[lang] || COPY.pl;
  const [hovered, setHovered] = useState(null);
  const [locked, setLocked] = useState(null);
  const currentId = locked || hovered;
  const active = currentId ? copy.sectors[currentId] : null;
  const parallaxRef = useSectionParallax();

  return (
    <section
      id="markets-switch"
      data-testid="switch-section"
      ref={parallaxRef}
      className="relative w-full overflow-hidden"
      style={{ background: "#040709", color: "#E8F4F5" }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-70 pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 55% at 80% 30%, rgba(6, 255, 224, 0.06) 0%, rgba(6, 255, 224, 0) 60%)," +
            " radial-gradient(50% 60% at 20% 70%, rgba(6, 184, 212, 0.05) 0%, rgba(6, 184, 212, 0) 60%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 py-14 md:py-20 pb-72 md:pb-80">
        <Reveal>
          <div
            className="flex items-center gap-4 text-[11px] uppercase tracking-[0.32em]"
            style={{ color: "#7CC4C0" }}
          >
            <span
              className="inline-block h-px w-10"
              style={{ background: "#49ADA5" }}
            />
            {copy.section_label}
          </div>
          <h2
            data-testid="switch-title"
            className="mt-4 text-2xl md:text-3xl font-semibold leading-[1.05] tracking-tight text-white max-w-3xl"
          >
            {copy.title_pre}{" "}
            <span
              className="font-semibold"
              style={{
                background: "linear-gradient(135deg,#06FFE0 0%,#00B8D4 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {copy.title_accent}
            </span>
          </h2>
          <p
            data-testid="switch-subtitle"
            className="mt-4 max-w-2xl text-base md:text-lg text-white/70"
          >
            {copy.subtitle}
          </p>
        </Reveal>

        {/* Switch chassis */}
        <div
          data-testid="switch-chassis"
          className="sc-switch mt-12 md:mt-14"
        >
          <div className="sc-switch__ear sc-switch__ear--l" aria-hidden="true">
            <span className="sc-switch__mount" />
            <span className="sc-switch__mount" />
          </div>

          <div className="sc-switch__body">
            <div className="sc-switch__head">
              <div className="sc-switch__brand">
                <span className="sc-switch__brand-line" />
                <span className="sc-switch__brand-name">SMARTCLOUT</span>
              </div>
              <div className="sc-switch__leds">
                <span className="sc-switch__led sc-switch__led--pwr" title="PWR" />
                <span className="sc-switch__led sc-switch__led--sys" title="SYS" />
                <span className="sc-switch__led sc-switch__led--act" title="ACT" />
              </div>
              <span className="sc-switch__code">{copy.chassis_code}</span>
            </div>

            <div className="sc-switch__ports">
              {PORTS.map((p, idx) => {
                const Icon = p.Icon;
                const isActive = currentId === p.id;
                const isLocked = locked === p.id;
                const sector = copy.sectors[p.id];
                return (
                  <button
                    key={p.id}
                    type="button"
                    className={`sc-port ${idx % 2 === 1 ? "sc-port--low" : ""} ${isActive ? "is-active" : ""} ${isLocked ? "is-locked" : ""}`}
                    onMouseEnter={() => setHovered(p.id)}
                    onFocus={() => setHovered(p.id)}
                    onMouseLeave={() => setHovered(null)}
                    onBlur={() => setHovered(null)}
                    onClick={() =>
                      setLocked((prev) => (prev === p.id ? null : p.id))
                    }
                    aria-pressed={isLocked}
                    aria-label={sector.name}
                    data-testid={`switch-port-${p.id}`}
                  >
                    <span className="sc-port__icon">
                      <Icon size={22} strokeWidth={1.7} />
                    </span>
                    <span className="sc-port__socket">
                      <span className="sc-port__leds">
                        <span className="sc-port__led sc-port__led--link" />
                        <span className="sc-port__led sc-port__led--act" />
                      </span>
                      <span className="sc-port__contacts" aria-hidden="true">
                        {Array.from({ length: 8 }).map((_, i) => (
                          <span key={i} />
                        ))}
                      </span>
                      <span className="sc-port__tab" aria-hidden="true" />
                      {/* Ethernet cable boot + cable + label physically attached to cable end */}
                      <span className="sc-port__boot" aria-hidden="true" />
                      <span className="sc-port__cable">
                        <svg viewBox="0 0 40 100" preserveAspectRatio="none" width="100%" height="100%" aria-hidden="true">
                          <path
                            d={idx < 3
                              ? "M 20 0 C 20 32 8 55 20 100"
                              : "M 20 0 C 20 32 32 55 20 100"}
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="sc-port__label" data-testid={`switch-label-${p.id}`}>
                          <span className="sc-port__label-clip" aria-hidden="true" />
                          {sector.name}
                        </span>
                      </span>
                    </span>
                    <span className="sc-port__num">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                  </button>
                );
              })}

              <div className="sc-switch__uplinks" aria-hidden="true">
                <span className="sc-switch__sfp" />
                <span className="sc-switch__sfp" />
                <span className="sc-switch__console" />
              </div>
            </div>

            <div className="sc-switch__foot" aria-hidden="true">
              <span className="sc-switch__foot-line" />
              <span className="sc-switch__foot-code">
                IT SMARTCLOUT · MRKT-6P v1.0
              </span>
            </div>
          </div>

          <div className="sc-switch__ear sc-switch__ear--r" aria-hidden="true">
            <span className="sc-switch__mount" />
            <span className="sc-switch__mount" />
          </div>
        </div>

        {/* Info panel removed — cable labels already carry the sector names. */}
      </div>
    </section>
  );
};

export default Obszary;
