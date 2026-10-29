import { redirect } from 'next/navigation'

/**
 * Admin dashboard index — immediately redirects to /admin/knowledge-base.
 * The proxy allows authenticated users through to /admin; this page
 * ensures they land on a useful page.
 */
export default function AdminPage() {
  redirect('/admin/knowledge-base')
}
