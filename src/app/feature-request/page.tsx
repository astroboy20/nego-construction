import type { Metadata } from 'next'
import FeatureRequestForm from './client'

export const metadata: Metadata = {
  title: 'Request a Feature | NEGO Construction',
  description:
    'Have an idea or improvement suggestion? Share it with the NEGO team — we read every request.',
  robots: { index: false, follow: false },
}

export default function FeatureRequestPage() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
            Feedback
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            Request a Feature
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base text-neutral-500">
            Got an idea for how we can improve? We&apos;d love to hear it.
            Submit your suggestion and our team will review it.
          </p>
        </div>
        <FeatureRequestForm />
      </div>
    </main>
  )
}
