import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import {
  CtaBand,
  MediaSlot,
  PageHero,
  SectionHeading,
  SiteShell,
} from "@/components/site";
import { projects } from "@/lib/site-data";

export default function PortfolioPage() {
  return (
    <SiteShell>
      <main>
        <PageHero
          eyebrow="Portfolio"
          title="A body of work built around purpose."
          description="From roads and public infrastructure to commercial and residential developments, our portfolio reflects the breadth of work our team can deliver."
        />
        <section className="container py-20 md:py-28">
          <SectionHeading
            eyebrow="Selected case studies"
            title="The work speaks in detail."
            description="Each project is a partnership between clear intent, careful coordination and the people responsible for making it real."
          />
          <div className="flex flex-col gap-24">
            {projects.map((project, index) => (
              <article
                key={project.slug}
                className="grid gap-8 md:grid-cols-[1.3fr_.7fr] md:items-end"
              >
                <MediaSlot
                  label={`Portfolio image slot 0${index + 1} · ${project.name}`}
                  tall
                />
                <div>
                  <p className="eyebrow text-accent">
                    0{index + 1} · {project.status} · {project.type}
                  </p>
                  <h2 className="mt-4 text-3xl font-black">{project.name}</h2>
                  <p className="mt-4 leading-7 text-muted-foreground">
                    {project.detail}
                  </p>
                  <dl className="mt-6 grid gap-4 border-y border-border py-5 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-muted-foreground">Location</dt>
                      <dd className="mt-1 font-bold">{project.location}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Client</dt>
                      <dd className="mt-1 font-bold">{project.client}</dd>
                    </div>
                  </dl>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.1em] hover:text-accent"
                  >
                    Read project <ArrowUpRight />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <CtaBand />
    </SiteShell>
  );
}
