"use client";
import { useState } from "react";
import { ArrowUpRight, Filter } from "lucide-react";
import Link from "next/link";
import {
  CtaBand,
  MediaSlot,
  PageHero,
  SectionHeading,
  SiteShell,
} from "@/components/site";
import { projects } from "@/lib/site-data";

export default function ProjectsPage() {
  const [filter, setFilter] = useState("All");
  const types = [
    "All",
    ...Array.from(new Set(projects.map((project) => project.type))),
  ];
  const shown =
    filter === "All"
      ? projects
      : projects.filter((project) => project.type === filter);
  return (
    <SiteShell>
      <main>
        <PageHero
          eyebrow="Our work"
          title="Proof in the places we have built."
          description="With years of expertise, we deliver high-quality, innovative and cost-effective solutions for our clients. Our dedication to excellence and sustainability helps create lasting value in the built environment."
        />
        <section className="container py-20 md:py-28">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Selected projects"
              title="Infrastructure, spaces and places that serve a purpose."
              description="Explore a selection of completed and ongoing work across roads, commercial construction and residential development."
            />
            <div
              className="flex flex-wrap items-center gap-2"
              aria-label="Filter projects"
            >
              <Filter className="mr-2 text-accent" />
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`border px-3 py-2 text-xs font-bold uppercase tracking-widest ${
                    filter === type
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:border-primary"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-20">
            {shown.map((project, index) => (
              <article
                key={project.slug}
                className="grid gap-8 md:grid-cols-[1.35fr_.65fr] md:items-center"
              >
                <MediaSlot
                  label={`${project.name} project image slot · supplied image pending`}
                  tall={index % 2 === 0}
                />
                <div className="flex flex-col gap-5">
                  <p className="eyebrow text-accent">
                    {project.status} · {project.type}
                  </p>
                  <h2 className="text-4xl font-black tracking-tighter">
                    {project.name}
                  </h2>
                  <div className="grid gap-4 border-y border-border py-5 text-sm sm:grid-cols-3 md:grid-cols-1">
                    <p>
                      <span className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Location
                      </span>
                      {project.location}
                    </p>
                    <p>
                      <span className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Client
                      </span>
                      {project.client}
                    </p>
                    <p>
                      <span className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Scope
                      </span>
                      {project.scope.join(" · ")}
                    </p>
                  </div>
                  <p className="leading-7 text-muted-foreground">
                    {project.detail}
                  </p>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="button-outline self-start"
                  >
                    View case study <ArrowUpRight data-icon="inline-end" />
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
