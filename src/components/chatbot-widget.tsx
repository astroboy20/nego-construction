"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X, Send, MessageCircle } from "lucide-react";
import type { ChatMessage } from "@/lib/types";

const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const CHECK_INTERVAL_MS = 60 * 1000; // 1 minute

/**
 * ChatbotWidget renders a floating action button (FAB) that opens a chat panel.
 * The FAB sits at bottom-20 right-4 (above the ScrollToTop button at bottom-6 right-4).
 *
 * Features:
 * - Streaming responses via the /api/chat endpoint
 * - Conversation cleared on 30-minute inactivity or tab visibility change
 * - Disclaimer with link to /contact
 *
 * Requirements: 11.1, 11.2, 11.3, 11.4, 11.7, 11.8, 12.4, 12.5, 13.5
 */
export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const lastActivityRef = useRef<number>(Date.now());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  // ─── Scroll to bottom when new messages arrive ───────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ─── Focus input when panel opens ────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      // Small delay to allow the panel animation to start
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // ─── Track activity on user interaction ─────────────────────────────────────
  function recordActivity() {
    lastActivityRef.current = Date.now();
  }

  // ─── Send message ─────────────────────────────────────────────────────────────
  async function handleSend() {
    const text = inputValue.trim();
    if (!text || isLoading) return;

    recordActivity();
    setInputValue("");

    // Append user message
    const userMessage: ChatMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);

    // Append empty assistant message that will be filled progressively
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok || !response.body) {
        const errorText = response.status === 429
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

      // Read the plain text stream — API uses createTextStreamResponse
      // which sends raw UTF-8 text chunks (not the `0:"token"` data stream format)
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
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  return (
    <>
      {/* Chat Panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="NEGO Assistant chat"
          className="fixed bottom-32 right-4 z-50 flex w-80 flex-col overflow-hidden rounded-lg border border-border bg-background shadow-xl md:w-96"
          style={{ maxHeight: "calc(100vh - 10rem)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-primary px-4 py-3">
            <div className="flex items-center gap-2">
              <MessageCircle
                className="h-4 w-4 text-accent"
                aria-hidden="true"
              />
              <span className="text-sm font-bold text-primary-foreground">
                NEGO Assistant
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="rounded p-1 text-primary-foreground/70 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {/* Messages area */}
          <div
            className="flex flex-1 flex-col gap-3 overflow-y-auto p-4"
            style={{ minHeight: "200px", maxHeight: "340px" }}
            role="log"
            aria-live="polite"
            aria-label="Chat messages"
          >
            {messages.length === 0 && (
              <p className="text-center text-xs text-muted-foreground">
                Ask me anything about NEGO Construction.
              </p>
            )}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-accent text-accent-foreground"
                      : "border border-border bg-muted text-foreground"
                  }`}
                >
                  {msg.content || (
                    <span className="inline-flex gap-1 text-muted-foreground">
                      <span className="animate-bounce">•</span>
                      <span
                        className="animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      >
                        •
                      </span>
                      <span
                        className="animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      >
                        •
                      </span>
                    </span>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} aria-hidden="true" />
          </div>

          {/* Disclaimer */}
          <div className="border-t border-border px-4 py-2">
            <p className="text-xs text-muted-foreground">
              Responses are AI-generated and may not be exhaustive.{" "}
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="underline underline-offset-2 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Contact us
              </Link>
            </p>
          </div>

          {/* Input */}
          <div className="border-t border-border p-3">
            <div className="flex items-center gap-2">
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
                placeholder="Type a message…"
                maxLength={1000}
                aria-label="Type your message"
                className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                aria-label="Send message"
                className="inline-flex items-center justify-center rounded-md bg-accent p-2 text-accent-foreground transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAB — positioned above ScrollToTop (bottom-6 right-4) */}
      <button
        type="button"
        onClick={() => {
          setIsOpen((prev) => !prev);
          recordActivity();
        }}
        aria-label={isOpen ? "Close chat" : "Open NEGO Assistant chat"}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className="fixed bottom-20 right-4 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg transition-all hover:bg-accent/90 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
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
