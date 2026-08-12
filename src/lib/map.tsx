"use client";

import { useEffect, useRef, useState } from "react";
import type mapboxgl from "mapbox-gl";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

interface MapboxAddressMapProps {
  /** Full address string to geocode and center the map on. */
  address: string;
  /** Fallback text shown while loading or if the map can't render. */
  label?: string;
  /** Match MediaSlot's `tall` prop for aspect ratio. Ignored if `height` is set. */
  tall?: boolean;
  /**
   * Explicit height, e.g. "400px", "60vh", "24rem". Overrides the `tall`
   * aspect-ratio and lets the box size independently of its width.
   */
  height?: string;
  /** Extra classes merged onto the outer wrapper (e.g. rounded corners). */
  className?: string;
}

export function MapboxAddressMap({
  address,
  label,
  tall = false,
  height,
  className = "",
}: MapboxAddressMapProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [inView, setInView] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle",
  );

  // Step 1: only flag the map as "in view" once it's near the viewport.
  // The mapbox-gl bundle, its CSS, and the geocoding request are all
  // deferred until this fires, instead of loading on every page visit.
  useEffect(() => {
    if (!wrapperRef.current) return;
    if (typeof IntersectionObserver === "undefined") {
      // No IO support: fall back to loading immediately.
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);

  // Step 2: once in view, lazy-load mapbox-gl itself and initialize.
  useEffect(() => {
    if (!inView) return;
    if (!MAPBOX_TOKEN) {
      console.error("MapboxAddressMap: NEXT_PUBLIC_MAPBOX_TOKEN is not set.");
      setStatus("error");
      return;
    }
    if (!mapContainerRef.current) return;

    let cancelled = false;
    setStatus("loading");

    async function init() {
      try {
        const [{ default: mapboxgl }] = await Promise.all([
          import("mapbox-gl"),
          import("mapbox-gl/dist/mapbox-gl.css"),
        ]);
        if (cancelled) return;

        mapboxgl.accessToken = MAPBOX_TOKEN as string;

        const query = encodeURIComponent(address);
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${MAPBOX_TOKEN}&limit=1`,
        );
        if (!res.ok) throw new Error("Geocoding request failed");

        const data = await res.json();
        const [lng, lat] = data?.features?.[0]?.center ?? [];
        if (typeof lng !== "number" || typeof lat !== "number") {
          throw new Error("No coordinates found for address");
        }
        if (cancelled || !mapContainerRef.current) return;

        const map = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: "mapbox://styles/mapbox/streets-v12",
          center: [lng, lat],
          zoom: 15,
        });
        map.addControl(new mapboxgl.NavigationControl(), "top-right");
        new mapboxgl.Marker({ color: "#F97316" })
          .setLngLat([lng, lat])
          .addTo(map);

        mapRef.current = map;
        setStatus("ready");
      } catch (err) {
        if (!cancelled) {
          console.error("MapboxAddressMap failed to load:", err);
          setStatus("error");
        }
      }
    }

    init();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [inView, address]);

  return (
    <div
      ref={wrapperRef}
      className={`relative w-full overflow-hidden border border-border bg-muted ${
        height ? "" : tall ? "aspect-[3/4]" : "aspect-video"
      } ${className}`}
      style={height ? { height } : undefined}
    >
      <div ref={mapContainerRef} className="h-full w-full" />
      {status !== "ready" && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-muted p-6 text-center text-sm text-muted-foreground">
          {status === "error"
            ? "Map unavailable — check the Mapbox token or address."
            : label || "Loading map..."}
        </div>
      )}
    </div>
  );
}