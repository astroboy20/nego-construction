import { redirect } from 'next/navigation'

/**
 * Admin dashboard index — redirects to the analytics page.
 */
export default function AdminPage() {
  redirect('/admin/analytics')
}
