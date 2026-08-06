/* NetApp portfolio data — extracted from the SmartClout NetApp product deck. */

export const AFF_A = [
  { model: "AFF A20",  raw: "15.36 TB – 737 TB",   effective: "do 3.28 PB",   cluster: "do 8.84 PB raw · 37 PB eff", form: "2U · 24 dysków (HA)",       tag: "Entry Performance" },
  { model: "AFF A30",  raw: "15.36 TB – 1.10 PB",  effective: "do 4.92 PB",   cluster: "do 13.27 PB raw · 54 PB eff", form: "2U · 24 dysków (HA)",       tag: "Mid Performance" },
  { model: "AFF A50",  raw: "15.36 TB – 3.30 PB",  effective: "do 14.70 PB",  cluster: "do 39.65 PB raw · 92 PB eff", form: "2U · 24 dysków (HA)",       tag: "High Performance" },
  { model: "AFF A70",  raw: "91 TB – 3.70 PB",     effective: "do 15.5 PB",   cluster: "do 44 PB raw · 185 PB eff",   form: "4U · 48 dysków (HA)",       tag: "Enterprise" },
  { model: "AFF A90",  raw: "91 TB – 3.70 PB",     effective: "do 15.5 PB",   cluster: "do 44 PB raw · 185 PB eff",   form: "4U · 48 dysków (HA)",       tag: "Enterprise+" },
  { model: "AFF A1K",  raw: "91 TB – 3.70 PB",     effective: "do 15.5 PB",   cluster: "do 44 PB raw · 185 PB eff",   form: "2U + 2U + półka (HA)",     tag: "Ultra Scale" },
];

export const AFF_C = [
  { model: "AFF C30", raw: "122 TB – 2.2 PB",  effective: "do 9.7 PB",   cluster: "do 26.5 PB raw · 106 PB eff",   form: "2U · 24 dysków (HA)", tag: "Entry Capacity" },
  { model: "AFF C60", raw: "245 TB – 7.3 PB",  effective: "do 32.4 PB",  cluster: "do 87.6 PB raw · 353.6 PB eff", form: "2U · 24 dysków (HA)", tag: "Mid Capacity" },
  { model: "AFF C80", raw: "367 TB – 14.7 PB", effective: "do 65.4 PB",  cluster: "do 176.8 PB raw · 707.3 PB eff", form: "4U · 48 dysków (HA)", tag: "Max Capacity" },
];

export const FAS = [
  { model: "FAS2750", raw: "13.4 TB – 2.7 PB",  cluster: "do 32.2 PB",  form: "2U (HA)",                tag: "Entry Hybrid" },
  { model: "FAS2820", raw: "35.8 TB – 3.2 PB",  cluster: "do 38.0 PB",  form: "2U (HA)",                tag: "SMB Hybrid" },
  { model: "FAS50",   raw: "100 TB – 10.6 PB",  cluster: "do 127 PB",   form: "2U + półka (HA)",        tag: "Mid Hybrid" },
  { model: "FAS70",   raw: "96 TB – 14.7 PB",   cluster: "do 176 PB",   form: "2×2U + półka (HA)",      tag: "Enterprise Hybrid" },
  { model: "FAS90",   raw: "96 TB – 14.7 PB",   cluster: "do 176 PB",   form: "2×2U + półka (HA)",      tag: "Max Hybrid" },
];

export const ONTAP_FEATURES = [
  { k: "Snapshots",         d: "Point-in-time obrazy woluminów — natychmiastowe, zero-copy, nielimitowany rollback."  },
  { k: "SnapMirror",        d: "Asynchroniczna lub synchroniczna replikacja DR — RPO od minut do tygodni."          },
  { k: "SnapVault",         d: "Backup disk-to-disk z długoterminową retencją i deduplikacją źródło→cel."           },
  { k: "FlexClone",         d: "Zapisywalne kopie woluminów i LUN — dev/test/analytics bez duplikacji przestrzeni." },
  { k: "FabricPool",        d: "Auto-tiering cold data do object storage (Cloud / S3 / StorageGRID)."               },
  { k: "Deduplikacja",      d: "Inline + post-process — jeden blok, wiele referencji, cały cykl życia danych."      },
  { k: "Kompresja",         d: "Inline compression na poziomie WAFL — bez wpływu na wydajność."                     },
  { k: "Thin Provisioning", d: "Alokacja przestrzeni tylko dla realnie zapisanych danych — zero over-provision."   },
];

export const ONTAP_SECURITY = [
  { k: "Autonomous Ransomware Protection", d: "AI-driven detekcja anomalii w I/O — do 99 % skuteczności wykrywania szyfrowania.", metric: "99%" },
  { k: "Multi-Admin Verification (MAV)",   d: "Krytyczne operacje wymagają zatwierdzenia wielu administratorów — zero single-point-of-failure.", metric: "N of M" },
  { k: "SnapLock / WORM",                  d: "Write-Once-Read-Many z retencją prawną — backup i snapshot niepodatne na modyfikację.", metric: "Immutable" },
  { k: "FPolicy",                          d: "Granularna kontrola dostępu i audit każdego I/O na poziomie plików.", metric: "Per-file" },
  { k: "Encryption at Rest",               d: "AES-256 na poziomie woluminu lub dysku (NVE, NAE, SED).", metric: "AES-256" },
  { k: "Ransomware Recovery Guarantee",    d: "Gwarancja odzyskania danych w wypadku ataku ransomware — kontraktowe SLA.", metric: "Guaranteed" },
];

export const BLUEXP_CAPABILITIES = [
  "Unified control plane on-prem + hybrid + multi-cloud",
  "BlueXP Classification — automatyczna klasyfikacja wrażliwych danych",
  "BlueXP Ransomware Protection — pojedynczy pulpit obrony",
  "Cloud Tiering (FabricPool → AWS Glacier / Azure Blob)",
  "Cloud Backup & Cloud Sync między środowiskami",
  "Cloud Volumes ONTAP / ONTAP Select — software-defined ONTAP w chmurze",
];

export const CLOUDS = ["AWS", "Microsoft Azure", "Google Cloud", "IBM Cloud"];
