import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLang } from "@/i18n/LanguageContext";

/**
 * ZaufaliNam — infinite looping logo carousel.
 *  - Auto-advances at a steady speed (RAF-driven translateX).
 *  - Track is duplicated; when offset passes half the track it wraps
 *    back seamlessly (visually endless loop).
 *  - Prev / Next arrow buttons jump by one slot at a time.
 *  - Auto-play pauses on hover / when tab is not visible.
 *  - All logos share a uniform 140x40 slot so scale reads consistent.
 */
const CLIENTS = [
  { name: "Grupa Azoty", file: "azoty.webp" },
  { name: "Kanał Zero",  file: "zero.webp" },
  { name: "Oponeo",      file: "oponeo.webp" },
  { name: "Sescom",      file: "sescom.webp" },
  { name: "Kaufland",    file: "kaufland.webp" },
  { name: "Cedrob",      file: "cedrob.webp" },
  { name: "DOZ.pl",      file: "doz.webp" },
  { name: "IT CARD SA",  file: "itcard.webp", invert: true },
];

const SLOT_WIDTH = 190;   // px per logo slot (image slot + horizontal gap padding)
const SPEED = 40;         // px/second for auto-play

const ZaufaliNam = () => {
  const { t } = useLang();
  const trackRef = useRef(null);
  const offsetRef = useRef(0);         // current translateX offset (positive number)
  const [singleWidth, setSingleWidth] = useState(0);
  const hoverRef = useRef(false);
  const rafRef = useRef(0);
  const lastTsRef = useRef(0);

  // Measure the width of one copy of the list.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => setSingleWidth(track.scrollWidth / 2);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    return () => ro.disconnect();
  }, []);

  // RAF auto-play with hover/visibility pause.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || !singleWidth) return;

    const step = (ts) => {
      if (!lastTsRef.current) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;

      if (!hoverRef.current && !document.hidden) {
        offsetRef.current += SPEED * dt;
        if (offsetRef.current >= singleWidth) {
          offsetRef.current -= singleWidth;
        }
        track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(rafRef.current);
      lastTsRef.current = 0;
    };
  }, [singleWidth]);

  const shift = (dir) => {
    const track = trackRef.current;
    if (!track || !singleWidth) return;
    let next = offsetRef.current + dir * SLOT_WIDTH;
    // Wrap smoothly across the seam
    if (next < 0) next += singleWidth;
    if (next >= singleWidth) next -= singleWidth;

    // Animate transition for the jump
    track.style.transition = "transform 0.55s cubic-bezier(0.22, 0.61, 0.36, 1)";
    offsetRef.current = next;
    track.style.transform = `translate3d(${-next}px, 0, 0)`;
    window.setTimeout(() => {
      if (track) track.style.transition = "";
    }, 600);
  };

  const doubled = [...CLIENTS, ...CLIENTS];

  return (
    <section
      id="trusted"
      data-testid="trusted-section"
      className="relative w-full"
      style={{ background: "#F8FAFA", color: "#1C2833" }}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10 pt-3 pb-1 flex items-center justify-between gap-6">
        <div
          className="flex items-center gap-4 text-[11px] uppercase tracking-[0.32em]"
          style={{ color: "#0C5C62" }}
        >
          <span className="inline-block h-px w-10" style={{ background: "#49ADA5" }} />
          {t.trusted.title}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => shift(-1)}
            data-testid="trusted-prev"
            className="sc-carousel-btn"
            aria-label="Poprzednie logo"
          >
            <ChevronLeft size={16} strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => shift(1)}
            data-testid="trusted-next"
            className="sc-carousel-btn"
            aria-label="Następne logo"
          >
            <ChevronRight size={16} strokeWidth={2} />
          </button>
        </div>
      </div>

      <div
        className="sc-carousel"
        onMouseEnter={() => (hoverRef.current = true)}
        onMouseLeave={() => (hoverRef.current = false)}
        style={{
          maskImage:
            "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)",
        }}
      >
        <div
          ref={trackRef}
          className="sc-carousel__track"
          data-testid="trusted-marquee"
        >
          {doubled.map((c, i) => (
            <span
              key={`${c.name}-${i}`}
              className={`sc-logo-slot ${c.invert ? "sc-logo-slot--invert" : ""}`}
              data-testid={`client-logo-${i}`}
              title={c.name}
            >
              <img
                src={`${process.env.PUBLIC_URL}/logos/${c.file}`}
                alt={c.name}
                loading="lazy"
                draggable="false"
              />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ZaufaliNam;
