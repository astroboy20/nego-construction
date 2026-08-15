"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { CtaBand, PageHero, Reveal, ScrollScene, SiteShell } from "@/components/site";

const perks = [
  "Fully Serviced",
  "24/7 Power Supply",
  "Potable Water",
  "CCTV Cameras",
  "Basketball Court",
  "Tennis Court",
  "Street Lights",
  "Staff Quarters",
  "Paved Roads with Drainage",
  "Olympic Sized Pool",
  "Armed Security",
  "Children's Playground",
  "Central Sewage System",
  "Fast Internet",
  "Perimeter Fenced Estate with Access Control",
];

const neighbourhood = [
  {
    label: "Top-notch schools nearby",
    items: [
      "Chalcedony School",
      "Caleb International College",
      "White Stars School",
      "Corona Secondary School",
      "Greensprings School",
    ],
  },
  { label: "Novare Mall" },
  { label: "Lagos Fruit Market" },
  { label: "Chois Estate" },
  { label: "Sapphire Gardens Estate" },
  { label: "Gas Filling Stations" },
  { label: "Access to New Coastal Road" },
];

const buildingTypes = [
  {
    id: "4-bedroom",
    title: "4 Bedroom Terraced Duplex",
    description:
      "Spacious four-bedroom terraced duplex with a family lounge, generous living spaces and a fully fitted kitchen — designed for larger families who want room to grow.",
    images: [
      { src: "/4-bedroom/Living-room-3.png", alt: "Living Room" },
      { src: "/4-bedroom/Living-room-4.png", alt: "Living Room 2" },
      { src: "/4-bedroom/Family-Lounge.png", alt: "Family Lounge" },
      { src: "/4-bedroom/DINING-2.png", alt: "Dining" },
      { src: "/4-bedroom/kitchen-1.PNG", alt: "Kitchen 1" },
      { src: "/4-bedroom/kitchen-2.PNG", alt: "Kitchen 2" },
      { src: "/4-bedroom/Bedroom-1.png", alt: "Bedroom 1" },
      { src: "/4-bedroom/Bedroom-2.png", alt: "Bedroom 2" },
      { src: "/4-bedroom/Bedroom-3.png", alt: "Bedroom 3" },
      { src: "/4-bedroom/Toilet-1.png", alt: "Bathroom 1" },
      { src: "/4-bedroom/Toilet-2.jpg", alt: "Bathroom 2" },
      { src: "/4-bedroom/Toilet-3.jpg", alt: "Bathroom 3" },
    ],
  },
  {
    id: "2-bedroom",
    title: "2 Bedroom Terrace Duplex",
    description:
      "A thoughtfully designed two-bedroom terrace duplex — ideal for couples or small families seeking modern, low-maintenance living in a secure estate.",
    images: [
      { src: "/2-bedroom/living-01-3.jpg", alt: "Living 1" },
      { src: "/2-bedroom/living-02-3.jpg", alt: "Living 2" },
      { src: "/2-bedroom/living-03-3.jpg", alt: "Living 3" },
      { src: "/2-bedroom/dining-01.jpg", alt: "Dining 1" },
      { src: "/2-bedroom/dining-02.jpg", alt: "Dining 2" },
      { src: "/2-bedroom/dining-03.jpg", alt: "Dining 3" },
      { src: "/2-bedroom/kitchen-01.jpg", alt: "Kitchen 1" },
      { src: "/2-bedroom/kitchen-02.jpg", alt: "Kitchen 2" },
      { src: "/2-bedroom/room-a-01.jpg", alt: "Bedroom A 1" },
      { src: "/2-bedroom/room-a-02.jpg", alt: "Bedroom A 2" },
      { src: "/2-bedroom/room-a-03.jpg", alt: "Bedroom A 3" },
      { src: "/2-bedroom/stair-01.jpg", alt: "Staircase" },
      { src: "/2-bedroom/toilet-a-01.jpg", alt: "Bathroom A" },
      { src: "/2-bedroom/toilet-b-01.jpg", alt: "Bathroom B" },
    ],
  },
  {
    id: "3-bedroom-detached",
    title: "3 Bedroom Detached Duplex",
    description:
      "A premium three-bedroom fully detached duplex offering privacy and space, with high-quality finishes throughout every room.",
    images: [
      { src: "/3-bedroom-detached/Living-Room-1.png", alt: "Living Room 1" },
      { src: "/3-bedroom-detached/Living-Room-2.png", alt: "Living Room 2" },
      { src: "/3-bedroom-detached/Dining.png", alt: "Dining" },
      { src: "/3-bedroom-detached/Kitchen-1.png", alt: "Kitchen 1" },
      { src: "/3-bedroom-detached/Kitchen-2.png", alt: "Kitchen 2" },
      { src: "/3-bedroom-detached/Bed-1-A.png", alt: "Bedroom 1A" },
      { src: "/3-bedroom-detached/Bed-1-B.png", alt: "Bedroom 1B" },
      { src: "/3-bedroom-detached/Bed-2-A.png", alt: "Bedroom 2" },
      { src: "/3-bedroom-detached/Bath-1-A.png", alt: "Bathroom 1A" },
      { src: "/3-bedroom-detached/Bath-1-B.png", alt: "Bathroom 1B" },
      { src: "/3-bedroom-detached/Bath-2.png", alt: "Bathroom 2" },
      { src: "/3-bedroom-detached/Stair-Well-lobby.png", alt: "Stairwell" },
      { src: "/3-bedroom-detached/Stair-well-lobby-2.png", alt: "Lobby" },
    ],
  },
  {
    id: "3-bedroom-semi-detached",
    title: "3 Bedroom Semi-Detached Duplex",
    description:
      "Three-bedroom semi-detached duplex combining the best of shared-wall efficiency and generous interior space — a popular choice for families.",
    images: [
      { src: "/3-bedroom-semi-detached/living-01-2.jpg", alt: "Living 1" },
      { src: "/3-bedroom-semi-detached/living-02-2.jpg", alt: "Living 2" },
      { src: "/3-bedroom-semi-detached/living-03-2.jpg", alt: "Living 3" },
      { src: "/3-bedroom-semi-detached/dining-2.jpg", alt: "Dining" },
      { src: "/3-bedroom-semi-detached/kitchen.jpg", alt: "Kitchen 1" },
      { src: "/3-bedroom-semi-detached/kitchen-2.jpg", alt: "Kitchen 2" },
      { src: "/3-bedroom-semi-detached/masters-01-3.jpg", alt: "Master Bedroom 1" },
      { src: "/3-bedroom-semi-detached/masters-02-2.jpg", alt: "Master Bedroom 2" },
      { src: "/3-bedroom-semi-detached/bedroom-a01-2.jpg", alt: "Bedroom A" },
      { src: "/3-bedroom-semi-detached/bedroom-b01-1.jpg", alt: "Bedroom B" },
      { src: "/3-bedroom-semi-detached/Master-toilet.jpg", alt: "Master Bathroom" },
      { src: "/3-bedroom-semi-detached/Typical-toilet.jpg", alt: "Bathroom" },
    ],
  },
];

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({
  images,
  startIndex,
  onClose,
}: {
  images: { src: string; alt: string }[];
  startIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 inline-flex size-10 items-center justify-center border border-white/20 text-white hover:border-accent hover:text-accent"
        aria-label="Close"
      >
        <X size={18} />
      </button>

      {/* Counter */}
      <p className="absolute left-1/2 top-4 -translate-x-1/2 text-xs font-bold uppercase tracking-widest text-white/50">
        {index + 1} / {images.length}
      </p>

      {/* Image */}
      <div className="relative h-[75vh] w-full max-w-4xl">
        <Image
          key={images[index].src}
          src={images[index].src}
          alt={images[index].alt}
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Prev / Next */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex size-11 items-center justify-center border border-white/20 text-white hover:border-accent hover:text-accent sm:left-6"
        aria-label="Previous image"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex size-11 items-center justify-center border border-white/20 text-white hover:border-accent hover:text-accent sm:right-6"
        aria-label="Next image"
      >
        <ChevronRight size={20} />
      </button>

      {/* Caption */}
      <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm font-semibold text-white/70">
        {images[index].alt}
      </p>
    </div>
  );
}

// ── Building type gallery with lightbox ───────────────────────────────────────
function BuildingGallery({
  images,
}: {
  images: { src: string; alt: string }[];
}) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {images.map(({ src, alt }, i) => (
          <button
            key={src}
            onClick={() => setLightbox(i)}
            className="group relative aspect-[4/3] overflow-hidden bg-muted focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label={`View ${alt}`}
          >
            <Image
              src={src}
              alt={alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
          </button>
        ))}
      </div>
      {lightbox !== null && (
        <Lightbox
          images={images}
          startIndex={lightbox}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function LilyParkPage() {
  const [activeType, setActiveType] = useState(buildingTypes[0].id);
  const active = buildingTypes.find((t) => t.id === activeType)!;

  return (
    <SiteShell>
      <main>
        <PageHero
          eyebrow="Residential estate · All units for sale"
          title="Lily Park"
          description="An estate where wellness, peace and community come together — developed and constructed by NEGO Construction in Abijo GRA, Lagos."
        />

        {/* Hero image with parallax */}
        <div className="relative aspect-[16/7] w-full overflow-hidden">
          <ScrollScene intensity={12} className="absolute inset-0">
            <Image
              src="/lily-project-big-image.jpg"
              alt="Lily Park estate aerial view, Abijo GRA, Lagos"
              fill
              className="scale-110 object-cover"
              priority
            />
          </ScrollScene>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-6 left-6 bg-accent px-4 py-2">
            <p className="text-xs font-bold uppercase tracking-widest text-accent-foreground">
              All Units For Sale — Enquire Today
            </p>
          </div>
        </div>

        {/* About + Project facts */}
        <section className="container py-16 sm:py-24">
          <div className="grid gap-12 md:grid-cols-[1.2fr_.8fr] md:gap-20">
            <Reveal>
              <p className="eyebrow text-accent">About the project</p>
              <h2 className="mt-4 text-4xl font-black tracking-tighter sm:text-5xl">
                Reshaping estate life in Lagos.
              </h2>
              <p className="mt-6 leading-7 text-muted-foreground">
                Lily Park is an estate developed and constructed by NEGO
                Construction Limited in Abijo GRA. Using NEGO's years of
                expertise, we have created a living experience that reshapes the
                usual conventions of estate life in Lagos.
              </p>
              <p className="mt-4 leading-7 text-muted-foreground">
                The main goal isn't just living — it's wellness and a peaceful
                lifestyle that nurtures and allows for growth. Access is easy
                from the coastal road, with the estate less than 20 minutes from
                Victoria Island.
              </p>
              <p className="mt-4 leading-7 text-muted-foreground">
                Lily Park is a joint venture partnership with LSDPC, bringing
                together NEGO's construction expertise and a trusted public
                institution to deliver a lasting residential address.
              </p>
              <Link href="/contact" className="button-primary mt-8">
                Enquire about Lily Park <ArrowUpRight data-icon="inline-end" />
              </Link>
            </Reveal>

            <Reveal delay={100}>
              <div className="border-t-2 border-accent pt-6">
                <p className="eyebrow text-accent">Project facts</p>
                <dl className="mt-6 flex flex-col gap-5 text-sm">
                  {[
                    ["Type", "Residential estate development"],
                    ["Location", "Abijo GRA, Lagos, Nigeria"],
                    ["Access", "< 20 min from Victoria Island"],
                    ["Status", "All units for sale"],
                    ["Developer", "NEGO Construction Limited"],
                    ["Partnership", "Joint venture with LSDPC"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="grid grid-cols-2 gap-4 border-b border-border pb-4"
                    >
                      <dt className="text-muted-foreground">{label}</dt>
                      <dd className="font-bold">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Perks & Features */}
        <section className="bg-primary py-16 text-primary-foreground sm:py-24">
          <div className="container">
            <Reveal>
              <p className="eyebrow text-accent">Perks and features</p>
              <h2 className="mt-4 text-4xl font-black tracking-tighter sm:text-5xl">
                Everything you need, built in.
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {perks.map((perk, i) => (
                <Reveal key={perk} delay={i * 30}>
                  <div className="flex items-center gap-4 border border-primary-foreground/15 bg-primary-foreground/5 px-5 py-4 transition-colors duration-300 hover:border-accent/50 hover:bg-primary-foreground/10">
                    <Check size={15} className="shrink-0 text-accent" />
                    <span className="text-sm font-semibold">{perk}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Neighbourhood */}
        <section className="container py-16 sm:py-24">
          <div className="grid gap-12 md:grid-cols-2 md:gap-20">
            <Reveal>
              <p className="eyebrow text-accent">Neighbourhood attractions</p>
              <h2 className="mt-4 text-4xl font-black tracking-tighter sm:text-5xl">
                A great address in a great location.
              </h2>
              <p className="mt-5 leading-7 text-muted-foreground">
                Lily Park sits at the heart of one of Lagos' most rapidly
                growing residential corridors — surrounded by top-tier schools,
                retail and easy road access.
              </p>
            </Reveal>
            <Reveal delay={80}>
              <ul className="flex flex-col divide-y divide-border overflow-hidden border border-border">
                {neighbourhood.map(({ label, items }, i) => (
                  <li key={label} className="px-6 py-5">
                    <p className="font-bold">{label}</p>
                    {items && (
                      <ul className="mt-3 flex flex-col gap-1.5">
                        {items.map((item) => (
                          <li
                            key={item}
                            className="flex items-center gap-2 text-sm text-muted-foreground"
                          >
                            <span className="size-1.5 shrink-0 rounded-full bg-accent" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* Building Types */}
        <section className="bg-muted py-16 sm:py-24">
          <div className="container">
            <Reveal>
              <p className="eyebrow text-accent">Building types</p>
              <h2 className="mt-4 text-4xl font-black tracking-tighter sm:text-5xl">
                Find the home that fits your life.
              </h2>
              <p className="mt-5 max-w-2xl leading-7 text-muted-foreground">
                Four distinct unit types — each built to the same high standard,
                with different configurations to suit different needs. Click any
                image to view full-size.
              </p>
            </Reveal>

            {/* Tab switcher */}
            <div className="mt-10 flex flex-wrap gap-2">
              {buildingTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setActiveType(type.id)}
                  className={`border px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors duration-200 ${
                    activeType === type.id
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-border bg-background hover:border-accent hover:text-accent"
                  }`}
                >
                  {type.title}
                </button>
              ))}
            </div>

            {/* Active type content */}
            <Reveal key={activeType}>
              <div className="mt-8 border-l-4 border-accent pl-6">
                <h3 className="text-2xl font-black">{active.title}</h3>
                <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                  {active.description}
                </p>
              </div>
              <div className="mt-6">
                <BuildingGallery images={active.images} />
              </div>
            </Reveal>
          </div>
        </section>

        {/* Estate Gallery */}
        <section className="container py-16 sm:py-24">
          <Reveal>
            <p className="eyebrow text-accent">Estate gallery</p>
            <h2 className="mt-4 text-4xl font-black tracking-tighter">
              A closer look at Lily Park.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { src: "/lilly-1.jpg", alt: "Lily Park — view 01" },
              { src: "/lilly-2.jpg", alt: "Lily Park — view 02" },
              { src: "/lilly-3.jpg", alt: "Lily Park — view 03" },
            ].map(({ src, alt }, i) => (
              <Reveal key={src} delay={i * 80}>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </section>

      </main>
      <CtaBand />
    </SiteShell>
  );
}
