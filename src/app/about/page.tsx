import { ArrowUpRight, Check, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  CtaBand,
  PageHero,
  Reveal,
  SectionHeading,
  SiteShell,
} from "@/components/site";
import {
  company,
  qualityStandards,
  safetyCommitments,
  strengths,
} from "@/lib/site-data";

export default function AboutPage() {
  return (
    <SiteShell>
      <main>
        <PageHero
          eyebrow="About NEGO"
          title="The people, purpose and standards behind the work."
          description="NEGO Construction is an indigenous construction and engineering company — trusted for over 25 years to deliver infrastructure, residential and commercial projects across Nigeria."
        />

        {/* Who we are */}
        <section className="container grid gap-12 py-20 md:grid-cols-[.9fr_1.1fr] md:gap-24 md:py-28">
          <Reveal>
            <SectionHeading
              eyebrow="Who we are"
              title="Experience that makes complex work feel clear."
            />
          </Reveal>
          <Reveal delay={80}>
            <div className="flex flex-col gap-6 text-lg leading-8 text-muted-foreground">
              <p>{company.intro}</p>
              <p>{company.story}</p>
              <Link href="/contact" className="button-primary self-start">
                Work with NEGO <ArrowUpRight data-icon="inline-end" />
              </Link>
            </div>
          </Reveal>
        </section>

        {/* Strengths */}
        <section className="bg-muted py-20 md:py-28">
          <div className="container">
            <Reveal>
              <SectionHeading
                eyebrow="Our strengths"
                title="A practical advantage on every project."
                description="Our experience is not only measured by what we build, but by how we work with clients, communities, partners and teams."
              />
            </Reveal>
            <div className="grid gap-4 md:grid-cols-3">
              {strengths.map((strength, index) => (
                <Reveal key={strength} delay={index * 70}>
                  <article className="flex min-h-52 flex-col justify-between border border-border bg-background p-7">
                    <span className="font-display text-4xl font-bold text-accent">
                      0{index + 1}
                    </span>
                    <p className="mt-8 text-sm leading-6 text-muted-foreground">
                      {strength}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="bg-primary py-20 text-primary-foreground md:py-28">
          <div className="container grid gap-5 md:grid-cols-[.8fr_1.2fr]">
            <Reveal>
              <article className="border border-primary-foreground/15 p-8 md:p-12">
                <p className="eyebrow text-accent">Our vision</p>
                <p className="mt-7 text-2xl font-bold leading-9">
                  {company.vision}
                </p>
              </article>
            </Reveal>
            <Reveal delay={80}>
              <article className="border border-primary-foreground/15 p-8 md:p-12">
                <p className="eyebrow text-accent">Our mission</p>
                <div className="mt-7 flex flex-col gap-6">
                  {company.mission.map((item, index) => (
                    <p
                      key={item}
                      className="flex gap-4 text-base leading-7 text-primary-foreground/75"
                    >
                      <span className="font-display font-bold text-accent">
                        0{index + 1}
                      </span>
                      {item}
                    </p>
                  ))}
                </div>
              </article>
            </Reveal>
          </div>
        </section>

        {/* Quality & Safety */}
        <section className="container py-20 md:py-28">
          <Reveal>
            <SectionHeading
              eyebrow="Quality and safety"
              title="Standards that protect the result."
              description="We are dedicated to ensuring all our activities are carried out to the highest standards, with quality and safety built into the way we plan and deliver every project."
            />
          </Reveal>
          <div className="grid gap-6 md:grid-cols-2">
            <Reveal>
              <article className="border border-border p-8 md:p-10">
                <div className="flex items-center gap-3">
                  <Check className="text-accent" />
                  <h2 className="text-3xl font-bold">Quality</h2>
                </div>
                <p className="mt-5 leading-7 text-muted-foreground">
                  Our quality management system is reviewed and revised
                  continually to ensure every project we deliver meets
                  the standards our clients and communities deserve.
                </p>
                <ol className="mt-7 flex flex-col gap-4">
                  {qualityStandards.map((item, index) => (
                    <li key={item} className="flex gap-4 text-sm leading-6">
                      <span className="font-display font-bold text-accent">
                        {index + 1}.
                      </span>
                      {item}
                    </li>
                  ))}
                </ol>
              </article>
            </Reveal>
            <Reveal delay={80}>
              <article className="border border-border p-8 md:p-10">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="text-accent" />
                  <h2 className="text-3xl font-bold">Safety</h2>
                </div>
                <p className="mt-5 leading-7 text-muted-foreground">
                  NEGO always has the highest concern for safety. This is
                  evidenced by securing some of the best safety records in
                  our operations.
                </p>
                <ol className="mt-7 flex flex-col gap-4">
                  {safetyCommitments.map((item, index) => (
                    <li key={item} className="flex gap-4 text-sm leading-6">
                      <span className="font-display font-bold text-accent">
                        {index + 1}.
                      </span>
                      {item}
                    </li>
                  ))}
                </ol>
              </article>
            </Reveal>
          </div>
        </section>

        {/* Social responsibility */}
        <section className="container grid items-center gap-10 py-20 md:grid-cols-2 md:gap-16 md:py-28">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden border border-border bg-muted">
              <Image
                src="/abacha-1.jpeg"
                alt="NEGO Construction — responsible delivery"
                fill
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={80}>
            <p className="eyebrow text-accent">Responsible delivery</p>
            <h2 className="mt-4 text-4xl font-black tracking-tighter sm:text-5xl">
              We build for the people who use what we make.
            </h2>
            <p className="mt-6 leading-7 text-muted-foreground">
              {company.social}
            </p>
            <Link href="/projects" className="button-primary mt-8">
              See our work <ArrowUpRight data-icon="inline-end" />
            </Link>
          </Reveal>
        </section>
      </main>
      <CtaBand />
    </SiteShell>
  );
}
