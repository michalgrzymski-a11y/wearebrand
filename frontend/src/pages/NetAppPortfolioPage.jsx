import React, { useRef, useState, useEffect, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Kontakt from "@/components/sections/Kontakt";
import { NETAPP_MODELS, NETAPP_FAMILIES } from "@/data/netappModels";
import {
  Zap, Database, HardDrive, Server, ArrowRight,
  ChevronLeft, ChevronRight, Shield, Rocket, X, Layers, Cpu,
} from "lucide-react";
import "./NetAppPortfolioPage.css";

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
    <article
      className="npv2-card"
      data-testid={`npv2-model-${model.id}`}
      style={{ "--fam": fam.accent }}
    >
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
    </article>
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
        style={{ width: `${(level / 5) * 100}%`, background: color }}
      />
    </div>
    <span className="npv2-fg__bar-val">{level}/5</span>
  </div>
);

const FamilyGuideSection = () => (
  <section className="npv2-fg" data-testid="npv2-family-guide" id="npv2-family-guide">
    <div className="npv2-fg__inner">
      <header className="npv2-fg__head">
        <span className="npv2-summary__tag">Rodziny NetApp · kiedy wybrać</span>
        <h2>AFF, C-Series, FAS czy E-Series?</h2>
        <p>Cztery rodziny, cztery różne odpowiedzi. Sprawdź gdzie każda z nich świeci najjaśniej — i gdzie lepiej wybrać inną.</p>
      </header>

      <div className="npv2-fg__grid">
        {FAMILY_GUIDE.map((f) => {
          const fam = NETAPP_FAMILIES[f.key];
          return (
            <article
              key={f.key}
              className="npv2-fg__card"
              style={{ "--tc": f.color }}
              data-testid={`npv2-fg-card-${f.key}`}
            >
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
            </article>
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
      <header className="npv2-fg__head">
        <span className="npv2-summary__tag">System operacyjny</span>
        <h2>ONTAP vs SANtricity</h2>
        <p>Dwa różne systemy operacyjne NetApp — dwie różne filozofie. Wybór OS jest równie ważny co wybór macierzy.</p>
      </header>

      <div className="npv2-osc__grid">
        {/* ONTAP */}
        <article className="npv2-osc__card npv2-osc__card--ontap" data-testid="npv2-osc-ontap">
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
        </article>

        {/* SANtricity */}
        <article className="npv2-osc__card npv2-osc__card--santricity" data-testid="npv2-osc-santricity">
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
        </article>
      </div>

      {/* Table */}
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
    </div>
  </section>
);

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

      {/* HERO */}
      <section className="npv2-hero">
        <div className="npv2__bg" aria-hidden="true" />
        <div className="npv2-hero__inner">
          <div className="npv2-hero__label">NetApp · Portfolio 2026</div>
          <h1 className="npv2-hero__title">
            Całe portfolio NetApp,{" "}
            <span className="npv2-hero__grad">jeden filtr</span>
            <br />
            i jeden dostawca.
          </h1>
          <p className="npv2-hero__sub">
            Wszystkie macierze NetApp w jednej sekcji. Wybierz{" "}
            <strong>protokół</strong> (SAN vs Unified — Plik/Blok/Obiekt),{" "}
            <strong>warstwę wydajności</strong> (Performance / Capacity / Hybrid) oraz{" "}
            <strong>system operacyjny</strong> (ONTAP / SANtricity),
            a poniżej pokażemy pasujące modele.
          </p>
        </div>
      </section>

      {/* FILTERS + SCROLLER — jedna sekcja */}
      <section className="npv2-onerow" data-testid="npv2-onerow">
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
                className="npv2-filters__reset"
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
                <button className="npv2-filters__reset" onClick={resetFilters}>
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

      {/* SUMMARY / KEY DIFFERENCES */}
      <section className="npv2-summary" data-testid="npv2-summary" id="npv2-summary">
        <header className="npv2-summary__head">
          <span className="npv2-summary__tag">Jak wybrać</span>
          <h2>Trzy osie decyzji</h2>
          <p>Protokół, warstwa i system — reszta to szczegóły modelu.</p>
        </header>

        <div className="npv2-axes npv2-axes--3">
          {/* Axis 1: Protocol */}
          <div className="npv2-axis" data-testid="npv2-axis-proto">
            <h3 className="npv2-axis__title">Protokół</h3>
            <div className="npv2-axis__grid">
              {Object.entries(PROTOCOL_META).map(([k, v]) => (
                <div key={k} className="npv2-axis__card" style={{ "--tc": v.color }}>
                  <div className="npv2-axis__ico">
                    {k === "SAN" ? <Shield size={20} /> : <Layers size={20} />}
                  </div>
                  <strong>{v.label}</strong>
                  <p>{v.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Axis 2: Media class */}
          <div className="npv2-axis" data-testid="npv2-axis-mclass">
            <h3 className="npv2-axis__title">Warstwa wydajności</h3>
            <div className="npv2-axis__grid">
              {Object.entries(MCLASS_META).map(([k, v]) => (
                <div key={k} className="npv2-axis__card" style={{ "--tc": v.color }}>
                  <div className="npv2-axis__ico">
                    {k === "PERFORMANCE" ? <Zap size={20} /> : k === "CAPACITY" ? <Database size={20} /> : <HardDrive size={20} />}
                  </div>
                  <strong>{v.label}</strong>
                  <p>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Axis 3: OS */}
          <div className="npv2-axis" data-testid="npv2-axis-os">
            <h3 className="npv2-axis__title">System operacyjny</h3>
            <div className="npv2-axis__grid">
              {Object.entries(OS_META).map(([k, v]) => (
                <div key={k} className="npv2-axis__card" style={{ "--tc": v.color }}>
                  <div className="npv2-axis__ico">
                    {k === "ONTAP" ? <Layers size={20} /> : <Cpu size={20} />}
                  </div>
                  <strong>{v.label}</strong>
                  <p>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Kontakt />
    </main>
  );
};

export default NetAppPortfolioPage;
