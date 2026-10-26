"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, Leaf, MapPin } from "lucide-react";
import { CtaBand, PageHero, Reveal, SiteShell } from "@/components/site";

const highlights = [
  {
    icon: Leaf,
    title: "Agricultural infrastructure",
    body: "Specialized construction designed to support modern farming operations.",
  },
  {
    icon: MapPin,
    title: "Osun State facility",
    body: "Located in Ilesha, Osun State — purpose-built for agricultural use.",
  },
  {
    icon: Check,
    title: "Specialized delivery",
    body: "Construction coordinated to meet unique requirements of farming operations.",
  },
];

export default function ImoHillsFarmClient() {
  return (
    <SiteShell>
      <main>
        <PageHero
          eyebrow="Completed project"
          title="Imo Hills Farm Project"
          description="Agricultural facility construction supporting farming operations in Ilesha, Osun State."
        />

        {/* Hero image */}
        <div className="relative aspect-16/7 w-full overflow-hidden">
          <Image
            src="/imo-hills-1.jpeg"
            alt="Imo Hills Farm Project, Ilesha, Osun State"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
        </div>

        {/* About section */}
        <section className="container py-16 sm:py-24">
          <div className="grid gap-12 md:grid-cols-[1.2fr_.8fr] md:gap-20">
            <Reveal>
              <p className="eyebrow text-accent">About the project</p>
              <h2 className="mt-4 text-4xl font-black tracking-tighter sm:text-5xl">
                Infrastructure supporting agricultural growth.
              </h2>
              <p className="mt-6 leading-7 text-muted-foreground">
                The Imo Hills Farm Project in Ilesha, Osun State demonstrates
                NEGO's versatility beyond traditional infrastructure. Delivered
                for Imo Hills Farm Ltd., this project required specialized
                construction considerations for agricultural operations.
              </p>
              <p className="mt-4 leading-7 text-muted-foreground">
                NEGO coordinated all aspects of the build to ensure the facility
                met the unique requirements of modern farming operations while
                maintaining durability and functionality. The project showcases
                our ability to adapt construction expertise to diverse sectors.
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
                    ["Type", "Agricultural facility"],
                    ["Location", "Ilesha, Osun State, Nigeria"],
                    ["Client", "Imo Hills Farm Ltd."],
                    ["Status", "Completed"],
                    ["Scope", "Farm infrastructure construction"],
                    ["Focus", "Specialized agricultural facilities"],
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
              <h2 className="mt-4 text-4xl font-black tracking-tighter sm:text-5xl">
                Purpose-built agricultural infrastructure.
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
            <h2 className="mt-4 text-4xl font-black tracking-tighter">
              The completed facility.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              {
                src: "/imo-hills-2.jpeg",
                alt: "Imo Hills Farm — facility view",
              },
              {
                src: "/imo-hills-3.jpeg",
                alt: "Imo Hills Farm — infrastructure",
              },
              {
                src: "/imo-hills-4.jpeg",
                alt: "Imo Hills Farm — completed project",
              },
            ].map(({ src, alt }, i) => (
              <Reveal key={src} delay={i * 80}>
                <div className="relative aspect-4/3 overflow-hidden">
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
