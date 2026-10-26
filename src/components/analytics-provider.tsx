"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/next";

/**
 * Reads the nego_consent cookie from document.cookie.
 * Returns the cookie value string, or null if not set.
 */
function getConsentCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith("nego_consent="));
  return match ? match.split("=")[1] : null;
}

/**
 * AnalyticsProvider conditionally renders Vercel Analytics
 * only when the visitor has explicitly accepted cookies.
 * This implements consent-gated analytics (Requirements 7.3, 7.4).
 */
export function AnalyticsProvider() {
  const [consent, setConsent] = useState<string | null>(null);

  useEffect(() => {
    // Read consent on mount and whenever the cookie might change
    setConsent(getConsentCookie());

    // Re-check if the user accepts/declines via the banner without a page reload
    const handleStorageChange = () => {
      setConsent(getConsentCookie());
    };

    window.addEventListener("nego-consent-updated", handleStorageChange);
    return () => {
      window.removeEventListener("nego-consent-updated", handleStorageChange);
    };
  }, []);

  if (consent !== "accepted") {
    return null;
  }

  return <Analytics />;
}
