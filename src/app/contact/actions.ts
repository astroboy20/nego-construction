'use server'

/**
 * Server Action for persisting contact form submissions.
 *
 * Uses the Supabase service role key to bypass RLS — the contact_enquiries
 * table has no anon INSERT policy (Requirement 10.6). This runs server-side
 * only; the service role key is never sent to the browser.
 *
 * The action is designed to be fail-open: if the Supabase insert fails, the
 * caller still proceeds with the mailto fallback (Requirement 10.7).
 */

import { createServiceClient } from '@/lib/supabase/server'
import type { ActionResult } from '@/lib/types'

export async function submitEnquiry(
  formData: FormData
): Promise<ActionResult> {
  const firstName = ((formData.get('firstName') as string | null) ?? '').trim()
  const lastName  = ((formData.get('lastName')  as string | null) ?? '').trim() || null
  const email     = ((formData.get('email')     as string | null) ?? '').trim()
  const phone     = ((formData.get('phone')     as string | null) ?? '').trim() || null
  const message   = ((formData.get('message')   as string | null) ?? '').trim()

  // Basic server-side validation — the client already validates required fields,
  // but we guard here too since Server Actions are public endpoints.
  if (!firstName || !email || !message) {
    return { success: false, error: 'Missing required fields.' }
  }

  try {
    const supabase = createServiceClient()
    const { error } = await supabase.from('contact_enquiries').insert({
      first_name:   firstName,
      last_name:    lastName,
      email:        email,
      phone:        phone,
      message:      message,
      // submitted_at and is_read use column defaults (now() and false)
    })

    if (error) {
      console.error('[submitEnquiry] Supabase insert error:', error.message)
      return { success: false, error: 'Failed to save enquiry.' }
    }

    return { success: true }
  } catch (err) {
    console.error('[submitEnquiry] Unexpected error:', err)
    return { success: false, error: 'An unexpected error occurred.' }
  }
}
