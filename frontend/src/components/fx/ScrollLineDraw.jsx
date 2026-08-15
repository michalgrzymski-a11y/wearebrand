import React, { useEffect, useRef } from "react";

/**
 * ScrollLineDraw — pojedyncza meandryczna linia SVG rysująca się w miarę
 * scrollowania strony głównej. Linia startuje po Hero, wije się przez
 * kolejne sekcje i kończy przy Kontakcie.  Na czele linii pulsuje
 * cyanowa kropka („piszący kursor").
 */
const ScrollLineDraw = () => {
  const wrapRef = useRef(null);
  const pathRef = useRef(null);
  const dotRef  = useRef(null);
  const lenRef  = useRef(0);
  const rafRef  = useRef(0);

  useEffect(() => {
    const path = pathRef.current;
    const wrap = wrapRef.current;
    if (!path || !wrap) return;

    // Zmierz długość ścieżki — potrzebna do strokeDasharray / offsetu.
    const measure = () => {
      lenRef.current = path.getTotalLength();
      path.style.strokeDasharray = `${lenRef.current}`;
      path.style.strokeDashoffset = `${lenRef.current}`;
    };
    measure();

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        const r = wrap.getBoundingClientRect();
        const vh = window.innerHeight;
        // progress = ile z wrappera już przeszło pod górną 30% viewportu
        const raw = (vh * 0.3 - r.top) / (r.height - vh * 0.3);
        const p = Math.max(0, Math.min(1, raw));
        const L = lenRef.current;
        path.style.strokeDashoffset = `${L * (1 - p)}`;
        if (dotRef.current && L > 0) {
          const pt = path.getPointAtLength(L * p);
          dotRef.current.setAttribute("cx", pt.x);
          dotRef.current.setAttribute("cy", pt.y);
          dotRef.current.style.opacity = p > 0.001 && p < 0.999 ? "1" : "0";
        }
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    // ponowna miara po pełnym załadowaniu (fonty/obrazy mogą zmienić layout)
    const t = setTimeout(measure, 1200);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      clearTimeout(t);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="sc-scroll-line"
      data-testid="scroll-line-draw"
      aria-hidden="true"
    >
      <svg
        className="sc-scroll-line__svg"
        viewBox="0 0 1000 3000"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="sc-scroll-line-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#06FFE0" stopOpacity="0.9" />
            <stop offset="50%"  stopColor="#00B8D4" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#06FFE0" stopOpacity="0.6" />
          </linearGradient>
          <filter id="sc-scroll-line-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Meandryczna ścieżka — start lewy górny róg, kończy prawy dolny */}
        <path
          ref={pathRef}
          d="
            M 120 0
            C 900 200, 100 500, 850 750
            S 100 1150, 880 1400
            S 120 1800, 900 2050
            S 140 2450, 850 2700
            L 500 3000
          "
          fill="none"
          stroke="url(#sc-scroll-line-grad)"
          strokeWidth="2"
          strokeLinecap="round"
          filter="url(#sc-scroll-line-glow)"
          vectorEffect="non-scaling-stroke"
        />

        {/* Kropka „piszący kursor" na czele linii */}
        <circle
          ref={dotRef}
          className="sc-scroll-line__dot"
          r="6"
          cx="-100"
          cy="-100"
          fill="#06FFE0"
          filter="url(#sc-scroll-line-glow)"
        />
      </svg>
    </div>
  );
};

export default ScrollLineDraw;
