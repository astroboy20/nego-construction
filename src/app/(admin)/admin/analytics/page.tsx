import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { verifySession } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase/server'
import { getVercelAnalyticsSummary } from '@/lib/vercel-analytics'
import {
  MessageSquare,
  BookOpen,
  Lightbulb,
  Users,
  TrendingUp,
  Eye,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  ArrowRight,
  Activity,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Analytics',
  robots: { index: false, follow: false },
}

// ─── Stat Card ──────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
  accent: string
  iconBg: string
}

function StatCard({ label, value, sub, icon: Icon, accent, iconBg }: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-400">
            {label}
          </p>
          <p
            className="mt-2 font-[family-name:var(--font-space-grotesk)] text-4xl font-bold leading-none text-neutral-900"
          >
            {value}
          </p>
          {sub && (
            <p className="mt-2 text-xs font-medium text-neutral-400">{sub}</p>
          )}
        </div>
        <div className={`flex-shrink-0 rounded-2xl p-3 ${iconBg}`}>
          <Icon className={`h-5 w-5 ${accent}`} aria-hidden />
        </div>
      </div>
      {/* subtle decorative bar */}
      <div className={`absolute bottom-0 left-0 h-0.5 w-full ${accent.replace('text-', 'bg-')} opacity-20`} />
    </div>
  )
}

// ─── Mini bar chart (CSS-only) ───────────────────────────────────────────────

function MiniBarChart({
  data,
  available,
}: {
  data: Array<{ date: string; views: number; visitors: number }>
  available: boolean
}) {
  const hasData = data.some((d) => d.views > 0)

  if (data.length === 0 || !hasData) {
    return (
      <div className="space-y-3">
        <div className="flex h-20 items-end gap-px">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="h-1 flex-1 rounded-sm bg-neutral-100" />
          ))}
        </div>
        {available ? (
          <p className="text-center text-xs text-neutral-400">
            No traffic recorded in the last 30 days yet.
          </p>
        ) : (
          <p className="text-center text-xs text-neutral-400">
            Add your Vercel API credentials to see live traffic data.
          </p>
        )}
      </div>
    )
  }

  const maxViews = Math.max(...data.map((d) => d.views), 1)

  return (
    <div
      className="flex h-20 items-end gap-px"
      role="img"
      aria-label="Page views over last 30 days"
    >
      {data.map((d, i) => {
        const pct = Math.max((d.views / maxViews) * 100, 2)
        const label = `${new Date(d.date).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
        })}: ${d.views} view${d.views !== 1 ? 's' : ''}, ${d.visitors} visitor${d.visitors !== 1 ? 's' : ''}`
        return (
          <div
            key={i}
            title={label}
            style={{ height: `${pct}%` }}
            className="group relative flex-1 cursor-default rounded-t-sm bg-[#033a21] opacity-60 transition-opacity hover:opacity-100"
          />
        )
      })}
    </div>
  )
}

// ─── Progress bar row ────────────────────────────────────────────────────────

function ProgressRow({
  label,
  value,
  max,
  color = 'bg-[#033a21]',
}: {
  label: string
  value: number
  max: number
  color?: string
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="flex items-center gap-3">
      <span className="w-32 truncate text-xs font-medium text-neutral-700">{label}</span>
      <div className="flex-1 overflow-hidden rounded-full bg-neutral-100 h-1.5">
        <div
          className={`h-full rounded-full ${color} transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-8 text-right text-xs font-semibold text-neutral-500">
        {value.toLocaleString()}
      </span>
    </div>
  )
}

// ─── Device icon ────────────────────────────────────────────────────────────

function DeviceIcon({ device }: { device: string }) {
  const d = device.toLowerCase()
  if (d.includes('mobile') || d.includes('phone'))
    return <Smartphone className="h-3.5 w-3.5 text-neutral-400" aria-hidden />
  if (d.includes('tablet'))
    return <Tablet className="h-3.5 w-3.5 text-neutral-400" aria-hidden />
  return <Monitor className="h-3.5 w-3.5 text-neutral-400" aria-hidden />
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function AnalyticsPage() {
  const session = await verifySession()
  if (!session) redirect('/admin/login')

  const supabase = createServiceClient()

  const [
    { count: totalKB },
    { count: publishedKB },
    { count: totalEnquiries },
    { count: unreadEnquiries },
    { count: totalChats },
    { count: totalFeatureRequests },
    { count: openFeatureRequests },
    { data: recentEnquiries },
    { data: recentChats },
    vercel,
  ] = await Promise.all([
    supabase.from('knowledge_base').select('*', { count: 'exact', head: true }),
    supabase.from('knowledge_base').select('*', { count: 'exact', head: true }).eq('is_published', true),
    supabase.from('contact_enquiries').select('*', { count: 'exact', head: true }),
    supabase.from('contact_enquiries').select('*', { count: 'exact', head: true }).eq('is_read', false),
    supabase.from('chat_sessions').select('*', { count: 'exact', head: true }),
    supabase.from('feature_requests').select('*', { count: 'exact', head: true }),
    supabase.from('feature_requests').select('*', { count: 'exact', head: true }).eq('status', 'open'),
    supabase.from('contact_enquiries').select('first_name, last_name, email, message, submitted_at, is_read').order('submitted_at', { ascending: false }).limit(5),
    supabase.from('chat_sessions').select('session_id, message_count, started_at').order('started_at', { ascending: false }).limit(5),
    getVercelAnalyticsSummary(),
  ])

  const topPageMax = vercel.topPages[0]?.views ?? 1
  const topCountryMax = vercel.topCountries[0]?.views ?? 1

  return (
    <div className="space-y-10">

      {/* ── Page header ─────────────────────────────────────── */}
      <div>
        <p className="eyebrow text-[#033a21]">Overview</p>
        <h1 className="mt-2 font-[family-name:var(--font-space-grotesk)] text-3xl font-bold tracking-tight text-neutral-900">
          Analytics
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Dashboard metrics and live website traffic — last 30 days.
        </p>
      </div>

      {/* ── Vercel section ──────────────────────────────────── */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-[#033a21]" aria-hidden />
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-base font-bold text-neutral-900">
              Website Traffic
            </h2>
          </div>
          {vercel.available && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live 
            </span>
          )}
          {!vercel.available && (
            <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[11px] font-medium text-neutral-400">
              Configure VERCEL_ACCESS_TOKEN to enable
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StatCard
            label="Page Views"
            value={vercel.available ? vercel.totalPageViews.toLocaleString() : '—'}
            sub="Last 30 days"
            icon={Eye}
            accent="text-[#033a21]"
            iconBg="bg-emerald-50"
          />
          <StatCard
            label="Unique Visitors"
            value={vercel.available ? vercel.uniqueVisitors.toLocaleString() : '—'}
            sub="Last 30 days"
            icon={Users}
            accent="text-blue-600"
            iconBg="bg-blue-50"
          />
        </div>

        {/* Trend chart */}
        <div className="mt-4 rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">
              Page Views / Day
            </p>
            {vercel.available && (
              <p className="text-xs text-neutral-400">
                {vercel.pageViewsByDay.length} days of data
              </p>
            )}
          </div>
          <MiniBarChart data={vercel.pageViewsByDay} available={vercel.available} />
        </div>

        {/* Top pages + countries */}
        {vercel.available && (
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Top pages */}
            <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-neutral-400">
                Top Pages
              </p>
              <div className="space-y-3">
                {vercel.topPages.length === 0 ? (
                  <p className="text-sm text-neutral-400">No data</p>
                ) : (
                  vercel.topPages.map((p) => (
                    <ProgressRow
                      key={p.path}
                      label={p.path || '/'}
                      value={p.views}
                      max={topPageMax}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Top countries + devices */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
                <p className="mb-4 text-xs font-bold uppercase tracking-widest text-neutral-400">
                  Top Countries
                </p>
                <div className="space-y-3">
                  {vercel.topCountries.length === 0 ? (
                    <p className="text-sm text-neutral-400">No data</p>
                  ) : (
                    vercel.topCountries.map((c) => (
                      <ProgressRow
                        key={c.country}
                        label={c.country}
                        value={c.views}
                        max={topCountryMax}
                        color="bg-blue-500"
                      />
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
                <p className="mb-4 text-xs font-bold uppercase tracking-widest text-neutral-400">
                  Devices
                </p>
                <div className="space-y-2.5">
                  {vercel.topDevices.length === 0 ? (
                    <p className="text-sm text-neutral-400">No data</p>
                  ) : (
                    vercel.topDevices.map((d) => (
                      <div key={d.device} className="flex items-center gap-2.5">
                        <DeviceIcon device={d.device} />
                        <span className="flex-1 text-xs font-medium capitalize text-neutral-600">
                          {d.device}
                        </span>
                        <span className="text-xs font-bold text-neutral-900">
                          {d.views.toLocaleString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── Dashboard metrics ───────────────────────────────── */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-[#033a21]" aria-hidden />
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-base font-bold text-neutral-900">
            Dashboard Metrics
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="KB Entries"
            value={totalKB ?? 0}
            sub={`${publishedKB ?? 0} published`}
            icon={BookOpen}
            accent="text-[#033a21]"
            iconBg="bg-emerald-50"
          />
          <StatCard
            label="Enquiries"
            value={totalEnquiries ?? 0}
            sub={`${unreadEnquiries ?? 0} unread`}
            icon={MessageSquare}
            accent="text-blue-600"
            iconBg="bg-blue-50"
          />
          <StatCard
            label="Chat Sessions"
            value={totalChats ?? 0}
            sub="AI conversations"
            icon={Users}
            accent="text-purple-600"
            iconBg="bg-purple-50"
          />
          <StatCard
            label="Feature Requests"
            value={totalFeatureRequests ?? 0}
            sub={`${openFeatureRequests ?? 0} open`}
            icon={Lightbulb}
            accent="text-amber-600"
            iconBg="bg-amber-50"
          />
        </div>

        {/* Rate cards */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              label: 'KB Publish Rate',
              value: totalKB
                ? `${Math.round(((publishedKB ?? 0) / totalKB) * 100)}%`
                : '—',
              icon: BookOpen,
              color: 'text-[#033a21]',
              bg: 'bg-emerald-50',
            },
            {
              label: 'Enquiry Read Rate',
              value: totalEnquiries
                ? `${Math.round((((totalEnquiries ?? 0) - (unreadEnquiries ?? 0)) / totalEnquiries) * 100)}%`
                : '—',
              icon: Eye,
              color: 'text-blue-600',
              bg: 'bg-blue-50',
            },
            {
              label: 'Request Resolved',
              value: totalFeatureRequests
                ? `${Math.round((((totalFeatureRequests ?? 0) - (openFeatureRequests ?? 0)) / totalFeatureRequests) * 100)}%`
                : '—',
              icon: Globe,
              color: 'text-amber-600',
              bg: 'bg-amber-50',
            },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div
              key={label}
              className="flex items-center gap-4 rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm"
            >
              <div className={`rounded-xl ${bg} p-3`}>
                <Icon className={`h-5 w-5 ${color}`} aria-hidden />
              </div>
              <div>
                <p className="text-xs font-medium text-neutral-400">{label}</p>
                <p className="mt-0.5 font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-neutral-900">
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Recent activity ─────────────────────────────────── */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-[#033a21]" aria-hidden />
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-base font-bold text-neutral-900">
            Recent Activity
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent enquiries */}
          <div className="rounded-2xl border border-neutral-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-neutral-50 px-6 py-4">
              <p className="text-sm font-semibold text-neutral-900">Recent Enquiries</p>
              <a
                href="/admin/enquiries"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#033a21] hover:text-[#04502d]"
              >
                View all
                <ArrowRight className="h-3 w-3" aria-hidden />
              </a>
            </div>
            <div className="divide-y divide-neutral-50">
              {!recentEnquiries || recentEnquiries.length === 0 ? (
                <p className="px-6 py-10 text-center text-sm text-neutral-400">No enquiries yet.</p>
              ) : (
                recentEnquiries.map((e, i) => (
                  <div key={i} className="flex items-start gap-3 px-6 py-3.5">
                    <div
                      className={`mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full ${
                        e.is_read ? 'bg-neutral-200' : 'bg-blue-500'
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-neutral-900">
                        {e.first_name} {e.last_name ?? ''}
                      </p>
                      <p className="truncate text-xs text-neutral-400">{e.email}</p>
                      <p className="mt-0.5 line-clamp-1 text-xs text-neutral-500">{e.message}</p>
                    </div>
                    <p className="flex-shrink-0 text-xs text-neutral-400">
                      {new Date(e.submitted_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent chat sessions */}
          <div className="rounded-2xl border border-neutral-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-neutral-50 px-6 py-4">
              <p className="text-sm font-semibold text-neutral-900">Recent Chat Sessions</p>
              <a
                href="/admin/enquiries?tab=chats"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#033a21] hover:text-[#04502d]"
              >
                View all
                <ArrowRight className="h-3 w-3" aria-hidden />
              </a>
            </div>
            <div className="divide-y divide-neutral-50">
              {!recentChats || recentChats.length === 0 ? (
                <p className="px-6 py-10 text-center text-sm text-neutral-400">
                  No chat sessions yet.
                </p>
              ) : (
                recentChats.map((c, i) => (
                  <div key={i} className="flex items-center gap-3 px-6 py-3.5">
                    <div className="flex-shrink-0 rounded-xl bg-purple-50 p-2">
                      <MessageSquare className="h-3.5 w-3.5 text-purple-600" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-neutral-900">
                        Session{' '}
                        <span className="font-mono text-xs font-normal text-neutral-400">
                          #{c.session_id.slice(0, 8)}
                        </span>
                      </p>
                      <p className="text-xs text-neutral-400">
                        {new Date(c.started_at).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <span className="flex-shrink-0 rounded-full bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700">
                      {c.message_count} msg{c.message_count !== 1 ? 's' : ''}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
