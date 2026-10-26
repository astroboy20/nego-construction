"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

const COOKIE_NAME = "nego_consent";
const COOKIE_MAX_AGE = 31536000; // 365 days in seconds

/**
 * Reads the nego_consent cookie from document.cookie.
 * Returns the cookie value string, or null if not set.
 */
function getConsentCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE_NAME}=`));
  return match ? match.split("=")[1] : null;
}

/**
 * Writes the nego_consent cookie with the required security attributes.
 * Dispatches a custom event so AnalyticsProvider can react without a page reload.
 */
function setConsentCookie(value: "accepted" | "declined") {
  document.cookie = [
    `${COOKIE_NAME}=${value}`,
    `Max-Age=${COOKIE_MAX_AGE}`,
    "Path=/",
    "SameSite=Lax",
    "Secure",
  ].join("; ");

  // Notify AnalyticsProvider of the change
  window.dispatchEvent(new Event("nego-consent-updated"));
}

/**
 * CookieBanner renders a fixed bottom banner on the visitor's first page load
 * when no nego_consent cookie is present.
 *
 * On Accept: sets nego_consent=accepted and enables analytics.
 * On Decline: sets nego_consent=declined and suppresses analytics.
 *
 * Once a preference is stored the banner never re-renders.
 * Requirements: 7.1–7.8
 */
export function CookieBanner() {
  // null = not yet determined (SSR), true = show banner, false = hide banner
  const [visible, setVisible] = useState<boolean | null>(null);

  useEffect(() => {
    // Only run on the client after hydration
    setVisible(getConsentCookie() === null);
  }, []);

  function handleAccept() {
    setConsentCookie("accepted");
    setVisible(false);
  }

  function handleDecline() {
    setConsentCookie("declined");
    setVisible(false);
  }

  // Don't render during SSR or when consent is already recorded
  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Cookie consent"
      aria-describedby="cookie-banner-description"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background px-4 py-4 shadow-lg md:px-6"
    >
      <div className="container flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Description */}
        <p
          id="cookie-banner-description"
          className="text-sm leading-6 text-muted-foreground"
        >
          We use analytics cookies to understand how visitors use our site.
          Read our{" "}
          <Link
            href="/privacy-policy"
            className="underline underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Privacy Policy
          </Link>{" "}
          to learn more.
        </p>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={handleDecline}
            aria-label="Decline analytics cookies"
            className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={handleAccept}
            aria-label="Accept analytics cookies"
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Accept
          </button>
          {/* Dismiss shortcut — equivalent to Decline */}
          <button
            type="button"
            onClick={handleDecline}
            aria-label="Dismiss cookie banner"
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
