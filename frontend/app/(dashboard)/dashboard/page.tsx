"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { StatsCard } from '@/components/dashboard/StatsCard';
import { UsageCard } from '@/components/dashboard/UsageCard';
import { JobCard } from '@/components/jobs/JobCard';
import { getJobs, getStats } from '@/lib/api';
import { useEffect, useState } from 'react';
import { DashboardSkeleton } from "@/dashboardskeleton/DashboardSkeleton";
import {
  Users,
  Flame,
  BarChart3,
  CheckCircle,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (!userData) {
      router.push("/auth");
      return;
    }

    setUser(JSON.parse(userData));
    setLoading(false);
  }, [router]);

 
  if (loading) {
    return <DashboardSkeleton />;
  }


  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[#E7E9EE]">
          Dashboard
        </h1>
        <p className="text-sm text-[#8B8F97]">
          Overview of your platform activity
        </p>
      </div>

      {/* Usage */}
      <UsageCard />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          label="Total Leads"
          value={0}
          icon={Users}
        />
        <StatsCard
          label="High Priority"
          value={0}
          icon={Flame}
        />
        <StatsCard
          label="Jobs This Month"
          value={0}
          icon={BarChart3}
        />
        <StatsCard
          label="Success Rate"
          value="0%"
          icon={CheckCircle}
        />
      </div>

      {/* Recent Jobs */}
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

        <JobCard />
      </div>
    </motion.div>
  );
}
