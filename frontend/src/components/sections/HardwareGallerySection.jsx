import React from "react";
import { useLang } from "@/i18n/LanguageContext";
import Reveal from "@/components/Reveal";
import useSectionParallax from "@/hooks/useSectionParallax";

/**
 * HardwareGallerySection — 10 miniatur różnych urządzeń rackowych,
 * jako sandbox: który obiekt użyć w kolejnych sekcjach. Wszystkie
 * w tym samym języku wizualnym co pozostałe „rackowe" sekcje.
 */

const COPY = {
  pl: {
    label: "Galeria sprzętu · sandbox",
    title: "10 obiektów rackowych",
    accent: "do wyboru.",
    subtitle: "Miniatury urządzeń, których możemy użyć w dalszych sekcjach strony. Powiedz który obiekt chcesz zobaczyć w większej skali lub wpięty w narrację.",
  },
  en: {
    label: "Hardware gallery · sandbox",
    title: "10 rack objects",
    accent: "to choose from.",
    subtitle: "Miniatures of devices we can drop into further sections. Tell us which object you'd like to see at scale or plugged into a specific narrative.",
  },
};

const DEVICES = [
  { id: "firewall", u: "1U", name: "Firewall NGFW", meta: "Palo Alto / Fortinet class", tone: "red" },
  { id: "router", u: "1U", name: "Router BGP core", meta: "MPLS / SD-WAN", tone: "amber" },
  { id: "ups", u: "2U", name: "UPS online DC", meta: "Battery 12–15 min", tone: "green" },
  { id: "dwdm", u: "3U", name: "DWDM shelf", meta: "40× 100G λ", tone: "cyan" },
  { id: "blade", u: "8U", name: "Blade chassis", meta: "16× compute blades", tone: "mint" },
  { id: "adc", u: "1U", name: "Load balancer / ADC", meta: "F5 / Kemp class", tone: "cyan" },
  { id: "backup", u: "2U", name: "Backup appliance", meta: "Dedupe + immutable", tone: "green" },
  { id: "hci", u: "2U", name: "HCI node", meta: "Compute + NVMe + NIC", tone: "mint" },
  { id: "cloud", u: "1U", name: "Cloud gateway", meta: "Direct connect / ExpressRoute", tone: "cyan" },
  { id: "storage", u: "2U", name: "Storage controller", meta: "SAN / NAS / dual-CTRL", tone: "amber" },
];

const HardwareGallerySection = () => {
  const { lang } = useLang();
  const copy = COPY[lang] || COPY.pl;
  const parallaxRef = useSectionParallax();

  return (
    <section
      id="hardware-gallery"
      data-testid="hardware-gallery-section"
      ref={parallaxRef}
      className="relative w-full overflow-hidden"
      style={{ background: "#040709", color: "#E8F4F5" }}
    >
      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-28">
        <Reveal>
          <div className="flex items-center gap-4 text-[12px] uppercase tracking-[0.34em]" style={{ color: "#7CC4C0" }}>
            <span className="inline-block h-px w-12" style={{ background: "#49ADA5" }} />
            {copy.label}
          </div>
          <h2 className="mt-5 text-4xl md:text-6xl font-semibold leading-[1.02] tracking-tight text-white max-w-3xl">
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
          <p className="mt-6 max-w-3xl text-lg text-white/70">{copy.subtitle}</p>
        </Reveal>

        <ul className="sc-hw-gallery" data-testid="hardware-gallery">
          {DEVICES.map((d) => (
            <li key={d.id} className="sc-hw-card" data-testid={`hw-${d.id}`}>
              <div className="sc-hw-card__head">
                <span className="sc-hw-card__u">{d.u}</span>
                <span className="sc-hw-card__name">{d.name}</span>
              </div>
              <div className={`sc-hw-device sc-hw-device--${d.id} sc-hw-tone--${d.tone}`}>
                <DeviceViz id={d.id} />
              </div>
              <div className="sc-hw-card__meta">{d.meta}</div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

/* ---------- Individual device visualizations ---------- */

const DeviceViz = ({ id }) => {
  switch (id) {
    case "firewall":
      return (
        <>
          <span className="sc-hw-ear" /><span className="sc-hw-ear sc-hw-ear--r" />
          <span className="sc-hw-strip sc-hw-strip--top" />
          <span className="sc-hw-badge">FW · NGFW</span>
          <span className="sc-hw-leds">
            {[0,1,2,3].map((i)=><span key={i} className={`sc-hw-led ${i===0?"is-red":i===1?"is-amber":"is-mint"}`} />)}
          </span>
          <span className="sc-hw-ports">
            {Array.from({length:8}).map((_,i)=><span key={i} className="sc-hw-port" />)}
          </span>
        </>
      );
    case "router":
      return (
        <>
          <span className="sc-hw-ear" /><span className="sc-hw-ear sc-hw-ear--r" />
          <span className="sc-hw-badge">RTR · BGP</span>
          <span className="sc-hw-antennas"><span/><span/></span>
          <span className="sc-hw-ports sc-hw-ports--wan">
            {Array.from({length:4}).map((_,i)=><span key={i} className="sc-hw-port sc-hw-port--wan" />)}
          </span>
          <span className="sc-hw-ports">
            {Array.from({length:12}).map((_,i)=><span key={i} className="sc-hw-port" />)}
          </span>
        </>
      );
    case "ups":
      return (
        <>
          <span className="sc-hw-ear" /><span className="sc-hw-ear sc-hw-ear--r" />
          <span className="sc-hw-badge">UPS · ONLINE</span>
          <span className="sc-hw-lcd">
            <span className="sc-hw-lcd__value">230V</span>
            <span className="sc-hw-lcd__bar"><span className="sc-hw-lcd__fill" /></span>
            <span className="sc-hw-lcd__label">BATT 92% · 14 MIN</span>
          </span>
          <span className="sc-hw-vents">
            {Array.from({length:20}).map((_,i)=><span key={i} />)}
          </span>
        </>
      );
    case "dwdm":
      return (
        <>
          <span className="sc-hw-ear" /><span className="sc-hw-ear sc-hw-ear--r" />
          <span className="sc-hw-badge">DWDM · 100G λ</span>
          <span className="sc-hw-fibers">
            {Array.from({length:16}).map((_,i)=>(
              <span key={i} className="sc-hw-fiber"><span className="sc-hw-fiber-tip" /></span>
            ))}
          </span>
        </>
      );
    case "blade":
      return (
        <>
          <span className="sc-hw-ear" /><span className="sc-hw-ear sc-hw-ear--r" />
          <span className="sc-hw-badge">BLADE · 16× COMPUTE</span>
          <span className="sc-hw-blades">
            {Array.from({length:16}).map((_,i)=>(
              <span key={i} className={`sc-hw-blade ${i%3===0?"is-on":""}`}>
                <span className="sc-hw-blade-led" />
              </span>
            ))}
          </span>
        </>
      );
    case "adc":
      return (
        <>
          <span className="sc-hw-ear" /><span className="sc-hw-ear sc-hw-ear--r" />
          <span className="sc-hw-badge">ADC · L7</span>
          <span className="sc-hw-lcd sc-hw-lcd--sm">
            <span className="sc-hw-lcd__value">42.1k rps</span>
          </span>
          <span className="sc-hw-ports">
            {Array.from({length:10}).map((_,i)=><span key={i} className="sc-hw-port" />)}
          </span>
        </>
      );
    case "backup":
      return (
        <>
          <span className="sc-hw-ear" /><span className="sc-hw-ear sc-hw-ear--r" />
          <span className="sc-hw-badge">BACKUP · DEDUPE</span>
          <span className="sc-hw-drives">
            {Array.from({length:12}).map((_,i)=>(
              <span key={i} className={`sc-hw-drive ${i%4===1?"is-on":""}`}>
                <span className="sc-hw-drive-led" />
              </span>
            ))}
          </span>
        </>
      );
    case "hci":
      return (
        <>
          <span className="sc-hw-ear" /><span className="sc-hw-ear sc-hw-ear--r" />
          <span className="sc-hw-badge">HCI · NODE</span>
          <span className="sc-hw-hci">
            <span className="sc-hw-hci-cpu">CPU</span>
            <span className="sc-hw-hci-nvme">
              {Array.from({length:6}).map((_,i)=><span key={i} className="sc-hw-hci-slot" />)}
            </span>
            <span className="sc-hw-hci-nic">NIC 25G</span>
          </span>
        </>
      );
    case "cloud":
      return (
        <>
          <span className="sc-hw-ear" /><span className="sc-hw-ear sc-hw-ear--r" />
          <span className="sc-hw-badge">CLOUD · GW</span>
          <span className="sc-hw-cloud">
            <span className="sc-hw-cloud-line" />
            <span className="sc-hw-cloud-arrow">↕</span>
            <span className="sc-hw-cloud-line" />
          </span>
          <span className="sc-hw-ports">
            {Array.from({length:6}).map((_,i)=><span key={i} className="sc-hw-port" />)}
          </span>
        </>
      );
    case "storage":
      return (
        <>
          <span className="sc-hw-ear" /><span className="sc-hw-ear sc-hw-ear--r" />
          <span className="sc-hw-badge">STG · DUAL CTRL</span>
          <span className="sc-hw-drives sc-hw-drives--lg">
            {Array.from({length:24}).map((_,i)=>(
              <span key={i} className={`sc-hw-drive ${i%5===0?"is-on":""}`}>
                <span className="sc-hw-drive-led" />
              </span>
            ))}
          </span>
        </>
      );
    default:
      return null;
  }
};

export default HardwareGallerySection;
