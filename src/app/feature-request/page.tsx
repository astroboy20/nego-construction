import type { Metadata } from 'next'
import { Lightbulb, MessageSquareText, MailCheck } from 'lucide-react'
import FeatureRequestForm from './client'

export const metadata: Metadata = {
  title: 'Request a Feature | NEGO Construction',
  description:
    'Have an idea or improvement suggestion? Share it with the NEGO team — we read every request.',
  robots: { index: false, follow: false },
}

const STEPS = [
  {
    icon: Lightbulb,
    title: 'Share your idea',
    desc: 'Tell us what you would like to see and why it matters.',
  },
  {
    icon: MessageSquareText,
    title: 'We review it',
    desc: 'Our team reads every request and weighs it against priorities.',
  },
  {
    icon: MailCheck,
    title: 'You hear back',
    desc: 'We follow up by email once your request has been reviewed.',
  },
]

export default function FeatureRequestPage() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-5 lg:gap-8 lg:px-8 lg:py-16">
        {/* Intro panel */}
        <aside className="relative overflow-hidden rounded-3xl bg-[#033a21] px-6 py-8 text-white sm:px-10 sm:py-12 lg:col-span-2 lg:sticky lg:top-8 lg:self-start">
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full border border-white/10"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full border border-white/10"
          />

          <div className="relative">
            <p className="text-sm text-emerald-100/70">Feedback</p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Request a feature
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-emerald-100/80">
              Got an idea for how we can improve? We&apos;d love to hear it.
              Submit your suggestion and our team will review it.
            </p>

            <ol className="mt-8 hidden space-y-5 sm:block">
              {STEPS.map(({ icon: Icon, title, desc }) => (
                <li key={title} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                    <Icon className="h-5 w-5 text-emerald-200" aria-hidden />
                  </span>
                  <div>
                    <p className="font-medium">{title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-emerald-100/70">
                      {desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </aside>

        {/* Form */}
        <div className="lg:col-span-3">
          <FeatureRequestForm />
        </div>
      </div>
    </main>
  )
}