'use server'

/**
 * Server Actions for the NEGO admin dashboard.
 *
 * Every action that writes data calls `verifySession()` first to ensure only
 * authenticated admin users can perform mutations. Actions called from the
 * login page (loginAction) are the sole exception — they verify credentials
 * directly via Supabase Auth.
 *
 * All functions are exported and invoked from Server Components or Client
 * Components via the React Server Function mechanism. No secrets are passed to
 * client bundles; only action IDs are exposed.
 */

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { signIn, signOut, createSession, verifySession } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase/server'
import type { ActionResult, KBEntryInput, FeatureRequestPriority, FeatureRequestStatus } from '@/lib/types'

// ─── Auth Actions ─────────────────────────────────────────────────────────────

/**
 * Authenticate an admin user with email and password.
 * On success, creates a signed JWT session cookie and redirects to /admin.
 * On failure, returns a generic error without field specifics (Requirement 8.6).
 */
export async function loginAction(
  formData: FormData
): Promise<ActionResult> {
  const email = (formData.get('email') as string | null) ?? ''
  const password = (formData.get('password') as string | null) ?? ''

  try {
    const payload = await signIn(email.trim(), password)
    await createSession(payload)
  } catch {
    // Return a non-specific error message regardless of failure reason (Req 8.6)
    return { success: false, error: 'Invalid credentials' }
  }

  // redirect() throws a special Next.js exception — must be called outside try/catch
  redirect('/admin')
}

/**
 * Sign out the current admin user by clearing the session cookie and
 * redirecting to the login page.
 */
export async function logoutAction(): Promise<void> {
  await signOut()
  redirect('/admin/login')
}

// ─── Knowledge Base Actions ───────────────────────────────────────────────────

/**
 * Validate KB entry input fields.
 * Returns an error string if invalid, or null if valid.
 */
function validateKBInput(data: KBEntryInput): string | null {
  if (!data.title || data.title.trim().length === 0) {
    return 'Title is required.'
  }
  if (!data.content || data.content.trim().length < 20) {
    return 'Content must be at least 20 characters.'
  }
  const validCategories = ['about', 'projects', 'services', 'contact', 'faq']
  if (!validCategories.includes(data.category)) {
    return 'Invalid category.'
  }
  return null
}

/**
 * Create a new Knowledge Base entry.
 * Validates input (Req 9.6) and requires an active session (Req 9.7).
 */
export async function createKBEntry(
  data: KBEntryInput
): Promise<ActionResult<{ id: string }>> {
  const session = await verifySession()
  if (!session) {
    return { success: false, error: 'Unauthorised.' }
  }

  const validationError = validateKBInput(data)
  if (validationError) {
    return { success: false, error: validationError }
  }

  // Use anon client — the authenticated Supabase session grants INSERT via RLS
  // (admin_insert_kb policy targets the authenticated role). However since our
  // JWT is a custom JWT (not a Supabase session token), we use the service client
  // to bypass RLS for admin writes.
  const supabase = createServiceClient()
  const { data: row, error } = await supabase
    .from('knowledge_base')
    .insert({
      title: data.title.trim(),
      content: data.content.trim(),
      category: data.category,
      is_published: data.is_published,
    })
    .select('id')
    .single()

  if (error || !row) {
    console.error('[createKBEntry]', error)
    return { success: false, error: 'Failed to create entry. Please try again.' }
  }

  revalidatePath('/admin/knowledge-base')
  return { success: true, data: { id: row.id } }
}

/**
 * Update an existing Knowledge Base entry by ID.
 * Validates input (Req 9.6) and requires an active session (Req 9.7).
 */
export async function updateKBEntry(
  id: string,
  data: KBEntryInput
): Promise<ActionResult> {
  const session = await verifySession()
  if (!session) {
    return { success: false, error: 'Unauthorised.' }
  }

  const validationError = validateKBInput(data)
  if (validationError) {
    return { success: false, error: validationError }
  }

  const supabase = createServiceClient()
  const { error } = await supabase
    .from('knowledge_base')
    .update({
      title: data.title.trim(),
      content: data.content.trim(),
      category: data.category,
      is_published: data.is_published,
    })
    .eq('id', id)

  if (error) {
    console.error('[updateKBEntry]', error)
    return { success: false, error: 'Failed to update entry. Please try again.' }
  }

  revalidatePath('/admin/knowledge-base')
  revalidatePath(`/admin/knowledge-base/${id}`)
  return { success: true }
}

/**
 * Delete a Knowledge Base entry by ID.
 * Requires an active session (Req 9.7).
 */
export async function deleteKBEntry(id: string): Promise<ActionResult> {
  const session = await verifySession()
  if (!session) {
    return { success: false, error: 'Unauthorised.' }
  }

  const supabase = createServiceClient()
  const { error } = await supabase
    .from('knowledge_base')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('[deleteKBEntry]', error)
    return { success: false, error: 'Failed to delete entry. Please try again.' }
  }

  revalidatePath('/admin/knowledge-base')
  redirect('/admin/knowledge-base')
}

/**
 * Toggle the `is_published` flag for a Knowledge Base entry.
 * Requires an active session (Req 9.7).
 */
export async function toggleKBPublished(
  id: string,
  published: boolean
): Promise<ActionResult> {
  const session = await verifySession()
  if (!session) {
    return { success: false, error: 'Unauthorised.' }
  }

  const supabase = createServiceClient()
  const { error } = await supabase
    .from('knowledge_base')
    .update({ is_published: published })
    .eq('id', id)

  if (error) {
    console.error('[toggleKBPublished]', error)
    return { success: false, error: 'Failed to update publish status.' }
  }

  revalidatePath('/admin/knowledge-base')
  revalidatePath(`/admin/knowledge-base/${id}`)
  return { success: true }
}

// ─── Enquiry Actions ──────────────────────────────────────────────────────────

/**
 * Mark a contact enquiry as read.
 * Requires an active session (Req 9.7).
 */
export async function markEnquiryRead(id: string): Promise<ActionResult> {
  const session = await verifySession()
  if (!session) {
    return { success: false, error: 'Unauthorised.' }
  }

  const supabase = createServiceClient()
  const { error } = await supabase
    .from('contact_enquiries')
    .update({ is_read: true })
    .eq('id', id)

  if (error) {
    console.error('[markEnquiryRead]', error)
    return { success: false, error: 'Failed to mark enquiry as read.' }
  }

  revalidatePath('/admin/enquiries')
  revalidatePath(`/admin/enquiries/${id}`)
  return { success: true }
}

// ─── Feature Request Actions ──────────────────────────────────────────────────

/**
 * Submit a new feature request (public — no session required).
 */
export async function submitFeatureRequest(data: {
  name: string
  email: string
  title: string
  description: string
  priority: FeatureRequestPriority
}): Promise<ActionResult> {
  if (!data.name?.trim() || !data.email?.trim() || !data.title?.trim() || !data.description?.trim()) {
    return { success: false, error: 'All fields are required.' }
  }

  const supabase = createServiceClient()
  const { error } = await supabase.from('feature_requests').insert({
    name: data.name.trim(),
    email: data.email.trim(),
    title: data.title.trim(),
    description: data.description.trim(),
    priority: data.priority,
  })

  if (error) {
    console.error('[submitFeatureRequest]', error)
    return { success: false, error: 'Failed to submit. Please try again.' }
  }

  return { success: true }
}

/**
 * Update the status of a feature request.
 * Requires an active session.
 */
export async function updateFeatureRequestStatus(
  id: string,
  status: FeatureRequestStatus,
): Promise<ActionResult> {
  const session = await verifySession()
  if (!session) return { success: false, error: 'Unauthorised.' }

  const supabase = createServiceClient()
  const { error } = await supabase
    .from('feature_requests')
    .update({ status })
    .eq('id', id)

  if (error) {
    console.error('[updateFeatureRequestStatus]', error)
    return { success: false, error: 'Failed to update status.' }
  }

  revalidatePath('/admin/feature-requests')
  return { success: true }
}

/**
 * Mark a feature request as read.
 * Requires an active session.
 */
export async function markFeatureRequestRead(id: string): Promise<ActionResult> {
  const session = await verifySession()
  if (!session) return { success: false, error: 'Unauthorised.' }

  const supabase = createServiceClient()
  const { error } = await supabase
    .from('feature_requests')
    .update({ is_read: true })
    .eq('id', id)

  if (error) {
    console.error('[markFeatureRequestRead]', error)
    return { success: false, error: 'Failed to mark as read.' }
  }

  revalidatePath('/admin/feature-requests')
  return { success: true }
}
