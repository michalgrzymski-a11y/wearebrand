import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * AmbientHeroScene
 *  Full-bleed WebGL background for the Hero — no frame, no boundaries.
 *
 *  Layer A — Ambient Data Streams:
 *    • 9 elegant bezier curves stretched across the whole hero
 *    • Each is a thin TubeGeometry with additive-blended mint material
 *    • 2 glowing packet spheres travel along each curve at different speeds
 *
 *  Layer B — Holographic Panels (subtle depth cue):
 *    • 4 translucent panels floating in the far background
 *    • Each has a canvas-drawn grid + label texture (very low opacity)
 *    • Slowly drift on Y and rotate a hair on X — feel of holographic layers
 *
 *  Layer C — Ambient dust particles (very light)
 *
 *  All rendered in one Three.js scene, no discrete device meshes,
 *  no hard boundaries, no interactive labels. Reacts subtly to mouse.
 */

const ACCENT = 0x49ada5;
const ACCENT_HEX = "#49ADA5";

const AmbientHeroScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    // Scene / Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x060b12, 12, 34);

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 14);
    camera.lookAt(0, 0, 0);

    // Soft light
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));

    // ---------- Layer B: Holographic panels (deep background) ----------
    const panels = [];
    const PANEL_META = [
      { label: "COMPUTE",  z: -8, y:  1.2, x: -6.0 },
      { label: "STORAGE",  z: -6, y: -1.4, x:  6.0 },
      { label: "NETWORK",  z: -5, y:  1.8, x:  5.0 },
      { label: "SECURITY", z: -4, y: -1.0, x: -5.0 },
    ];

    const makePanelTexture = (label) => {
      const c = document.createElement("canvas");
      c.width = 512;
      c.height = 320;
      const ctx = c.getContext("2d");

      // Faint grid
      ctx.strokeStyle = "rgba(73,173,165,0.35)";
      ctx.lineWidth = 1;
      const step = 32;
      for (let x = 0; x <= c.width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, c.height);
        ctx.stroke();
      }
      for (let y = 0; y <= c.height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(c.width, y);
        ctx.stroke();
      }

      // Corner brackets
      ctx.strokeStyle = "rgba(73,173,165,0.9)";
      ctx.lineWidth = 2;
      const brk = 40;
      const corners = [
        [0, 0, 1, 1],
        [c.width, 0, -1, 1],
        [0, c.height, 1, -1],
        [c.width, c.height, -1, -1],
      ];
      corners.forEach(([x, y, dx, dy]) => {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + brk * dx, y);
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + brk * dy);
        ctx.stroke();
      });

      // Label
      ctx.fillStyle = ACCENT_HEX;
      ctx.font = "700 42px Manrope, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(label, 30, 100);

      // Sub info line
      ctx.fillStyle = "rgba(73,173,165,0.55)";
      ctx.font = "500 20px Manrope, sans-serif";
      ctx.fillText("LAYER · ACTIVE", 30, 140);

      // Fake data bars
      ctx.fillStyle = "rgba(73,173,165,0.35)";
      for (let i = 0; i < 6; i++) {
        const w = 60 + Math.random() * 220;
        ctx.fillRect(30, 180 + i * 20, w, 8);
      }

      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };

    PANEL_META.forEach((meta, i) => {
      const tex = makePanelTexture(meta.label);
      const mat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        opacity: 0.14,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const geom = new THREE.PlaneGeometry(4.2, 2.6);
      const panel = new THREE.Mesh(geom, mat);
      panel.position.set(meta.x, meta.y, meta.z);
      panel.rotation.y = (meta.x > 0 ? -1 : 1) * 0.35;
      panel.rotation.x = -0.08;
      panel.userData.base = { y: meta.y, x: meta.x };
      panel.userData.phase = i * 0.7;
      scene.add(panel);
      panels.push(panel);
    });

    // ---------- Layer A: Data streams ----------
    // Each stream is a curve stretched roughly horizontally across the hero.
    // Control points are randomised inside broad bands for organic variety.
    const STREAM_COUNT = 9;
    const streams = [];
    const packets = [];

    const makeCurve = (i) => {
      // Y band varies per stream to distribute vertically
      const yBand = -3 + (i / (STREAM_COUNT - 1)) * 6;
      const jitter = () => (Math.random() - 0.5) * 1.6;
      const pts = [
        new THREE.Vector3(-14, yBand + jitter(), -1 + Math.random() * 2),
        new THREE.Vector3(-6, yBand + jitter() * 1.2, -0.5 + Math.random() * 1.5),
        new THREE.Vector3(0, yBand + jitter() * 1.5, 0 + Math.random() * 1.5),
        new THREE.Vector3(6, yBand + jitter() * 1.2, 0.5 + Math.random() * 1.5),
        new THREE.Vector3(14, yBand + jitter(), -1 + Math.random() * 2),
      ];
      return new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.5);
    };

    for (let i = 0; i < STREAM_COUNT; i++) {
      const curve = makeCurve(i);
      const geom = new THREE.TubeGeometry(curve, 120, 0.018, 6, false);
      const mat = new THREE.MeshBasicMaterial({
        color: ACCENT,
        transparent: true,
        opacity: 0.35 + Math.random() * 0.2,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const tube = new THREE.Mesh(geom, mat);
      scene.add(tube);
      streams.push({ tube, curve, mat, baseOpacity: mat.opacity });

      // 2–3 packets per stream at different phases
      const packetCount = 2 + (i % 2);
      for (let k = 0; k < packetCount; k++) {
        const size = 0.06 + Math.random() * 0.05;
        const pkt = new THREE.Mesh(
          new THREE.SphereGeometry(size, 10, 10),
          new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.95,
            blending: THREE.AdditiveBlending,
          }),
        );
        scene.add(pkt);
        packets.push({
          mesh: pkt,
          curve,
          phase: k / packetCount + Math.random() * 0.15,
          speed: 0.06 + Math.random() * 0.09,
        });
      }
    }

    // ---------- Layer C: Ambient dust ----------
    const DUST_COUNT = 160;
    const dustPos = new Float32Array(DUST_COUNT * 3);
    for (let i = 0; i < DUST_COUNT; i++) {
      dustPos[i * 3 + 0] = (Math.random() - 0.5) * 26;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
    }
    const dustGeom = new THREE.BufferGeometry();
    dustGeom.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));

    const spriteCanvas = document.createElement("canvas");
    spriteCanvas.width = 64;
    spriteCanvas.height = 64;
    const sctx = spriteCanvas.getContext("2d");
    const grd = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, "rgba(73,173,165,1)");
    grd.addColorStop(0.5, "rgba(73,173,165,0.4)");
    grd.addColorStop(1, "rgba(73,173,165,0)");
    sctx.fillStyle = grd;
    sctx.fillRect(0, 0, 64, 64);
    const dustTex = new THREE.CanvasTexture(spriteCanvas);

    const dustMat = new THREE.PointsMaterial({
      color: ACCENT,
      size: 0.08,
      map: dustTex,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const dust = new THREE.Points(dustGeom, dustMat);
    scene.add(dust);

    // ---------- Mouse parallax ----------
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e) => {
      const r = mount.getBoundingClientRect();
      mouse.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      mouse.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    const onLeave = () => {
      mouse.tx = 0;
      mouse.ty = 0;
    };
    mount.addEventListener("mousemove", onMove);
    mount.addEventListener("mouseleave", onLeave);

    // ---------- Resize ----------
    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // ---------- Animation loop ----------
    const clock = new THREE.Clock();
    let lastT = 0;

    const animate = () => {
      const t = clock.getElapsedTime();
      const dt = Math.min(t - lastT, 0.05);
      lastT = t;

      // Camera parallax
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      camera.position.x = mouse.x * 0.6;
      camera.position.y = 0.4 - mouse.y * 0.4;
      camera.lookAt(0, 0, 0);

      // Holographic panels drift
      panels.forEach((p) => {
        const wave = Math.sin(t * 0.4 + p.userData.phase) * 0.2;
        p.position.y = p.userData.base.y + wave;
        p.rotation.z = wave * 0.03;
        // Subtle opacity pulse
        p.material.opacity = 0.12 + (Math.sin(t * 0.6 + p.userData.phase) + 1) * 0.02;
      });

      // Stream opacity breathing
      streams.forEach((s, i) => {
        const breath = (Math.sin(t * 0.5 + i) + 1) * 0.5;
        s.mat.opacity = s.baseOpacity * (0.7 + breath * 0.3);
      });

      // Packets flow along curves
      packets.forEach((p) => {
        p.phase = (p.phase + dt * p.speed) % 1;
        const pt = p.curve.getPointAt(p.phase);
        p.mesh.position.copy(pt);
        // Fade in/out at ends for graceful entry/exit
        const edge = Math.min(p.phase, 1 - p.phase);
        p.mesh.material.opacity = Math.min(1, edge * 5);
      });

      // Dust drift
      const dp = dustGeom.attributes.position.array;
      for (let i = 0; i < DUST_COUNT; i++) {
        dp[i * 3 + 0] += 0.003;
        if (dp[i * 3 + 0] > 13) dp[i * 3 + 0] = -13;
        dp[i * 3 + 1] += Math.sin(t * 0.3 + i) * 0.0006;
      }
      dustGeom.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };
    renderer.setAnimationLoop(animate);

    // ---------- Cleanup ----------
    return () => {
      renderer.setAnimationLoop(null);
      window.removeEventListener("resize", onResize);
      mount.removeEventListener("mousemove", onMove);
      mount.removeEventListener("mouseleave", onLeave);
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      data-testid="hero-webgl-canvas"
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  );
};

export default AmbientHeroScene;
