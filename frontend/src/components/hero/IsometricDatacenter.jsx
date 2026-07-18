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
 * IsometricDatacenter
 *  - True isometric 3D scene composed of detailed device models
 *    (server rack, chip pedestals, storage stack, monitor, laptop, cloud)
 *  - OrthographicCamera for clean iso look, gentle scene rotation
 *  - Mint/teal circuit-trace connections with flowing packets
 *  - Interactive hover: raycaster + label overlay
 *  - Optimised: no per-frame React state, low DPR cap, single AmbientLight + 1 dir light,
 *    fewer particles, no shadow maps.
 */

const ACCENT = 0x49ada5;
const ACCENT_HEX = "#49ADA5";
const FRAME = 0x1a2431;
const PANEL = 0x2a3846;
const LIGHT = 0x3d5063;
const PLATE = 0x2e3d4c;

// -------------------------------------------------------------
// Device builders
// -------------------------------------------------------------
const buildEdge = (geometry, color = ACCENT, opacity = 0.55) =>
  new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry),
    new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false }),
  );

const buildServerRack = () => {
  const g = new THREE.Group();

  // Base
  const baseGeom = new THREE.BoxGeometry(1.7, 0.12, 1.2);
  const base = new THREE.Mesh(baseGeom, new THREE.MeshLambertMaterial({ color: PLATE }));
  base.position.y = 0.06;
  g.add(base, buildEdge(baseGeom));
  base.userData.baseSelf = true;

  // Frame
  const frameGeom = new THREE.BoxGeometry(1.5, 3.2, 1.0);
  const frame = new THREE.Mesh(frameGeom, new THREE.MeshLambertMaterial({ color: FRAME }));
  frame.position.y = 0.12 + 1.6;
  g.add(frame);
  const frameEdge = buildEdge(frameGeom, ACCENT, 0.7);
  frameEdge.position.copy(frame.position);
  g.add(frameEdge);

  // Server units stacked (visible on front face)
  const UNIT_COUNT = 8;
  const stackTop = frame.position.y + 1.5;
  const stackBottom = frame.position.y - 1.5;
  const gap = (stackTop - stackBottom) / UNIT_COUNT;
  const ledStrip = [];
  for (let i = 0; i < UNIT_COUNT; i++) {
    // Front panel of a server unit
    const y = stackBottom + gap * i + gap / 2;
    const panelGeom = new THREE.BoxGeometry(1.42, gap * 0.68, 0.02);
    const panel = new THREE.Mesh(
      panelGeom,
      new THREE.MeshLambertMaterial({ color: PANEL }),
    );
    panel.position.set(0, y, 0.51);
    g.add(panel);

    // Vents / grill (small horizontal lines on panel using edges)
    const vent = new THREE.Mesh(
      new THREE.BoxGeometry(0.85, 0.01, 0.005),
      new THREE.MeshBasicMaterial({ color: 0x0d1620 }),
    );
    vent.position.set(-0.15, y, 0.522);
    g.add(vent);

    // LED bar (right side of panel)
    const led = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, gap * 0.32, 0.01),
      new THREE.MeshBasicMaterial({ color: ACCENT }),
    );
    led.position.set(0.55, y, 0.523);
    g.add(led);
    ledStrip.push(led);

    // Small round LED dot (green pulse)
    const dotGeom = new THREE.CircleGeometry(0.022, 12);
    const dot = new THREE.Mesh(
      dotGeom,
      new THREE.MeshBasicMaterial({ color: 0xffffff }),
    );
    dot.position.set(0.42, y, 0.524);
    g.add(dot);
  }

  // Top vent (grille lines)
  for (let i = 0; i < 6; i++) {
    const v = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.02, 0.05),
      new THREE.MeshBasicMaterial({ color: 0x0d1620 }),
    );
    v.position.set(0, frame.position.y + 1.55, -0.35 + i * 0.14);
    g.add(v);
  }

  // Handles on top
  const handleMat = new THREE.MeshLambertMaterial({ color: 0x5a6b7a });
  for (let s = -1; s <= 1; s += 2) {
    const h = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.08, 0.5), handleMat);
    h.position.set(s * 0.5, frame.position.y + 1.66, 0);
    g.add(h);
  }

  g.userData.ledStrip = ledStrip;
  return g;
};

const buildChipPedestal = (opts = {}) => {
  const g = new THREE.Group();
  // 3 stacked plates
  const plates = 3;
  for (let i = 0; i < plates; i++) {
    const w = 1.4 - i * 0.08;
    const d = 1.4 - i * 0.08;
    const geom = new THREE.BoxGeometry(w, 0.09, d);
    const m = new THREE.Mesh(
      geom,
      new THREE.MeshLambertMaterial({ color: i === plates - 1 ? LIGHT : PLATE }),
    );
    m.position.y = 0.045 + i * 0.13;
    g.add(m, (() => { const e = buildEdge(geom); e.position.copy(m.position); return e; })());
  }
  // CPU square on top
  const cpuGeom = new THREE.BoxGeometry(0.75, 0.12, 0.75);
  const cpu = new THREE.Mesh(
    cpuGeom,
    new THREE.MeshLambertMaterial({
      color: 0x0e1a24,
      emissive: opts.emissive ?? ACCENT,
      emissiveIntensity: 0.55,
    }),
  );
  cpu.position.y = 0.045 + plates * 0.13 + 0.06;
  g.add(cpu);
  const cpuEdge = buildEdge(cpuGeom, ACCENT, 0.85);
  cpuEdge.position.copy(cpu.position);
  g.add(cpuEdge);

  // "chip circuits" cross on top of CPU (thin +)
  const trace1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.005, 0.03),
    new THREE.MeshBasicMaterial({ color: 0xffffff }),
  );
  trace1.position.set(0, cpu.position.y + 0.061, 0);
  const trace2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.03, 0.005, 0.5),
    new THREE.MeshBasicMaterial({ color: 0xffffff }),
  );
  trace2.position.set(0, cpu.position.y + 0.061, 0);
  g.add(trace1, trace2);

  // CPU pins (small boxes on sides)
  const pinCount = 6;
  const pinMat = new THREE.MeshBasicMaterial({ color: ACCENT });
  for (let i = 0; i < pinCount; i++) {
    const t = (i + 1) / (pinCount + 1);
    const off = -0.35 + t * 0.7;
    // top
    const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.02, 0.06), pinMat);
    p1.position.set(off, cpu.position.y, 0.4);
    // bottom
    const p2 = p1.clone();
    p2.position.set(off, cpu.position.y, -0.4);
    // left
    const p3 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.02, 0.05), pinMat);
    p3.position.set(-0.4, cpu.position.y, off);
    // right
    const p4 = p3.clone();
    p4.position.set(0.4, cpu.position.y, off);
    g.add(p1, p2, p3, p4);
  }
  return g;
};

const buildStorageStack = () => {
  const g = new THREE.Group();
  // 4 thin disks (as flat boxes) with spacing
  const disks = 4;
  for (let i = 0; i < disks; i++) {
    const w = 1.4 - i * 0.05;
    const geom = new THREE.BoxGeometry(w, 0.08, w * 0.9);
    const m = new THREE.Mesh(
      geom,
      new THREE.MeshLambertMaterial({ color: i % 2 === 0 ? PLATE : LIGHT }),
    );
    m.position.y = 0.06 + i * 0.16;
    g.add(m, (() => { const e = buildEdge(geom); e.position.copy(m.position); return e; })());
    // Top surface glow strip
    if (i === disks - 1) {
      const glow = new THREE.Mesh(
        new THREE.BoxGeometry(w * 0.7, 0.005, w * 0.05),
        new THREE.MeshBasicMaterial({ color: ACCENT }),
      );
      glow.position.set(0, m.position.y + 0.043, w * 0.2);
      g.add(glow);
    }
  }
  return g;
};

const buildMonitorTerminal = () => {
  const g = new THREE.Group();
  // Base 2 plates
  for (let i = 0; i < 2; i++) {
    const geom = new THREE.BoxGeometry(1.25, 0.08, 1.05);
    const m = new THREE.Mesh(geom, new THREE.MeshLambertMaterial({ color: i === 1 ? LIGHT : PLATE }));
    m.position.y = 0.04 + i * 0.13;
    g.add(m, (() => { const e = buildEdge(geom); e.position.copy(m.position); return e; })());
  }
  // Monitor body (slightly tilted back)
  const monGeom = new THREE.BoxGeometry(1.15, 0.9, 0.14);
  const monBody = new THREE.Mesh(monGeom, new THREE.MeshLambertMaterial({ color: FRAME }));
  monBody.position.y = 0.7;
  monBody.rotation.x = -0.15;
  g.add(monBody);
  const monEdge = buildEdge(monGeom, ACCENT, 0.7);
  monEdge.position.copy(monBody.position);
  monEdge.rotation.copy(monBody.rotation);
  g.add(monEdge);

  // Screen face
  const screenGeom = new THREE.PlaneGeometry(1.02, 0.78);
  const screenTex = (() => {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 196;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#04141b";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = ACCENT_HEX;
    ctx.font = "bold 12px Menlo, monospace";
    const lines = [
      "> ssh netapp.smartclout",
      "> systemctl status",
      "  active (running)",
      "> netstat -tulpn",
      "  tcp  0.0.0.0:443  LISTEN",
      "  tcp  0.0.0.0:22   LISTEN",
      "> tail -f /var/log/auth",
      "  session opened for user",
      "",
      "▮",
    ];
    lines.forEach((line, i) => ctx.fillText(line, 10, 20 + i * 18));
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  })();
  const screen = new THREE.Mesh(
    screenGeom,
    new THREE.MeshBasicMaterial({ map: screenTex, transparent: true }),
  );
  screen.position.copy(monBody.position);
  screen.rotation.copy(monBody.rotation);
  // push forward a hair
  screen.translateZ(0.075);
  g.add(screen);
  g.userData.screen = screen;
  g.userData.screenTex = screenTex;
  return g;
};

const buildLaptop = () => {
  const g = new THREE.Group();
  // Base
  const baseGeom = new THREE.BoxGeometry(1.4, 0.08, 0.95);
  const base = new THREE.Mesh(baseGeom, new THREE.MeshLambertMaterial({ color: LIGHT }));
  base.position.y = 0.04;
  g.add(base, buildEdge(baseGeom));

  // Keyboard area (dark rectangle)
  const kb = new THREE.Mesh(
    new THREE.BoxGeometry(1.15, 0.005, 0.55),
    new THREE.MeshBasicMaterial({ color: 0x121b26 }),
  );
  kb.position.set(0, 0.085, -0.1);
  g.add(kb);
  // Trackpad
  const tp = new THREE.Mesh(
    new THREE.BoxGeometry(0.45, 0.005, 0.22),
    new THREE.MeshBasicMaterial({ color: 0x1c2a36 }),
  );
  tp.position.set(0, 0.085, 0.25);
  g.add(tp);

  // Screen (opened at ~100°)
  const screenGeom = new THREE.BoxGeometry(1.4, 0.9, 0.05);
  const screen = new THREE.Mesh(screenGeom, new THREE.MeshLambertMaterial({ color: FRAME }));
  screen.position.set(0, 0.5, -0.44);
  screen.rotation.x = -0.35;
  g.add(screen);
  const screenEdge = buildEdge(screenGeom, ACCENT, 0.7);
  screenEdge.position.copy(screen.position);
  screenEdge.rotation.copy(screen.rotation);
  g.add(screenEdge);
  // Screen face (green terminal)
  const face = (() => {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 160;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#04141b";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = ACCENT_HEX;
    ctx.font = "bold 11px Menlo, monospace";
    const lines = [
      "sc:~$ deploy prod",
      "  ✓ build ok",
      "  ✓ tests 128/128",
      "  ✓ pushed",
      "sc:~$ monitor --live",
      "  cpu 32% mem 41%",
      "▮",
    ];
    lines.forEach((line, i) => ctx.fillText(line, 10, 20 + i * 18));
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  })();
  const screenFace = new THREE.Mesh(
    new THREE.PlaneGeometry(1.28, 0.8),
    new THREE.MeshBasicMaterial({ map: face, transparent: true }),
  );
  screenFace.position.copy(screen.position);
  screenFace.rotation.copy(screen.rotation);
  screenFace.translateZ(0.03);
  g.add(screenFace);
  g.userData.screenTex = face;
  return g;
};

const buildCloud = () => {
  const g = new THREE.Group();
  // Cloud = 3 spheres merged look
  const cloudMat = new THREE.MeshLambertMaterial({ color: 0x1c2a36 });
  const cloudEdgeMat = new THREE.LineBasicMaterial({
    color: ACCENT,
    transparent: true,
    opacity: 0.7,
  });
  const s1 = new THREE.Mesh(new THREE.SphereGeometry(0.45, 20, 16), cloudMat);
  s1.position.set(-0.3, 0.9, 0);
  const s2 = new THREE.Mesh(new THREE.SphereGeometry(0.55, 20, 16), cloudMat);
  s2.position.set(0.15, 1.0, 0);
  const s3 = new THREE.Mesh(new THREE.SphereGeometry(0.4, 20, 16), cloudMat);
  s3.position.set(0.55, 0.9, 0);
  const s4 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.35, 0.7), cloudMat);
  s4.position.set(0.15, 0.68, 0);
  g.add(s1, s2, s3, s4);

  // Wire down to a chip below the cloud
  const wire = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.5, 6),
    new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.7 }),
  );
  wire.position.set(0.15, 0.28, 0);
  g.add(wire);

  // Small chip at wire base
  const chipGeom = new THREE.BoxGeometry(0.5, 0.08, 0.5);
  const chip = new THREE.Mesh(chipGeom, new THREE.MeshLambertMaterial({ color: LIGHT }));
  chip.position.set(0.15, 0.04, 0);
  g.add(chip, (() => { const e = buildEdge(chipGeom); e.position.copy(chip.position); return e; })());

  // Add outline
  const outline1 = new THREE.LineSegments(new THREE.EdgesGeometry(s1.geometry), cloudEdgeMat);
  outline1.position.copy(s1.position);
  const outline2 = new THREE.LineSegments(new THREE.EdgesGeometry(s2.geometry), cloudEdgeMat);
  outline2.position.copy(s2.position);
  const outline3 = new THREE.LineSegments(new THREE.EdgesGeometry(s3.geometry), cloudEdgeMat);
  outline3.position.copy(s3.position);
  g.add(outline1, outline2, outline3);
  return g;
};

// -------------------------------------------------------------
// Devices meta
// -------------------------------------------------------------
const SATELLITES = [
  { id: "server",   builder: () => buildChipPedestal({ emissive: ACCENT }), labelY: 0.7,  Icon: Server,         pl: "Serwery",  en: "Servers",  sub_pl: "Compute",    sub_en: "Compute" },
  { id: "storage",  builder: buildStorageStack,                             labelY: 0.9,  Icon: HardDrive,      pl: "Storage",  en: "Storage",  sub_pl: "NetApp",     sub_en: "NetApp" },
  { id: "network",  builder: buildLaptop,                                   labelY: 0.85, Icon: Network,        pl: "Sieć",     en: "Network",  sub_pl: "SDN / FW",   sub_en: "SDN / FW" },
  { id: "dr",       builder: buildCloud,                                    labelY: 1.15, Icon: LifeBuoy,       pl: "DR Site",  en: "DR Site",  sub_pl: "Disaster R.",sub_en: "Disaster R." },
  { id: "backup",   builder: buildMonitorTerminal,                          labelY: 1.05, Icon: DatabaseBackup, pl: "Backup",   en: "Backup",   sub_pl: "LTO / Dedup",sub_en: "LTO / Dedup" },
  { id: "security", builder: buildMonitorTerminal,                          labelY: 1.05, Icon: ShieldCheck,    pl: "Security", en: "Security", sub_pl: "DLP / IDM",  sub_en: "DLP / IDM" },
];

// -------------------------------------------------------------
// Component
// -------------------------------------------------------------
const IsometricDatacenter = ({ lang = "pl" }) => {
  const mountRef = useRef(null);
  const labelRefs = useRef({});
  const labelHoveredRef = useRef(null);
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

    const scene = new THREE.Scene();

    // Orthographic camera for isometric look
    const aspect = width / height;
    const camSize = 5.2;
    const camera = new THREE.OrthographicCamera(
      -camSize * aspect,
      camSize * aspect,
      camSize,
      -camSize,
      0.1,
      100,
    );
    // Classic iso: 30°, 45° yaw
    camera.position.set(9, 8, 9);
    camera.lookAt(0, 0.8, 0);

    // Lights — flat but colorful
    scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const key = new THREE.DirectionalLight(0xffffff, 0.55);
    key.position.set(6, 12, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x49ada5, 0.35);
    rim.position.set(-6, 4, -3);
    scene.add(rim);

    // Root — allows scene-wide slow rotation
    const root = new THREE.Group();
    scene.add(root);

    // Ground grid — very subtle, blends into background with edge fade via material opacity
    const grid = new THREE.GridHelper(20, 20, ACCENT, ACCENT);
    grid.material.transparent = true;
    grid.material.opacity = 0.09;
    grid.material.depthWrite = false;
    grid.position.y = 0;
    root.add(grid);

    // Faint radial glow disc under the scene — helps the grid fade organically toward edges
    const floorGlow = new THREE.Mesh(
      new THREE.CircleGeometry(6, 48),
      new THREE.MeshBasicMaterial({
        color: ACCENT,
        transparent: true,
        opacity: 0.06,
        depthWrite: false,
      }),
    );
    floorGlow.rotation.x = -Math.PI / 2;
    floorGlow.position.y = 0.005;
    root.add(floorGlow);

    // Central server rack
    const rack = buildServerRack();
    rack.userData.deviceId = "core";
    rack.position.set(0, 0, 0);
    root.add(rack);

    // Bounding raycast mesh for rack (invisible)
    const rackBBox = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 3.5, 1.3),
      new THREE.MeshBasicMaterial({ visible: false }),
    );
    rackBBox.position.set(0, 1.8, 0);
    rackBBox.userData.deviceId = "core";
    root.add(rackBBox);

    // Satellite devices on a ring
    const RADIUS = 3.9;
    const deviceGroups = {}; // id -> group
    const raycastTargets = [rackBBox];

    SATELLITES.forEach((meta, i) => {
      const angle = (i / SATELLITES.length) * Math.PI * 2 + Math.PI / 6;
      const x = Math.cos(angle) * RADIUS;
      const z = Math.sin(angle) * RADIUS;
      const g = meta.builder();
      g.position.set(x, 0, z);
      // Face the center
      g.rotation.y = Math.atan2(-z, -x) + Math.PI / 2;
      root.add(g);
      deviceGroups[meta.id] = g;

      // Invisible bounding box for raycasting
      const box = new THREE.Box3().setFromObject(g);
      const size = new THREE.Vector3();
      box.getSize(size);
      const center = new THREE.Vector3();
      box.getCenter(center);
      const bboxMesh = new THREE.Mesh(
        new THREE.BoxGeometry(size.x + 0.2, Math.max(size.y, 0.5), size.z + 0.2),
        new THREE.MeshBasicMaterial({ visible: false }),
      );
      bboxMesh.position.copy(center);
      bboxMesh.userData.deviceId = meta.id;
      root.add(bboxMesh);
      raycastTargets.push(bboxMesh);
    });

    // Connections — thin flat circuit-traces from center to each satellite base
    const CONNECTIONS = SATELLITES.map((s) => ["core", s.id]).concat([
      ["server", "storage"],
      ["backup", "dr"],
      ["security", "network"],
    ]);

    const getBasePos = (id) => {
      if (id === "core") return new THREE.Vector3(0, 0.02, 0);
      const g = deviceGroups[id];
      return new THREE.Vector3(g.position.x, 0.02, g.position.z);
    };

    const traces = []; // { line, pair }
    const packets = [];
    CONNECTIONS.forEach(([a, b]) => {
      const pa = getBasePos(a);
      const pb = getBasePos(b);
      // L-shaped path for the "circuit trace" look
      const midX = pb.x;
      const midZ = pa.z;
      const mid = new THREE.Vector3(midX, 0.02, midZ);
      const pts = [pa, mid, pb];
      const geom = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({
        color: ACCENT,
        transparent: true,
        opacity: 0.55,
      });
      const line = new THREE.Line(geom, mat);
      root.add(line);
      traces.push({ line, mat, pair: [a, b], pa, mid, pb });

      // 2 packets per trace, phased
      for (let k = 0; k < 2; k++) {
        const pkt = new THREE.Mesh(
          new THREE.SphereGeometry(0.06, 10, 10),
          new THREE.MeshBasicMaterial({ color: 0xffffff }),
        );
        root.add(pkt);
        packets.push({
          mesh: pkt,
          points: [pa, mid, pb],
          totalLen:
            pa.distanceTo(mid) + mid.distanceTo(pb),
          phase: k / 2 + Math.random() * 0.1,
          speed: 0.35 + Math.random() * 0.15,
          pair: [a, b],
        });
      }

      // Endpoint dots
      [pa, pb].forEach((p) => {
        const dot = new THREE.Mesh(
          new THREE.CircleGeometry(0.08, 16),
          new THREE.MeshBasicMaterial({ color: ACCENT }),
        );
        dot.rotation.x = -Math.PI / 2;
        dot.position.set(p.x, 0.025, p.z);
        root.add(dot);
      });
    });

    // ---- Raycaster
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    let isMouseInside = false;

    const onMove = (e) => {
      const rect = mount.getBoundingClientRect();
      ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      isMouseInside = true;
    };
    const onLeave = () => {
      isMouseInside = false;
    };
    const onClick = () => {
      if (hoveredRef.current) {
        setSelected((s) => (s === hoveredRef.current ? null : hoveredRef.current));
      }
    };
    mount.addEventListener("mousemove", onMove);
    mount.addEventListener("mouseleave", onLeave);
    mount.addEventListener("click", onClick);

    // ---- Resize
    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      const a = w / h;
      camera.left = -camSize * a;
      camera.right = camSize * a;
      camera.top = camSize;
      camera.bottom = -camSize;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // ---- Animation loop (bounded, uses setAnimationLoop for stability)
    const clock = new THREE.Clock();
    let lastT = 0;

    const projectLabelPositions = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      SATELLITES.forEach((m) => {
        const g = deviceGroups[m.id];
        const el = labelRefs.current[m.id];
        if (!g || !el) return;
        const p = new THREE.Vector3(g.position.x, m.labelY ?? 1.2, g.position.z);
        p.applyMatrix4(root.matrixWorld);
        p.project(camera);
        const x = Math.round((p.x * 0.5 + 0.5) * w);
        const y = Math.round((-p.y * 0.5 + 0.5) * h);
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
      });
      const coreEl = labelRefs.current["core"];
      if (coreEl) {
        const cp = new THREE.Vector3(0, 3.9, 0);
        cp.applyMatrix4(root.matrixWorld);
        cp.project(camera);
        coreEl.style.left = `${Math.round((cp.x * 0.5 + 0.5) * w)}px`;
        coreEl.style.top = `${Math.round((-cp.y * 0.5 + 0.5) * h)}px`;
      }
    };

    const animate = () => {
      const t = clock.getElapsedTime();
      const dt = Math.min(t - lastT, 0.05);
      lastT = t;

      // Slow root rotation — pauses on hover for stability
      const rotSpeed = isMouseInside ? 0 : 0.05;
      root.rotation.y += dt * rotSpeed;

      // Raycast (label first)
      let hoverId = labelHoveredRef.current;
      if (!hoverId && isMouseInside) {
        raycaster.setFromCamera(ndc, camera);
        const hits = raycaster.intersectObjects(raycastTargets, false);
        if (hits.length > 0) hoverId = hits[0].object.userData.deviceId;
      }
      if (hoverId !== hoveredRef.current) {
        hoveredRef.current = hoverId;
        setHovered(hoverId);
      }

      const activeId = hoverId || selectedRef.current;

      // Highlight device: subtle scale + hover offset
      const highlightScale = (g, active) => {
        const target = active ? 1.08 : 1.0;
        const s = g.scale.x;
        const ns = s + (target - s) * 0.15;
        g.scale.setScalar(ns);
      };
      SATELLITES.forEach((m) => {
        const g = deviceGroups[m.id];
        if (g) highlightScale(g, activeId === m.id);
      });
      highlightScale(rack, activeId === "core");

      // Blink server rack LEDs
      if (rack.userData.ledStrip) {
        rack.userData.ledStrip.forEach((led, i) => {
          const phase = t * 2 + i * 0.7;
          const on = (Math.sin(phase) + 1) / 2;
          led.material.opacity = 0.5 + on * 0.5;
          led.material.transparent = true;
        });
      }

      // Trace glow + packets flow
      traces.forEach(({ mat, pair }) => {
        const isLit =
          !activeId ||
          pair.includes(activeId) ||
          (activeId && pair.includes("core") && activeId === "core");
        const target = isLit ? 0.85 : 0.18;
        mat.opacity += (target - mat.opacity) * 0.12;
      });
      packets.forEach((p) => {
        p.phase = (p.phase + dt * p.speed) % 1;
        // Interpolate along L-path
        const d1 = p.points[0].distanceTo(p.points[1]);
        const d2 = p.points[1].distanceTo(p.points[2]);
        const total = d1 + d2;
        const dist = p.phase * total;
        let pt;
        if (dist < d1) {
          const t2 = dist / d1;
          pt = p.points[0].clone().lerp(p.points[1], t2);
        } else {
          const t2 = (dist - d1) / d2;
          pt = p.points[1].clone().lerp(p.points[2], t2);
        }
        p.mesh.position.copy(pt);
        const isLit =
          !activeId ||
          p.pair.includes(activeId) ||
          (activeId === "core" && p.pair.includes("core"));
        const to = isLit ? 1 : 0.15;
        p.mesh.material.opacity += (to - p.mesh.material.opacity) * 0.15;
        p.mesh.material.transparent = true;
        p.mesh.scale.setScalar(isLit ? 1.1 : 0.7);
      });

      projectLabelPositions();
      renderer.render(scene, camera);
    };

    renderer.setAnimationLoop(animate);

    return () => {
      renderer.setAnimationLoop(null);
      window.removeEventListener("resize", onResize);
      mount.removeEventListener("mousemove", onMove);
      mount.removeEventListener("mouseleave", onLeave);
      mount.removeEventListener("click", onClick);
      renderer.dispose();
      // Dispose all geometries + materials
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  const activeId = hovered || selected;

  return (
    <div className="sc-3d" data-testid="hero-topology">
      <div ref={mountRef} className="sc-3d__canvas" />

      {SATELLITES.map((m) => {
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
            style={{ transform: "translate(-50%, -50%)" }}
            className={`sc-3d-label ${isActive ? "is-active" : ""} ${isDim ? "is-dim" : ""}`}
            aria-label={lang === "pl" ? m.pl : m.en}
          >
            <Icon size={16} strokeWidth={2} />
            <span className="sc-3d-label__tooltip">{lang === "pl" ? m.pl : m.en}</span>
          </button>
        );
      })}

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
      </div>
    </div>
  );
};

export default IsometricDatacenter;
