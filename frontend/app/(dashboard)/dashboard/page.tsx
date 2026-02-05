'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { UsageCard } from '@/components/dashboard/UsageCard';
import { JobCard } from '@/components/jobs/JobCard';
import { getJobs, getStats } from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   loadData();
  // }, []);

  // const loadData = async () => {
  //   try {
  //     const [statsData, jobsData] = await Promise.all([
  //       getStats(),
  //       getJobs({ limit: 5 }),
  //     ]);

  //     setStats(statsData);
  //     setRecentJobs(jobsData.jobs);
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your overview.</p>
      </div>

      {/* Usage Card */}
      <UsageCard />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          label="Total Leads"
          value={stats?.totalLeads || 0}
          icon="👥"
          trend="+12%"
        />
        <StatsCard
          label="High Priority"
          value={stats?.highPriorityLeads || 0}
          icon="🔥"
          trend="+8%"
        />
        <StatsCard
          label="Jobs This Month"
          value={stats?.jobsThisMonth || 0}
          icon="📊"
        />
        <StatsCard
          label="Success Rate"
          value={`${stats?.successRate || 0}%`}
          icon="✅"
        />
      </div>

      {/* Recent Jobs */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Jobs</h2>
          <button
            onClick={() => router.push('/jobs')}
            className="text-sm text-blue-600 hover:underline"
          >
            View all
          </button>
        </div>

        <div className="space-y-4">
          {recentJobs.length === 0 ? (
            <div className="bg-white rounded-lg border p-8 text-center">
              <p className="text-gray-600 mb-4">No jobs yet</p>
              <button
                onClick={() => router.push('/jobs/new')}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Create Your First Job
              </button>
            </div>
          ) : (
            recentJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}