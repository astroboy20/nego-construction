"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Scrolls to the top of the page on every route change.
 *
 * Next.js App Router preserves scroll position between navigations by default.
 * This component resets it so every new page starts at the top.
 *
 * Uses requestAnimationFrame so the scroll fires after the new page has
 * painted, avoiding a flash where the old scroll position is briefly visible.
 *
 * Respects prefers-reduced-motion — jumps instantly instead of smooth-scrolling
 * when the user has requested reduced motion.
 */
export function ScrollToTop() {
  const pathname = usePathname();
  const prevPathname = useRef<string>(pathname);

  useEffect(() => {
    // Only act on actual page changes, not initial mount
    if (prevPathname.current === pathname) return;
    prevPathname.current = pathname;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Defer until after paint so the new page content is in the DOM
    const frame = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: reduced ? "instant" : "instant" });
    });

    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
