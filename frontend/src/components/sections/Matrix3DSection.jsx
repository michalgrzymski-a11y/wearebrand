import React, { useEffect, useRef, useState } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { ShieldCheck, Timer, Award, Users } from "lucide-react";
import Reveal from "@/components/Reveal";
import useSectionParallax from "@/hooks/useSectionParallax";

/**
 * Matrix3DSection — kopia sekcji Values, ale macierz dyskowa
 * przedstawiona jako obracający się obiekt 3D (perspective + CSS
 * transform3d). Użytkownik może „chwycić" macierz kursorem
 * i obracać ją poziomo.
 */

const COPY = {
  pl: {
    label: "Wartości SMARTCLOUT (3D)",
    title: "Wartości pracują",
    accent: "24 / 7.",
    subtitle:
      "Ta sama macierz wartości, tym razem jako fizyczny obiekt 3D — kręć, obracaj, poczuj że mówimy o realnym sprzęcie. Kliknij i przeciągnij, aby obrócić macierz.",
    values: [
      { id: "years", Icon: Award, kicker: "20+ LAT", title: "Doświadczenia", desc: "Dwie dekady projektów enterprise." },
      { id: "svc",   Icon: Timer, kicker: "SERWIS 24/7", title: "Ciągłość działania", desc: "Zespół inżynierski w Polsce, gwarantowane SLA." },
      { id: "partner", Icon: ShieldCheck, kicker: "PARTNER", title: "Certyfikacje", desc: "Dell, HPE, NetApp, Cisco, VMware, Veeam." },
      { id: "trust", Icon: Users, kicker: "ZAUFANIE", title: "130+ klientów", desc: "Enterprise, finanse, przemysł, administracja." },
    ],
  },
  en: {
    label: "SMARTCLOUT values (3D)",
    title: "Values that work",
    accent: "24 / 7.",
    subtitle:
      "The same values matrix, this time as a physical 3D object — spin, rotate, feel the hardware. Click and drag to rotate.",
    values: [
      { id: "years", Icon: Award, kicker: "20+ YRS", title: "Experience", desc: "Two decades of enterprise projects." },
      { id: "svc",   Icon: Timer, kicker: "24/7 SVC", title: "Business continuity", desc: "Engineering team in Poland, guaranteed SLA." },
      { id: "partner", Icon: ShieldCheck, kicker: "PARTNER", title: "Certifications", desc: "Dell, HPE, NetApp, Cisco, VMware, Veeam." },
      { id: "trust", Icon: Users, kicker: "TRUST", title: "130+ clients", desc: "Enterprise, finance, industry, government." },
    ],
  },
};

const Matrix3DSection = () => {
  const { lang } = useLang();
  const copy = COPY[lang] || COPY.pl;
  const parallaxRef = useSectionParallax();
  const wrapRef = useRef(null);
  const [rotY, setRotY] = useState(-22);
  const [rotX, setRotX] = useState(-12);
  const dragRef = useRef({ dragging: false, x: 0, y: 0, ry: -22, rx: -12 });

  useEffect(() => {
    let raf = 0;
    let ry = rotY;
    const auto = () => {
      if (!dragRef.current.dragging) {
        ry += 0.12;
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
  };
  const onMove = (e) => {
    if (!dragRef.current.dragging) return;
    const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const y = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    setRotY(dragRef.current.ry + (x - dragRef.current.x) * 0.4);
    setRotX(Math.max(-40, Math.min(20, dragRef.current.rx - (y - dragRef.current.y) * 0.3)));
  };
  const onUp = () => { dragRef.current.dragging = false; };

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
            {/* Chassis body */}
            <div className="sc-matrix3d__face sc-matrix3d__face--front">
              <div className="sc-matrix3d__brand">
                <span className="sc-matrix3d__brand-strip" />
                <span className="sc-matrix3d__brand-name">SMARTCLOUT</span>
                <span className="sc-matrix3d__brand-model">VALUES · 3D</span>
              </div>
              <div className="sc-matrix3d__bays">
                {copy.values.flatMap((v, i) => [
                  <div key={`v-${i}`} className="sc-matrix3d__bay sc-matrix3d__bay--value">
                    <span className="sc-matrix3d__bay-icon"><v.Icon size={22} strokeWidth={1.7} /></span>
                    <span className="sc-matrix3d__bay-kicker">{v.kicker}</span>
                    <span className="sc-matrix3d__bay-title">{v.title}</span>
                    <span className="sc-matrix3d__bay-led" />
                  </div>,
                  ...(i < copy.values.length - 1 ? [<div key={`f-${i}`} className="sc-matrix3d__bay sc-matrix3d__bay--filler"><span className="sc-matrix3d__bay-led" /></div>] : []),
                ])}
              </div>
            </div>
            <div className="sc-matrix3d__face sc-matrix3d__face--back" />
            <div className="sc-matrix3d__face sc-matrix3d__face--left" />
            <div className="sc-matrix3d__face sc-matrix3d__face--right" />
            <div className="sc-matrix3d__face sc-matrix3d__face--top" />
            <div className="sc-matrix3d__face sc-matrix3d__face--bottom" />
          </div>
          <div className="sc-matrix3d__hint">Kliknij i przeciągnij, aby obrócić</div>
        </div>
      </div>
    </section>
  );
};

export default Matrix3DSection;
