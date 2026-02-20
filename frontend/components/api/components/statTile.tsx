export function StatTile({
  label,
  value,
  valueClass,
  topBorderClass,
}: {
  label: string;
  value: string;
  valueClass: string;
  topBorderClass: string;
}) {
  return (
    <div className={`bg-white/[0.025] border border-white/[0.07] border-t-2 ${topBorderClass} rounded-xl p-5`}>
      <p className="text-[10px] tracking-[0.2em] uppercase  mb-1">{label}</p>
      <h3 className={`text-xl font-medium tracking-tight ${valueClass}`}>{value}</h3>
    </div>
  );
}
