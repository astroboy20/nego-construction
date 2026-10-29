import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { verifySession } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase/server'
import type { KBEntry } from '@/lib/types'
import EditKBEntryForm from './client'

export const metadata: Metadata = {
  title: 'Edit Knowledge Base Entry',
  robots: { index: false, follow: false },
}

interface EditKBEntryPageProps {
  // Next.js 16: params is a Promise — must be awaited
  params: Promise<{ id: string }>
}

/**
 * Edit Knowledge Base Entry page — Server Component shell.
 * Defence-in-depth: verifies session even though the proxy guards this path.
 * Fetches the entry from Supabase and passes it to the Client Component form.
 * Uses `await params` as required by Next.js 16.
 */
export default async function EditKBEntryPage({ params }: EditKBEntryPageProps) {
  // Next.js 16: params is a Promise
  const { id } = await params

  const session = await verifySession()
  if (!session) {
    redirect('/admin/login')
  }

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('knowledge_base')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    notFound()
  }

  const entry = data as KBEntry

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
        <h1 className="mt-1 text-2xl font-black">Edit Entry</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Last updated{' '}
          {new Date(entry.updated_at).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
      </div>

      <div className="border border-border bg-background p-8">
        <EditKBEntryForm entry={entry} />
      </div>
    </div>
  )
}
