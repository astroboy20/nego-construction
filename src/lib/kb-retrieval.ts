import { KBEntry } from './types'
import { createServerClient } from './supabase/server'

/**
 * Retrieves all published Knowledge Base entries from Supabase.
 *
 * Uses the anon key — the `public_read_published_kb` RLS policy allows
 * the anon role to SELECT rows where `is_published = true`.
 *
 * Used by the /api/chat route handler to build context for AI responses.
 */
export async function getPublishedKBEntries(): Promise<KBEntry[]> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('knowledge_base')
    .select('id, title, content, category, is_published, created_at, updated_at')
    .eq('is_published', true)
    .order('updated_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch published KB entries: ${error.message}`)
  }

  return (data ?? []) as KBEntry[]
}
