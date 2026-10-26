/**
 * Shared TypeScript interfaces for NEGO Construction website enhancements.
 * Used across admin dashboard, AI chatbot, and contact enquiry features.
 */

/** Categories for Knowledge Base entries */
export type KBCategory = 'about' | 'projects' | 'services' | 'contact' | 'faq'

/** A published or draft Knowledge Base entry stored in Supabase */
export interface KBEntry {
  id: string
  title: string
  content: string
  category: KBCategory
  is_published: boolean
  created_at: string
  updated_at: string
}

/** Input shape for creating or updating a Knowledge Base entry */
export interface KBEntryInput {
  title: string
  content: string
  category: KBCategory
  is_published: boolean
}

/** A contact form submission stored in the contact_enquiries table */
export interface ContactEnquiry {
  id: string
  first_name: string
  last_name: string | null
  email: string
  phone: string | null
  message: string
  submitted_at: string
  is_read: boolean
}

/**
 * Generic result type for Server Actions.
 * `data` is only present when `success` is true.
 * `error` is only present when `success` is false.
 */
export interface ActionResult<T = void> {
  success: boolean
  data?: T
  error?: string
}

/** A single message in the chatbot conversation */
export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}
