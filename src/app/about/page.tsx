import { ArrowUpRight, Check, ShieldCheck } from "lucide-react";
import Link from "next/link";
import {
  CtaBand,
  MediaSlot,
  PageHero,
  SectionHeading,
  SiteShell,
} from "@/components/site";
import {
  company,
  qualityStandards,
  safetyCommitments,
  strengths,
  team,
} from "@/lib/site-data";

export default function AboutPage() {
  return (
    <SiteShell>
      <main>
        <PageHero
          eyebrow="About NEGO"
          title="The people, purpose and standards behind the work."
          description="NEGO Construction is an indigenous construction and engineering company specializing in infrastructure, residential and commercial developments across Nigeria."
        />
        <section className="container grid gap-12 py-20 md:grid-cols-[.9fr_1.1fr] md:gap-24 md:py-28">
          <div>
            <SectionHeading
              eyebrow="Who we are"
              title="Experience that makes complex work feel clear."
            />
          </div>
          <div className="flex flex-col gap-6 text-lg leading-8 text-muted-foreground">
            <p>{company.intro}</p>
            <p>{company.story}</p>
            <Link href="/contact" className="button-primary self-start">
              Work with NEGO <ArrowUpRight data-icon="inline-end" />
            </Link>
          </div>
        </section>
        <section className="bg-muted py-20 md:py-28">
          <div className="container">
            <SectionHeading
              eyebrow="Our strengths"
              title="A practical advantage on every project."
              description="Our experience is not only measured by what we build, but by how we work with clients, communities, partners and teams."
            />
            <div className="grid gap-4 md:grid-cols-3">
              {strengths.map((strength, index) => (
                <article
                  key={strength}
                  className="flex min-h-52 flex-col justify-between border border-border bg-background p-7"
                >
                  <span className="font-display text-4xl font-bold text-accent">
                    0{index + 1}
                  </span>
                  <p className="mt-8 text-sm leading-6 text-muted-foreground">
                    {strength}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="bg-primary py-20 text-primary-foreground md:py-28">
          <div className="container grid gap-5 md:grid-cols-[.8fr_1.2fr]">
            <article className="border border-primary-foreground/15 p-8 md:p-12">
              <p className="eyebrow text-accent">Our vision</p>
              <p className="mt-7 text-2xl font-bold leading-9">
                {company.vision}
              </p>
            </article>
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
          </div>
        </section>
        <section className="container py-20 md:py-28">
          <SectionHeading
            eyebrow="Quality and safety"
            title="Standards that protect the result."
            description="We are dedicated to ensuring that all our activities are carried out to the highest standards possible, with quality and safety built into the way we plan and deliver."
          />
          <div className="grid gap-6 md:grid-cols-2">
            <article className="border border-border p-8 md:p-10">
              <div className="flex items-center gap-3">
                <Check className="text-accent" />
                <h2 className="text-3xl font-bold">Quality</h2>
              </div>
              <p className="mt-5 leading-7 text-muted-foreground">
                Our quality management system is reviewed and revised
                continually to achieve the aims outlined.
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
            <article className="border border-border p-8 md:p-10">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-accent" />
                <h2 className="text-3xl font-bold">Safety</h2>
              </div>
              <p className="mt-5 leading-7 text-muted-foreground">
                Our aim is to eliminate or minimize risks to employees and third
                parties who may be exposed to occupational risks associated with
                our activities.
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
          </div>
        </section>
        <section className="container py-20 md:py-28">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Our personnel"
              title="People who know how to move a project forward."
              description="Our management team brings together civil engineering, architecture, quantity surveying, mechanical engineering and site delivery experience."
            />
            <Link href="/team" className="button-outline mb-10 shrink-0">
              Meet the full team <ArrowUpRight data-icon="inline-end" />
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {team.slice(0, 3).map((member) => (
              <article
                key={member.name}
                className="border-t-2 border-primary pt-5"
              >
                <MediaSlot label={`Portrait slot · ${member.name}`} />
                <p className="eyebrow mt-6 text-accent">{member.role}</p>
                <h3 className="mt-2 text-xl font-bold">{member.name}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {member.bio}
                </p>
              </article>
            ))}
          </div>
        </section>
        <section className="container grid gap-10 pb-20 md:grid-cols-2 md:pb-28">
          <MediaSlot
            label="Responsible delivery image slot · supplied image pending"
            tall
          />
          <div className="flex flex-col justify-center">
            <p className="eyebrow text-accent">Responsible delivery</p>
            <h2 className="mt-4 text-4xl font-black tracking-tighter">
              We build for the people who use what we make.
            </h2>
            <p className="mt-6 leading-7 text-muted-foreground">
              Beyond the site boundary, we are committed to social
              responsibility, suitable training, employment and growth
              opportunities for Nigerians at all levels.
            </p>
          </div>
        </section>
      </main>
      <CtaBand />
    </SiteShell>
  );
}
