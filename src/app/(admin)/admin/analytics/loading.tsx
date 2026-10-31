// Skeleton loading state for the Analytics page

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-neutral-100 ${className ?? ''}`}
      aria-hidden
    />
  )
}

function StatCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-3">
          <SkeletonBlock className="h-2.5 w-24" />
          <SkeletonBlock className="h-9 w-20" />
          <SkeletonBlock className="h-2 w-16" />
        </div>
        <SkeletonBlock className="h-11 w-11 flex-shrink-0 rounded-2xl" />
      </div>
    </div>
  )
}

function SectionHeadingSkeleton() {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <SkeletonBlock className="h-4 w-4 rounded-full" />
        <SkeletonBlock className="h-4 w-32" />
      </div>
      <SkeletonBlock className="h-6 w-20 rounded-full" />
    </div>
  )
}

export default function AnalyticsLoading() {
  return (
    <div className="space-y-10" aria-busy="true" aria-label="Loading analytics…">

      {/* Page header */}
      <div className="space-y-2">
        <SkeletonBlock className="h-2.5 w-16" />
        <SkeletonBlock className="h-8 w-36" />
        <SkeletonBlock className="h-3 w-72" />
      </div>

      {/* Website Traffic section */}
      <section>
        <SectionHeadingSkeleton />

        {/* Traffic stat cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>

        {/* Bar chart card */}
        <div className="mt-4 rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <SkeletonBlock className="h-2.5 w-28" />
            <SkeletonBlock className="h-2.5 w-16" />
          </div>
          {/* Fake bars */}
          <div className="flex h-20 items-end gap-px">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse flex-1 rounded-t-sm bg-neutral-100"
                style={{ height: `${20 + ((i * 7) % 60)}%` }}
              />
            ))}
          </div>
        </div>

        {/* Top pages + countries */}
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm space-y-3">
            <SkeletonBlock className="h-2.5 w-20" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <SkeletonBlock className="h-3 w-24" />
                <SkeletonBlock className="h-1.5 flex-1 rounded-full" />
                <SkeletonBlock className="h-3 w-6" />
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm space-y-3">
              <SkeletonBlock className="h-2.5 w-24" />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <SkeletonBlock className="h-3 w-24" />
                  <SkeletonBlock className="h-1.5 flex-1 rounded-full" />
                  <SkeletonBlock className="h-3 w-6" />
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm space-y-2.5">
              <SkeletonBlock className="h-2.5 w-16" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <SkeletonBlock className="h-3.5 w-3.5 rounded-full" />
                  <SkeletonBlock className="h-3 flex-1" />
                  <SkeletonBlock className="h-3 w-8" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Metrics section */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <SkeletonBlock className="h-4 w-4 rounded-full" />
          <SkeletonBlock className="h-4 w-40" />
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>

        {/* Rate cards */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm"
            >
              <SkeletonBlock className="h-11 w-11 flex-shrink-0 rounded-xl" />
              <div className="space-y-2">
                <SkeletonBlock className="h-2.5 w-24" />
                <SkeletonBlock className="h-7 w-16" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Activity section */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <SkeletonBlock className="h-4 w-4 rounded-full" />
          <SkeletonBlock className="h-4 w-36" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent enquiries */}
          <div className="rounded-2xl border border-neutral-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-neutral-50 px-6 py-4">
              <SkeletonBlock className="h-4 w-32" />
              <SkeletonBlock className="h-3 w-14" />
            </div>
            <div className="divide-y divide-neutral-50">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3 px-6 py-3.5">
                  <SkeletonBlock className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <SkeletonBlock className="h-3.5 w-32" />
                    <SkeletonBlock className="h-2.5 w-40" />
                    <SkeletonBlock className="h-2.5 w-full" />
                  </div>
                  <SkeletonBlock className="h-2.5 w-12 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Recent chats */}
          <div className="rounded-2xl border border-neutral-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-neutral-50 px-6 py-4">
              <SkeletonBlock className="h-4 w-36" />
              <SkeletonBlock className="h-3 w-14" />
            </div>
            <div className="divide-y divide-neutral-50">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-6 py-3.5">
                  <SkeletonBlock className="h-8 w-8 flex-shrink-0 rounded-xl" />
                  <div className="flex-1 space-y-1.5">
                    <SkeletonBlock className="h-3.5 w-28" />
                    <SkeletonBlock className="h-2.5 w-24" />
                  </div>
                  <SkeletonBlock className="h-6 w-14 flex-shrink-0 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
