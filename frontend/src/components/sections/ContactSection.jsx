import React, { useState } from "react";
import axios from "axios";
import { useLang } from "@/i18n/LanguageContext";
import { MapPin, Phone, Mail, FileText, ArrowUpRight } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ContactSection = () => {
  const { t, lang } = useLang();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ state: "idle", msg: "" });

  const onChange = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ state: "loading", msg: "" });
    try {
      // The "name" field is presented as "Name / Company" per spec.
      // We map the single field into both name and company to keep the
      // backend structured while respecting the simplified UX.
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        company: form.name.trim(),
        message: form.message.trim(),
        lang,
      };
      await axios.post(`${API}/contact`, payload);
      setStatus({ state: "success", msg: t.contact.form.success });
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus({ state: "error", msg: t.contact.form.error });
    }
  };

  const c = t.contact.company;

  return (
    <section
      id="contact"
      data-testid="contact-section"
      className="relative w-full sc-contact-dark"
      style={{ background: "#040709", color: "#FFFFFF" }}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-24 md:py-32">
        <div className="mb-14 flex items-center gap-4 text-[11px] uppercase tracking-[0.32em]" style={{ color: "#0C5C62" }}>
          <span className="inline-block h-px w-10" style={{ background: "#49ADA5" }} />
          {t.contact.section_label}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
          {/* Column 1: registry info */}
          <div className="md:col-span-5">
            <h2
              className="text-3xl md:text-5xl font-semibold leading-[1.05] tracking-tight"
              style={{ color: "#0C5C62" }}
              data-testid="contact-title"
            >
              {t.contact.title}
            </h2>
            <p className="mt-5 text-base md:text-lg" style={{ color: "#1C2833", opacity: 0.75 }}>
              {t.contact.subtitle}
            </p>

            <div className="mt-12 space-y-8">
              <div className="sc-contact-block">
                <div className="sc-contact-block__icon"><MapPin size={18} /></div>
                <div>
                  <div className="sc-contact-block__label">{c.labels.address}</div>
                  <div className="sc-contact-block__value">{c.name}</div>
                  <div className="sc-contact-block__value">{c.address}</div>
                </div>
              </div>

              <div className="sc-contact-block">
                <div className="sc-contact-block__icon"><FileText size={18} /></div>
                <div>
                  <div className="sc-contact-block__label">{c.labels.registry}</div>
                  <div className="sc-contact-block__value">{c.krs}</div>
                  <div className="sc-contact-block__value">{c.nip}</div>
                  <div className="sc-contact-block__value">{c.regon}</div>
                </div>
              </div>

              <div className="sc-contact-block">
                <div className="sc-contact-block__icon"><Phone size={18} /></div>
                <div>
                  <div className="sc-contact-block__label">{c.labels.phone}</div>
                  <a
                    href={`tel:${c.phone.replace(/\s+/g, "")}`}
                    className="sc-contact-block__value sc-link"
                    data-testid="contact-phone-link"
                  >
                    {c.phone}
                  </a>
                </div>
              </div>

              <div className="sc-contact-block">
                <div className="sc-contact-block__icon"><Mail size={18} /></div>
                <div>
                  <div className="sc-contact-block__label">{c.labels.email}</div>
                  <a
                    href={`mailto:${c.email}`}
                    className="sc-contact-block__value sc-link sc-link--strong"
                    data-testid="contact-email-link"
                  >
                    {c.email}
                    <ArrowUpRight size={14} className="ml-1 inline-block" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: form */}
          <div className="md:col-span-7">
            <form
              onSubmit={submit}
              data-testid="contact-form"
              className="sc-form"
            >
              <div className="sc-field">
                <label htmlFor="cf-name">{t.contact.form.name}</label>
                <input
                  id="cf-name"
                  data-testid="contact-input-name"
                  type="text"
                  required
                  value={form.name}
                  onChange={onChange("name")}
                  autoComplete="organization"
                />
              </div>

              <div className="sc-field">
                <label htmlFor="cf-email">{t.contact.form.email}</label>
                <input
                  id="cf-email"
                  data-testid="contact-input-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={onChange("email")}
                  autoComplete="email"
                />
              </div>

              <div className="sc-field">
                <label htmlFor="cf-msg">{t.contact.form.message}</label>
                <textarea
                  id="cf-msg"
                  data-testid="contact-input-message"
                  rows={6}
                  required
                  value={form.message}
                  onChange={onChange("message")}
                />
              </div>

              <button
                type="submit"
                data-testid="contact-submit"
                className="sc-form__submit"
                disabled={status.state === "loading"}
              >
                {status.state === "loading"
                  ? t.contact.form.submitting
                  : t.contact.form.submit}
                <ArrowUpRight size={16} />
              </button>

              {status.state === "success" && (
                <div className="sc-form__msg sc-form__msg--ok" data-testid="contact-success">
                  {status.msg}
                </div>
              )}
              {status.state === "error" && (
                <div className="sc-form__msg sc-form__msg--err" data-testid="contact-error">
                  {status.msg}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Footer strip */}
      <footer
        className="border-t"
        style={{ borderColor: "rgba(73,173,165,0.15)", background: "#040709" }}
      >
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="text-sm text-white/60">
            © {new Date().getFullYear()} IT SMARTCLOUT SP. Z O.O. — {t.footer.rights}
          </div>
          <div className="text-[11px] uppercase tracking-[0.28em]" style={{ color: "#49ADA5" }}>
            {t.footer.tagline}
          </div>
        </div>
      </footer>
    </section>
  );
};

export default ContactSection;
