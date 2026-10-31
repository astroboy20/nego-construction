// Skeleton loading state for the Feature Requests page

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-neutral-100 ${className ?? ''}`}
      aria-hidden
    />
  )
}

export default function FeatureRequestsLoading() {
  return (
    <div aria-busy="true" aria-label="Loading feature requests…">
      {/* Page header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="space-y-2">
          <SkeletonBlock className="h-2.5 w-16" />
          <SkeletonBlock className="h-8 w-48" />
          <SkeletonBlock className="h-3 w-72" />
        </div>
        <SkeletonBlock className="h-9 w-32 flex-shrink-0 rounded-xl" />
      </div>

      {/* Summary strip */}
      <div className="mb-6 flex flex-wrap gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-neutral-100 bg-white px-5 py-3.5 shadow-sm space-y-2 text-center min-w-[80px]"
          >
            <SkeletonBlock className="h-7 w-8 mx-auto" />
            <SkeletonBlock className="h-2.5 w-10 mx-auto" />
          </div>
        ))}
      </div>

      {/* Status filter pills */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-7 w-16 rounded-full" />
        ))}
      </div>

      {/* Request rows */}
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-neutral-100 bg-white"
          >
            <div className="flex items-start gap-4 px-5 py-4">
              <SkeletonBlock className="mt-1 h-2 w-2 flex-shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <SkeletonBlock className="h-4 w-40" />
                  <SkeletonBlock className="ml-auto h-5 w-20 rounded-full" />
                </div>
                <div className="flex gap-4">
                  <SkeletonBlock className="h-3 w-24" />
                  <SkeletonBlock className="h-3 w-36" />
                  <SkeletonBlock className="h-3 w-20" />
                </div>
                <SkeletonBlock className="h-3 w-3/4" />
              </div>
              <SkeletonBlock className="h-4 w-4 flex-shrink-0 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
