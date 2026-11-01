
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
