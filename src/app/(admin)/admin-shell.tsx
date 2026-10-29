'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

const BARE_ROUTES = ['/admin/login']

/**
 * Renders the dashboard chrome (header + padded main) for every admin page
 * EXCEPT bare routes such as the login page, which own the full viewport.
 */
export default function AdminShell({
  header,
  children,
}: {
  header: ReactNode
  children: ReactNode
}) {
  const pathname = usePathname()
  const bare = BARE_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(`${r}/`),
  )

  if (bare) return <>{children}</>

  return (
    <div className="min-h-screen bg-neutral-50">
      {header}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {children}
      </main>
    </div>
  )
}