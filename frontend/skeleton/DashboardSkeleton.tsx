import { UsageSkeleton } from "./UsageSkeleton";
import { StatsSkeleton } from "./StatsSkeleton";
import { JobSkeleton } from "./JobSkeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2 animate-pulse">
        <div className="h-6 w-40 bg-white/10 rounded" />
        <div className="h-4 w-64 bg-white/5 rounded" />
      </div>

      {/* Usage */}
      <UsageSkeleton />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsSkeleton />
        <StatsSkeleton />
        <StatsSkeleton />
        <StatsSkeleton />
      </div>

      {/* Jobs */}
      <div className="space-y-4">
        <JobSkeleton />
        <JobSkeleton />
      </div>
    </div>
  );
}
