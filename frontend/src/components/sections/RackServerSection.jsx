import React, { useState } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { Cpu, MemoryStick, HardDrive, Network, PlugZap, ShieldCheck } from "lucide-react";
import Reveal from "@/components/Reveal";
import useSectionParallax from "@/hooks/useSectionParallax";

/**
 * RackServerSection — top-down view of an OPEN 2U server chassis.
 * Each internal component (CPU, RAM, drives, NIC, PSU, chassis) is clickable
 * and represents a value proposition of refabricated hardware.
 */

const COPY = {
  pl: {
    section_label: "Sprzęt refabrykowany",
    title:         "Zajrzyj do środka. Każdy komponent ma swoją wartość.",
    subtitle:      "Kliknij komponent, aby zobaczyć dlaczego refabrykowany sprzęt to rozsądny wybór — technicznie i finansowo.",
    chassis_code:  "SC · 2U · REFAB HW",
    idle_hint:     "Kliknij lub najedź na komponent, aby zobaczyć jego wartość",
    parts: {
      cpu:    { name: "Procesor",           desc: "Refabrykowane Xeon Gold i Silver z pełną wydajnością. Ta sama wydajność co nowe, za 40–60% ceny." },
      ram:    { name: "Pamięć RAM",         desc: "DIMM-y ECC z certyfikatem producenta, przetestowane i gotowe do produkcji. Bez kompromisów jakościowych." },
      drive:  { name: "Dyski",              desc: "SSD SAS/NVMe i HDD enterprise — od ręki, w Twojej konfiguracji, z gwarancją SMART." },
      nic:    { name: "Karty sieciowe",     desc: "10/25/100G Intel, Broadcom, Mellanox — kompatybilność end-to-end sprawdzona w naszym labie." },
      psu:    { name: "Zasilacze",          desc: "Redundantne PSU 80+ Platinum — niższe koszty energii i pełna niezawodność w każdym scenariuszu." },
      chassis:{ name: "Chassis & gwarancja",desc: "12–36 miesięcy gwarancji SMARTCLOUT, dostępność części zamiennych, wsparcie inżynierskie w Polsce." },
    },
  },
  en: {
    section_label: "Refabricated hardware",
    title:         "Look inside. Every component has a value.",
    subtitle:      "Click a component to see why refabricated hardware is a smart choice — technically and financially.",
    chassis_code:  "SC · 2U · REFAB HW",
    idle_hint:     "Click or hover a component to see its value",
    parts: {
      cpu:    { name: "Processor",         desc: "Refabricated Xeon Gold and Silver with full performance. Same performance as new, at 40–60% of the price." },
      ram:    { name: "Memory (RAM)",      desc: "ECC DIMMs certified by the vendor, tested and production-ready. No quality compromises." },
      drive:  { name: "Drives",            desc: "Enterprise SAS/NVMe SSDs and HDDs — off-the-shelf, in your configuration, with SMART warranty." },
      nic:    { name: "Network cards",     desc: "10/25/100G Intel, Broadcom, Mellanox — end-to-end compatibility validated in our lab." },
      psu:    { name: "Power supplies",    desc: "Redundant 80+ Platinum PSUs — lower energy costs and full reliability in every scenario." },
      chassis:{ name: "Chassis & warranty",desc: "12–36 months SMARTCLOUT warranty, spare parts availability and engineering support in Poland." },
    },
  },
};

const RackServerSection = () => {
  const { lang } = useLang();
  const copy = COPY[lang] || COPY.pl;
  const [active, setActive] = useState(null);
  const parallaxRef = useSectionParallax();
  const current = active ? copy.parts[active] : null;

  return (
    <section
      id="hardware"
      data-testid="lifecycle-section"
      ref={parallaxRef}
      className="relative w-full overflow-hidden"
      style={{ background: "#040709", color: "#E8F4F5" }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-70 pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 55% at 20% 30%, rgba(6,255,224,0.05) 0%, rgba(6,255,224,0) 60%)," +
            " radial-gradient(50% 60% at 80% 70%, rgba(6,184,212,0.05) 0%, rgba(6,184,212,0) 60%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 py-14 md:py-20">
        <Reveal>
          <div className="flex items-center gap-4 text-[11px] uppercase tracking-[0.32em]" style={{ color: "#7CC4C0" }}>
            <span className="inline-block h-px w-10" style={{ background: "#49ADA5" }} />
            {copy.section_label}
          </div>
          <h2 data-testid="hardware-title" className="mt-4 text-3xl md:text-5xl font-semibold leading-[1.05] tracking-tight text-white max-w-3xl">
            {copy.title}
          </h2>
          <p className="mt-4 max-w-2xl text-base md:text-lg text-white/70">
            {copy.subtitle}
          </p>
        </Reveal>

        <div className="mt-12 md:mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: top-down server view */}
          <div className="lg:col-span-8">
            <div className="sc-svr" data-testid="server-topview">
              <div className="sc-svr__header">
                <span className="sc-svr__code">{copy.chassis_code}</span>
                <span className="sc-svr__badge">TOP-VIEW · OPEN CHASSIS</span>
              </div>

              <div className="sc-svr__board">
                {/* Front: 8 drive bays */}
                <div className="sc-svr__row sc-svr__row--drives">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`sc-part sc-part--drive ${active === "drive" ? "is-active" : ""}`}
                      onMouseEnter={() => setActive("drive")}
                      onClick={() => setActive(active === "drive" ? null : "drive")}
                      onFocus={() => setActive("drive")}
                      data-testid={`server-part-drive-${i}`}
                      aria-label={copy.parts.drive.name}
                    >
                      <span className="sc-part__label">HDD·{String(i + 1).padStart(2, "0")}</span>
                    </button>
                  ))}
                </div>

                {/* Fan strip */}
                <div className="sc-svr__row sc-svr__row--fans" aria-hidden="true">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <span key={i} className="sc-fan">
                      <span className="sc-fan__blades" />
                    </span>
                  ))}
                </div>

                {/* CPU + RAM zone */}
                <div className="sc-svr__row sc-svr__row--cpu">
                  <button
                    type="button"
                    className={`sc-part sc-part--cpu ${active === "cpu" ? "is-active" : ""}`}
                    onMouseEnter={() => setActive("cpu")}
                    onClick={() => setActive(active === "cpu" ? null : "cpu")}
                    onFocus={() => setActive("cpu")}
                    data-testid="server-part-cpu"
                    aria-label={copy.parts.cpu.name}
                  >
                    <span className="sc-part__icon"><Cpu size={22} strokeWidth={1.6} /></span>
                    <span className="sc-part__tag">CPU · 01</span>
                  </button>

                  <button
                    type="button"
                    className={`sc-part sc-part--ram ${active === "ram" ? "is-active" : ""}`}
                    onMouseEnter={() => setActive("ram")}
                    onClick={() => setActive(active === "ram" ? null : "ram")}
                    onFocus={() => setActive("ram")}
                    data-testid="server-part-ram"
                    aria-label={copy.parts.ram.name}
                  >
                    <span className="sc-part__ram-bank">
                      {Array.from({ length: 8 }).map((_, i) => <span key={i} />)}
                    </span>
                    <span className="sc-part__icon"><MemoryStick size={20} strokeWidth={1.6} /></span>
                    <span className="sc-part__tag">RAM · 8× DIMM</span>
                  </button>

                  <button
                    type="button"
                    className={`sc-part sc-part--cpu ${active === "cpu" ? "is-active" : ""}`}
                    onMouseEnter={() => setActive("cpu")}
                    onClick={() => setActive(active === "cpu" ? null : "cpu")}
                    onFocus={() => setActive("cpu")}
                    data-testid="server-part-cpu2"
                    aria-label={copy.parts.cpu.name}
                  >
                    <span className="sc-part__icon"><Cpu size={22} strokeWidth={1.6} /></span>
                    <span className="sc-part__tag">CPU · 02</span>
                  </button>
                </div>

                {/* Rear: NIC + PSU */}
                <div className="sc-svr__row sc-svr__row--rear">
                  <button
                    type="button"
                    className={`sc-part sc-part--nic ${active === "nic" ? "is-active" : ""}`}
                    onMouseEnter={() => setActive("nic")}
                    onClick={() => setActive(active === "nic" ? null : "nic")}
                    onFocus={() => setActive("nic")}
                    data-testid="server-part-nic"
                    aria-label={copy.parts.nic.name}
                  >
                    <span className="sc-part__icon"><Network size={18} strokeWidth={1.6} /></span>
                    <span className="sc-part__tag">NIC · 25G</span>
                  </button>
                  <button
                    type="button"
                    className={`sc-part sc-part--psu ${active === "psu" ? "is-active" : ""}`}
                    onMouseEnter={() => setActive("psu")}
                    onClick={() => setActive(active === "psu" ? null : "psu")}
                    onFocus={() => setActive("psu")}
                    data-testid="server-part-psu"
                    aria-label={copy.parts.psu.name}
                  >
                    <span className="sc-part__icon"><PlugZap size={18} strokeWidth={1.6} /></span>
                    <span className="sc-part__tag">PSU · 01</span>
                  </button>
                  <button
                    type="button"
                    className={`sc-part sc-part--psu ${active === "psu" ? "is-active" : ""}`}
                    onMouseEnter={() => setActive("psu")}
                    onClick={() => setActive(active === "psu" ? null : "psu")}
                    onFocus={() => setActive("psu")}
                    data-testid="server-part-psu2"
                    aria-label={copy.parts.psu.name}
                  >
                    <span className="sc-part__icon"><PlugZap size={18} strokeWidth={1.6} /></span>
                    <span className="sc-part__tag">PSU · 02</span>
                  </button>
                </div>
              </div>

              <button
                type="button"
                className={`sc-svr__frame ${active === "chassis" ? "is-active" : ""}`}
                onClick={() => setActive(active === "chassis" ? null : "chassis")}
                onMouseEnter={() => !active && setActive("chassis")}
                aria-label={copy.parts.chassis.name}
                data-testid="server-part-chassis"
              >
                <span className="sc-svr__frame-label">Chassis</span>
              </button>
            </div>
          </div>

          {/* Right: info panel */}
          <aside className="lg:col-span-4">
            <div className={`sc-svr-info ${current ? "is-open" : ""}`} data-testid="server-info">
              {current ? (
                <>
                  <div className="sc-svr-info__kicker">
                    <ShieldCheck size={12} strokeWidth={2} />
                    {lang === "pl" ? "Wartość komponentu" : "Component value"}
                  </div>
                  <h3 data-testid="server-info-name" className="sc-svr-info__name">{current.name}</h3>
                  <p data-testid="server-info-desc" className="sc-svr-info__desc">{current.desc}</p>
                </>
              ) : (
                <div className="sc-svr-info__idle">{copy.idle_hint}</div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default RackServerSection;
