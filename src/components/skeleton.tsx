export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-zinc-200/80 dark:bg-zinc-800/80 ${className}`}
      aria-hidden="true"
    />
  );
}

/**
 * Skeleton loader for Marketplace listing grid
 */
export function MarketplaceGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex h-full flex-col justify-between rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="space-y-4">
            {/* Badges row */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-14 rounded" />
              <Skeleton className="h-5 w-20 rounded" />
              <Skeleton className="ml-auto h-4 w-12 rounded" />
            </div>

            {/* Title & description */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-4/5" />
              <Skeleton className="h-5 w-3/5" />
              <div className="space-y-1.5 pt-1">
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-2/3" />
              </div>
            </div>

            {/* Party info */}
            <div className="flex items-center gap-2.5 pt-2">
              <Skeleton className="h-7 w-7 rounded-full shrink-0" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>

          {/* Footer budget & meta */}
          <div className="mt-5 border-t border-zinc-100 pt-3 dark:border-zinc-800 flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton loader for Dashboard Stat Cards
 */
export function DashboardStatsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {[1, 2, 3].map((idx) => (
        <div
          key={idx}
          className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-2"
        >
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-8 w-14" />
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton loader for Dashboard Pending Invitations
 */
export function DashboardInvitationsSkeleton({ count = 2 }: { count?: number }) {
  return (
    <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24 rounded" />
            </div>
            <Skeleton className="h-3.5 w-3/4" />
            <Skeleton className="h-3 w-48" />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Skeleton className="h-8 w-32 rounded-lg" />
            <Skeleton className="h-8 w-16 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton loader for My Opportunities list
 */
export function OpportunitiesListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="block rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-14 rounded" />
                <Skeleton className="h-5 w-20 rounded" />
                <Skeleton className="h-5 w-16 rounded" />
              </div>
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3.5 w-1/2" />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Skeleton className="h-8 w-20 rounded-lg" />
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton loader for Marketplace Detail Page
 */
export function MarketplaceDetailSkeleton() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Skeleton className="h-5 w-40" />

      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 space-y-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-14 rounded" />
          <Skeleton className="h-5 w-24 rounded" />
          <Skeleton className="ml-auto h-4 w-28" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-7 w-4/5" />
          <Skeleton className="h-7 w-2/3" />
        </div>

        <div className="flex items-center gap-3 border-y border-zinc-100 py-3 dark:border-zinc-800">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3.5 w-24" />
          </div>
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/5" />
        </div>

        <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800/50 space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-6 w-44" />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton loader for Matching Run Result Page
 */
export function MatchingResultsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-3.5 w-28" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-16 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 border-t border-zinc-100 pt-3 dark:border-zinc-800">
            {[1, 2, 3, 4, 5].map((b) => (
              <div key={b} className="space-y-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-10" />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Skeleton className="h-9 w-28 rounded-lg" />
            <Skeleton className="h-9 w-32 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
