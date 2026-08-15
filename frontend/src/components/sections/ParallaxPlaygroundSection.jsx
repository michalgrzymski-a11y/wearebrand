import React, { useEffect, useRef, useState } from "react";
import { Server, Shield, Zap, Star, Rocket, Cpu, Database, Cloud, ArrowRight } from "lucide-react";

/**
 * ParallaxPlaygroundSection — 30 efektów parallax / interakcji.
 * Każdy efekt to samodzielna komórka z labelem i data-testid.
 * Klasy: pf-*  (parallax / fx).
 */

/* ---------- Helpery ---------- */

// IntersectionObserver hook — dodaje klasę .is-in gdy element wchodzi do viewportu
const useReveal = () => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) el.classList.add("is-in");
      else el.classList.remove("is-in");
    }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
};

// Scroll-linked progress (0..1) na element
const useScrollProgress = () => {
  const ref = useRef(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const raw = 1 - (r.top + r.height * 0.3) / vh;
      setP(Math.max(0, Math.min(1, raw)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return [ref, p];
};

/* ============================ EFFECTS (30) ============================ */

const E1 = () => { const r = useReveal(); return (
  <div ref={r} className="pf-fx pf-fx--fade"><Server size={26}/><span>Fade In</span></div>
); };

const E2 = () => { const r = useReveal(); return (
  <div ref={r} className="pf-fx pf-fx--slide-up"><Shield size={26}/><span>Slide Up</span></div>
); };

const E3 = () => { const r = useReveal(); return (
  <div ref={r} className="pf-fx pf-fx--slide-left"><Database size={26}/><span>Slide Left</span></div>
); };

const E4 = () => { const r = useReveal(); return (
  <div ref={r} className="pf-fx pf-fx--zoom"><Cpu size={26}/><span>Zoom In</span></div>
); };

const E5 = () => { const r = useReveal(); return (
  <div ref={r} className="pf-fx pf-fx--rotate"><Star size={26}/><span>Rotate In</span></div>
); };

const E6 = () => { const r = useReveal(); return (
  <div ref={r} className="pf-fx pf-fx--blur"><Cloud size={26}/><span>Blur → Focus</span></div>
); };

/* 7 – Parallax BG (slower on scroll) */
const E7 = () => { const [r, p] = useScrollProgress(); return (
  <div ref={r} className="pf-fx pf-fx--pbg">
    <div className="pf-fx__bg" style={{ transform: `translate3d(0, ${((p - 0.5) * 30).toFixed(1)}px, 0)` }} />
    <span>Parallax BG</span>
  </div>
); };

/* 8 – Layered parallax (2 warstwy różne prędkości) */
const E8 = () => { const [r, p] = useScrollProgress(); return (
  <div ref={r} className="pf-fx pf-fx--layers">
    <span className="pf-fx__layer pf-fx__layer--back" style={{ transform: `translate3d(0, ${((p - 0.5) * 20).toFixed(1)}px, 0)` }}>////</span>
    <Rocket size={26} style={{ transform: `translate3d(0, ${((p - 0.5) * -30).toFixed(1)}px, 0)`, position: "relative" }} />
    <span className="pf-fx__lbl">Layered</span>
  </div>
); };

/* 9 – Sticky title reveal */
const E9 = () => (
  <div className="pf-fx pf-fx--sticky">
    <div className="pf-fx__stickyInner"><Zap size={22}/><span>Sticky Title</span></div>
  </div>
);

/* 10 – Tilt on hover (3D) */
const E10 = () => {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const rx = ((e.clientY - r.top) / r.height - 0.5) * -12;
    const ry = ((e.clientX - r.left) / r.width - 0.5) * 12;
    el.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = "perspective(600px) rotateX(0) rotateY(0)"; };
  return <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className="pf-fx pf-fx--tilt"><Cpu size={26}/><span>Tilt 3D</span></div>;
};

/* 11 – Magnetic button */
const E11 = () => {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) * 0.3;
    const dy = (e.clientY - (r.top + r.height / 2)) * 0.3;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = "translate(0,0)"; };
  return (
    <div className="pf-fx pf-fx--mag-wrap" onMouseMove={onMove} onMouseLeave={onLeave}>
      <button type="button" ref={ref} className="pf-fx pf-fx--mag">Magnetic</button>
    </div>
  );
};

/* 12 – Ripple on click */
const E12 = () => {
  const onClick = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const s = document.createElement("span");
    s.className = "pf-ripple";
    s.style.left = `${e.clientX - r.left}px`;
    s.style.top  = `${e.clientY - r.top}px`;
    el.appendChild(s);
    setTimeout(() => s.remove(), 700);
  };
  return <button onClick={onClick} className="pf-fx pf-fx--ripple">Kliknij – Ripple</button>;
};

/* 13 – Cursor spotlight */
const E13 = () => {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - r.left}px`);
    el.style.setProperty("--y", `${e.clientY - r.top}px`);
  };
  return <div ref={ref} onMouseMove={onMove} className="pf-fx pf-fx--spot"><Star size={26}/><span>Cursor Spotlight</span></div>;
};

/* 14 – Marquee horizontal */
const E14 = () => (
  <div className="pf-fx pf-fx--marquee">
    <div className="pf-marquee__track">
      {Array.from({length: 2}).map((_, k) => (
        <div key={k} className="pf-marquee__group">
          {["Server","Cloud","Storage","Firewall","Compute","AI"].map((w) => (
            <span key={w}>{w} ·</span>
          ))}
        </div>
      ))}
    </div>
  </div>
);

/* 15 – Text reveal char-by-char */
const E15 = () => {
  const r = useReveal();
  const text = "SmartClout";
  return (
    <div ref={r} className="pf-fx pf-fx--chars">
      {text.split("").map((c, i) => (
        <span key={i} style={{ transitionDelay: `${i * 50}ms` }}>{c}</span>
      ))}
    </div>
  );
};

/* 16 – Text mask reveal */
const E16 = () => { const r = useReveal(); return (
  <div ref={r} className="pf-fx pf-fx--mask"><span>Bez kompromisów</span></div>
); };

/* 17 – Counter animation */
const E17 = () => {
  const ref = useRef(null);
  const [v, setV] = useState(0);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    let raf, start;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !start) {
        start = performance.now();
        const step = (t) => {
          const p = Math.min(1, (t - start) / 1400);
          setV(Math.round(9999 * p));
          if (p < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      }
    }, { threshold: 0.5 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, []);
  return <div ref={ref} className="pf-fx pf-fx--counter"><strong>{v.toLocaleString("pl-PL")}</strong><span>Counter</span></div>;
};

/* 18 – Progress bar on scroll */
const E18 = () => { const [r, p] = useScrollProgress(); return (
  <div ref={r} className="pf-fx pf-fx--progress">
    <div className="pf-progress__bar" style={{ width: `${(p*100).toFixed(0)}%` }} />
    <span>Scroll Progress</span>
  </div>
); };

/* 19 – Card lift 3D on hover */
const E19 = () => (
  <div className="pf-fx pf-fx--lift"><Server size={26}/><span>Lift 3D</span></div>
);

/* 20 – Icon spin on hover */
const E20 = () => (
  <div className="pf-fx pf-fx--spin"><Cpu size={30}/><span>Spin Icon</span></div>
);

/* 21 – Underline sweep */
const E21 = () => (
  <div className="pf-fx pf-fx--underline"><span>Underline Sweep</span></div>
);

/* 22 – Color shift */
const E22 = () => (
  <div className="pf-fx pf-fx--shift"><span>Color Shift</span></div>
);

/* 23 – Image zoom */
const E23 = () => (
  <div className="pf-fx pf-fx--zoom-img"><div className="pf-zoomImg" aria-hidden="true"><Cloud size={40}/></div><span>Image Zoom</span></div>
);

/* 24 – Shimmer skeleton */
const E24 = () => (
  <div className="pf-fx pf-fx--shimmer">
    <div className="pf-skel pf-skel--line" />
    <div className="pf-skel pf-skel--line short" />
    <div className="pf-skel pf-skel--line" />
    <span>Shimmer</span>
  </div>
);

/* 25 – Glow pulse */
const E25 = () => (
  <div className="pf-fx pf-fx--pulse"><Star size={26}/><span>Glow Pulse</span></div>
);

/* 26 – Scroll-linked opacity */
const E26 = () => { const [r, p] = useScrollProgress(); return (
  <div ref={r} className="pf-fx pf-fx--opac" style={{ opacity: 0.15 + p * 0.85 }}>
    <Rocket size={26}/><span>Scroll Opacity</span>
  </div>
); };

/* 27 – Scroll-linked scale */
const E27 = () => { const [r, p] = useScrollProgress(); return (
  <div ref={r} className="pf-fx pf-fx--scale">
    <Cpu size={26} style={{ transform: `scale(${0.6 + p * 0.6})` }}/>
    <span>Scroll Scale</span>
  </div>
); };

/* 28 – Sticky scroll pin */
const E28 = () => (
  <div className="pf-fx pf-fx--pin">
    <div className="pf-pin__inner">Sticky Pin</div>
  </div>
);

/* 29 – Horizontal scroll gallery */
const E29 = () => (
  <div className="pf-fx pf-fx--hgal">
    <div className="pf-hgal__track">
      {[1,2,3,4,5,6,7].map(i => <div key={i} className="pf-hgal__item">{i}</div>)}
    </div>
    <span>Horizontal Scroll</span>
  </div>
);

/* 30 – Perspective card flip */
const E30 = () => (
  <div className="pf-fx pf-fx--flip">
    <div className="pf-flip__inner">
      <div className="pf-flip__face pf-flip__front"><Star size={22}/></div>
      <div className="pf-flip__face pf-flip__back">Flip!</div>
    </div>
    <span>Card Flip</span>
  </div>
);

const EFFECTS = [
  { n: 1,  name: "Fade In",             R: E1 },
  { n: 2,  name: "Slide Up",            R: E2 },
  { n: 3,  name: "Slide Left",          R: E3 },
  { n: 4,  name: "Zoom In",             R: E4 },
  { n: 5,  name: "Rotate In",           R: E5 },
  { n: 6,  name: "Blur → Focus",        R: E6 },
  { n: 7,  name: "Parallax BG",         R: E7 },
  { n: 8,  name: "Layered Parallax",    R: E8 },
  { n: 9,  name: "Sticky Title",        R: E9 },
  { n: 10, name: "Tilt 3D (mouse)",     R: E10 },
  { n: 11, name: "Magnetic Button",     R: E11 },
  { n: 12, name: "Ripple Click",        R: E12 },
  { n: 13, name: "Cursor Spotlight",    R: E13 },
  { n: 14, name: "Marquee",             R: E14 },
  { n: 15, name: "Text Reveal (chars)", R: E15 },
  { n: 16, name: "Mask Reveal",         R: E16 },
  { n: 17, name: "Counter Animation",   R: E17 },
  { n: 18, name: "Scroll Progress",     R: E18 },
  { n: 19, name: "Lift 3D Hover",       R: E19 },
  { n: 20, name: "Icon Spin Hover",     R: E20 },
  { n: 21, name: "Underline Sweep",     R: E21 },
  { n: 22, name: "Color Shift",         R: E22 },
  { n: 23, name: "Image Zoom",          R: E23 },
  { n: 24, name: "Shimmer Skeleton",    R: E24 },
  { n: 25, name: "Glow Pulse",          R: E25 },
  { n: 26, name: "Scroll Opacity",      R: E26 },
  { n: 27, name: "Scroll Scale",        R: E27 },
  { n: 28, name: "Sticky Pin",          R: E28 },
  { n: 29, name: "Horizontal Scroll",   R: E29 },
  { n: 30, name: "Card Flip",           R: E30 },
];

const ParallaxPlaygroundSection = () => (
  <section id="parallax-playground" data-testid="parallax-playground" className="pf-section">
    <div className="pf-intro">
      <span className="pf-intro__tag">Parallax &amp; Interakcje · Propozycje</span>
      <h2 className="pf-intro__title">30 efektów gotowych do wpięcia</h2>
      <p className="pf-intro__sub">Najedź kursorem, przewiń w dół, kliknij — każdy klocek pokazuje inną interakcję.</p>
    </div>
    <div className="pf-grid">
      {EFFECTS.map((E) => (
        <div key={E.n} className="pf-cell" data-testid={`pf-cell-${E.n}`}>
          <div className="pf-cell__stage"><E.R /></div>
          <div className="pf-cell__label">
            <span className="pf-cell__num">{String(E.n).padStart(2, "0")}</span>
            <span className="pf-cell__name">{E.name}</span>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default ParallaxPlaygroundSection;
