"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { UsageCard } from "@/components/dashboard/UsageCard";
import { JobCard } from "@/components/jobs/JobCard";
import { getUser } from "@/lib/api";
import { useEffect, useState } from "react";
import { DashboardSkeleton } from "@/dashboardskeleton/DashboardSkeleton";
import { Users, BarChart3, CheckCircle } from "lucide-react";

interface DashboardData {
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    plan: string;
    monthlyQuota: number;
    usedThisMonth: number;
  };
  stats: {
    totalJobs: number;  
    completedJobs: number;
    totalLeads: number;
    jobsThisMonth: number;
    todayJobs : number;
  };
}

export default function DashboardPage() {
  const router = useRouter();

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const res = await getUser();
      setData(res); 
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <DashboardSkeleton />;

  const stats = data?.stats;
  const profile = data?.user;

  const successRate =
    stats?.totalJobs && stats.totalJobs > 0
      ? Math.round((stats.completedJobs / stats.totalJobs) * 100)
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-[#E7E9EE]">
          Dashboard
        </h1>
        <p className="text-sm text-[#8B8F97]">
          Overview of your platform activity
        </p>
      </div>

      <UsageCard
       
      />

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard onClick={()=>router.push('/leads')}
          label="Total Leads"
          value={stats?.totalLeads || 0}
          icon={Users}
        />

        <StatsCard onClick={()=>router.push('/jobs')}
          label="Jobs This Month"
          value={stats?.jobsThisMonth || 0}
          icon={BarChart3}
        />

        <StatsCard
          label="Success Rate"
          value={`${successRate}%`}
          icon={CheckCircle}
        />
      </div>

      {/* RECENT JOBS */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-[#E7E9EE]">
            Recent Jobs
          </h2>

          <button
            onClick={() => router.push("/jobs")}
            className="text-sm text-[#8B8F97] hover:text-[#E7E9EE]"
          >
            View all
          </button>
        </div>

        <JobCard todayJobs={stats?.todayJobs} />
      </div>
    </motion.div>
  );
}
