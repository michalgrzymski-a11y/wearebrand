import { useEffect, useRef, useState } from "react";

/**
 * useScrollProgress — returns a 0..1 progress value for how far the referenced
 * element has been scrolled through the viewport.
 * 0  = element top is at (or below) viewport bottom (just entered).
 * 1  = element bottom has reached (or passed above) viewport top (fully passed).
 * Uses rAF throttling for performance.
 */
export default function useScrollProgress() {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);
  const rafId = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const compute = () => {
      rafId.current = null;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      // Total scrollable distance = element height + viewport (top-enter to bottom-exit)
      const total = rect.height + vh;
      // Distance already scrolled through
      const scrolled = vh - rect.top;
      let p = scrolled / total;
      if (p < 0) p = 0;
      if (p > 1) p = 1;
      setProgress(p);
    };

    const onScroll = () => {
      if (rafId.current == null) {
        rafId.current = window.requestAnimationFrame(compute);
      }
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId.current != null) window.cancelAnimationFrame(rafId.current);
    };
  }, []);

  return [ref, progress];
}
