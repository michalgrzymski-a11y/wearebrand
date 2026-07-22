import React from "react";
import { useLang } from "@/i18n/LanguageContext";

const PARTNERS = [
  { name: "NetApp",           logo: "/logos/vendors/netapp.webp",           highlight: true },
  { name: "Dell",             logo: "/logos/vendors/dell.webp" },
  { name: "Arista",           logo: "/logos/vendors/arista.webp" },
  { name: "Baramundi",        logo: "/logos/vendors/baramundi.webp" },
  { name: "Lenovo",           logo: "/logos/vendors/lenovo.webp" },
  { name: "HPE",              logo: "/logos/vendors/hpe.webp" },
  { name: "Cisco",            logo: "/logos/vendors/cisco.webp" },
  { name: "VMware",           logo: "/logos/vendors/vmware.webp" },
  { name: "Google",           logo: "/logos/vendors/google.webp" },
  { name: "Microsoft",        logo: "/logos/vendors/microsoft.webp" },
  { name: "Nutanix",          logo: "/logos/vendors/nutanix.webp" },
  { name: "Commvault",        logo: "/logos/vendors/commvault.webp" },
  { name: "Veeam",            logo: "/logos/vendors/veeam.webp" },
  { name: "ASUS",             logo: "/logos/vendors/asus.webp" },
  { name: "Extreme Networks", logo: "/logos/vendors/extreme-networks.webp" },
  { name: "Brocade",          logo: "/logos/vendors/brocade.webp" },
  { name: "AWS",              logo: "/logos/vendors/aws.webp" },
  { name: "SailPoint",        logo: "/logos/vendors/sailpoint.webp" },
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
              <img
                src={p.logo}
                alt={p.name}
                className="sc-partner-logo-img"
                loading="lazy"
                draggable="false"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
