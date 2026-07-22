import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, CheckCircle2, ExternalLink } from "lucide-react";
import { useLang } from "@/i18n/LanguageContext";
import { PARTNERS_BY_SLUG, PARTNER_CATEGORIES } from "@/data/partners";
import Navbar from "@/components/Navbar";

/**
 * PartnerDetailPage — /partners/:slug
 * Presents a single vendor: hero (logo + name + tier + tagline + category chips),
 * intro paragraph, highlight list, product portfolio, CTA back to rack + contact.
 */
const PartnerDetailPage = () => {
  const { slug } = useParams();
  const { lang, t } = useLang();
  const partner = PARTNERS_BY_SLUG[slug];

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [slug]);

  if (!partner) {
    return (
      <main
        data-testid="partner-notfound"
        className="sc-app min-h-screen"
        style={{ background: "#040709", color: "#E8F4F5" }}
      >
        <Navbar />
        <section className="mx-auto max-w-3xl px-6 md:px-10 py-32 text-center">
          <div
            className="text-[11px] uppercase tracking-[0.32em]"
            style={{ color: "#7CC4C0" }}
          >
            {lang === "pl" ? "Nie znaleziono partnera" : "Partner not found"}
          </div>
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold text-white">
            404 — {slug}
          </h1>
          <p className="mt-4 text-white/70">
            {lang === "pl"
              ? "Ta podstrona nie istnieje. Wróć do listy naszego stacku technologicznego."
              : "This page does not exist. Return to our technology stack."}
          </p>
          <Link
            to="/#partners-rack"
            className="sc-cta-primary mt-8 inline-flex items-center gap-2"
            data-testid="notfound-back"
          >
            <ArrowLeft size={16} />
            {lang === "pl" ? "Wróć do stacku" : "Back to stack"}
          </Link>
        </section>
      </main>
    );
  }

  const catLabels = partner.categories.map(
    (id) => PARTNER_CATEGORIES[id]?.[lang] || id
  );

  return (
    <main
      data-testid="partner-detail"
      className="sc-app min-h-screen"
      style={{ background: "#040709", color: "#E8F4F5" }}
    >
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-60 pointer-events-none"
          style={{
            background:
              "radial-gradient(60% 50% at 30% 20%, rgba(6, 255, 224, 0.09) 0%, rgba(6, 255, 224, 0) 60%)," +
              " radial-gradient(50% 50% at 80% 60%, rgba(6, 184, 212, 0.08) 0%, rgba(6, 184, 212, 0) 60%)",
          }}
        />
        <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-10 pt-28 md:pt-32 pb-14 md:pb-16">
          <Link
            to="/#partners-rack"
            className="sc-back-link inline-flex items-center gap-2"
            data-testid="partner-back"
          >
            <ArrowLeft size={14} strokeWidth={2} />
            {lang === "pl" ? "Stack technologiczny" : "Technology stack"}
          </Link>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {catLabels.map((label, i) => (
                  <span
                    key={i}
                    className="sc-chip sc-chip--dark"
                    data-testid={`partner-cat-${i}`}
                  >
                    {label}
                  </span>
                ))}
                <span
                  className="sc-chip sc-chip--tier"
                  data-testid="partner-tier"
                >
                  {partner.tier[lang]}
                </span>
              </div>
              <h1
                data-testid="partner-name"
                className="text-4xl md:text-6xl font-semibold tracking-tight text-white"
              >
                {partner.name}
              </h1>
              <p
                data-testid="partner-tagline"
                className="mt-4 max-w-2xl text-lg md:text-xl text-white/75 leading-relaxed"
              >
                {partner.tagline[lang]}
              </p>
            </div>
            <div className="lg:col-span-4">
              <div className="sc-partner-logo-panel" data-testid="partner-logo">
                {partner.logo ? (
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="sc-partner-logo-panel__img"
                    draggable="false"
                  />
                ) : (
                  <span className="sc-partner-logo-panel__text">
                    {partner.name}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-6 md:px-10 pb-24 md:pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14">
            {/* Intro */}
            <div className="lg:col-span-7">
              <div
                className="flex items-center gap-4 text-[11px] uppercase tracking-[0.32em]"
                style={{ color: "#7CC4C0" }}
              >
                <span
                  className="inline-block h-px w-10"
                  style={{ background: "#49ADA5" }}
                />
                {lang === "pl" ? "Partnerstwo" : "Partnership"}
              </div>
              <p
                data-testid="partner-intro"
                className="mt-6 text-base md:text-lg text-white/80 leading-[1.75]"
              >
                {partner.intro[lang]}
              </p>

              <div
                className="mt-10 text-[11px] uppercase tracking-[0.32em]"
                style={{ color: "#7CC4C0" }}
              >
                {lang === "pl" ? "Nasze mocne strony" : "Our strengths"}
              </div>
              <ul
                data-testid="partner-highlights"
                className="mt-4 space-y-3"
              >
                {partner.highlights[lang].map((h, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-white/85"
                    data-testid={`partner-highlight-${i}`}
                  >
                    <CheckCircle2
                      size={18}
                      strokeWidth={1.8}
                      className="mt-0.5 flex-none"
                      style={{ color: "#06FFE0" }}
                    />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Products + CTA */}
            <aside className="lg:col-span-5">
              <div className="sc-partner-card-panel" data-testid="partner-products">
                <div className="sc-partner-card-panel__head">
                  <span className="sc-partner-card-panel__kicker">
                    {lang === "pl" ? "Portfolio produktów" : "Product portfolio"}
                  </span>
                </div>
                <ul className="sc-partner-card-panel__list">
                  {partner.products.map((p, i) => (
                    <li
                      key={i}
                      className="sc-partner-card-panel__item"
                      data-testid={`partner-product-${i}`}
                    >
                      <span className="sc-partner-card-panel__dot" aria-hidden="true" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to="/#contact"
                className="sc-cta-primary mt-6 inline-flex items-center gap-2 w-full justify-center"
                data-testid="partner-cta"
              >
                <ArrowUpRight size={16} />
                {lang === "pl"
                  ? "Porozmawiajmy o wdrożeniu"
                  : "Let's talk about your deployment"}
              </Link>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PartnerDetailPage;
