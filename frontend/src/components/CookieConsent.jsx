import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Cookie, Settings2, X, Check } from "lucide-react";
import { useLang } from "@/i18n/LanguageContext";

/**
 * GDPR / EU-compliant Cookie Consent
 * - Bottom bar with 3 equally-weighted actions:
 *   Accept all / Reject all / Settings
 * - Preferences modal with 4 categories:
 *   Necessary (always on) / Functional / Analytics / Marketing
 * - Floating "cookie" button (bottom-right) once user has decided,
 *   allowing them to reopen preferences at any time.
 * - Persists to localStorage under CONSENT_KEY.
 * - Dispatches "sc:consent-change" event so analytics/marketing scripts
 *   can react to consent updates.
 */

const CONSENT_KEY = "smartclout_consent_v1";
const CONSENT_VERSION = 1;

const DEFAULT_PREFS = {
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
};

const readConsent = () => {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.v !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
};

const writeConsent = (prefs) => {
  const payload = {
    v: CONSENT_VERSION,
    ts: new Date().toISOString(),
    prefs: { ...DEFAULT_PREFS, ...prefs, necessary: true },
  };
  localStorage.setItem(CONSENT_KEY, JSON.stringify(payload));
  window.dispatchEvent(new CustomEvent("sc:consent-change", { detail: payload }));
  return payload;
};

const COPY = {
  pl: {
    banner_title: "Dbamy o Twoją prywatność",
    banner_body:
      "Używamy plików cookie, aby zapewnić działanie strony, analizować ruch i personalizować treści. Możesz zaakceptować wszystkie, odrzucić wszystkie lub dostosować swój wybór. Więcej informacji znajdziesz w naszej ",
    banner_body_link: "Polityce Prywatności",
    banner_body_end: ".",
    accept_all: "Akceptuj wszystkie",
    reject_all: "Odrzuć wszystkie",
    settings: "Ustawienia",
    save_prefs: "Zapisz wybór",
    reopen_label: "Ustawienia cookies",
    modal_title: "Ustawienia plików cookie",
    modal_intro:
      "Wybierz, które kategorie plików cookie chcesz zaakceptować. Niezbędne pliki cookie są zawsze aktywne, ponieważ są wymagane do prawidłowego działania strony.",
    close: "Zamknij",
    always_on: "Zawsze aktywne",
    categories: {
      necessary: {
        name: "Niezbędne",
        desc:
          "Pliki cookie wymagane do prawidłowego działania strony — sesja, bezpieczeństwo, preferencje językowe. Nie mogą zostać wyłączone.",
      },
      functional: {
        name: "Funkcjonalne",
        desc:
          "Zapamiętują Twoje preferencje (język, motyw, kroje) i usprawniają korzystanie z serwisu. Brak zgody nie blokuje strony, ale niektóre funkcje mogą być mniej wygodne.",
      },
      analytics: {
        name: "Analityczne",
        desc:
          "Pomagają nam zrozumieć jak korzystasz ze strony — mierzymy odwiedziny, czas na stronie i skuteczność treści. Dane są zagregowane i nie identyfikują Cię osobiście.",
      },
      marketing: {
        name: "Marketingowe",
        desc:
          "Umożliwiają pokazywanie spersonalizowanych treści i reklam na innych stronach oraz mierzenie skuteczności kampanii.",
      },
    },
  },
  en: {
    banner_title: "We value your privacy",
    banner_body:
      "We use cookies to ensure our site works, to analyze traffic and to personalize content. You can accept all, reject all, or customize your choice. Learn more in our ",
    banner_body_link: "Privacy Policy",
    banner_body_end: ".",
    accept_all: "Accept all",
    reject_all: "Reject all",
    settings: "Settings",
    save_prefs: "Save choice",
    reopen_label: "Cookie settings",
    modal_title: "Cookie preferences",
    modal_intro:
      "Choose which cookie categories you want to accept. Necessary cookies are always active because they are required for the site to function.",
    close: "Close",
    always_on: "Always on",
    categories: {
      necessary: {
        name: "Necessary",
        desc:
          "Cookies required for basic site functionality — session, security, language preferences. Cannot be disabled.",
      },
      functional: {
        name: "Functional",
        desc:
          "Remember your preferences (language, theme) and improve the experience. Declining does not block the site but some features may be less convenient.",
      },
      analytics: {
        name: "Analytics",
        desc:
          "Help us understand how you use the site — visits, time on page and content effectiveness. Data is aggregated and does not identify you personally.",
      },
      marketing: {
        name: "Marketing",
        desc:
          "Allow us to show personalized content and ads on other sites and measure campaign effectiveness.",
      },
    },
  },
};

const CookieConsent = () => {
  const { lang } = useLang();
  const t = COPY[lang] || COPY.pl;

  const [decided, setDecided] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);

  // Initial mount — read existing consent, otherwise show banner.
  useEffect(() => {
    const existing = readConsent();
    if (existing) {
      setDecided(true);
      setPrefs(existing.prefs);
    } else {
      // Small delay so it doesn't fight with initial page paint
      const to = setTimeout(() => setShowBanner(true), 400);
      return () => clearTimeout(to);
    }
  }, []);

  // Allow other components (footer link, floating btn) to reopen the modal.
  useEffect(() => {
    const handler = () => setShowModal(true);
    window.addEventListener("sc:open-cookie-settings", handler);
    return () => window.removeEventListener("sc:open-cookie-settings", handler);
  }, []);

  const finalize = useCallback((newPrefs) => {
    writeConsent(newPrefs);
    setPrefs({ ...DEFAULT_PREFS, ...newPrefs, necessary: true });
    setDecided(true);
    setShowBanner(false);
    setShowModal(false);
  }, []);

  const acceptAll = () =>
    finalize({ necessary: true, functional: true, analytics: true, marketing: true });
  const rejectAll = () =>
    finalize({ necessary: true, functional: false, analytics: false, marketing: false });

  const togglePref = (key) => {
    if (key === "necessary") return;
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
  };

  const savePrefs = () => finalize(prefs);

  const openSettings = () => {
    // If decided already, we should populate current prefs (already in state).
    setShowModal(true);
  };

  return (
    <>
      {/* ---------- Bottom banner ---------- */}
      {showBanner && !showModal && (
        <div
          role="dialog"
          aria-live="polite"
          aria-label={t.banner_title}
          data-testid="cookie-banner"
          className="sc-cc-banner"
        >
          <div className="sc-cc-banner__inner">
            <div className="sc-cc-banner__icon" aria-hidden="true">
              <Cookie size={22} />
            </div>
            <div className="sc-cc-banner__copy">
              <div className="sc-cc-banner__title">{t.banner_title}</div>
              <p className="sc-cc-banner__text">
                {t.banner_body}
                <Link
                  to="/polityka-prywatnosci"
                  className="sc-cc-banner__link"
                  data-testid="cookie-banner-privacy-link"
                >
                  {t.banner_body_link}
                </Link>
                {t.banner_body_end}
              </p>
            </div>
            <div className="sc-cc-banner__actions">
              <button
                type="button"
                onClick={openSettings}
                className="sc-cc-btn sc-cc-btn--ghost"
                data-testid="cookie-banner-settings"
              >
                <Settings2 size={14} strokeWidth={2} />
                <span>{t.settings}</span>
              </button>
              <button
                type="button"
                onClick={rejectAll}
                className="sc-cc-btn sc-cc-btn--secondary"
                data-testid="cookie-banner-reject-all"
              >
                {t.reject_all}
              </button>
              <button
                type="button"
                onClick={acceptAll}
                className="sc-cc-btn sc-cc-btn--primary"
                data-testid="cookie-banner-accept-all"
              >
                {t.accept_all}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------- Preferences modal ---------- */}
      {showModal && (
        <div
          className="sc-cc-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sc-cc-modal-title"
          data-testid="cookie-modal"
          onClick={(e) => {
            if (e.target === e.currentTarget && decided) setShowModal(false);
          }}
        >
          <div className="sc-cc-modal">
            <div className="sc-cc-modal__head">
              <h2 id="sc-cc-modal-title" className="sc-cc-modal__title">
                {t.modal_title}
              </h2>
              {decided && (
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="sc-cc-modal__close"
                  aria-label={t.close}
                  data-testid="cookie-modal-close"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            <p className="sc-cc-modal__intro">{t.modal_intro}</p>

            <ul className="sc-cc-cats" data-testid="cookie-modal-categories">
              {["necessary", "functional", "analytics", "marketing"].map((k) => {
                const cat = t.categories[k];
                const on = prefs[k];
                const locked = k === "necessary";
                return (
                  <li
                    key={k}
                    className={`sc-cc-cat ${on ? "is-on" : ""} ${locked ? "is-locked" : ""}`}
                    data-testid={`cookie-cat-${k}`}
                  >
                    <div className="sc-cc-cat__row">
                      <div className="sc-cc-cat__name">
                        <span>{cat.name}</span>
                        {locked && (
                          <span className="sc-cc-cat__badge">{t.always_on}</span>
                        )}
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={on}
                        aria-label={cat.name}
                        onClick={() => togglePref(k)}
                        disabled={locked}
                        className={`sc-cc-toggle ${on ? "is-on" : ""}`}
                        data-testid={`cookie-toggle-${k}`}
                      >
                        <span className="sc-cc-toggle__knob" />
                      </button>
                    </div>
                    <p className="sc-cc-cat__desc">{cat.desc}</p>
                  </li>
                );
              })}
            </ul>

            <div className="sc-cc-modal__actions">
              <button
                type="button"
                onClick={rejectAll}
                className="sc-cc-btn sc-cc-btn--secondary"
                data-testid="cookie-modal-reject-all"
              >
                {t.reject_all}
              </button>
              <button
                type="button"
                onClick={savePrefs}
                className="sc-cc-btn sc-cc-btn--ghost"
                data-testid="cookie-modal-save"
              >
                <Check size={14} strokeWidth={2.4} />
                <span>{t.save_prefs}</span>
              </button>
              <button
                type="button"
                onClick={acceptAll}
                className="sc-cc-btn sc-cc-btn--primary"
                data-testid="cookie-modal-accept-all"
              >
                {t.accept_all}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------- Floating reopener (visible only after a decision) ---------- */}
      {decided && !showBanner && !showModal && (
        <button
          type="button"
          onClick={openSettings}
          className="sc-cc-fab"
          aria-label={t.reopen_label}
          title={t.reopen_label}
          data-testid="cookie-fab"
        >
          <Cookie size={18} strokeWidth={1.8} />
        </button>
      )}
    </>
  );
};

export default CookieConsent;
export { CONSENT_KEY, readConsent };
