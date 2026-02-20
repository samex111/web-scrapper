'use client';

import GenerateApi, { getDetails } from "@/lib/api";
import { useEffect, useState, useCallback } from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";

/* ================= TYPES ================= */

interface GetDetailsResponse {
  success: boolean;
  data: PlanDetails[];
}

interface PlanDetails {
  plan: string;
  monthlyQuota: number;
  usedThisMonth: number;
  apiKeys: ApiKey[];
}

interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  createdAt: string;
  lastUsedAt: string | null;
  isActive: boolean;
}

/* ================= PAGE ================= */

export default function ApiPage() {
  const [details, setDetails] = useState<GetDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false)

  const plan = details?.data?.[0];

  const loadDetails = useCallback(async () => {
    setLoading(true);

    const res = await getDetails();
    setDetails(res);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadDetails();
  }, [loadDetails]);

  async function handleGenerate() {
    setGenerating(true);
    const res = await GenerateApi();
    setNewKey(res.apiKey);
    setOpen(true);
    await loadDetails();
    setGenerating(false);
  }

  // if (loading) return <PageLoader />;

  const used = plan?.usedThisMonth ?? 0;
  const quota = plan?.monthlyQuota ?? 0;
  const usagePercent = quota ? Math.min((used / quota) * 100, 100) : 0;
  const activeKeys = plan?.apiKeys?.filter((k) => k.isActive).length ?? 0;

  const usageBarColor =
    usagePercent > 85 ? "bg-red-400" : usagePercent > 60 ? "bg-orange-400" : "bg-emerald-400";

  const usageTextColor =
    usagePercent > 85
      ? "text-red-400"
      : usagePercent > 60
        ? "text-orange-400"
        : "text-emerald-400";
  const isDisabled = details?.data?.some(
    item => item.plan === "FREE" && item.apiKeys.length >= 1
  );
const handleCopy = async () => {
  await navigator.clipboard.writeText(newKey)
  setCopied(true)

  setTimeout(() => setCopied(false), 2000)
}
  return (
    <div className="min-h-screen  text-white p-8 font-mono">

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#34d399] animate-pulse" />
        <h1 className="text-xs tracking-[0.25em]  uppercase  font-semibold">
          API Management
        </h1>
        <span className="ml-auto text-[11px]  tracking-widest">
          scrappex.com/v1
        </span>
      </div>

      {/* Stat Strip */}
      <div className="grid grid-cols-3 gap-4 mb-6">

        <StatTile label="Plan" value={plan?.plan ?? "—"} valueClass="text-emerald-400" topBorderClass="border-t-emerald-400" />

        {/* Usage tile (inline because of dynamic bar) */}
        <div className="bg-white/[0.025] border border-white/[0.07] border-t-2 border-t-orange-400 rounded-xl p-5">
          <p className="text-[10px] tracking-[0.2em] uppercase  mb-1">Usage</p>
          <h3 className={`text-xl font-medium tracking-tight mb-2 ${usageTextColor}`}>
            {used.toLocaleString()} / {quota.toLocaleString()}
          </h3>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${usageBarColor}`}
              style={{ width: `${usagePercent}%` }}
            />
          </div>
          <span className="text-[10px]  mt-1 block">
            {usagePercent.toFixed(1)}% consumed
          </span>
        </div>

        <StatTile label="Active Keys" value={String(activeKeys)} valueClass="text-violet-400" topBorderClass="border-t-violet-400" />

      </div>

      {/* API Keys Panel */}
      <div className="bg-white/[0.025] border border-white/[0.07] rounded-xl p-6 mb-6">

        {/* Panel Header */}
        {/* Panel Header */}
        <div className="flex justify-between items-center mb-5 relative group">

          <SectionLabel>API Keys</SectionLabel>

          <button
            onClick={handleGenerate}
            disabled={isDisabled}
            className="text-[11px] tracking-[0.12em] uppercase px-4 py-1.5 rounded-md border 
                 transition-all duration-200 font-mono
                 enabled:border-white enabled:text-white enabled:bg-white/10 enabled:hover:bg-white/20
                 disabled:border-white/20 disabled:text-white/40 disabled:cursor-not-allowed"
          >
            {generating ? "Generating…" : "+ New Key"}
          </button>
          <Dialog open={open} onOpenChange={(v) => {
            setOpen(v)
            if (!v) setNewKey("")   
          }}>

            <DialogContent className="sm:max-w-md bg-[#1a1a1a] border-0 text-white">

              <DialogHeader>
                <DialogTitle>API key created</DialogTitle>
                <DialogDescription>
                  This is the only time you’ll see this key. Store it securely.
                </DialogDescription>
              </DialogHeader>

              <div className="text-white rounded-md bg-transparent px-3 py-2 font-mono text-sm break-all">
                {newKey}
              </div>

              <div className="flex gap-2 mt-4">

                <Button variant={'secondary'} onClick={handleCopy} className="w-full ">
                  {copied ? "Copied ✓" : "Copy"}
                </Button>
              </div>

            </DialogContent>
          </Dialog>

          {isDisabled && (
            <span className="absolute right-0 bottom-full mb-2 hidden group-hover:block 
                       text-xs bg-black text-white px-2 py-1 rounded whitespace-nowrap">
              Only one key allowed in FREE plan
            </span>
          )}

        </div>

        {/* Table Head */}
        <div className="grid grid-cols-5 pb-2 border-b border-white/[0.06] text-[10px] tracking-[0.18em] uppercase ">
          {["Name", "Key", "Created", "Last Used", "Status"].map((h) => (
            <span key={h}>{h}</span>
          ))}
        </div>

        {plan?.apiKeys?.length ? (
          plan.apiKeys.map((key) => <ApiKeyRow key={key.id} apiKey={key} />)
        ) : (
          <div className="py-10 text-center  text-xs tracking-wider">
            No API keys yet — generate your first key above.
          </div>
        )}

      </div>

      {/* Quick Start */}
      <QuickStart />

    </div>
  );
}


function ApiKeyRow({ apiKey }: { apiKey: ApiKey }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(apiKey.keyPrefix);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="grid grid-cols-5 py-3 border-b border-white/[0.04] text-xs items-center hover:bg-[#1a1a1a] transition-colors duration-150">

      <span className="text-white">{apiKey.name}</span>

      <span className="inline-block w-fit bg-[#1a1a1a] text-white px-2 py-0.5 rounded tracking-wider">
        {apiKey.keyPrefix}••••••
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
      </div>

    </div>
  );
}


const SNIPPETS = {
  curl: `curl -X POST https://api.scrappex.com/api/api-key/scrape \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"url":"https://example.com"}'`,
  js: `const res = await fetch("https://api.scrappex.com/api/api-key/scrape", {
  method: "POST",
  headers: {
    Authorization: "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ url: "https://example.com" }),
});
const data = await res.json();`,
  python: `import requests

response = requests.post(
  "https://api.scrappex.com/api/api-key/scrape",
  headers={"Authorization": "Bearer YOUR_API_KEY"},
  json={"url": "https://example.com"},
)
print(response.json())`,
};

function QuickStart() {
  const [tab, setTab] = useState<"curl" | "js" | "python">("curl");
  const [copied, setCopied] = useState(false);

  function copySnippet() {
    navigator.clipboard.writeText(SNIPPETS[tab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="bg-white/[0.025] border border-white/[0.07] rounded-xl p-6">

      <div className="flex justify-between items-center mb-5">
        <SectionLabel>Quick Start</SectionLabel>
        <button
          onClick={copySnippet}
          className={`bg-transparent border-none text-[11px] tracking-widest cursor-pointer font-mono transition-colors duration-200
            ${copied ? "text-gray-400" : " hover:text-white"}`}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        {(["curl", "js", "python"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`text-[11px] uppercase tracking-widest px-3 py-1 rounded-md  transition-all duration-150 font-mono cursor-pointer
              ${tab === t
                ? " text-white bg-white/10"
                : " text-white  bg-transparent"
              }`}
          >
            {t}
          </button>
        ))}
      </div>

      <pre className="m-0 px-5 py-4 bg-black/30 border border-white/[0.05] rounded-lg text-xs leading-relaxed  overflow-x-auto whitespace-pre tracking-wide">
        {SNIPPETS[tab]}
      </pre>

    </div>
  );
}


function StatTile({
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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[11px] tracking-[0.2em] uppercase  font-normal m-0">
      {children}
    </h2>
  );
}




function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatRelative(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}