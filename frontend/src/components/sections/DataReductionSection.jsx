import React, { useMemo, useState } from "react";
import { useLang } from "@/i18n/LanguageContext";
import {
  Server,
  ArrowRight,
  Combine,
  Layers,
  HardDrive,
  Database,
  Hash,
  Calculator,
  RotateCcw,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import useSectionParallax from "@/hooks/useSectionParallax";

/**
 * DataReductionSection — interactive visualization of storage data reduction.
 *   • 3-lane pipeline: raw blocks → compressed → deduplicated
 *   • Two live sliders (compression + dedupe ratios) drive the animation:
 *       – compression ratio changes the visible block width in the "comp" lane
 *       – dedupe ratio changes how many blocks in the "dedup" lane fall out as
 *         duplicates (dropping down into the dedupe DB)
 *   • Storage cost calculator on the side takes a raw-write TB figure and
 *     shows the physical write, savings %, and TB saved based on the same ratios.
 */

// Base data stream — 12 blocks, coloured by content. `c` is the "content id"
// (same colour ⇒ same data ⇒ candidate for dedupe).
// This distribution roughly matches a typical enterprise mix so that when
// dedupeRatio ≈ 5, ~80 % of blocks are duplicates.
const STREAM_BASE = [
  { c: "a" },
  { c: "b" },
  { c: "a" },
  { c: "c" },
  { c: "b" },
  { c: "d" },
  { c: "a" },
  { c: "e" },
  { c: "c" },
  { c: "b" },
  { c: "f" },
  { c: "a" },
];

const COLOR_MAP = {
  a: "#06FFE0",
  b: "#7CD6FF",
  c: "#FFC02E",
  d: "#FF7ADB",
  e: "#8BFF7C",
  f: "#FF9668",
};

// Defaults chosen so the initial numbers match the previous static values
// (10 TB → 4.2 TB → 0.8 TB, total 12.5:1, savings 92 %).
const DEFAULTS = {
  compression: 2.4,
  dedupe: 5.2,
  rawTB: 10,
};
const LIMITS = {
  compression: { min: 1.0, max: 6.0, step: 0.1 },
  dedupe:      { min: 1.0, max: 10.0, step: 0.1 },
  rawTB:       { min: 1,   max: 1000, step: 1 },
};

const COPY = {
  pl: {
    label: "Storage · Redukcja danych",
    title: "Kompresja i deduplikacja.",
    accent: "Więcej danych, mniej miejsca.",
    subtitle:
      "Zanim blok trafi na dysk, macierz go ściska i porównuje ze wszystkim, co już zapisała. Powtarzające się fragmenty są odkładane jako wskaźniki — realny zapis to ułamek surowej objętości.",
    fromLabel: "Serwer źródłowy",
    toLabel: "Macierz dyskowa",
    stageRaw: "Bloki surowe",
    stageComp: "Kompresja",
    stageDedup: "Deduplikacja",
    controlsHead: "Ustaw wskaźniki na żywo",
    compressionLbl: "Współczynnik kompresji",
    dedupeLbl: "Współczynnik deduplikacji",
    resetBtn: "Reset",
    metricsHead: "Efekt redukcji",
    dbHead: "Baza deduplikacji · hash pointers",
    metricRaw: "Zapis surowy",
    metricComp: "Po kompresji",
    metricFinal: "Po deduplikacji",
    ratio: "Współczynnik całkowity",
    savings: "Zapisujesz tylko",
    calcHead: "Kalkulator zapisu fizycznego",
    calcHint: "Podaj planowany zapis surowy — zobacz, ile realnie trafi na dysk.",
    calcInput: "Zapis surowy (TB)",
    calcPhysical: "Zapis fizyczny",
    calcSaved: "Oszczędność miejsca",
    calcSavedPct: "Redukcja",
    legendRaw: "Surowy blok · 32 KB",
    legendComp: "Skompresowany",
    legendDup: "Duplikat → wskaźnik",
    legendUniq: "Unikatowy → zapis",
  },
  en: {
    label: "Storage · Data reduction",
    title: "Compression and deduplication.",
    accent: "More data, less footprint.",
    subtitle:
      "Before a block hits the disk, the array squeezes it and compares against everything already stored. Repeated fragments are kept as pointers only — the physical write is a fraction of the raw stream.",
    fromLabel: "Source server",
    toLabel: "Storage array",
    stageRaw: "Raw blocks",
    stageComp: "Compression",
    stageDedup: "Deduplication",
    controlsHead: "Adjust ratios live",
    compressionLbl: "Compression ratio",
    dedupeLbl: "Dedupe ratio",
    resetBtn: "Reset",
    metricsHead: "Reduction results",
    dbHead: "Dedupe database · hash pointers",
    metricRaw: "Raw write",
    metricComp: "After compression",
    metricFinal: "After dedupe",
    ratio: "Total reduction ratio",
    savings: "You actually store",
    calcHead: "Physical-write calculator",
    calcHint: "Enter a planned raw write and see how much really lands on disk.",
    calcInput: "Raw write (TB)",
    calcPhysical: "Physical write",
    calcSaved: "Capacity saved",
    calcSavedPct: "Reduction",
    legendRaw: "Raw block · 32 KB",
    legendComp: "Compressed",
    legendDup: "Duplicate → pointer",
    legendUniq: "Unique → stored",
  },
};

// Human-friendly number formatting (locale-aware)
const fmt = (n, digits = 2, lang = "pl") => {
  if (!isFinite(n)) return "—";
  const nf = new Intl.NumberFormat(lang === "en" ? "en-US" : "pl-PL", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
  return nf.format(n);
};
// Nice TB label — auto switches to GB below 1 TB, PB above 1000 TB.
const fmtTB = (tb, lang) => {
  if (!isFinite(tb) || tb < 0) return "—";
  if (tb >= 1000) return `${fmt(tb / 1000, 2, lang)} PB`;
  if (tb < 1)    return `${fmt(tb * 1000, 1, lang)} GB`;
  return `${fmt(tb, 2, lang)} TB`;
};

const DataReductionSection = () => {
  const { lang } = useLang();
  const copy = COPY[lang] || COPY.pl;
  const parallaxRef = useSectionParallax();

  const [compression, setCompression] = useState(DEFAULTS.compression);
  const [dedupe, setDedupe]           = useState(DEFAULTS.dedupe);
  const [rawTB, setRawTB]             = useState(DEFAULTS.rawTB);

  // Number of blocks (out of STREAM_BASE.length) that should be marked as
  // duplicates, based on the current dedupe ratio.
  //   ratio = total / unique  ⇒  unique = total / ratio
  //   duplicates = total − unique
  // With dedupeRatio = 1 → 0 duplicates; with dedupeRatio → ∞ → nearly all duplicates.
  const dupCount = useMemo(() => {
    const total = STREAM_BASE.length;
    const uniq = Math.max(1, Math.round(total / Math.max(1, dedupe)));
    return Math.min(total - 1, total - uniq);
  }, [dedupe]);

  // Deterministic assignment: to keep visuals stable, we always mark the same
  // positions as duplicates as the ratio grows (indices ordered by "how likely
  // this is a repeat in a realistic mix").
  const DUP_ORDER = [2, 4, 6, 9, 11, 8, 3, 5, 7, 10, 1, 0];
  const stream = useMemo(() => {
    const dupSet = new Set(DUP_ORDER.slice(0, dupCount));
    return STREAM_BASE.map((b, i) => ({ ...b, dup: dupSet.has(i) }));
  }, [dupCount]);

  // Compressed-block width scale ∈ [0.16, 1]. Higher compression = narrower block.
  const compScale = Math.max(0.16, Math.min(1, 1 / compression));

  // Derived numbers for the metrics panel
  const totalRatio = compression * dedupe;
  const afterCompTB  = rawTB / Math.max(0.01, compression);
  const afterDedupTB = afterCompTB / Math.max(0.01, dedupe);
  const savedTB      = Math.max(0, rawTB - afterDedupTB);
  const savedPct     = (1 - 1 / totalRatio) * 100;
  const remainingPct = 100 - savedPct;

  // Progress-bar widths for the metrics panel (relative to raw = 100 %)
  const barRaw  = 100;
  const barComp = 100 / Math.max(1, compression);
  const barFinal = 100 / Math.max(1, totalRatio);

  const resetAll = () => {
    setCompression(DEFAULTS.compression);
    setDedupe(DEFAULTS.dedupe);
    setRawTB(DEFAULTS.rawTB);
  };

  // Dedupe DB — top hash entries, refs derived from the stream distribution
  const dbRows = useMemo(() => {
    // Count occurrences per colour among the duplicates
    const counts = {};
    stream.forEach((b) => {
      if (b.dup) counts[b.c] = (counts[b.c] || 0) + 1;
    });
    const HASH = {
      a: "a3f7…9c1e",
      b: "b1c5…22aa",
      c: "9d0e…4f7b",
      d: "e14a…5b02",
      e: "77b3…10cd",
      f: "50fa…88de",
    };
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([k, v]) => ({
        hash: HASH[k],
        refs: `×${v + 1}`,           // +1 because the original also counts
        size: `${(v + 1) * 128} KB`,
      }));
  }, [stream]);

  return (
    <section
      id="data-reduction"
      data-testid="data-reduction-section"
      ref={parallaxRef}
      className="relative w-full overflow-hidden"
      style={{
        background: "#040709",
        color: "#E8F4F5",
        // CSS variables drive the animation in real time
        "--dr-comp-scale": compScale,
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(55% 55% at 30% 30%, rgba(6,255,224,0.06) 0%, rgba(6,255,224,0) 60%)," +
            " radial-gradient(45% 55% at 75% 75%, rgba(124,214,255,0.06) 0%, rgba(124,214,255,0) 60%)",
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
                background: "linear-gradient(135deg,#06FFE0 0%,#7CD6FF 100%)",
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

        {/* Pipeline: server → 3 stages → array */}
        <div className="sc-dr" data-testid="dr-diagram">
          {/* Source: server */}
          <div className="sc-dr__endpoint sc-dr__endpoint--src">
            <div className="sc-dr__endpoint-icon">
              <Server size={26} strokeWidth={1.7} />
            </div>
            <div className="sc-dr__endpoint-name">{copy.fromLabel}</div>
            <div className="sc-dr__endpoint-code">SRV-01 · IO</div>
          </div>

          {/* Pipeline lanes */}
          <div className="sc-dr__pipeline">
            {/* Stage 1: raw blocks */}
            <div className="sc-dr__lane sc-dr__lane--raw" data-testid="dr-lane-raw">
              <div className="sc-dr__lane-head">
                <Layers size={14} strokeWidth={2} />
                <span>{copy.stageRaw}</span>
              </div>
              <div className="sc-dr__track">
                {stream.map((b, i) => (
                  <span
                    key={`raw-${i}`}
                    className="sc-dr__block sc-dr__block--raw"
                    style={{
                      "--bcolor": COLOR_MAP[b.c],
                      animationDelay: `${(i * 0.35).toFixed(2)}s`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Stage 2: compression */}
            <div className="sc-dr__lane sc-dr__lane--comp" data-testid="dr-lane-comp">
              <div className="sc-dr__lane-head">
                <Combine size={14} strokeWidth={2} />
                <span>{copy.stageComp}</span>
                <span className="sc-dr__lane-badge" data-testid="dr-lane-comp-badge">
                  ×{fmt(compression, 1, lang)}
                </span>
              </div>
              <div className="sc-dr__track">
                {stream.map((b, i) => (
                  <span
                    key={`c-${i}`}
                    className="sc-dr__block sc-dr__block--comp"
                    style={{
                      "--bcolor": COLOR_MAP[b.c],
                      animationDelay: `${(i * 0.35 + 0.2).toFixed(2)}s`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Stage 3: dedupe */}
            <div className="sc-dr__lane sc-dr__lane--dedup" data-testid="dr-lane-dedup">
              <div className="sc-dr__lane-head">
                <Hash size={14} strokeWidth={2} />
                <span>{copy.stageDedup}</span>
                <span className="sc-dr__lane-badge" data-testid="dr-lane-dedup-badge">
                  ×{fmt(dedupe, 1, lang)}
                </span>
              </div>
              <div className="sc-dr__track">
                {stream.map((b, i) => (
                  <span
                    key={`d-${i}`}
                    className={`sc-dr__block sc-dr__block--dedup ${b.dup ? "is-dup" : "is-uniq"}`}
                    style={{
                      "--bcolor": COLOR_MAP[b.c],
                      animationDelay: `${(i * 0.35 + 0.4).toFixed(2)}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Destination: storage array */}
          <div className="sc-dr__endpoint sc-dr__endpoint--dst">
            <div className="sc-dr__endpoint-icon">
              <HardDrive size={26} strokeWidth={1.7} />
            </div>
            <div className="sc-dr__endpoint-name">{copy.toLabel}</div>
            <div className="sc-dr__endpoint-code">AFF · L0</div>
            <div className="sc-dr__endpoint-status">
              <span className="sc-dr__pulse" />
              WRITE OK
            </div>
          </div>
        </div>

        {/* --- Interactive controls -------------------------------------- */}
        <div className="sc-dr__controls" data-testid="dr-controls">
          <div className="sc-dr__controls-head">
            <span className="sc-dr__controls-title">{copy.controlsHead}</span>
            <button
              type="button"
              className="sc-dr__reset"
              onClick={resetAll}
              data-testid="dr-reset"
              aria-label={copy.resetBtn}
            >
              <RotateCcw size={13} strokeWidth={2} />
              {copy.resetBtn}
            </button>
          </div>

          <div className="sc-dr__control" data-testid="dr-slider-comp">
            <div className="sc-dr__control-row">
              <label htmlFor="dr-slider-compression" className="sc-dr__control-lbl">
                {copy.compressionLbl}
              </label>
              <span className="sc-dr__control-val" data-testid="dr-value-comp">
                ×{fmt(compression, 1, lang)}
              </span>
            </div>
            <input
              id="dr-slider-compression"
              type="range"
              min={LIMITS.compression.min}
              max={LIMITS.compression.max}
              step={LIMITS.compression.step}
              value={compression}
              onChange={(e) => setCompression(parseFloat(e.target.value))}
              className="sc-dr__range sc-dr__range--comp"
              aria-label={copy.compressionLbl}
              style={{
                "--fill": `${((compression - LIMITS.compression.min) /
                  (LIMITS.compression.max - LIMITS.compression.min)) * 100}%`,
              }}
            />
            <div className="sc-dr__control-scale">
              <span>×{LIMITS.compression.min.toFixed(1)}</span>
              <span>×{LIMITS.compression.max.toFixed(1)}</span>
            </div>
          </div>

          <div className="sc-dr__control" data-testid="dr-slider-dedup">
            <div className="sc-dr__control-row">
              <label htmlFor="dr-slider-dedupe" className="sc-dr__control-lbl">
                {copy.dedupeLbl}
              </label>
              <span className="sc-dr__control-val" data-testid="dr-value-dedup">
                ×{fmt(dedupe, 1, lang)}
              </span>
            </div>
            <input
              id="dr-slider-dedupe"
              type="range"
              min={LIMITS.dedupe.min}
              max={LIMITS.dedupe.max}
              step={LIMITS.dedupe.step}
              value={dedupe}
              onChange={(e) => setDedupe(parseFloat(e.target.value))}
              className="sc-dr__range sc-dr__range--dedup"
              aria-label={copy.dedupeLbl}
              style={{
                "--fill": `${((dedupe - LIMITS.dedupe.min) /
                  (LIMITS.dedupe.max - LIMITS.dedupe.min)) * 100}%`,
              }}
            />
            <div className="sc-dr__control-scale">
              <span>×{LIMITS.dedupe.min.toFixed(1)}</span>
              <span>×{LIMITS.dedupe.max.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="sc-dr__legend" aria-hidden="true" data-testid="dr-legend">
          <span className="sc-dr__leg">
            <span className="sc-dr__leg-swatch sc-dr__leg-swatch--raw" />
            {copy.legendRaw}
          </span>
          <span className="sc-dr__leg">
            <span className="sc-dr__leg-swatch sc-dr__leg-swatch--comp" />
            {copy.legendComp}
          </span>
          <span className="sc-dr__leg">
            <span className="sc-dr__leg-swatch sc-dr__leg-swatch--dup" />
            {copy.legendDup}
          </span>
          <span className="sc-dr__leg">
            <span className="sc-dr__leg-swatch sc-dr__leg-swatch--uniq" />
            {copy.legendUniq}
          </span>
        </div>

        {/* Bottom row: metrics + dedupe DB */}
        <div className="sc-dr__bottom" data-testid="dr-bottom">
          <div className="sc-dr__metrics">
            <div className="sc-dr__metrics-head">{copy.metricsHead}</div>
            <ul className="sc-dr__metric-list">
              <li className="sc-dr__metric is-raw">
                <span className="sc-dr__metric-k">{copy.metricRaw}</span>
                <span className="sc-dr__metric-v" data-testid="dr-metric-raw">{fmtTB(rawTB, lang)}</span>
                <span className="sc-dr__metric-bar">
                  <span className="sc-dr__metric-fill" style={{ "--w": `${barRaw}%` }} />
                </span>
              </li>
              <li className="sc-dr__metric is-comp">
                <span className="sc-dr__metric-k">{copy.metricComp}</span>
                <span className="sc-dr__metric-v" data-testid="dr-metric-comp">{fmtTB(afterCompTB, lang)}</span>
                <span className="sc-dr__metric-bar">
                  <span className="sc-dr__metric-fill" style={{ "--w": `${barComp}%` }} />
                </span>
              </li>
              <li className="sc-dr__metric is-final">
                <span className="sc-dr__metric-k">{copy.metricFinal}</span>
                <span className="sc-dr__metric-v" data-testid="dr-metric-final">{fmtTB(afterDedupTB, lang)}</span>
                <span className="sc-dr__metric-bar">
                  <span className="sc-dr__metric-fill" style={{ "--w": `${barFinal}%` }} />
                </span>
              </li>
            </ul>

            <div className="sc-dr__ratio">
              <div className="sc-dr__ratio-box">
                <span className="sc-dr__ratio-label">{copy.ratio}</span>
                <span className="sc-dr__ratio-value" data-testid="dr-ratio">
                  {fmt(totalRatio, 1, lang)} : 1
                </span>
              </div>
              <ArrowRight size={16} strokeWidth={2} className="sc-dr__ratio-sep" />
              <div className="sc-dr__ratio-box sc-dr__ratio-box--alt">
                <span className="sc-dr__ratio-label">{copy.savings}</span>
                <span className="sc-dr__ratio-value" data-testid="dr-savings-pct">
                  {fmt(remainingPct, 1, lang)} %
                </span>
              </div>
            </div>
          </div>

          <div className="sc-dr__side">
            {/* Storage cost calculator */}
            <div className="sc-dr__calc" data-testid="dr-calc">
              <div className="sc-dr__db-head">
                <Calculator size={14} strokeWidth={2} />
                <span>{copy.calcHead}</span>
              </div>
              <p className="sc-dr__calc-hint">{copy.calcHint}</p>

              <label className="sc-dr__calc-input-lbl" htmlFor="dr-input-raw">
                {copy.calcInput}
              </label>
              <div className="sc-dr__calc-input-wrap">
                <input
                  id="dr-input-raw"
                  type="number"
                  min={LIMITS.rawTB.min}
                  max={LIMITS.rawTB.max}
                  step={LIMITS.rawTB.step}
                  value={rawTB}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    if (isFinite(v)) setRawTB(Math.max(0, v));
                    else setRawTB(0);
                  }}
                  className="sc-dr__calc-input"
                  data-testid="dr-calc-input"
                />
                <span className="sc-dr__calc-unit">TB</span>
              </div>

              <div className="sc-dr__calc-results">
                <div className="sc-dr__calc-card sc-dr__calc-card--physical">
                  <span className="sc-dr__calc-k">{copy.calcPhysical}</span>
                  <span className="sc-dr__calc-v" data-testid="dr-calc-physical">
                    {fmtTB(afterDedupTB, lang)}
                  </span>
                </div>
                <div className="sc-dr__calc-card sc-dr__calc-card--saved">
                  <span className="sc-dr__calc-k">{copy.calcSaved}</span>
                  <span className="sc-dr__calc-v" data-testid="dr-calc-saved">
                    {fmtTB(savedTB, lang)}
                  </span>
                </div>
                <div className="sc-dr__calc-card sc-dr__calc-card--pct">
                  <span className="sc-dr__calc-k">{copy.calcSavedPct}</span>
                  <span className="sc-dr__calc-v" data-testid="dr-calc-pct">
                    {fmt(savedPct, 1, lang)} %
                  </span>
                </div>
              </div>
            </div>

            {/* Dedupe DB */}
            <div className="sc-dr__db" data-testid="dr-db">
              <div className="sc-dr__db-head">
                <Database size={14} strokeWidth={2} />
                <span>{copy.dbHead}</span>
              </div>
              <ul className="sc-dr__db-list">
                <li className="sc-dr__db-row sc-dr__db-row--head">
                  <span>Hash</span>
                  <span>Refs</span>
                  <span>Payload</span>
                </li>
                {dbRows.length === 0 ? (
                  <li className="sc-dr__db-row sc-dr__db-empty">
                    <span>—</span>
                    <span>—</span>
                    <span>—</span>
                  </li>
                ) : (
                  dbRows.map((r, i) => (
                    <li
                      key={i}
                      className="sc-dr__db-row"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    >
                      <span className="sc-dr__db-hash">{r.hash}</span>
                      <span className="sc-dr__db-refs">{r.refs}</span>
                      <span className="sc-dr__db-size">{r.size}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DataReductionSection;
