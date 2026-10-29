import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { verifySession } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase/server'
import type { KBEntry } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Knowledge Base',
  robots: { index: false, follow: false },
}

/**
 * Admin Knowledge Base list page — Server Component.
 * Defence-in-depth: calls verifySession() even though the proxy already guards.
 * Displays all KB entries with title, category, published status, and updated_at.
 */
export default async function KBListPage() {
  const session = await verifySession()
  if (!session) {
    redirect('/admin/login')
  }

  const supabase = createServiceClient()
  const { data: entries, error } = await supabase
    .from('knowledge_base')
    .select('id, title, category, is_published, updated_at')
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('[KBListPage]', error)
  }

  const rows = (entries ?? []) as Pick<
    KBEntry,
    'id' | 'title' | 'category' | 'is_published' | 'updated_at'
  >[]

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-accent">
            Knowledge Base
          </p>
          <h1 className="mt-1 text-2xl font-black">Entries</h1>
        </div>
        <Link
          href="/admin/knowledge-base/new"
          className="button-primary inline-block"
        >
          + New Entry
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="border border-border bg-background px-8 py-12 text-center">
          <p className="text-sm text-muted-foreground">
            No entries yet.{' '}
            <Link
              href="/admin/knowledge-base/new"
              className="font-semibold text-foreground underline underline-offset-2 hover:text-accent"
            >
              Create your first entry.
            </Link>
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-border bg-background">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted text-left">
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Title
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Category
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Updated
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((entry) => (
                <tr key={entry.id} className="hover:bg-muted/40">
                  <td className="px-4 py-3 font-medium">{entry.title}</td>
                  <td className="px-4 py-3 capitalize text-muted-foreground">
                    {entry.category}
                  </td>
                  <td className="px-4 py-3">
                    {entry.is_published ? (
                      <span className="inline-block rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Published
                      </span>
                    ) : (
                      <span className="inline-block rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(entry.updated_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/knowledge-base/${entry.id}`}
                      className="text-xs font-semibold text-foreground underline underline-offset-2 hover:text-accent"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
