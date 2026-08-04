import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'NEGO Construction Limited', template: '%s | NEGO Construction' },
  description: 'NEGO Construction delivers infrastructure, residential and commercial projects across Nigeria with clarity, care and craft.',
  generator: 'v0.app',
}
export const viewport: Viewport = { colorScheme: 'light', themeColor: '#ffffff' }
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" className="bg-background"><body className="antialiased">{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body></html> }
