import React, { useState, useMemo } from "react";
import {
  Server,
  HardDrive,
  ShieldCheck,
  Network,
  DatabaseBackup,
  LifeBuoy,
  Cloud,
} from "lucide-react";

/**
 * DatacenterTopology
 *  - 1 central "Datacenter" hub
 *  - 6 satellite infrastructure nodes (Server, Storage, Network, Security, Backup, DR Site)
 *  - Curved SVG connections with animated data packets flowing along them
 *  - Hovering a node highlights it and its lines
 *
 *  Positions expressed in % so the layout scales with the hero.
 *  Uses a viewBox="0 0 100 100" SVG to draw curved connections responsively.
 */

const NODES = [
  {
    id: "server",
    Icon: Server,
    label_pl: "Serwery",
    label_en: "Servers",
    sub_pl: "Compute",
    sub_en: "Compute",
    x: 50,
    y: 12,
  },
  {
    id: "storage",
    Icon: HardDrive,
    label_pl: "Storage",
    label_en: "Storage",
    sub_pl: "NetApp",
    sub_en: "NetApp",
    x: 84,
    y: 32,
  },
  {
    id: "network",
    Icon: Network,
    label_pl: "Sieć",
    label_en: "Network",
    sub_pl: "SDN / Firewall",
    sub_en: "SDN / Firewall",
    x: 84,
    y: 72,
  },
  {
    id: "dr",
    Icon: LifeBuoy,
    label_pl: "DR Site",
    label_en: "DR Site",
    sub_pl: "Disaster Recovery",
    sub_en: "Disaster Recovery",
    x: 50,
    y: 84,
  },
  {
    id: "backup",
    Icon: DatabaseBackup,
    label_pl: "Backup",
    label_en: "Backup",
    sub_pl: "LTO / Dedup",
    sub_en: "LTO / Dedup",
    x: 16,
    y: 72,
  },
  {
    id: "security",
    Icon: ShieldCheck,
    label_pl: "Security",
    label_en: "Security",
    sub_pl: "DLP / IDM / UEM",
    sub_en: "DLP / IDM / UEM",
    x: 16,
    y: 32,
  },
];

const CENTER = { id: "core", x: 50, y: 48 };

// Connections: satellite -> center, plus a couple satellite-satellite
const CONNECTIONS = [
  ["server", "core"],
  ["storage", "core"],
  ["network", "core"],
  ["dr", "core"],
  ["backup", "core"],
  ["security", "core"],
  ["server", "storage"],
  ["backup", "dr"],
  ["security", "network"],
];

const getPos = (id) => {
  if (id === "core") return CENTER;
  return NODES.find((n) => n.id === id);
};

/** Curved path from A to B with slight bezier bow toward the center point. */
const buildPath = (a, b) => {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  // pull control point slightly toward center for organic curves
  const cx = mx + (50 - mx) * 0.15;
  const cy = my + (52 - my) * 0.15;
  return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`;
};

const DatacenterTopology = ({ lang = "pl" }) => {
  const [hovered, setHovered] = useState(null);
  const [clicked, setClicked] = useState(null);

  const paths = useMemo(
    () =>
      CONNECTIONS.map(([a, b]) => ({
        key: `${a}-${b}`,
        a,
        b,
        d: buildPath(getPos(a), getPos(b)),
      })),
    [],
  );

  const isConnected = (id) => {
    if (!hovered) return false;
    if (hovered === id) return true;
    return CONNECTIONS.some(
      ([a, b]) =>
        (a === hovered && b === id) || (b === hovered && a === id),
    );
  };

  const isLineActive = (a, b) =>
    !hovered || a === hovered || b === hovered;

  return (
    <div className="sc-topo" data-testid="hero-topology">
      {/* SVG connections + packets */}
      <svg
        className="sc-topo__svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="pulse" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="60%" stopColor="#49ADA5" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#49ADA5" stopOpacity="0" />
          </radialGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connection lines */}
        {paths.map((p) => {
          const active = isLineActive(p.a, p.b);
          return (
            <path
              key={p.key}
              d={p.d}
              className={`sc-topo__line ${
                active ? "is-active" : "is-dim"
              }`}
              vectorEffect="non-scaling-stroke"
              filter="url(#glow)"
            />
          );
        })}

        {/* Data packets - traveling along each path */}
        {paths.map((p, i) => (
          <g key={`pkt-${p.key}`}>
            <circle r="0.9" fill="url(#pulse)">
              <animateMotion
                dur={`${2.6 + (i % 5) * 0.4}s`}
                repeatCount="indefinite"
                begin={`${i * 0.35}s`}
                path={p.d}
                rotate="auto"
              />
            </circle>
            {i % 2 === 0 && (
              <circle r="0.55" fill="#FFFFFF" opacity="0.9">
                <animateMotion
                  dur={`${3.2 + (i % 4) * 0.3}s`}
                  repeatCount="indefinite"
                  begin={`${1.2 + i * 0.25}s`}
                  path={p.d}
                  rotate="auto"
                />
              </circle>
            )}
          </g>
        ))}

        {/* Concentric rings around core */}
        <circle
          cx={CENTER.x}
          cy={CENTER.y}
          r="7"
          fill="none"
          stroke="#49ADA5"
          strokeOpacity="0.35"
          strokeWidth="0.2"
          vectorEffect="non-scaling-stroke"
        >
          <animate
            attributeName="r"
            values="7;9;7"
            dur="4s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="stroke-opacity"
            values="0.35;0.05;0.35"
            dur="4s"
            repeatCount="indefinite"
          />
        </circle>
        <circle
          cx={CENTER.x}
          cy={CENTER.y}
          r="11"
          fill="none"
          stroke="#49ADA5"
          strokeOpacity="0.18"
          strokeWidth="0.2"
          vectorEffect="non-scaling-stroke"
        >
          <animate
            attributeName="r"
            values="11;14;11"
            dur="5s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>

      {/* Central Datacenter hub */}
      <div
        className={`sc-topo__core ${
          hovered === "core" || clicked === "core" ? "is-hovered" : ""
        }`}
        style={{ left: `${CENTER.x}%`, top: `${CENTER.y}%` }}
        onMouseEnter={() => setHovered("core")}
        onMouseLeave={() => setHovered(null)}
        onClick={() => setClicked(clicked === "core" ? null : "core")}
        data-testid="topo-node-core"
      >
        <div className="sc-topo__core-ring" />
        <div className="sc-topo__core-inner">
          <Cloud size={22} strokeWidth={1.8} />
          <span className="sc-topo__core-label">DATACENTER</span>
          <span className="sc-topo__core-sub">
            {lang === "pl" ? "Rdzeń infrastruktury" : "Infrastructure core"}
          </span>
        </div>
      </div>

      {/* Satellite nodes */}
      {NODES.map((n, i) => {
        const Icon = n.Icon;
        const active =
          !hovered ||
          hovered === n.id ||
          hovered === "core" ||
          isConnected(n.id);
        return (
          <button
            type="button"
            key={n.id}
            className={`sc-topo__node ${active ? "is-active" : "is-dim"} ${
              hovered === n.id || clicked === n.id ? "is-hovered" : ""
            }`}
            style={{
              left: `${n.x}%`,
              top: `${n.y}%`,
              animationDelay: `${i * 0.12}s`,
            }}
            onMouseEnter={() => setHovered(n.id)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setClicked(clicked === n.id ? null : n.id)}
            data-testid={`topo-node-${n.id}`}
            aria-label={n.label_en}
          >
            <span className="sc-topo__node-icon">
              <Icon size={18} strokeWidth={1.9} />
            </span>
            <span className="sc-topo__node-body">
              <span className="sc-topo__node-label">
                {lang === "pl" ? n.label_pl : n.label_en}
              </span>
              <span className="sc-topo__node-sub">
                {lang === "pl" ? n.sub_pl : n.sub_en}
              </span>
            </span>
            <span className="sc-topo__node-pulse" />
          </button>
        );
      })}
    </div>
  );
};

export default DatacenterTopology;
