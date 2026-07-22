import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useLang } from "@/i18n/LanguageContext";
import {
  MapPin, Phone, Mail, FileText, ArrowUpRight,
  Sparkles, MessageCircle, ClipboardList, RotateCcw, Send,
} from "lucide-react";
import useSectionParallax from "@/hooks/useSectionParallax";
import AuroraBorealis from "@/components/fx/AuroraBorealis";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Steps of the AI assistant conversation.
const STEPS = ["greet", "name", "email", "phone", "message", "refine", "review", "done"];

const ContactSection = () => {
  const { t, lang } = useLang();
  const [mode, setMode] = useState("ai"); // "ai" | "form"
  const parallaxRef = useSectionParallax();

  return (
    <section
      id="contact"
      data-testid="contact-section"
      ref={parallaxRef}
      className="relative w-full sc-contact-neon overflow-hidden"
      style={{ background: "#040709", color: "#E8F4F5" }}
    >
      {/* Aurora Borealis backdrop (dark tone) with parallax */}
      <div className="sc-slayer-wrap" aria-hidden="true">
        <div data-parallax="-0.15">
          <AuroraBorealis tone="dark" intensity={0.85} />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 py-24 md:py-32">
        <div className="flex items-center gap-4 text-[11px] uppercase tracking-[0.32em] text-[#7CC4C0]">
          <span className="inline-block h-px w-10 bg-[#49ADA5]" />
          {t.contact.section_label}
        </div>
        <h2
          data-testid="contact-title"
          className="mt-4 text-3xl md:text-5xl font-semibold leading-[1.05] tracking-tight text-white max-w-3xl"
        >
          {t.contact.title}
        </h2>

        {/* Two-column "table" layout — left: registry info, right: mode toggle + panel */}
        <div className="mt-12 md:mt-14 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          <div className="lg:col-span-5">
            <ContactInfo t={t} />
          </div>
          <div className="lg:col-span-7">
            {/* Toggle sits INSIDE the right column, above the active panel */}
            <div className="sc-contact-toggle" role="tablist" aria-label="Contact mode">
              <button
                type="button"
                role="tab"
                aria-selected={mode === "ai"}
                data-testid="contact-mode-ai"
                className={`sc-contact-toggle__btn ${mode === "ai" ? "is-active" : ""}`}
                onClick={() => setMode("ai")}
              >
                <span className="sc-contact-toggle__icon"><Sparkles size={16} strokeWidth={2} /></span>
                <span className="sc-contact-toggle__label">
                  <span className="sc-contact-toggle__name">{t.contact.mode.ai}</span>
                  <span className="sc-contact-toggle__hint">{t.contact.mode.ai_hint}</span>
                </span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === "form"}
                data-testid="contact-mode-form"
                className={`sc-contact-toggle__btn ${mode === "form" ? "is-active" : ""}`}
                onClick={() => setMode("form")}
              >
                <span className="sc-contact-toggle__icon"><ClipboardList size={16} strokeWidth={2} /></span>
                <span className="sc-contact-toggle__label">
                  <span className="sc-contact-toggle__name">{t.contact.mode.form}</span>
                  <span className="sc-contact-toggle__hint">{t.contact.mode.form_hint}</span>
                </span>
              </button>
            </div>

            <div className="mt-6">
              {mode === "ai" ? <AiAssistant t={t} lang={lang} /> : <FormPanel t={t} lang={lang} />}
            </div>
          </div>
        </div>
      </div>

      {/* Footer strip */}
      <footer
        className="relative z-10 border-t"
        style={{ borderColor: "rgba(73,173,165,0.15)", background: "rgba(4,7,9,0.85)" }}
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

/* -------------------- Contact info (registry) -------------------- */
const ContactInfo = ({ t }) => {
  const c = t.contact.company;
  return (
    <div className="space-y-8">
      <div className="sc-contact-block sc-contact-block--neon">
        <div className="sc-contact-block__icon"><MapPin size={18} /></div>
        <div>
          <div className="sc-contact-block__label">{c.labels.address}</div>
          <div className="sc-contact-block__value">{c.name}</div>
          <div className="sc-contact-block__value">{c.address}</div>
        </div>
      </div>
      <div className="sc-contact-block sc-contact-block--neon">
        <div className="sc-contact-block__icon"><FileText size={18} /></div>
        <div>
          <div className="sc-contact-block__label">{c.labels.registry}</div>
          <div className="sc-contact-block__value">{c.krs}</div>
          <div className="sc-contact-block__value">{c.nip}</div>
          <div className="sc-contact-block__value">{c.regon}</div>
        </div>
      </div>
      <div className="sc-contact-block sc-contact-block--neon">
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
      <div className="sc-contact-block sc-contact-block--neon">
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
  );
};

/* -------------------- Classic form -------------------- */
const FormPanel = ({ t, lang }) => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ state: "idle", msg: "" });

  const onChange = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ state: "loading", msg: "" });
    try {
      await axios.post(`${API}/contact`, {
        name: form.name.trim(),
        email: form.email.trim(),
        company: form.name.trim(),
        message: form.message.trim(),
        lang,
        source: "form",
      });
      setStatus({ state: "success", msg: t.contact.form.success });
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus({ state: "error", msg: t.contact.form.error });
    }
  };

  return (
    <div className="sc-chat-panel" data-testid="contact-form-panel">
      <div className="sc-chat-panel__head">
        <span className="sc-chat-panel__avatar"><ClipboardList size={16} strokeWidth={2} /></span>
        <div className="flex-1">
          <div className="sc-chat-panel__name">{t.contact.mode.form}</div>
          <div className="sc-chat-panel__meta">
            <span className="sc-chat-panel__pulse" />
            <span>{t.contact.mode.form_hint}</span>
          </div>
        </div>
      </div>

      <form onSubmit={submit} data-testid="contact-form" className="sc-chat-form-classic">
        <div className="sc-field-neon">
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
        <div className="sc-field-neon">
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
        <div className="sc-field-neon">
          <label htmlFor="cf-msg">{t.contact.form.message}</label>
          <textarea
            id="cf-msg"
            data-testid="contact-input-message"
            rows={5}
            required
            value={form.message}
            onChange={onChange("message")}
          />
        </div>
        <button
          type="submit"
          data-testid="contact-submit"
          className="sc-chat-send"
          disabled={status.state === "loading"}
        >
          {status.state === "loading" ? t.contact.form.submitting : t.contact.form.submit}
          <Send size={14} strokeWidth={2} />
        </button>
        {status.state === "success" && (
          <div className="sc-chat-success" data-testid="contact-success">{status.msg}</div>
        )}
        {status.state === "error" && (
          <div className="sc-chat-error" data-testid="contact-error">{status.msg}</div>
        )}
      </form>
    </div>
  );
};

/* -------------------- AI Assistant conversation -------------------- */
const AiAssistant = ({ t, lang }) => {
  const [step, setStep] = useState("greet");
  const [data, setData] = useState({ name: "", email: "", phone: "", message: "", refined: "" });
  const [chat, setChat] = useState(() => [
    { role: "assistant", content: t.contact.ai.greeting },
    { role: "assistant", content: t.contact.ai.ask_name },
  ]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [sendState, setSendState] = useState("idle"); // "idle" | "sending" | "success" | "error"
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [chat, busy]);

  // Restart when language changes
  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const push = (role, content) => setChat((prev) => [...prev, { role, content }]);

  const reset = () => {
    setStep("greet");
    setData({ name: "", email: "", phone: "", message: "", refined: "" });
    setChat([
      { role: "assistant", content: t.contact.ai.greeting },
      { role: "assistant", content: t.contact.ai.ask_name },
    ]);
    setDraft("");
    setSendState("idle");
    setError(null);
    setStep("name");
  };

  useEffect(() => {
    if (step === "greet") setStep("name");
  }, [step]);

  const handleUserInput = (text) => {
    const value = (text ?? draft).trim();
    if (!value) return;
    setError(null);

    if (step === "name") {
      push("user", value);
      setData((d) => ({ ...d, name: value }));
      push("assistant", t.contact.ai.ask_email);
      setStep("email");
      setDraft("");
      return;
    }
    if (step === "email") {
      if (!EMAIL_RE.test(value)) {
        setError(t.contact.ai.invalid_email);
        return;
      }
      push("user", value);
      setData((d) => ({ ...d, email: value.toLowerCase() }));
      push("assistant", t.contact.ai.ask_phone);
      setStep("phone");
      setDraft("");
      return;
    }
    if (step === "phone") {
      push("user", value);
      setData((d) => ({ ...d, phone: value }));
      push("assistant", t.contact.ai.ask_message);
      setStep("message");
      setDraft("");
      return;
    }
    if (step === "message") {
      push("user", value);
      setData((d) => ({ ...d, message: value }));
      push("assistant", t.contact.ai.refine_prompt);
      setStep("refine");
      setDraft("");
      return;
    }
  };

  const skipPhone = () => {
    push("user", t.contact.ai.skip);
    setData((d) => ({ ...d, phone: "" }));
    push("assistant", t.contact.ai.ask_message);
    setStep("message");
  };

  const useAiRefine = async () => {
    push("user", t.contact.ai.use_ai);
    setBusy(true);
    push("assistant", t.contact.ai.refining);
    try {
      const res = await axios.post(`${API}/refine-message`, {
        message: data.message,
        lang,
      });
      const refined = (res.data.refined || "").trim();
      setData((d) => ({ ...d, refined }));
      setChat((prev) => {
        const next = [...prev];
        // Replace the last "refining…" placeholder with the intro + refined
        next[next.length - 1] = {
          role: "assistant",
          content: `${t.contact.ai.refine_result_intro}\n\n${refined}\n\n${t.contact.ai.review_prompt}`,
        };
        return next;
      });
      setStep("review");
    } catch {
      setChat((prev) => prev.slice(0, -1));
      setError(t.contact.ai.error);
      setStep("refine");
    } finally {
      setBusy(false);
    }
  };

  const sendAsIs = () => {
    push("user", t.contact.ai.send_as_is);
    setData((d) => ({ ...d, refined: "" }));
    setStep("review");
  };

  const backToOriginal = () => {
    push("user", t.contact.ai.keep_original);
    setData((d) => ({ ...d, refined: "" }));
    setStep("review");
  };

  const useRefinedVersion = () => {
    push("user", t.contact.ai.use_refined);
    setStep("review");
  };

  const submitRequest = async () => {
    setSendState("sending");
    try {
      await axios.post(`${API}/contact`, {
        name: data.name,
        email: data.email,
        company: data.name,
        phone: data.phone || undefined,
        message: data.refined || data.message,
        lang,
        source: "ai-assistant",
      });
      push("assistant", t.contact.ai.success);
      setSendState("success");
      setStep("done");
    } catch {
      setError(t.contact.ai.error);
      setSendState("error");
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleUserInput();
    }
  };

  const showInput = ["name", "email", "phone", "message"].includes(step);
  const placeholder =
    step === "message"
      ? t.contact.ai.placeholder_message
      : t.contact.ai.placeholder;

  const finalMessage = data.refined || data.message;

  return (
    <div className="sc-chat-panel" data-testid="contact-ai-panel">
      <div className="sc-chat-panel__head">
        <span className="sc-chat-panel__avatar"><MessageCircle size={16} strokeWidth={2} /></span>
        <div className="flex-1">
          <div className="sc-chat-panel__name">{t.contact.ai.assistant}</div>
          <div className="sc-chat-panel__meta">
            <span className="sc-chat-panel__pulse" />
            <span>Gemini 3 Flash · online</span>
          </div>
        </div>
        <button
          type="button"
          className="sc-chat-restart"
          onClick={reset}
          title={t.contact.ai.restart}
          data-testid="ai-restart"
        >
          <RotateCcw size={14} strokeWidth={2} />
        </button>
      </div>

      <div ref={listRef} className="sc-chat-messages" data-testid="ai-messages">
        {chat.map((m, i) => (
          <div key={i} className={`sc-chat-msg sc-chat-msg--${m.role}`}>
            <span className="sc-chat-msg__role">
              {m.role === "user" ? t.contact.ai.you : t.contact.ai.assistant}
            </span>
            <div className="sc-chat-msg__bubble">{m.content}</div>
          </div>
        ))}
        {error && <div className="sc-chat-error" role="alert">{error}</div>}
      </div>

      {/* Contextual action strip */}
      {step === "phone" && (
        <div className="sc-chat-pills-wrap">
          <div className="sc-chat-pills">
            <button
              type="button"
              className="sc-chat-pill"
              onClick={skipPhone}
              data-testid="ai-skip-phone"
            >
              {t.contact.ai.skip}
            </button>
          </div>
        </div>
      )}

      {step === "refine" && !busy && (
        <div className="sc-chat-pills-wrap">
          <div className="sc-chat-pills">
            <button
              type="button"
              className="sc-chat-pill sc-chat-pill--primary"
              onClick={useAiRefine}
              data-testid="ai-use-refine"
            >
              <Sparkles size={12} className="inline-block mr-1" strokeWidth={2} />
              {t.contact.ai.use_ai}
            </button>
            <button
              type="button"
              className="sc-chat-pill"
              onClick={sendAsIs}
              data-testid="ai-send-as-is"
            >
              {t.contact.ai.send_as_is}
            </button>
          </div>
        </div>
      )}

      {step === "review" && sendState !== "success" && (
        <div className="sc-chat-review" data-testid="ai-review">
          <div className="sc-chat-review__title">{t.contact.ai.summary}</div>
          <dl className="sc-chat-review__list">
            <div><dt>{t.contact.ai.summary_labels.name}</dt><dd>{data.name}</dd></div>
            <div><dt>{t.contact.ai.summary_labels.email}</dt><dd>{data.email}</dd></div>
            {data.phone && (
              <div><dt>{t.contact.ai.summary_labels.phone}</dt><dd>{data.phone}</dd></div>
            )}
            <div>
              <dt>{t.contact.ai.summary_labels.message}</dt>
              <dd className="sc-chat-review__msg">{finalMessage}</dd>
            </div>
          </dl>
          <div className="sc-chat-review__actions">
            {data.refined && (
              <button
                type="button"
                className="sc-chat-pill"
                onClick={backToOriginal}
                data-testid="ai-back-original"
              >
                {t.contact.ai.keep_original}
              </button>
            )}
            <button
              type="button"
              className="sc-chat-send"
              onClick={submitRequest}
              disabled={sendState === "sending"}
              data-testid="ai-send-request"
            >
              {sendState === "sending" ? t.contact.ai.sending : t.contact.ai.send}
              <Send size={14} strokeWidth={2} />
            </button>
          </div>
        </div>
      )}

      {step === "done" && (
        <div className="sc-chat-pills-wrap">
          <div className="sc-chat-pills">
            <button
              type="button"
              className="sc-chat-pill"
              onClick={reset}
              data-testid="ai-restart-done"
            >
              <RotateCcw size={12} className="inline-block mr-1" strokeWidth={2} />
              {t.contact.ai.restart}
            </button>
          </div>
        </div>
      )}

      {showInput && (
        <form
          className="sc-chat-form"
          onSubmit={(e) => { e.preventDefault(); handleUserInput(); }}
        >
          <input
            type={step === "email" ? "email" : "text"}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            className="sc-chat-input"
            data-testid="ai-input"
            autoFocus
          />
          <button
            type="submit"
            className="sc-chat-send"
            disabled={!draft.trim()}
            data-testid="ai-send-turn"
          >
            <Send size={14} strokeWidth={2} />
          </button>
        </form>
      )}
    </div>
  );
};

export default ContactSection;
