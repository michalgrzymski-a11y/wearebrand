import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLang } from "@/i18n/LanguageContext";

/**
 * PartnersSection — vendor-logo carousel using the SAME visual pattern as
 * TrustedBySection. Placed on the home page right above ContactSection.
 * Data (vendor logos) is imported inline from the "heroPartners" list.
 */
const VENDORS = [
  { name: "NetApp",           file: "vendors/netapp.webp" },
  { name: "Dell",             file: "vendors/dell.webp" },
  { name: "Arista",           file: "vendors/arista.webp" },
  { name: "Baramundi",        file: "vendors/baramundi.webp" },
  { name: "Lenovo",           file: "vendors/lenovo.webp" },
  { name: "HPE",              file: "vendors/hpe.webp" },
  { name: "Cisco",            file: "vendors/cisco.webp" },
  { name: "VMware",           file: "vendors/vmware.webp" },
  { name: "Google",           file: "vendors/google.webp" },
  { name: "Microsoft",        file: "vendors/microsoft.webp" },
  { name: "Nutanix",          file: "vendors/nutanix.webp" },
  { name: "Commvault",        file: "vendors/commvault.webp" },
  { name: "Veeam",            file: "vendors/veeam.webp" },
  { name: "ASUS",             file: "vendors/asus.webp" },
  { name: "Extreme Networks", file: "vendors/extreme-networks.webp" },
  { name: "Brocade",          file: "vendors/brocade.webp" },
  { name: "AWS",              file: "vendors/aws.webp" },
  { name: "SailPoint",        file: "vendors/sailpoint.webp" },
];

const SLOT_WIDTH = 190;
const SPEED = 40;

const PartnersSection = () => {
  const { t } = useLang();
  const trackRef = useRef(null);
  const offsetRef = useRef(0);
  const [singleWidth, setSingleWidth] = useState(0);
  const hoverRef = useRef(false);
  const rafRef = useRef(0);
  const lastTsRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => setSingleWidth(track.scrollWidth / 2);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !singleWidth) return;
    const step = (ts) => {
      if (!lastTsRef.current) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;
      if (!hoverRef.current && !document.hidden) {
        offsetRef.current += SPEED * dt;
        if (offsetRef.current >= singleWidth) {
          offsetRef.current -= singleWidth;
        }
        track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(rafRef.current);
      lastTsRef.current = 0;
    };
  }, [singleWidth]);

  const shift = (dir) => {
    const track = trackRef.current;
    if (!track || !singleWidth) return;
    let next = offsetRef.current + dir * SLOT_WIDTH;
    if (next < 0) next += singleWidth;
    if (next >= singleWidth) next -= singleWidth;
    track.style.transition = "transform 0.55s cubic-bezier(0.22, 0.61, 0.36, 1)";
    offsetRef.current = next;
    track.style.transform = `translate3d(${-next}px, 0, 0)`;
    window.setTimeout(() => {
      if (track) track.style.transition = "";
    }, 600);
  };

  const doubled = [...VENDORS, ...VENDORS];
  const label = t.partners?.section_label || "Partnerzy strategiczni";

  return (
    <section
      id="partners"
      data-testid="partners-section"
      className="relative w-full"
      style={{ background: "#F8FAFA", color: "#1C2833" }}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10 pt-8 pb-3 flex items-center justify-between gap-6">
        <div
          className="flex items-center gap-4 text-[11px] uppercase tracking-[0.32em]"
          style={{ color: "#0C5C62" }}
        >
          <span className="inline-block h-px w-10" style={{ background: "#49ADA5" }} />
          {label}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => shift(-1)}
            data-testid="partners-prev"
            className="sc-carousel-btn"
            aria-label="Poprzednie logo"
          >
            <ChevronLeft size={16} strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => shift(1)}
            data-testid="partners-next"
            className="sc-carousel-btn"
            aria-label="Następne logo"
          >
            <ChevronRight size={16} strokeWidth={2} />
          </button>
        </div>
      </div>

      <div
        className="sc-carousel"
        onMouseEnter={() => (hoverRef.current = true)}
        onMouseLeave={() => (hoverRef.current = false)}
        style={{
          maskImage:
            "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)",
        }}
      >
        <div
          ref={trackRef}
          className="sc-carousel__track"
          data-testid="partners-marquee"
        >
          {doubled.map((c, i) => (
            <span
              key={`${c.name}-${i}`}
              className={`sc-logo-slot ${c.invert ? "sc-logo-slot--invert" : ""}`}
              data-testid={`partner-logo-${i}`}
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

export default PartnersSection;
