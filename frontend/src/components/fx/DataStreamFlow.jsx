import React, { useEffect, useRef } from "react";

/**
 * DataStreamFlow — vertical falling character/dot streams (matrix-inspired
 * but softer). Streams are placed on discrete columns and reset once they
 * pass the bottom edge. Works on light or dark backgrounds via `tone`.
 */
const DataStreamFlow = ({ tone = "dark", density = 40 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const parent = canvas.parentElement;
    let raf = 0;
    let running = true;
    let W = 0, H = 0, dpr = Math.max(1, window.devicePixelRatio || 1);
    const isMobile = window.matchMedia("(max-width: 700px)").matches;
    const cols = isMobile ? Math.round(density * 0.6) : density;
    const streams = [];

    const glyphs = "01·•∙◦○●⋮⋱⋰⣀⣄⣤⣶⣿".split("");

    const resize = () => {
      const r = parent.getBoundingClientRect();
      W = r.width;
      H = r.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      streams.length = 0;
      const spacing = W / cols;
      for (let i = 0; i < cols; i++) {
        streams.push({
          x: i * spacing + spacing / 2,
          y: -Math.random() * H,
          v: 0.6 + Math.random() * 1.4,
          len: 14 + Math.random() * 22,
          nextGlyph: Math.random() * 1000,
          glyph: glyphs[Math.floor(Math.random() * glyphs.length)],
          size: 10 + Math.random() * 4,
        });
      }
    };

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => (running = e.isIntersecting)),
      { threshold: 0 },
    );
    io.observe(parent);

    resize();
    seed();
    window.addEventListener("resize", resize);

    const baseColor =
      tone === "dark" ? "6, 255, 224" : "12, 92, 98"; // rgb parts
    const trailAlpha = tone === "dark" ? 0.12 : 0.05;

    const step = (ts) => {
      raf = requestAnimationFrame(step);
      if (!running) return;

      // Fade previous frame slightly instead of clearing to keep trails
      ctx.fillStyle =
        tone === "dark"
          ? `rgba(4, 7, 9, ${trailAlpha})`
          : `rgba(255, 255, 255, ${trailAlpha})`;
      ctx.fillRect(0, 0, W, H);

      ctx.font = `500 12px "JetBrains Mono", "Manrope", monospace`;
      for (const s of streams) {
        s.y += s.v;
        if (ts - s.nextGlyph > 90) {
          s.glyph = glyphs[Math.floor(Math.random() * glyphs.length)];
          s.nextGlyph = ts;
        }
        // Head bright, tail fades
        for (let k = 0; k < s.len; k++) {
          const alpha = (1 - k / s.len) * (tone === "dark" ? 0.85 : 0.35);
          ctx.fillStyle = `rgba(${baseColor}, ${alpha})`;
          ctx.fillText(s.glyph, s.x, s.y - k * 12);
        }
        if (s.y > H + s.len * 12) {
          s.y = -Math.random() * 60;
          s.v = 0.6 + Math.random() * 1.4;
          s.len = 14 + Math.random() * 22;
        }
      }
    };
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [tone, density]);

  return (
    <canvas
      ref={canvasRef}
      className={`sc-fx-canvas sc-fx-canvas--stream sc-fx-canvas--${tone}`}
      aria-hidden="true"
    />
  );
};

export default DataStreamFlow;
