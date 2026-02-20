"use client";

import { UsageSkeleton } from "@/dashboardskeleton/UsageSkeleton";
import { getUser } from "@/lib/api";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function UsageCard() {
  
    const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const data = await getUser();
      setUser(data.user);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <UsageSkeleton/>;

  const percentage = (user?.usedThisMonth / user?.monthlyQuota) * 100;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-xl bg-white/5 border border-white/10 p-6"
    >
      <div className="flex justify-between mb-4">
        <div>
          <h3 className="text-sm text-[#8B8F97]">
            Usage This Month
          </h3>
          <p className="text-xs text-[#6F7480]">
            Resets monthly
          </p>
        </div>

        <div className="text-right">
          <p className="text-xl font-semibold text-[#E7E9EE]">
            {user.usedThisMonth} / {user.monthlyQuota}
          </p>
          <p className="text-xs text-[#6F7480]">credits</p>
        </div>
      </div>

      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6 }}
          className="h-full bg-emerald-400/80"
        />
      </div>
    </motion.div>
  );
}
