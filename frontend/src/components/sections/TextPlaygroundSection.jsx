import React from "react";

/**
 * TextPlaygroundSection — 30 propozycji stylów tekstowych w dwóch tłach.
 * Wystawione na /robocze jako biblioteka referencyjna typografii do wyboru.
 * Nazwy klas prefixem tp-  (text playground).
 */

const ITEMS = [
  { n: 1,  name: "Hero H1 (Display)",       render: () => (
    <h1 className="tp-txt tp-txt--1">Infrastruktura IT stworzona <span className="tp-accent">dla ciągłości</span> Twojego biznesu</h1>) },
  { n: 2,  name: "Section H2",              render: () => (
    <h2 className="tp-txt tp-txt--2">Rozwiązania szyte na miarę</h2>) },
  { n: 3,  name: "H3 Subheading",           render: () => (
    <h3 className="tp-txt tp-txt--3">Bezpieczeństwo bez kompromisów</h3>) },
  { n: 4,  name: "Section Subtitle",        render: () => (
    <p className="tp-txt tp-txt--4">Projektujemy architekturę serwerowni i dobieramy sprzęt tak, żeby usługi działały bez przestojów.</p>) },
  { n: 5,  name: "Body Paragraph",          render: () => (
    <p className="tp-txt tp-txt--5">Doradzamy w doborze technologii NetApp, Cisco i Palo Alto — od koncepcji do wdrożenia i utrzymania środowiska produkcyjnego.</p>) },
  { n: 6,  name: "Cyan Gradient Accent",    render: () => (
    <p className="tp-txt tp-txt--6"><span className="tp-accent">Szyte na miarę</span> — dokładnie tak jak potrzebujesz.</p>) },
  { n: 7,  name: "Underlined Key Phrase",   render: () => (
    <p className="tp-txt tp-txt--7">Zaufali nam <span className="tp-under">liderzy branży</span> od 2010 roku.</p>) },
  { n: 8,  name: "Highlight Mark",          render: () => (
    <p className="tp-txt tp-txt--8">Twoje dane są <mark className="tp-mark">chronione warstwowo</mark> na każdym etapie.</p>) },
  { n: 9,  name: "Cyan Solid Word",         render: () => (
    <p className="tp-txt tp-txt--9">Dostępność <span className="tp-cyan">99,99%</span> potwierdzona SLA.</p>) },
  { n: 10, name: "Eyebrow / Kicker",        render: () => (
    <p className="tp-txt tp-txt--10">Case Study · NetApp AFF</p>) },
  { n: 11, name: "Tag Label (Uppercase)",   render: () => (
    <span className="tp-txt tp-txt--11">Propozycje · Typografia</span>) },
  { n: 12, name: "Chip Badge",              render: () => (
    <span className="tp-txt tp-txt--12">Nowość 2026</span>) },
  { n: 13, name: "Big Numeral Display",     render: () => (
    <span className="tp-txt tp-txt--13">14+</span>) },
  { n: 14, name: "KPI Stat",                render: () => (
    <div className="tp-txt tp-txt--14"><strong>99,99%</strong><em>Dostępność usług</em></div>) },
  { n: 15, name: "Small Caps",              render: () => (
    <p className="tp-txt tp-txt--15">Enterprise-grade Infrastructure</p>) },
  { n: 16, name: "Terminal Mono",           render: () => (
    <p className="tp-txt tp-txt--16"><span>&gt;_</span> uptime.check --tier=production</p>) },
  { n: 17, name: "Pull Quote",              render: () => (
    <blockquote className="tp-txt tp-txt--17">„Wdrożenie NetApp przebiegło bez jednej minuty przestoju."</blockquote>) },
  { n: 18, name: "Cyan Border Quote",       render: () => (
    <blockquote className="tp-txt tp-txt--18">SmartClout zaprojektował nam serwerownię tak, żebyśmy o niej zapomnieli.</blockquote>) },
  { n: 19, name: "Bracketed HUD",           render: () => (
    <p className="tp-txt tp-txt--19"><span className="tp-br">[</span> Ciągłość biznesowa <span className="tp-br">]</span></p>) },
  { n: 20, name: "Gradient Hero Title",     render: () => (
    <h2 className="tp-txt tp-txt--20">Bez kompromisów</h2>) },
  { n: 21, name: "Glow Cyan",               render: () => (
    <p className="tp-txt tp-txt--21">Zero Trust · zawsze</p>) },
  { n: 22, name: "Outline Stroked",         render: () => (
    <h2 className="tp-txt tp-txt--22" data-text="SmartClout">SmartClout</h2>) },
  { n: 23, name: "Duotone Word Split",      render: () => (
    <h3 className="tp-txt tp-txt--23"><span>Smart</span><span>Clout</span></h3>) },
  { n: 24, name: "Metric with Label",       render: () => (
    <div className="tp-txt tp-txt--24"><strong>250+</strong><em>wdrożeń NetApp</em></div>) },
  { n: 25, name: "Testimonial Signature",   render: () => (
    <p className="tp-txt tp-txt--25">— Marek K., <em>Head of IT</em>, Bank Polski</p>) },
  { n: 26, name: "Animated Underline Link", render: () => (
    <a href="#" className="tp-txt tp-txt--26" onClick={(e)=>e.preventDefault()}>Zobacz portfolio wdrożeń</a>) },
  { n: 27, name: "Inline Code",             render: () => (
    <p className="tp-txt tp-txt--27">Uruchom <code>ansible-playbook deploy.yml</code> aby wdrożyć.</p>) },
  { n: 28, name: "Numbered Step",           render: () => (
    <p className="tp-txt tp-txt--28"><span className="tp-step">01</span> Analiza infrastruktury</p>) },
  { n: 29, name: "Cyan Ticker Row",         render: () => (
    <p className="tp-txt tp-txt--29"><span className="tp-tick" /> Monitoring 24/7 · SLA gwarantowane · RTO &lt; 15 min</p>) },
  { n: 30, name: "Blockquote Wide",         render: () => (
    <blockquote className="tp-txt tp-txt--30">
      <span className="tp-quote">"</span>
      Współpraca zaczyna się od zrozumienia Waszego biznesu — dopiero potem dobieramy technologię.
    </blockquote>) },
];

const Panel = ({ theme, title, subtitle }) => (
  <div className={`tp-panel tp-panel--${theme}`} data-testid={`tp-panel-${theme}`}>
    <div className="tp-panel__inner">
      <div className="tp-panel__head">
        <span className="tp-panel__tag">Typografia · Propozycje</span>
        <h2 className="tp-panel__title">{title}</h2>
        <p className="tp-panel__sub">{subtitle}</p>
      </div>
      <div className="tp-grid">
        {ITEMS.map((it) => (
          <div key={it.n} className="tp-cell" data-testid={`tp-cell-${theme}-${it.n}`}>
            <div className="tp-cell__render">{it.render()}</div>
            <div className="tp-cell__label">
              <span className="tp-cell__num">{String(it.n).padStart(2, "0")}</span>
              <span className="tp-cell__name">{it.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const TextPlaygroundSection = () => (
  <section
    id="text-playground"
    data-testid="text-playground"
    className="tp-section"
  >
    <Panel
      theme="light"
      title="Style tekstowe — jasne tło"
      subtitle="30 propozycji typografii w spójnym języku cyanowego layoutu."
    />
    <Panel
      theme="dark"
      title="Style tekstowe — ciemne tło"
      subtitle="Ten sam zestaw dopasowany do tła Hero/serwerowni."
    />
  </section>
);

export default TextPlaygroundSection;
