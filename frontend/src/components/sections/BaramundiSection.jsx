import React from "react";
import { useLang } from "@/i18n/LanguageContext";
import {
  Monitor,
  Laptop,
  Smartphone,
  Server,
  Package,
  ShieldCheck,
  BarChart3,
  RadioTower,
  Cpu,
  Terminal,
  RefreshCw,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import useSectionParallax from "@/hooks/useSectionParallax";

/**
 * BaramundiSection — visual pitch for the baramundi Management Suite
 * (Unified Endpoint Management). Central console pulses out to a fleet of
 * device tiles with rolling statuses; a live activity feed lists jobs; four
 * feature cards + a stat bar drive the value story home.
 */

// Fleet of endpoints shown as tiles. Each has a status which is used to color
// the LED and label — this stays visually stable across renders.
const FLEET = [
  { id: "wks-01",  Icon: Monitor,    label: "WKS-DEV-01",  os: "Win 11",  s: "ok" },
  { id: "lap-14",  Icon: Laptop,     label: "LT-FIN-14",   os: "Win 11",  s: "deploy" },
  { id: "mac-02",  Icon: Laptop,     label: "MBP-DES-02",  os: "macOS",   s: "ok" },
  { id: "wks-22",  Icon: Monitor,    label: "WKS-HR-22",   os: "Win 10",  s: "patch" },
  { id: "mob-08",  Icon: Smartphone, label: "MOB-CEO-08",  os: "iOS 18",  s: "ok" },
  { id: "srv-03",  Icon: Server,     label: "SRV-DC-03",   os: "Win Srv", s: "ok" },
  { id: "lap-31",  Icon: Laptop,     label: "LT-SUP-31",   os: "Win 11",  s: "deploy" },
  { id: "wks-40",  Icon: Monitor,    label: "WKS-DEV-40",  os: "Ubuntu",  s: "ok" },
  { id: "mob-15",  Icon: Smartphone, label: "MOB-SALES-15",os: "Android", s: "patch" },
  { id: "lap-05",  Icon: Laptop,     label: "LT-QA-05",    os: "Win 11",  s: "ok" },
  { id: "srv-11",  Icon: Server,     label: "SRV-APP-11",  os: "Linux",   s: "ok" },
  { id: "wks-77",  Icon: Monitor,    label: "WKS-MKT-77",  os: "Win 11",  s: "ok" },
];

const COPY = {
  pl: {
    label: "UEM · baramundi Management Suite",
    title: "Jedna konsola.",
    accent: "Cały park urządzeń.",
    subtitle:
      "baramundi to niemiecki system klasy UEM (Unified Endpoint Management), który zdejmuje z zespołu service ręczną pracę: automatycznie instaluje aplikacje, łata podatności, inwentaryzuje sprzęt i zarządza cyklem życia — od pierwszego uruchomienia po wycofanie.",
    hubTitle: "baramundi · Console",
    hubSub: "Powered by baramundi",
    consoleTitle: "Live Activity · dziś",
    consoleFeed: [
      { t: "12:04:11", what: "Deploy MS Office 365",           target: "→ 42 końcówki",   sev: "info" },
      { t: "12:03:44", what: "Patch CVE-2025-1234",            target: "→ 89 urządzeń",  sev: "warn" },
      { t: "12:02:07", what: "OS Deploy · Windows 11 23H2",    target: "→ 12 stacji",     sev: "info" },
      { t: "12:01:20", what: "Inventory sync",                 target: "→ 341 assetów",   sev: "ok" },
      { t: "11:58:33", what: "Vulnerability scan",             target: "→ 217 hostów",    sev: "ok" },
      { t: "11:56:02", what: "MDM · Enroll iPhone 15",         target: "→ MOB-SALES-15",  sev: "info" },
    ],
    fleetTitle: "Park końcówek · żyje",
    statusOk: "Compliant",
    statusDeploy: "Deploying",
    statusPatch: "Patch",
    benefits: [
      {
        Icon: Package,
        title: "Deploy & Provisioning",
        desc: "Automatyczna instalacja systemów, aplikacji i sterowników. Pełne obrazy OS w jednej paczce, klient odbiera gotowe do pracy urządzenie.",
      },
      {
        Icon: ShieldCheck,
        title: "Patch & Vulnerability",
        desc: "Automatyczne łatanie systemów i aplikacji trzecich, skaner podatności CVE, priorytetyzacja w oparciu o CVSS.",
      },
      {
        Icon: BarChart3,
        title: "Inventory & Lifecycle",
        desc: "Pełny widok każdego assetu — od zakupu przez aktywne użytkowanie po wycofanie. Wszystko pod jednym numerem seryjnym.",
      },
      {
        Icon: RadioTower,
        title: "MDM · cross-platform",
        desc: "Windows, macOS, Linux, iOS, Android — jedna konsola. Nawet urządzenia BYOD w bezpiecznym profilu firmowym.",
      },
    ],
    statsBar: [
      { v: "500+",   k: "końcówek na jednego admina" },
      { v: "-90 %",  k: "biletów w service desku" },
      { v: "6–9",    k: "miesięcy do zwrotu z inwestycji" },
      { v: "24/7",   k: "automatyczne skanowanie zgodności" },
    ],
  },
  en: {
    label: "UEM · baramundi Management Suite",
    title: "One console.",
    accent: "Your entire fleet.",
    subtitle:
      "baramundi is a German-engineered UEM (Unified Endpoint Management) suite that removes the manual work from your service team: it deploys apps, patches vulnerabilities, tracks inventory and manages the full lifecycle — from first boot to retirement.",
    hubTitle: "baramundi · Console",
    hubSub: "Powered by baramundi",
    consoleTitle: "Live Activity · today",
    consoleFeed: [
      { t: "12:04:11", what: "Deploy MS Office 365",           target: "→ 42 endpoints",  sev: "info" },
      { t: "12:03:44", what: "Patch CVE-2025-1234",            target: "→ 89 devices",    sev: "warn" },
      { t: "12:02:07", what: "OS Deploy · Windows 11 23H2",    target: "→ 12 workstations", sev: "info" },
      { t: "12:01:20", what: "Inventory sync",                 target: "→ 341 assets",    sev: "ok" },
      { t: "11:58:33", what: "Vulnerability scan",             target: "→ 217 hosts",     sev: "ok" },
      { t: "11:56:02", what: "MDM · Enroll iPhone 15",         target: "→ MOB-SALES-15",  sev: "info" },
    ],
    fleetTitle: "Fleet · live",
    statusOk: "Compliant",
    statusDeploy: "Deploying",
    statusPatch: "Patch",
    benefits: [
      {
        Icon: Package,
        title: "Deploy & Provisioning",
        desc: "Automatic install of OS, apps and drivers. Full OS images in a single package — the user gets a ready-to-work device.",
      },
      {
        Icon: ShieldCheck,
        title: "Patch & Vulnerability",
        desc: "Automatic OS and third-party patching, CVE vulnerability scanner, CVSS-based prioritization.",
      },
      {
        Icon: BarChart3,
        title: "Inventory & Lifecycle",
        desc: "Full view of every asset — from purchase, through active use, all the way to retirement. Everything tied to one serial.",
      },
      {
        Icon: RadioTower,
        title: "MDM · cross-platform",
        desc: "Windows, macOS, Linux, iOS, Android — one console. Even BYOD devices run inside a secure corporate profile.",
      },
    ],
    statsBar: [
      { v: "500+",   k: "endpoints per one admin" },
      { v: "-90 %",  k: "service-desk tickets" },
      { v: "6–9",    k: "months to ROI" },
      { v: "24/7",   k: "continuous compliance scan" },
    ],
  },
};

const BaramundiSection = () => {
  const { lang } = useLang();
  const copy = COPY[lang] || COPY.pl;
  const parallaxRef = useSectionParallax();

  const statusLabel = (s) => {
    if (s === "deploy") return copy.statusDeploy;
    if (s === "patch")  return copy.statusPatch;
    return copy.statusOk;
  };

  return (
    <section
      id="baramundi"
      data-testid="baramundi-section"
      ref={parallaxRef}
      className="relative w-full overflow-hidden"
      style={{ background: "#040709", color: "#E8F4F5" }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(55% 55% at 35% 35%, rgba(6,255,224,0.06) 0%, rgba(6,255,224,0) 60%)," +
            " radial-gradient(45% 55% at 75% 75%, rgba(0,184,212,0.07) 0%, rgba(0,184,212,0) 60%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-28">
        <Reveal>
          <div
            className="flex items-center gap-4 text-[12px] uppercase tracking-[0.34em]"
            style={{ color: "#7CC4C0" }}
          >
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
          <p className="mt-6 max-w-3xl text-lg md:text-xl leading-relaxed text-white/70">
            {copy.subtitle}
          </p>
        </Reveal>

        {/* Main visual: hub + fleet grid on the left, live activity on the right */}
        <div className="sc-bar__grid" data-testid="bar-grid">
          <div className="sc-bar__stage" data-testid="bar-stage">
            {/* Central hub */}
            <div className="sc-bar__hub" aria-hidden="true">
              <div className="sc-bar__hub-ring" />
              <div className="sc-bar__hub-ring sc-bar__hub-ring--2" />
              <div className="sc-bar__hub-ring sc-bar__hub-ring--3" />
              <div className="sc-bar__hub-core">
                <span className="sc-bar__hub-mark">b</span>
                <span className="sc-bar__hub-title">{copy.hubTitle}</span>
                <span className="sc-bar__hub-sub">{copy.hubSub}</span>
              </div>
            </div>

            <div className="sc-bar__stage-head">
              <RefreshCw size={13} strokeWidth={2} />
              <span>{copy.fleetTitle}</span>
              <span className="sc-bar__live">
                <span className="sc-bar__live-dot" /> LIVE
              </span>
            </div>

            {/* Fleet grid */}
            <ul className="sc-bar__fleet">
              {FLEET.map((d, i) => (
                <li
                  key={d.id}
                  className={`sc-bar__ep is-${d.s}`}
                  style={{ animationDelay: `${(i * 0.18).toFixed(2)}s` }}
                  data-testid={`bar-ep-${d.id}`}
                >
                  <span className="sc-bar__ep-icon">
                    <d.Icon size={16} strokeWidth={1.7} />
                  </span>
                  <div className="sc-bar__ep-meta">
                    <span className="sc-bar__ep-label">{d.label}</span>
                    <span className="sc-bar__ep-os">{d.os}</span>
                  </div>
                  <span className="sc-bar__ep-led" aria-hidden="true" />
                  <span className="sc-bar__ep-status">{statusLabel(d.s)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Live activity feed */}
          <div className="sc-bar__feed" data-testid="bar-feed">
            <div className="sc-bar__feed-head">
              <Terminal size={14} strokeWidth={2} />
              <span>{copy.consoleTitle}</span>
            </div>
            <ul className="sc-bar__feed-list">
              {copy.consoleFeed.map((r, i) => (
                <li
                  key={i}
                  className={`sc-bar__feed-row is-${r.sev}`}
                  style={{ animationDelay: `${i * 0.35}s` }}
                >
                  <span className="sc-bar__feed-time">{r.t}</span>
                  <span className={`sc-bar__feed-dot is-${r.sev}`} />
                  <span className="sc-bar__feed-what">{r.what}</span>
                  <span className="sc-bar__feed-target">{r.target}</span>
                </li>
              ))}
            </ul>
            <div className="sc-bar__feed-foot">
              <Cpu size={12} strokeWidth={2} />
              baramundi jobs pipeline · auto
            </div>
          </div>
        </div>

        {/* 4 benefit cards */}
        <div className="sc-bar__benefits" data-testid="bar-benefits">
          {copy.benefits.map((b, i) => (
            <div key={i} className="sc-bar__benefit">
              <span className="sc-bar__benefit-icon">
                <b.Icon size={22} strokeWidth={1.7} />
              </span>
              <h4 className="sc-bar__benefit-title">{b.title}</h4>
              <p className="sc-bar__benefit-desc">{b.desc}</p>
            </div>
          ))}
        </div>

        {/* Stat bar */}
        <div className="sc-bar__stats" data-testid="bar-stats">
          {copy.statsBar.map((s, i) => (
            <div key={i} className="sc-bar__stat">
              <span className="sc-bar__stat-v">{s.v}</span>
              <span className="sc-bar__stat-k">{s.k}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BaramundiSection;
