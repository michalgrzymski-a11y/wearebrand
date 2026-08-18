import React, { useRef, useState, useEffect, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Kontakt from "@/components/sections/Kontakt";
import { NETAPP_MODELS, NETAPP_FAMILIES } from "@/data/netappModels";
import {
  Zap, Database, HardDrive, Server, ArrowRight,
  ChevronLeft, ChevronRight, Shield, Rocket, X, Layers,
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

const getProtocol = (m) => PROTOCOL_BY_FAMILY[m.family];
const getMClass  = (m) => MCLASS_OVERRIDE[m.id] || MCLASS_BY_FAMILY[m.family];

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

/* ---------- Model card ---------- */
const ModelCard = ({ model }) => {
  const fam = NETAPP_FAMILIES[model.family];
  const hasRear = Boolean(model.imgRear);
  const proto = PROTOCOL_META[getProtocol(model)];
  const mclass = MCLASS_META[getMClass(model)];

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

/* ---------- Main page ---------- */
const NetAppPortfolioPage = () => {
  const [proto, setProto]   = useState("ALL");  // ALL | SAN | UNIFIED
  const [mclass, setMclass] = useState("ALL");  // ALL | PERFORMANCE | CAPACITY | HYBRID
  const scrollerRef = useRef(null);
  const [canL, setCanL] = useState(false);
  const [canR, setCanR] = useState(true);

  const filtered = useMemo(() => {
    return NETAPP_MODELS.filter((m) => {
      if (proto  !== "ALL" && getProtocol(m) !== proto)   return false;
      if (mclass !== "ALL" && getMClass(m)  !== mclass)   return false;
      return true;
    });
  }, [proto, mclass]);

  /* Counts for chip badges */
  const counts = useMemo(() => {
    const c = { proto: { ALL: 0, SAN: 0, UNIFIED: 0 },
                mclass:{ ALL: 0, PERFORMANCE: 0, CAPACITY: 0, HYBRID: 0 } };
    NETAPP_MODELS.forEach((m) => {
      const p = getProtocol(m), t = getMClass(m);
      // Wszystkie liczniki uwzględniają OBECNY drugi filtr (crossed)
      if (mclass === "ALL" || t === mclass) {
        c.proto.ALL++;
        c.proto[p]++;
      }
      if (proto === "ALL" || p === proto) {
        c.mclass.ALL++;
        c.mclass[t]++;
      }
    });
    return c;
  }, [proto, mclass]);

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
  }, [proto, mclass]);

  const scroll = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    const step = Math.round(el.clientWidth * 0.7);
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const resetFilters = () => { setProto("ALL"); setMclass("ALL"); };
  const anyActive = proto !== "ALL" || mclass !== "ALL";

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
            <strong>protokół</strong> (SAN vs Unified — Plik/Blok/Obiekt) oraz{" "}
            <strong>warstwę wydajności</strong> (Performance / Capacity / Hybrid),
            a poniżej pokażemy pasujące modele — od entry do flagowych.
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

      {/* SUMMARY / KEY DIFFERENCES */}
      <section className="npv2-summary" data-testid="npv2-summary" id="npv2-summary">
        <header className="npv2-summary__head">
          <span className="npv2-summary__tag">Jak wybrać</span>
          <h2>Dwie osie decyzji</h2>
          <p>Zdecyduj o protokole i warstwie — reszta to szczegóły modelu.</p>
        </header>

        <div className="npv2-axes">
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
        </div>
      </section>

      <Kontakt />
    </main>
  );
};

export default NetAppPortfolioPage;
