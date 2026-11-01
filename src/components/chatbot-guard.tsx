'use client'

import { usePathname } from 'next/navigation'
import { ChatbotWidget } from './chatbot-widget'

/**
 * Renders the ChatbotWidget only on public (non-admin) pages.
 * Admin routes start with /admin — we don't want the chat bubble there.
 */
export function ChatbotGuard() {
  const pathname = usePathname()
  if (pathname.startsWith('/admin')) return null
  return <ChatbotWidget />
}
