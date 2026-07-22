import React, { useState } from "react";
import { useLang } from "@/i18n/LanguageContext";
import {
  Award,
  ShieldCheck,
  GraduationCap,
  Zap,
  UsersRound,
  BarChart3,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import useSectionParallax from "@/hooks/useSectionParallax";

/**
 * RackServerSection — vertical stack of 6 × 1U rack servers.
 * Each server represents a certification / competency tier of our team.
 * Hover a server → the row expands in place, revealing the badge name
 * + a short copy inside the same rack unit.
 */

const PHASES = [
  { id: "netapp",     Icon: Award,          u: 1 },
  { id: "vmware",     Icon: ShieldCheck,    u: 2 },
  { id: "cisco",      Icon: GraduationCap,  u: 3 },
  { id: "microsoft",  Icon: Zap,            u: 4 },
  { id: "dell",       Icon: UsersRound,     u: 5 },
  { id: "audit",      Icon: BarChart3,      u: 6 },
];

const COPY = {
  pl: {
    section_label: "Kompetencje i certyfikaty",
    title:         "Sześć jednostek. Sześć poziomów potwierdzonej wiedzy.",
    subtitle:      "Nasz zespół nie uczy się na Twoim projekcie. Najedź na jednostkę, aby zobaczyć poziom naszych certyfikacji.",
    chassis_code:  "SC · 6U · CERTS",
    phases: {
      netapp:    { name: "NetApp Certified",         desc: "Zespół z certyfikacjami NCDA, NCIE Data Protection i NCIE SAN. Referencyjne wdrożenia ONTAP, ASA, StorageGRID." },
      vmware:    { name: "VMware VCP / VCAP",        desc: "Certyfikowani architekci VMware — vSphere, vSAN i NSX. Doświadczenie w środowiskach multi-cluster i stretched." },
      cisco:     { name: "Cisco CCNP / CCIE",        desc: "Inżynierowie z uprawnieniami CCNP DC, Enterprise i Security. Nexus, Catalyst, ISE, Meraki." },
      microsoft: { name: "Microsoft Solutions Partner", desc: "Solutions Partner w obszarach Infrastructure, Data & AI oraz Modern Work. Wdrożenia Azure, M365, Entra ID." },
      dell:      { name: "Dell Titanium Partner",    desc: "Najwyższy tier partnerski Dell — pełne portfolio PowerEdge, PowerStore, PowerMax i VxRail bezpośrednio z fabryki." },
      audit:     { name: "Audyty i compliance",      desc: "Zespół z uprawnieniami do audytów KRI, KSC, dyrektyw UE i standardów ISO 27001 oraz PCI DSS." },
    },
  },
  en: {
    section_label: "Competencies & certifications",
    title:         "Six units. Six levels of proven expertise.",
    subtitle:      "Our team doesn't learn on your project. Hover a unit to see the depth of our certifications.",
    chassis_code:  "SC · 6U · CERTS",
    phases: {
      netapp:    { name: "NetApp Certified",           desc: "Team with NCDA, NCIE Data Protection and NCIE SAN certifications. Reference ONTAP, ASA and StorageGRID deployments." },
      vmware:    { name: "VMware VCP / VCAP",          desc: "Certified VMware architects — vSphere, vSAN and NSX. Experience with multi-cluster and stretched environments." },
      cisco:     { name: "Cisco CCNP / CCIE",          desc: "Engineers with CCNP DC, Enterprise and Security. Nexus, Catalyst, ISE and Meraki experts." },
      microsoft: { name: "Microsoft Solutions Partner",desc: "Solutions Partner in Infrastructure, Data & AI and Modern Work. Azure, M365 and Entra ID deployments." },
      dell:      { name: "Dell Titanium Partner",      desc: "Dell's highest partner tier — full PowerEdge, PowerStore, PowerMax and VxRail portfolio direct from the factory." },
      audit:     { name: "Audits & compliance",        desc: "Team qualified for KRI, KSC, EU directive audits and ISO 27001 / PCI DSS standards." },
    },
  },
};

const RackServerSection = () => {
  const { lang } = useLang();
  const copy = COPY[lang] || COPY.pl;
  const [hovered, setHovered] = useState(null);
  const parallaxRef = useSectionParallax();

  return (
    <section
      id="certifications"
      data-testid="lifecycle-section"
      ref={parallaxRef}
      className="relative w-full overflow-hidden"
      style={{ background: "#040709", color: "#E8F4F5" }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-70 pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 55% at 15% 40%, rgba(6, 255, 224, 0.05) 0%, rgba(6, 255, 224, 0) 60%)," +
            " radial-gradient(50% 60% at 85% 60%, rgba(6, 184, 212, 0.05) 0%, rgba(6, 184, 212, 0) 60%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 py-14 md:py-20">
        <Reveal>
          <div
            className="flex items-center gap-4 text-[11px] uppercase tracking-[0.32em]"
            style={{ color: "#7CC4C0" }}
          >
            <span className="inline-block h-px w-10" style={{ background: "#49ADA5" }} />
            {copy.section_label}
          </div>
          <h2
            data-testid="lifecycle-title"
            className="mt-4 text-3xl md:text-5xl font-semibold leading-[1.05] tracking-tight text-white max-w-3xl"
          >
            {copy.title}
          </h2>
          <p
            data-testid="lifecycle-subtitle"
            className="mt-4 max-w-2xl text-base md:text-lg text-white/70"
          >
            {copy.subtitle}
          </p>
        </Reveal>

        <div
          data-testid="lifecycle-chassis"
          className={`sc-rserv mt-12 md:mt-14 ${hovered ? "is-hovered" : ""}`}
          onMouseLeave={() => setHovered(null)}
        >
          <div className="sc-rserv__ear sc-rserv__ear--l" aria-hidden="true">
            <span className="sc-rserv__mount" />
            <span className="sc-rserv__mount" />
            <span className="sc-rserv__mount" />
          </div>

          <div className="sc-rserv__body">
            <div className="sc-rserv__head">
              <span className="sc-rserv__led sc-rserv__led--pwr" />
              <span className="sc-rserv__code">{copy.chassis_code}</span>
              <span className="sc-rserv__led sc-rserv__led--act" />
            </div>

            <div className="sc-rserv__units">
              {PHASES.map((phase, idx) => {
                const Icon = phase.Icon;
                const isActive = hovered === phase.id;
                const info = copy.phases[phase.id];
                return (
                  <button
                    key={phase.id}
                    type="button"
                    className={`sc-runit ${isActive ? "is-active" : ""}`}
                    onMouseEnter={() => setHovered(phase.id)}
                    onFocus={() => setHovered(phase.id)}
                    aria-label={info.name}
                    data-testid={`lifecycle-unit-${phase.id}`}
                  >
                    <span className="sc-runit__ubadge">
                      {String(phase.u).padStart(2, "0")}U
                    </span>
                    <span className="sc-runit__leds" aria-hidden="true">
                      <span className="sc-runit__led sc-runit__led--pwr" />
                      <span className="sc-runit__led sc-runit__led--hdd" />
                      <span className="sc-runit__led sc-runit__led--net" />
                    </span>
                    <span className="sc-runit__icon">
                      <Icon size={20} strokeWidth={1.7} />
                    </span>
                    <span className="sc-runit__vents" aria-hidden="true">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <span key={i} />
                      ))}
                    </span>
                    <span className="sc-runit__body">
                      <span
                        className="sc-runit__name"
                        data-testid={`lifecycle-name-${phase.id}`}
                      >
                        {info.name}
                      </span>
                      <span
                        className="sc-runit__desc"
                        data-testid={`lifecycle-desc-${phase.id}`}
                      >
                        {info.desc}
                      </span>
                    </span>
                    <span className="sc-runit__eject" aria-hidden="true" />
                  </button>
                );
              })}
            </div>

            <div className="sc-rserv__foot" aria-hidden="true">
              <span className="sc-rserv__foot-line" />
              <span className="sc-rserv__foot-code">
                IT SMARTCLOUT · JOURNEY v2.0
              </span>
            </div>
          </div>

          <div className="sc-rserv__ear sc-rserv__ear--r" aria-hidden="true">
            <span className="sc-rserv__mount" />
            <span className="sc-rserv__mount" />
            <span className="sc-rserv__mount" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default RackServerSection;
