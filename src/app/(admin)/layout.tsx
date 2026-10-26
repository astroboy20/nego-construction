/**
 * Admin dashboard layout — no SiteShell (no public Header/Footer/ScrollProgress).
 * This route group layout is completely isolated from the public site shell.
 * Routes are accessible at /admin/... (the (admin) group name is stripped from URLs).
 */

import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: {
    default: 'NEGO Admin',
    template: '%s | NEGO Admin',
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-muted">
      <header className="border-b border-border bg-background">
        <div className="container flex h-14 items-center justify-between gap-4">
          <span className="text-sm font-bold uppercase tracking-widest text-accent">
            NEGO Admin
          </span>
          <nav className="flex items-center gap-6" aria-label="Admin navigation">
            <Link
              href="/admin/knowledge-base"
              className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
            >
              Knowledge Base
            </Link>
            <Link
              href="/admin/enquiries"
              className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
            >
              Enquiries
            </Link>
            <SignOutButton />
          </nav>
        </div>
      </header>
      <main className="container py-10">{children}</main>
    </div>
  )
}

/**
 * Sign out button — rendered as a form with a Server Action so it works
 * without client-side JavaScript (progressive enhancement).
 */
function SignOutButton() {
  async function handleSignOut() {
    'use server'
    const { logoutAction } = await import('@/app/(admin)/admin/actions')
    await logoutAction()
  }

  return (
    <form action={handleSignOut}>
      <button
        type="submit"
        className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
      >
        Sign out
      </button>
    </form>
  )
}
