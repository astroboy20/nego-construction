import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {team.map((member, index) => (
              <Reveal key={member.name} delay={index * 70}>
                <article className="group flex h-full flex-col overflow-hidden border border-border bg-background">
                  {/* Photo or placeholder */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {member.photo ? (
                      <Image
                        src={member.photo}
                        alt={member.name}
                        fill
                        className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-3 bg-primary/5">
                        <div className="flex size-16 items-center justify-center bg-primary text-2xl font-black text-primary-foreground">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                          Photo coming soon
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Info — flex-1 so all cards stretch to same height */}
                  <div className="flex flex-1 flex-col gap-3 border-t-2 border-accent p-6">
                    <p className="eyebrow text-accent">{member.role}</p>
                    <h2 className="text-xl font-black">{member.name}</h2>
                    {member.credentials ? (
                      <p className="text-xs font-semibold text-muted-foreground">
                        {member.credentials}
                      </p>
                    ) : null}
                    <p className="mt-1 text-sm leading-7 text-muted-foreground">
                      {member.bio}
                    </p>
                  </div>
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
