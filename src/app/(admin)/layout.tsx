/**
 * Admin dashboard layout — isolated from the public site shell.
 * Uses a sidebar layout with NEGO logo, nav links, and sign out button.
 * Inherits the same fonts as the public site (Space Grotesk + Inter).
 */

import type { Metadata } from 'next'
import { cn } from '@/lib/utils'
import { inter, spaceGrotesk } from './admin-layout-fonts'
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
  async function signOut() {
    'use server'
    const { logoutAction } = await import('@/app/(admin)/admin/actions')
    await logoutAction()
  }

  return (
    <div
      className={cn(
        inter.variable,
        spaceGrotesk.variable,
        '[--font-sans:var(--font-inter)] [--font-display:var(--font-space-grotesk)]',
        'font-[family-name:var(--font-inter)] antialiased',
      )}
    >
      <AdminShell onSignOut={signOut}>{children}</AdminShell>
    </div>
  )
}
