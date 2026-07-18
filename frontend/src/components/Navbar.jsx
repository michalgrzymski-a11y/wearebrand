import React, { useEffect, useState } from "react";
import { useLang } from "@/i18n/LanguageContext";

const NAV_LINKS = [
  { id: "about", key: "about" },
  { id: "portfolio", key: "services" },
  { id: "partners", key: "partners" },
  { id: "contact", key: "contact" },
];

const Navbar = () => {
  const { t, lang, toggle } = useLang();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-testid="site-navbar"
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "sc-nav sc-nav--scrolled" : "sc-nav"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-4 flex items-center justify-between">
        <a
          href="#top"
          data-testid="nav-brand"
          className="flex items-center gap-2.5 text-white group"
        >
          <span className="sc-brand-mark" aria-hidden="true">
            <span className="sc-brand-mark__inner" />
          </span>
          <span className="text-[13px] tracking-[0.28em] uppercase font-semibold">
            IT Smartclout
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
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
          <a
            href="#contact"
            data-testid="nav-cta"
            className="sc-nav-cta"
          >
            {t.nav.cta}
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
