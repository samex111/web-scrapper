import { SNIPPETS } from "@/lib/utils";
import { useState } from "react";

export function QuickStart() {
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
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[11px] tracking-[0.2em] uppercase  font-normal m-0">
      {children}
    </h2>
  );
}
