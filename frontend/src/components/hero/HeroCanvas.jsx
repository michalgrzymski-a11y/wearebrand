import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * HeroCanvas
 * A high-performance Three.js particle + line network with:
 *  - moving constellation of "server nodes" (mint particles)
 *  - dynamic connecting lines that fade with distance
 *  - subtle react-to-mouse camera parallax
 *  - background stays the CSS parent color (#0C5C62) -> renderer uses alpha
 */
const PRIMARY = 0x0c5c62;
const MINT = 0x49ada5;

const HeroCanvas = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // ---- Scene / Camera / Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(PRIMARY, 6, 22);

    const camera = new THREE.PerspectiveCamera(
      55,
      width / height,
      0.1,
      100,
    );
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // ---- Particle field (server nodes)
    const NODE_COUNT = 140;
    const positions = new Float32Array(NODE_COUNT * 3);
    const velocities = new Float32Array(NODE_COUNT * 3);

    for (let i = 0; i < NODE_COUNT; i++) {
      const i3 = i * 3;
      positions[i3 + 0] = (Math.random() - 0.5) * 14;
      positions[i3 + 1] = (Math.random() - 0.5) * 8;
      positions[i3 + 2] = (Math.random() - 0.5) * 6;
      velocities[i3 + 0] = (Math.random() - 0.5) * 0.0025;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.0025;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.0015;
    }

    const nodeGeom = new THREE.BufferGeometry();
    nodeGeom.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );

    // circular sprite texture for glow points
    const makeGlowTexture = () => {
      const size = 128;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      const grd = ctx.createRadialGradient(
        size / 2,
        size / 2,
        0,
        size / 2,
        size / 2,
        size / 2,
      );
      grd.addColorStop(0, "rgba(73,173,165,1)");
      grd.addColorStop(0.35, "rgba(73,173,165,0.65)");
      grd.addColorStop(1, "rgba(73,173,165,0)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, size, size);
      const tex = new THREE.CanvasTexture(canvas);
      tex.needsUpdate = true;
      return tex;
    };

    const nodeMat = new THREE.PointsMaterial({
      color: MINT,
      size: 0.14,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      map: makeGlowTexture(),
    });
    const points = new THREE.Points(nodeGeom, nodeMat);
    scene.add(points);

    // ---- Connecting lines (dynamic)
    const MAX_LINES = NODE_COUNT * 6;
    const linePositions = new Float32Array(MAX_LINES * 2 * 3);
    const lineColors = new Float32Array(MAX_LINES * 2 * 3);
    const lineGeom = new THREE.BufferGeometry();
    lineGeom.setAttribute(
      "position",
      new THREE.BufferAttribute(linePositions, 3).setUsage(
        THREE.DynamicDrawUsage,
      ),
    );
    lineGeom.setAttribute(
      "color",
      new THREE.BufferAttribute(lineColors, 3).setUsage(
        THREE.DynamicDrawUsage,
      ),
    );
    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const lines = new THREE.LineSegments(lineGeom, lineMat);
    scene.add(lines);

    // ---- Mouse interaction
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e) => {
      const rect = mount.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width;
      const cy = (e.clientY - rect.top) / rect.height;
      mouse.tx = (cx - 0.5) * 2;
      mouse.ty = (cy - 0.5) * 2;
    };
    mount.addEventListener("mousemove", onMove);
    mount.addEventListener("mouseleave", () => {
      mouse.tx = 0;
      mouse.ty = 0;
    });

    // ---- Resize
    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // ---- Animation loop
    const clock = new THREE.Clock();
    let raf = 0;

    const CONNECT_DIST = 1.6;
    const CONNECT_DIST_SQ = CONNECT_DIST * CONNECT_DIST;

    const animate = () => {
      const t = clock.getElapsedTime();

      // Smooth camera parallax follow
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      camera.position.x = mouse.x * 0.8;
      camera.position.y = -mouse.y * 0.5;
      camera.lookAt(0, 0, 0);

      // update node positions
      const pos = nodeGeom.attributes.position.array;
      for (let i = 0; i < NODE_COUNT; i++) {
        const i3 = i * 3;
        pos[i3 + 0] += velocities[i3 + 0];
        pos[i3 + 1] += velocities[i3 + 1];
        pos[i3 + 2] += velocities[i3 + 2];

        // bounce softly in bounds
        if (pos[i3 + 0] > 7 || pos[i3 + 0] < -7) velocities[i3 + 0] *= -1;
        if (pos[i3 + 1] > 4 || pos[i3 + 1] < -4) velocities[i3 + 1] *= -1;
        if (pos[i3 + 2] > 3 || pos[i3 + 2] < -3) velocities[i3 + 2] *= -1;

        // slow oscillation for organic feel
        pos[i3 + 1] += Math.sin(t * 0.6 + i) * 0.0006;
      }
      nodeGeom.attributes.position.needsUpdate = true;

      // Rebuild line segments each frame (bounded by MAX_LINES)
      let li = 0;
      let ci = 0;
      const linePos = lineGeom.attributes.position.array;
      const lineCol = lineGeom.attributes.color.array;
      let drawn = 0;
      for (let a = 0; a < NODE_COUNT && drawn < MAX_LINES; a++) {
        const a3 = a * 3;
        for (let b = a + 1; b < NODE_COUNT && drawn < MAX_LINES; b++) {
          const b3 = b * 3;
          const dx = pos[a3] - pos[b3];
          const dy = pos[a3 + 1] - pos[b3 + 1];
          const dz = pos[a3 + 2] - pos[b3 + 2];
          const dsq = dx * dx + dy * dy + dz * dz;
          if (dsq < CONNECT_DIST_SQ) {
            const alpha = 1 - dsq / CONNECT_DIST_SQ;
            linePos[li++] = pos[a3];
            linePos[li++] = pos[a3 + 1];
            linePos[li++] = pos[a3 + 2];
            linePos[li++] = pos[b3];
            linePos[li++] = pos[b3 + 1];
            linePos[li++] = pos[b3 + 2];

            // mint color, brighter when closer
            const r = (0x49 / 255) * alpha;
            const g = (0xad / 255) * alpha;
            const bl = (0xa5 / 255) * alpha;
            lineCol[ci++] = r;
            lineCol[ci++] = g;
            lineCol[ci++] = bl;
            lineCol[ci++] = r;
            lineCol[ci++] = g;
            lineCol[ci++] = bl;
            drawn++;
          }
        }
      }
      // zero out the rest so unused segments do not render at old coords
      while (li < linePos.length) linePos[li++] = 0;
      while (ci < lineCol.length) lineCol[ci++] = 0;

      lineGeom.setDrawRange(0, drawn * 2);
      lineGeom.attributes.position.needsUpdate = true;
      lineGeom.attributes.color.needsUpdate = true;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      mount.removeEventListener("mousemove", onMove);
      renderer.dispose();
      nodeGeom.dispose();
      lineGeom.dispose();
      nodeMat.map?.dispose();
      nodeMat.dispose();
      lineMat.dispose();
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

export default HeroCanvas;
