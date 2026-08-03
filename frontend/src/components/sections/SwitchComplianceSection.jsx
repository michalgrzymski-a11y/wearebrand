import React, { useMemo, useState } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { Shield, FileCheck2, Landmark, Award, Fingerprint, Lock } from "lucide-react";
import Reveal from "@/components/Reveal";
import useSectionParallax from "@/hooks/useSectionParallax";

/**
 * SwitchComplianceSection — druga wersja SwitchSection: te same
 * wizualne porty, ale każdy port reprezentuje inny obszar
 * compliance/regulacji, w które SMARTCLOUT wpisuje projekty klientów.
 */

const COPY = {
  pl: {
    label: "Compliance & regulacje",
    title: "Każdy projekt SMARTCLOUT wpina się",
    accent: "w Twoje regulacje.",
    subtitle:
      "Ten sam switch — inne wartości. Zamiast sektorów, każdy port reprezentuje obszar zgodności, który uwzględniamy przy projekcie infrastruktury.",
    ports: [
      { id: "rodo", name: "RODO / GDPR", desc: "Dane osobowe, DPO, DPIA", Icon: Shield },
      { id: "iso27001", name: "ISO 27001", desc: "Zarządzanie bezpieczeństwem informacji", Icon: Lock },
      { id: "nis2", name: "NIS2 / KSC", desc: "Podmioty kluczowe i istotne", Icon: Landmark },
      { id: "iso9001", name: "ISO 9001", desc: "Zarządzanie jakością", Icon: Award },
      { id: "pcidss", name: "PCI-DSS", desc: "Środowiska kartowe", Icon: FileCheck2 },
      { id: "soc2", name: "SOC 2", desc: "Usługi w chmurze i SaaS", Icon: Fingerprint },
    ],
  },
  en: {
    label: "Compliance & regulations",
    title: "Every SMARTCLOUT project plugs",
    accent: "into your regulations.",
    subtitle:
      "The same switch — different values. Instead of market sectors, each port represents a compliance area we build into the infrastructure design.",
    ports: [
      { id: "rodo", name: "GDPR", desc: "Personal data, DPO, DPIA", Icon: Shield },
      { id: "iso27001", name: "ISO 27001", desc: "Information security management", Icon: Lock },
      { id: "nis2", name: "NIS2", desc: "Essential & important entities", Icon: Landmark },
      { id: "iso9001", name: "ISO 9001", desc: "Quality management", Icon: Award },
      { id: "pcidss", name: "PCI-DSS", desc: "Cardholder environments", Icon: FileCheck2 },
      { id: "soc2", name: "SOC 2", desc: "Cloud & SaaS services", Icon: Fingerprint },
    ],
  },
};

const SwitchComplianceSection = () => {
  const { lang } = useLang();
  const copy = COPY[lang] || COPY.pl;
  const parallaxRef = useSectionParallax();
  const [active, setActive] = useState(copy.ports[0].id);
  const activePort = useMemo(() => copy.ports.find((p) => p.id === active) || copy.ports[0], [active, copy.ports]);

  return (
    <section
      id="compliance-switch"
      data-testid="compliance-switch-section"
      ref={parallaxRef}
      className="relative w-full overflow-hidden"
      style={{ background: "#040709", color: "#E8F4F5" }}
    >
      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 py-14 md:py-20 pb-72 md:pb-80">
        <Reveal>
          <div className="flex items-center gap-4 text-[12px] uppercase tracking-[0.34em]" style={{ color: "#7CC4C0" }}>
            <span className="inline-block h-px w-12" style={{ background: "#49ADA5" }} />
            {copy.label}
          </div>
          <h2 className="mt-4 text-4xl md:text-6xl font-semibold leading-[1.02] tracking-tight text-white max-w-3xl">
            {copy.title}{" "}
            <span className="font-semibold" style={{
              background: "linear-gradient(135deg,#06FFE0 0%,#00B8D4 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              {copy.accent}
            </span>
          </h2>
          <p className="mt-4 max-w-3xl text-lg text-white/70">{copy.subtitle}</p>

          <div className="sc-compliance-caption" data-testid="compliance-caption">
            <span className="sc-compliance-caption__label">Aktywny obszar</span>
            <span className="sc-compliance-caption__name">{activePort.name}</span>
            <span className="sc-compliance-caption__desc">{activePort.desc}</span>
          </div>
        </Reveal>

        <div className="mt-12 sc-switch" data-testid="compliance-switch">
          <div className="sc-switch__ear sc-switch__ear--l" aria-hidden="true">
            <span className="sc-switch__mount" />
            <span className="sc-switch__mount" />
          </div>
          <div className="sc-switch__body">
            <div className="sc-switch__head">
              <span className="sc-switch__brand">SMARTCLOUT · COMPLIANCE-SW</span>
              <span className="sc-switch__code">SC-CMP-06 / v1.0</span>
              <span className="sc-switch__leds">
                <span className="sc-switch__led is-on" />
                <span className="sc-switch__led is-on" />
                <span className="sc-switch__led is-blink" />
              </span>
            </div>
            <div className="sc-switch__ports">
              {copy.ports.map((p, idx) => {
                const Icon = p.Icon;
                const isActive = p.id === active;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setActive(p.id)}
                    className={`sc-port ${idx % 2 === 1 ? "sc-port--low" : ""} ${isActive ? "is-active" : ""}`}
                    data-testid={`compliance-port-${p.id}`}
                    aria-pressed={isActive}
                  >
                    <span className="sc-port__icon" aria-hidden="true"><Icon size={20} strokeWidth={1.7} /></span>
                    <span className="sc-port__socket">
                      <span className="sc-port__leds">
                        <span className="sc-port__led sc-port__led--link" />
                        <span className="sc-port__led sc-port__led--act" />
                      </span>
                      <span className="sc-port__contacts" aria-hidden="true">
                        {Array.from({ length: 8 }).map((_, i) => (<span key={i} />))}
                      </span>
                      <span className="sc-port__tab" aria-hidden="true" />
                      <span className="sc-port__boot" aria-hidden="true" />
                      <span className="sc-port__cable">
                        <svg viewBox="0 0 40 100" preserveAspectRatio="none" width="100%" height="100%" aria-hidden="true">
                          <path
                            d={idx < 3 ? "M 20 0 C 20 32 8 55 20 100" : "M 20 0 C 20 32 32 55 20 100"}
                            stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round"
                          />
                        </svg>
                        <span className="sc-port__label" data-testid={`compliance-label-${p.id}`}>
                          <span className="sc-port__label-clip" aria-hidden="true" />
                          {p.name}
                        </span>
                      </span>
                    </span>
                    <span className="sc-port__num">{String(idx + 1).padStart(2, "0")}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="sc-switch__ear sc-switch__ear--r" aria-hidden="true">
            <span className="sc-switch__mount" />
            <span className="sc-switch__mount" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SwitchComplianceSection;
