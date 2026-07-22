import React, { useEffect, useState } from "react";
import { useLang } from "@/i18n/LanguageContext";

const NAV_LINKS = [
  { id: "about", key: "about" },
  { id: "portfolio", key: "services" },
  { id: "partners", key: "partners" },
  { id: "contact", key: "contact" },
];

/* All sections wrapped by an id in <Home /> — used to detect the active theme.
   `theme` values:
     - "dark": section has a very dark background → nav text is white
     - "light": section has a light background → nav text is charcoal
*/
const SECTION_THEMES = {
  top: "dark",
  values: "dark",
  about: "light",
  hardware: "dark",
  "trusted": "light",
  portfolio: "light",
  "tape-library": "dark",
  sectors: "light",
  "markets-switch": "dark",
  "partners-rack": "dark",
  partners: "light",
  contact: "dark",
};

/**
 * Navbar — fixed, glassy, always visible. Text color adapts to the section
 * currently in view (dark ↔ light) via IntersectionObserver.
 */
const Navbar = () => {
  const { t, lang, toggle } = useLang();
  const [theme, setTheme] = useState("dark");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled((window.scrollY || 0) > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = Object.keys(SECTION_THEMES);
    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!nodes.length) return;

    // Track visibility ratio per section; pick the one most in view (top-weighted).
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
      {
        // Trigger just below the sticky nav
        rootMargin: "-90px 0px -55% 0px",
        threshold: [0, 0.15, 0.35, 0.6, 1],
      }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  const isDark = theme === "dark";
  const logoSrc = `${process.env.PUBLIC_URL}/${isDark ? "logo-white.webp" : "logo-black.webp"}`;

  return (
    <header
      data-testid="site-navbar"
      data-theme={theme}
      className={`sc-nav sc-nav--fixed ${isDark ? "sc-nav--dark" : "sc-nav--light"} ${scrolled ? "is-scrolled" : ""}`}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-3 md:py-4 flex items-center justify-between">
        <a href="#top" data-testid="nav-brand" className="flex items-center gap-2 group">
          <img
            src={logoSrc}
            alt="Smart Clout"
            className="h-12 md:h-14 w-auto select-none transition-[height] duration-300"
            draggable="false"
          />
        </a>

        <nav className="hidden md:flex items-center gap-9">
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

        <div className="flex items-center gap-3">
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
          <a href="#contact" data-testid="nav-cta" className="sc-nav-cta">
            {t.nav.cta}
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
