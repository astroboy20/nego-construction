import { Analytics } from '@vercel/analytics/next'
import { Inter, Space_Grotesk } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk', display: 'swap' })

export const metadata: Metadata = {
  title: { default: 'NEGO Construction Limited', template: '%s | NEGO Construction' },
  description: 'NEGO Construction delivers infrastructure, residential and commercial projects across Nigeria with clarity, care and craft.',
  generator: 'v0.app',
}
export const viewport: Viewport = { colorScheme: 'light', themeColor: '#ffffff' }
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} bg-background`}><body className="font-sans antialiased">{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body></html> }
