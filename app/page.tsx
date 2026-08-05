import Link from 'next/link'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { CtaBand, MediaSlot, ProjectCard, Reveal, SectionHeading, SiteShell, Testimonials, VideoPrompt } from '@/components/site'
import { projects, services } from '@/lib/site-data'

export default function Page() {
  return <SiteShell><VideoPrompt /><main>
    <section className="hero-section border-b border-border">
      <div className="container grid min-h-[calc(100svh-4rem)] items-center gap-10 py-12 sm:py-16 md:grid-cols-[1.1fr_.9fr] md:gap-14 md:py-20">
        <Reveal className="hero-copy">
          <p className="eyebrow text-accent">Construction · Engineering · Delivery</p>
          <h1 className="mt-5 max-w-5xl text-balance text-[3.35rem] font-black leading-[.9] tracking-[-0.08em] sm:text-6xl md:text-8xl">We build the places <span className="text-accent">progress</span> calls home.</h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">NEGO Construction partners with ambitious clients to deliver infrastructure, residential and commercial projects with clarity, care and craft.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4"><Link href="/projects" className="button-primary">Explore our work <ArrowUpRight data-icon="inline-end" /></Link><Link href="/about" className="button-outline">Why NEGO <ArrowDown data-icon="inline-end" /></Link></div>
        </Reveal>
        <Reveal className="hero-media" delay={120}><MediaSlot label="Hero media slot · supplied project image pending" tall /><div className="mt-3 flex justify-between text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground sm:text-xs"><span>Lagos · Nigeria</span><span>01 / 04</span></div></Reveal>
      </div>
    </section>

    <section className="py-16 sm:py-24"><Reveal><div className="container grid gap-10 md:grid-cols-[.75fr_1.25fr] md:gap-24"><div><p className="eyebrow text-accent">A better way to build</p><h2 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-5xl">Experience that makes complexity feel simple.</h2></div><div><p className="text-lg leading-8 sm:text-xl">We bring engineering rigour and human attention to every stage of the project. That means fewer surprises, stronger decisions and a finished result made to last.</p><div className="mt-8 grid gap-5 border-t border-border pt-6 sm:mt-10 sm:grid-cols-3 sm:gap-6 sm:pt-7">{[['01','Clear thinking'],['02','Accountable delivery'],['03','Built for tomorrow']].map(([number, label], index) => <Reveal key={number} delay={index * 80}><div><p className="text-4xl font-black text-accent">{number}</p><p className="mt-2 text-sm font-bold">{label}</p></div></Reveal>)}</div></div></div></Reveal></section>

    <section className="bg-primary py-16 text-primary-foreground sm:py-24"><div className="container"><SectionHeading eyebrow="What we do" title="From first sketch to final handover." description="A multidisciplinary team for projects that need one clear direction."/><div className="grid gap-px overflow-hidden border border-primary-foreground/15 bg-primary-foreground/15 sm:grid-cols-2 md:grid-cols-4">{services.map((service, index) => <Reveal key={service.title} delay={index * 70}><div className="h-full bg-primary p-6 sm:p-7"><p className="font-mono text-sm text-accent">0{index + 1}</p><h3 className="mt-10 text-xl font-bold sm:mt-14">{service.title}</h3><p className="mt-4 text-sm leading-6 text-primary-foreground/65">{service.text}</p></div></Reveal>)}</div></div></section>

    <section className="py-16 sm:py-24"><div className="container"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><SectionHeading eyebrow="Selected work" title="Projects that move people forward." description="A glimpse into the roads, spaces and places we have helped bring to life."/><Link href="/projects" className="button-outline mb-8 shrink-0 md:mb-10">View all projects <ArrowUpRight data-icon="inline-end" /></Link></div><div className="grid gap-8 sm:gap-10 md:grid-cols-2">{projects.slice(0, 4).map((project) => <ProjectCard key={project.slug} project={project} />)}</div></div></section>

    <Testimonials />

    <section className="overflow-hidden py-16 sm:py-24"><div className="container grid items-center gap-10 md:grid-cols-2 md:gap-12"><Reveal><p className="eyebrow text-accent">The Lily Park story</p><h2 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-5xl md:text-6xl">A new address for a new chapter.</h2><p className="mt-5 max-w-lg leading-7 text-muted-foreground">Discover the vision, process and progress behind Lily Park, a residential project created with the everyday experience in mind.</p><Link href="/projects/lily-park" className="button-dark mt-7">View project <ArrowUpRight data-icon="inline-end" /></Link></Reveal><MediaSlot label="Lily Park project media slot" tall /></div></section>
  </main><CtaBand /></SiteShell>
}
