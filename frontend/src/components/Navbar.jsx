import React from "react";
import { useLang } from "@/i18n/LanguageContext";

const NAV_LINKS = [
  { id: "about", key: "about" },
  { id: "portfolio", key: "services" },
  { id: "partners", key: "partners" },
  { id: "contact", key: "contact" },
];

/**
 * Navbar — sits above the Hero on its dark background (transparent, not fixed).
 * It scrolls away with the Hero so light sections below stay clean.
 */
const Navbar = () => {
  const { t, lang, toggle } = useLang();

  return (
    <header data-testid="site-navbar" className="absolute inset-x-0 top-0 z-50 sc-nav">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-5 md:py-6 flex items-center justify-between">
        <a href="#top" data-testid="nav-brand" className="flex items-center gap-2 group">
          <img
            src={`${process.env.PUBLIC_URL}/logo-white.webp`}
            alt="Smart Clout"
            className="h-9 md:h-10 w-auto select-none"
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
