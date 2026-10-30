import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { verifySession } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase/server'
import type { ContactEnquiry, ChatSession } from '@/lib/types'
import EnquiriesClient from './client'

export const metadata: Metadata = {
  title: 'Enquiries',
  robots: { index: false, follow: false },
}

interface EnquiriesPageProps {
  searchParams: Promise<{ tab?: string }>
}

export default async function EnquiriesPage({ searchParams }: EnquiriesPageProps) {
  const session = await verifySession()
  if (!session) redirect('/admin/login')

  const { tab = 'contacts' } = await searchParams

  const supabase = createServiceClient()

  const [{ data: enquiries }, { data: chatSessions }] = await Promise.all([
    supabase
      .from('contact_enquiries')
      .select('*')
      .order('submitted_at', { ascending: false }),
    supabase
      .from('chat_sessions')
      .select('*')
      .order('started_at', { ascending: false }),
  ])

  return (
    <EnquiriesClient
      enquiries={(enquiries ?? []) as ContactEnquiry[]}
      chatSessions={(chatSessions ?? []) as ChatSession[]}
      initialTab={tab === 'chats' ? 'chats' : 'contacts'}
    />
  )
}
