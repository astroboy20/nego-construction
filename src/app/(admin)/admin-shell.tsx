'use client'

import { usePathname } from 'next/navigation'
import { useTransition, type ReactNode } from 'react'
import AdminSidebar from './admin-sidebar'
import AdminMobileHeader from './admin-mobile-header'

const BARE_ROUTES = ['/admin/login']

/**
 * Admin shell — renders the sidebar + mobile header for all admin pages
 * except bare routes (login page), which own the full viewport.
 */
export default function AdminShell({
  onSignOut,
  children,
}: {
  onSignOut: () => Promise<void>
  children: ReactNode
}) {
  const pathname = usePathname()
  const [, startTransition] = useTransition()
  const bare = BARE_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(`${r}/`),
  )

  if (bare) return <>{children}</>

  function handleSignOut() {
    startTransition(() => {
      onSignOut()
    })
  }

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Desktop sidebar — hidden on mobile */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <AdminSidebar onSignOut={handleSignOut} />
      </div>

      {/* Mobile header — shown on mobile only */}
      <AdminMobileHeader onSignOut={handleSignOut} />

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
          <div className="mx-auto max-w-5xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
