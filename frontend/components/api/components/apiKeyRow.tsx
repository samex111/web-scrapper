import { formatDate, formatRelative } from "@/lib/utils";
import { ApiKey } from "../apiDashboard";
import { Button } from "@/components/ui/button";
export function ApiKeyRow({ apiKey }: { apiKey: ApiKey }) {

  return (
    <div className="grid grid-cols-5 py-3 border-b border-white/[0.04] text-xs items-center hover:bg-[#1a1a1a] transition-colors duration-150">

      <span className="text-white">{apiKey.name}</span>

      <span className="inline-block w-fit bg-[#1a1a1a] text-white  py-0.5 rounded tracking-wider">
        {apiKey.keyPrefix}••••
      </span>

      <span className="text-white text-[11px]">{formatDate(apiKey.createdAt)}</span>

      <span className="text-white text-[11px]">
        {apiKey.lastUsedAt ? formatRelative(apiKey.lastUsedAt) : "Never"}
      </span>

      <div className="flex items-center gap-2">
       
        <span
          className={`w-1.5 h-1.5 rounded-full inline-block flex-shrink-0 ${apiKey.isActive ? "bg-emerald-400 shadow-[0_0_6px_#34d399]" : "bg-red-400"
            }`}
        />
        <span className={`text-[10px] uppercase tracking-wider ${apiKey.isActive ? "text-emerald-400" : "text-red-400"}`}>
          {apiKey.isActive ? "Active" : "Revoked"} 
        </span>
           {apiKey.isActive ? <Button  variant={'ghost'} className="text-red-400 ml-5 hover:bg-transparent hover:text-red-500">Revoke</Button> : ''}
      </div>

    </div>
  );
}
