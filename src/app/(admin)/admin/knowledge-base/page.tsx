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
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#033a21]">
            Knowledge Base
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-space-grotesk)] text-3xl font-bold tracking-tight text-neutral-900">
            Entries
          </h1>
        </div>
        <Link
          href="/admin/knowledge-base/new"
          className="inline-flex items-center gap-2 rounded-xl bg-[#033a21] px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#04502d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#033a21]"
        >
          + New Entry
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-neutral-100 bg-white px-8 py-16 text-center shadow-sm">
          <p className="text-sm font-medium text-neutral-400">
            No entries yet.{' '}
            <Link
              href="/admin/knowledge-base/new"
              className="font-semibold text-[#033a21] underline underline-offset-2 hover:text-[#04502d]"
            >
              Create your first entry.
            </Link>
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-neutral-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50 text-left">
                <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                  Title
                </th>
                <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                  Category
                </th>
                <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                  Status
                </th>
                <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                  Updated
                </th>
                <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {rows.map((entry) => (
                <tr key={entry.id} className="transition-colors hover:bg-neutral-50">
                  <td className="px-5 py-3.5 font-semibold text-neutral-900">{entry.title}</td>
                  <td className="px-5 py-3.5 capitalize text-neutral-500">
                    {entry.category}
                  </td>
                  <td className="px-5 py-3.5">
                    {entry.is_published ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold text-neutral-500">
                        <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" aria-hidden />
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-neutral-400">
                    {new Date(entry.updated_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-5 py-3.5">
                    <Link
                      href={`/admin/knowledge-base/${entry.id}`}
                      className="rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-neutral-700"
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
