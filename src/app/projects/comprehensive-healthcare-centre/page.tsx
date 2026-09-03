import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Building2, Check, MapPin } from "lucide-react";
import { CtaBand, PageHero, Reveal, SiteShell } from "@/components/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comprehensive Healthcare Centre",
  description:
    "A comprehensive healthcare facility delivering essential medical services to the Onna community in Akwa-Ibom State.",
};

const highlights = [
  {
    icon: Building2,
    title: "Government healthcare",
    body: "Delivered for Akwa-Ibom State Government to serve the Onna LGA community.",
  },
  {
    icon: MapPin,
    title: "Community access",
    body: "Essential medical services infrastructure in Onna LGA, Akwa-Ibom.",
  },
  {
    icon: Check,
    title: "Coordinated delivery",
    body: "Managed all aspects from design implementation through final handover.",
  },
];

export default function ComprehensiveHealthcareCentrePage() {
  return (
    <SiteShell>
      <main>
        <PageHero
          eyebrow="Completed project"
          title="Comprehensive Healthcare Centre"
          description="A comprehensive healthcare facility delivering essential medical services to the Onna community in Akwa-Ibom State."
        />

        {/* Hero image */}
        <div className="relative aspect-[16/7] w-full overflow-hidden">
          <Image
            src="/comprehesive-healthcenter-1.jpeg"
            alt="Comprehensive Healthcare Centre, Onna LGA, Akwa-Ibom"
            fill
            className="object-cover"
            sizes="100vw"
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
                Healthcare infrastructure for a growing community.
              </h2>
              <p className="mt-6 leading-7 text-muted-foreground">
                This comprehensive healthcare centre in Onna LGA was delivered
                for the Akwa-Ibom State Government. The project required careful
                coordination of medical infrastructure standards, construction
                quality and timely delivery to ensure the facility could begin
                serving the community as planned.
              </p>
              <p className="mt-4 leading-7 text-muted-foreground">
                NEGO managed all aspects from design implementation through final
                handover, ensuring the project met government standards and
                community needs.
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
                    ["Type", "Healthcare facility"],
                    ["Location", "Onna LGA, Akwa-Ibom, Nigeria"],
                    ["Client", "Akwa-Ibom State Government"],
                    ["Status", "Completed"],
                    ["Scope", "Comprehensive healthcare centre"],
                    ["Delivery", "Design to handover management"],
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
                Essential services, quality delivery.
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
              The completed facility.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              {
                src: "/comprehesive-healthcenter-2.jpeg",
                alt: "Healthcare Centre — main building",
              },
              {
                src: "/comprehesive-healthcenter-3.jpeg",
                alt: "Healthcare Centre — exterior view",
              },
              {
                src: "/comprehesive-healthcenter-4.jpeg",
                alt: "Healthcare Centre — completed facility",
              },
            ].map(({ src, alt }, i) => (
              <Reveal key={src} delay={i * 80}>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
