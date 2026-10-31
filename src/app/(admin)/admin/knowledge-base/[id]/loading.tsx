// Skeleton loading state for the Knowledge Base edit page

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-neutral-100 ${className ?? ''}`}
      aria-hidden
    />
  )
}

export default function EditKBEntryLoading() {
  return (
    <div className="mx-auto max-w-2xl" aria-busy="true" aria-label="Loading entry…">
      {/* Back link + header */}
      <div className="mb-8 space-y-3">
        <SkeletonBlock className="h-3 w-32" />
        <SkeletonBlock className="h-2.5 w-24 mt-4" />
        <SkeletonBlock className="h-7 w-28" />
        <SkeletonBlock className="h-3 w-48" />
      </div>

      {/* Form card */}
      <div className="border border-neutral-200 bg-white p-8 space-y-6">
        {/* Title field */}
        <div className="space-y-2">
          <SkeletonBlock className="h-3 w-10" />
          <SkeletonBlock className="h-10 w-full rounded-lg" />
        </div>

        {/* Category + Published row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <SkeletonBlock className="h-3 w-16" />
            <SkeletonBlock className="h-10 w-full rounded-lg" />
          </div>
          <div className="space-y-2">
            <SkeletonBlock className="h-3 w-20" />
            <SkeletonBlock className="h-10 w-full rounded-lg" />
          </div>
        </div>

        {/* Content textarea */}
        <div className="space-y-2">
          <SkeletonBlock className="h-3 w-14" />
          <SkeletonBlock className="h-48 w-full rounded-lg" />
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <SkeletonBlock className="h-3 w-8" />
          <SkeletonBlock className="h-10 w-full rounded-lg" />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <SkeletonBlock className="h-9 w-20 rounded-lg" />
          <SkeletonBlock className="h-9 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  )
}
