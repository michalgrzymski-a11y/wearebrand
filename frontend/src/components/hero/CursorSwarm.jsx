import React, { useEffect, useRef } from "react";

/**
 * CursorSwarm — a canvas of ~90 cyan particles that continuously drift toward
 * the cursor position (gentle attraction). On click, every particle is given
 * a strong outward impulse from the click point (radial scatter) before
 * gradually settling back into the swarm. Sits above the video layer as an
 * ambient decorative element that reacts to the visitor.
 */
const PARTICLE_COUNT = 90;

const CursorSwarm = () => {
  const canvasRef = useRef(null);
  const stateRef = useRef({ mx: -9999, my: -9999, particles: [] });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    const ctx = canvas.getContext("2d");
    const state = stateRef.current;
    let raf = 0;

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // Seed particles randomly across the hero area
    const seed = () => {
      const rect = parent.getBoundingClientRect();
      state.particles = new Array(PARTICLE_COUNT).fill(0).map(() => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: 0,
        vy: 0,
        size: 1 + Math.random() * 1.6,
        hue: 172 + Math.random() * 20, // cyan variance
      }));
    };

    const onMove = (e) => {
      const rect = parent.getBoundingClientRect();
      state.mx = e.clientX - rect.left;
      state.my = e.clientY - rect.top;
    };
    const onLeave = () => { state.mx = -9999; state.my = -9999; };

    const onClick = (e) => {
      const rect = parent.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      // Radial impulse — every particle gets kicked away from the click point
      state.particles.forEach((p) => {
        const dx = p.x - cx;
        const dy = p.y - cy;
        const d = Math.max(6, Math.hypot(dx, dy));
        const force = 260 / d;
        p.vx += (dx / d) * force;
        p.vy += (dy / d) * force;
      });
    };

    const step = () => {
      const rect = parent.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      const { mx, my, particles } = state;
      const hasCursor = mx > -1000;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        // Attraction toward cursor (or gentle random drift if no cursor)
        if (hasCursor) {
          const dx = mx - p.x;
          const dy = my - p.y;
          const d = Math.max(1, Math.hypot(dx, dy));
          const pull = Math.min(0.14, 8 / d);
          p.vx += (dx / d) * pull;
          p.vy += (dy / d) * pull;
        }
        // Damping so velocity settles back
        p.vx *= 0.94;
        p.vy *= 0.94;
        p.x += p.vx;
        p.y += p.vy;
        // Wrap around edges softly
        if (p.x < -10) p.x = rect.width + 10;
        if (p.x > rect.width + 10) p.x = -10;
        if (p.y < -10) p.y = rect.height + 10;
        if (p.y > rect.height + 10) p.y = -10;

        // Draw dot with glow
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 6);
        g.addColorStop(0, `hsla(${p.hue}, 100%, 65%, 0.95)`);
        g.addColorStop(0.4, `hsla(${p.hue}, 100%, 55%, 0.35)`);
        g.addColorStop(1, "hsla(180, 100%, 50%, 0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `hsl(${p.hue}, 100%, 78%)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(step);
    };

    resize();
    seed();
    step();
    window.addEventListener("resize", resize);
    parent.addEventListener("mousemove", onMove);
    parent.addEventListener("mouseleave", onLeave);
    parent.addEventListener("click", onClick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      parent.removeEventListener("mousemove", onMove);
      parent.removeEventListener("mouseleave", onLeave);
      parent.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="sc-hero-swarm"
      aria-hidden="true"
      data-testid="hero-swarm"
    />
  );
};

export default CursorSwarm;
