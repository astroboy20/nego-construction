'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/admin/knowledge-base', label: 'Knowledge base' },
  { href: '/admin/enquiries', label: 'Enquiries' },
]

/**
 * Client component only so it can read the current path and mark the
 * active link. Everything else in the layout stays a Server Component.
 */
export default function AdminNav() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Admin navigation"
      className="flex items-center gap-1 md:justify-center"
    >
      {LINKS.map(({ href, label }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`)
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={`whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
              active
                ? 'bg-white/15 text-white'
                : 'text-emerald-100/75 hover:bg-white/10 hover:text-white'
            }`}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}