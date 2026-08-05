import React, { useEffect, useRef, useState } from "react";
import { Menu, X, ChevronDown, Server, ShieldCheck, Wrench, Coins, Database } from "lucide-react";
import { useLang } from "@/i18n/LanguageContext";

/* Nav structure. `href` = anchor on the page (starts with '#') OR route path.
   Some links have a `dropdown` — a mega-menu grid of categories. */
const NAV = [
  { key: "home",    href: "/#top"      },
  { key: "about",   href: "/#about-v2" },
  {
    key: "offer",
    href: "/robocze",
    dropdown: [
      {
        id: "hardware",
        titlePL: "Sprzęt IT",
        titleEN: "IT Hardware",
        Icon: Server,
        items: [
          { pl: "Serwery & Wirtualizacja", en: "Servers & Virtualization", href: "/robocze#hardware-gallery" },
          { pl: "Macierze Dyskowe",        en: "Storage Arrays",           href: "/robocze#netapp-aff"  },
          { pl: "Przełączniki Sieciowe",   en: "Network Switches",         href: "/robocze#markets-switch" },
          { pl: "Archive",                 en: "Archive",                  href: "/#tape-library" },
          { pl: "Deduplikatory",           en: "Deduplicators",            href: "/robocze#data-reduction" },
        ],
      },
      {
        id: "backup",
        titlePL: "Backup",
        titleEN: "Backup",
        Icon: Database,
        href: "/robocze#continuity",
        items: [],
      },
      {
        id: "security",
        titlePL: "Security",
        titleEN: "Security",
        Icon: ShieldCheck,
        items: [
          { pl: "Firewall",  en: "Firewall",   href: "/robocze#ngfw" },
          { pl: "IDM",       en: "IDM",        href: "/robocze#ngfw" },
          { pl: "MDM / UEM", en: "MDM / UEM",  href: "/robocze#baramundi" },
          { pl: "EDR / XDR", en: "EDR / XDR",  href: "/robocze#threatwise" },
        ],
      },
      {
        id: "services",
        titlePL: "Usługi IT",
        titleEN: "IT Services",
        Icon: Wrench,
        items: [
          { pl: "Usługi IT",           en: "IT Services",         href: "/robocze#portfolio" },
          { pl: "Usługi DataCenter",   en: "Data Center Services", href: "/robocze#server-assembly" },
        ],
      },
      {
        id: "optim",
        titlePL: "Optymalizacja kosztów",
        titleEN: "Cost optimisation",
        Icon: Coins,
        href: "/robocze#savings",
        items: [],
      },
    ],
  },
  { key: "savings", href: "/robocze#savings" },
  { key: "robocze", href: "/robocze" },
  { key: "contact", href: "/#contact" },
];

const SECTION_THEMES = {
  top: "dark",
  values: "dark",
  about: "light",
  "about-v2": "dark",
  process: "dark",
  hardware: "dark",
  savings: "light",
  trusted: "light",
  portfolio: "light",
  "tape-library": "dark",
  continuity: "light",
  sectors: "light",
  "markets-switch": "dark",
  "partners-rack": "dark",
  partners: "light",
  contact: "dark",
  "values-3d": "dark",
  "compliance-switch": "dark",
  "hardware-gallery": "dark",
  ngfw: "dark",
};

/**
 * Navbar — fixed, glassy, always visible. Text color adapts to the section
 * currently in view (dark ↔ light). Includes off-canvas hamburger menu
 * for viewports below `lg`.
 */
const Navbar = () => {
  const { t, lang, toggle } = useLang();
  const [theme, setTheme] = useState("dark");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);      // desktop mega
  const [mobileGroup, setMobileGroup]   = useState(null);      // mobile accordion
  const closeTimer = useRef(null);

  // Close mega-menu when clicking outside / hitting Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setOpenDropdown(null); };
    const onClick = (e) => {
      if (!e.target.closest(".sc-nav-dropdown-wrap")) setOpenDropdown(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled((window.scrollY || 0) > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = Object.keys(SECTION_THEMES);
    const nodes = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!nodes.length) return;
    const visibility = new Map();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          visibility.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0);
        });
        let bestId = "top";
        let bestScore = -1;
        visibility.forEach((score, id) => {
          if (score > bestScore) {
            bestScore = score;
            bestId = id;
          }
        });
        setTheme(SECTION_THEMES[bestId] || "dark");
      },
      { rootMargin: "-90px 0px -55% 0px", threshold: [0, 0.15, 0.35, 0.6, 1] }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const isDark = theme === "dark";
  const logoSrc = `${process.env.PUBLIC_URL}/${isDark ? "logo-white.webp" : "logo-black.webp"}`;

  const closeMenu = () => setMobileOpen(false);

  return (
    <>
      <header
        data-testid="site-navbar"
        data-theme={theme}
        className={`sc-nav sc-nav--fixed ${isDark ? "sc-nav--dark" : "sc-nav--light"} ${scrolled ? "is-scrolled" : ""}`}
      >
        <div className="mx-auto max-w-7xl px-5 md:px-10 py-3 md:py-4 flex items-center justify-between gap-3">
          <a
            href="#top"
            data-testid="nav-brand"
            className="flex items-center gap-2 group flex-shrink-0"
            onClick={closeMenu}
          >
            <img
              src={logoSrc}
              alt="Smart Clout"
              className="h-10 md:h-12 lg:h-14 w-auto select-none transition-[height] duration-300"
              draggable="false"
            />
          </a>

          {/* Desktop nav — lg and above */}
          <nav
            className="hidden lg:flex items-center gap-8"
            onMouseLeave={() => setOpenDropdown(null)}
          >
            {NAV.map((l) => {
              const label = t.nav[l.key];
              if (!l.dropdown) {
                return (
                  <a
                    key={l.key}
                    href={l.href}
                    data-testid={`nav-link-${l.key}`}
                    className="sc-nav-link"
                    onClick={closeMenu}
                  >
                    {label}
                  </a>
                );
              }
              const isOpen = openDropdown === l.key;
              return (
                <div
                  key={l.key}
                  className="sc-nav-dropdown-wrap"
                  onMouseEnter={() => setOpenDropdown(l.key)}
                >
                  <button
                    type="button"
                    data-testid={`nav-link-${l.key}`}
                    className={`sc-nav-link sc-nav-link--has-menu ${isOpen ? "is-open" : ""}`}
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                    onClick={() => setOpenDropdown(isOpen ? null : l.key)}
                  >
                    {label}
                    <ChevronDown size={13} strokeWidth={2.2} className="sc-nav-chev" />
                  </button>

                  <div
                    className={`sc-mega ${isOpen ? "is-open" : ""}`}
                    data-testid="nav-mega"
                    aria-hidden={!isOpen}
                    role="menu"
                  >
                    <div className="sc-mega__inner">
                      {l.dropdown.map((cat) => {
                        const title = lang === "pl" ? cat.titlePL : cat.titleEN;
                        return (
                          <div key={cat.id} className="sc-mega__col">
                            <a
                              href={cat.href || (cat.items[0] && cat.items[0].href) || "#"}
                              className="sc-mega__head"
                              data-testid={`mega-cat-${cat.id}`}
                              onClick={() => setOpenDropdown(null)}
                            >
                              <span className="sc-mega__head-icon">
                                <cat.Icon size={16} strokeWidth={1.9} />
                              </span>
                              <span className="sc-mega__head-title">{title}</span>
                            </a>
                            {cat.items && cat.items.length > 0 && (
                              <ul className="sc-mega__list">
                                {cat.items.map((it) => (
                                  <li key={it.href + it.pl}>
                                    <a
                                      href={it.href}
                                      className="sc-mega__item"
                                      data-testid={`mega-item-${cat.id}-${(lang === "pl" ? it.pl : it.en).replace(/\s+/g, "-").toLowerCase()}`}
                                      onClick={() => setOpenDropdown(null)}
                                    >
                                      <span className="sc-mega__item-dot" />
                                      {lang === "pl" ? it.pl : it.en}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              type="button"
              onClick={toggle}
              data-testid="lang-toggle"
              className="sc-lang-toggle"
              aria-label="Change language"
            >
              <span className={lang === "pl" ? "is-active" : ""}>PL</span>
              <span className="sc-lang-toggle__sep">/</span>
              <span className={lang === "en" ? "is-active" : ""}>EN</span>
            </button>

            {/* CTA visible only on desktop */}
            <a
              href="#contact"
              data-testid="nav-cta"
              className="sc-nav-cta sc-nav-cta--desktop"
            >
              {t.nav.cta}
            </a>

            {/* Hamburger visible below lg */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              data-testid="nav-hamburger"
              className="sc-nav-hamburger lg:hidden"
              aria-label={mobileOpen ? "Zamknij menu" : "Otwórz menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile off-canvas menu */}
      <div
        data-testid="mobile-menu"
        className={`sc-mobile-menu ${mobileOpen ? "is-open" : ""}`}
        aria-hidden={!mobileOpen}
      >
        <nav className="sc-mobile-menu__nav">
          {NAV.map((l) => {
            const label = t.nav[l.key];
            if (!l.dropdown) {
              return (
                <a
                  key={l.key}
                  href={l.href}
                  data-testid={`mobile-nav-link-${l.key}`}
                  className="sc-mobile-menu__link"
                  onClick={closeMenu}
                >
                  {label}
                </a>
              );
            }
            const isOpen = mobileGroup === l.key;
            return (
              <div key={l.key} className="sc-mobile-menu__group">
                <button
                  type="button"
                  data-testid={`mobile-nav-toggle-${l.key}`}
                  className={`sc-mobile-menu__link sc-mobile-menu__link--group ${isOpen ? "is-open" : ""}`}
                  onClick={() => setMobileGroup(isOpen ? null : l.key)}
                  aria-expanded={isOpen}
                >
                  {label}
                  <ChevronDown size={16} strokeWidth={2} className="sc-mobile-menu__chev" />
                </button>
                {isOpen && (
                  <div className="sc-mobile-menu__submenu">
                    {l.dropdown.map((cat) => {
                      const title = lang === "pl" ? cat.titlePL : cat.titleEN;
                      return (
                        <div key={cat.id} className="sc-mobile-menu__cat">
                          <a
                            href={cat.href || (cat.items[0] && cat.items[0].href) || "#"}
                            className="sc-mobile-menu__cat-head"
                            onClick={closeMenu}
                          >
                            <cat.Icon size={14} strokeWidth={1.9} />
                            {title}
                          </a>
                          {cat.items && cat.items.length > 0 && (
                            <ul className="sc-mobile-menu__cat-list">
                              {cat.items.map((it) => (
                                <li key={it.href + it.pl}>
                                  <a
                                    href={it.href}
                                    className="sc-mobile-menu__cat-item"
                                    onClick={closeMenu}
                                  >
                                    {lang === "pl" ? it.pl : it.en}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
          <a
            href="#contact"
            data-testid="mobile-nav-cta"
            className="sc-nav-cta sc-mobile-menu__cta"
            onClick={closeMenu}
          >
            {t.nav.cta}
          </a>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
