'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  Lightbulb,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react'

const NAV_LINKS = [
  { href: '/admin/analytics', label: 'Analytics', icon: LayoutDashboard },
  { href: '/admin/knowledge-base', label: 'Knowledge Base', icon: BookOpen },
  { href: '/admin/enquiries', label: 'Enquiries', icon: MessageSquare },
  { href: '/admin/feature-requests', label: 'Feature Requests', icon: Lightbulb },
]

export default function AdminMobileHeader({ onSignOut }: { onSignOut: () => void }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-white/[0.08] bg-[#033a21] px-4 lg:hidden">
        <Link href="/admin/analytics">
          <Image
            src="/logo.png"
            alt="NEGO Construction"
            width={88}
            height={28}
            className="h-7 w-auto object-contain brightness-0 invert"
            priority
          />
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={open}
          className="rounded-xl p-2 text-white/60 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/40"
        >
          <Menu className="h-5 w-5" aria-hidden />
        </button>
      </header>

      {/* Drawer overlay */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#033a21] shadow-2xl lg:hidden"
          >
            {/* Drawer header */}
            <div className="flex h-14 items-center justify-between border-b border-white/[0.08] px-4">
              <Image
                src="/logo.png"
                alt="NEGO Construction"
                width={88}
                height={28}
                className="h-7 w-auto object-contain brightness-0 invert"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close navigation menu"
                className="rounded-xl p-2 text-white/60 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            <div className="px-5 pt-6 pb-2">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/30">
                Main Menu
              </p>
            </div>

            <nav className="flex-1 overflow-y-auto px-3">
              <ul className="space-y-0.5" role="list">
                {NAV_LINKS.map(({ href, label, icon: Icon }) => {
                  const active = pathname === href || pathname.startsWith(`${href}/`)
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        aria-current={active ? 'page' : undefined}
                        onClick={() => setOpen(false)}
                        className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all ${
                          active
                            ? 'bg-white/[0.12] text-white'
                            : 'text-white/55 hover:bg-white/[0.06] hover:text-white/90'
                        }`}
                      >
                        <span
                          className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg ${
                            active ? 'bg-white/[0.15] text-white' : 'text-white/40'
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

              <div className="my-4 h-px bg-white/[0.08]" />

              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-white/40 hover:bg-white/[0.06] hover:text-white/70"
                onClick={() => setOpen(false)}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg text-white/40">
                  <ExternalLink className="h-[15px] w-[15px]" aria-hidden />
                </span>
                View Website
              </Link>
            </nav>

            <div className="border-t border-white/[0.08] p-3">
              <button
                type="button"
                onClick={() => { setOpen(false); onSignOut() }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-white/40 hover:bg-white/[0.06] hover:text-white/70"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg text-white/40">
                  <LogOut className="h-[15px] w-[15px]" aria-hidden />
                </span>
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
