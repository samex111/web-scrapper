'use client';

import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

export function JobCard({ job }: { job: any }) {
  const router = useRouter();

  const statusColors = {
    QUEUED: 'bg-gray-100 text-gray-800',
    PROCESSING: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-green-100 text-green-800',
    FAILED: 'bg-red-100 text-red-800',
  };

  return (
    <div
      onClick={() => router.push(`/jobs/${job.id}`)}
      className="bg-white rounded-lg border hover:shadow-md transition cursor-pointer p-6"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">
            {job.name || `Job #${job.id.slice(0, 8)}`}
          </h3>
          <p className="text-sm text-gray-600">
            {job.totalUrls} URLs • {job.completed} completed • {job.failed} failed
          </p>
        </div>
        <Badge className={statusColors[job.status as keyof typeof statusColors]}>
          {job.status}
        </Badge>
      </div>

      {/* Progress Bar */}
      {job.status === 'PROCESSING' && (
        <div className="mb-4">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${(job.completed / job.totalUrls) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-1">
            {Math.round((job.completed / job.totalUrls) * 100)}% complete
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>
          {new Date(job.createdAt).toLocaleDateString()} at{' '}
          {new Date(job.createdAt).toLocaleTimeString()}
        </span>
        {job.status === 'COMPLETED' && (
          <button className="text-blue-600 hover:underline">
            View Results →
          </button>
        )}
      </div>
    </div>
  );
}