import React, { useState } from "react";
import { useLang } from "@/i18n/LanguageContext";
import {
  Zap,
  HardDrive,
  Gauge,
  Layers,
  Cpu,
  Database,
  ShieldCheck,
  Snowflake,
  Flame,
  Cable,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import useSectionParallax from "@/hooks/useSectionParallax";

/**
 * NetAppAFFSection — interactive A ↔ C comparison for NetApp AFF A50 vs AFF C60.
 * User toggles between series; the stylized rack unit + spec grid smoothly swaps.
 * Design language: dark base #040709, mint #06FFE0 (A-Series = performance),
 * icy blue #7CD6FF (C-Series = capacity / QLC).
 */

const COPY = {
  pl: {
    label: "Storage · NetApp AFF",
    title: "AFF A50 vs AFF C60.",
    accent: "Wybierz odpowiednią moc.",
    subtitle:
      "Porównaj dwie klasy macierzy all-flash NetApp: A-Series napędzaną TLC dla najbardziej wymagających obciążeń oraz C-Series z QLC — pojemną, energooszczędną alternatywą dla większości środowisk.",
    toggleA: "AFF A50",
    toggleC: "AFF C60",
    toggleHintA: "All-flash · TLC · performance",
    toggleHintC: "All-flash · QLC · capacity",
    ledLabel: "STATUS",
    modelBadge: (name) => `NetApp AFF · ${name}`,
    specsTitle: "Specyfikacja",
    positioning: "Pozycjonowanie",
    workloads: "Idealne obciążenia",
    verdictHead: "Werdykt",
    A: {
      name: "AFF A50",
      tagline: "Enterprise all-flash zaprojektowany dla najwyższej wydajności — TLC NVMe, sub-milisekundowa latencja i pełna moc pakietu ONTAP.",
      accent: "#06FFE0",
      accentSoft: "rgba(6, 255, 224, 0.35)",
      accentGlow: "rgba(6, 255, 224, 0.55)",
      icon: Flame,
      badge: "PERFORMANCE",
      specs: [
        { Icon: Cpu,        k: "Media",          v: "TLC NVMe SSD" },
        { Icon: Gauge,      k: "Latencja",       v: "< 150 µs" },
        { Icon: Zap,        k: "Wydajność",      v: "Do ~400k IOPS / kontroler" },
        { Icon: HardDrive,  k: "Pojemność",      v: "Do ~1.5 PB efektywne" },
        { Icon: Layers,     k: "Skalowanie",     v: "Scale-out 2–24 węzłów" },
        { Icon: Cable,      k: "Interfejsy",     v: "25/100 GbE · 32/64 Gb FC · NVMe-oF" },
        { Icon: ShieldCheck,k: "Bezpieczeństwo", v: "SnapLock · autonomous ransomware · ARP" },
        { Icon: Database,   k: "System",         v: "ONTAP 9.x · SnapMirror · FabricPool" },
      ],
      workloads: [
        "Bazy transakcyjne (Oracle, SQL, SAP HANA)",
        "VDI o dużej gęstości",
        "AI / ML training i inference",
        "Krytyczne aplikacje z SLA < 1 ms",
      ],
      verdict:
        "Wybierasz A50, gdy każdy mikrosekundowy skok latencji przekłada się na pieniądze — najwyższa wydajność, przewidywalna nawet w szczycie.",
    },
    C: {
      name: "AFF C60",
      tagline: "Pojemny all-flash QLC dla masowej konsolidacji storage — więcej pojemności w tej samej przestrzeni, przy niższym koszcie za TB.",
      accent: "#7CD6FF",
      accentSoft: "rgba(124, 214, 255, 0.35)",
      accentGlow: "rgba(124, 214, 255, 0.55)",
      icon: Snowflake,
      badge: "CAPACITY",
      specs: [
        { Icon: Cpu,        k: "Media",          v: "QLC NVMe SSD" },
        { Icon: Gauge,      k: "Latencja",       v: "< 1 ms (typowo)" },
        { Icon: Zap,        k: "Wydajność",      v: "Do ~250k IOPS / kontroler" },
        { Icon: HardDrive,  k: "Pojemność",      v: "Do ~2.5 PB efektywne" },
        { Icon: Layers,     k: "Skalowanie",     v: "Scale-out 2–24 węzłów" },
        { Icon: Cable,      k: "Interfejsy",     v: "25/100 GbE · 32 Gb FC · NVMe-oF" },
        { Icon: ShieldCheck,k: "Bezpieczeństwo", v: "SnapLock · autonomous ransomware · ARP" },
        { Icon: Database,   k: "System",         v: "ONTAP 9.x · SnapMirror · FabricPool" },
      ],
      workloads: [
        "Konsolidacja file / block dla działów",
        "Backup i archiwum pierwszej linii",
        "Środowiska VMware o średnim IO",
        "Zasoby analityczne z dużymi zbiorami danych",
      ],
      verdict:
        "Wybierasz C60, gdy potrzebujesz pojemności all-flash bez windowania budżetu — więcej danych na jedną szafę, niższe zużycie energii, ta sama platforma ONTAP.",
    },
  },
  en: {
    label: "Storage · NetApp AFF",
    title: "AFF A50 vs AFF C60.",
    accent: "Pick the right kind of power.",
    subtitle:
      "Compare two classes of NetApp all-flash arrays: A-Series with TLC NVMe for the most demanding workloads, and C-Series with QLC — a dense, energy-efficient alternative for the majority of environments.",
    toggleA: "AFF A50",
    toggleC: "AFF C60",
    toggleHintA: "All-flash · TLC · performance",
    toggleHintC: "All-flash · QLC · capacity",
    ledLabel: "STATUS",
    modelBadge: (name) => `NetApp AFF · ${name}`,
    specsTitle: "Specifications",
    positioning: "Positioning",
    workloads: "Ideal workloads",
    verdictHead: "Verdict",
    A: {
      name: "AFF A50",
      tagline: "Enterprise all-flash built for peak performance — TLC NVMe, sub-millisecond latency and the full power of ONTAP.",
      accent: "#06FFE0",
      accentSoft: "rgba(6, 255, 224, 0.35)",
      accentGlow: "rgba(6, 255, 224, 0.55)",
      icon: Flame,
      badge: "PERFORMANCE",
      specs: [
        { Icon: Cpu,        k: "Media",       v: "TLC NVMe SSD" },
        { Icon: Gauge,      k: "Latency",     v: "< 150 µs" },
        { Icon: Zap,        k: "Throughput",  v: "Up to ~400k IOPS / controller" },
        { Icon: HardDrive,  k: "Capacity",    v: "Up to ~1.5 PB effective" },
        { Icon: Layers,     k: "Scale",       v: "Scale-out 2–24 nodes" },
        { Icon: Cable,      k: "Interfaces",  v: "25/100 GbE · 32/64 Gb FC · NVMe-oF" },
        { Icon: ShieldCheck,k: "Security",    v: "SnapLock · autonomous ransomware · ARP" },
        { Icon: Database,   k: "OS",          v: "ONTAP 9.x · SnapMirror · FabricPool" },
      ],
      workloads: [
        "Transactional databases (Oracle, SQL, SAP HANA)",
        "High-density VDI",
        "AI / ML training and inference",
        "Mission-critical apps with sub-ms SLA",
      ],
      verdict:
        "Pick the A50 when every microsecond of latency turns into money — top performance, predictable even under peak load.",
    },
    C: {
      name: "AFF C60",
      tagline: "Dense QLC all-flash for storage consolidation — more capacity in the same footprint, at a lower cost per TB.",
      accent: "#7CD6FF",
      accentSoft: "rgba(124, 214, 255, 0.35)",
      accentGlow: "rgba(124, 214, 255, 0.55)",
      icon: Snowflake,
      badge: "CAPACITY",
      specs: [
        { Icon: Cpu,        k: "Media",       v: "QLC NVMe SSD" },
        { Icon: Gauge,      k: "Latency",     v: "< 1 ms (typical)" },
        { Icon: Zap,        k: "Throughput",  v: "Up to ~250k IOPS / controller" },
        { Icon: HardDrive,  k: "Capacity",    v: "Up to ~2.5 PB effective" },
        { Icon: Layers,     k: "Scale",       v: "Scale-out 2–24 nodes" },
        { Icon: Cable,      k: "Interfaces",  v: "25/100 GbE · 32 Gb FC · NVMe-oF" },
        { Icon: ShieldCheck,k: "Security",    v: "SnapLock · autonomous ransomware · ARP" },
        { Icon: Database,   k: "OS",          v: "ONTAP 9.x · SnapMirror · FabricPool" },
      ],
      workloads: [
        "File / block consolidation for business units",
        "First-tier backup and archive",
        "Medium-IO VMware environments",
        "Analytics with large datasets",
      ],
      verdict:
        "Pick the C60 when you need all-flash capacity without blowing the budget — more data per rack, lower power draw, same ONTAP platform.",
    },
  },
};

/** Stylized 2U rack-unit illustration — mimics the real NetApp AFF C60 / A50 chassis
 *  with 12 diagonally-striped drive carriers, right-side NetApp brand plate and a
 *  model label chip in the far-right corner. */
const RackUnit = ({ model }) => {
  const disks = Array.from({ length: 12 });
  return (
    <div
      className="sc-aff__rack"
      style={{
        "--aff-accent": model.accent,
        "--aff-accent-soft": model.accentSoft,
        "--aff-accent-glow": model.accentGlow,
      }}
      data-testid={`aff-rack-${model.name.replace(/\s+/g, "-").toLowerCase()}`}
    >
      <div className="sc-aff__rack-faceplate">
        {/* Left ear with tiny hole + latch */}
        <div className="sc-aff__rack-ear sc-aff__rack-ear--left" aria-hidden="true">
          <span className="sc-aff__rack-earhole" />
          <span className="sc-aff__rack-earled" />
        </div>

        {/* Disk cage — 12 diagonally-striped carriers */}
        <div className="sc-aff__rack-cage" aria-hidden="true">
          {disks.map((_, i) => (
            <span
              key={i}
              className="sc-aff__disk"
              style={{ animationDelay: `${(i * 0.09).toFixed(2)}s` }}
            >
              <span className="sc-aff__disk-hash" />
              <span className="sc-aff__disk-led" />
            </span>
          ))}
          {/* NetApp brand plate overlaid on the right side of the cage */}
          <div className="sc-aff__rack-brand" aria-hidden="true">
            <span className="sc-aff__rack-mark">n</span>
            <span className="sc-aff__rack-brandtxt">NetApp</span>
          </div>
        </div>

        {/* Right ear with model chip */}
        <div className="sc-aff__rack-ear sc-aff__rack-ear--right" aria-hidden="true">
          <span className="sc-aff__rack-earhole" />
          <span className="sc-aff__rack-model">{model.name}</span>
        </div>

        {/* Scanning highlight animation */}
        <div className="sc-aff__rack-scan" aria-hidden="true" />
      </div>

      {/* Category badge floating under the chassis */}
      <div className="sc-aff__rack-badgebar">
        <span className="sc-aff__rack-badge">{model.badge}</span>
        <span className="sc-aff__rack-u">2U · Dual-controller HA</span>
      </div>
    </div>
  );
};

const NetAppAFFSection = () => {
  const { lang } = useLang();
  const copy = COPY[lang] || COPY.pl;
  const parallaxRef = useSectionParallax();
  const [active, setActive] = useState("A"); // 'A' or 'C'

  const model = active === "A" ? copy.A : copy.C;

  return (
    <section
      id="netapp-aff"
      data-testid="netapp-aff-section"
      ref={parallaxRef}
      className="relative w-full overflow-hidden"
      style={{ background: "#040709", color: "#E8F4F5" }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(55% 55% at 50% 30%, rgba(6,255,224,0.06) 0%, rgba(6,255,224,0) 60%)," +
            " radial-gradient(45% 55% at 80% 80%, rgba(124,214,255,0.06) 0%, rgba(124,214,255,0) 60%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-28">
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
                background: "linear-gradient(135deg,#06FFE0 0%,#7CD6FF 100%)",
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

        {/* Toggle */}
        <div className="sc-aff__toggle" role="tablist" aria-label="AFF series toggle" data-testid="aff-toggle">
          <button
            role="tab"
            aria-selected={active === "A"}
            onClick={() => setActive("A")}
            className={`sc-aff__toggle-btn ${active === "A" ? "is-active is-A" : ""}`}
            data-testid="aff-toggle-A"
          >
            <Flame size={16} strokeWidth={2} />
            <span className="sc-aff__toggle-name">{copy.toggleA}</span>
            <span className="sc-aff__toggle-hint">{copy.toggleHintA}</span>
          </button>
          <button
            role="tab"
            aria-selected={active === "C"}
            onClick={() => setActive("C")}
            className={`sc-aff__toggle-btn ${active === "C" ? "is-active is-C" : ""}`}
            data-testid="aff-toggle-C"
          >
            <Snowflake size={16} strokeWidth={2} />
            <span className="sc-aff__toggle-name">{copy.toggleC}</span>
            <span className="sc-aff__toggle-hint">{copy.toggleHintC}</span>
          </button>
        </div>

        {/* Main grid */}
        <div className="sc-aff__grid" key={active}>
          {/* Visualization */}
          <div className="sc-aff__viz" data-testid="aff-viz">
            <RackUnit model={model} />
            <div className="sc-aff__tagline">
              <span className="sc-aff__tagline-mark">{copy.modelBadge(model.name)}</span>
              <p>{model.tagline}</p>
            </div>
          </div>

          {/* Specs */}
          <div className="sc-aff__specs" data-testid="aff-specs">
            <div className="sc-aff__specs-head">{copy.specsTitle}</div>
            <ul className="sc-aff__specs-list">
              {model.specs.map((s, i) => (
                <li key={i} className="sc-aff__spec" style={{ animationDelay: `${i * 0.05}s` }}>
                  <span className="sc-aff__spec-icon" style={{ color: model.accent }}>
                    <s.Icon size={17} strokeWidth={1.8} />
                  </span>
                  <span className="sc-aff__spec-k">{s.k}</span>
                  <span className="sc-aff__spec-v">{s.v}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Positioning row */}
        <div className="sc-aff__position" data-testid="aff-position">
          <div className="sc-aff__position-card">
            <div className="sc-aff__position-head">{copy.workloads}</div>
            <ul className="sc-aff__position-list">
              {model.workloads.map((w, i) => (
                <li key={i} className="sc-aff__position-item">
                  <span className="sc-aff__position-dot" style={{ background: model.accent, boxShadow: `0 0 8px ${model.accentGlow}` }} />
                  {w}
                </li>
              ))}
            </ul>
          </div>
          <div className="sc-aff__position-card sc-aff__position-card--verdict">
            <div className="sc-aff__position-head">{copy.verdictHead}</div>
            <p className="sc-aff__verdict">{model.verdict}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NetAppAFFSection;
