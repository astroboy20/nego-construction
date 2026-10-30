/**
 * Injects the same Google Font CSS variables used on the public site
 * into the admin route group so headings use Space Grotesk and body uses Inter.
 *
 * This is a thin Server Component — it only renders a <style> tag and
 * re-exports the font class strings for use in the layout.
 */

import { Inter, Space_Grotesk } from 'next/font/google'
import { cn } from '@/lib/utils'

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export function adminFontClasses() {
  return cn(inter.variable, spaceGrotesk.variable)
}
