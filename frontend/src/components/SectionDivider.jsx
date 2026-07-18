import React, { useEffect, useRef, useState } from "react";

/**
 * SectionDivider — hard color cut with a neon mint line separator.
 *
 *  Behaviour:
 *    - Section above and below meet at a HARD edge (no gradient bleed).
 *    - A thin (2px) neon mint line sits exactly at the seam with glow.
 *    - On scroll into view: line reveals from center out (scaleX 0→1) with easing.
 *    - A subtle horizontal sweep of light continuously travels along the line.
 *
 *  Props:
 *    - top:    background color of the section above (rendered as the divider top half)
 *    - bottom: background color of the section below (rendered as the divider bottom half)
 *    - height: total divider height in px (default 6 — very thin cut zone)
 */
const SectionDivider = ({ top, bottom, height = 4, id = "" }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        });
      },
      { rootMargin: "-10% 0px -10% 0px", threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-testid={id ? `divider-${id}` : "section-divider"}
      className="sc-cut"
      style={{ background: top }}
    >
      {/* the "bottom" half is just under the neon line */}
      <div className="sc-cut__below" style={{ background: bottom, height: `${height}px` }} />
      {/* the neon line */}
      <div className={`sc-cut__line ${visible ? "is-in" : ""}`} />
    </div>
  );
};

export default SectionDivider;
