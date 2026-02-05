export function StatsSkeleton() {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-6 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-3 w-24 bg-white/10 rounded" />
          <div className="h-6 w-16 bg-white/20 rounded" />
        </div>

        <div className="h-6 w-6 bg-white/10 rounded-md" />
      </div>
    </div>
  );
}
