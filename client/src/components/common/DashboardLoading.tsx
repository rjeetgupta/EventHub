/** Skeleton grid shown while dashboard data loads. */
export function DashboardLoading({ rows = 1 }: { rows?: number }) {
  return (
    <div
      aria-busy="true"
      aria-label="Loading dashboard"
      className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
    >
      {Array.from({ length: 4 * rows }, (_, index) => (
        <div
          className="h-28 animate-pulse rounded-lg bg-muted"
          key={index}
        />
      ))}
      <div className="col-span-full h-96 animate-pulse rounded-lg bg-muted" />
    </div>
  );
}
