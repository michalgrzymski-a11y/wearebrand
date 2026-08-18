import React, { useEffect, useRef } from "react";

/**
 * NeuralNodeNetwork — canvas particle network with lines between close nodes.
 * Optional mouse interaction: cursor becomes an attractor within a radius.
 *
 * Props:
 *  - color: primary node/line color (default "#00B8D4")
 *  - background: transparent | dark (positional only)
 *  - density: number of nodes (default 80, mobile falls back to 40)
 *  - interactive: enable mouse attraction (default false)
 *  - opacity: overall canvas opacity (default 0.7)
 */
const NeuralNodeNetwork = ({
  color = "#00B8D4",
  density = 80,
  interactive = false,
  opacity = 0.7,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const parent = canvas.parentElement;
    let raf = 0;
    let running = true;
    let W = 0, H = 0, dpr = Math.max(1, window.devicePixelRatio || 1);
    const nodes = [];
    const mouse = { x: -9999, y: -9999, active: false };

    const isMobile = window.matchMedia("(max-width: 700px)").matches;
    const count = isMobile ? Math.round(density * 0.5) : density;
    const linkDistance = isMobile ? 110 : 150;
    const mouseRadius = 180;

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
      nodes.length = 0;
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: 0.8 + Math.random() * 1.4,
        });
      }
    };

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => (running = e.isIntersecting)),
      { threshold: 0 },
    );
    io.observe(parent);

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };
    if (interactive) {
      parent.addEventListener("mousemove", onMove);
      parent.addEventListener("mouseleave", onLeave);
    }

    resize();
    seed();
    window.addEventListener("resize", resize);

    const step = () => {
      raf = requestAnimationFrame(step);
      if (!running) return;

      ctx.clearRect(0, 0, W, H);

      // Draw links first (under nodes)
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < linkDistance) {
            const alpha = (1 - d / linkDistance) * 0.35;
            ctx.strokeStyle = color;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Update + draw nodes
      for (const n of nodes) {
        // Attract to cursor
        if (interactive && mouse.active) {
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const d = Math.hypot(dx, dy);
          if (d < mouseRadius && d > 0.5) {
            const f = (1 - d / mouseRadius) * 0.14;
            n.vx += (dx / d) * f;
            n.vy += (dy / d) * f;
          }
        }
        n.x += n.vx;
        n.y += n.vy;
        // Wrap
        if (n.x < -20) n.x = W + 20;
        if (n.x > W + 20) n.x = -20;
        if (n.y < -20) n.y = H + 20;
        if (n.y > H + 20) n.y = -20;
        // Damping
        n.vx *= 0.985;
        n.vy *= 0.985;
        // Reseed a tiny drift so nodes never fully stop
        if (Math.abs(n.vx) + Math.abs(n.vy) < 0.05) {
          n.vx += (Math.random() - 0.5) * 0.15;
          n.vy += (Math.random() - 0.5) * 0.15;
        }

        ctx.globalAlpha = 0.9;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      if (interactive) {
        parent.removeEventListener("mousemove", onMove);
        parent.removeEventListener("mouseleave", onLeave);
      }
    };
  }, [color, density, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className="sc-fx-canvas"
      style={{ opacity }}
      aria-hidden="true"
    />
  );
};

export default NeuralNodeNetwork;
