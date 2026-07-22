import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLang } from "@/i18n/LanguageContext";
import Reveal from "@/components/Reveal";
import {
  Sparkles,
  Send,
  ShieldCheck,
  Zap,
  Server,
  KeyRound,
  MessageCircle,
} from "lucide-react";

const BADGE_ICONS = [ShieldCheck, Zap, Server, KeyRound];

const genSessionId = () =>
  `sc-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;

/**
 * SupportChatSection — Claude Sonnet 4.5 powered support/service Q&A.
 *  - Quick-question pills for common topics
 *  - Free text input for open-ended questions
 *  - Streamed responses via SSE (fetch + ReadableStream)
 *  - No persistence (session_id lives only in browser)
 */
const SupportChatSection = () => {
  const { t, lang } = useLang();
  const backend = process.env.REACT_APP_BACKEND_URL;
  const sessionId = useMemo(() => genSessionId(), []);
  const [messages, setMessages] = useState(() => [
    { role: "assistant", content: t.support_chat.greeting },
  ]);
  const [draft, setDraft] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState(null);
  const listRef = useRef(null);
  const abortRef = useRef(null);

  // Refresh greeting when language changes
  useEffect(() => {
    setMessages([{ role: "assistant", content: t.support_chat.greeting }]);
  }, [lang, t.support_chat.greeting]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, streaming]);

  const sendMessage = async (text) => {
    const q = (text ?? "").trim();
    if (!q || streaming) return;

    setError(null);
    setDraft("");
    setMessages((prev) => [
      ...prev,
      { role: "user", content: q },
      { role: "assistant", content: "" },
    ]);
    setStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch(`${backend}/api/support-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, message: q, lang }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let done = false;

      while (!done) {
        const chunk = await reader.read();
        done = chunk.done;
        if (chunk.value) {
          buffer += decoder.decode(chunk.value, { stream: true });
          // Parse SSE events (separated by \n\n)
          const parts = buffer.split("\n\n");
          buffer = parts.pop() || "";
          for (const evt of parts) {
            if (!evt.trim()) continue;
            if (evt.startsWith("event: done")) {
              done = true;
              break;
            }
            const dataLine = evt
              .split("\n")
              .find((l) => l.startsWith("data: "));
            if (!dataLine) continue;
            const token = dataLine.slice(6).replace(/\\n/g, "\n");
            setMessages((prev) => {
              const next = [...prev];
              const last = next[next.length - 1];
              if (last && last.role === "assistant") {
                next[next.length - 1] = {
                  ...last,
                  content: last.content + token,
                };
              }
              return next;
            });
          }
        }
      }
    } catch (e) {
      if (e.name !== "AbortError") {
        setError(t.support_chat.error);
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    sendMessage(draft);
  };

  return (
    <section
      id="support-chat"
      data-testid="support-chat-section"
      className="relative w-full sc-chat-section"
      style={{ background: "#040709", color: "#E8F4F5" }}
    >
      {/* Neon aurora backdrop */}
      <div className="sc-chat-aurora" aria-hidden="true">
        <span className="sc-chat-aurora__blob sc-chat-aurora__blob--a" />
        <span className="sc-chat-aurora__blob sc-chat-aurora__blob--b" />
        <span className="sc-chat-aurora__grid" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 py-24 md:py-32 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left — copy + badges */}
        <div className="lg:col-span-5">
          <Reveal>
            <div className="flex items-center gap-4 text-[11px] uppercase tracking-[0.32em] text-[#7CC4C0]">
              <span className="inline-block h-px w-10 bg-[#49ADA5]" />
              <Sparkles size={13} className="text-[#49ADA5]" />
              {t.support_chat.section_label}
            </div>
            <h2
              data-testid="support-chat-title"
              className="mt-4 text-3xl md:text-5xl font-semibold leading-[1.05] tracking-tight text-white"
            >
              {t.support_chat.title}
            </h2>
            <p className="mt-5 max-w-md text-base md:text-lg leading-relaxed text-white/70">
              {t.support_chat.subtitle}
            </p>

            <ul className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {t.support_chat.badges.map((label, i) => {
                const Icon = BADGE_ICONS[i % BADGE_ICONS.length];
                return (
                  <li
                    key={label}
                    className="sc-chat-badge"
                    data-testid={`support-badge-${i}`}
                  >
                    <span className="sc-chat-badge__icon">
                      <Icon size={16} strokeWidth={1.8} />
                    </span>
                    <span className="sc-chat-badge__label">{label}</span>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>

        {/* Right — chat panel */}
        <div className="lg:col-span-7">
          <Reveal>
            <div className="sc-chat-panel" data-testid="support-chat-panel">
              {/* Panel header */}
              <div className="sc-chat-panel__head">
                <span className="sc-chat-panel__avatar">
                  <MessageCircle size={16} strokeWidth={2} />
                </span>
                <div className="flex-1">
                  <div className="sc-chat-panel__name">
                    {t.support_chat.assistant}
                  </div>
                  <div className="sc-chat-panel__meta">
                    <span className="sc-chat-panel__pulse" />
                    <span>Claude Sonnet 4.5 · online</span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div
                ref={listRef}
                className="sc-chat-messages"
                data-testid="support-chat-messages"
              >
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`sc-chat-msg sc-chat-msg--${m.role}`}
                    data-testid={`chat-msg-${i}`}
                  >
                    <span className="sc-chat-msg__role">
                      {m.role === "user"
                        ? t.support_chat.you
                        : t.support_chat.assistant}
                    </span>
                    <div className="sc-chat-msg__bubble">
                      {m.content ||
                        (streaming && i === messages.length - 1 ? (
                          <span className="sc-chat-typing">
                            <span></span>
                            <span></span>
                            <span></span>
                          </span>
                        ) : null)}
                      {streaming &&
                        m.role === "assistant" &&
                        i === messages.length - 1 &&
                        m.content && <span className="sc-chat-caret" />}
                    </div>
                  </div>
                ))}
                {error && (
                  <div className="sc-chat-error" role="alert">
                    {error}
                  </div>
                )}
              </div>

              {/* Quick pills */}
              <div className="sc-chat-pills-wrap">
                <div className="sc-chat-pill-hint">{t.support_chat.pill_hint}</div>
                <div className="sc-chat-pills">
                  {t.support_chat.pills.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className="sc-chat-pill"
                      onClick={() => sendMessage(p.label)}
                      disabled={streaming}
                      data-testid={`chat-pill-${p.id}`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <form onSubmit={onSubmit} className="sc-chat-form">
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={t.support_chat.placeholder}
                  className="sc-chat-input"
                  disabled={streaming}
                  data-testid="chat-input"
                />
                <button
                  type="submit"
                  className="sc-chat-send"
                  disabled={streaming || !draft.trim()}
                  data-testid="chat-send"
                >
                  {streaming ? t.support_chat.thinking : t.support_chat.send}
                  <Send size={14} strokeWidth={2} />
                </button>
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default SupportChatSection;
