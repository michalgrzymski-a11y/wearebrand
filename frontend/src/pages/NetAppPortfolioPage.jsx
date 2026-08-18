import React, { useRef, useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Kontakt from "@/components/sections/Kontakt";
import { NETAPP_MODELS, NETAPP_FAMILIES } from "@/data/netappModels";
import {
  Zap, Database, HardDrive, Server, Cpu, ArrowRight,
  ChevronLeft, ChevronRight, Shield, Rocket,
} from "lucide-react";
import "./NetAppPortfolioPage.css";

/**
 * NetAppPortfolioPage — /netapp-portfolio
 * Poziomy scroll per rodzina + duże assety front/rear (hover flip).
 * Styl: light "Cyan Core" spójny ze stroną główną.
 */

const FAMILY_ICON = {
  AFF:      <Zap size={20} />,
  ASA:      <Shield size={20} />,
  CFLASH:   <Database size={20} />,
  FAS:      <HardDrive size={20} />,
  ESERIES:  <Server size={20} />,
  EFSERIES: <Rocket size={20} />,
};

const FAMILY_ORDER = ["AFF", "ASA", "CFLASH", "FAS", "EFSERIES", "ESERIES"];

/* ---------- Model card ---------- */
const ModelCard = ({ model }) => {
  const fam = NETAPP_FAMILIES[model.family];
  const hasRear = Boolean(model.imgRear);
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

/* ---------- Family row with horizontal scroll ---------- */
const FamilyRow = ({ family }) => {
  const scrollerRef = useRef(null);
  const [canL, setCanL] = useState(false);
  const [canR, setCanR] = useState(true);

  const models = NETAPP_MODELS.filter((m) => m.family === family.key);

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

  const scroll = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    const step = Math.round(el.clientWidth * 0.7);
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section
      className="npv2-fam"
      id={`fam-${family.key.toLowerCase()}`}
      data-testid={`npv2-family-${family.key}`}
      style={{ "--fam": family.accent }}
    >
      <header className="npv2-fam__head">
        <div className="npv2-fam__title-wrap">
          <div className="npv2-fam__icon" style={{ "--fam": family.accent, color: family.accent }}>
            {FAMILY_ICON[family.key]}
          </div>
          <div>
            <h2 className="npv2-fam__title">
              {family.label.split("·")[0].trim()}{" "}
              <span className="npv2-fam__title-accent" style={{ color: family.accent }}>
                · {family.label.split("·")[1].trim()}
              </span>
            </h2>
            <p className="npv2-fam__sub">{family.desc}</p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
          <span className="npv2-fam__count">{models.length} {models.length === 1 ? "model" : "modeli"}</span>
          <div className="npv2-fam__ctrls">
            <button
              className="npv2-fam__ctrl"
              onClick={() => scroll(-1)}
              disabled={!canL}
              aria-label="Przewiń w lewo"
              data-testid={`npv2-scroll-left-${family.key}`}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              className="npv2-fam__ctrl"
              onClick={() => scroll(1)}
              disabled={!canR}
              aria-label="Przewiń w prawo"
              data-testid={`npv2-scroll-right-${family.key}`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="npv2-scroller-wrap">
        <div className="npv2-scroller" ref={scrollerRef} data-testid={`npv2-scroller-${family.key}`}>
          {models.map((m) => (
            <ModelCard key={m.id} model={m} />
          ))}
        </div>
      </div>
    </section>
  );
};

/* ---------- Summary comparison ---------- */
const FamilySummary = () => {
  const rows = [
    { label: "Warstwa",           AFF: "NVMe TLC",    ASA: "NVMe TLC (SAN)", CFLASH: "NVMe QLC",    FAS: "HDD + SSD cache", ESERIES: "HDD/SAS", EFSERIES: "NVMe SSD" },
    { label: "Latencja",          AFF: "< 500 μs",    ASA: "< 500 μs",       CFLASH: "1-2 ms",       FAS: "3-8 ms",           ESERIES: "1-6 ms",  EFSERIES: "< 100 μs" },
    { label: "IOPS",              AFF: "★★★★★",       ASA: "★★★★★",         CFLASH: "★★★☆☆",       FAS: "★★☆☆☆",           ESERIES: "★★☆☆☆",  EFSERIES: "★★★★★" },
    { label: "Cena / TB",         AFF: "★★★★★",       ASA: "★★★★☆",         CFLASH: "★★★☆☆",       FAS: "★★☆☆☆",           ESERIES: "★★☆☆☆",  EFSERIES: "★★★★★" },
    { label: "Max pojemność",     AFF: "100 PB",      ASA: "100 PB",         CFLASH: "45 PB",        FAS: "100 PB",           ESERIES: "9.6 PB",  EFSERIES: "3 PB" },
    { label: "System",            AFF: "ONTAP",       ASA: "ONTAP (SAN)",    CFLASH: "ONTAP",        FAS: "ONTAP",            ESERIES: "SANtricity", EFSERIES: "SANtricity" },
    { label: "Zastosowanie",      AFF: "VMware, DB, AI/ML",    ASA: "Block-only, DB",   CFLASH: "Backup, archive",     FAS: "File-share, media",  ESERIES: "HPC, video, OT", EFSERIES: "HPC, trading" },
  ];

  const cols = [
    { key: "AFF",      title: "AFF",     sub: "Performance" },
    { key: "ASA",      title: "ASA",     sub: "SAN Flash" },
    { key: "CFLASH",   title: "C-Series",sub: "Capacity" },
    { key: "FAS",      title: "FAS",     sub: "Hybrid" },
    { key: "EFSERIES", title: "EF",      sub: "SAN NVMe" },
    { key: "ESERIES",  title: "E",       sub: "Block SAN" },
  ];

  return (
    <section className="npv2-summary" data-testid="npv2-summary" id="npv2-summary">
      <header className="npv2-summary__head">
        <span className="npv2-summary__tag">Porównanie rodzin</span>
        <h2>Sześć rodzin, jedno spojrzenie</h2>
        <p>Krótkie zestawienie do decyzji: Performance vs Capacity vs Hybrid vs SAN.</p>
      </header>

      <div className="npv2-summary__grid" role="table">
        <div className="npv2-summary__cell npv2-summary__cell--head">&nbsp;</div>
        {cols.map((c) => (
          <div key={c.key} className="npv2-summary__cell npv2-summary__cell--head">
            <span className="fam-icon" style={{ "--fam": NETAPP_FAMILIES[c.key].accent, color: NETAPP_FAMILIES[c.key].accent }}>
              {FAMILY_ICON[c.key]}<strong>{c.title}</strong>
            </span>
            <span style={{ fontSize: 11, opacity: 0.7, fontWeight: 500 }}>{c.sub}</span>
          </div>
        ))}

        {rows.map((r, i) => (
          <React.Fragment key={i}>
            <div className="npv2-summary__cell npv2-summary__cell--label">{r.label}</div>
            {cols.map((c) => (
              <div key={c.key} className="npv2-summary__cell">{r[c.key]}</div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

/* ---------- Main page ---------- */
const NetAppPortfolioPage = () => {
  const orderedFamilies = FAMILY_ORDER.map((k) => NETAPP_FAMILIES[k]);

  return (
    <main data-testid="netapp-portfolio-main" className="npv2">
      <Navbar />

      {/* HERO */}
      <section className="npv2-hero">
        <div className="npv2__bg" aria-hidden="true" />
        <div className="npv2-hero__inner">
          <div className="npv2-hero__label">NetApp · Portfolio 2026</div>
          <h1 className="npv2-hero__title">
            Sześć rodzin macierzy,{" "}
            <span className="npv2-hero__grad">jedno ONTAP</span>
            <br />
            i jeden dostawca.
          </h1>
          <p className="npv2-hero__sub">
            Kompletne portfolio NetApp: <strong>AFF</strong> i <strong>ASA</strong> dla ekstremalnej
            wydajności, <strong>C-Series</strong> dla capacity flash, <strong>FAS</strong> dla hybrydowej
            ekonomii skali, oraz <strong>E/EF-Series</strong> dedykowane SAN dla HPC i OT.
            Wybierz rodzinę żeby zobaczyć szczegóły, lub zjedź niżej do podsumowania.
          </p>

          <div className="npv2-jump">
            {orderedFamilies.map((f) => (
              <a
                key={f.key}
                href={`#fam-${f.key.toLowerCase()}`}
                className="npv2-jump__item"
                style={{ "--fam": f.accent }}
                data-testid={`npv2-jump-${f.key}`}
              >
                {FAMILY_ICON[f.key]} {f.short} · {f.label.split("·")[1].trim()}
              </a>
            ))}
            <a
              href="#npv2-summary"
              className="npv2-jump__item"
              style={{ "--fam": "#0C5C62" }}
              data-testid="npv2-jump-summary"
            >
              Porównanie <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* FAMILY ROWS */}
      {orderedFamilies.map((f) => (
        <FamilyRow key={f.key} family={f} />
      ))}

      {/* SUMMARY */}
      <FamilySummary />

      <Kontakt />
    </main>
  );
};

export default NetAppPortfolioPage;
