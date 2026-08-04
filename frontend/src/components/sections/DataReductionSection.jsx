import React from "react";
import { useLang } from "@/i18n/LanguageContext";
import {
  Server,
  ArrowRight,
  Combine,
  Layers,
  HardDrive,
  Database,
  Hash,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import useSectionParallax from "@/hooks/useSectionParallax";

/**
 * DataReductionSection — animated visualization of storage data reduction.
 * A stream of coloured blocks flows from the server through a pipeline:
 *   1) raw blocks (some duplicated, shown by colour repetition)
 *   2) compression — every block visibly shrinks
 *   3) deduplication — duplicates get diverted into the dedupe DB (as pointers),
 *      only unique compressed blocks continue to the storage array on the right.
 * Below, a metrics panel + dedupe DB table show the ratios & pointer entries.
 */

// Data stream: colour = "block content" (equal colour ⇒ duplicate)
// This is intentionally repetitive so the dedupe effect is obvious.
const STREAM = [
  { c: "a", dup: false },
  { c: "b", dup: false },
  { c: "a", dup: true  },
  { c: "c", dup: false },
  { c: "b", dup: true  },
  { c: "d", dup: false },
  { c: "a", dup: true  },
  { c: "e", dup: false },
  { c: "c", dup: true  },
  { c: "b", dup: true  },
  { c: "f", dup: false },
  { c: "a", dup: true  },
];

const COLOR_MAP = {
  a: "#06FFE0",
  b: "#7CD6FF",
  c: "#FFC02E",
  d: "#FF7ADB",
  e: "#8BFF7C",
  f: "#FF9668",
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
    metricsHead: "Efekt redukcji",
    dbHead: "Baza deduplikacji · hash pointers",
    metrics: [
      { k: "Zapis surowy",       v: "10.0 TB", tone: "raw" },
      { k: "Po kompresji",       v: "4.20 TB", tone: "comp" },
      { k: "Po deduplikacji",    v: "0.80 TB", tone: "final" },
    ],
    ratio: "Współczynnik redukcji",
    ratioValue: "12.5 : 1",
    savings: "Zapisujesz tylko",
    savingsValue: "8 %",
    dbRows: [
      { hash: "a3f7…9c1e", refs: "×4", size: "512 KB" },
      { hash: "b1c5…22aa", refs: "×3", size: "384 KB" },
      { hash: "9d0e…4f7b", refs: "×2", size: "256 KB" },
      { hash: "e14a…5b02", refs: "×2", size: "192 KB" },
    ],
    legendRaw: "Surowy blok · 32 KB",
    legendComp: "Skompresowany · ~13 KB",
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
    metricsHead: "Reduction results",
    dbHead: "Dedupe database · hash pointers",
    metrics: [
      { k: "Raw write",        v: "10.0 TB", tone: "raw" },
      { k: "After compression", v: "4.20 TB", tone: "comp" },
      { k: "After dedupe",     v: "0.80 TB", tone: "final" },
    ],
    ratio: "Total reduction ratio",
    ratioValue: "12.5 : 1",
    savings: "You actually store",
    savingsValue: "8 %",
    dbRows: [
      { hash: "a3f7…9c1e", refs: "×4", size: "512 KB" },
      { hash: "b1c5…22aa", refs: "×3", size: "384 KB" },
      { hash: "9d0e…4f7b", refs: "×2", size: "256 KB" },
      { hash: "e14a…5b02", refs: "×2", size: "192 KB" },
    ],
    legendRaw: "Raw block · 32 KB",
    legendComp: "Compressed · ~13 KB",
    legendDup: "Duplicate → pointer",
    legendUniq: "Unique → written",
  },
};

const DataReductionSection = () => {
  const { lang } = useLang();
  const copy = COPY[lang] || COPY.pl;
  const parallaxRef = useSectionParallax();

  return (
    <section
      id="data-reduction"
      data-testid="data-reduction-section"
      ref={parallaxRef}
      className="relative w-full overflow-hidden"
      style={{ background: "#040709", color: "#E8F4F5" }}
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
                {STREAM.map((b, i) => (
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
              </div>
              <div className="sc-dr__track">
                {STREAM.map((b, i) => (
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
              </div>
              <div className="sc-dr__track">
                {STREAM.map((b, i) => (
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
              {copy.metrics.map((m, i) => (
                <li key={i} className={`sc-dr__metric is-${m.tone}`}>
                  <span className="sc-dr__metric-k">{m.k}</span>
                  <span className="sc-dr__metric-v">{m.v}</span>
                  <span className="sc-dr__metric-bar">
                    <span
                      className="sc-dr__metric-fill"
                      style={{
                        "--w":
                          m.tone === "raw" ? "100%" : m.tone === "comp" ? "42%" : "8%",
                      }}
                    />
                  </span>
                </li>
              ))}
            </ul>

            <div className="sc-dr__ratio">
              <div className="sc-dr__ratio-box">
                <span className="sc-dr__ratio-label">{copy.ratio}</span>
                <span className="sc-dr__ratio-value">{copy.ratioValue}</span>
              </div>
              <ArrowRight size={16} strokeWidth={2} className="sc-dr__ratio-sep" />
              <div className="sc-dr__ratio-box sc-dr__ratio-box--alt">
                <span className="sc-dr__ratio-label">{copy.savings}</span>
                <span className="sc-dr__ratio-value">{copy.savingsValue}</span>
              </div>
            </div>
          </div>

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
              {copy.dbRows.map((r, i) => (
                <li
                  key={i}
                  className="sc-dr__db-row"
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  <span className="sc-dr__db-hash">{r.hash}</span>
                  <span className="sc-dr__db-refs">{r.refs}</span>
                  <span className="sc-dr__db-size">{r.size}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DataReductionSection;
