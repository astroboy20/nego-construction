// Skeleton loading state for the Knowledge Base list page

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-neutral-100 ${className ?? ''}`}
      aria-hidden
    />
  )
}

export default function KnowledgeBaseLoading() {
  return (
    <div aria-busy="true" aria-label="Loading knowledge base…">
      {/* Page header */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="space-y-2">
          <SkeletonBlock className="h-2.5 w-28" />
          <SkeletonBlock className="h-8 w-24" />
        </div>
        <SkeletonBlock className="h-9 w-28 flex-shrink-0 rounded-xl" />
      </div>

      {/* Table skeleton */}
      <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
        {/* Table header */}
        <div className="flex border-b border-neutral-100 bg-neutral-50 px-5 py-3.5 gap-4">
          <SkeletonBlock className="h-2.5 w-24 flex-[3]" />
          <SkeletonBlock className="h-2.5 w-16 flex-[1]" />
          <SkeletonBlock className="h-2.5 w-12 flex-[1]" />
          <SkeletonBlock className="h-2.5 w-14 flex-[1]" />
          <SkeletonBlock className="h-2.5 w-12 flex-[1]" />
        </div>

        {/* Table rows */}
        <div className="divide-y divide-neutral-50">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center px-5 py-3.5 gap-4">
              <SkeletonBlock className="h-4 flex-[3]" style={{ maxWidth: `${50 + ((i * 11) % 35)}%` } as React.CSSProperties} />
              <SkeletonBlock className="h-3.5 w-20 flex-[1]" />
              <div className="flex-[1]">
                <SkeletonBlock className="h-5 w-20 rounded-full" />
              </div>
              <SkeletonBlock className="h-3.5 w-20 flex-[1]" />
              <div className="flex-[1]">
                <SkeletonBlock className="h-7 w-12 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
