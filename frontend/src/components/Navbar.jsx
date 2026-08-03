import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useLang } from "@/i18n/LanguageContext";

const NAV_LINKS = [
  { id: "about", key: "about" },
  { id: "portfolio", key: "services" },
  { id: "partners", key: "partners" },
  { id: "contact", key: "contact" },
];

const SECTION_THEMES = {
  top: "dark",
  values: "dark",
  about: "light",
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
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                data-testid={`nav-link-${l.key}`}
                className="sc-nav-link"
              >
                {t.nav[l.key]}
              </a>
            ))}
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
          {NAV_LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              data-testid={`mobile-nav-link-${l.key}`}
              className="sc-mobile-menu__link"
              onClick={closeMenu}
            >
              {t.nav[l.key]}
            </a>
          ))}
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
