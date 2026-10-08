import React, { useRef, useState, useEffect, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Kontakt from "@/components/sections/Kontakt";
import Reveal from "@/components/Reveal";
import Tilt from "@/components/fx/Tilt";
import { NETAPP_MODELS, NETAPP_FAMILIES } from "@/data/netappModels";
import {
  Zap, Database, HardDrive, Server, ArrowRight,
  ChevronLeft, ChevronRight, Shield, Rocket, X, Layers, Cpu,
} from "lucide-react";
import "./NetAppPortfolioPage.css";

/* ---------- HERO SLIDER — 4 rodziny macierzy z auto-rotacją ---------- */
const HERO_SLIDES = [
  {
    id: "AFF",
    label: "AFF · Performance Flash",
    title: "NVMe all-flash dla",
    accent: "mission-critical.",
    tagline: "Sub-millisekundowa latencja, ekstremalne IOPS i pełny stack ONTAP — dla krytycznych baz, VMware i workloadów AI/ML.",
    color: "#06FFE0",
    stats: [["< 1 ms", "latencja"], ["NVMe", "TLC · end-to-end"], ["6:1", "redukcja danych"]],
    arrays: [{ name: "A90", img: "/netapp-assets/AFF_A90_Bezel.png" }],
  },
  {
    id: "CFLASH",
    label: "C-Series · Capacity Flash",
    title: "Pojemność jak HDD,",
    accent: "wydajność jak SSD.",
    tagline: "QLC NVMe — flash w cenie zbliżonej do HDD. Idealne dla backupu, archive i cyber-vault z immutability.",
    color: "#00B8D4",
    stats: [["QLC", "NVMe flash"], ["~HDD", "cena za TB"], ["Immutable", "SnapLock vault"]],
    arrays: [{ name: "C80", img: "/netapp-assets/AFF_C80_Front_Bezel.png" }],
  },
  {
    id: "ASA",
    label: "ASA · SAN Flash",
    title: "SAN-first NVMe",
    accent: "bez kompromisów.",
    tagline: "Symmetric active-active dla FC / iSCSI / NVMe-oF. Dedykowana klasa dla enterprise-block: banki, telco, cloud provider.",
    color: "#00E0C6",
    stats: [["Active-Active", "symetryczne"], ["FC · iSCSI", "NVMe-oF"], ["99.9999%", "dostępność"]],
    arrays: [{ name: "A90", img: "/netapp-assets/ASA_A90_Front_Bezel.png" }],
  },
  {
    id: "ESERIES",
    label: "E-Series & EF-Series · Block SAN",
    title: "Dedykowany blok dla",
    accent: "HPC i przemysłu.",
    tagline: "SANtricity: prosty, przewidywalny performance dla HPC, video-surveillance, seismic i OT. Bez ONTAP-overhead.",
    color: "#00D4B8",
    stats: [["2M+", "IOPS"], ["SANtricity", "prosty OS"], ["DDP", "szybki rebuild"]],
    arrays: [{ name: "E4060", img: "/netapp-assets/E4060_front_view.png" }],
  },
];

const HeroSlider = () => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = HERO_SLIDES.length;
  const DURATION = 7000; // 7s per slide

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % total), DURATION);
    return () => clearTimeout(t);
  }, [active, paused, total]);

  const goTo = (i) => setActive(((i % total) + total) % total);
  const next = () => goTo(active + 1);
  const prev = () => goTo(active - 1);

  return (
    <section
      className="np-hs"
      data-testid="netapp-hero-slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="np-hs__bg" aria-hidden="true" />
      <div className="np-hs__inner">
        {HERO_SLIDES.map((s, i) => (
          <div
            key={s.id}
            className={`np-hs__slide ${i === active ? "is-active" : ""}`}
            style={{ "--acc": s.color }}
            aria-hidden={i !== active}
            data-testid={`np-hs-slide-${s.id}`}
          >
            <div className="np-hs__copy">
              <div className="np-hs__label">
                <span className="np-hs__hair" />
                {s.label}
              </div>
              <h1 className="np-hs__title">
                {s.title}{" "}
                <span className="np-hs__accent">{s.accent}</span>
              </h1>
              <p className="np-hs__tag">{s.tagline}</p>

              <div className="np-hs__stats" data-testid={`np-hs-stats-${s.id}`}>
                {s.stats.map(([v, l], k) => (
                  <div key={k} className="np-hs__stat" style={{ "--k": k }}>
                    <strong>{v}</strong>
                    <span>{l}</span>
                  </div>
                ))}
              </div>

              <div className="np-hs__ctas">
                <a href="#npv2-onerow" className="sc-btn-primary" data-testid={`np-hs-cta-${s.id}`}>
                  Zobacz modele {s.id === "CFLASH" ? "C-Series" : s.id === "ESERIES" ? "E-Series" : s.id}
                  <ArrowRight size={16} />
                </a>
                <a href="#npv2-configurator" className="sc-btn-ghost">
                  Konfigurator dopasowania
                </a>
              </div>
            </div>

            <div className="np-hs__stack" style={{ "--n": s.arrays.length }}>
              <div className="np-hs__stack-inner">
                {s.arrays.map((a, idx) => (
                  <div
                    key={a.name}
                    className="np-hs__slab"
                    style={{ "--i": idx, "--n": s.arrays.length }}
                  >
                    <img src={a.img} alt="" aria-hidden="true" loading="eager" />
                    <span className="np-hs__sheen" style={{ "--img": `url(${a.img})` }} aria-hidden="true" />
                    <img className="np-hs__mirror" src={a.img} alt="" aria-hidden="true" loading="eager" />
                  </div>
                ))}
              </div>
              <div className="np-hs__reflection" aria-hidden="true" />
              <div className="np-hs__pedestal" aria-hidden="true" />
            </div>
          </div>
        ))}

        {/* Controls */}
        <div className="np-hs__controls">
          <button className="np-hs__nav" onClick={prev} aria-label="Poprzedni" data-testid="np-hs-prev">
            <ChevronLeft size={20} />
          </button>
          <div className="np-hs__dots" role="tablist">
            {HERO_SLIDES.map((s, i) => (
              <button
                key={s.id}
                className={`np-hs__dot ${i === active ? "is-active" : ""}`}
                onClick={() => goTo(i)}
                aria-label={s.label}
                data-testid={`np-hs-dot-${s.id}`}
              >
                <span className="np-hs__dot-label">{s.id === "CFLASH" ? "C" : s.id === "ESERIES" ? "E/EF" : s.id}</span>
                <span
                  className="np-hs__dot-bar"
                  style={{
                    "--np-hs-dur": `${DURATION}ms`,
                    "--np-hs-play": paused ? "paused" : "running",
                  }}
                />
              </button>
            ))}
          </div>
          <button className="np-hs__nav" onClick={next} aria-label="Następny" data-testid="np-hs-next">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

/**
 * NpHeader — ujednolicony nagłówek sekcji w stylu strony głównej:
 * hairline (h-px w-12 cyan) + label uppercase + tytuł z akcentem gradientowym.
 * Wariant dark używa jaśniejszego tekstu labelu.
 */
const NpHeader = ({ label, title, accent, sub, center = false, dark = false, tag }) => (
  <header className={`np-shdr ${center ? "np-shdr--center" : ""} ${dark ? "np-shdr--dark" : ""}`} data-testid={tag}>
    <div className="np-shdr__label">
      <span className="np-shdr__hair" />
      {label}
    </div>
    <h2 className="np-shdr__title">
      {title}
      {accent && (
        <>
          {" "}
          <span className="np-shdr__accent">{accent}</span>
        </>
      )}
    </h2>
    {sub && <p className="np-shdr__sub">{sub}</p>}
  </header>
);

/**
 * NetAppPortfolioPage — /netapp-portfolio
 * Jedna sekcja, dwuosiowy filtr:
 *   1) Protokół:  Wszystkie · SAN · Unified (Plik / Blok / Obiekt)
 *   2) Warstwa:   Wszystkie · Flash Performance · Capacity Flash · Hybrid
 * Wynik: horyzontalny scroll z odfiltrowanymi macierzami NetApp.
 */

/* ---- Klasyfikacja modeli (na bazie datasheetów NetApp) ---- */
const PROTOCOL_BY_FAMILY = {
  AFF:      "UNIFIED",  // NAS + SAN via ONTAP
  ASA:      "SAN",      // block-only
  CFLASH:   "UNIFIED",
  FAS:      "UNIFIED",
  ESERIES:  "SAN",
  EFSERIES: "SAN",
};

/* Media class — dla wyjątków (ASA C30) używamy per-model override */
const MCLASS_BY_FAMILY = {
  AFF:      "PERFORMANCE",
  ASA:      "PERFORMANCE",
  CFLASH:   "CAPACITY",
  FAS:      "HYBRID",
  ESERIES:  "HYBRID",
  EFSERIES: "PERFORMANCE",
};
const MCLASS_OVERRIDE = {
  "ASA-C30": "CAPACITY",
};

/* System operacyjny — per family */
const OS_BY_FAMILY = {
  AFF:      "ONTAP",
  ASA:      "ONTAP",
  CFLASH:   "ONTAP",
  FAS:      "ONTAP",
  ESERIES:  "SANTRICITY",
  EFSERIES: "SANTRICITY",
};

const getProtocol = (m) => PROTOCOL_BY_FAMILY[m.family];
const getMClass  = (m) => MCLASS_OVERRIDE[m.id] || MCLASS_BY_FAMILY[m.family];
const getOS      = (m) => OS_BY_FAMILY[m.family];

const FAMILY_ICON = {
  AFF:      <Zap size={16} />,
  ASA:      <Shield size={16} />,
  CFLASH:   <Database size={16} />,
  FAS:      <HardDrive size={16} />,
  ESERIES:  <Server size={16} />,
  EFSERIES: <Rocket size={16} />,
};

const PROTOCOL_META = {
  SAN: {
    label: "SAN",
    sub: "Block (FC / iSCSI / NVMe-oF)",
    color: "#00B8D4",
  },
  UNIFIED: {
    label: "Unified",
    sub: "Plik · Blok · Obiekt (NFS/SMB · FC/iSCSI · S3)",
    color: "#06FFE0",
  },
};

const MCLASS_META = {
  PERFORMANCE: { label: "Flash Performance", short: "Performance", desc: "NVMe TLC · sub-millisekundowa latencja", color: "#06FFE0" },
  CAPACITY:    { label: "Capacity Flash",    short: "Capacity",    desc: "QLC NVMe · cena zbliżona do HDD",         color: "#00B8D4" },
  HYBRID:      { label: "Hybrid",            short: "Hybrid",      desc: "HDD + flash cache · ekonomia skali",       color: "#0EA5A0" },
};

const OS_META = {
  ONTAP:      { label: "ONTAP",      short: "ONTAP",      desc: "Unified OS — NAS + SAN, snapshoty, SnapMirror, FabricPool", color: "#06FFE0" },
  SANTRICITY: { label: "SANtricity", short: "SANtricity", desc: "Prosty, wydajny OS dla dedykowanego bloku (E/EF-Series)",   color: "#00D4B8" },
};

/* ---------- Model card ---------- */
const ModelCard = ({ model }) => {
  const fam = NETAPP_FAMILIES[model.family];
  const hasRear = Boolean(model.imgRear);
  const proto = PROTOCOL_META[getProtocol(model)];
  const mclass = MCLASS_META[getMClass(model)];
  const os = OS_META[getOS(model)];

  return (
    <Tilt
      as="article"
      max={6}
      className="npv2-card"
      data-testid={`npv2-model-${model.id}`}
      style={{ "--fam": fam.accent }}
    >
      <span className="npv2-card__accent" aria-hidden="true" />
      {model.tier === "Flagship" && <span className="npv2-card__badge">Flagship</span>}

      <div className="npv2-card__id">
        <span>{fam.short}</span>
        <span>{model.tier}</span>
        <span>{model.chassis}</span>
      </div>

      <h3 className="npv2-card__name">{model.name}</h3>
      <p className="npv2-card__tagline">{model.tagline}</p>

      <div className="npv2-card__tagrow">
        <span className="npv2-tag npv2-tag--proto" style={{ "--tc": proto.color }}>
          {proto.label}
        </span>
        <span className="npv2-tag npv2-tag--tier" style={{ "--tc": mclass.color }}>
          {mclass.short}
        </span>
        <span className="npv2-tag npv2-tag--os" style={{ "--tc": os.color }}>
          {os.label}
        </span>
      </div>

      <div className="npv2-card__imgbox">
        {model.img && (
          <img
            className="npv2-card__img npv2-card__img--front"
            src={model.img}
            alt={`${model.name} front`}
            loading="lazy"
          />
        )}
        {hasRear && (
          <img
            className="npv2-card__img npv2-card__img--rear"
            src={model.imgRear}
            alt={`${model.name} rear`}
            loading="lazy"
          />
        )}
        {hasRear && <span className="npv2-card__imghint">Hover · Rear</span>}
      </div>

      <ul className="npv2-card__specs">
        <li><span className="k">Max Cap</span><span className="v">{model.maxCapEff}</span></li>
        <li><span className="k">Throughput</span><span className="v">{model.maxThroughput}</span></li>
        <li><span className="k">Latencja</span><span className="v">{model.latency}</span></li>
        <li><span className="k">Max Drives</span><span className="v">{model.maxDrives}</span></li>
        <li><span className="k">RAM</span><span className="v">{model.ram}</span></li>
        <li><span className="k">Porty</span><span className="v" style={{ fontSize: 11 }}>{model.ports}</span></li>
      </ul>

      <p className="npv2-card__hi">{model.highlight}</p>
    </Tilt>
  );
};

/* ---------- Filter chips ---------- */
const FilterGroup = ({ label, options, active, onChange, testid }) => (
  <div className="npv2-fgroup" data-testid={testid}>
    <span className="npv2-fgroup__label">{label}</span>
    <div className="npv2-fgroup__chips">
      {options.map((o) => (
        <button
          key={o.value}
          className={`npv2-chip ${active === o.value ? "is-active" : ""}`}
          onClick={() => onChange(o.value)}
          style={{ "--tc": o.color || "#00B8D4" }}
          data-testid={`${testid}-${o.value}`}
        >
          {o.icon && <span className="npv2-chip__icon">{o.icon}</span>}
          <span>{o.label}</span>
          {o.count !== undefined && <span className="npv2-chip__count">{o.count}</span>}
        </button>
      ))}
    </div>
  </div>
);

/* ---------- SEKCJA: KIEDY WYBRAĆ (AFF / C-Series / FAS / E-Series) ---------- */
const FAMILY_GUIDE = [
  {
    key: "AFF",
    icon: <Zap size={22} />,
    color: "#06FFE0",
    tagline: "Najwyższa wydajność NVMe dla mission-critical",
    price: 5, perf: 5, cap: 3,   // 1-5 skala do wizualizacji barów
    whenChoose: [
      "Krytyczne bazy: Oracle, SAP HANA, MS SQL",
      "VMware / Hyper-V na dużą skalę",
      "AI/ML training pipelines i analytics",
      "Trading, telko, real-time processing",
    ],
    workloads: ["VMware", "Oracle DB", "SAP HANA", "AI/ML", "Analytics"],
    avoidWhen: "Backup, archive lub gdy priorytet to $/TB.",
  },
  {
    key: "CFLASH",
    icon: <Database size={22} />,
    color: "#00B8D4",
    tagline: "Capacity flash QLC — pojemność jak HDD, latencja jak SSD",
    price: 3, perf: 3, cap: 5,
    whenChoose: [
      "Backup enterprise i długi retention",
      "Archive i cyber-vault (immutable)",
      "Secondary storage / DR target",
      "FabricPool tier dla ONTAP AFF",
    ],
    workloads: ["Backup", "Archive", "Cyber-vault", "DR", "Cold data"],
    avoidWhen: "Real-time trading lub bazy OLTP z ekstremalnymi IOPS.",
  },
  {
    key: "FAS",
    icon: <HardDrive size={22} />,
    color: "#0EA5A0",
    tagline: "Hybrydowa ekonomia skali — HDD + flash cache",
    price: 1, perf: 2, cap: 5,
    whenChoose: [
      "File-share (NFS/SMB) o dużej pojemności",
      "Media library, video repository",
      "Konsolidacja plików w oddziałach",
      "Secondary tier tam gdzie budżet jest kluczowy",
    ],
    workloads: ["File-share", "Media", "Konsolidacja", "Home dirs", "Archive"],
    avoidWhen: "Latencja < 1 ms lub wysokie IOPS random.",
  },
  {
    key: "ESERIES",
    icon: <Server size={22} />,
    color: "#7ED9CE",
    tagline: "Dedykowany blok SAN dla HPC/OT — bez ONTAP-overhead",
    price: 2, perf: 3, cap: 4,
    whenChoose: [
      "HPC, seismic, high-throughput computing",
      "Video-surveillance (24/7 write)",
      "OT / automatyka przemysłowa",
      "Prostota — jeden LUN, jeden host, high-BW",
    ],
    workloads: ["HPC", "Video surveillance", "Seismic", "OT", "Media ingest"],
    avoidWhen: "Potrzeba NAS, snapshotów NetApp lub FabricPool.",
  },
];

const Bar = ({ label, level, color }) => (
  <div className="npv2-fg__bar">
    <span className="npv2-fg__bar-label">{label}</span>
    <div className="npv2-fg__bar-track">
      <div
        className="npv2-fg__bar-fill"
        style={{ "--w": `${(level / 5) * 100}%`, background: color, color }}
      />
    </div>
    <span className="npv2-fg__bar-val">{level}/5</span>
  </div>
);

const FamilyGuideSection = () => (
  <section className="npv2-fg" data-testid="npv2-family-guide" id="npv2-family-guide">
    <div className="npv2-fg__inner">
      <Reveal>
        <NpHeader
          center
          dark
          label="Rodziny NetApp · kiedy wybrać"
          title="AFF, C-Series, FAS czy"
          accent="E-Series?"
          sub="Cztery rodziny, cztery różne odpowiedzi. Sprawdź gdzie każda z nich świeci najjaśniej — i gdzie lepiej wybrać inną."
          tag="npv2-fg-header"
        />
      </Reveal>

      <div className="npv2-fg__grid">
        {FAMILY_GUIDE.map((f, i) => {
          const fam = NETAPP_FAMILIES[f.key];
          return (
            <Reveal key={f.key} delay={i * 120}>
              <Tilt
                as="article"
                max={5}
                className="npv2-fg__card"
                style={{ "--tc": f.color }}
                data-testid={`npv2-fg-card-${f.key}`}
              >
              <span className="npv2-fg__num" aria-hidden="true">0{i + 1}</span>
              <div className="npv2-fg__head-row">
                <div className="npv2-fg__ico">{f.icon}</div>
                <div>
                  <h3 className="npv2-fg__name">{fam.label.split("·")[0].trim()}</h3>
                  <p className="npv2-fg__tag">{f.tagline}</p>
                </div>
              </div>

              <div className="npv2-fg__bars">
                <Bar label="Wydajność" level={f.perf}  color={f.color} />
                <Bar label="Pojemność" level={f.cap}   color={f.color} />
                <Bar label="Koszt / TB" level={6 - f.price} color={f.color} />
                {/* Bar "Koszt/TB" odwrócony: wyższy słupek = lepszy $/TB */}
              </div>

              <div className="npv2-fg__block">
                <h4 className="npv2-fg__block-title">Wybierz gdy:</h4>
                <ul className="npv2-fg__list">
                  {f.whenChoose.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>

              <div className="npv2-fg__chips">
                {f.workloads.map((w, i) => (
                  <span key={i} className="npv2-fg__chip">{w}</span>
                ))}
              </div>

              <p className="npv2-fg__avoid">
                <strong>Unikaj gdy:</strong> {f.avoidWhen}
              </p>
            </Tilt>
            </Reveal>
          );
        })}
      </div>
    </div>
  </section>
);

/* ---------- SEKCJA: ONTAP vs SANtricity ---------- */
const OS_COMPARE = [
  { row: "Typ systemu",         ONTAP: "Unified — NAS + SAN",             SANTRICITY: "Dedykowany blokowy" },
  { row: "Protokoły",           ONTAP: "NFS · SMB · S3 · FC · iSCSI · NVMe-oF", SANTRICITY: "FC · iSCSI · SAS · NVMe-oF" },
  { row: "Snapshoty",           ONTAP: "SnapShot, SnapMirror, SnapVault",  SANTRICITY: "Ograniczone (copy-services)" },
  { row: "Replikacja",          ONTAP: "SnapMirror async/sync + MetroCluster", SANTRICITY: "Async Mirroring 1:1" },
  { row: "Data services",       ONTAP: "Kompresja, dedup, kompaksja, tiering FabricPool", SANTRICITY: "Podstawowa kompresja + Data Assurance" },
  { row: "Multi-tenancy",       ONTAP: "SVMs (Storage VMs)",              SANTRICITY: "Volume groups + host groups" },
  { row: "Zarządzanie",         ONTAP: "System Manager / Active IQ / REST", SANTRICITY: "SANtricity System Manager" },
  { row: "Rodziny wspierane",   ONTAP: "AFF · ASA · C-Series · FAS",       SANTRICITY: "E-Series · EF-Series" },
  { row: "Idealne dla",         ONTAP: "Enterprise, VMware, DB, backup",  SANTRICITY: "HPC, video-surveillance, OT, HPC block" },
  { row: "Krzywa nauki",        ONTAP: "Średnia (bogaty feature-set)",     SANTRICITY: "Niska (prosty, przewidywalny)" },
];

const OSCompareSection = () => (
  <section className="npv2-osc" data-testid="npv2-os-compare" id="npv2-os-compare">
    <div className="npv2-osc__bg" aria-hidden="true" />
    <div className="npv2-osc__inner">
      <Reveal>
        <NpHeader
          center
          label="System operacyjny"
          title="ONTAP vs"
          accent="SANtricity"
          sub="Dwa różne systemy operacyjne NetApp — dwie różne filozofie. Wybór OS jest równie ważny co wybór macierzy."
          tag="npv2-osc-header"
        />
      </Reveal>

      <div className="npv2-osc__grid">
        <span className="npv2-osc__vs" aria-hidden="true">vs</span>
        {/* ONTAP */}
        <Reveal delay={60}>
          <Tilt as="article" max={4} className="npv2-osc__card npv2-osc__card--ontap" data-testid="npv2-osc-ontap">
            <div className="npv2-osc__header">
              <div className="npv2-osc__ico"><Layers size={24} /></div>
              <div>
                <h3>ONTAP</h3>
                <p>Unified data platform</p>
              </div>
            </div>
            <ul className="npv2-osc__feats">
              <li>NAS <em>i</em> SAN w jednym systemie (multi-protocol)</li>
              <li>Snapshoty, SnapMirror, SnapVault out-of-the-box</li>
              <li>FabricPool tiering do S3 / Azure Blob / GCP</li>
              <li>Kompresja, deduplikacja, kompaksja — inline</li>
              <li>MetroCluster synchroniczna replikacja &lt; 100 km</li>
              <li>REST API, Ansible, Terraform providers</li>
            </ul>
            <div className="npv2-osc__bestfor">
              <strong>Najlepszy do:</strong> Enterprise, VMware, bazy, backup, hybrid-cloud
            </div>
          </Tilt>
        </Reveal>

        {/* SANtricity */}
        <Reveal delay={140}>
          <Tilt as="article" max={4} className="npv2-osc__card npv2-osc__card--santricity" data-testid="npv2-osc-santricity">
            <div className="npv2-osc__header">
              <div className="npv2-osc__ico"><Cpu size={24} /></div>
              <div>
                <h3>SANtricity</h3>
                <p>Dedicated block platform</p>
              </div>
            </div>
            <ul className="npv2-osc__feats">
              <li>Blok-only — prosty, przewidywalny performance</li>
              <li>Data Assurance (T10 PI) — end-to-end integrity</li>
              <li>Async Mirroring 1:1 pomiędzy macierzami</li>
              <li>Dynamic Disk Pools (DDP) — szybszy rebuild niż RAID</li>
              <li>Zero-config high availability (dual-active controllers)</li>
              <li>SANtricity System Manager — prosty UI</li>
            </ul>
            <div className="npv2-osc__bestfor">
              <strong>Najlepszy do:</strong> HPC, video-surveillance, seismic, OT, dedykowany SAN
            </div>
          </Tilt>
        </Reveal>
      </div>

      {/* Table */}
      <Reveal delay={200}>
        <div className="npv2-osc__table" role="table">
        <div className="npv2-osc__trow npv2-osc__trow--head">
          <div className="npv2-osc__tcell npv2-osc__tcell--label">Kryterium</div>
          <div className="npv2-osc__tcell npv2-osc__tcell--head" style={{ color: OS_META.ONTAP.color }}>
            <Layers size={16}/> ONTAP
          </div>
          <div className="npv2-osc__tcell npv2-osc__tcell--head" style={{ color: OS_META.SANTRICITY.color }}>
            <Cpu size={16}/> SANtricity
          </div>
        </div>
        {OS_COMPARE.map((r, i) => (
          <div key={i} className="npv2-osc__trow">
            <div className="npv2-osc__tcell npv2-osc__tcell--label">{r.row}</div>
            <div className="npv2-osc__tcell">{r.ONTAP}</div>
            <div className="npv2-osc__tcell">{r.SANTRICITY}</div>
          </div>
        ))}
        </div>
      </Reveal>
    </div>
  </section>
);

/* ---------- SEKCJA: KONFIGURATOR (8 pytań → rekomendacja modelu) ---------- */
const CONFIG_QUESTIONS = [
  {
    id: "access",
    icon: <Layers size={20} />,
    q: "Jaki typ dostępu do danych potrzebujesz?",
    sub: "Ta decyzja determinuje protokół i rodzinę macierzy.",
    options: [
      { v: "FILE",     label: "Głównie plikowy",       desc: "NAS (NFS / SMB) — home dirs, file-share" },
      { v: "BLOCK",    label: "Głównie blokowy",       desc: "LUN-y dla VMware, Hyper-V, baz danych" },
      { v: "MULTI",    label: "Multi-protocol",        desc: "Plik + Blok + Obiekt (S3) w jednym systemie" },
      { v: "SAN_ONLY", label: "Dedykowany blok SAN",   desc: "Bez NAS — prosty, wydajny blok" },
    ],
  },
  {
    id: "workload",
    icon: <Server size={20} />,
    q: "Jaki jest twój główny workload?",
    sub: "Wybierz to co dominuje — jeśli jest ich kilka, wybierz najkrytyczniejszy.",
    options: [
      { v: "VMWARE", label: "VMware / hyper-visory",             desc: "Konsolidacja maszyn wirtualnych" },
      { v: "DB",     label: "Krytyczne bazy danych",             desc: "Oracle, SQL, SAP HANA" },
      { v: "FILE",   label: "File-share / home dirs",            desc: "Dokumenty, projekty, użytkownicy" },
      { v: "BACKUP", label: "Backup / archive / cyber-vault",    desc: "Retention, immutability, DR" },
      { v: "HPC",    label: "HPC / trading / analytics",         desc: "Extreme IOPS, sub-ms latencja" },
      { v: "VIDEO",  label: "Video-surveillance / seismic / OT", desc: "24/7 write, high-BW, prostota" },
    ],
  },
  {
    id: "latency",
    icon: <Zap size={20} />,
    q: "Jaka jest wymagana latencja?",
    sub: "Latencja to najważniejszy wskaźnik responsywności macierzy.",
    options: [
      { v: "EXTREME", label: "< 500 μs",  desc: "Trading, HFT, ekstremalne workloady" },
      { v: "HIGH",    label: "< 1 ms",    desc: "Bazy krytyczne, produkcja, VMware core" },
      { v: "MID",     label: "1-3 ms",    desc: "Aplikacje, file-share aktywny, VDI" },
      { v: "LOW",     label: "3-10 ms",   desc: "Backup, archive, secondary storage" },
    ],
  },
  {
    id: "capacity",
    icon: <Database size={20} />,
    q: "Jaka docelowa pojemność użyteczna?",
    sub: "Uwzględnij wzrost na 3-5 lat — nie tylko obecne zapotrzebowanie.",
    options: [
      { v: "SMALL", label: "do 100 TB",    desc: "Oddział, SMB, jeden departament" },
      { v: "MID",   label: "100 TB - 1 PB",desc: "Mid-market, wielo-oddziałowa firma" },
      { v: "LARGE", label: "1 - 10 PB",    desc: "Enterprise, centralne repozytorium" },
      { v: "HYPER", label: "> 10 PB",      desc: "Hyperscale, bank, telco, cloud provider" },
    ],
  },
  {
    id: "cost",
    icon: <HardDrive size={20} />,
    q: "Jaki jest priorytet kosztowy?",
    sub: "Znajdź balans między wydajnością a budżetem.",
    options: [
      { v: "LOWEST",  label: "Najniższy $/TB",           desc: "Cena jest kluczowa, wydajność drugorzędna" },
      { v: "BALANCE", label: "Balans cena / wydajność",  desc: "Rozsądny koszt przy dobrym performance" },
      { v: "PERF",    label: "Wydajność ponad koszt",    desc: "Krytyczne workloady, budżet elastyczny" },
    ],
  },
  {
    id: "ontap",
    icon: <Cpu size={20} />,
    q: "Czy potrzebujesz funkcji ONTAP?",
    sub: "SnapShoty, SnapMirror, FabricPool, deduplikacja, kompresja inline.",
    options: [
      { v: "YES",     label: "Tak — kluczowe",    desc: "Snapshoty, replikacja, hybrid-cloud tiering" },
      { v: "NEUTRAL", label: "Obojętne",          desc: "Nie mam preferencji, dostosuj do potrzeb" },
      { v: "NO",      label: "Nie — prosty blok", desc: "Nie chcę narzutu ONTAP, prosta obsługa" },
    ],
  },
  {
    id: "scale",
    icon: <Shield size={20} />,
    q: "Jaka jest skala twojego środowiska?",
    sub: "Determinuje klasę controllera i limity maks. dysków.",
    options: [
      { v: "SMB",        label: "Oddział / SMB",           desc: "<50 użytkowników, prosty stack" },
      { v: "MID",        label: "Mid-market",              desc: "50-500 użytkowników, wielo-workload" },
      { v: "ENT",        label: "Enterprise",              desc: "500-5000+, redundancja, DR" },
      { v: "HYPERSCALE", label: "Hyperscale / bank / telco", desc: "Krytyczne SLA, MetroCluster, hyperscale" },
    ],
  },
  {
    id: "cloud",
    icon: <Rocket size={20} />,
    q: "Integracja z chmurą publiczną?",
    sub: "FabricPool tiering, backup do S3/Azure Blob, hybrid-cloud strategy.",
    options: [
      { v: "YES", label: "Tak — hybrid cloud", desc: "Tiering, backup, DR do public cloud" },
      { v: "NO",  label: "Nie — tylko on-prem",desc: "Chmura publiczna nie jest w planach" },
    ],
  },
];

/* ---------- Silnik rekomendacji ---------- */
function recommendModel(a) {
  const { access, workload, latency, capacity, cost, ontap, scale, cloud } = a;

  // 1) Wybór rodziny
  let family;
  const reasons = [];

  const isDedicatedBlock =
    access === "SAN_ONLY" ||
    workload === "HPC" ||
    workload === "VIDEO" ||
    ontap === "NO";

  if (isDedicatedBlock) {
    // Dedykowany SAN → E/EF
    if (latency === "EXTREME" || workload === "HPC" || cost === "PERF") {
      family = "EFSERIES";
      reasons.push("Ekstremalne IOPS + prosty stack SAN NVMe (bez ONTAP-overhead)");
    } else {
      family = "ESERIES";
      reasons.push("Dedykowany blok dla HPC/video/OT — prosty, przewidywalny");
    }
    if (ontap === "NO") reasons.push("SANtricity — brak narzutu ONTAP");
  }
  else if (access === "BLOCK" && workload !== "BACKUP" && workload !== "FILE") {
    // SAN + ONTAP → ASA
    family = "ASA";
    reasons.push("SAN-first NVMe z pełnym feature-setem ONTAP");
    if (workload === "DB")    reasons.push("Symmetric active-active + NVMe/TCP dla baz");
    if (workload === "VMWARE") reasons.push("Optymalizacja pod block-storage VMware");
  }
  else if (workload === "BACKUP" || (cost === "LOWEST" && latency !== "EXTREME" && latency !== "HIGH")) {
    // Backup / archive / low-cost secondary → C-Series
    family = "CFLASH";
    reasons.push("Capacity Flash QLC — cena zbliżona do HDD, wydajność flash");
    if (workload === "BACKUP") reasons.push("Idealna do backupu, retention i cyber-vault (immutable)");
    if (cloud === "YES") reasons.push("FabricPool tier do S3/Azure — hybrid cloud");
  }
  else if ((workload === "FILE" || workload === "VIDEO") && cost === "LOWEST" && latency !== "EXTREME" && latency !== "HIGH") {
    // File-share cheap → FAS
    family = "FAS";
    reasons.push("Hybrydowa ekonomia skali — HDD + flash cache");
    reasons.push("Najniższy $/TB dla file-share, media, home dirs");
  }
  else {
    // Default → AFF (unified performance)
    family = "AFF";
    reasons.push("Unified NVMe all-flash — NAS + SAN + snapshots + hybrid cloud");
    if (workload === "VMWARE" || workload === "DB") reasons.push("Sub-ms latencja dla krytycznych baz i VMware");
    if (cloud === "YES") reasons.push("FabricPool tiering do S3/Azure Blob/GCP");
  }

  // 2) Wybór modelu z rodziny (na podstawie skali / pojemności)
  const familyModels = NETAPP_MODELS.filter((m) => m.family === family);
  const desiredTier = (() => {
    if (scale === "HYPERSCALE" || capacity === "HYPER") return "FLAGSHIP";
    if (scale === "ENT" || capacity === "LARGE")        return "ENTERPRISE";
    if (scale === "MID" || capacity === "MID")          return "MID";
    return "ENTRY";
  })();

  const tierOrder = ["Entry", "Capacity", "Mid", "Mid-High", "High", "Enterprise", "Flagship", "High-Density"];
  const tierRank = { ENTRY: 0, MID: 2, ENTERPRISE: 5, FLAGSHIP: 6 };
  const targetIdx = tierRank[desiredTier];

  // Sort by tier proximity to target
  const sorted = [...familyModels].sort((a, b) => {
    const ai = tierOrder.indexOf(a.tier);
    const bi = tierOrder.indexOf(b.tier);
    return Math.abs(ai - targetIdx) - Math.abs(bi - targetIdx);
  });
  const model = sorted[0] || familyModels[0];

  // 3) Dodatkowe reasons (workload-specific)
  if (latency === "EXTREME" && (family === "AFF" || family === "ASA" || family === "EFSERIES"))
    reasons.push(`Latencja ${model.latency} — spełnia wymóg sub-500 μs`);
  if (capacity === "HYPER" && model.tier === "Flagship")
    reasons.push(`Skala ${model.maxCapEff} — max pojemność w rodzinie`);
  if (cloud === "YES" && (family === "AFF" || family === "CFLASH" || family === "FAS" || family === "ASA"))
    reasons.push("FabricPool: tiering danych zimnych do public cloud");

  return { family, model, reasons };
}

/* ---------- Komponent konfiguratora ---------- */
const NetAppConfigurator = () => {
  const [step, setStep] = useState(0);         // 0..7 (pytania), 8 = wynik
  const [answers, setAnswers] = useState({});
  const totalSteps = CONFIG_QUESTIONS.length;

  const current = CONFIG_QUESTIONS[step];
  const isResult = step >= totalSteps;
  const result = useMemo(() => (isResult ? recommendModel(answers) : null), [isResult, answers]);

  const answer = (value) => {
    setAnswers((prev) => ({ ...prev, [current.id]: value }));
    setStep((s) => s + 1);
  };
  const back = () => setStep((s) => Math.max(0, s - 1));
  const restart = () => { setAnswers({}); setStep(0); };

  return (
    <section className="npv2-cfg" data-testid="npv2-configurator" id="npv2-configurator">
      <div className="npv2-cfg__bg" aria-hidden="true" />
      <div className="npv2-cfg__inner">
        <Reveal>
          <NpHeader
            center
            dark
            label="Konfigurator · 8 pytań"
            title="Znajdź swoją macierz w"
            accent="2 minuty."
            sub="Odpowiedz na 8 krótkich pytań — algorytm dobierze konkretny model NetApp pasujący do twoich potrzeb."
            tag="npv2-cfg-header"
          />
        </Reveal>

        <Reveal delay={100}>
          <div className="npv2-cfg__card" data-testid="npv2-cfg-card">
          {!isResult ? (
            <>
              {/* Progress */}
              <div className="npv2-cfg__progress">
                <div className="npv2-cfg__pheader">
                  <span className="npv2-cfg__step">Pytanie {step + 1} / {totalSteps}</span>
                  <span className="npv2-cfg__pct">{Math.round(((step) / totalSteps) * 100)}%</span>
                </div>
                <div className="npv2-cfg__pbar">
                  <div className="npv2-cfg__pfill" style={{ width: `${((step) / totalSteps) * 100}%` }} />
                </div>
                <div className="npv2-cfg__dots">
                  {CONFIG_QUESTIONS.map((_, i) => (
                    <span
                      key={i}
                      className={`npv2-cfg__dot ${i < step ? "is-done" : ""} ${i === step ? "is-current" : ""}`}
                    />
                  ))}
                </div>
              </div>

              {/* Question */}
              <div className="npv2-cfg__qbox" key={`q-${step}`}>
                <div className="npv2-cfg__qico">{current.icon}</div>
                <h3 className="npv2-cfg__q">{current.q}</h3>
                <p className="npv2-cfg__qsub">{current.sub}</p>
              </div>

              {/* Options */}
              <div className={`npv2-cfg__opts npv2-cfg__opts--${current.options.length}`} key={`o-${step}`}>
                {current.options.map((opt, oi) => (
                  <Tilt
                    as="button"
                    tilt={false}
                    key={opt.v}
                    className="npv2-cfg__opt"
                    style={{ "--k": oi }}
                    onClick={() => answer(opt.v)}
                    data-testid={`npv2-cfg-${current.id}-${opt.v}`}
                  >
                    <span className="npv2-cfg__opt-label">{opt.label}</span>
                    <span className="npv2-cfg__opt-desc">{opt.desc}</span>
                    <ArrowRight size={16} className="npv2-cfg__opt-arrow" />
                  </Tilt>
                ))}
              </div>

              {/* Back */}
              <div className="npv2-cfg__nav">
                {step > 0 && (
                  <button className="sc-btn-ghost" onClick={back} data-testid="npv2-cfg-back">
                    <ChevronLeft size={14} /> Wstecz
                  </button>
                )}
              </div>
            </>
          ) : (
            /* RESULT */
            <ConfigResult result={result} onRestart={restart} answers={answers} />
          )}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

/* ---------- Karta wyniku ---------- */
const ConfigResult = ({ result, onRestart, answers }) => {
  const { family, model, reasons } = result;
  const fam = NETAPP_FAMILIES[family];
  const proto = PROTOCOL_META[PROTOCOL_BY_FAMILY[family]];
  const mclass = MCLASS_META[MCLASS_OVERRIDE[model.id] || MCLASS_BY_FAMILY[family]];
  const os = OS_META[OS_BY_FAMILY[family]];

  return (
    <div className="npv2-cfg__result" data-testid="npv2-cfg-result" style={{ "--fam": fam.accent }}>
      <div className="npv2-cfg__result-tag">
        <Rocket size={14} /> Rekomendacja
      </div>

      <div className="npv2-cfg__result-head">
        <div>
          <div className="npv2-cfg__result-family">{fam.label}</div>
          <h3 className="npv2-cfg__result-name">{model.name}</h3>
          <p className="npv2-cfg__result-tagline">{model.tagline}</p>

          <div className="npv2-cfg__result-tags">
            <span className="npv2-tag" style={{ "--tc": proto.color }}>{proto.label}</span>
            <span className="npv2-tag" style={{ "--tc": mclass.color }}>{mclass.short}</span>
            <span className="npv2-tag" style={{ "--tc": os.color }}>{os.label}</span>
            <span className="npv2-tag" style={{ "--tc": fam.accent }}>{model.tier} · {model.chassis}</span>
          </div>
        </div>

        {model.img && (
          <div className="npv2-cfg__result-imgbox">
            <img src={model.img} alt={model.name} className="npv2-cfg__result-img" />
          </div>
        )}
      </div>

      <div className="npv2-cfg__result-grid">
        <div className="npv2-cfg__result-block">
          <h4>Dlaczego {model.name}?</h4>
          <ul className="npv2-fg__list" style={{ "--tc": fam.accent }}>
            {reasons.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </div>

        <div className="npv2-cfg__result-block">
          <h4>Kluczowe specyfikacje</h4>
          <ul className="npv2-cfg__result-specs">
            <li><span>Max pojemność efekt.</span><em>{model.maxCapEff}</em></li>
            <li><span>Przepustowość</span><em>{model.maxThroughput}</em></li>
            <li><span>Latencja</span><em>{model.latency}</em></li>
            <li><span>Max dysków</span><em>{model.maxDrives}</em></li>
            <li><span>RAM controller</span><em>{model.ram}</em></li>
            <li><span>Porty</span><em>{model.ports}</em></li>
          </ul>
        </div>
      </div>

      <div className="npv2-cfg__result-cta">
        <a href="#kontakt" className="sc-btn-primary" data-testid="npv2-cfg-cta-contact">
          Umów rozmowę o {model.name} <ArrowRight size={16} />
        </a>
        <button className="sc-btn-ghost" onClick={onRestart} data-testid="npv2-cfg-restart">
          <X size={14} /> Zacznij od nowa
        </button>
      </div>
    </div>
  );
};

/* ---------- Main page ---------- */
const NetAppPortfolioPage = () => {
  const [proto, setProto]   = useState("ALL");  // ALL | SAN | UNIFIED
  const [mclass, setMclass] = useState("ALL");  // ALL | PERFORMANCE | CAPACITY | HYBRID
  const [os, setOs]         = useState("ALL");  // ALL | ONTAP | SANTRICITY
  const scrollerRef = useRef(null);
  const [canL, setCanL] = useState(false);
  const [canR, setCanR] = useState(true);

  const filtered = useMemo(() => {
    return NETAPP_MODELS.filter((m) => {
      if (proto  !== "ALL" && getProtocol(m) !== proto)   return false;
      if (mclass !== "ALL" && getMClass(m)  !== mclass)   return false;
      if (os     !== "ALL" && getOS(m)      !== os)       return false;
      return true;
    });
  }, [proto, mclass, os]);

  /* Counts for chip badges — every counter respects the OTHER two active filters (crossed) */
  const counts = useMemo(() => {
    const c = {
      proto:  { ALL: 0, SAN: 0, UNIFIED: 0 },
      mclass: { ALL: 0, PERFORMANCE: 0, CAPACITY: 0, HYBRID: 0 },
      os:     { ALL: 0, ONTAP: 0, SANTRICITY: 0 },
    };
    NETAPP_MODELS.forEach((m) => {
      const p = getProtocol(m), t = getMClass(m), o = getOS(m);
      if ((mclass === "ALL" || t === mclass) && (os === "ALL" || o === os)) {
        c.proto.ALL++;
        c.proto[p]++;
      }
      if ((proto === "ALL" || p === proto) && (os === "ALL" || o === os)) {
        c.mclass.ALL++;
        c.mclass[t]++;
      }
      if ((proto === "ALL" || p === proto) && (mclass === "ALL" || t === mclass)) {
        c.os.ALL++;
        c.os[o]++;
      }
    });
    return c;
  }, [proto, mclass, os]);

  const updateArrows = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanL(el.scrollLeft > 8);
    setCanR(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, []);

  // Reset scroll to left when filter changes
  useEffect(() => {
    const el = scrollerRef.current;
    if (el) el.scrollTo({ left: 0, behavior: "smooth" });
    setTimeout(updateArrows, 350);
  }, [proto, mclass, os]);

  const scroll = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    const step = Math.round(el.clientWidth * 0.7);
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const resetFilters = () => { setProto("ALL"); setMclass("ALL"); setOs("ALL"); };
  const anyActive = proto !== "ALL" || mclass !== "ALL" || os !== "ALL";

  return (
    <main data-testid="netapp-portfolio-main" className="npv2">
      <Navbar />

      {/* HERO SLIDER — 4 rodziny z auto-rotacją */}
      <HeroSlider />

      {/* FILTERS + SCROLLER — jedna sekcja */}
      <section className="npv2-onerow" data-testid="npv2-onerow" id="npv2-onerow">
        <div className="npv2-onerow__inner">
          <div className="npv2-filters">
            <FilterGroup
              label="Protokół"
              testid="npv2-filter-proto"
              active={proto}
              onChange={setProto}
              options={[
                { value: "ALL",     label: "Wszystkie", count: counts.proto.ALL, color: "#0C5C62" },
                { value: "SAN",     label: "SAN",       count: counts.proto.SAN,     color: PROTOCOL_META.SAN.color,     icon: <Shield size={14} /> },
                { value: "UNIFIED", label: "Unified",   count: counts.proto.UNIFIED, color: PROTOCOL_META.UNIFIED.color, icon: <Layers size={14} /> },
              ]}
            />

            <FilterGroup
              label="Warstwa"
              testid="npv2-filter-mclass"
              active={mclass}
              onChange={setMclass}
              options={[
                { value: "ALL",         label: "Wszystkie",         count: counts.mclass.ALL,         color: "#0C5C62" },
                { value: "PERFORMANCE", label: "Flash Performance", count: counts.mclass.PERFORMANCE, color: MCLASS_META.PERFORMANCE.color, icon: <Zap size={14} /> },
                { value: "CAPACITY",    label: "Capacity Flash",    count: counts.mclass.CAPACITY,    color: MCLASS_META.CAPACITY.color,    icon: <Database size={14} /> },
                { value: "HYBRID",      label: "Hybrid",            count: counts.mclass.HYBRID,      color: MCLASS_META.HYBRID.color,      icon: <HardDrive size={14} /> },
              ]}
            />

            <FilterGroup
              label="System"
              testid="npv2-filter-os"
              active={os}
              onChange={setOs}
              options={[
                { value: "ALL",        label: "Wszystkie", count: counts.os.ALL,        color: "#0C5C62" },
                { value: "ONTAP",      label: "ONTAP",     count: counts.os.ONTAP,      color: OS_META.ONTAP.color,      icon: <Layers size={14} /> },
                { value: "SANTRICITY", label: "SANtricity",count: counts.os.SANTRICITY, color: OS_META.SANTRICITY.color, icon: <Cpu size={14} /> },
              ]}
            />

            {anyActive && (
              <button
                className="sc-btn-ghost sc-btn-ghost--light"
                onClick={resetFilters}
                data-testid="npv2-filter-reset"
              >
                <X size={14} /> Wyczyść filtry
              </button>
            )}
          </div>

          {/* Active filter summary + scroll controls */}
          <div className="npv2-onerow__head">
            <div className="npv2-onerow__summary">
              <span className="npv2-onerow__count" data-testid="npv2-result-count">
                {filtered.length} {filtered.length === 1 ? "model" : filtered.length < 5 ? "modele" : "modeli"}
              </span>
              {proto !== "ALL" && (
                <span className="npv2-onerow__badge" style={{ "--tc": PROTOCOL_META[proto].color }}>
                  {PROTOCOL_META[proto].label}
                </span>
              )}
              {mclass !== "ALL" && (
                <span className="npv2-onerow__badge" style={{ "--tc": MCLASS_META[mclass].color }}>
                  {MCLASS_META[mclass].label}
                </span>
              )}
              {os !== "ALL" && (
                <span className="npv2-onerow__badge" style={{ "--tc": OS_META[os].color }}>
                  {OS_META[os].label}
                </span>
              )}
            </div>

            <div className="npv2-fam__ctrls">
              <button
                className="npv2-fam__ctrl"
                onClick={() => scroll(-1)}
                disabled={!canL}
                aria-label="Przewiń w lewo"
                data-testid="npv2-scroll-left"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                className="npv2-fam__ctrl"
                onClick={() => scroll(1)}
                disabled={!canR}
                aria-label="Przewiń w prawo"
                data-testid="npv2-scroll-right"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="npv2-scroller-wrap">
            {filtered.length === 0 ? (
              <div className="npv2-empty" data-testid="npv2-empty">
                <p>Brak modeli dla wybranej kombinacji filtrów.</p>
                <button className="sc-btn-ghost sc-btn-ghost--light" onClick={resetFilters}>
                  <X size={14} /> Wyczyść filtry
                </button>
              </div>
            ) : (
              <div className="npv2-scroller" ref={scrollerRef} data-testid="npv2-scroller">
                {filtered.map((m) => (
                  <ModelCard key={m.id} model={m} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION: KIEDY WYBRAĆ RODZINĘ */}
      <FamilyGuideSection />

      {/* SECTION: ONTAP vs SANtricity */}
      <OSCompareSection />

      {/* SECTION: KONFIGURATOR (8 pytań → rekomendacja) */}
      <NetAppConfigurator />

      {/* SUMMARY */}
      <section className="npv2-summary" data-testid="npv2-summary" id="npv2-summary">
        <Reveal>
          <NpHeader
            center
            label="Jak wybrać"
            title="Trzy osie"
            accent="decyzji."
            sub="Protokół, warstwa i system — reszta to szczegóły modelu."
            tag="npv2-summary-header"
          />
        </Reveal>

        <div className="npv2-axes npv2-axes--3">
          {/* Axis 1: Protocol */}
          <Reveal delay={80}>
            <div className="npv2-axis" data-testid="npv2-axis-proto">
              <h3 className="npv2-axis__title">Protokół</h3>
              <div className="npv2-axis__grid">
                {Object.entries(PROTOCOL_META).map(([k, v]) => (
                  <Tilt key={k} max={4} className="npv2-axis__card" style={{ "--tc": v.color }}>
                    <div className="npv2-axis__ico">
                      {k === "SAN" ? <Shield size={20} /> : <Layers size={20} />}
                    </div>
                    <strong>{v.label}</strong>
                    <p>{v.sub}</p>
                  </Tilt>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Axis 2: Media class */}
          <Reveal delay={160}>
            <div className="npv2-axis" data-testid="npv2-axis-mclass">
              <h3 className="npv2-axis__title">Warstwa wydajności</h3>
              <div className="npv2-axis__grid">
                {Object.entries(MCLASS_META).map(([k, v]) => (
                  <Tilt key={k} max={4} className="npv2-axis__card" style={{ "--tc": v.color }}>
                    <div className="npv2-axis__ico">
                      {k === "PERFORMANCE" ? <Zap size={20} /> : k === "CAPACITY" ? <Database size={20} /> : <HardDrive size={20} />}
                    </div>
                    <strong>{v.label}</strong>
                    <p>{v.desc}</p>
                  </Tilt>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Axis 3: OS */}
          <Reveal delay={240}>
            <div className="npv2-axis" data-testid="npv2-axis-os">
              <h3 className="npv2-axis__title">System operacyjny</h3>
              <div className="npv2-axis__grid">
                {Object.entries(OS_META).map(([k, v]) => (
                  <Tilt key={k} max={4} className="npv2-axis__card" style={{ "--tc": v.color }}>
                    <div className="npv2-axis__ico">
                      {k === "ONTAP" ? <Layers size={20} /> : <Cpu size={20} />}
                    </div>
                    <strong>{v.label}</strong>
                    <p>{v.desc}</p>
                  </Tilt>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Kontakt />
    </main>
  );
};

export default NetAppPortfolioPage;
