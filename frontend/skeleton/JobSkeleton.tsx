export function JobSkeleton() {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-6 animate-pulse">
      <div className="flex justify-between mb-3">
        <div className="h-4 w-40 bg-white/10 rounded" />
        <div className="h-3 w-16 bg-white/20 rounded-full" />
      </div>

      <div className="h-3 w-64 bg-white/5 rounded mb-4" />

      <div className="flex justify-between">
        <div className="h-3 w-24 bg-white/5 rounded" />
        <div className="h-3 w-20 bg-white/10 rounded" />
      </div>
    </div>
  );
}
