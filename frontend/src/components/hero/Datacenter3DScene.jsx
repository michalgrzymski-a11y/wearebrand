import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  Server,
  HardDrive,
  ShieldCheck,
  Network,
  DatabaseBackup,
  LifeBuoy,
} from "lucide-react";

/**
 * Datacenter3DScene
 *  - Full WebGL scene: 1 central core cube + 6 satellite devices on an orbit ring
 *  - Curved TubeGeometry connections with animated "packet" spheres flowing along them
 *  - Grid floor, orbital ring, atmospheric particles, subtle camera auto-orbit
 *  - Raycaster hover: highlight device, boost its connection glow
 *  - HTML labels projected from 3D world positions (react to hover)
 */

const PRIMARY_COLOR = 0x0c5c62;
const ACCENT_COLOR = 0x49ada5;

const DEVICE_META = [
  { id: "server",   Icon: Server,         pl: "Serwery",  en: "Servers",  sub_pl: "Compute",    sub_en: "Compute" },
  { id: "storage",  Icon: HardDrive,      pl: "Storage",  en: "Storage",  sub_pl: "NetApp",     sub_en: "NetApp" },
  { id: "network",  Icon: Network,        pl: "Sieć",     en: "Network",  sub_pl: "SDN / FW",   sub_en: "SDN / FW" },
  { id: "dr",       Icon: LifeBuoy,       pl: "DR Site",  en: "DR Site",  sub_pl: "Disaster R.", sub_en: "Disaster R." },
  { id: "backup",   Icon: DatabaseBackup, pl: "Backup",   en: "Backup",   sub_pl: "LTO / Dedup", sub_en: "LTO / Dedup" },
  { id: "security", Icon: ShieldCheck,    pl: "Security", en: "Security", sub_pl: "DLP / IDM",  sub_en: "DLP / IDM" },
];

/** React label rendered above each device using an absolutely-positioned overlay. */
// (Inlined into main component with ref-based positioning for stability.)

const Datacenter3DScene = ({ lang = "pl" }) => {
  const mountRef = useRef(null);
  const labelRefs = useRef({});
  const labelHoveredRef = useRef(null); // id of currently label-hovered node
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const hoveredRef = useRef(null);
  const selectedRef = useRef(null);

  useEffect(() => {
    hoveredRef.current = hovered;
  }, [hovered]);
  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  // Wrappers so label onMouseEnter/Leave also updates the ref immediately
  const enterLabel = (id) => {
    labelHoveredRef.current = id;
    setHovered(id);
  };
  const leaveLabel = () => {
    labelHoveredRef.current = null;
    setHovered(null);
  };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // ---- Renderer / Scene / Camera
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x060b12, 8, 28);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 5.8, 11);
    camera.lookAt(0, 0.5, 0);

    // ---- Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const key = new THREE.DirectionalLight(0xffffff, 0.9);
    key.position.set(6, 10, 6);
    scene.add(key);
    const rim = new THREE.PointLight(ACCENT_COLOR, 3.0, 20, 1.5);
    rim.position.set(0, 3, 0);
    scene.add(rim);

    // ---- Grid floor (subtle)
    const grid = new THREE.GridHelper(24, 24, ACCENT_COLOR, ACCENT_COLOR);
    grid.position.y = -1.4;
    grid.material.transparent = true;
    grid.material.opacity = 0.14;
    scene.add(grid);

    // Faint circular disc under the core
    const discGeom = new THREE.CircleGeometry(4.6, 64);
    const discMat = new THREE.MeshBasicMaterial({
      color: ACCENT_COLOR,
      transparent: true,
      opacity: 0.05,
      side: THREE.DoubleSide,
    });
    const disc = new THREE.Mesh(discGeom, discMat);
    disc.rotation.x = -Math.PI / 2;
    disc.position.y = -1.39;
    scene.add(disc);

    // ---- Central "Core" — glass cube with wireframe + spinning rings
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    const coreGeom = new THREE.BoxGeometry(1.6, 1.6, 1.6);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f3a3f,
      emissive: ACCENT_COLOR,
      emissiveIntensity: 0.4,
      metalness: 0.7,
      roughness: 0.25,
      transparent: true,
      opacity: 0.9,
    });
    const coreMesh = new THREE.Mesh(coreGeom, coreMat);
    coreGroup.add(coreMesh);

    // Wireframe overlay
    const coreWire = new THREE.LineSegments(
      new THREE.EdgesGeometry(coreGeom),
      new THREE.LineBasicMaterial({
        color: ACCENT_COLOR,
        transparent: true,
        opacity: 0.9,
      }),
    );
    coreGroup.add(coreWire);

    // Rotating rings around the core
    const ringMatA = new THREE.MeshBasicMaterial({ color: ACCENT_COLOR, transparent: true, opacity: 0.6, side: THREE.DoubleSide });
    const ringMatB = new THREE.MeshBasicMaterial({ color: ACCENT_COLOR, transparent: true, opacity: 0.35, side: THREE.DoubleSide });
    const ringMatC = new THREE.MeshBasicMaterial({ color: ACCENT_COLOR, transparent: true, opacity: 0.2, side: THREE.DoubleSide });
    const ringA = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.02, 8, 96), ringMatA);
    const ringB = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.02, 8, 96), ringMatB);
    const ringC = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.015, 8, 96), ringMatC);
    ringA.rotation.x = Math.PI / 2.3;
    ringB.rotation.x = Math.PI / 3;
    ringB.rotation.y = Math.PI / 4;
    ringC.rotation.x = Math.PI / 2.1;
    ringC.rotation.z = Math.PI / 5;
    coreGroup.add(ringA, ringB, ringC);

    // ---- Satellite devices arranged around the core
    const RADIUS = 4.2;
    const deviceGroups = {}; // id -> THREE.Group
    const deviceMeshes = []; // for raycasting

    DEVICE_META.forEach((meta, i) => {
      const angle = (i / DEVICE_META.length) * Math.PI * 2 + Math.PI / 6;
      const x = Math.cos(angle) * RADIUS;
      const z = Math.sin(angle) * RADIUS;
      const y = 0;

      const g = new THREE.Group();
      g.position.set(x, y, z);
      g.userData = { id: meta.id, baseScale: 1, targetScale: 1 };

      // Device body — small server rack style prism
      const bodyGeom = new THREE.BoxGeometry(0.95, 1.1, 0.65);
      const bodyMat = new THREE.MeshPhysicalMaterial({
        color: 0x0a1a24,
        emissive: 0x0c5c62,
        emissiveIntensity: 0.35,
        metalness: 0.7,
        roughness: 0.35,
      });
      const body = new THREE.Mesh(bodyGeom, bodyMat);
      body.userData.deviceId = meta.id;
      body.userData.role = "body";
      g.add(body);
      deviceMeshes.push(body);

      // Edge outline
      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(bodyGeom),
        new THREE.LineBasicMaterial({
          color: ACCENT_COLOR,
          transparent: true,
          opacity: 0.7,
        }),
      );
      g.add(edges);

      // Top glowing LED strip
      const ledGeom = new THREE.BoxGeometry(0.7, 0.03, 0.5);
      const ledMat = new THREE.MeshBasicMaterial({
        color: ACCENT_COLOR,
        transparent: true,
        opacity: 0.9,
      });
      const led = new THREE.Mesh(ledGeom, ledMat);
      led.position.y = 0.58;
      g.add(led);

      // Base "shadow" glow
      const under = new THREE.Mesh(
        new THREE.CircleGeometry(0.85, 32),
        new THREE.MeshBasicMaterial({
          color: ACCENT_COLOR,
          transparent: true,
          opacity: 0.18,
        }),
      );
      under.rotation.x = -Math.PI / 2;
      under.position.y = -0.55;
      g.add(under);

      // subtle rack lines on the front face (3 horizontal grooves)
      for (let l = 0; l < 3; l++) {
        const groove = new THREE.Mesh(
          new THREE.BoxGeometry(0.85, 0.02, 0.01),
          new THREE.MeshBasicMaterial({
            color: 0x49ada5,
            transparent: true,
            opacity: 0.7,
          }),
        );
        groove.position.set(0, 0.25 - l * 0.28, 0.331);
        g.add(groove);
      }

      scene.add(g);
      deviceGroups[meta.id] = g;
    });

    // ---- Connections (tubes) core <-> each satellite + a couple satellite pairs
    const CONNECTIONS = [
      ["server", "core"],
      ["storage", "core"],
      ["network", "core"],
      ["dr", "core"],
      ["backup", "core"],
      ["security", "core"],
      ["backup", "dr"],
      ["server", "storage"],
      ["security", "network"],
    ];

    const getPos = (id) => {
      if (id === "core") return new THREE.Vector3(0, 0.3, 0);
      return deviceGroups[id].position.clone().setY(0.3);
    };

    const tubes = []; // { tube, curve, pair, mat }
    const packets = []; // moving spheres

    CONNECTIONS.forEach(([a, b]) => {
      const pa = getPos(a);
      const pb = getPos(b);
      const mid = pa.clone().add(pb).multiplyScalar(0.5);
      mid.y += 1.0; // arc up
      const curve = new THREE.CatmullRomCurve3([pa, mid, pb]);
      const geom = new THREE.TubeGeometry(curve, 40, 0.025, 8, false);
      const mat = new THREE.MeshBasicMaterial({
        color: ACCENT_COLOR,
        transparent: true,
        opacity: 0.55,
      });
      const tube = new THREE.Mesh(geom, mat);
      scene.add(tube);
      tubes.push({ tube, curve, pair: [a, b], mat });

      // 2 packets per tube at different phases
      for (let k = 0; k < 2; k++) {
        const pkt = new THREE.Mesh(
          new THREE.SphereGeometry(0.08, 12, 12),
          new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 1,
          }),
        );
        scene.add(pkt);
        packets.push({
          mesh: pkt,
          curve,
          phase: (k / 2 + Math.random() * 0.2) % 1,
          speed: 0.14 + Math.random() * 0.08,
          pair: [a, b],
        });
      }
    });

    // ---- Ambient dust particles
    const DUST_COUNT = 180;
    const dustPos = new Float32Array(DUST_COUNT * 3);
    for (let i = 0; i < DUST_COUNT; i++) {
      dustPos[i * 3 + 0] = (Math.random() - 0.5) * 18;
      dustPos[i * 3 + 1] = Math.random() * 6 - 1;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    const dustGeom = new THREE.BufferGeometry();
    dustGeom.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));

    // Small sprite texture
    const spriteCanvas = document.createElement("canvas");
    spriteCanvas.width = 64;
    spriteCanvas.height = 64;
    const sctx = spriteCanvas.getContext("2d");
    const sg = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    sg.addColorStop(0, "rgba(73,173,165,1)");
    sg.addColorStop(0.5, "rgba(73,173,165,0.4)");
    sg.addColorStop(1, "rgba(73,173,165,0)");
    sctx.fillStyle = sg;
    sctx.fillRect(0, 0, 64, 64);
    const dustTex = new THREE.CanvasTexture(spriteCanvas);

    const dustMat = new THREE.PointsMaterial({
      color: ACCENT_COLOR,
      size: 0.08,
      map: dustTex,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const dust = new THREE.Points(dustGeom, dustMat);
    scene.add(dust);

    // ---- Raycaster for hover
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2(0, 0);
    let isMouseInside = false;
    const targetCam = { x: 0, y: 0 };

    const onMove = (e) => {
      const rect = mount.getBoundingClientRect();
      ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      isMouseInside = true;
      targetCam.x = ndc.x * 0.6;
      targetCam.y = ndc.y * 0.35;
    };
    const onLeave = () => {
      isMouseInside = false;
      targetCam.x = 0;
      targetCam.y = 0;
      setHovered((prev) => prev); // no-op, hover comes from labels also
    };
    mount.addEventListener("mousemove", onMove);
    mount.addEventListener("mouseleave", onLeave);

    // Click-to-select on canvas
    const onClick = () => {
      if (hoveredRef.current) {
        setSelected((s) => (s === hoveredRef.current ? null : hoveredRef.current));
      }
    };
    mount.addEventListener("click", onClick);

    // ---- Resize
    const onResize = () => {
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
    const camBase = new THREE.Vector3(0, 5.8, 11);
    let smoothCamX = 0;
    let smoothCamY = 0;

    const updateLabelPositions = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      DEVICE_META.forEach((m) => {
        const g = deviceGroups[m.id];
        const el = labelRefs.current[m.id];
        if (!g || !el) return;
        const p = g.position.clone();
        p.y += 1.05;
        const projected = p.project(camera);
        const x = Math.round((projected.x * 0.5 + 0.5) * w);
        const y = Math.round((-projected.y * 0.5 + 0.5) * h);
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
      });
      const coreEl = labelRefs.current["core"];
      if (coreEl) {
        const cp = new THREE.Vector3(0, 1.3, 0).project(camera);
        coreEl.style.left = `${Math.round((cp.x * 0.5 + 0.5) * w)}px`;
        coreEl.style.top = `${Math.round((-cp.y * 0.5 + 0.5) * h)}px`;
      }
    };

    const animate = () => {
      const t = clock.getElapsedTime();
      const dt = clock.getDelta();

      // Smooth camera lerp with subtle auto-orbit (paused when mouse inside)
      const orbit = t * 0.06;
      smoothCamX += (targetCam.x - smoothCamX) * 0.05;
      smoothCamY += (targetCam.y - smoothCamY) * 0.05;
      const orbitStrength = isMouseInside ? 0 : 1;
      const baseX = Math.sin(orbit) * 0.7 * orbitStrength;
      const baseZ = Math.cos(orbit) * 0.5 * orbitStrength;
      camera.position.set(
        camBase.x + smoothCamX * 2 + baseX,
        camBase.y + smoothCamY * 1.2,
        camBase.z + baseZ,
      );
      camera.lookAt(0, 0.5, 0);

      // Core rotation + hover pulse
      coreGroup.rotation.y += dt * 0.35;
      ringA.rotation.z += dt * 0.6;
      ringB.rotation.y += dt * 0.4;
      ringC.rotation.x += dt * 0.5;
      const corePulse = 1 + Math.sin(t * 1.6) * 0.03;
      coreMesh.scale.setScalar(corePulse);

      // Raycast for hover (only if no label is currently owning hover)
      let hoverId = labelHoveredRef.current;
      if (!hoverId) {
        raycaster.setFromCamera(ndc, camera);
        if (isMouseInside) {
          const hits = raycaster.intersectObjects(deviceMeshes, false);
          if (hits.length > 0) hoverId = hits[0].object.userData.deviceId;
        }
      }
      if (hoverId !== hoveredRef.current) {
        hoveredRef.current = hoverId;
        setHovered(hoverId);
      }

      // Device hover animation
      const activeId = hoverId || selectedRef.current;
      const bobActive = !isMouseInside;
      DEVICE_META.forEach((m) => {
        const g = deviceGroups[m.id];
        if (!g) return;
        const isActive = activeId === m.id;
        g.userData.targetScale = isActive ? 1.15 : 1;
        const s = g.scale.x;
        const targetS = g.userData.targetScale;
        const ns = s + (targetS - s) * 0.15;
        g.scale.setScalar(ns);
        // gentle bob (paused when interacting)
        if (bobActive) {
          g.position.y = Math.sin(t * 0.9 + m.id.charCodeAt(0)) * 0.06;
        } else {
          g.position.y += (0 - g.position.y) * 0.12;
        }
      });

      // Tube glow — brighter when active
      tubes.forEach(({ mat, pair }) => {
        const isLit =
          !activeId ||
          pair.includes(activeId) ||
          (activeId === "core" && pair.includes("core"));
        const target = isLit ? 0.85 : 0.18;
        mat.opacity += (target - mat.opacity) * 0.1;
      });

      // Packets — travel along curves
      packets.forEach((p) => {
        p.phase = (p.phase + dt * p.speed) % 1;
        const pt = p.curve.getPointAt(p.phase);
        p.mesh.position.copy(pt);
        const isLit =
          !activeId ||
          p.pair.includes(activeId) ||
          (activeId === "core" && p.pair.includes("core"));
        p.mesh.material.opacity += ((isLit ? 1 : 0.15) - p.mesh.material.opacity) * 0.15;
        p.mesh.scale.setScalar(isLit ? 1.15 : 0.7);
      });

      // Dust drift
      const dpos = dustGeom.attributes.position.array;
      for (let i = 0; i < DUST_COUNT; i++) {
        dpos[i * 3 + 1] += 0.0015;
        if (dpos[i * 3 + 1] > 5) dpos[i * 3 + 1] = -1.4;
      }
      dustGeom.attributes.position.needsUpdate = true;

      // Rim light follow-camera
      rim.position.set(camera.position.x * 0.4, 3, camera.position.z * 0.4);

      updateLabelPositions();

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    // ---- Cleanup
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      mount.removeEventListener("mousemove", onMove);
      mount.removeEventListener("mouseleave", onLeave);
      mount.removeEventListener("click", onClick);
      renderer.dispose();
      dustGeom.dispose();
      dustMat.dispose();
      dustTex.dispose();
      coreGeom.dispose();
      coreMat.dispose();
      ringMatA.dispose();
      ringMatB.dispose();
      ringMatC.dispose();
      discGeom.dispose();
      discMat.dispose();
      tubes.forEach(({ tube, mat }) => {
        tube.geometry.dispose();
        mat.dispose();
      });
      packets.forEach((p) => {
        p.mesh.geometry.dispose();
        p.mesh.material.dispose();
      });
      Object.values(deviceGroups).forEach((g) => {
        g.traverse((obj) => {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
            else obj.material.dispose();
          }
        });
      });
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  const activeId = hovered || selected;

  return (
    <div className="sc-3d" data-testid="hero-topology">
      <div ref={mountRef} className="sc-3d__canvas" data-testid="hero-webgl-canvas" />

      {/* Labels overlay — position updated via ref every frame */}
      {DEVICE_META.map((m) => {
        const isActive = activeId === m.id;
        const isDim = activeId && activeId !== m.id && activeId !== "core";
        const Icon = m.Icon;
        return (
          <button
            key={m.id}
            ref={(el) => {
              labelRefs.current[m.id] = el;
            }}
            type="button"
            data-testid={`topo-node-${m.id}`}
            onMouseEnter={() => enterLabel(m.id)}
            onMouseLeave={() => leaveLabel()}
            onClick={() => setSelected((s) => (s === m.id ? null : m.id))}
            style={{ transform: "translate(-50%, -110%)" }}
            className={`sc-3d-label ${isActive ? "is-active" : ""} ${isDim ? "is-dim" : ""}`}
            aria-label={lang === "pl" ? m.pl : m.en}
          >
            <span className="sc-3d-label__icon">
              <Icon size={14} strokeWidth={2} />
            </span>
            <span className="sc-3d-label__body">
              <span className="sc-3d-label__name">{lang === "pl" ? m.pl : m.en}</span>
              <span className="sc-3d-label__sub">{lang === "pl" ? m.sub_pl : m.sub_en}</span>
            </span>
          </button>
        );
      })}

      {/* Core label */}
      <div
        ref={(el) => {
          labelRefs.current["core"] = el;
        }}
        data-testid="topo-node-core"
        className={`sc-3d-core-label ${activeId === "core" ? "is-active" : ""}`}
        style={{ transform: "translate(-50%, -50%)" }}
        onMouseEnter={() => enterLabel("core")}
        onMouseLeave={() => leaveLabel()}
        onClick={() =>
          setSelected((s) => (s === "core" ? null : "core"))
        }
      >
        <span className="sc-3d-core-label__inner">DATACENTER</span>
        <span className="sc-3d-core-label__sub">
          {lang === "pl" ? "Rdzeń infrastruktury" : "Infrastructure core"}
        </span>
      </div>
    </div>
  );
};

export default Datacenter3DScene;
