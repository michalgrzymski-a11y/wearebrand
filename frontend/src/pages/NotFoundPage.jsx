import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Database, Calculator, MessageSquare } from "lucide-react";
import { useLang } from "@/i18n/LanguageContext";
import Navbar from "@/components/Navbar";
import "./NotFoundPage.css";

const COPY = {
  pl: {
    eyebrow: "Błąd 404 · Pakiet zagubiony",
    title: "Ten adres nie istnieje w naszej infrastrukturze",
    lead: "Przeszukaliśmy wszystkie macierze, snapshoty i repliki — tej podstrony nie ma. Mogła zostać przeniesiona albo link jest niepoprawny.",
    path: "Żądana ścieżka",
    status: "STATUS: brak trasy · próba odtworzenia z repliki nieudana",
    home: "Wróć na stronę główną",
    quick: "Szybkie przejścia",
    links: [
      { to: "/netapp-portfolio", icon: Database, label: "Portfolio NetApp", desc: "Macierze AFF, C, ASA i E/EF" },
      { to: "/kalkulatory", icon: Calculator, label: "Kalkulatory", desc: "TCO, pojemność i redukcja danych" },
      { to: "/#contact", icon: MessageSquare, label: "Kontakt", desc: "Porozmawiaj z naszym architektem" },
    ],
  },
  en: {
    eyebrow: "Error 404 · Packet lost",
    title: "This address doesn't exist in our infrastructure",
    lead: "We searched every array, snapshot and replica — this page isn't there. It may have moved or the link is incorrect.",
    path: "Requested path",
    status: "STATUS: no route · restore from replica failed",
    home: "Back to home page",
    quick: "Quick links",
    links: [
      { to: "/netapp-portfolio", icon: Database, label: "NetApp portfolio", desc: "AFF, C, ASA and E/EF arrays" },
      { to: "/kalkulatory", icon: Calculator, label: "Calculators", desc: "TCO, capacity and data reduction" },
      { to: "/#contact", icon: MessageSquare, label: "Contact", desc: "Talk to our solution architect" },
    ],
  },
};

const Card = ({ to, ...rest }) =>
  to.includes("#") ? <a href={to} {...rest} /> : <Link to={to} {...rest} />;

const NotFoundPage = () => {
  const { lang } = useLang();
  const { pathname } = useLocation();
  const c = COPY[lang] || COPY.pl;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.title = "404 · SmartClout";
  }, []);

  return (
    <main data-testid="notfound-page" className="sc-app nf-page">
      <Navbar />
      <div className="nf-grid" aria-hidden="true" />
      <div className="nf-glow" aria-hidden="true" />
      <div className="nf-scan" aria-hidden="true" />
      <section className="nf-inner">
        <div className="nf-left">
          <div className="nf-eyebrow" data-testid="notfound-eyebrow">
            <span className="nf-dot" /> {c.eyebrow}
          </div>
          <div className="nf-code" data-testid="notfound-code" aria-label="404">
            {["4", "0", "4"].map((d, i) => (
              <span key={i} className="nf-digit" style={{ animationDelay: `${i * 0.12}s` }}>{d}</span>
            ))}
          </div>
          <h1 className="nf-title" data-testid="notfound-title">{c.title}</h1>
          <p className="nf-lead">{c.lead}</p>
          <div className="nf-terminal" data-testid="notfound-terminal">
            <div><span className="nf-muted">{c.path}:</span> <span data-testid="notfound-path">{pathname}</span></div>
            <div className="nf-err">{c.status}<span className="nf-caret" /></div>
          </div>
          <Link to="/" className="nf-home" data-testid="notfound-home-btn">
            <ArrowLeft size={18} /> {c.home}
          </Link>
        </div>
        <aside className="nf-right">
          <div className="nf-quick-label">{c.quick}</div>
          {c.links.map(({ to, icon: Icon, label, desc }, i) => (
            <Card
              key={to}
              to={to}
              className="nf-card"
              style={{ animationDelay: `${0.35 + i * 0.1}s` }}
              data-testid={`notfound-link-${to.replace(/[^a-z]/g, "") || "home"}`}
            >
              <span className="nf-card-icon"><Icon size={20} /></span>
              <span className="nf-card-text">
                <strong>{label}</strong>
                <small>{desc}</small>
              </span>
              <ArrowUpRight size={18} className="nf-card-arrow" />
            </Card>
          ))}
        </aside>
      </section>
    </main>
  );
};

export default NotFoundPage;
