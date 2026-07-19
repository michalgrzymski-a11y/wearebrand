import React, { useEffect, useRef, useState } from "react";

/**
 * Reveal — Apple-style subtle scroll-triggered fade+slide-up.
 * Uses IntersectionObserver once; applies `is-in` class that transitions
 * opacity 0→1 and translateY 24px→0 with ease-out.
 */
const Reveal = ({ children, delay = 0, as: As = "div", className = "", ...rest }) => {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setSeen(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <As
      ref={ref}
      className={`sc-reveal ${seen ? "is-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </As>
  );
};

export default Reveal;
