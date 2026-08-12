import React, { useEffect, useRef, useState } from "react";
import { useLang } from "@/i18n/LanguageContext";

/**
 * UtilityBar — quiet, right-side section navigator with:
 *  • 6px "ultra-quiet" dots that expand on hover reveal.
 *  • Vertical progress rail (full-page scroll %) as cyan gradient fill.
 *  • Section index (01/07) + label appears on hover per row.
 * Hidden on mobile (< md).
 */
const SECTIONS = [
  { id: "top",       key: "home"     },
  { id: "values",    key: "values"   },
  { id: "trusted",   key: "clients"  },
  { id: "portfolio", key: "offer"    },
  { id: "savings",   key: "savings"  },
  { id: "partners",  key: "partners" },
  { id: "contact",   key: "contact"  },
];

const UtilityBar = () => {
  const { t } = useLang();
  const [activeId, setActiveId] = useState("top");
  const [pageProgress, setPageProgress] = useState(0); // 0..1
  const rafRef = useRef(0);

  // Scroll tracking → page progress
  useEffect(() => {
    const compute = () => {
      const docH = document.documentElement.scrollHeight;
      const winH = window.innerHeight;
      const maxScroll = Math.max(1, docH - winH);
      const y = window.scrollY || 0;
      setPageProgress(Math.max(0, Math.min(1, y / maxScroll)));
    };
    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", compute);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Active section via IntersectionObserver
  useEffect(() => {
    const nodes = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean);
    if (!nodes.length) return;
    const visibility = new Map();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          visibility.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0);
        });
        let bestId = activeId;
        let bestScore = -1;
        visibility.forEach((score, id) => {
          if (score > bestScore) { bestScore = score; bestId = id; }
        });
        if (bestScore > 0) setActiveId(bestId);
      },
      { threshold: [0, 0.15, 0.35, 0.55, 0.75, 0.95] }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const nav = document.querySelector(".sc-nav--fixed");
    const offset = nav ? nav.getBoundingClientRect().height : 0;
    const top = window.scrollY + el.getBoundingClientRect().top - offset - 8;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <aside
      className="sc-utilbar"
      data-testid="utility-bar"
      aria-label={t.nav ? "Section navigator" : "Navigator"}
    >
      <div className="sc-utilbar__rail" aria-hidden="true">
        <div
          className="sc-utilbar__rail-fill"
          style={{ transform: `scaleY(${pageProgress})` }}
        />
      </div>
      <ul className="sc-utilbar__list">
        {SECTIONS.map((s, i) => {
          const isActive = activeId === s.id;
          const label = (t.nav && t.nav[s.key]) || s.key;
          return (
            <li key={s.id} className="sc-utilbar__item">
              <button
                type="button"
                onClick={() => scrollTo(s.id)}
                className={`sc-utilbar__btn ${isActive ? "is-active" : ""}`}
                data-testid={`utilbar-${s.id}`}
                aria-label={label}
                aria-current={isActive ? "true" : undefined}
              >
                <span className="sc-utilbar__meta">
                  <span className="sc-utilbar__idx">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="sc-utilbar__label">{label}</span>
                </span>
                <span className="sc-utilbar__dot" />
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default UtilityBar;
