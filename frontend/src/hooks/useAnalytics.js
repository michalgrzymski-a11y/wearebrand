import { useEffect } from "react";
import { readConsent } from "@/components/CookieConsent";

/**
 * GA4 loader — consent-gated.
 *
 * The GA4 script is injected ONLY after the visitor grants analytics consent
 * via the cookie banner. If consent is revoked, the script is removed and
 * `_ga*` cookies are best-effort cleared.
 *
 * Configure the Measurement ID via `REACT_APP_GA_MEASUREMENT_ID` in
 * frontend/.env — while it stays as the "G-XXXXXXXXXX" placeholder,
 * the hook stays inert (but wired up).
 */

const GA_MEASUREMENT_ID =
  process.env.REACT_APP_GA_MEASUREMENT_ID || "G-XXXXXXXXXX";
const IS_PLACEHOLDER = /X{5,}/.test(GA_MEASUREMENT_ID);

const injectGA = () => {
  if (typeof window === "undefined") return;
  if (window.__scGALoaded) return;
  if (IS_PLACEHOLDER) {
    // Wired but inert until a real Measurement ID is provided.
    // eslint-disable-next-line no-console
    console.info(
      "[SmartClout] Analytics consent granted — GA4 stub active (placeholder ID). Set REACT_APP_GA_MEASUREMENT_ID to a real G-XXXXXXXXXX to activate tracking."
    );
    window.__scGALoaded = true;
    return;
  }

  const s = document.createElement("script");
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  s.async = true;
  s.setAttribute("data-sc-analytics", "ga4");
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID, {
    anonymize_ip: true,
    cookie_flags: "SameSite=None;Secure",
  });
  window.__scGALoaded = true;
};

const removeGA = () => {
  if (typeof window === "undefined") return;
  document
    .querySelectorAll("script[data-sc-analytics='ga4']")
    .forEach((el) => el.remove());
  window.__scGALoaded = false;
  // Best-effort cookie cleanup
  document.cookie.split(";").forEach((c) => {
    const name = c.trim().split("=")[0];
    if (name && (name.startsWith("_ga") || name === "_gid")) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    }
  });
};

const applyConsent = () => {
  const consent = readConsent();
  const analyticsOn = consent?.prefs?.analytics === true;
  if (analyticsOn) injectGA();
  else removeGA();
};

/**
 * Mount this hook once at the app root (e.g. inside a small <Analytics/>
 * component). It syncs on mount and reacts to future consent changes fired
 * by the cookie banner via the `sc:consent-change` CustomEvent.
 */
const useAnalytics = () => {
  useEffect(() => {
    applyConsent();
    const handler = () => applyConsent();
    window.addEventListener("sc:consent-change", handler);
    return () => window.removeEventListener("sc:consent-change", handler);
  }, []);
};

export default useAnalytics;
