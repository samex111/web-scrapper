export function UsageSkeleton() {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-6 animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-white/10 rounded" />
          <div className="h-3 w-24 bg-white/5 rounded" />
        </div>

        <div className="space-y-2 text-right">
          <div className="h-6 w-20 bg-white/10 rounded" />
          <div className="h-3 w-12 bg-white/5 rounded" />
        </div>
      </div>

      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full w-1/3 bg-white/20 rounded-full" />
      </div>
    </div>
  );
}
