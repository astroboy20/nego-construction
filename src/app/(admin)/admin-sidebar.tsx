'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  Lightbulb,
  LogOut,
  ExternalLink,
} from 'lucide-react'

const NAV_LINKS = [
  {
    href: '/admin/analytics',
    label: 'Analytics',
    icon: LayoutDashboard,
  },
  {
    href: '/admin/knowledge-base',
    label: 'Knowledge Base',
    icon: BookOpen,
  },
  {
    href: '/admin/enquiries',
    label: 'Enquiries',
    icon: MessageSquare,
  },
  {
    href: '/admin/feature-requests',
    label: 'Feature Requests',
    icon: Lightbulb,
  },
]

export default function AdminSidebar({
  onSignOut,
}: {
  onSignOut: () => void
}) {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-64 flex-col bg-[#033a21]" aria-label="Admin sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-white/[0.08] px-5">
        <Link
          href="/admin/analytics"
          className="flex items-center gap-2.5 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
        >
          <Image
            src="/logo.png"
            alt="NEGO Construction"
            width={110}
            height={36}
            className="h-8 w-auto object-contain brightness-0 invert"
            priority
          />
        </Link>
      </div>

      {/* Section label */}
      <div className="px-5 pt-6 pb-2">
        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/30">
          Main Menu
        </p>
      </div>

      {/* Nav */}
      <nav aria-label="Admin navigation" className="flex-1 overflow-y-auto px-3">
        <ul className="space-y-0.5" role="list">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`)
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white/40 ${
                    active
                      ? 'bg-white/[0.12] text-white'
                      : 'text-white/55 hover:bg-white/[0.06] hover:text-white/90'
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg transition-colors ${
                      active
                        ? 'bg-white/[0.15] text-white'
                        : 'bg-transparent text-white/40 group-hover:text-white/70'
                    }`}
                  >
                    <Icon className="h-[15px] w-[15px]" aria-hidden />
                  </span>
                  {label}
                  {active && (
                    <span aria-hidden className="ml-auto h-1.5 w-1.5 rounded-full bg-[#60c300]" />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Divider */}
        <div className="my-4 h-px bg-white/[0.08]" />

        {/* View site link */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-white/40 transition-all hover:bg-white/[0.06] hover:text-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white/40"
        >
          <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-white/40">
            <ExternalLink className="h-[15px] w-[15px]" aria-hidden />
          </span>
          View Website
        </Link>
      </nav>

      {/* Bottom: sign out */}
      <div className="border-t border-white/[0.08] p-3">
        <button
          type="button"
          onClick={onSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-white/40 transition-all hover:bg-white/[0.06] hover:text-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white/40"
        >
          <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-white/40">
            <LogOut className="h-[15px] w-[15px]" aria-hidden />
          </span>
          Sign out
        </button>
      </div>
    </aside>
  )
}
