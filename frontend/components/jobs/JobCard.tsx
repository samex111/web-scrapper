"use client";

import { motion } from "framer-motion";

export function JobCard() {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-xl bg-white/5 border border-white/10 p-6 cursor-pointer"
    >
      <div className="flex justify-between mb-2">
        <h3 className="text-[#E7E9EE] font-medium">
          Example Job
        </h3>
        <span className="text-xs text-emerald-400">
          COMPLETED
        </span>
      </div>

      <p className="text-sm text-[#8B8F97] mb-4">
        120 URLs • Completed successfully
      </p>

      <div className="flex justify-between text-xs text-[#6F7480]">
        <span>Today</span>
        <span>View results</span>
      </div>
    </motion.div>
  );
}
