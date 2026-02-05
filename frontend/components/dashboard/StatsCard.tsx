import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: string | number;
  icon: LucideIcon;
}

export function StatsCard({ label, value, icon: Icon }: Props) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-xl bg-white/5 border border-white/10 p-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-[#8B8F97]">{label}</p>
          <p className="text-2xl font-semibold text-[#E7E9EE]">
            {value}
          </p>
        </div>
        <Icon className="h-6 w-6 text-[#6F7480]" />
      </div>
    </motion.div>
  );
}
