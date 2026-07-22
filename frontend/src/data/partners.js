/**
 * Partner catalogue — one canonical entry per vendor.
 * Slug is the URL segment used by /partners/:slug routing.
 * Categories match the rack layers defined in PartnersV2Section.jsx.
 * Content is authored in PL and EN; UI selects based on LanguageContext.
 */

export const PARTNER_CATEGORIES = {
  servers:  { pl: "Serwery & Wirtualizacja", en: "Servers & Virtualization" },
  storage:  { pl: "Storage",                 en: "Storage" },
  backup:   { pl: "Backup",                  en: "Backup" },
  network:  { pl: "Sieć",                    en: "Network" },
  security: { pl: "Security & Management",   en: "Security & Management" },
  software: { pl: "Software & Cloud",        en: "Software & Cloud" },
};

export const slugify = (name) =>
  name.replace(/\s+/g, "-").toLowerCase();

const PARTNERS = [
  {
    slug: "netapp",
    name: "NetApp",
    logo: "/logos/vendors/netapp.webp",
    categories: ["storage"],
    tier:     { pl: "Partner strategiczny", en: "Strategic Partner" },
    tagline:  {
      pl: "Nowoczesne środowiska danych — hybrydowe, wielochmurowe i AI-ready.",
      en: "Modern data environments — hybrid, multi-cloud and AI-ready.",
    },
    intro: {
      pl: "NetApp to nasz partner strategiczny w warstwie storage. Wspólnie projektujemy środowiska ONTAP, StorageGRID i ASA, które łączą wydajność all-flash z zarządzalnością znaną z chmury publicznej.",
      en: "NetApp is our strategic partner in the storage layer. Together we design ONTAP, StorageGRID and ASA environments that combine all-flash performance with public-cloud-grade manageability.",
    },
    highlights: {
      pl: [
        "Certyfikowana kadra inżynierska NetApp",
        "Referencyjne wdrożenia AFF/ASA/ONTAP w bankowości i produkcji",
        "Kompletne DR/BCP w oparciu o SnapMirror i FlexClone",
      ],
      en: [
        "Certified NetApp engineering team",
        "Reference AFF/ASA/ONTAP deployments in banking & manufacturing",
        "End-to-end DR/BCP based on SnapMirror and FlexClone",
      ],
    },
    products: ["ONTAP AFF/FAS", "StorageGRID", "ASA all-flash SAN", "Cloud Volumes"],
  },
  {
    slug: "dell",
    name: "DELL",
    logo: "/logos/vendors/dell.webp",
    categories: ["servers", "storage", "network"],
    tier:     { pl: "Titanium Partner", en: "Titanium Partner" },
    tagline:  {
      pl: "Pełny stack Dell Technologies — od serwera po sieć.",
      en: "Full Dell Technologies stack — from server to fabric.",
    },
    intro: {
      pl: "Projektujemy i wdrażamy rozwiązania Dell PowerEdge, PowerStore, PowerMax, VxRail oraz PowerSwitch. Kompletne środowiska serwerowo-storage-owe dostarczane end-to-end.",
      en: "We design and deploy Dell PowerEdge, PowerStore, PowerMax, VxRail and PowerSwitch. End-to-end server-storage environments delivered from a single partner.",
    },
    highlights: {
      pl: [
        "PowerStore, PowerMax, PowerScale — pełne portfolio storage",
        "PowerEdge serwery rack i tower",
        "VxRail — HCI z VMware / vSAN",
      ],
      en: [
        "PowerStore, PowerMax, PowerScale — full storage portfolio",
        "PowerEdge rack and tower servers",
        "VxRail — HCI with VMware / vSAN",
      ],
    },
    products: ["PowerEdge", "PowerStore", "PowerMax", "VxRail", "PowerSwitch"],
  },
  {
    slug: "lenovo",
    name: "Lenovo",
    logo: "/logos/vendors/lenovo.webp",
    categories: ["servers", "storage"],
    tier:     { pl: "Platinum Partner", en: "Platinum Partner" },
    tagline:  {
      pl: "Serwery ThinkSystem i storage klasy enterprise w rozsądnej cenie.",
      en: "ThinkSystem servers and enterprise storage at a reasonable price.",
    },
    intro: {
      pl: "Rozwiązania Lenovo są dla nas synonimem niezawodności — od serwerów ThinkSystem, przez macierze DE i DM, po klaster HCI ThinkAgile z certyfikacjami VMware, Nutanix i Microsoft Azure Stack HCI.",
      en: "Lenovo means reliability — ThinkSystem servers, DE and DM storage arrays and ThinkAgile HCI clusters certified for VMware, Nutanix and Microsoft Azure Stack HCI.",
    },
    highlights: {
      pl: ["ThinkSystem SR/ST", "ThinkAgile HCI", "Storage DE/DM"],
      en: ["ThinkSystem SR/ST", "ThinkAgile HCI", "DE/DM Storage"],
    },
    products: ["ThinkSystem", "ThinkAgile", "DE Series", "DM Series"],
  },
  {
    slug: "asus",
    name: "ASUS",
    logo: "/logos/vendors/asus.webp",
    categories: ["servers"],
    tier:     { pl: "Authorized Partner", en: "Authorized Partner" },
    tagline:  {
      pl: "Serwery ASUS — elastyczne konfiguracje dla edge i AI/HPC.",
      en: "ASUS servers — flexible configurations for edge and AI/HPC.",
    },
    intro: {
      pl: "ASUS to platformy serwerowe, które sprawdzają się tam, gdzie potrzeba kompromisu między niestandardową konfiguracją a klasą enterprise — od AI/HPC po edge computing.",
      en: "ASUS server platforms shine where you need a middle-ground between bespoke configuration and enterprise-grade — from AI/HPC to edge computing.",
    },
    highlights: {
      pl: ["Serwery RS i ESC dla AI/HPC", "Elastyczne konfiguracje", "Wsparcie edge"],
      en: ["RS and ESC servers for AI/HPC", "Flexible configurations", "Edge support"],
    },
    products: ["RS Server", "ESC AI Server", "TS Tower"],
  },
  {
    slug: "nutanix",
    name: "Nutanix",
    logo: "/logos/vendors/nutanix.webp",
    categories: ["servers"],
    tier:     { pl: "Partner Master", en: "Master Partner" },
    tagline:  {
      pl: "Hiperkonwergencja i modernizacja platform po VMware.",
      en: "Hyperconvergence and platform modernization after VMware.",
    },
    intro: {
      pl: "Nutanix AHV, AOS i Prism to nasza rekomendacja dla firm szukających następcy VMware lub prostej platformy hiperkonwergentnej z jednolitym zarządzaniem.",
      en: "Nutanix AHV, AOS and Prism are our recommendation for organisations looking for a VMware successor or a simple hyperconverged platform with unified management.",
    },
    highlights: {
      pl: ["Migracje z VMware do AHV", "Multicluster w Prism Central", "Runbooks & self-service"],
      en: ["Migrations from VMware to AHV", "Multi-cluster in Prism Central", "Runbooks & self-service"],
    },
    products: ["AOS", "AHV", "Prism", "Nutanix Files"],
  },
  {
    slug: "microsoft",
    name: "Microsoft",
    logo: "/logos/vendors/microsoft.webp",
    categories: ["servers", "software"],
    tier:     { pl: "Solutions Partner", en: "Solutions Partner" },
    tagline:  {
      pl: "Microsoft 365, Azure i Windows Server jako integralna warstwa stacku.",
      en: "Microsoft 365, Azure and Windows Server as an integral stack layer.",
    },
    intro: {
      pl: "Wdrażamy i utrzymujemy środowiska Microsoft — od Windows Server i Hyper-V, przez Azure IaaS/PaaS, po Microsoft 365 i Entra ID. Wspieramy strategie hybrydowe i migracje.",
      en: "We deploy and operate Microsoft environments — from Windows Server and Hyper-V, through Azure IaaS/PaaS, to Microsoft 365 and Entra ID. We support hybrid strategies and migrations.",
    },
    highlights: {
      pl: ["Azure landing zones", "Entra ID / hybrid identity", "M365 tenant hardening"],
      en: ["Azure landing zones", "Entra ID / hybrid identity", "M365 tenant hardening"],
    },
    products: ["Azure", "Microsoft 365", "Windows Server", "Entra ID"],
  },
  {
    slug: "vmware",
    name: "vmware",
    logo: "/logos/vendors/vmware.webp",
    categories: ["servers"],
    tier:     { pl: "Principal Partner", en: "Principal Partner" },
    tagline:  {
      pl: "vSphere, vSAN i NSX — dojrzała wirtualizacja klasy enterprise.",
      en: "vSphere, vSAN and NSX — mature enterprise-grade virtualization.",
    },
    intro: {
      pl: "VMware to bazowa warstwa wirtualizacji w wielu naszych wdrożeniach. Wspieramy w utrzymaniu, modernizacji i optymalizacji licencyjnej środowisk vSphere / vSAN / NSX.",
      en: "VMware is the baseline virtualization layer in many of our deployments. We support the maintenance, modernization and license optimization of vSphere / vSAN / NSX environments.",
    },
    highlights: {
      pl: ["vSphere upgrade paths", "vSAN HCI stretched clusters", "NSX micro-segmentation"],
      en: ["vSphere upgrade paths", "vSAN HCI stretched clusters", "NSX micro-segmentation"],
    },
    products: ["vSphere", "vSAN", "NSX", "Aria"],
  },
  {
    slug: "proxmox",
    name: "proxmox",
    logo: null,
    categories: ["servers"],
    tier:     { pl: "Community Partner", en: "Community Partner" },
    tagline:  {
      pl: "Otwarta wirtualizacja KVM / LXC dla organizacji cenionych za elastyczność.",
      en: "Open-source KVM / LXC virtualization for organisations that value flexibility.",
    },
    intro: {
      pl: "Proxmox VE to nasza propozycja dla klientów, którzy chcą uniknąć modelu licencyjnego VMware i zbudować środowisko wirtualizacyjne w oparciu o open source — bez utraty klasy enterprise.",
      en: "Proxmox VE is our proposal for clients who want to avoid the VMware licensing model and build a virtualization environment on open source — without giving up on enterprise-grade features.",
    },
    highlights: {
      pl: ["Klastry Proxmox VE", "Backup PBS", "Migracje z VMware"],
      en: ["Proxmox VE clusters", "PBS Backup", "VMware migrations"],
    },
    products: ["Proxmox VE", "Proxmox Backup Server", "Proxmox Mail Gateway"],
  },
  {
    slug: "huawei",
    name: "Huawei",
    logo: null,
    categories: ["storage", "network"],
    tier:     { pl: "Gold Partner", en: "Gold Partner" },
    tagline:  {
      pl: "Storage OceanStor i sieć CloudEngine dla dużych centrów danych.",
      en: "OceanStor storage and CloudEngine networking for large datacenters.",
    },
    intro: {
      pl: "Huawei to platformy sprawdzone w skali telco i enterprise — macierze OceanStor Dorado, sieć CloudEngine oraz kompletne rozwiązania datacenter.",
      en: "Huawei — platforms proven at telco and enterprise scale: OceanStor Dorado arrays, CloudEngine fabric and end-to-end datacenter solutions.",
    },
    highlights: {
      pl: ["OceanStor Dorado all-flash", "CloudEngine 100/400G", "SmartKit deployment"],
      en: ["OceanStor Dorado all-flash", "CloudEngine 100/400G", "SmartKit deployment"],
    },
    products: ["OceanStor", "CloudEngine", "FusionServer"],
  },
  {
    slug: "pure-storage",
    name: "Pure Storage",
    logo: null,
    categories: ["storage"],
    tier:     { pl: "Elite Partner", en: "Elite Partner" },
    tagline:  {
      pl: "All-flash bez kompromisów — z modelem Evergreen//One.",
      en: "All-flash with no compromises — with the Evergreen//One model.",
    },
    intro: {
      pl: "Pure Storage FlashArray//X i //C zmieniają zasady gry w klasie all-flash — deduplikacja inline, gwarantowana wydajność i model as-a-service Evergreen//One.",
      en: "Pure Storage FlashArray//X and //C change the rules of the all-flash game — inline dedup, guaranteed performance and the Evergreen//One as-a-service model.",
    },
    highlights: {
      pl: ["FlashArray //X, //C, //E", "Portworx dla Kubernetes", "Evergreen//One STaaS"],
      en: ["FlashArray //X, //C, //E", "Portworx for Kubernetes", "Evergreen//One STaaS"],
    },
    products: ["FlashArray", "FlashBlade", "Portworx"],
  },
  {
    slug: "commvault",
    name: "Commvault",
    logo: "/logos/vendors/commvault.webp",
    categories: ["backup"],
    tier:     { pl: "Value Added Partner", en: "Value Added Partner" },
    tagline:  {
      pl: "Backup i cyber-resilience klasy enterprise — jedno API na wszystko.",
      en: "Enterprise backup and cyber-resilience — one API for everything.",
    },
    intro: {
      pl: "Commvault to platforma backup, DR i cyber-resilience klasy enterprise. Chroni środowiska on-prem, hyperscale cloud, SaaS (M365, Salesforce) i Kubernetes z jednego interfejsu.",
      en: "Commvault is the enterprise backup, DR and cyber-resilience platform. It protects on-prem, hyperscale cloud, SaaS (M365, Salesforce) and Kubernetes from a single interface.",
    },
    highlights: {
      pl: ["Immutable / air-gapped copies", "Threat scan & recovery testing", "Cloud & SaaS coverage"],
      en: ["Immutable / air-gapped copies", "Threat scan & recovery testing", "Cloud & SaaS coverage"],
    },
    products: ["Commvault Cloud", "HyperScale X", "Metallic SaaS"],
  },
  {
    slug: "veeam",
    name: "Veeam",
    logo: "/logos/vendors/veeam.webp",
    categories: ["backup"],
    tier:     { pl: "Platinum Partner", en: "Platinum Partner" },
    tagline:  {
      pl: "Numer 1 w backupie — od VBR po Veeam Data Platform.",
      en: "The #1 in backup — from VBR to the Veeam Data Platform.",
    },
    intro: {
      pl: "Veeam Backup & Replication oraz Data Platform to fundament naszych projektów zabezpieczenia danych. Wspieramy klientów w każdej fazie — od licencjonowania po immutable repositories.",
      en: "Veeam Backup & Replication and the Data Platform are the foundation of our data-protection projects. We support customers at every stage — from licensing to immutable repositories.",
    },
    highlights: {
      pl: ["Immutable & object-lock repos", "SureBackup i SureReplica", "M365 / Salesforce protection"],
      en: ["Immutable & object-lock repos", "SureBackup and SureReplica", "M365 / Salesforce protection"],
    },
    products: ["VBR", "Data Platform", "Backup for Microsoft 365"],
  },
  {
    slug: "arista",
    name: "ARISTA",
    logo: "/logos/vendors/arista.webp",
    categories: ["network"],
    tier:     { pl: "Certified Partner", en: "Certified Partner" },
    tagline:  {
      pl: "Sieć klasy hyperscale — spline / leaf-spine z EOS i CloudVision.",
      en: "Hyperscale-class networking — spline / leaf-spine with EOS and CloudVision.",
    },
    intro: {
      pl: "Arista to nasz wybór do budowy sieci datacenter high-performance. Przełączniki serii 7000 z EOS i CloudVision dają widoczność i automatyzację, których brakuje w klasycznych rozwiązaniach.",
      en: "Arista is our choice for high-performance datacenter networks. The 7000-series switches with EOS and CloudVision deliver visibility and automation that classic solutions lack.",
    },
    highlights: {
      pl: ["EVPN-VXLAN leaf-spine", "CloudVision observability", "400G ready"],
      en: ["EVPN-VXLAN leaf-spine", "CloudVision observability", "400G ready"],
    },
    products: ["7000 Series", "EOS", "CloudVision"],
  },
  {
    slug: "hpe",
    name: "HPE",
    logo: "/logos/vendors/hpe.webp",
    categories: ["network"],
    tier:     { pl: "Silver Partner", en: "Silver Partner" },
    tagline:  {
      pl: "Aruba, ProLiant i Alletra — pełne portfolio dla enterprise.",
      en: "Aruba, ProLiant and Alletra — full portfolio for enterprise.",
    },
    intro: {
      pl: "HPE to zaufany dostawca w warstwach sieciowej (Aruba), serwerowej (ProLiant) i storage (Alletra). Wspieramy klientów w kompleksowych projektach modernizacyjnych.",
      en: "HPE is a trusted vendor across networking (Aruba), servers (ProLiant) and storage (Alletra). We help customers with comprehensive modernization projects.",
    },
    highlights: {
      pl: ["Aruba CX i Central", "ProLiant Gen11", "Alletra MP"],
      en: ["Aruba CX and Central", "ProLiant Gen11", "Alletra MP"],
    },
    products: ["Aruba", "ProLiant", "Alletra"],
  },
  {
    slug: "extreme-networks",
    name: "Extreme Networks",
    logo: "/logos/vendors/extreme-networks.webp",
    categories: ["network"],
    tier:     { pl: "Diamond Partner", en: "Diamond Partner" },
    tagline:  {
      pl: "Fabric Connect i cloud-native ExtremeCloud IQ.",
      en: "Fabric Connect and cloud-native ExtremeCloud IQ.",
    },
    intro: {
      pl: "Extreme Networks to nasza propozycja dla klientów szukających prostej, cloud-managed sieci enterprise z zaawansowanym fabric i AI-driven operations.",
      en: "Extreme Networks — our proposal for customers looking for a simple, cloud-managed enterprise network with advanced fabric and AI-driven operations.",
    },
    highlights: {
      pl: ["Fabric Connect / SPB", "ExtremeCloud IQ", "AI-driven operations"],
      en: ["Fabric Connect / SPB", "ExtremeCloud IQ", "AI-driven operations"],
    },
    products: ["ExtremeCloud IQ", "VSP", "Universal Switches"],
  },
  {
    slug: "cisco",
    name: "Cisco",
    logo: "/logos/vendors/cisco.webp",
    categories: ["network"],
    tier:     { pl: "Premier Partner", en: "Premier Partner" },
    tagline:  {
      pl: "Cisco Nexus, Catalyst, Meraki, ISE — pełny portfel sieciowo-security.",
      en: "Cisco Nexus, Catalyst, Meraki, ISE — full networking-security portfolio.",
    },
    intro: {
      pl: "Cisco jest referencyjnym dostawcą sprzętu sieciowego. Wdrażamy Nexus w datacenter, Catalyst w campus, Meraki w oddziałach oraz Cisco ISE i Umbrella w warstwie security.",
      en: "Cisco is a reference network vendor. We deploy Nexus in the datacenter, Catalyst in campus, Meraki in branches and Cisco ISE and Umbrella at the security layer.",
    },
    highlights: {
      pl: ["Nexus 9000 ACI/VXLAN", "Meraki cloud-managed", "ISE 802.1X, TrustSec"],
      en: ["Nexus 9000 ACI/VXLAN", "Meraki cloud-managed", "ISE 802.1X, TrustSec"],
    },
    products: ["Nexus", "Catalyst", "Meraki", "ISE"],
  },
  {
    slug: "brocade",
    name: "Brocade",
    logo: "/logos/vendors/brocade.webp",
    categories: ["network"],
    tier:     { pl: "Authorized Partner", en: "Authorized Partner" },
    tagline:  {
      pl: "Fibre Channel klasy enterprise — Brocade jako standard SAN.",
      en: "Enterprise-grade Fibre Channel — Brocade as the SAN standard.",
    },
    intro: {
      pl: "Brocade (Broadcom) to nasz standard w projektach SAN Fibre Channel. Gen 6 / Gen 7 z Fabric Vision dają widoczność, której nie osiągniemy w klasycznych narzędziach.",
      en: "Brocade (Broadcom) is our standard for Fibre Channel SAN projects. Gen 6 / Gen 7 with Fabric Vision give visibility unreachable in classic tools.",
    },
    highlights: {
      pl: ["Fibre Channel Gen 7 64G", "Fabric Vision", "SAN Health assessments"],
      en: ["Fibre Channel Gen 7 64G", "Fabric Vision", "SAN Health assessments"],
    },
    products: ["G710", "G720", "X7 Director"],
  },
  {
    slug: "sailpoint",
    name: "SailPoint",
    logo: "/logos/vendors/sailpoint.webp",
    categories: ["security"],
    tier:     { pl: "Delivery Partner", en: "Delivery Partner" },
    tagline:  {
      pl: "Identity Security — governance dostępu w skali enterprise.",
      en: "Identity Security — access governance at enterprise scale.",
    },
    intro: {
      pl: "SailPoint IdentityIQ / Identity Security Cloud to nasza rekomendacja dla klientów objętych regulacjami. Governance dostępu, certyfikacje, joiner-mover-leaver zautomatyzowane.",
      en: "SailPoint IdentityIQ / Identity Security Cloud is our recommendation for regulated customers. Access governance, certifications and joiner-mover-leaver automation.",
    },
    highlights: {
      pl: ["Governance i certyfikacje dostępu", "AI-driven access recommendations", "SoD policies"],
      en: ["Access governance and certifications", "AI-driven access recommendations", "SoD policies"],
    },
    products: ["Identity Security Cloud", "IdentityIQ"],
  },
  {
    slug: "baramundi",
    name: "baramundi",
    logo: "/logos/vendors/baramundi.webp",
    categories: ["security"],
    tier:     { pl: "Certified Partner", en: "Certified Partner" },
    tagline:  {
      pl: "Unified Endpoint Management dla środowisk mieszanych.",
      en: "Unified Endpoint Management for mixed environments.",
    },
    intro: {
      pl: "baramundi Management Suite pozwala zarządzać, aktualizować i chronić endpointy — Windows, macOS, Linux, iOS i Android — z jednego panelu, z automatyzacją godną enterprise.",
      en: "baramundi Management Suite lets you manage, patch and secure endpoints — Windows, macOS, Linux, iOS and Android — from a single pane with enterprise-grade automation.",
    },
    highlights: {
      pl: ["Patch management multi-OS", "Vulnerability scans", "OS deployment"],
      en: ["Multi-OS patch management", "Vulnerability scans", "OS deployment"],
    },
    products: ["bMS", "Automation Studio", "Vulnerability Scanner"],
  },
  {
    slug: "google",
    name: "Google",
    logo: "/logos/vendors/google.webp",
    categories: ["software"],
    tier:     { pl: "Cloud Partner", en: "Cloud Partner" },
    tagline:  {
      pl: "Google Cloud Platform i Workspace — enterprise-grade productivity + cloud.",
      en: "Google Cloud Platform and Workspace — enterprise productivity + cloud.",
    },
    intro: {
      pl: "Wdrażamy Google Workspace jako alternatywę dla M365 oraz projektujemy landing zones w Google Cloud Platform (GKE, BigQuery, Vertex AI).",
      en: "We deploy Google Workspace as an alternative to M365 and design landing zones on Google Cloud Platform (GKE, BigQuery, Vertex AI).",
    },
    highlights: {
      pl: ["GCP landing zones", "GKE / Anthos", "Workspace migrations"],
      en: ["GCP landing zones", "GKE / Anthos", "Workspace migrations"],
    },
    products: ["Google Cloud", "Workspace", "GKE", "Vertex AI"],
  },
  {
    slug: "aws",
    name: "AWS",
    logo: "/logos/vendors/aws.webp",
    categories: ["software"],
    tier:     { pl: "Select Consulting Partner", en: "Select Consulting Partner" },
    tagline:  {
      pl: "Amazon Web Services — hyperscale cloud dla wymagających workloadów.",
      en: "Amazon Web Services — hyperscale cloud for demanding workloads.",
    },
    intro: {
      pl: "Wspieramy klientów w migracji do AWS oraz optymalizacji istniejących środowisk. Landing zones, VPC design, IAM, cost optimization, backup w S3 Glacier.",
      en: "We support clients in migrating to AWS and optimising existing environments. Landing zones, VPC design, IAM, cost optimization, S3 Glacier backup.",
    },
    highlights: {
      pl: ["Landing zones z Control Tower", "Well-Architected reviews", "FinOps"],
      en: ["Control Tower landing zones", "Well-Architected reviews", "FinOps"],
    },
    products: ["EC2", "S3", "EKS", "RDS"],
  },
  {
    slug: "uptime-dc",
    name: "uptime DC",
    logo: null,
    categories: ["software"],
    tier:     { pl: "Technology Partner", en: "Technology Partner" },
    tagline:  {
      pl: "Monitoring dostępności i wydajności datacenter — 24/7 observability.",
      en: "Availability and performance monitoring for the datacenter — 24/7 observability.",
    },
    intro: {
      pl: "uptime DC to platforma monitoringu, którą polecamy dla klientów potrzebujących observability na warstwach infrastruktury, aplikacji i biznesu — w jednym widoku.",
      en: "uptime DC is a monitoring platform we recommend for customers needing observability across infrastructure, application and business layers — in a single view.",
    },
    highlights: {
      pl: ["Multi-layer observability", "Alerting oparte o SLA", "Raportowanie dla zarządu"],
      en: ["Multi-layer observability", "SLA-based alerting", "Executive reporting"],
    },
    products: ["Uptime Infrastructure Monitor"],
  },
  {
    slug: "xorux",
    name: "xorux",
    logo: null,
    categories: ["software"],
    tier:     { pl: "Technology Partner", en: "Technology Partner" },
    tagline:  {
      pl: "Performance monitoring dla środowisk storage i wirtualizacji.",
      en: "Performance monitoring for storage and virtualization environments.",
    },
    intro: {
      pl: "Xorux LPAR2RRD i STOR2RRD to specjalistyczne narzędzia performance-monitoring dla środowisk Power, VMware oraz enterprise storage — dane, których nie zobaczysz w standardowych rozwiązaniach.",
      en: "Xorux LPAR2RRD and STOR2RRD are specialised performance-monitoring tools for Power, VMware and enterprise storage environments — data you won't see in standard tools.",
    },
    highlights: {
      pl: ["LPAR2RRD dla IBM Power", "STOR2RRD dla macierzy", "Capacity planning"],
      en: ["LPAR2RRD for IBM Power", "STOR2RRD for storage arrays", "Capacity planning"],
    },
    products: ["LPAR2RRD", "STOR2RRD"],
  },
];

// Slug → partner map for O(1) lookup in PartnerDetailPage.
export const PARTNERS_BY_SLUG = Object.freeze(
  PARTNERS.reduce((acc, p) => ({ ...acc, [p.slug]: p }), {})
);

export default PARTNERS;
