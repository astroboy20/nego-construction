"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  AtSign,
  Check,
  ChevronRight,
  Globe,
  Mail,
  Menu,
  Play,
  X,
} from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { projects, services, testimonials } from "@/lib/site-data";

export function Logo() {
  return (
    <Link
      href="/"
      className="font-mono text-lg font-bold tracking-[0.2em] text-primary"
    >
      NEGO<span className="text-accent">.</span>
    </Link>
  );
}

const navLinks = [
  ["About", "/about"],
  ["Services", "/services"],
  ["Projects", "/projects"],
  ["Portfolio", "/portfolio"],
  ["Team", "/team"],
  ["Contact", "/contact"],
] as const;

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.01 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`reveal ${
        visible ? "reveal-visible" : "reveal-pending"
      } ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

export function ScrollScene({
  children,
  className = "",
  intensity = 18,
}: {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const centerOffset =
        (window.innerHeight / 2 - (rect.top + rect.height / 2)) /
        window.innerHeight;
      const bounded = Math.max(-1, Math.min(1, centerOffset));
      const strength =
        window.innerWidth < 768 ? Math.min(intensity, 8) : intensity;
      node.style.setProperty("--scene-y", `${bounded * strength}px`);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [intensity]);
  return (
    <div
      ref={ref}
      className={`scroll-scene ${className}`}
      style={{ "--scene-intensity": `${intensity}px` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      node.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);
  return <div ref={ref} className="scroll-progress" aria-hidden="true" />;
}

export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between sm:h-20">
        <Logo />
        <nav
          className="hidden items-center gap-7 md:flex"
          aria-label="Main navigation"
        >
          {navLinks.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={`text-xs font-bold uppercase tracking-[0.12em] transition-colors hover:text-accent ${
                path === href ? "text-accent" : "text-foreground"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <Drawer open={open} onOpenChange={setOpen} swipeDirection="right">
          <DrawerTrigger
            render={
              <button
                className="inline-flex size-11 items-center justify-center border border-border md:hidden"
                aria-label="Open navigation menu"
              />
            }
          >
            <Menu aria-hidden="true" />
          </DrawerTrigger>
          <DrawerContent className="w-[min(88vw,22rem)] bg-primary text-primary-foreground">
            <DrawerHeader className="border-b border-primary-foreground/15 p-6 text-left">
              <DrawerTitle className="font-display text-2xl text-primary-foreground">
                NEGO<span className="text-accent">.</span>
              </DrawerTitle>
              <DrawerDescription className="text-left text-primary-foreground/60">
                Construction and engineering, delivered with clarity.
              </DrawerDescription>
            </DrawerHeader>
            <nav
              className="flex flex-1 flex-col gap-1 overflow-y-auto p-6"
              aria-label="Mobile navigation"
            >
              {navLinks.map(([label, href], index) => (
                <DrawerClose
                  key={href}
                  render={<Link href={href} />}
                  className={`flex min-h-12 items-center justify-between border-b border-primary-foreground/10 text-left text-sm font-bold uppercase tracking-[0.12em] transition-colors hover:text-accent ${
                    path === href ? "text-accent" : "text-primary-foreground"
                  }`}
                >
                  <span>{label}</span>
                  <span className="font-mono text-xs text-primary-foreground/40">
                    0{index + 1}
                  </span>
                </DrawerClose>
              ))}
            </nav>
            <DrawerFooter className="border-t border-primary-foreground/15 p-6">
              <DrawerClose
                render={<Link href="/contact" />}
                className="button-primary w-full"
              >
                Start a conversation <ArrowUpRight data-icon="inline-end" />
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:gap-20">
        <div>
          <Logo />
          <p className="mt-5 max-w-sm text-sm leading-6 text-primary-foreground/70">
            Construction and engineering partners for infrastructure,
            residential and commercial developments.
          </p>
        </div>
        <div>
          <p className="eyebrow text-accent">Explore</p>
          <div className="mt-5 flex flex-col gap-3 text-sm text-primary-foreground/70">
            <Link href="/about">About NEGO</Link>
            <Link href="/projects">Our projects</Link>
            <Link href="/contact">Start a conversation</Link>
          </div>
        </div>
        <div>
          <p className="eyebrow text-accent">Connect</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              className="social"
              href="#social-placeholder"
              aria-label="LinkedIn placeholder"
            >
              <AtSign />
            </a>
            <a
              className="social"
              href="#social-placeholder"
              aria-label="YouTube placeholder"
            >
              <Play />
            </a>
            <a
              className="social"
              href="#social-placeholder"
              aria-label="Facebook placeholder"
            >
              <Globe />
            </a>
            <a
              className="social"
              href="mailto:hello@nego.example"
              aria-label="Email NEGO"
            >
              <Mail />
            </a>
          </div>
          <p className="mt-4 text-xs text-primary-foreground/50">
            Social profile links will be added when supplied.
          </p>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 py-6 text-center text-xs text-primary-foreground/45">
        © 2026 NEGO Construction Limited. All rights reserved.
      </div>
    </footer>
  );
}

export function MediaSlot({
  label = "Project media coming soon",
  tall = false,
}: {
  label?: string;
  tall?: boolean;
}) {
  return (
    <ScrollScene className="media-scene" intensity={tall ? 12 : 8}>
      <div
        className={`media-slot ${
          tall ? "min-h-80 sm:min-h-96" : "min-h-56 sm:min-h-64"
        }`}
        role="img"
        aria-label={label}
      >
        <span className="font-mono text-5xl font-bold text-primary/10">
          NEGO
        </span>
        <span className="absolute bottom-5 left-5 max-w-[14rem] text-xs font-bold uppercase tracking-[0.12em] text-primary/50">
          {label}
        </span>
      </div>
    </ScrollScene>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="border-b border-border bg-muted py-16 sm:py-20 md:py-28">
      <div className="container max-w-5xl">
        <Reveal>
          <p className="eyebrow text-accent">{eyebrow}</p>
          <h1 className="mt-5 max-w-4xl text-balance text-5xl font-black tracking-[-0.06em] sm:text-6xl md:text-7xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            {description}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <Reveal className="mb-10 max-w-2xl">
      <p className="eyebrow text-accent">{eyebrow}</p>
      <h2 className="mt-4 text-balance text-4xl font-black tracking-[-0.05em] md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-5 leading-7 text-muted-foreground">{description}</p>
      )}
    </Reveal>
  );
}

export function ProjectCard({
  project,
}: {
  project: (typeof projects)[number];
}) {
  return (
    <Reveal>
      <Link href={`/projects/${project.slug}`} className="group block">
        <div className="media-slot aspect-[4/3] min-h-0">
          <span className="font-mono text-6xl font-bold text-primary/10">
            {project.accent}
          </span>
          <span className="absolute bottom-4 left-4 text-xs font-bold uppercase tracking-[0.12em] text-primary/50">
            Asset slot · {project.name}
          </span>
        </div>
        <div className="flex items-start justify-between gap-5 border-b border-border py-5">
          <div>
            <p className="eyebrow text-accent">{project.type}</p>
            <h3 className="mt-2 text-2xl font-bold tracking-tight group-hover:text-accent">
              {project.name}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {project.location}
            </p>
          </div>
          <ArrowUpRight className="mt-1 shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </div>
      </Link>
    </Reveal>
  );
}

export function Testimonials() {
  return (
    <section className="bg-muted py-16 sm:py-24">
      <div className="container">
        <SectionHeading
          eyebrow="The experience"
          title="Built on trust, delivered with intent."
          description="The best projects are partnerships. Here is the kind of experience we aim to create on every brief."
        />
        <div className="grid gap-px overflow-hidden border border-border bg-border md:grid-cols-3">
          {testimonials.map((item, index) => (
            <Reveal key={item.name} delay={index * 80}>
              <figure className="h-full bg-background p-6 sm:p-7 md:p-9">
                <div
                  className="flex gap-1 text-accent"
                  aria-label="5 out of 5 stars"
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star}>★</span>
                  ))}
                </div>
                <blockquote className="mt-8 text-lg font-semibold leading-7">
                  “{item.quote}”
                </blockquote>
                <figcaption className="mt-10 border-t border-border pt-5 text-sm">
                  <strong className="block">{item.name}</strong>
                  <span className="text-muted-foreground">{item.role}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function VideoPrompt() {
  const [open, setOpen] = useState(true);
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);
  if (!open) return null;
  return (
    <div
      className="video-modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-primary/80 p-4 sm:p-5"
      onClick={(event) => {
        if (event.target === event.currentTarget) setOpen(false);
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lily-title"
    >
      <div className="video-modal w-full max-w-3xl bg-background p-4 sm:p-5 md:p-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="eyebrow text-accent">Featured project</p>
            <h2
              id="lily-title"
              className="mt-2 text-2xl font-black sm:text-3xl"
            >
              Meet Lily Park
            </h2>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="inline-flex size-11 shrink-0 items-center justify-center border border-border"
            aria-label="Close Lily Park video"
          >
            <X />
          </button>
        </div>
        <div className="relative mt-6 flex aspect-video items-center justify-center border border-border bg-muted">
          <Play className="text-accent" size={48} aria-hidden="true" />
          <span className="absolute bottom-3 left-3 max-w-[75%] text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground sm:bottom-4 sm:left-4 sm:text-xs">
            Video asset slot · supplied media pending
          </span>
        </div>
        <div className="mt-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <p className="max-w-lg text-sm leading-6 text-muted-foreground">
            A new NEGO project is taking shape. Explore the thinking behind the
            build and what comes next.
          </p>
          <Link
            href="/projects/lily-park"
            onClick={() => setOpen(false)}
            className="button-primary"
          >
            View Lily Park <ChevronRight data-icon="inline-end" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function CtaBand() {
  return (
    <section className="bg-accent py-14 text-accent-foreground sm:py-16">
      <Reveal>
        <div className="container flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Have a project in mind?</p>
            <h2 className="mt-4 max-w-2xl text-4xl font-black tracking-[-0.05em] md:text-5xl">
              Let&apos;s build what matters.
            </h2>
          </div>
          <Link href="/contact" className="button-dark">
            Start a conversation <ArrowUpRight data-icon="inline-end" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollProgress />
      <Header />
      {children}
      <Footer />
    </>
  );
}
