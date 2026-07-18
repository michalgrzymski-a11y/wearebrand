import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Ambient background particle layer for the Hero.
 * Very light — the topology is the star.  This just provides depth.
 */
const HeroAmbient = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0c5c62, 8, 24);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Dust particles
    const COUNT = 220;
    const positions = new Float32Array(COUNT * 3);
    const speeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      speeds[i] = 0.0008 + Math.random() * 0.0022;
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Circular glow texture
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    const grd = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, "rgba(73,173,165,1)");
    grd.addColorStop(0.4, "rgba(73,173,165,0.5)");
    grd.addColorStop(1, "rgba(73,173,165,0)");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);

    const mat = new THREE.PointsMaterial({
      color: 0x49ada5,
      size: 0.09,
      map: tex,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geom, mat);
    scene.add(points);

    // Faint horizontal light-rays
    const rayGeom = new THREE.BufferGeometry();
    const rayPos = new Float32Array(4 * 2 * 3);
    // 4 subtle horizontal lines across the space
    for (let i = 0; i < 4; i++) {
      const y = -3 + i * 2;
      rayPos[i * 6 + 0] = -12;
      rayPos[i * 6 + 1] = y;
      rayPos[i * 6 + 2] = -3 - i * 0.5;
      rayPos[i * 6 + 3] = 12;
      rayPos[i * 6 + 4] = y;
      rayPos[i * 6 + 5] = -3 - i * 0.5;
    }
    rayGeom.setAttribute("position", new THREE.BufferAttribute(rayPos, 3));
    const rayMat = new THREE.LineBasicMaterial({
      color: 0x49ada5,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
    });
    scene.add(new THREE.LineSegments(rayGeom, rayMat));

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e) => {
      const r = mount.getBoundingClientRect();
      mouse.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      mouse.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    mount.addEventListener("mousemove", onMove);
    mount.addEventListener("mouseleave", () => {
      mouse.tx = 0;
      mouse.ty = 0;
    });

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    let raf = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      const t = clock.getElapsedTime();
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      camera.position.x = mouse.x * 0.6;
      camera.position.y = -mouse.y * 0.35;
      camera.lookAt(0, 0, 0);

      const arr = geom.attributes.position.array;
      for (let i = 0; i < COUNT; i++) {
        arr[i * 3 + 0] += speeds[i];
        arr[i * 3 + 1] += Math.sin(t * 0.4 + i) * 0.0006;
        if (arr[i * 3 + 0] > 11) arr[i * 3 + 0] = -11;
      }
      geom.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      mount.removeEventListener("mousemove", onMove);
      geom.dispose();
      mat.dispose();
      tex.dispose();
      rayGeom.dispose();
      rayMat.dispose();
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
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
};

export default HeroAmbient;
