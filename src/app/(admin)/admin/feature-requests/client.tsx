'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import {
  Lightbulb,
  Clock,
  Mail,
  ChevronDown,
  ChevronUp,
  Circle,
  ExternalLink,
} from 'lucide-react'
import type { FeatureRequest, FeatureRequestStatus } from '@/lib/types'
import { updateFeatureRequestStatus, markFeatureRequestRead } from '@/app/(admin)/admin/actions'

const STATUS_LABELS: Record<FeatureRequestStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  completed: 'Completed',
  declined: 'Declined',
}

const STATUS_COLORS: Record<FeatureRequestStatus, string> = {
  open: 'bg-amber-50 text-amber-700 border-amber-200',
  in_progress: 'bg-blue-50 text-blue-700 border-blue-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  declined: 'bg-neutral-50 text-neutral-500 border-neutral-200',
}

const PRIORITY_COLORS = {
  low: 'text-neutral-400',
  medium: 'text-amber-500',
  high: 'text-red-500',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function FeatureRequestRow({ request }: { request: FeatureRequest }) {
  const [expanded, setExpanded] = useState(false)
  const [status, setStatus] = useState<FeatureRequestStatus>(request.status)
  const [isRead, setIsRead] = useState(request.is_read)
  const [, startTransition] = useTransition()

  function handleStatusChange(newStatus: FeatureRequestStatus) {
    setStatus(newStatus)
    startTransition(() => updateFeatureRequestStatus(request.id, newStatus))
  }

  function handleExpand() {
    setExpanded((v) => !v)
    if (!isRead) {
      setIsRead(true)
      startTransition(() => markFeatureRequestRead(request.id))
    }
  }

  return (
    <div
      className={`overflow-hidden rounded-2xl border transition-all ${
        isRead ? 'border-neutral-100 bg-white' : 'border-amber-100 bg-amber-50/20'
      }`}
    >
      <button
        type="button"
        className="flex w-full items-start gap-4 px-5 py-4 text-left"
        onClick={handleExpand}
        aria-expanded={expanded}
      >
        {/* Unread indicator */}
        <div className="mt-1 flex-shrink-0">
          {isRead ? (
            <Circle className="h-2 w-2 fill-neutral-200 text-neutral-200" />
          ) : (
            <Circle className="h-2 w-2 fill-amber-400 text-amber-400" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-neutral-900">{request.title}</span>
            {!isRead && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                New
              </span>
            )}
            <span
              className={`ml-auto rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[status]}`}
            >
              {STATUS_LABELS[status]}
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-400">
            <span>{request.name}</span>
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {request.email}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDate(request.submitted_at)}
            </span>
            <span className={`font-semibold capitalize ${PRIORITY_COLORS[request.priority]}`}>
              {request.priority} priority
            </span>
          </div>
          {!expanded && (
            <p className="mt-1.5 line-clamp-1 text-sm text-neutral-500">
              {request.description}
            </p>
          )}
        </div>

        <div className="flex-shrink-0 text-neutral-400">
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-neutral-100 px-5 py-4">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-700">
            {request.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <label htmlFor={`status-${request.id}`} className="text-xs font-medium text-neutral-500">
                Update status:
              </label>
              <select
                id={`status-${request.id}`}
                value={status}
                onChange={(e) => handleStatusChange(e.target.value as FeatureRequestStatus)}
                className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#033a21]/30"
              >
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <a
              href={`mailto:${request.email}?subject=Re: ${encodeURIComponent(request.title)}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-neutral-700"
            >
              <Mail className="h-3.5 w-3.5" />
              Reply by email
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

const STATUS_FILTERS: Array<{ value: FeatureRequestStatus | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'declined', label: 'Declined' },
]

export default function FeatureRequestsClient({
  requests,
}: {
  requests: FeatureRequest[]
}) {
  const [filter, setFilter] = useState<FeatureRequestStatus | 'all'>('all')

  const filtered =
    filter === 'all' ? requests : requests.filter((r) => r.status === filter)

  const unreadCount = requests.filter((r) => !r.is_read).length

  return (
    <div>
      {/* Page header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#033a21]">
            Product
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-space-grotesk)] text-3xl font-bold tracking-tight text-neutral-900">
            Feature Requests
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            User-submitted ideas and improvement suggestions.
          </p>
        </div>
        <Link
          href="/feature-request"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-shrink-0 items-center gap-2 rounded-xl bg-[#033a21] px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#04502d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#033a21]"
        >
          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          Submit Request
        </Link>
      </div>

      {/* Summary strip */}
      <div className="mb-6 flex flex-wrap gap-3">
        <div className="rounded-2xl border border-neutral-100 bg-white px-5 py-3.5 text-center shadow-sm">
          <p className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-neutral-900">
            {requests.length}
          </p>
          <p className="text-[11px] font-medium text-neutral-400">Total</p>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50 px-5 py-3.5 text-center shadow-sm">
          <p className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-amber-700">
            {requests.filter((r) => r.status === 'open').length}
          </p>
          <p className="text-[11px] font-medium text-amber-500">Open</p>
        </div>
        {unreadCount > 0 && (
          <div className="rounded-2xl border border-blue-100 bg-blue-50 px-5 py-3.5 text-center shadow-sm">
            <p className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-blue-700">
              {unreadCount}
            </p>
            <p className="text-[11px] font-medium text-blue-500">Unread</p>
          </div>
        )}
      </div>

      {/* Status filter */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {STATUS_FILTERS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
              filter === value
                ? 'border-[#033a21] bg-[#033a21] text-white'
                : 'border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300 hover:text-neutral-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-neutral-100 bg-white px-8 py-16 text-center">
            <Lightbulb className="mx-auto mb-3 h-8 w-8 text-neutral-200" aria-hidden />
            <p className="text-sm font-medium text-neutral-400">
              {filter === 'all' ? 'No feature requests yet.' : `No ${filter} requests.`}
            </p>
          </div>
        ) : (
          filtered.map((r) => <FeatureRequestRow key={r.id} request={r} />)
        )}
      </div>
    </div>
  )
}
