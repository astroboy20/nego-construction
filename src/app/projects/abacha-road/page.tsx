import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, MapPin, Users } from "lucide-react";
import { CtaBand, PageHero, Reveal, SiteShell } from "@/components/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Abacha Road",
  description:
    "Design and construction of Abacha Road with drains and kerbs — reliable infrastructure connecting communities in Rivers State.",
};

const highlights = [
  {
    icon: Check,
    title: "Complete road infrastructure",
    body: "Full design and construction including drainage systems and kerbing for long-term durability.",
  },
  {
    icon: MapPin,
    title: "Community-focused delivery",
    body: "Coordinated civil works in an active environment while maintaining access and safety.",
  },
  {
    icon: Users,
    title: "Government partnership",
    body: "Delivered in collaboration with Deux Project and Rivers State Government.",
  },
];

export default function AbachaRoadPage() {
  return (
    <SiteShell>
      <main>
        <PageHero
          eyebrow="Completed project"
          title="Abacha Road"
          description="Design and construction of Abacha Road with comprehensive drainage and kerbing — connecting communities in Rivers State."
        />

        {/* Hero image */}
        <div className="relative aspect-[16/7] w-full overflow-hidden">
          <Image
            src="/abacha-1.jpeg"
            alt="Abacha Road construction, Rivers State"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        {/* About section */}
        <section className="container py-16 sm:py-24">
          <div className="grid gap-12 md:grid-cols-[1.2fr_.8fr] md:gap-20">
            <Reveal>
              <p className="eyebrow text-accent">About the project</p>
              <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
                Reliable infrastructure connecting communities.
              </h2>
              <p className="mt-6 leading-7 text-muted-foreground">
                The Abacha Road project involved the complete design and
                construction of the road including drainage systems and kerbing.
                Delivered in partnership with Deux Project and the Rivers State
                Government, this project demonstrates NEGO's ability to
                coordinate civil works in an active community environment.
              </p>
              <p className="mt-4 leading-7 text-muted-foreground">
                The project required keeping quality, access and delivery
                requirements in view while managing the needs of residents and
                businesses operating along the route during construction.
              </p>
              <Link href="/contact" className="button-dark mt-8">
                Discuss your project <ArrowUpRight data-icon="inline-end" />
              </Link>
            </Reveal>

            {/* Project facts */}
            <Reveal delay={100}>
              <div className="border-t-2 border-accent pt-6">
                <p className="eyebrow text-accent">Project facts</p>
                <dl className="mt-6 flex flex-col gap-5 text-sm">
                  {[
                    ["Type", "Road construction"],
                    ["Location", "Rivers State, Nigeria"],
                    ["Client", "Deux Project / Rivers State Government"],
                    ["Status", "Completed"],
                    ["Scope", "Design, construction, drainage, kerbing"],
                    ["Delivery", "Civil works in active environment"],
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

        {/* Highlights */}
        <section className="bg-muted py-16 sm:py-24">
          <div className="container">
            <Reveal>
              <p className="eyebrow text-accent">What we delivered</p>
              <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
                Infrastructure built to last.
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {highlights.map(({ icon: Icon, title, body }, i) => (
                <Reveal key={title} delay={i * 80}>
                  <article className="flex flex-col gap-4 border border-border bg-background p-7">
                    <Icon className="text-accent" />
                    <h3 className="text-lg font-bold">{title}</h3>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {body}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section className="container py-16 sm:py-24">
          <Reveal>
            <p className="eyebrow text-accent">Gallery</p>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.05em]">
              Project progress.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { src: "/abacha-2.jpeg", alt: "Abacha Road — phase 02" },
              { src: "/abacha-3.jpeg", alt: "Abacha Road — phase 03" },
              { src: "/abacha-4.jpg", alt: "Abacha Road — completed" },
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
