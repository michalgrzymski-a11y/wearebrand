import React, { useState, useEffect, useMemo, useRef } from "react";
import { useLang } from "@/i18n/LanguageContext";
import {
  Server, HardDrive, DatabaseBackup, Network, ShieldCheck, Cloud,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import useSectionParallax from "@/hooks/useSectionParallax";

/**
 * PartnersV2 — interactive rack cabinet section.
 * Left column: rack cabinet with 6 category tiles (server slots).
 * Right column: partner brand logotypes (text-based) filtered by hovered/active tile.
 */
const CATEGORIES = [
  {
    id: "servers",
    Icon: Server,
    name_pl: "Serwery & Wirtualizacja",
    name_en: "Servers & Virtualization",
    partners: ["DELL", "ASUS", "Lenovo", "Nutanix", "Microsoft", "vmware", "proxmox"],
  },
  {
    id: "storage",
    Icon: HardDrive,
    name_pl: "Storage",
    name_en: "Storage",
    partners: ["NetApp", "Lenovo", "DELL", "Huawei", "Pure Storage"],
  },
  {
    id: "backup",
    Icon: DatabaseBackup,
    name_pl: "Backup",
    name_en: "Backup",
    partners: ["Commvault", "Veeam"],
  },
  {
    id: "network",
    Icon: Network,
    name_pl: "Sieć",
    name_en: "Network",
    partners: ["ARISTA", "DELL", "HPE", "Extreme Networks", "Cisco", "Brocade", "Huawei"],
  },
  {
    id: "security",
    Icon: ShieldCheck,
    name_pl: "Security & Management",
    name_en: "Security & Management",
    partners: ["SailPoint", "baramundi"],
  },
  {
    id: "software",
    Icon: Cloud,
    name_pl: "Software & Cloud",
    name_en: "Software & Cloud",
    partners: ["Microsoft", "Google", "AWS", "uptime DC", "xorux"],
  },
];

const PartnersV2Section = () => {
  const { lang } = useLang();
  const [active, setActive] = useState(null); // no category active until first hover
  const [hasInteracted, setHasInteracted] = useState(false);
  const activeCat = CATEGORIES.find((c) => c.id === active) || null;
  const parallaxRef = useSectionParallax();

  // Pool of all partners across categories (with source category for potential styling)
  const pool = useMemo(() => {
    const seen = new Set();
    const list = [];
    CATEGORIES.forEach((cat) => {
      cat.partners.forEach((p) => {
        const key = `${cat.id}:${p}`;
        if (!seen.has(key)) {
          seen.add(key);
          list.push({ name: p, cat: cat.id });
        }
      });
    });
    return list;
  }, []);

  // Random scatter — 10 floating logos, refreshed periodically until first interaction
  const [scatter, setScatter] = useState([]);
  const tickRef = useRef(0);
  const generateScatter = () => {
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 10);
    // Distribute across 10 vertical bands to avoid overlaps, add jitter
    const items = shuffled.map((entry, i) => {
      const band = i / 10; // 0..0.9
      const y = band * 88 + Math.random() * 6 + 2; // 2..96%
      const x = 6 + Math.random() * 78; // 6..84%
      const rot = (Math.random() - 0.5) * 4;
      return {
        key: `${tickRef.current}-${i}-${entry.cat}-${entry.name}`,
        name: entry.name,
        cat: entry.cat,
        x,
        y,
        rot,
        delay: i * 60,
      };
    });
    tickRef.current += 1;
    setScatter(items);
  };
  useEffect(() => {
    generateScatter();
    if (hasInteracted) return undefined;
    const id = setInterval(generateScatter, 2600);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasInteracted]);

  const handlePick = (id) => {
    setHasInteracted(true);
    setActive(id);
  };

  return (
    <section
      id="partners-rack"
      data-testid="partners-rack-section"
      ref={parallaxRef}
      className="relative w-full overflow-hidden"
      style={{ background: "#040709", color: "#E8F4F5" }}
    >
      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 py-24 md:py-32">
        <Reveal>
          <div
            className="flex items-center gap-4 text-[11px] uppercase tracking-[0.32em]"
            style={{ color: "#7CC4C0" }}
          >
            <span className="inline-block h-px w-10" style={{ background: "#49ADA5" }} />
            {lang === "pl" ? "Stack technologiczny" : "Technology stack"}
          </div>
          <h2
            data-testid="partners-rack-title"
            className="mt-4 text-3xl md:text-5xl font-semibold leading-[1.05] tracking-tight text-white max-w-3xl"
          >
            {lang === "pl"
              ? "Jedna szafa — wszystkie warstwy IT."
              : "One rack — every IT layer."}
          </h2>
          <p className="mt-5 max-w-2xl text-base md:text-lg text-white/70">
            {lang === "pl"
              ? "Najedź na moduł w racku, aby zobaczyć producentów, z którymi projektujemy dla Ciebie tę warstwę."
              : "Hover a rack slot to see the vendors we design that layer with for you."}
          </p>
        </Reveal>

        <div className="mt-14 md:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          {/* Left — rack cabinet with 6 tiles */}
          <div className="sc-rack" data-testid="rack-cabinet">
            <div className="sc-rack__frame">
              <div className="sc-rack__head">
                <span className="sc-rack__pulse" />
                <span className="sc-rack__code">RACK · 42U · POWER OK</span>
                <span className="sc-rack__temp">22°C</span>
              </div>
              <div className="sc-rack__slots">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.Icon;
                  const isActive = cat.id === active;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onMouseEnter={() => handlePick(cat.id)}
                      onFocus={() => handlePick(cat.id)}
                      onClick={() => handlePick(cat.id)}
                      className={`sc-rack__slot ${isActive ? "is-active" : ""}`}
                      data-testid={`rack-slot-${cat.id}`}
                    >
                      <span className="sc-rack__slot-led" />
                      <span className="sc-rack__slot-led sc-rack__slot-led--b" />
                      <span className="sc-rack__slot-icon">
                        <Icon size={18} strokeWidth={1.7} />
                      </span>
                      <span className="sc-rack__slot-label">
                        {lang === "pl" ? cat.name_pl : cat.name_en}
                      </span>
                      <span className="sc-rack__slot-count">
                        {String(cat.partners.length).padStart(2, "0")}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="sc-rack__foot">
                <span className="sc-rack__foot-line" />
                <span className="sc-rack__foot-code">IT SMARTCLOUT · v4.2</span>
              </div>
            </div>
          </div>

          {/* Right — partners list */}
          <div className="sc-partners2" data-testid="partners-vendors">
            <div className="sc-partners2__head">
              <span className="sc-partners2__kicker">
                {hasInteracted
                  ? (lang === "pl" ? "Producenci warstwy" : "Vendors for layer")
                  : (lang === "pl" ? "Wybrani producenci" : "Selected vendors")}
              </span>
              <div className="sc-partners2__title">
                {hasInteracted && activeCat
                  ? (lang === "pl" ? activeCat.name_pl : activeCat.name_en)
                  : (lang === "pl"
                      ? "Najedź na warstwę racka →"
                      : "Hover a rack layer →")}
              </div>
            </div>

            {!hasInteracted && (
              <div
                className="sc-partners2__scatter"
                data-testid="partners-scatter"
                aria-hidden="true"
              >
                {scatter.map((it) => (
                  <span
                    key={it.key}
                    className="sc-partners2__float"
                    style={{
                      left: `${it.x}%`,
                      top: `${it.y}%`,
                      transform: `translate(-50%, -50%) rotate(${it.rot}deg)`,
                      animationDelay: `${it.delay}ms`,
                    }}
                  >
                    {it.name}
                  </span>
                ))}
              </div>
            )}

            {hasInteracted && activeCat && (
              <div key={activeCat.id} className="sc-partners2__grid">
                {activeCat.partners.map((p, i) => (
                  <span
                    key={p}
                    className="sc-partners2__logo"
                    style={{ animationDelay: `${i * 60}ms` }}
                    data-testid={`vendor-${activeCat.id}-${i}`}
                  >
                    {p}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersV2Section;
