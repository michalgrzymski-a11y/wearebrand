import React, { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Kontakt from "@/components/sections/Kontakt";
import { NETAPP_MODELS, NETAPP_FAMILIES } from "@/data/netappModels";
import {
  Server, Zap, Layers, Gauge, Database, ArrowRight,
  Cpu, HardDrive, Network, Timer, Boxes,
} from "lucide-react";

/**
 * NetAppPortfolioPage — /netapp-portfolio
 * Wizualne porównanie portfolio: AFF Performance / C-Series Capacity Flash / FAS Hybrid.
 * Dwa poziomy:
 *   1) Szczegółowe karty modeli (dane z /data/netappModels.js)
 *   2) Podsumowanie porównawcze rodzin — jedna prosta wizualizacja
 */

const FAMILY_ICON = {
  AFF:    <Zap size={20} />,
  CFLASH: <Database size={20} />,
  FAS:    <HardDrive size={20} />,
};

/* Wizualne kafelki dysków w macierzy — pokazuje symbolicznie ilość i typ */
const DriveVisualization = ({ model }) => {
  const count = Math.min(48, Math.max(6, Math.round(model.presetDisks / (model.presetDisks > 48 ? 6 : 1))));
  const isFlash = model.family !== "FAS";
  return (
    <div className="np-drives" aria-hidden="true" data-testid={`np-drives-${model.id}`}>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={`np-drive np-drive--${isFlash ? "flash" : "hdd"}`}
          style={{ animationDelay: `${i * 40}ms` }}
        />
      ))}
    </div>
  );
};

/* Duża karta modelu */
const ModelCard = ({ model }) => {
  const fam = NETAPP_FAMILIES[model.family];
  return (
    <article
      className="np-card"
      data-testid={`np-model-${model.id}`}
      style={{ "--fam": fam.accent }}
    >
      <header className="np-card__head">
        <div className="np-card__id">
          <span className="np-card__fam">{fam.short}</span>
          <span className="np-card__tier">{model.tier}</span>
          <span className="np-card__chassis">{model.chassis}</span>
        </div>
        <h3 className="np-card__name">{model.name}</h3>
        <p className="np-card__tagline">{model.tagline}</p>
      </header>

      <DriveVisualization model={model} />

      <ul className="np-specs">
        <li><HardDrive size={14} /><span>Dyski</span><em>{model.drives}</em></li>
        <li><Boxes size={14} /><span>Max dysków</span><em>{model.maxDrives}</em></li>
        <li><Database size={14} /><span>Max pojemność efekt.</span><em>{model.maxCapEff}</em></li>
        <li><Gauge size={14} /><span>Przepustowość</span><em>{model.maxThroughput}</em></li>
        <li><Timer size={14} /><span>Latencja</span><em>{model.latency}</em></li>
        <li><Cpu size={14} /><span>CPU / RAM</span><em>{model.cpu} · {model.ram}</em></li>
        <li><Network size={14} /><span>Porty</span><em>{model.ports}</em></li>
      </ul>

      <footer className="np-card__foot">
        <span className="np-card__highlight-label">Wyróżnik</span>
        <p className="np-card__highlight">{model.highlight}</p>
      </footer>
    </article>
  );
};

/* Rodzinowa sekcja — nagłówek + karty */
const FamilySection = ({ family }) => {
  const models = NETAPP_MODELS.filter((m) => m.family === family.key);
  return (
    <section
      className={`np-family np-family--${family.key.toLowerCase()}`}
      data-testid={`np-family-${family.key}`}
      id={`family-${family.key.toLowerCase()}`}
      style={{ "--fam": family.accent }}
    >
      <header className="np-family__head">
        <div className="np-family__icon">{FAMILY_ICON[family.key]}</div>
        <div>
          <h2 className="np-family__title">{family.label}</h2>
          <p className="np-family__sub">
            {family.key === "AFF"    && "Wysoka wydajność NVMe dla krytycznych workloadów, VMware, baz danych i analityki."}
            {family.key === "CFLASH" && "Capacity flash QLC — pojemność jak HDD, opóźnienia jak SSD. Backup, archive, secondary storage."}
            {family.key === "FAS"    && "Hybrydowe macierze z HDD + cache flash. Ekonomiczna konsolidacja file/block przy dużej skali."}
          </p>
        </div>
      </header>

      <div className="np-family__grid">
        {models.map((m) => <ModelCard key={m.id} model={m} />)}
      </div>
    </section>
  );
};

/* Podsumowanie porównawcze — jedna prosta wizualizacja rodzin obok siebie */
const FamilySummary = () => {
  const rows = [
    { label: "Warstwa dysków",         AFF: "NVMe SSD (TLC)",     CFLASH: "NVMe QLC",             FAS: "HDD + SSD cache" },
    { label: "Latencja",                AFF: "< 500 μs",           CFLASH: "1-2 ms",               FAS: "3-8 ms" },
    { label: "IOPS (relatywnie)",       AFF: "★★★★★",              CFLASH: "★★★☆☆",                FAS: "★★☆☆☆" },
    { label: "Cena / TB",               AFF: "★★★★★ (wysoka)",     CFLASH: "★★★☆☆ (średnia)",      FAS: "★☆☆☆☆ (najniższa)" },
    { label: "Pojemność max",           AFF: "do 100 PB",          CFLASH: "do 45 PB",             FAS: "do 100 PB" },
    { label: "Zużycie energii / TB",    AFF: "niskie",             CFLASH: "bardzo niskie",        FAS: "wysokie" },
    { label: "Typowe zastosowanie",     AFF: "Produkcja, VMware, DB, AI/ML", CFLASH: "Backup, archive, cyber-vault", FAS: "File-share, secondary, media library" },
    { label: "Snapshoty / SnapMirror",  AFF: "✓ pełne ONTAP",      CFLASH: "✓ pełne ONTAP",        FAS: "✓ pełne ONTAP" },
    { label: "Zalety",                  AFF: "Najwyższa wydajność, min. latencja", CFLASH: "Flash w cenie HDD, energooszczędność", FAS: "Najniższy koszt / TB przy dużej skali" },
  ];
  return (
    <section className="np-summary" data-testid="np-summary">
      <header className="np-summary__head">
        <span className="np-summary__tag">Porównanie rodzin · Podsumowanie</span>
        <h2>Trzy rodziny, jedno spojrzenie</h2>
        <p>Krótkie zestawienie do decyzji: Performance vs Capacity vs Hybrid.</p>
      </header>

      <div className="np-summary__grid" role="table">
        <div className="np-summary__col np-summary__col--label" role="rowgroup">
          <div className="np-summary__cell np-summary__cell--head">&nbsp;</div>
          {rows.map((r, i) => (
            <div key={i} className="np-summary__cell np-summary__cell--label">{r.label}</div>
          ))}
        </div>

        {[
          { key: "AFF",    fam: NETAPP_FAMILIES.AFF,    icon: <Zap size={20}/>,      title: "AFF Performance" },
          { key: "CFLASH", fam: NETAPP_FAMILIES.CFLASH, icon: <Database size={20}/>, title: "C-Series Capacity" },
          { key: "FAS",    fam: NETAPP_FAMILIES.FAS,    icon: <HardDrive size={20}/>,title: "FAS Hybrid" },
        ].map((col) => (
          <div key={col.key} className="np-summary__col" role="rowgroup" style={{ "--fam": col.fam.accent }}>
            <div className="np-summary__cell np-summary__cell--head">
              <span className="np-summary__col-icon">{col.icon}</span>
              <strong>{col.title}</strong>
            </div>
            {rows.map((r, i) => (
              <div key={i} className="np-summary__cell">{r[col.key]}</div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

/* Sticky filter — wybór rodziny */
const FamilyFilter = ({ active, onChange }) => (
  <div className="np-filter" data-testid="np-family-filter">
    {[
      { key: "ALL",    label: "Wszystkie" },
      { key: "AFF",    label: NETAPP_FAMILIES.AFF.label },
      { key: "CFLASH", label: NETAPP_FAMILIES.CFLASH.label },
      { key: "FAS",    label: NETAPP_FAMILIES.FAS.label },
    ].map((f) => (
      <button
        key={f.key}
        className={`np-filter__btn ${active === f.key ? "is-active" : ""}`}
        onClick={() => onChange(f.key)}
        data-testid={`np-filter-${f.key}`}
      >
        {f.label}
      </button>
    ))}
  </div>
);

const NetAppPortfolioPage = () => {
  const [filter, setFilter] = useState("ALL");
  const families = useMemo(() => {
    if (filter === "ALL") return [NETAPP_FAMILIES.AFF, NETAPP_FAMILIES.CFLASH, NETAPP_FAMILIES.FAS];
    return [NETAPP_FAMILIES[filter]];
  }, [filter]);

  return (
    <main data-testid="netapp-portfolio-main" className="sc-app np-page">
      <Navbar />

      <section className="np-hero">
        <div className="np-hero__inner">
          <span className="np-hero__tag">NetApp · Portfolio 2026</span>
          <h1 className="np-hero__title">
            Trzy rodziny macierzy, jedno <span className="np-hero__accent">ONTAP</span>
          </h1>
          <p className="np-hero__sub">
            Kompletne portfolio NetApp w jednym miejscu: <strong>AFF</strong> dla ekstremalnej wydajności,
            <strong> C-Series</strong> dla capacity flash i <strong>FAS</strong> dla hybrydowej ekonomii skali.
            Wybierz rodzinę żeby zobaczyć szczegóły modeli, lub zjedź niżej aby zobaczyć podsumowanie.
          </p>

          <div className="np-hero__jump">
            <a href="#family-aff"    className="np-hero__jump-item" style={{ "--fam": NETAPP_FAMILIES.AFF.accent }}>
              <Zap size={16}/> Performance
            </a>
            <a href="#family-cflash" className="np-hero__jump-item" style={{ "--fam": NETAPP_FAMILIES.CFLASH.accent }}>
              <Database size={16}/> Capacity Flash
            </a>
            <a href="#family-fas"    className="np-hero__jump-item" style={{ "--fam": NETAPP_FAMILIES.FAS.accent }}>
              <HardDrive size={16}/> Hybrid
            </a>
            <a href="#summary" className="np-hero__jump-item np-hero__jump-item--summary">
              <Layers size={16}/> Podsumowanie <ArrowRight size={14}/>
            </a>
          </div>
        </div>
      </section>

      <FamilyFilter active={filter} onChange={setFilter} />

      <div className="np-list">
        {families.map((f) => <FamilySection key={f.key} family={f} />)}
      </div>

      <div id="summary"><FamilySummary /></div>

      <Kontakt />
    </main>
  );
};

export default NetAppPortfolioPage;
