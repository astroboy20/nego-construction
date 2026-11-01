"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X, ArrowUp, MessageCircle, RotateCcw, HardHat } from "lucide-react";
import type { ChatMessage } from "@/lib/types";

const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const CHECK_INTERVAL_MS = 60 * 1000; // 1 minute

// Edit these to match the questions your visitors actually ask.
const SUGGESTED_PROMPTS = [
  "What services do you offer?",
  "How do I request a quote?",
  "Where do you work?",
];

/** Generate a random session ID for this browser session */
function generateSessionId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const lastActivityRef = useRef<number>(Date.now());
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);
  const sessionIdRef = useRef<string>(generateSessionId());

  // ─── Inactivity and visibility clearing ─────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastActivityRef.current >= INACTIVITY_TIMEOUT_MS) {
        setMessages([]);
        setIsOpen(false);
      }
    }, CHECK_INTERVAL_MS);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setMessages([]);
        setIsOpen(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // ─── Close on Escape and return focus to the launcher ───────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        fabRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  // ─── Scroll the message list (not the page) to the bottom ───────────────────
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // ─── Focus input when panel opens ────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  function recordActivity() {
    lastActivityRef.current = Date.now();
  }

  function resetChat() {
    if (isLoading) return;
    setMessages([]);
    setInputValue("");
    sessionIdRef.current = generateSessionId();
    recordActivity();
    inputRef.current?.focus();
  }

  // ─── Send message ─────────────────────────────────────────────────────────────
  async function handleSend(override?: string) {
    const text = (override ?? inputValue).trim();
    if (!text || isLoading) return;

    recordActivity();
    setInputValue("");

    const userMessage: ChatMessage = { role: "user", content: text };
    setMessages((prev) => [
      ...prev,
      userMessage,
      { role: "assistant", content: "" },
    ]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          sessionId: sessionIdRef.current,
          history: messages.filter((m) => m.content.length > 0),
        }),
      });

      if (!response.ok || !response.body) {
        const errorText =
          response.status === 429
            ? "Too many requests. Please wait a moment before trying again."
            : "Sorry, something went wrong. Please try again.";
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: errorText,
          };
          return updated;
        });
        return;
      }

      // Plain UTF-8 text stream (createTextStreamResponse)
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        recordActivity();

        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last.role === "assistant") {
            updated[updated.length - 1] = {
              ...last,
              content: last.content + chunk,
            };
          }
          return updated;
        });
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
      recordActivity();
      // The input is disabled while loading, so focus returns here
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  const canSend = inputValue.trim().length > 0 && !isLoading;

  return (
    <>
      {/* Motion is scoped here and switched off for reduced-motion users */}
      <style>{`
        @keyframes nego-panel-in {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes nego-msg-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes nego-dot {
          0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
          30%           { opacity: 1;   transform: translateY(-3px); }
        }
        .nego-panel { animation: nego-panel-in 180ms ease-out; transform-origin: bottom right; }
        .nego-msg   { animation: nego-msg-in 160ms ease-out; }
        .nego-dot   { animation: nego-dot 1.2s infinite ease-in-out; }
        @media (prefers-reduced-motion: reduce) {
          .nego-panel, .nego-msg, .nego-dot { animation: none; }
        }
      `}</style>

      {/* Chat Panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="NEGO Assistant chat"
          className="nego-panel fixed bottom-32 right-4 z-50 flex w-[calc(100vw-2rem)] max-w-[24rem] flex-col overflow-hidden rounded-xl border border-border bg-background shadow-2xl"
          style={{ height: "min(34rem, calc(100vh - 10rem))" }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 bg-primary px-4 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <HardHat className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold leading-tight text-primary-foreground">
                NEGO Assistant
              </p>
              <p className="truncate text-xs text-primary-foreground/70">
                Ask about our projects and services
              </p>
            </div>
            {messages.length > 0 && (
              <button
                type="button"
                onClick={resetChat}
                disabled={isLoading}
                aria-label="Start a new conversation"
                title="New conversation"
                className="rounded-md p-1.5 text-primary-foreground/70 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-40"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                fabRef.current?.focus();
              }}
              aria-label="Close chat"
              className="rounded-md p-1.5 text-primary-foreground/70 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {/* Messages area */}
          <div
            ref={scrollRef}
            className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto bg-muted/30 p-4"
            role="log"
            aria-live="polite"
            aria-label="Chat messages"
          >
            {messages.length === 0 ? (
              <div className="my-auto flex flex-col items-center gap-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <HardHat className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    How can we help?
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Ask me anything about NEGO Construction, or start with one
                    of these.
                  </p>
                </div>
                <div className="flex w-full flex-col gap-2">
                  {SUGGESTED_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => handleSend(prompt)}
                      className="rounded-lg border border-border bg-background px-3 py-2 text-left text-sm text-foreground transition-colors hover:border-accent hover:bg-accent/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, index) => {
                const isUser = msg.role === "user";
                const isTyping = !isUser && !msg.content;
                return (
                  <div
                    key={index}
                    className={`nego-msg flex items-end gap-2 ${
                      isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isUser && (
                      <div
                        className="mb-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
                        aria-hidden="true"
                      >
                        <HardHat className="h-3.5 w-3.5" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] whitespace-pre-wrap break-words px-3.5 py-2 text-sm leading-relaxed ${
                        isUser
                          ? "rounded-2xl rounded-br-sm bg-accent text-accent-foreground"
                          : "rounded-2xl rounded-bl-sm border border-border bg-background text-foreground"
                      }`}
                    >
                      {isTyping ? (
                        <span
                          className="inline-flex items-center gap-1 py-1"
                          role="status"
                          aria-label="Assistant is typing"
                        >
                          {[0, 1, 2].map((i) => (
                            <span
                              key={i}
                              className="nego-dot h-1.5 w-1.5 rounded-full bg-muted-foreground"
                              style={{ animationDelay: `${i * 0.15}s` }}
                            />
                          ))}
                        </span>
                      ) : (
                        msg.content
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Input */}
          <div className="border-t border-border bg-background p-3">
            <div className="flex items-center gap-2 rounded-full border border-border bg-background py-1 pl-4 pr-1 transition-colors focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/40">
              <label htmlFor="chatbot-input" className="sr-only">
                Type your message
              </label>
              <input
                id="chatbot-input"
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  recordActivity();
                }}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                placeholder={isLoading ? "Replying…" : "Type a message…"}
                maxLength={1000}
                autoComplete="off"
                className="min-w-0 flex-1 bg-transparent py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={!canSend}
                aria-label="Send message"
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground transition-all hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40"
              >
                <ArrowUp className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <p className="mt-2 px-1 text-center text-[11px] leading-snug text-muted-foreground">
              AI-generated answers may not be complete.{" "}
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="underline underline-offset-2 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Contact our team
              </Link>{" "}
              for anything important.
            </p>
          </div>
        </div>
      )}

      {/* FAB — positioned above ScrollToTop (bottom-6 right-4) */}
      <button
        ref={fabRef}
        type="button"
        onClick={() => {
          setIsOpen((prev) => !prev);
          recordActivity();
        }}
        aria-label={isOpen ? "Close chat" : "Open NEGO Assistant chat"}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className="fixed bottom-20 right-4 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg transition-all hover:scale-105 hover:bg-accent/90 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:scale-100"
      >
        {isOpen ? (
          <X className="h-5 w-5" aria-hidden="true" />
        ) : (
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
        )}
      </button>
    </>
  );
}