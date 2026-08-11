import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { CtaBand, PageHero, Reveal, SiteShell } from "@/components/site";
import { team } from "@/lib/site-data";

export default function TeamPage() {
  return (
    <SiteShell>
      <main>
        <PageHero
          eyebrow="Our team"
          title="People who know how to move a project forward."
          description="Our management and delivery team brings together engineering, architecture, quantity surveying, project management and site experience built over 25 years."
        />

        <section className="container py-20 md:py-28">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {team.map((member, index) => (
              <Reveal key={member.name} delay={index * 70}>
                <article className="flex flex-col border-t-2 border-accent bg-background p-7">
                  <p className="eyebrow text-accent">{member.role}</p>
                  <h2 className="mt-3 text-xl font-black">{member.name}</h2>
                  {member.credentials ? (
                    <p className="mt-1 text-xs font-semibold text-muted-foreground">
                      {member.credentials}
                    </p>
                  ) : null}
                  <p className="mt-5 text-sm leading-7 text-muted-foreground">
                    {member.bio}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="bg-muted py-20 md:py-28">
          <div className="container flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <Reveal>
              <div>
                <p className="eyebrow text-accent">Work with us</p>
                <h2 className="mt-4 max-w-2xl text-4xl font-black tracking-tighter">
                  Good work starts with good people.
                </h2>
                <p className="mt-5 max-w-lg leading-7 text-muted-foreground">
                  We are always looking to partner with clients and professionals
                  who share our commitment to quality, integrity and lasting value.
                </p>
              </div>
            </Reveal>
            <Link href="/contact" className="button-primary shrink-0">
              Talk to our team <ArrowUpRight data-icon="inline-end" />
            </Link>
          </div>
        </section>
      </main>
      <CtaBand />
    </SiteShell>
  );
}
