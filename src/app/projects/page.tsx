"use client";
import { useState } from "react";
import { ArrowUpRight, Filter } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  CtaBand,
  MediaSlot,
  PageHero,
  Reveal,
  SectionHeading,
  SiteShell,
} from "@/components/site";
import { projects, allProjects } from "@/lib/site-data";

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
                <div className="relative aspect-4/3 overflow-hidden border border-border bg-muted">
                  <Image
                    src={
                      project.slug === 'lily-park'
                        ? '/lily-project-big-image.jpg'
                        : project.slug === 'alpha-court'
                        ? '/alpha-court-1.jpg'
                        : project.slug === 'imo-hills-farm'
                        ? '/imo-hills-1.jpeg'
                        : project.slug === 'abacha-road'
                        ? '/abacha-1.jpeg'
                        : project.slug === 'eku-baptist-hospital'
                        ? '/eku-bamptist-hospital-1.jpeg'
                        : '/comprehesive-healthcenter-1.jpeg'
                    }
                    alt={project.name}
                    fill
                    className="object-cover"
                  />
                </div>
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

        {/* Complete portfolio section */}
        <section className="border-t border-border bg-muted py-16 sm:py-24">
          <div className="container">
            <Reveal>
              <p className="eyebrow text-accent">Complete portfolio</p>
              <h2 className="mt-4 text-4xl font-black tracking-tighter sm:text-5xl">
                26 projects delivered across Nigeria.
              </h2>
              <p className="mt-5 max-w-2xl leading-7 text-muted-foreground">
                Over 25 years, NEGO has delivered infrastructure, healthcare,
                educational, commercial, residential, and agricultural projects
                for government agencies, private clients, and development
                partners across Nigeria.
              </p>
            </Reveal>

            <div className="mt-12 overflow-hidden border border-border bg-background">
              {allProjects.map((project, index) => (
                <div
                  key={`${project.name}-${index}`}
                  className="grid grid-cols-[auto_1fr_1fr] gap-6 border-b border-border px-6 py-5 last:border-b-0 sm:px-8 sm:py-6"
                >
                  <span className="text-xs font-bold uppercase tracking-widest text-accent">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-bold leading-snug">
                      {project.name}
                    </h3>
                    <p className="mt-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      {project.type}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {project.client}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <CtaBand />
    </SiteShell>
  );
}
