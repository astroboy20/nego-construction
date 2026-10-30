import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { verifySession } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase/server'
import type { FeatureRequest } from '@/lib/types'
import FeatureRequestsClient from './client'

export const metadata: Metadata = {
  title: 'Feature Requests',
  robots: { index: false, follow: false },
}

export default async function FeatureRequestsPage() {
  const session = await verifySession()
  if (!session) redirect('/admin/login')

  const supabase = createServiceClient()

  const { data: requests } = await supabase
    .from('feature_requests')
    .select('*')
    .order('submitted_at', { ascending: false })

  return <FeatureRequestsClient requests={(requests ?? []) as FeatureRequest[]} />
}
