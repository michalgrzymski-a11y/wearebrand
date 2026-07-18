import React, { createContext, useContext, useMemo, useState } from "react";
import { translations } from "./translations";

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    if (typeof window === "undefined") return "pl";
    return localStorage.getItem("sc_lang") || "pl";
  });

  const value = useMemo(() => {
    const setLanguage = (next) => {
      setLang(next);
      try {
        localStorage.setItem("sc_lang", next);
      } catch (e) {
        // ignore storage failures
      }
    };
    const toggle = () => setLanguage(lang === "pl" ? "en" : "pl");
    return {
      lang,
      setLang: setLanguage,
      toggle,
      t: translations[lang],
    };
  }, [lang]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
};
