import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Cookie, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useLang } from "@/i18n/LanguageContext";

const COPY = {
  pl: {
    back: "Wróć na stronę główną",
    eyebrow: "Polityka",
    title: "Polityka Prywatności i Cookies",
    updated: "Ostatnia aktualizacja: 5 lutego 2026",
    intro:
      "IT SMARTCLOUT SP. Z O.O. („SmartClout”, „my”) traktuje ochronę Twoich danych osobowych oraz prywatności bardzo poważnie. Niniejszy dokument opisuje jakie dane zbieramy, w jakim celu, na jakiej podstawie prawnej oraz jakie prawa Ci przysługują — zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 (RODO/GDPR) oraz ustawą Prawo Telekomunikacyjne (art. 173).",
    reopen_cta: "Otwórz ustawienia cookies",
    sections: [
      {
        icon: "shield",
        h: "1. Administrator danych",
        body: [
          "Administratorem Twoich danych osobowych jest IT SMARTCLOUT SP. Z O.O. z siedzibą w Warszawie, wpisana do rejestru przedsiębiorców KRS.",
          "W sprawach związanych z ochroną danych możesz skontaktować się z nami pisząc na adres e-mail: kontakt@itsmartclout.pl.",
        ],
      },
      {
        h: "2. Zakres zbieranych danych",
        body: [
          "Zbieramy dane w zakresie niezbędnym do realizacji celu, w jakim zostały udostępnione — najczęściej: imię i nazwisko, nazwa firmy, adres e-mail, numer telefonu, treść wiadomości, adres IP, dane o urządzeniu i przeglądarce oraz identyfikatory plików cookie.",
          "Nie zbieramy szczególnych kategorii danych (tzw. „wrażliwych”) o ile nie zostały nam one dobrowolnie przekazane w treści wiadomości.",
        ],
      },
      {
        h: "3. Cele i podstawy prawne przetwarzania",
        body: [
          "Twoje dane osobowe przetwarzamy w następujących celach:",
          "• Obsługa zapytań przesłanych przez formularz kontaktowy — art. 6 ust. 1 lit. b i f RODO (kontakt przed zawarciem umowy oraz prawnie uzasadniony interes).",
          "• Świadczenie usług oraz realizacja umów — art. 6 ust. 1 lit. b RODO.",
          "• Analiza ruchu na stronie oraz poprawa jej działania — art. 6 ust. 1 lit. a RODO (Twoja dobrowolna zgoda w banerze cookies).",
          "• Marketing bezpośredni własnych usług — art. 6 ust. 1 lit. a i f RODO.",
          "• Wypełnianie obowiązków prawnych (księgowość, podatki) — art. 6 ust. 1 lit. c RODO.",
        ],
      },
      {
        icon: "cookie",
        h: "4. Pliki cookies i podobne technologie",
        body: [
          "Strona wykorzystuje pliki cookies („ciasteczka”) i podobne technologie w czterech kategoriach:",
          "• Niezbędne — wymagane do prawidłowego działania strony (sesja, bezpieczeństwo, wybór języka). Nie wymagają zgody.",
          "• Funkcjonalne — zapamiętują Twoje preferencje i usprawniają korzystanie z serwisu.",
          "• Analityczne — pomagają nam mierzyć skuteczność treści i doświadczenie użytkownika. Dane są zagregowane.",
          "• Marketingowe — pozwalają na pokazywanie spersonalizowanych treści i reklam na innych stronach oraz mierzenie skuteczności kampanii.",
          "Zgodę na cookies inne niż niezbędne wyrażasz w banerze przy pierwszej wizycie. W dowolnym momencie możesz zmienić swój wybór klikając ikonę „ciasteczka” w prawym dolnym rogu strony lub przycisk poniżej.",
        ],
      },
      {
        h: "5. Odbiorcy danych",
        body: [
          "Twoje dane mogą być przekazywane następującym kategoriom odbiorców:",
          "• Dostawcom usług IT i hostingu, którzy działają na nasze zlecenie na podstawie umowy powierzenia przetwarzania danych.",
          "• Dostawcom narzędzi analitycznych i marketingowych — wyłącznie po wyrażeniu przez Ciebie odpowiedniej zgody.",
          "• Uprawnionym organom państwowym — na podstawie obowiązujących przepisów prawa.",
          "Nie sprzedajemy Twoich danych podmiotom trzecim.",
        ],
      },
      {
        h: "6. Przekazywanie danych poza EOG",
        body: [
          "Niektórzy z naszych dostawców technologicznych mogą mieć siedzibę poza Europejskim Obszarem Gospodarczym. W takich przypadkach dane są przekazywane wyłącznie na podstawie standardowych klauzul umownych zatwierdzonych przez Komisję Europejską lub innych zabezpieczeń przewidzianych przez RODO.",
        ],
      },
      {
        h: "7. Okres przechowywania",
        body: [
          "• Zapytania z formularza kontaktowego — do 24 miesięcy od zakończenia korespondencji.",
          "• Dane w związku z realizacją umowy — do czasu przedawnienia roszczeń i zgodnie z obowiązkami archiwizacyjnymi.",
          "• Cookies analityczne — maksymalnie 24 miesiące.",
          "• Zgody marketingowe — do momentu ich wycofania.",
        ],
      },
      {
        h: "8. Twoje prawa",
        body: [
          "Zgodnie z RODO przysługuje Ci prawo do: dostępu do swoich danych, ich sprostowania, usunięcia („prawo do bycia zapomnianym”), ograniczenia przetwarzania, przenoszenia danych, sprzeciwu wobec przetwarzania oraz wycofania zgody w dowolnym momencie (bez wpływu na zgodność z prawem przetwarzania sprzed wycofania).",
          "Masz również prawo do złożenia skargi do Prezesa Urzędu Ochrony Danych Osobowych (ul. Stawki 2, 00-193 Warszawa) jeżeli uważasz, że przetwarzanie Twoich danych narusza RODO.",
          "W celu realizacji swoich praw skontaktuj się z nami: kontakt@itsmartclout.pl.",
        ],
      },
      {
        h: "9. Zmiany polityki",
        body: [
          "Zastrzegamy sobie prawo do wprowadzania zmian w niniejszej Polityce. O istotnych zmianach poinformujemy publikując zaktualizowaną wersję na tej stronie oraz — w przypadku zmian wpływających na przetwarzanie Twoich danych — kontaktując się z Tobą bezpośrednio, jeśli to możliwe.",
        ],
      },
    ],
  },
  en: {
    back: "Back to home",
    eyebrow: "Policy",
    title: "Privacy & Cookie Policy",
    updated: "Last updated: 5 February 2026",
    intro:
      "IT SMARTCLOUT SP. Z O.O. (“SmartClout”, “we”) takes the protection of your personal data and privacy very seriously. This document describes what data we collect, for what purpose, on what legal basis and what rights you have — in accordance with EU Regulation 2016/679 (GDPR) and Polish telecommunications law.",
    reopen_cta: "Open cookie settings",
    sections: [
      {
        icon: "shield",
        h: "1. Data controller",
        body: [
          "The controller of your personal data is IT SMARTCLOUT SP. Z O.O. with its registered office in Warsaw, Poland, registered in the National Court Register.",
          "For matters related to data protection please contact us at: kontakt@itsmartclout.pl.",
        ],
      },
      {
        h: "2. Scope of collected data",
        body: [
          "We collect data to the extent necessary for the purpose for which it was provided — most commonly: first and last name, company name, email address, phone number, message content, IP address, device and browser information, and cookie identifiers.",
          "We do not collect special categories of data (so-called “sensitive data”) unless voluntarily provided by you in a message.",
        ],
      },
      {
        h: "3. Purposes and legal bases",
        body: [
          "We process your personal data for the following purposes:",
          "• Handling inquiries submitted via the contact form — Art. 6(1)(b) and (f) GDPR.",
          "• Providing services and performing contracts — Art. 6(1)(b) GDPR.",
          "• Site traffic analytics and improving our service — Art. 6(1)(a) GDPR (your voluntary consent via the cookie banner).",
          "• Direct marketing of our own services — Art. 6(1)(a) and (f) GDPR.",
          "• Fulfilling legal obligations (accounting, tax) — Art. 6(1)(c) GDPR.",
        ],
      },
      {
        icon: "cookie",
        h: "4. Cookies and similar technologies",
        body: [
          "The site uses cookies and similar technologies grouped into four categories:",
          "• Necessary — required for the site to function properly. No consent required.",
          "• Functional — remember your preferences and improve the user experience.",
          "• Analytics — help us measure content effectiveness and user experience. Data is aggregated.",
          "• Marketing — allow us to show personalized content and ads on other sites and measure campaign effectiveness.",
          "You give consent to non-necessary cookies via the banner on your first visit. You can change your choice at any time by clicking the cookie icon in the bottom-right corner of the site or the button below.",
        ],
      },
      {
        h: "5. Data recipients",
        body: [
          "Your data may be shared with:",
          "• IT and hosting service providers acting on our behalf under data-processing agreements.",
          "• Analytics and marketing tool providers — only after your explicit consent.",
          "• Authorized state bodies — based on applicable law.",
          "We do not sell your data to third parties.",
        ],
      },
      {
        h: "6. Transfers outside the EEA",
        body: [
          "Some of our technology providers may be located outside the European Economic Area. In such cases data is transferred only on the basis of Standard Contractual Clauses approved by the European Commission or other safeguards provided for by GDPR.",
        ],
      },
      {
        h: "7. Data retention",
        body: [
          "• Contact form inquiries — up to 24 months from the end of correspondence.",
          "• Data related to contract performance — until claims expire and in line with archiving obligations.",
          "• Analytics cookies — up to 24 months.",
          "• Marketing consents — until withdrawn.",
        ],
      },
      {
        h: "8. Your rights",
        body: [
          "Under GDPR you have the right to: access your data, rectify it, erase it (“right to be forgotten”), restrict processing, data portability, object to processing, and withdraw consent at any time (without affecting the lawfulness of processing based on consent before its withdrawal).",
          "You also have the right to lodge a complaint with the President of the Personal Data Protection Office in Poland (ul. Stawki 2, 00-193 Warsaw) if you believe that the processing of your data violates GDPR.",
          "To exercise your rights please contact us at: kontakt@itsmartclout.pl.",
        ],
      },
      {
        h: "9. Changes to this policy",
        body: [
          "We reserve the right to make changes to this Policy. We will inform you of significant changes by publishing the updated version on this page and — for changes affecting the processing of your data — by contacting you directly whenever possible.",
        ],
      },
    ],
  },
};

const ICONS = { shield: Shield, cookie: Cookie };

const PrivacyPolicyPage = () => {
  const { lang } = useLang();
  const t = COPY[lang] || COPY.pl;

  const openCookieSettings = () => {
    window.dispatchEvent(new Event("sc:open-cookie-settings"));
  };

  return (
    <main data-testid="privacy-page" className="sc-app sc-privacy">
      <Navbar />

      <section className="relative w-full" style={{ background: "#F6F8F7", color: "#0B0F14" }}>
        <div className="relative z-10 mx-auto max-w-4xl px-6 md:px-10 pt-28 md:pt-32 pb-24 md:pb-32">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium mb-8 hover:opacity-70 transition-opacity"
            style={{ color: "#0C5C62" }}
            data-testid="privacy-back-link"
          >
            <ArrowLeft size={16} />
            {t.back}
          </Link>

          <div
            className="flex items-center gap-3 text-[11px] uppercase tracking-[0.32em] mb-4"
            style={{ color: "#0C5C62" }}
          >
            <span className="inline-block h-px w-10" style={{ background: "#0C5C62" }} />
            {t.eyebrow}
          </div>

          <h1
            data-testid="privacy-title"
            className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight"
            style={{ color: "#0B2A2E" }}
          >
            {t.title}
          </h1>
          <div className="mt-3 text-sm" style={{ color: "#5B6F71" }}>
            {t.updated}
          </div>

          <p className="mt-8 text-base md:text-lg leading-relaxed" style={{ color: "#2A3B3D" }}>
            {t.intro}
          </p>

          <div className="mt-12 space-y-10">
            {t.sections.map((s, idx) => {
              const Icon = s.icon ? ICONS[s.icon] : null;
              return (
                <section
                  key={idx}
                  className="sc-privacy__block"
                  data-testid={`privacy-section-${idx + 1}`}
                >
                  <h2
                    className="flex items-center gap-3 text-xl md:text-2xl font-semibold"
                    style={{ color: "#0B2A2E" }}
                  >
                    {Icon && (
                      <span
                        className="inline-flex items-center justify-center rounded-md"
                        style={{
                          width: 32,
                          height: 32,
                          background: "rgba(12, 92, 98, 0.08)",
                          color: "#0C5C62",
                        }}
                      >
                        <Icon size={18} strokeWidth={1.8} />
                      </span>
                    )}
                    {s.h}
                  </h2>
                  <div className="mt-4 space-y-3 text-[15px] leading-relaxed" style={{ color: "#2A3B3D" }}>
                    {s.body.map((p, i) => (
                      <p key={i} className="whitespace-pre-line">{p}</p>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          <div className="mt-14 pt-10 border-t" style={{ borderColor: "rgba(12, 92, 98, 0.15)" }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-sm" style={{ color: "#2A3B3D" }}>
                <Mail size={16} style={{ color: "#0C5C62" }} />
                <a href="mailto:kontakt@itsmartclout.pl" className="underline underline-offset-4">
                  kontakt@itsmartclout.pl
                </a>
              </div>
              <button
                type="button"
                onClick={openCookieSettings}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-medium text-sm transition-transform hover:-translate-y-0.5"
                style={{
                  background: "#0C5C62",
                  color: "#F6F8F7",
                  boxShadow: "0 8px 20px -8px rgba(12, 92, 98, 0.6)",
                }}
                data-testid="privacy-open-cookie-settings"
              >
                <Cookie size={16} />
                {t.reopen_cta}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PrivacyPolicyPage;
