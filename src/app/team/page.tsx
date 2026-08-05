import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { CtaBand, MediaSlot, PageHero, SiteShell } from "@/components/site";
import { team } from "@/lib/site-data";

export default function TeamPage() {
  return (
    <SiteShell>
      <main>
        <PageHero
          eyebrow="Our personnel"
          title="People who know how to move a project forward."
          description="Our management and delivery team brings together engineering, architecture, quantity surveying, project management and site experience."
        />
        <section className="container py-20 md:py-28">
          <div className="grid gap-8 md:grid-cols-2">
            {team.map((member, index) => (
              <article
                key={member.name}
                className="grid gap-6 border-t-2 border-primary pt-6 sm:grid-cols-[9rem_1fr]"
              >
                <MediaSlot label={`Portrait slot · ${member.name}`} />
                <div>
                  <p className="eyebrow text-accent">{member.role}</p>
                  <h2 className="mt-3 text-2xl font-black">{member.name}</h2>
                  <p className="mt-2 text-sm font-semibold text-muted-foreground">
                    {member.credentials}
                  </p>
                  <p className="mt-5 text-sm leading-7 text-muted-foreground">
                    {member.bio}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="bg-muted py-20 md:py-28">
          <div className="container flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="eyebrow text-accent">Join the conversation</p>
              <h2 className="mt-4 max-w-2xl text-4xl font-black tracking-tighter">
                Good work starts with good people.
              </h2>
            </div>
            <Link href="/contact" className="button-primary">
              Talk to our team <ArrowUpRight data-icon="inline-end" />
            </Link>
          </div>
        </section>
      </main>
      <CtaBand />
    </SiteShell>
  );
}
