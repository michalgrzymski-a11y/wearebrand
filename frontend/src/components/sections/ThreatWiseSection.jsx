import React from "react";
import { useLang } from "@/i18n/LanguageContext";
import {
  Skull,
  Bot,
  Bug,
  KeyRound,
  Database,
  Server,
  FileLock2,
  ShieldCheck,
  AlertTriangle,
  Radar,
  Target,
  Fingerprint,
  Activity,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import useSectionParallax from "@/hooks/useSectionParallax";

/**
 * ThreatWiseSection — Commvault ThreatWise "cyber deception" visualization.
 *   LEFT  : attackers (hacker / bot / ransomware / brute-force)
 *   CENTER: DECOY MIRRORS — realistic fakes that absorb attacks and glow red on hit
 *   RIGHT : PROD environment — untouched, calm, green
 *   BOTTOM: Detection console with Commvault branding + benefit cards.
 */

const COPY = {
  pl: {
    label: "Cyber deception · Commvault ThreatWise",
    title: "Zmyl przeciwnika.",
    accent: "Chroń prawdziwe dane.",
    subtitle:
      "Zamiast czekać, aż atakujący uderzy w produkcyjne serwery i kopie zapasowe, ThreatWise podsuwa mu realistyczne lustra Twoich aplikacji. Każde dotknięcie pułapki to pewny alert — bez fałszywych alarmów.",
    attackersLabel: "Atakujący",
    decoysLabel: "Lustra / pułapki",
    prodLabel: "Środowisko produkcyjne",
    attackers: [
      { id: "hacker",  Icon: Skull,     label: "Human APT"        },
      { id: "bot",     Icon: Bot,       label: "Botnet / recon"   },
      { id: "ransom",  Icon: Bug,       label: "Ransomware"       },
      { id: "brute",   Icon: KeyRound,  label: "Brute-force"      },
    ],
    decoys: [
      { id: "db",   Icon: Database,   name: "MIRROR · SQL-PROD",    port: "1433" },
      { id: "app",  Icon: Server,     name: "MIRROR · APP-CRM",     port: "443"  },
      { id: "smb",  Icon: FileLock2,  name: "MIRROR · FILES-HQ",    port: "445"  },
    ],
    prod: [
      { id: "db-r",  Icon: Database, label: "SQL Production" },
      { id: "app-r", Icon: Server,   label: "CRM & ERP"       },
      { id: "bkp-r", Icon: FileLock2,label: "Backup Cloud"    },
    ],
    consoleTitle: "Centrum detekcji ThreatWise",
    consoleSub: "Powered by Commvault",
    consoleRows: [
      { t: "12:04:11", host: "MIRROR · SQL-PROD",   what: "SQL brute-force · 217 prób",     sev: "high" },
      { t: "12:04:07", host: "MIRROR · FILES-HQ",   what: "SMBv1 exploit attempt",           sev: "high" },
      { t: "12:03:58", host: "MIRROR · APP-CRM",    what: "Unauthorized API call · /admin",  sev: "med"  },
    ],
    benefits: [
      { Icon: Target,      title: "Realistyczne lustra", desc: "Fałszywe usługi, porty i dane nie do odróżnienia od prawdziwych systemów." },
      { Icon: AlertTriangle, title: "Zero fałszywych alarmów", desc: "Każda interakcja z pułapką to potwierdzone zagrożenie — natychmiastowy alert." },
      { Icon: Fingerprint, title: "Wywiad o atakującym", desc: "TTPs, IoC i mapowanie MITRE ATT&CK zanim wróg zbliży się do produkcji." },
      { Icon: ShieldCheck, title: "Ochrona kopii zapasowych", desc: "Integracja z Commvault Cloud — pełna widoczność w łańcuchu ochrony danych." },
    ],
    prodStatus: "SAFE · 0 incidents",
    decoyStatus: "DECEPTION ACTIVE",
    hitLabel: "TRAP HIT",
  },
  en: {
    label: "Cyber deception · Commvault ThreatWise",
    title: "Trick the enemy.",
    accent: "Protect the real data.",
    subtitle:
      "Instead of waiting for the attacker to hit production servers and backups, ThreatWise plants realistic mirrors of your applications. Every touch of a decoy is a confirmed alert — with zero false positives.",
    attackersLabel: "Attackers",
    decoysLabel: "Mirrors / decoys",
    prodLabel: "Production environment",
    attackers: [
      { id: "hacker", Icon: Skull,    label: "Human APT"     },
      { id: "bot",    Icon: Bot,      label: "Botnet / recon"},
      { id: "ransom", Icon: Bug,      label: "Ransomware"    },
      { id: "brute",  Icon: KeyRound, label: "Brute-force"   },
    ],
    decoys: [
      { id: "db",   Icon: Database,  name: "MIRROR · SQL-PROD", port: "1433" },
      { id: "app",  Icon: Server,    name: "MIRROR · APP-CRM",  port: "443"  },
      { id: "smb",  Icon: FileLock2, name: "MIRROR · FILES-HQ", port: "445"  },
    ],
    prod: [
      { id: "db-r",  Icon: Database, label: "SQL Production" },
      { id: "app-r", Icon: Server,   label: "CRM & ERP"       },
      { id: "bkp-r", Icon: FileLock2,label: "Backup Cloud"    },
    ],
    consoleTitle: "ThreatWise Detection Console",
    consoleSub: "Powered by Commvault",
    consoleRows: [
      { t: "12:04:11", host: "MIRROR · SQL-PROD", what: "SQL brute-force · 217 attempts",    sev: "high" },
      { t: "12:04:07", host: "MIRROR · FILES-HQ", what: "SMBv1 exploit attempt",              sev: "high" },
      { t: "12:03:58", host: "MIRROR · APP-CRM",  what: "Unauthorized API call · /admin",     sev: "med"  },
    ],
    benefits: [
      { Icon: Target,        title: "Realistic mirrors",        desc: "Fake services, ports and data — indistinguishable from real systems." },
      { Icon: AlertTriangle, title: "Zero false positives",     desc: "Any interaction with a decoy is a confirmed threat — instant alert." },
      { Icon: Fingerprint,   title: "Attacker intelligence",    desc: "TTPs, IoC and MITRE ATT&CK mapping before the enemy reaches production." },
      { Icon: ShieldCheck,   title: "Backup protection",        desc: "Integrated with Commvault Cloud — full visibility across the data-protection chain." },
    ],
    prodStatus: "SAFE · 0 incidents",
    decoyStatus: "DECEPTION ACTIVE",
    hitLabel: "TRAP HIT",
  },
};

const ThreatWiseSection = () => {
  const { lang } = useLang();
  const copy = COPY[lang] || COPY.pl;
  const parallaxRef = useSectionParallax();

  return (
    <section
      id="threatwise"
      data-testid="threatwise-section"
      ref={parallaxRef}
      className="relative w-full overflow-hidden"
      style={{ background: "#040709", color: "#E8F4F5" }}
    >
      {/* ambient background glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(50% 55% at 30% 30%, rgba(255,90,74,0.07) 0%, rgba(255,90,74,0) 60%)," +
            " radial-gradient(45% 55% at 70% 65%, rgba(6,255,224,0.07) 0%, rgba(6,255,224,0) 60%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-28">
        {/* Header */}
        <Reveal>
          <div className="flex items-center gap-4 text-[12px] uppercase tracking-[0.34em]" style={{ color: "#7CC4C0" }}>
            <span className="inline-block h-px w-12" style={{ background: "#00B8D4" }} />
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

        {/* Main diagram */}
        <div className="sc-tw" data-testid="threatwise-diagram">
          {/* LEFT — Attackers */}
          <div className="sc-tw__col sc-tw__col--att">
            <div className="sc-tw__col-label">{copy.attackersLabel}</div>
            <ul className="sc-tw__attackers">
              {copy.attackers.map((a, idx) => (
                <li
                  key={a.id}
                  className="sc-tw__attacker"
                  data-testid={`tw-attacker-${a.id}`}
                  style={{ animationDelay: `${idx * 0.35}s` }}
                >
                  <span className="sc-tw__attacker-icon">
                    <a.Icon size={20} strokeWidth={1.7} />
                  </span>
                  <span className="sc-tw__attacker-label">{a.label}</span>
                  <span className="sc-tw__attacker-line" aria-hidden="true">
                    <span className="sc-tw__attacker-packet" />
                    <span className="sc-tw__attacker-packet sc-tw__attacker-packet--b" />
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* CENTER — Decoy mirrors */}
          <div className="sc-tw__mirrors" data-testid="threatwise-mirrors">
            <div className="sc-tw__mirrors-head">
              <span className="sc-tw__mirrors-badge">
                <Radar size={13} strokeWidth={2} /> {copy.decoysLabel}
              </span>
              <span className="sc-tw__mirrors-live">
                <span className="sc-tw__live-dot" /> {copy.decoyStatus}
              </span>
            </div>

            <ul className="sc-tw__mirror-list">
              {copy.decoys.map((d, idx) => (
                <li
                  key={d.id}
                  className="sc-tw__mirror"
                  style={{ animationDelay: `${idx * 0.6}s` }}
                  data-testid={`tw-mirror-${d.id}`}
                >
                  <div className="sc-tw__mirror-glow" aria-hidden="true" />
                  <div className="sc-tw__mirror-icon">
                    <d.Icon size={22} strokeWidth={1.7} />
                  </div>
                  <div className="sc-tw__mirror-meta">
                    <span className="sc-tw__mirror-name">{d.name}</span>
                    <span className="sc-tw__mirror-port">TCP · {d.port}</span>
                  </div>
                  <span className="sc-tw__mirror-hit" aria-hidden="true">
                    <AlertTriangle size={12} strokeWidth={2.2} />
                    {copy.hitLabel}
                  </span>
                  <span className="sc-tw__mirror-scan" aria-hidden="true" />
                </li>
              ))}
            </ul>

            <div className="sc-tw__mirrors-foot">
              <Activity size={12} strokeWidth={2} /> Decoy telemetry · Commvault
            </div>
          </div>

          {/* RIGHT — Production (safe) */}
          <div className="sc-tw__col sc-tw__col--prod">
            <div className="sc-tw__col-label sc-tw__col-label--safe">{copy.prodLabel}</div>
            <ul className="sc-tw__prod">
              {copy.prod.map((p) => (
                <li key={p.id} className="sc-tw__prod-item" data-testid={`tw-prod-${p.id}`}>
                  <span className="sc-tw__prod-icon">
                    <p.Icon size={18} strokeWidth={1.7} />
                  </span>
                  <span className="sc-tw__prod-label">{p.label}</span>
                  <span className="sc-tw__prod-pulse" aria-hidden="true" />
                </li>
              ))}
            </ul>
            <div className="sc-tw__safe">
              <ShieldCheck size={16} strokeWidth={2} />
              <span>{copy.prodStatus}</span>
            </div>
          </div>
        </div>

        {/* Detection console */}
        <div className="sc-tw__console" data-testid="threatwise-console">
          <div className="sc-tw__console-head">
            <div className="sc-tw__console-title">
              <Radar size={16} strokeWidth={2} />
              {copy.consoleTitle}
            </div>
            <div className="sc-tw__console-brand">
              <span className="sc-tw__cv-mark" aria-hidden="true">CV</span>
              <span>{copy.consoleSub}</span>
            </div>
          </div>
          <ul className="sc-tw__console-rows">
            {copy.consoleRows.map((r, i) => (
              <li key={i} className={`sc-tw__console-row is-${r.sev}`}>
                <span className="sc-tw__console-time">{r.t}</span>
                <span className={`sc-tw__console-dot is-${r.sev}`} />
                <span className="sc-tw__console-host">{r.host}</span>
                <span className="sc-tw__console-what">{r.what}</span>
                <span className={`sc-tw__console-sev is-${r.sev}`}>
                  {r.sev === "high" ? "HIGH" : r.sev === "med" ? "MED" : "LOW"}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Benefits */}
        <div className="sc-tw__benefits" data-testid="threatwise-benefits">
          {copy.benefits.map((b, i) => (
            <div key={i} className="sc-tw__benefit">
              <span className="sc-tw__benefit-icon">
                <b.Icon size={22} strokeWidth={1.7} />
              </span>
              <h4 className="sc-tw__benefit-title">{b.title}</h4>
              <p className="sc-tw__benefit-desc">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThreatWiseSection;
