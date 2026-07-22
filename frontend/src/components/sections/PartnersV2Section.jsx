import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";
import {
  Server, HardDrive, DatabaseBackup, Network, ShieldCheck, Cloud,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import useSectionParallax from "@/hooks/useSectionParallax";
import { slugify } from "@/data/partners";

/**
 * PartnersV2 — interactive rack cabinet section.
 * Left column: rack cabinet with 6 category tiles.
 * Right column: ALL partner logotypes, grouped by category, transparent bg,
 * monochromatic by default and revealing full brand color on hover
 * (or when the matching rack layer is hovered).
 */
const VENDOR_LOGOS = {
  "DELL": "/logos/vendors/dell.webp",
  "ASUS": "/logos/vendors/asus.webp",
  "Lenovo": "/logos/vendors/lenovo.webp",
  "Nutanix": "/logos/vendors/nutanix.webp",
  "Microsoft": "/logos/vendors/microsoft.webp",
  "vmware": "/logos/vendors/vmware.webp",
  "NetApp": "/logos/vendors/netapp.webp",
  "Commvault": "/logos/vendors/commvault.webp",
  "Veeam": "/logos/vendors/veeam.webp",
  "ARISTA": "/logos/vendors/arista.webp",
  "HPE": "/logos/vendors/hpe.webp",
  "Extreme Networks": "/logos/vendors/extreme-networks.webp",
  "Cisco": "/logos/vendors/cisco.webp",
  "Brocade": "/logos/vendors/brocade.webp",
  "SailPoint": "/logos/vendors/sailpoint.webp",
  "baramundi": "/logos/vendors/baramundi.webp",
  "Google": "/logos/vendors/google.webp",
  "AWS": "/logos/vendors/aws.webp",
};

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
  const [hoveredCat, setHoveredCat] = useState(null);
  const [lockedCat, setLockedCat] = useState(null);
  const parallaxRef = useSectionParallax();
  // Lock takes precedence over hover.
  const currentCatId = lockedCat || hoveredCat;
  const activeCat = currentCatId
    ? CATEGORIES.find((c) => c.id === currentCatId)
    : null;

  // Flat, deduped vendor list — order preserved by first occurrence across categories.
  // Each entry carries the set of categories it supports for hover-driven highlight.
  const flatVendors = React.useMemo(() => {
    const seen = new Map(); // name -> { name, cats: Set }
    CATEGORIES.forEach((cat) => {
      cat.partners.forEach((p) => {
        if (!seen.has(p)) seen.set(p, { name: p, cats: new Set([cat.id]) });
        else seen.get(p).cats.add(cat.id);
      });
    });
    return Array.from(seen.values());
  }, []);

  return (
    <section
      id="partners-rack"
      data-testid="partners-rack-section"
      ref={parallaxRef}
      className="relative w-full overflow-hidden"
      style={{ background: "#040709", color: "#E8F4F5" }}
    >
      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 py-14 md:py-20">
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
            className="mt-4 text-4xl md:text-6xl font-semibold leading-[1.02] tracking-tight text-white max-w-3xl"
          >
            {lang === "pl"
              ? "Jedna szafa — wszystkie warstwy IT."
              : "One rack — every IT layer."}
          </h2>
          <p className="mt-5 max-w-2xl text-base md:text-lg text-white/70">
            {lang === "pl"
              ? "Najedź na moduł w racku, aby podświetlić producentów wspierających tę warstwę. Ich pełne kolory brandowe ujawnią się także po najechaniu na sam logotyp."
              : "Hover a rack slot to highlight the vendors we design that layer with. Full brand colors also reveal on individual logo hover."}
          </p>
        </Reveal>

        <div className="mt-14 md:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left — rack cabinet with 6 tiles */}
          <div className="sc-rack lg:col-span-5" data-testid="rack-cabinet">
            <div className="sc-rack__frame">
              <div className="sc-rack__head">
                <span className="sc-rack__pulse" />
                <span className="sc-rack__code">RACK · 42U · POWER OK</span>
                <span className="sc-rack__temp">22°C</span>
              </div>
              <div className="sc-rack__slots">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.Icon;
                  const isActive = cat.id === currentCatId;
                  const isLocked = cat.id === lockedCat;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onMouseEnter={() => setHoveredCat(cat.id)}
                      onFocus={() => setHoveredCat(cat.id)}
                      onMouseLeave={() => setHoveredCat(null)}
                      onBlur={() => setHoveredCat(null)}
                      onClick={() =>
                        setLockedCat((prev) => (prev === cat.id ? null : cat.id))
                      }
                      className={`sc-rack__slot ${isActive ? "is-active" : ""} ${isLocked ? "is-locked" : ""}`}
                      data-testid={`rack-slot-${cat.id}`}
                      aria-pressed={isLocked}
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

          {/* Right — Grid ALWAYS. Default shows every unique vendor (no
              grouping). On rack hover/focus grid filters to the picked
              category and reveals its header. All logos are clickable
              links to /partners/:slug. */}
          <div className="sc-partners2 lg:col-span-7" data-testid="partners-vendors">
            <div
              key={activeCat ? activeCat.id : "all"}
              className="sc-vendor-grid"
              data-testid={
                activeCat ? `vendor-grid-${activeCat.id}` : "vendor-grid-all"
              }
            >
              {activeCat && (
                <div className="sc-vendor-grid__head">
                  <activeCat.Icon
                    size={14}
                    strokeWidth={2}
                    className="sc-vendor-grid__icon"
                  />
                  <span className="sc-vendor-grid__label">
                    {lang === "pl" ? activeCat.name_pl : activeCat.name_en}
                  </span>
                  <span className="sc-vendor-grid__rule" />
                  <span className="sc-vendor-grid__count">
                    {String(activeCat.partners.length).padStart(2, "0")}
                  </span>
                </div>
              )}
              <div className="sc-vendor-grid__list">
                {activeCat
                  ? activeCat.partners.map((p, i) => {
                      const src = VENDOR_LOGOS[p];
                      const slug = slugify(p);
                      return (
                        <Link
                          key={p}
                          to={`/partners/${slug}`}
                          className="sc-vendor sc-vendor--lg is-highlighted"
                          data-testid={`vendor-${activeCat.id}-${i}`}
                          title={p}
                          style={{ animationDelay: `${i * 55}ms` }}
                        >
                          {src ? (
                            <img
                              src={src}
                              alt={p}
                              className="sc-vendor__img"
                              loading="lazy"
                              draggable="false"
                            />
                          ) : (
                            <span className="sc-vendor__text">{p}</span>
                          )}
                        </Link>
                      );
                    })
                  : flatVendors.map((v, i) => {
                      const src = VENDOR_LOGOS[v.name];
                      const slug = slugify(v.name);
                      return (
                        <Link
                          key={v.name}
                          to={`/partners/${slug}`}
                          className="sc-vendor sc-vendor--lg"
                          data-testid={`vendor-${slug}`}
                          title={v.name}
                          style={{ animationDelay: `${i * 35}ms` }}
                        >
                          {src ? (
                            <img
                              src={src}
                              alt={v.name}
                              className="sc-vendor__img"
                              loading="lazy"
                              draggable="false"
                            />
                          ) : (
                            <span className="sc-vendor__text">{v.name}</span>
                          )}
                        </Link>
                      );
                    })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersV2Section;
