import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Zap, Database, Layers, ShieldCheck, Cloud, Cpu, Gauge, Sparkles,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Reveal from "@/components/Reveal";
import {
  AFF_A, AFF_C, FAS,
  ONTAP_FEATURES, ONTAP_SECURITY,
  BLUEXP_CAPABILITIES, CLOUDS,
} from "@/data/netappData";

/* ------------------------------------------------------------------ */
/* Small shared helpers                                               */
/* ------------------------------------------------------------------ */

const Eyebrow = ({ children, dark }) => (
  <div
    className="flex items-center gap-4 text-[11px] uppercase tracking-[0.32em]"
    style={{ color: dark ? "#7CC4C0" : "#0C5C62" }}
  >
    <span className="inline-block h-px w-10" style={{ background: "#49ADA5" }} />
    {children}
  </div>
);

const Heading = ({ dark, pre, accent }) => (
  <h2
    className={`mt-4 text-2xl md:text-3xl font-semibold leading-[1.05] tracking-tight max-w-4xl ${dark ? "text-white" : ""}`}
    style={!dark ? { color: "#0C5C62" } : undefined}
  >
    {pre}{" "}
    <span
      className="font-semibold"
      style={{
        background: "linear-gradient(135deg,#06FFE0 0%,#00B8D4 100%)",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      {accent}
    </span>
  </h2>
);

/* Storage-line tabbed picker (used for A / C / FAS series) */
const SeriesPicker = ({ items, testId, showEffective = true }) => {
  const [i, setI] = useState(0);
  const m = items[i];
  return (
    <div data-testid={testId} className="mt-10">
      <div className="sc-proc__tabs" role="tablist" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
        {items.map((it, idx) => (
          <button
            key={it.model}
            type="button"
            role="tab"
            aria-selected={idx === i}
            onClick={() => setI(idx)}
            className={`sc-proc__tab ${idx === i ? "is-active" : ""}`}
            data-testid={`${testId}-tab-${idx}`}
          >
            <span className="sc-proc__tab-num">{String(idx + 1).padStart(2, "0")}</span>
            <span className="sc-proc__tab-step">{it.model}</span>
          </button>
        ))}
      </div>

      <div className="sc-proc__card" key={m.model}>
        <div className="sc-proc__card-head">
          <span className="sc-proc__card-index">{m.tag}</span>
          <h3 className="sc-proc__card-title">{m.model}</h3>
        </div>
        <div className="sc-proc__card-metrics" style={{ marginTop: 18, paddingTop: 0, borderTop: "none" }}>
          <div className="sc-proc__card-metric">
            <span className="sc-proc__card-metric-k">Raw HA</span>
            <span className="sc-proc__card-metric-v">{m.raw}</span>
          </div>
          {showEffective && m.effective && (
            <div className="sc-proc__card-metric">
              <span className="sc-proc__card-metric-k">Effective</span>
              <span className="sc-proc__card-metric-v">{m.effective}</span>
            </div>
          )}
          <div className="sc-proc__card-metric">
            <span className="sc-proc__card-metric-k">Cluster</span>
            <span className="sc-proc__card-metric-v">{m.cluster}</span>
          </div>
          <div className="sc-proc__card-metric">
            <span className="sc-proc__card-metric-k">Form Factor</span>
            <span className="sc-proc__card-metric-v">{m.form}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */

const NetAppHero = () => (
  <section id="netapp-hero" className="relative w-full overflow-hidden" style={{ background: "#040709", color: "#E8F4F5" }}>
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          "radial-gradient(60% 55% at 20% 30%, rgba(6,255,224,0.14) 0%, rgba(6,255,224,0) 60%)," +
          " radial-gradient(50% 60% at 80% 70%, rgba(0,184,212,0.10) 0%, rgba(0,184,212,0) 60%)",
      }}
    />
    <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 pt-28 md:pt-36 pb-20 md:pb-24">
      <Link to="/" className="inline-flex items-center gap-2 text-sm mb-8 hover:opacity-80 transition-opacity" style={{ color: "#7CC4C0" }}>
        <ArrowLeft size={16} /> Powrót
      </Link>
      <Eyebrow dark>Portfolio · NetApp</Eyebrow>
      <h1 className="mt-4 text-4xl md:text-6xl font-semibold leading-[1.02] tracking-tight text-white max-w-4xl">
        Jedna infrastruktura danych.{" "}
        <span
          style={{
            background: "linear-gradient(135deg,#06FFE0 0%,#00B8D4 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Zasilana ONTAP.
        </span>
      </h1>
      <p className="mt-6 max-w-2xl text-lg md:text-xl leading-relaxed text-white/70">
        Od all-flash NVMe po hybrydowe FAS — jeden system operacyjny, spójne API, jedna filozofia zarządzania danymi on-prem i w chmurze.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <a href="#netapp-portfolio" className="sc-btn-primary">Zobacz portfolio</a>
        <a href="/#contact" className="sc-btn-ghost">Zapytaj o wycenę</a>
      </div>
    </div>
  </section>
);

const PortfolioOverview = () => {
  const tiles = [
    { icon: Zap,      title: "AFF A-Series",  subtitle: "PERFORMANCE",  desc: "All-flash NVMe dla krytycznych workload'ów. 6 modeli (A20–A1K). Do 15.5 PB effective per HA.", href: "#aff-a" },
    { icon: Database, title: "AFF C-Series",  subtitle: "CAPACITY",     desc: "Capacity flash na dyskach QLC 60TB. 3 modele (C30/C60/C80). Do 65 PB effective per HA.", href: "#aff-c" },
    { icon: Layers,   title: "FAS Hybrid",    subtitle: "COST-EFFECTIVE", desc: "SSD + HDD dla szerokiego zakresu obciążeń. 5 modeli. Do 14.7 PB raw per HA.", href: "#fas" },
  ];
  return (
    <section id="netapp-portfolio" className="relative w-full overflow-hidden" style={{ background: "#F8FAFA" }}>
      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-24">
        <Reveal>
          <Eyebrow>Portfolio hardware</Eyebrow>
          <Heading pre="Trzy rodziny." accent="Jeden ONTAP." />
        </Reveal>
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiles.map((tile, i) => (
            <Reveal key={tile.title} delay={i * 130}>
              <a href={tile.href} className="sc-bento group block" data-testid={`netapp-tile-${i}`}>
                <div className="flex items-start justify-between">
                  <div className="sc-bento__icon"><tile.icon size={24} strokeWidth={1.7} /></div>
                  <span className="text-[10px] uppercase tracking-[0.32em]" style={{ color: "#49ADA5" }}>{tile.subtitle}</span>
                </div>
                <h3 className="mt-8 text-xl md:text-2xl font-semibold tracking-tight" style={{ color: "#0C5C62" }}>{tile.title}</h3>
                <p className="mt-4 text-[14px] leading-relaxed" style={{ color: "rgba(28,40,51,0.72)" }}>{tile.desc}</p>
                <div className="sc-bento__glow" />
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const LightSectionWrap = ({ id, eyebrow, pre, accent, children, subtitle }) => (
  <section id={id} className="relative w-full overflow-hidden" style={{ background: "#F7FAFA" }}>
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          "radial-gradient(55% 55% at 30% 30%, rgba(73,173,165,0.08) 0%, rgba(73,173,165,0) 60%)," +
          " radial-gradient(45% 55% at 75% 70%, rgba(12,92,98,0.06) 0%, rgba(12,92,98,0) 60%)",
      }}
    />
    <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-24">
      <Reveal>
        <Eyebrow>{eyebrow}</Eyebrow>
        <Heading pre={pre} accent={accent} />
        {subtitle && (
          <p className="mt-5 max-w-3xl text-base md:text-lg leading-relaxed" style={{ color: "#3C4A55" }}>{subtitle}</p>
        )}
      </Reveal>
      {children}
    </div>
  </section>
);

const ONTAPCore = () => (
  <section id="ontap-core" className="relative w-full overflow-hidden" style={{ background: "#040709", color: "#E8F4F5" }}>
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
      style={{
        background: "radial-gradient(55% 55% at 20% 30%, rgba(6,255,224,0.08) 0%, rgba(6,255,224,0) 60%)",
      }}
    />
    <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-24">
      <Reveal>
        <Eyebrow dark>ONTAP · Data services</Eyebrow>
        <Heading dark pre="Funkcjonalności które" accent="wyróżniają ONTAP." />
      </Reveal>
      <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {ONTAP_FEATURES.map((f, i) => (
          <Reveal key={f.k} delay={i * 60}>
            <div className="sc-netapp-tile" data-testid={`ontap-feature-${i}`}>
              <div className="sc-netapp-tile__icon"><Sparkles size={16} strokeWidth={1.8} /></div>
              <h4 className="sc-netapp-tile__title">{f.k}</h4>
              <p className="sc-netapp-tile__desc">{f.d}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const ONTAPSecurity = () => (
  <section id="ontap-security" className="relative w-full overflow-hidden" style={{ background: "#F8FAFA" }}>
    <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-24">
      <Reveal>
        <Eyebrow>ONTAP · Security & Ransomware</Eyebrow>
        <Heading pre="Wielowarstwowa ochrona przed" accent="ransomware i wyciekiem." />
      </Reveal>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ONTAP_SECURITY.map((s, i) => (
          <Reveal key={s.k} delay={i * 90}>
            <div className="sc-bento" data-testid={`ontap-security-${i}`}>
              <div className="flex items-start justify-between">
                <div className="sc-bento__icon"><ShieldCheck size={22} strokeWidth={1.7} /></div>
                <span className="sc-netapp-metric">{s.metric}</span>
              </div>
              <h3 className="mt-6 text-lg md:text-xl font-semibold tracking-tight" style={{ color: "#0C5C62" }}>{s.k}</h3>
              <p className="mt-3 text-[14px] leading-relaxed" style={{ color: "rgba(28,40,51,0.72)" }}>{s.d}</p>
              <div className="sc-bento__glow" />
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const StorageEfficiency = () => (
  <section id="storage-efficiency" className="relative w-full overflow-hidden" style={{ background: "#040709", color: "#E8F4F5" }}>
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
      style={{ background: "radial-gradient(50% 60% at 70% 40%, rgba(0,184,212,0.10) 0%, rgba(0,184,212,0) 60%)" }}
    />
    <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        <Reveal>
          <div>
            <Eyebrow dark>Storage Efficiency</Eyebrow>
            <Heading dark pre="5:1 gwarancja" accent="efektywności." />
            <p className="mt-6 text-white/70 leading-relaxed">
              Zintegrowana efektywność — dane zawsze w postaci zdeduplikowanej i skompresowanej przez cały cykl życia.
              Dedup + Compression + Compaction + Thin Provisioning działają inline, bez wpływu na wydajność.
            </p>
            <ul className="mt-6 space-y-2 text-[14px] text-white/75">
              <li>• Inline deduplication na poziomie AFP / WAFL</li>
              <li>• Inline compression + post-process aggregation</li>
              <li>• Data Compaction — sub-block packing</li>
              <li>• Storage Efficiency Guarantee — 5:1 dla AFF C-Series</li>
            </ul>
          </div>
        </Reveal>
        <Reveal delay={200}>
          <div className="sc-netapp-ratio">
            <div className="sc-netapp-ratio__label">Effective : Raw</div>
            <div className="sc-netapp-ratio__value">
              <span>5</span>
              <span className="sc-netapp-ratio__colon">:</span>
              <span>1</span>
            </div>
            <div className="sc-netapp-ratio__caption">Storage Efficiency Guarantee dla AFF C-Series</div>
            <div className="sc-netapp-ratio__bars">
              <div className="sc-netapp-ratio__bar" style={{ width: "100%" }}><span>1 PB raw</span></div>
              <div className="sc-netapp-ratio__bar sc-netapp-ratio__bar--eff" style={{ width: "100%" }}><span>5 PB effective</span></div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

const BlueXPCloud = () => (
  <section id="netapp-bluexp" className="relative w-full overflow-hidden" style={{ background: "#F8FAFA" }}>
    <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-24">
      <Reveal>
        <Eyebrow>BlueXP · Hybrid Cloud</Eyebrow>
        <Heading pre="Jedna konsola." accent="On-prem, cloud, hybrid." />
        <p className="mt-5 max-w-3xl text-base md:text-lg leading-relaxed" style={{ color: "#3C4A55" }}>
          BlueXP to unified control plane — zarządzasz danymi NetApp gdziekolwiek się znajdują: w Twoim data center, w AWS, Azure, GCP czy IBM Cloud.
        </p>
      </Reveal>
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <Reveal>
          <ul className="space-y-3">
            {BLUEXP_CAPABILITIES.map((c) => (
              <li key={c} className="flex items-start gap-3">
                <span className="mt-2 inline-block w-1.5 h-1.5 rounded-full" style={{ background: "linear-gradient(135deg,#06FFE0,#00B8D4)" }} />
                <span className="text-[15px] leading-relaxed" style={{ color: "#2A3B3D" }}>{c}</span>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={200}>
          <div className="sc-netapp-clouds">
            <div className="sc-netapp-clouds__head">
              <Cloud size={18} strokeWidth={1.6} />
              <span>Wspierane chmury publiczne</span>
            </div>
            <div className="sc-netapp-clouds__grid">
              {CLOUDS.map((c) => (
                <div key={c} className="sc-netapp-clouds__cell">{c}</div>
              ))}
            </div>
            <div className="sc-netapp-clouds__note">
              ONTAP Select · Cloud Volumes ONTAP · FabricPool · Cloud Backup · Cloud Sync
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

const CTAContact = () => (
  <section className="relative w-full overflow-hidden" style={{ background: "#040709", color: "#E8F4F5" }}>
    <div className="relative z-10 mx-auto max-w-4xl px-6 md:px-10 py-20 text-center">
      <Eyebrow dark>Następny krok</Eyebrow>
      <Heading dark pre="Zaprojektujmy Twoją" accent="infrastrukturę NetApp." />
      <p className="mt-5 text-white/70 leading-relaxed max-w-2xl mx-auto">
        Umów bezpłatny warsztat architektury — dobierzemy właściwą serię, policzymy TCO i pokażemy jak ONTAP wpisuje się w Twoje procesy.
      </p>
      <div className="mt-8 flex justify-center flex-wrap gap-3">
        <a href="/#contact" className="sc-btn-primary">Umów konsultację</a>
        <a href="#netapp-portfolio" className="sc-btn-ghost">Wróć do portfolio</a>
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const NetappPage = () => {
  return (
    <main data-testid="netapp-page" className="sc-app">
      <Navbar />
      <NetAppHero />
      <PortfolioOverview />

      <LightSectionWrap
        id="aff-a"
        eyebrow="AFF A-Series · Performance"
        pre="All-flash NVMe"
        accent="dla krytycznych workload'ów."
        subtitle="Sześć modeli od A20 po A1K — wybór najbardziej wymagających środowisk bazodanowych, VDI, HPC i analityki."
      >
        <SeriesPicker items={AFF_A} testId="aff-a-picker" />
      </LightSectionWrap>

      <LightSectionWrap
        id="aff-c"
        eyebrow="AFF C-Series · Capacity Flash"
        pre="Capacity Flash na"
        accent="dyskach QLC do 60 TB."
        subtitle="Trzy modele (C30, C60, C80) — flash performance w cenie kapacytatywnego HDD, z gwarancją Storage Efficiency 5:1."
      >
        <SeriesPicker items={AFF_C} testId="aff-c-picker" />
      </LightSectionWrap>

      <LightSectionWrap
        id="fas"
        eyebrow="FAS · Hybrid"
        pre="Hybrid SSD + HDD"
        accent="dla różnorodnych obciążeń."
        subtitle="Pięć modeli FAS — od SMB (FAS2750) po enterprise (FAS90). Optymalny stosunek kosztu do pojemności dla mieszanych workloadów."
      >
        <SeriesPicker items={FAS} testId="fas-picker" showEffective={false} />
      </LightSectionWrap>

      <ONTAPCore />
      <ONTAPSecurity />
      <StorageEfficiency />
      <BlueXPCloud />
      <CTAContact />
    </main>
  );
};

export default NetappPage;
