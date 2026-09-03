import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Building2, Check, MapPin } from "lucide-react";
import { CtaBand, PageHero, Reveal, SiteShell } from "@/components/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alpha Court",
  description:
    "Construction of 72 luxury flats — modern residential living at Forthright Estate, Magboro, Ogun State.",
};

const highlights = [
  {
    icon: Building2,
    title: "72 luxury flats",
    body: "Large-scale residential construction delivering modern housing solutions in Ogun State.",
  },
  {
    icon: MapPin,
    title: "Prime location",
    body: "Forthright Estate, Punch Place, Magboro — accessible residential development.",
  },
  {
    icon: Check,
    title: "Quality residential build",
    body: "Multi-unit construction managed to high standards with timely delivery.",
  },
];

export default function AlphaCourtPage() {
  return (
    <SiteShell>
      <main>
        <PageHero
          eyebrow="Completed project"
          title="Alpha Court"
          description="Construction of 72 luxury flats — modern residential living at Forthright Estate, Magboro, Ogun State."
        />

        {/* Hero image */}
        <div className="relative aspect-[16/7] w-full overflow-hidden">
          <Image
            src="/alpha-court-1.jpg"
            alt="Alpha Court, Forthright Estate, Magboro"
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
                Modern residential living at scale.
              </h2>
              <p className="mt-6 leading-7 text-muted-foreground">
                Alpha Court represents NEGO Construction's expertise in
                large-scale residential development. Working with Green Earth
                Property Development, we delivered 72 luxury flats at Forthright
                Estate in Magboro, Ogun State.
              </p>
              <p className="mt-4 leading-7 text-muted-foreground">
                The project showcases our ability to manage complex residential
                construction while maintaining quality standards and meeting
                delivery timelines for multi-unit housing developments. Every
                flat was built with attention to modern living requirements and
                long-term durability.
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
                    ["Type", "Residential development"],
                    ["Location", "Forthright Estate, Magboro, Ogun"],
                    ["Client", "Green Earth Property Development"],
                    ["Status", "Completed"],
                    ["Units", "72 luxury flats"],
                    ["Scope", "Multi-unit residential construction"],
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
                Quality housing at scale.
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
              The completed development.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              {
                src: "/alpha-court-2.jpg",
                alt: "Alpha Court — residential building",
              },
              {
                src: "/alpha-court-3.jpg",
                alt: "Alpha Court — exterior view",
              },
              {
                src: "/alpha-court-4.jpeg",
                alt: "Alpha Court — completed flats",
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
