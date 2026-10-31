// Skeleton loading state for the Enquiries page

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-neutral-100 ${className ?? ''}`}
      aria-hidden
    />
  )
}

export default function EnquiriesLoading() {
  return (
    <div aria-busy="true" aria-label="Loading enquiries…">
      {/* Page header */}
      <div className="mb-6 space-y-2">
        <SkeletonBlock className="h-2.5 w-20" />
        <SkeletonBlock className="h-8 w-56" />
        <SkeletonBlock className="h-3 w-72" />
      </div>

      {/* Tab bar */}
      <div className="mb-6 flex gap-1 rounded-2xl border border-neutral-200 bg-neutral-50 p-1">
        <div className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 shadow-sm">
          <SkeletonBlock className="h-3.5 w-3.5 rounded-full" />
          <SkeletonBlock className="h-3.5 w-28" />
          <SkeletonBlock className="h-4 w-6 rounded-full" />
        </div>
        <div className="flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5">
          <SkeletonBlock className="h-3.5 w-3.5 rounded-full" />
          <SkeletonBlock className="h-3.5 w-24" />
          <SkeletonBlock className="h-4 w-6 rounded-full" />
        </div>
      </div>

      {/* Enquiry rows */}
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-neutral-100 bg-white"
          >
            <div className="flex items-start gap-4 px-5 py-4">
              <SkeletonBlock className="mt-1 h-2 w-2 flex-shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <SkeletonBlock className="h-4 w-36" />
                <div className="flex gap-4">
                  <SkeletonBlock className="h-3 w-40" />
                  <SkeletonBlock className="h-3 w-24" />
                </div>
                <SkeletonBlock className="h-3 w-4/5" />
              </div>
              <SkeletonBlock className="h-3 w-12 flex-shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
