import React from "react";
import { useLang } from "@/i18n/LanguageContext";
import { Globe, Mail, Users, Shield, ShieldAlert, ShieldOff, Database, Server, HardDrive, Cloud } from "lucide-react";
import Reveal from "@/components/Reveal";
import useSectionParallax from "@/hooks/useSectionParallax";

/**
 * NGFWSection — Next-Generation Firewall visualization.
 *  Left  : mixed inbound streams (web, email, users, threats, DDoS)
 *  Center: NGFW appliance inspecting every packet
 *  Right : only clean streams reaching infrastructure (servers, storage, cloud)
 *  Animated packets flow left → firewall; threats get dropped, clean pass through.
 */

const COPY = {
  pl: {
    label: "Bezpieczeństwo · NGFW",
    title: "Wszystko wchodzi.",
    accent: "Nic groźnego nie wychodzi.",
    subtitle:
      "Next-Generation Firewall inspekcja L7, threat prevention, sandbox i SSL decryption. Ruch trafia do Twojej infrastruktury wtedy — i tylko wtedy — kiedy jest bezpieczny.",
    inLabel: "Ruch przychodzący",
    outLabel: "Ruch bezpieczny",
    inbound: [
      { id: "web",    Icon: Globe,       label: "HTTP / HTTPS",    safe: true },
      { id: "mail",   Icon: Mail,        label: "SMTP / IMAP",     safe: true },
      { id: "users",  Icon: Users,       label: "VPN / Remote",    safe: true },
      { id: "malware",Icon: ShieldOff,   label: "MALWARE / C2",    safe: false },
      { id: "ddos",   Icon: ShieldAlert, label: "DDoS / SCAN",     safe: false },
    ],
    outbound: [
      { id: "srv",   Icon: Server,    label: "Serwery aplikacyjne" },
      { id: "db",    Icon: Database,  label: "Bazy danych" },
      { id: "stg",   Icon: HardDrive, label: "Macierze / backup" },
      { id: "cloud", Icon: Cloud,     label: "Chmura hybrydowa" },
    ],
    fwCode: "SC · NGFW · 20 Gbps · TLS 1.3",
    blocked: "BLOCKED",
    allowed: "ALLOWED",
  },
  en: {
    label: "Security · NGFW",
    title: "Everything comes in.",
    accent: "Nothing dangerous gets through.",
    subtitle:
      "Next-Generation Firewall with L7 inspection, threat prevention, sandboxing and SSL decryption. Traffic reaches your infrastructure only when it is proven safe.",
    inLabel: "Inbound traffic",
    outLabel: "Safe traffic",
    inbound: [
      { id: "web",    Icon: Globe,       label: "HTTP / HTTPS",   safe: true },
      { id: "mail",   Icon: Mail,        label: "SMTP / IMAP",    safe: true },
      { id: "users",  Icon: Users,       label: "VPN / Remote",   safe: true },
      { id: "malware",Icon: ShieldOff,   label: "MALWARE / C2",   safe: false },
      { id: "ddos",   Icon: ShieldAlert, label: "DDoS / SCAN",    safe: false },
    ],
    outbound: [
      { id: "srv",   Icon: Server,    label: "Application servers" },
      { id: "db",    Icon: Database,  label: "Databases" },
      { id: "stg",   Icon: HardDrive, label: "Storage / backup" },
      { id: "cloud", Icon: Cloud,     label: "Hybrid cloud" },
    ],
    fwCode: "SC · NGFW · 20 Gbps · TLS 1.3",
    blocked: "BLOCKED",
    allowed: "ALLOWED",
  },
};

const NGFWSection = () => {
  const { lang } = useLang();
  const copy = COPY[lang] || COPY.pl;
  const parallaxRef = useSectionParallax();

  return (
    <section
      id="ngfw"
      data-testid="ngfw-section"
      ref={parallaxRef}
      className="relative w-full overflow-hidden"
      style={{ background: "#040709", color: "#E8F4F5" }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(55% 55% at 50% 40%, rgba(6,255,224,0.06) 0%, rgba(6,255,224,0) 60%)," +
            " radial-gradient(45% 55% at 10% 80%, rgba(255,90,74,0.05) 0%, rgba(255,90,74,0) 60%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-28">
        <Reveal>
          <div className="flex items-center gap-4 text-[12px] uppercase tracking-[0.34em]" style={{ color: "#7CC4C0" }}>
            <span className="inline-block h-px w-12" style={{ background: "#49ADA5" }} />
            {copy.label}
          </div>
          <h2 className="mt-5 text-4xl md:text-6xl font-semibold leading-[1.02] tracking-tight text-white max-w-4xl">
            {copy.title}{" "}
            <span
              className="font-semibold"
              style={{
                background: "linear-gradient(135deg,#06FFE0 0%,#00B8D4 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {copy.accent}
            </span>
          </h2>
          <p className="mt-6 max-w-3xl text-lg md:text-xl leading-relaxed text-white/70">{copy.subtitle}</p>
        </Reveal>

        <div className="sc-ngfw" data-testid="ngfw-diagram">
          {/* LEFT — inbound streams */}
          <div className="sc-ngfw__col sc-ngfw__col--in">
            <div className="sc-ngfw__col-label">{copy.inLabel}</div>
            <ul className="sc-ngfw__streams">
              {copy.inbound.map((s) => (
                <li
                  key={s.id}
                  className={`sc-ngfw__stream ${s.safe ? "is-safe" : "is-threat"}`}
                  data-testid={`ngfw-in-${s.id}`}
                >
                  <span className="sc-ngfw__stream-icon"><s.Icon size={18} strokeWidth={1.7} /></span>
                  <span className="sc-ngfw__stream-label">{s.label}</span>
                  <span className="sc-ngfw__stream-line" aria-hidden="true">
                    <span className="sc-ngfw__stream-packet" />
                    <span className="sc-ngfw__stream-packet sc-ngfw__stream-packet--b" />
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* CENTER — Firewall appliance */}
          <div className="sc-ngfw__fw" data-testid="ngfw-appliance">
            <div className="sc-ngfw__fw-frame">
              <div className="sc-ngfw__fw-head">
                <span className="sc-ngfw__fw-badge">NGFW</span>
                <span className="sc-ngfw__fw-leds">
                  <span className="sc-ngfw__fw-led is-mint" />
                  <span className="sc-ngfw__fw-led is-mint" />
                  <span className="sc-ngfw__fw-led is-amber" />
                  <span className="sc-ngfw__fw-led is-red" />
                </span>
              </div>
              <div className="sc-ngfw__fw-body">
                <Shield size={80} strokeWidth={1.4} className="sc-ngfw__fw-shield" />
                <div className="sc-ngfw__fw-scan" aria-hidden="true" />
                <div className="sc-ngfw__fw-status">
                  <span className="sc-ngfw__fw-status-row"><span className="sc-ngfw__fw-status-dot is-red" /> {copy.blocked} · 2</span>
                  <span className="sc-ngfw__fw-status-row"><span className="sc-ngfw__fw-status-dot is-mint" /> {copy.allowed} · 3</span>
                </div>
              </div>
              <div className="sc-ngfw__fw-foot">{copy.fwCode}</div>
            </div>
          </div>

          {/* RIGHT — outbound to infrastructure */}
          <div className="sc-ngfw__col sc-ngfw__col--out">
            <div className="sc-ngfw__col-label">{copy.outLabel}</div>
            <ul className="sc-ngfw__streams">
              {copy.outbound.map((s) => (
                <li key={s.id} className="sc-ngfw__stream is-clean" data-testid={`ngfw-out-${s.id}`}>
                  <span className="sc-ngfw__stream-line sc-ngfw__stream-line--out" aria-hidden="true">
                    <span className="sc-ngfw__stream-packet sc-ngfw__stream-packet--clean" />
                  </span>
                  <span className="sc-ngfw__stream-icon"><s.Icon size={18} strokeWidth={1.7} /></span>
                  <span className="sc-ngfw__stream-label">{s.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NGFWSection;
