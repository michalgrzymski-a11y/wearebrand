import React from "react";
import {
  Lock, ShieldCheck, Vault, Repeat, Plug, FileLock2, KeyRound,
  Radar, Database, ArrowRight, CheckCircle2,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import Tilt from "@/components/fx/Tilt";

const PILLARS = [
  {
    id: "worm",
    icon: <FileLock2 size={22} />,
    color: "#06FFE0",
    title: "WORM — SnapLock",
    lead: "Dane, których nie da się nadpisać ani skasować przed upływem retencji.",
    points: [
      "SnapLock Compliance — retencja egzekwowana sprzętowo, nawet admin nie usunie",
      "SnapLock Enterprise — WORM dla backupów z kontrolowanym cyklem życia",
      "Retencja per plik / per snapshot · Compliance Clock odporny na zmianę zegara",
      "Zgodność: SEC 17a-4, FINRA, DORA / NIS2, KNF",
    ],
  },
  {
    id: "vault",
    icon: <Vault size={22} />,
    color: "#00E0C6",
    title: "Cyfrowy bunkier (Cyber Vault)",
    lead: "Logicznie odizolowana macierz z niezmiennymi kopiami — ostatnia linia obrony.",
    points: [
      "Air-gap sieciowy: łączność tylko w oknie replikacji SnapVault",
      "Tamperproof Snapshots — blokada usunięcia snapshotów z poziomu ONTAP",
      "Multi-Admin Verification — każda operacja destrukcyjna wymaga 2 osób",
      "Odzyskanie PB danych w minuty (SnapRestore), nie w dni",
    ],
  },
  {
    id: "integr",
    icon: <Plug size={22} />,
    color: "#7CD6FF",
    title: "Veeam · Commvault · i inne",
    lead: "ONTAP to natywny partner systemów backupowych, nie tylko półka na dane.",
    points: [
      "Veeam: Backup from Storage Snapshots, NAS backup z snapshotów, repozytorium S3 z Object Lock",
      "Commvault IntelliSnap: orkiestracja snapshotów + SnapMirror / SnapVault",
      "ONTAP S3 z Object Lock → immutable repository dla Veeam / Rubrik / Cohesity",
      "SnapCenter — spójne aplikacyjnie kopie SQL, Oracle, SAP HANA, VMware",
    ],
  },
  {
    id: "repl",
    icon: <Repeat size={22} />,
    color: "#00B8D4",
    title: "Natywna replikacja z produkcji",
    lead: "SnapMirror przenosi tylko zmienione bloki — bez agentów, bez pełnych kopii.",
    points: [
      "SnapMirror async (RPO od 1 min) · sync (RPO 0) · active sync (active-active)",
      "SnapVault — długie retencje na tańszym tierze (C-Series / FAS)",
      "Replikacja AFF → C-Series → bunkier w jednym, spójnym systemie",
      "Kompresja i deduplikacja zachowane w locie — mniejsze łącze WAN",
    ],
  },
  {
    id: "sec",
    icon: <ShieldCheck size={22} />,
    color: "#0EA5A0",
    title: "Bezpieczeństwo ONTAP",
    lead: "Macierz, która sama wykrywa ransomware i gwarantuje odzyskanie danych.",
    points: [
      "Autonomous Ransomware Protection (ARP/AI) — detekcja w czasie rzeczywistym, 99%+ skuteczności",
      "Szyfrowanie NVE / NAE + FIPS 140-2, Secure Purge, pełny audit log",
      "MFA, RBAC, hardening wg STIG — jedyna macierz dopuszczona do danych top-secret",
      "NetApp Ransomware Recovery Guarantee — gwarancja odzyskania snapshotów",
    ],
  },
];

const STATS = [
  ["1 min", "RPO SnapMirror async"],
  ["0", "pełnych kopii — tylko zmienione bloki"],
  ["99%+", "skuteczność detekcji ARP/AI"],
  ["minuty", "RTO z SnapRestore, nie dni"],
];

const FlowNode = ({ tag, name, img, icon, chips, variant }) => (
  <div className={`npv2-bk__node npv2-bk__node--${variant}`} data-testid={`npv2-bk-node-${variant}`}>
    <div className="npv2-bk__node-head">
      <span className="npv2-bk__node-ico">{icon}</span>
      <div>
        <span className="npv2-bk__node-tag">{tag}</span>
        <strong className="npv2-bk__node-name">{name}</strong>
      </div>
    </div>
    <div className="npv2-bk__node-img"><img src={img} alt="" aria-hidden="true" loading="lazy" /></div>
    <ul className="npv2-bk__node-chips">
      {chips.map((c) => <li key={c}>{c}</li>)}
    </ul>
  </div>
);

const FlowLink = ({ label, sub, locked }) => (
  <div className={`npv2-bk__link ${locked ? "is-locked" : ""}`} aria-hidden="true">
    <span className="npv2-bk__link-label">{label}</span>
    <div className="npv2-bk__wire">
      <span className="npv2-bk__packet" style={{ "--d": "0s" }} />
      <span className="npv2-bk__packet" style={{ "--d": "0.9s" }} />
      <span className="npv2-bk__packet" style={{ "--d": "1.8s" }} />
      <ArrowRight size={14} className="npv2-bk__wire-arrow" />
    </div>
    <span className="npv2-bk__link-sub">{locked && <Lock size={11} />}{sub}</span>
  </div>
);

const OntapBackupSection = ({ Header }) => (
  <section className="npv2-bk" data-testid="npv2-backup" id="npv2-backup">
    <div className="npv2-bk__bg" aria-hidden="true" />
    <div className="npv2-bk__inner">
      <Reveal>
        <Header
          center
          label="ONTAP · Backup & Cyber Resilience"
          title="Dlaczego ONTAP to idealny"
          accent="cel dla backupu"
          sub="Snapshoty bez narzutu, WORM egzekwowany sprzętowo, natywna replikacja z produkcji i cyfrowy bunkier — wszystko w jednym systemie, bez dodatkowych appliance'ów."
          tag="npv2-backup-header"
        />
      </Reveal>

      {/* Reference flow: production → backup → vault */}
      <Reveal delay={100}>
        <div className="npv2-bk__flow" data-testid="npv2-bk-flow">
          <div className="npv2-bk__orch">
            <Radar size={14} />
            <span>Orkiestracja: <strong>Veeam</strong> · <strong>Commvault IntelliSnap</strong> · <strong>SnapCenter</strong> — snapshoty spójne aplikacyjnie, polityki retencji, katalog</span>
          </div>
          <div className="npv2-bk__lane">
            <FlowNode
              variant="prod"
              tag="Produkcja"
              name="AFF A-Series"
              img="/netapp-assets/AFF_A90_Bezel.png"
              icon={<Database size={16} />}
              chips={["Snapshoty co 15 min", "ARP/AI on", "NVE encryption"]}
            />
            <FlowLink label="SnapMirror / SnapVault" sub="tylko zmienione bloki · dedup + kompresja w locie" />
            <FlowNode
              variant="backup"
              tag="Backup · retencja"
              name="AFF C-Series (QLC)"
              img="/netapp-assets/AFF_C80_Front_Bezel.png"
              icon={<Repeat size={16} />}
              chips={["Retencja 30-90 dni", "SnapLock Enterprise", "ONTAP S3 Object Lock"]}
            />
            <FlowLink label="SnapVault · okno replikacji" sub="air-gap · WORM · Multi-Admin Verification" locked />
            <FlowNode
              variant="vault"
              tag="Cyfrowy bunkier"
              name="C-Series / FAS · SnapLock"
              img="/netapp-assets/AFF_C30_Bezel.png"
              icon={<Lock size={16} />}
              chips={["SnapLock Compliance", "Retencja 1-7 lat", "Odizolowana sieć"]}
            />
          </div>
        </div>
      </Reveal>

      {/* Pillars */}
      <div className="npv2-bk__grid">
        {PILLARS.map((p, i) => (
          <Reveal key={p.id} delay={i * 90}>
            <Tilt as="article" max={4} className="npv2-bk__card" style={{ "--tc": p.color }} data-testid={`npv2-bk-card-${p.id}`}>
              <div className="npv2-bk__card-head">
                <span className="npv2-bk__card-ico">{p.icon}</span>
                <h3>{p.title}</h3>
              </div>
              <p className="npv2-bk__card-lead">{p.lead}</p>
              <ul className="npv2-bk__card-list">
                {p.points.map((pt) => (
                  <li key={pt}><CheckCircle2 size={14} /><span>{pt}</span></li>
                ))}
              </ul>
            </Tilt>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120}>
        <div className="npv2-bk__stats" data-testid="npv2-bk-stats">
          {STATS.map(([v, l]) => (
            <div key={l} className="npv2-bk__stat">
              <strong>{v}</strong>
              <span>{l}</span>
            </div>
          ))}
          <div className="npv2-bk__stat npv2-bk__stat--cta">
            <KeyRound size={16} />
            <span>Chcesz architekturę bunkra dopasowaną do Twojego backupu?</span>
            <a className="sc-btn-glass" href="#contact" data-testid="npv2-bk-cta">
              Porozmawiajmy <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

export default OntapBackupSection;
