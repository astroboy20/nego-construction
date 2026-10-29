import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { verifySession } from '@/lib/auth'
import NewKBEntryForm from './client'

export const metadata: Metadata = {
  title: 'New Knowledge Base Entry',
  robots: { index: false, follow: false },
}

/**
 * New Knowledge Base Entry page — Server Component shell.
 * Defence-in-depth: verifies session even though the proxy guards this path.
 * The interactive form is a Client Component (client.tsx) which calls the
 * createKBEntry Server Action and handles client-side validation.
 */
export default async function NewKBEntryPage() {
  const session = await verifySession()
  if (!session) {
    redirect('/admin/login')
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <Link
          href="/admin/knowledge-base"
          className="text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground"
        >
          ← Back to Knowledge Base
        </Link>
        <p className="mt-4 text-xs font-bold uppercase tracking-widest text-accent">
          Knowledge Base
        </p>
        <h1 className="mt-1 text-2xl font-black">New Entry</h1>
      </div>

      <div className="border border-border bg-background p-8">
        <NewKBEntryForm />
      </div>
    </div>
  )
}
