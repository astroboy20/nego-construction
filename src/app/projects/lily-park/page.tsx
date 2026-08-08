import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, MapPin, Users } from "lucide-react";
import { CtaBand, PageHero, Reveal, SiteShell } from "@/components/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lily Park",
  description:
    "An estate developed and constructed by NEGO Construction in Abijo GRA — where wellness, peace and community come together less than 20 minutes from Victoria Island.",
};

const highlights = [
  {
    icon: Check,
    title: "Wellness by design",
    body: "The main goal isn't just living — it's a peaceful lifestyle that nurtures and allows for growth.",
  },
  {
    icon: MapPin,
    title: "Prime location",
    body: "Abijo GRA, less than 20 minutes from Victoria Island via the coastal road.",
  },
  {
    icon: Users,
    title: "Joint venture",
    body: "A partnership between NEGO Construction Limited and LSDPC, combining expertise and public trust.",
  },
];

export default function LilyParkPage() {
  return (
    <SiteShell>
      <main>
        <PageHero
          eyebrow="Featured project · Ongoing"
          title="Lily Park"
          description="An estate where wellness, peace and community come together — developed and constructed by NEGO Construction in Abijo GRA, Lagos."
        />

        {/* Hero image */}
        <div className="relative aspect-16/7 w-full overflow-hidden">
          <Image
            src="/lily-project-big-image.jpg"
            alt="Lily Park estate aerial view, Abijo GRA, Lagos"
            fill
            className="object-cover"
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
                Reshaping estate life in Lagos.
              </h2>
              <p className="mt-6 leading-7 text-muted-foreground">
                Lily Park is an estate project developed and constructed by NEGO
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
              <Link href="/contact" className="button-dark mt-8">
                Enquire about Lily Park <ArrowUpRight data-icon="inline-end" />
              </Link>
            </Reveal>

            {/* Project facts */}
            <Reveal delay={100}>
              <div className="border-t-2 border-accent pt-6">
                <p className="eyebrow text-accent">Project facts</p>
                <dl className="mt-6 flex flex-col gap-5 text-sm">
                  {[
                    ["Type", "Residential estate development"],
                    ["Location", "Abijo GRA, Lagos, Nigeria"],
                    ["Access", "< 20 minutes from Victoria Island"],
                    ["Status", "Ongoing"],
                    ["Developer", "NEGO Construction Limited"],
                    ["Partnership", "Joint venture with LSDPC"],
                    ["Client", "Private & public development"],
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
              <p className="eyebrow text-accent">What sets it apart</p>
              <h2 className="mt-4 text-4xl font-black tracking-tighter sm:text-5xl">
                Built around how people want to live.
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
              A closer look.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { src: "/lilly-1.jpg", alt: "Lily Park — view 01" },
              { src: "/lilly-2.jpg", alt: "Lily Park — view 02" },
              { src: "/lilly-3.jpg", alt: "Lily Park — view 03" },
            ].map(({ src, alt }, i) => (
              <Reveal key={src} delay={i * 80}>
                <div className="relative aspect-4/3 overflow-hidden">
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
