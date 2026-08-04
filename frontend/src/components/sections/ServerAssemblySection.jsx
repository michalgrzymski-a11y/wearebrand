import React, { useEffect, useState, useCallback } from "react";
import { useLang } from "@/i18n/LanguageContext";
import {
  Package,
  Wrench,
  Gauge,
  ShieldCheck,
  Truck,
  Cpu,
  MemoryStick,
  HardDrive,
  CheckCircle2,
  Circle,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import useSectionParallax from "@/hooks/useSectionParallax";

/**
 * ServerAssemblySection — 5-step animated visualization of the IT SmartClout
 * server build & shipping process. Steps auto-advance every ~5s and can be
 * clicked. The central 2U server stage animates according to the active step.
 */

const STEP_DURATION = 5200; // ms per auto-step
const SEAL_CODE = `SC · CERTIFIED · ${new Date().toLocaleDateString("pl-PL")}`;

const COPY = {
  pl: {
    label: "Proces · Build floor",
    title: "Od komponentu",
    accent: "do plomby.",
    subtitle:
      "Każdy serwer, który opuszcza nasz warsztat, przechodzi te pięć kroków. Bez pośpiechu, bez kompromisów — bo Twoja infrastruktura ma po prostu działać.",
    steps: [
      {
        Icon: Package,
        title: "Pozyskanie komponentów",
        short: "Weryfikacja u źródła",
        desc: "Każda część — CPU, RAM, dyski, karty — przychodzi wprost od dystrybutorów i przechodzi kontrolę serial, revision i wizualną. Do dalszych kroków trafia tylko sprzęt bez zastrzeżeń.",
        stageLabel: "Komponenty w drodze",
      },
      {
        Icon: Wrench,
        title: "Montaż wg konfiguracji klienta",
        short: "Build-to-order",
        desc: "Nasi inżynierowie składają serwer dokładnie według Twojej specyfikacji: procesory, moduły pamięci, kontrolery, dyski i karty sieciowe trafiają na swoje miejsce w ustalonym porządku.",
        stageLabel: "Instalacja komponentów",
      },
      {
        Icon: Gauge,
        title: "Weryfikacja i testy",
        short: "Burn-in & QA",
        desc: "Uruchomienie, aktualizacja firmware, testy stabilności pamięci, dysków i pełnego obciążenia. Sprawdzamy każdy podsystem, zanim serwer opuści halę.",
        stageLabel: "Testy obciążeniowe",
      },
      {
        Icon: ShieldCheck,
        title: "Plomba IT SmartClout",
        short: "Certyfikacja",
        desc: "Zamykamy klapę, nakładamy plombę z unikalnym numerem seryjnym i datą. Naruszenie plomby jest widoczne od razu — to Twoja gwarancja, że sprzęt dotarł do Ciebie nienaruszony.",
        stageLabel: "Plombowanie",
      },
      {
        Icon: Truck,
        title: "Wysyłka do klienta",
        short: "Bezpieczna dostawa",
        desc: "Serwer trafia do dedykowanego opakowania z etykietą wysyłkową i pełnym raportem konfiguracji. Śledzenie przesyłki w czasie rzeczywistym — od naszej hali pod Twój adres.",
        stageLabel: "Gotowe do wysyłki",
      },
    ],
    labels: {
      testsHead: "Server QA · runtime",
      testRows: [
        { k: "CPU stress · 60 min", v: "PASS" },
        { k: "Memory pattern",      v: "PASS" },
        { k: "Disk R/W · 4h",       v: "PASS" },
        { k: "Firmware / BMC",      v: "PASS" },
      ],
      componentsHead: "Bill of materials",
      compRows: [
        { Icon: Cpu,         k: "CPU · 2× Xeon Gold" },
        { Icon: MemoryStick, k: "RAM · 8× DDR5 RDIMM" },
        { Icon: HardDrive,   k: "SSD · 4× NVMe U.2" },
      ],
      sealLine1: "IT SMARTCLOUT",
      sealLine2: SEAL_CODE,
      shipTo: "Wysyłka: Klient · PL",
      shipRef: "Ref: SC-BUILD-2418",
    },
  },
  en: {
    label: "Process · Build floor",
    title: "From component",
    accent: "to seal.",
    subtitle:
      "Every server that leaves our workshop walks these five steps. No shortcuts, no compromises — because your infrastructure has to simply work.",
    steps: [
      {
        Icon: Package,
        title: "Component sourcing",
        short: "Verified at the source",
        desc: "Every part — CPU, RAM, drives, cards — comes directly from distributors and passes serial, revision and visual checks. Only clean hardware moves to the next step.",
        stageLabel: "Components incoming",
      },
      {
        Icon: Wrench,
        title: "Build to customer spec",
        short: "Build-to-order",
        desc: "Our engineers assemble the server exactly to your specification: CPUs, memory modules, controllers, disks and NICs land in the right slots in the right order.",
        stageLabel: "Component install",
      },
      {
        Icon: Gauge,
        title: "Verification & burn-in",
        short: "Burn-in & QA",
        desc: "Boot-up, firmware updates, memory and disk stress tests and full load runs. We verify every subsystem before the server leaves the floor.",
        stageLabel: "Stress tests",
      },
      {
        Icon: ShieldCheck,
        title: "IT SmartClout seal",
        short: "Certified",
        desc: "We close the lid and apply a tamper-evident seal with a unique serial and date. Any breach is visible immediately — your guarantee the hardware reached you intact.",
        stageLabel: "Sealing",
      },
      {
        Icon: Truck,
        title: "Shipping to customer",
        short: "Safe delivery",
        desc: "Server is packed with a shipping label and full configuration report. Real-time tracking — from our floor to your address.",
        stageLabel: "Ready to ship",
      },
    ],
    labels: {
      testsHead: "Server QA · runtime",
      testRows: [
        { k: "CPU stress · 60 min", v: "PASS" },
        { k: "Memory pattern",      v: "PASS" },
        { k: "Disk R/W · 4h",       v: "PASS" },
        { k: "Firmware / BMC",      v: "PASS" },
      ],
      componentsHead: "Bill of materials",
      compRows: [
        { Icon: Cpu,         k: "CPU · 2× Xeon Gold" },
        { Icon: MemoryStick, k: "RAM · 8× DDR5 RDIMM" },
        { Icon: HardDrive,   k: "SSD · 4× NVMe U.2" },
      ],
      sealLine1: "IT SMARTCLOUT",
      sealLine2: SEAL_CODE,
      shipTo: "Ship-to: Customer · PL",
      shipRef: "Ref: SC-BUILD-2418",
    },
  },
};

// ---------- Stage visual for the currently active step ----------
const StepStage = ({ step, labels }) => {
  return (
    <div className="sc-asm__stage" data-testid={`asm-stage-${step}`}>
      {/* Server chassis (always visible) */}
      <div className={`sc-asm__server is-step-${step}`}>
        <div className="sc-asm__server-lid" aria-hidden="true" />
        <div className="sc-asm__server-body">

          {/* Zone 1 (top): 6 disk bays across the front of the chassis */}
          <div className="sc-asm__zone sc-asm__zone--disks" aria-hidden="true">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <span
                key={`d-${i}`}
                className="sc-asm__slot sc-asm__slot--disk"
                style={{ "--i": i }}
              >
                <span className="sc-asm__disk-hash" />
                <span className="sc-asm__disk-led" />
              </span>
            ))}
          </div>

          {/* Zone 2 (middle): fan row */}
          <div className="sc-asm__zone sc-asm__zone--fans" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={`f-${i}`}
                className="sc-asm__slot sc-asm__slot--fan"
                style={{ "--i": i }}
              />
            ))}
          </div>

          {/* Zone 3 (bottom): motherboard with 2× CPU + 8× RAM DIMMs */}
          <div className="sc-asm__zone sc-asm__zone--mobo" aria-hidden="true">
            <span className="sc-asm__slot sc-asm__slot--cpu is-cpu1">
              <span className="sc-asm__chip">CPU 01</span>
            </span>
            <span className="sc-asm__slot sc-asm__slot--cpu is-cpu2">
              <span className="sc-asm__chip">CPU 02</span>
            </span>
            <div className="sc-asm__rambank sc-asm__rambank--a" aria-hidden="true">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={`ra-${i}`}
                  className="sc-asm__slot sc-asm__slot--ram"
                  style={{ "--i": i }}
                />
              ))}
            </div>
            <div className="sc-asm__rambank sc-asm__rambank--b" aria-hidden="true">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={`rb-${i}`}
                  className="sc-asm__slot sc-asm__slot--ram"
                  style={{ "--i": i + 4 }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Seal (step 4+) */}
        <div className="sc-asm__seal" aria-hidden="true">
          <div className="sc-asm__seal-tape">
            <span className="sc-asm__seal-l1">{labels.sealLine1}</span>
            <span className="sc-asm__seal-l2">{labels.sealLine2}</span>
          </div>
        </div>

        {/* Shipping box (step 5) */}
        <div className="sc-asm__box" aria-hidden="true">
          <div className="sc-asm__box-label">
            <span className="sc-asm__box-code">SC-BUILD-2418</span>
            <span className="sc-asm__box-line">{labels.shipTo}</span>
            <span className="sc-asm__box-bar">
              <span /><span /><span /><span /><span /><span /><span /><span />
            </span>
          </div>
        </div>
      </div>

      {/* Side panel: components list (step 1-2) OR test panel (step 3) */}
      <div className="sc-asm__panel">
        {step <= 1 && (
          <div className="sc-asm__panel-inner" key="bom">
            <div className="sc-asm__panel-head">{labels.componentsHead}</div>
            <ul className="sc-asm__bom">
              {labels.compRows.map((r, i) => (
                <li key={i} className="sc-asm__bom-item" style={{ animationDelay: `${i * 0.15}s` }}>
                  <span className="sc-asm__bom-icon"><r.Icon size={16} strokeWidth={1.8} /></span>
                  <span className="sc-asm__bom-k">{r.k}</span>
                  <CheckCircle2 size={14} strokeWidth={2} className="sc-asm__bom-ok" />
                </li>
              ))}
            </ul>
          </div>
        )}
        {step === 2 && (
          <div className="sc-asm__panel-inner" key="qa">
            <div className="sc-asm__panel-head">{labels.testsHead}</div>
            <ul className="sc-asm__qa">
              {labels.testRows.map((r, i) => (
                <li key={i} className="sc-asm__qa-item" style={{ animationDelay: `${i * 0.25}s` }}>
                  <span className="sc-asm__qa-k">{r.k}</span>
                  <span className="sc-asm__qa-bar"><span className="sc-asm__qa-fill" /></span>
                  <span className="sc-asm__qa-v">{r.v}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {step === 3 && (
          <div className="sc-asm__panel-inner" key="seal">
            <div className="sc-asm__panel-head">Seal</div>
            <div className="sc-asm__seal-preview">
              <ShieldCheck size={28} strokeWidth={2} />
              <div>
                <div className="sc-asm__seal-p1">{labels.sealLine1}</div>
                <div className="sc-asm__seal-p2">{labels.sealLine2}</div>
              </div>
            </div>
          </div>
        )}
        {step === 4 && (
          <div className="sc-asm__panel-inner" key="ship">
            <div className="sc-asm__panel-head">Shipping manifest</div>
            <ul className="sc-asm__ship">
              <li className="sc-asm__ship-item"><span>Ref</span><b>SC-BUILD-2418</b></li>
              <li className="sc-asm__ship-item"><span>To</span><b>{labels.shipTo}</b></li>
              <li className="sc-asm__ship-item"><span>Weight</span><b>28.4 kg</b></li>
              <li className="sc-asm__ship-item"><span>Warranty</span><b>3Y NBD</b></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

const ServerAssemblySection = () => {
  const { lang } = useLang();
  const copy = COPY[lang] || COPY.pl;
  const parallaxRef = useSectionParallax();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return undefined;
    const t = window.setTimeout(() => {
      setActive((s) => (s + 1) % copy.steps.length);
    }, STEP_DURATION);
    return () => window.clearTimeout(t);
  }, [active, paused, copy.steps.length]);

  const handleSelect = useCallback((idx) => {
    setActive(idx);
    setPaused(true);
    // resume auto-advance after a while
    window.clearTimeout(handleSelect._t);
    handleSelect._t = window.setTimeout(() => setPaused(false), 8000);
  }, []);

  return (
    <section
      id="server-assembly"
      data-testid="server-assembly-section"
      ref={parallaxRef}
      className="relative w-full overflow-hidden"
      style={{ background: "#040709", color: "#E8F4F5" }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(55% 55% at 50% 30%, rgba(6,255,224,0.06) 0%, rgba(6,255,224,0) 60%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-28">
        <Reveal>
          <div className="flex items-center gap-4 text-[12px] uppercase tracking-[0.34em]" style={{ color: "#7CC4C0" }}>
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
          <p className="mt-6 max-w-3xl text-lg md:text-xl leading-relaxed text-white/70">{copy.subtitle}</p>
        </Reveal>

        {/* Stepper */}
        <div className="sc-asm__stepper" role="tablist" data-testid="asm-stepper">
          {copy.steps.map((s, idx) => {
            const isActive = idx === active;
            const isDone = idx < active;
            return (
              <button
                key={idx}
                role="tab"
                aria-selected={isActive}
                className={`sc-asm__step ${isActive ? "is-active" : ""} ${isDone ? "is-done" : ""}`}
                onClick={() => handleSelect(idx)}
                data-testid={`asm-step-${idx}`}
              >
                <span className="sc-asm__step-num">
                  {isDone ? (
                    <CheckCircle2 size={14} strokeWidth={2.2} />
                  ) : (
                    <Circle size={12} strokeWidth={2} />
                  )}
                  <span>{String(idx + 1).padStart(2, "0")}</span>
                </span>
                <span className="sc-asm__step-icon">
                  <s.Icon size={18} strokeWidth={1.8} />
                </span>
                <span className="sc-asm__step-title">{s.title}</span>
                <span className="sc-asm__step-short">{s.short}</span>
                {isActive && !paused && <span className="sc-asm__step-bar" />}
              </button>
            );
          })}
        </div>

        {/* Stage + description */}
        <div className="sc-asm__grid">
          <StepStage step={active} labels={copy.labels} />
          <div className="sc-asm__desc" data-testid="asm-description">
            <div className="sc-asm__desc-tag">
              Krok {String(active + 1).padStart(2, "0")} / {String(copy.steps.length).padStart(2, "0")}
            </div>
            <h3 className="sc-asm__desc-title">{copy.steps[active].title}</h3>
            <p className="sc-asm__desc-body">{copy.steps[active].desc}</p>
            <div className="sc-asm__desc-live">
              <span className="sc-asm__live-dot" />
              {copy.steps[active].stageLabel}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServerAssemblySection;
