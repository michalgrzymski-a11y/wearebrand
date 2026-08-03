import React, { useEffect, useRef, useState } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { ShieldCheck, Timer, Award, Users } from "lucide-react";
import Reveal from "@/components/Reveal";
import useSectionParallax from "@/hooks/useSectionParallax";

/**
 * Matrix3DSection — obracająca się macierz 3D.
 *  - Przód: 4 dyski z wartościami (hot-swap: klik = wysuw)
 *  - Tył: dwa kontrolery, dwa zasilacze, bank portów (FC + Ethernet)
 *  - Boki i góra: chassis
 */

const COPY = {
  pl: {
    label: "Wartości SMARTCLOUT (3D)",
    title: "Wartości pracują",
    accent: "24 / 7.",
    subtitle:
      "Ta sama macierz wartości, tym razem jako fizyczny obiekt 3D. Kręć obiekt kursorem, klikaj dyski aby je wysunąć — z tyłu zobaczysz kontrolery, zasilacze i porty.",
    hint: "Kliknij i przeciągnij, aby obrócić",
    values: [
      { id: "years",  Icon: Award,       kicker: "20+ LAT",     title: "Doświadczenia",     desc: "Dwie dekady projektów enterprise." },
      { id: "svc",    Icon: Timer,       kicker: "SERWIS 24/7", title: "Ciągłość działania", desc: "Zespół inżynierski w Polsce, gwarantowane SLA." },
      { id: "partner", Icon: ShieldCheck, kicker: "PARTNER",     title: "Certyfikacje",      desc: "Dell, HPE, NetApp, Cisco, VMware, Veeam." },
      { id: "trust",  Icon: Users,       kicker: "ZAUFANIE",    title: "130+ klientów",     desc: "Enterprise, finanse, przemysł, administracja." },
    ],
    back: { ctrl: "CONTROLLER", psu: "PSU", ports_fc: "FC 32G", ports_eth: "ETH 25G", status_ok: "OK" },
  },
  en: {
    label: "SMARTCLOUT values (3D)",
    title: "Values that work",
    accent: "24 / 7.",
    subtitle:
      "The same values matrix, now as a physical 3D object. Rotate it with the cursor, click a disk to slide it out — on the back you'll find controllers, PSUs and ports.",
    hint: "Click and drag to rotate",
    values: [
      { id: "years",  Icon: Award,       kicker: "20+ YRS", title: "Experience",        desc: "Two decades of enterprise projects." },
      { id: "svc",    Icon: Timer,       kicker: "24/7 SVC", title: "Business continuity", desc: "Engineering team in Poland, guaranteed SLA." },
      { id: "partner", Icon: ShieldCheck, kicker: "PARTNER",  title: "Certifications",    desc: "Dell, HPE, NetApp, Cisco, VMware, Veeam." },
      { id: "trust",  Icon: Users,       kicker: "TRUST",    title: "130+ clients",       desc: "Enterprise, finance, industry, government." },
    ],
    back: { ctrl: "CONTROLLER", psu: "PSU", ports_fc: "FC 32G", ports_eth: "ETH 25G", status_ok: "OK" },
  },
};

const Matrix3DSection = () => {
  const { lang } = useLang();
  const copy = COPY[lang] || COPY.pl;
  const parallaxRef = useSectionParallax();
  const wrapRef = useRef(null);
  const [rotY, setRotY] = useState(-22);
  const [rotX, setRotX] = useState(-12);
  const [pulled, setPulled] = useState(null);
  const dragRef = useRef({ dragging: false, x: 0, y: 0, ry: -22, rx: -12, moved: false });

  useEffect(() => {
    let raf = 0;
    let ry = rotY;
    const auto = () => {
      if (!dragRef.current.dragging) {
        ry += 0.10;
        setRotY(ry);
      }
      raf = requestAnimationFrame(auto);
    };
    auto();
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDown = (e) => {
    dragRef.current.dragging = true;
    dragRef.current.x = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    dragRef.current.y = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    dragRef.current.ry = rotY;
    dragRef.current.rx = rotX;
    dragRef.current.moved = false;
  };
  const onMove = (e) => {
    if (!dragRef.current.dragging) return;
    const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const y = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    const dx = x - dragRef.current.x;
    const dy = y - dragRef.current.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) dragRef.current.moved = true;
    setRotY(dragRef.current.ry + dx * 0.4);
    setRotX(Math.max(-40, Math.min(20, dragRef.current.rx - dy * 0.3)));
  };
  const onUp = () => { dragRef.current.dragging = false; };

  const toggleBay = (id) => {
    if (dragRef.current.moved) return;      // ignore drag-release clicks
    setPulled((p) => (p === id ? null : id));
  };

  const activeValue = copy.values.find((v) => v.id === pulled);

  return (
    <section
      id="values-3d"
      data-testid="values-3d-section"
      ref={parallaxRef}
      className="relative w-full overflow-hidden"
      style={{ background: "#040709", color: "#E8F4F5" }}
    >
      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-28">
        <Reveal>
          <div className="flex items-center gap-4 text-[12px] uppercase tracking-[0.34em]" style={{ color: "#7CC4C0" }}>
            <span className="inline-block h-px w-12" style={{ background: "#49ADA5" }} />
            {copy.label}
          </div>
          <h2 className="mt-5 text-4xl md:text-6xl font-semibold leading-[1.02] tracking-tight text-white max-w-3xl">
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

        <div
          ref={wrapRef}
          className="sc-matrix3d"
          data-testid="matrix-3d"
          onMouseDown={onDown}
          onMouseMove={onMove}
          onMouseUp={onUp}
          onMouseLeave={onUp}
          onTouchStart={onDown}
          onTouchMove={onMove}
          onTouchEnd={onUp}
        >
          <div className="sc-matrix3d__stage" style={{ transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)` }}>
            {/* FRONT — value bays (hot-swap disks) */}
            <div className="sc-matrix3d__face sc-matrix3d__face--front">
              <div className="sc-matrix3d__brand">
                <span className="sc-matrix3d__brand-strip" />
                <span className="sc-matrix3d__brand-name">SMARTCLOUT</span>
                <span className="sc-matrix3d__brand-model">VALUES · 3D</span>
              </div>
              <div className="sc-matrix3d__bays">
                {copy.values.flatMap((v, i) => [
                  <button
                    key={`v-${v.id}`}
                    type="button"
                    onClick={(e) => { e.stopPropagation(); toggleBay(v.id); }}
                    className={`sc-matrix3d__bay sc-matrix3d__bay--value ${pulled === v.id ? "is-pulled" : ""}`}
                    data-testid={`matrix-disk-${v.id}`}
                    aria-pressed={pulled === v.id}
                  >
                    <span className="sc-matrix3d__bay-handle" aria-hidden="true" />
                    <span className="sc-matrix3d__bay-icon"><v.Icon size={22} strokeWidth={1.7} /></span>
                    <span className="sc-matrix3d__bay-kicker">{v.kicker}</span>
                    <span className="sc-matrix3d__bay-title">{v.title}</span>
                    <span className="sc-matrix3d__bay-led" />
                  </button>,
                  ...(i < copy.values.length - 1
                    ? [<div key={`f-${i}`} className="sc-matrix3d__bay sc-matrix3d__bay--filler" aria-hidden="true">
                        <span className="sc-matrix3d__bay-handle" />
                        <span className="sc-matrix3d__bay-led" />
                      </div>]
                    : []),
                ])}
              </div>
            </div>

            {/* BACK — controllers, PSUs and ports (visible when rotated) */}
            <div className="sc-matrix3d__face sc-matrix3d__face--back">
              <div className="sc-matrix3d__back">
                <div className="sc-matrix3d__ctrl-row">
                  {["a", "b"].map((tag) => (
                    <div key={tag} className="sc-matrix3d__ctrl">
                      <span className="sc-matrix3d__ctrl-label">{copy.back.ctrl} {tag.toUpperCase()}</span>
                      <span className="sc-matrix3d__ctrl-leds">
                        <span className="sc-matrix3d__ctrl-led is-mint" />
                        <span className="sc-matrix3d__ctrl-led is-mint" />
                        <span className="sc-matrix3d__ctrl-led is-amber" />
                      </span>
                      <span className="sc-matrix3d__ctrl-ports">
                        <span className="sc-matrix3d__ctrl-portsblock">
                          <span className="sc-matrix3d__ctrl-portstitle">{copy.back.ports_fc}</span>
                          <span className="sc-matrix3d__ctrl-fibers">
                            {Array.from({ length: 4 }).map((_, i) => (
                              <span key={i} className="sc-matrix3d__ctrl-fiber" />
                            ))}
                          </span>
                        </span>
                        <span className="sc-matrix3d__ctrl-portsblock">
                          <span className="sc-matrix3d__ctrl-portstitle">{copy.back.ports_eth}</span>
                          <span className="sc-matrix3d__ctrl-eth">
                            {Array.from({ length: 4 }).map((_, i) => (
                              <span key={i} className="sc-matrix3d__ctrl-port" />
                            ))}
                          </span>
                        </span>
                      </span>
                      <span className="sc-matrix3d__ctrl-status">{copy.back.status_ok}</span>
                    </div>
                  ))}
                </div>

                <div className="sc-matrix3d__psu-row">
                  {["1", "2"].map((n) => (
                    <div key={n} className="sc-matrix3d__psu">
                      <span className="sc-matrix3d__psu-label">{copy.back.psu} {n}</span>
                      <span className="sc-matrix3d__psu-fan" aria-hidden="true">
                        {Array.from({ length: 3 }).map((_, i) => (<span key={i} className="sc-matrix3d__psu-blade" />))}
                      </span>
                      <span className="sc-matrix3d__psu-plug" aria-hidden="true">
                        <span /><span /><span />
                      </span>
                      <span className="sc-matrix3d__psu-led is-mint" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="sc-matrix3d__face sc-matrix3d__face--left" />
            <div className="sc-matrix3d__face sc-matrix3d__face--right" />
            <div className="sc-matrix3d__face sc-matrix3d__face--top" />
            <div className="sc-matrix3d__face sc-matrix3d__face--bottom" />
          </div>

          <div className="sc-matrix3d__hint">{copy.hint}</div>
        </div>

        {/* Pulled-disk caption (below the 3D stage, outside so rotation doesn't affect it) */}
        {activeValue && (
          <div className="sc-matrix3d__caption" data-testid="matrix-caption">
            <span className="sc-matrix3d__caption-kicker">{activeValue.kicker}</span>
            <span className="sc-matrix3d__caption-title">{activeValue.title}</span>
            <span className="sc-matrix3d__caption-desc">{activeValue.desc}</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default Matrix3DSection;
