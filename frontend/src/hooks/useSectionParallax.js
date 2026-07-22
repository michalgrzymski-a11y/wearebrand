import { useEffect, useRef } from "react";

/**
 * useSectionParallax — attaches scroll-based translateY to marked descendants.
 *
 * Any child element with `data-parallax="0.4"` (or another number) gets
 * `transform: translate3d(0, offsetY * speed, 0)` on scroll, where offsetY is
 * the amount the section has passed the viewport center. Neutral center means
 * no offset; scrolling down moves elements up/down depending on sign.
 *
 * Usage:
 *   const ref = useSectionParallax();
 *   <section ref={ref}> ... decorative <span data-parallax="0.35" /> ... </section>
 *
 * Speeds < 1 make elements move slower than scroll (further away),
 * speeds > 1 make them move faster (closer to viewer). Negative flips direction.
 * Elements outside viewport pause updates (RAF stays but skips DOM write).
 */
const useSectionParallax = () => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const nodes = Array.from(el.querySelectorAll("[data-parallax]"));
    if (!nodes.length) return;

    let raf = 0;
    let inView = false;

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => (inView = e.isIntersecting)),
      { threshold: 0, rootMargin: "20% 0px 20% 0px" },
    );
    io.observe(el);

    const update = () => {
      if (inView) {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        // Distance of section center from viewport center in pixels
        const center = rect.top + rect.height / 2 - vh / 2;
        for (const n of nodes) {
          const speed = parseFloat(n.dataset.parallax) || 0.3;
          const offset = -center * speed;
          n.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
        }
      }
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  return ref;
};

export default useSectionParallax;
