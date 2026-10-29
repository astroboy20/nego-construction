/**
 * Admin dashboard layout — no SiteShell (no public Header/Footer/ScrollProgress).
 * This route group layout is completely isolated from the public site shell.
 * Routes are accessible at /admin/... (the (admin) group name is stripped from URLs).
 *
 * The login page lives in the separate (auth) route group, so it does not
 * render this header.
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import AdminNav from './admin-nav'
import AdminShell from './admin-shell'


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
    <AdminShell header={<AdminHeader />}>{children}</AdminShell>
  )
}

function AdminHeader() {
  return (
    <header className="sticky top-0 z-30 bg-[#033a21] text-white shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 pt-3 sm:px-6 md:h-16 md:flex-nowrap md:py-0 lg:px-8">
        <Link
          href="/admin"
          className="flex items-center gap-3 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-base font-bold text-[#033a21]">
            N
          </span>
          <span className="text-base font-semibold tracking-tight">
            NEGO Admin
          </span>
        </Link>

        <div className="order-last -mx-4 w-[calc(100%+2rem)] overflow-x-auto px-4 sm:-mx-6 sm:w-[calc(100%+3rem)] sm:px-6 md:order-none md:mx-0 md:w-auto md:flex-1 md:overflow-visible md:px-0">
          <AdminNav />
        </div>

        <SignOutButton />
      </div>
    </header>
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
        className="rounded-lg border border-white/25 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        Sign out
      </button>
    </form>
  )
}