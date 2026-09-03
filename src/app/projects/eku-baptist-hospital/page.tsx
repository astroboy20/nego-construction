import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, Heart, MapPin } from "lucide-react";
import { CtaBand, PageHero, Reveal, SiteShell } from "@/components/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eku Baptist Hospital",
  description:
    "A modern healthcare facility built to serve the Eku community with quality medical infrastructure in Delta State.",
};

const highlights = [
  {
    icon: Heart,
    title: "Healthcare infrastructure",
    body: "Purpose-built medical facility designed for functionality, accessibility and patient care.",
  },
  {
    icon: MapPin,
    title: "Community healthcare",
    body: "Serving the medical needs of Eku, Delta State with reliable infrastructure.",
  },
  {
    icon: Check,
    title: "Quality construction",
    body: "End-to-end construction services with attention to durability and safety standards.",
  },
];

export default function EkuBaptistHospitalPage() {
  return (
    <SiteShell>
      <main>
        <PageHero
          eyebrow="Completed project"
          title="Eku Baptist Hospital"
          description="A modern healthcare facility built to serve the community with quality medical infrastructure in Eku, Delta State."
        />

        {/* Hero image */}
        <div className="relative aspect-[16/7] w-full overflow-hidden">
          <Image
            src="/eku-bamptist-hospital-1.jpeg"
            alt="Eku Baptist Hospital, Delta State"
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
                Healthcare infrastructure built for the community.
              </h2>
              <p className="mt-6 leading-7 text-muted-foreground">
                The Eku Baptist Hospital project showcases NEGO Construction's
                capability in delivering healthcare infrastructure. Working with
                Deux Project, we provided end-to-end construction services to
                create a facility designed to meet the medical needs of the Eku
                community.
              </p>
              <p className="mt-4 leading-7 text-muted-foreground">
                The project required careful attention to functionality,
                durability and accessibility — ensuring the facility could serve
                patients and medical staff effectively from day one.
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
                    ["Location", "Eku, Delta State, Nigeria"],
                    ["Client", "Deux Project"],
                    ["Status", "Completed"],
                    ["Scope", "Medical infrastructure construction"],
                    ["Focus", "Functionality, durability, accessibility"],
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
                Medical infrastructure that serves.
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
                src: "/eku-bamptist-hospital-2.jpeg",
                alt: "Eku Baptist Hospital — facility view",
              },
              {
                src: "/eku-bamptist-hospital-3.jpeg",
                alt: "Eku Baptist Hospital — exterior",
              },
              {
                src: "/eku-bamptist-hospital-4.jpeg",
                alt: "Eku Baptist Hospital — approach",
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
