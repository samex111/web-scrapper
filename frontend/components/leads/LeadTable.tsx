"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import LeadCard from "./LeadCard";
import { useLeads } from "@/hooks/useLeads";
import LeadsSkeleton from "@/LeadsSkeleton/LeadsSkeleton";


interface Lead {
  id: string;
  website: string;
  name: string;
  businessType: string;
  email: string;
  leadScore: number;
  priority: "LOW" | "MEDIUM" | "HIGH";
  socials: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  createdAt: string;
}

export default function LeadTable() {
  const parentRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
 const { leads, loading, error } = useLeads();

/* -------------------- STATE -------------------- */
  const [selected, setSelected] = useState<Lead | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const [colWidth, setColWidth] = useState({
    index: 60,
    website: 200,
    name: 180,
    business: 160,
    email: 220,
    score: 100,
    socials: 180,
    date: 140,
  });

  /* -------------------- VIRTUALIZATION -------------------- */
  const rowVirtualizer = useVirtualizer({
    count: leads.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64,
    overscan: 10,
  });

  /* -------------------- KEYBOARD NAV -------------------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, leads.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter") {
        setSelected(leads[activeIndex]);
      }
      if (e.key === "Escape") {
        setSelected(null);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, leads]);

  /* -------------------- RESIZE HANDLER -------------------- */
  const startResize = (key: keyof typeof colWidth, startX: number) => {
    const startWidth = colWidth[key];

    const onMove = (e: MouseEvent) => {
      setColWidth((prev) => ({
        ...prev,
        [key]: Math.max(60, startWidth + e.clientX - startX),
      }));
    };

    const onUp = () => {
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const columns = [
    { label: "#", key: "index" as const },
    { label: "Website", key: "website" as const },
    { label: "Name", key: "name" as const },
    { label: "Business Type", key: "business" as const },
    { label: "Email", key: "email" as const },
    { label: "Lead Score", key: "score" as const },
    { label: "Social Links", key: "socials" as const },
    { label: "Date Added", key: "date" as const },
  ];

  const getPriorityColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500/20 text-emerald-400 border-emerald-500/40";
    if (score >= 60) return "bg-amber-500/20 text-amber-400 border-amber-500/40";
    return "bg-rose-500/20 text-rose-400 border-rose-500/40";
  };
    if(loading) {

    return (
      <LeadsSkeleton/>
    )
  }

  return (
    <div className="relative h-[calc(100vh-8rem)] rounded-xl bg-gradient-to-br from-[#0B0D12] via-[#0F1117] to-[#0B0D12] border border-white/10 shadow-2xl overflow-hidden">
      {/* Main Container with Horizontal Scroll */}
      <div
        ref={scrollContainerRef}
        className="h-full overflow-auto"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#374151 #1f2937",
        }}
      >
        <div className="min-w-max">
          {/* ================= FIXED HEADER ================= */}
          <div className="sticky top-0 z-40 bg-[#0B0D12] border-b border-white/10 shadow-lg">
            <div className="flex">
              {columns.map((col) => (
                <div
                  key={col.key}
                  style={{ width: colWidth[col.key] }}
                  className={cn(
                    "relative px-4 py-4 text-xs font-semibold text-white/90 uppercase tracking-wider border-r border-white/5 last:border-r-0",
                    col.key === "index" && "sticky left-0 z-50 bg-[#0B0D12] border-r border-white/10"
                  )}
                >
                  {col.label}

                  {/* Resize Handle */}
                  <div
                    className="absolute right-0 top-0 h-full w-1.5 cursor-col-resize hover:bg-blue-500/50 active:bg-blue-500 transition-colors"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      startResize(col.key, e.clientX);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ================= VIRTUALIZED BODY ================= */}
          <div
            ref={parentRef}
            className="relative overflow-y-auto overflow-x-hidden"
            style={{ height: "calc(100% - 57px)" }}
          >
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                position: "relative",
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const lead = leads[virtualRow.index];
                const isSelected = activeIndex === virtualRow.index;

                return (
                  <div
                    key={lead.id}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    onClick={() => {
                      setSelected(lead);
                      setActiveIndex(virtualRow.index);
                    }}
                    className={cn(
                      "flex cursor-pointer transition-all duration-150 border-b border-white/5",
                      isSelected
                        ? "bg-gray-700/50"
                        : "hover:bg-white/5"
                    )}
                  >
                    {/* Index - Sticky Column */}
                    <div
                      style={{ width: colWidth.index }}
                      className="sticky left-0 z-30 bg-[#0B0D12] flex items-center justify-center px-4 text-white/70 font-medium border-r border-white/10"
                    >
                      {virtualRow.index + 1}
                    </div>

                    {/* Website */}
                    <div
                      style={{ width: colWidth.website }}
                      className="flex items-center px-4 border-r border-white/5"
                    >
                      {lead.website ? (
                        <a
                          href={lead.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 hover:underline truncate text-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {new URL(lead.website).hostname}
                        </a>
                      ) : (
                        <span className="text-white/30">—</span>
                      )}
                    </div>

                    {/* Name */}
                    <div
                      style={{ width: colWidth.name }}
                      className="flex items-center px-4 text-white font-medium border-r border-white/5 truncate text-sm"
                    >
                      {lead.name}
                    </div>

                    {/* Business Type */}
                    <div
                      style={{ width: colWidth.business }}
                      className="flex items-center px-4 border-r border-white/5"
                    >
                      <span className="px-2.5 py-1 rounded-md bg-white/10 text-white/80 text-xs font-medium truncate">
                        {lead.businessType}
                      </span>
                    </div>

                    {/* Email */}
                    <div
                      style={{ width: colWidth.email }}
                      className="flex items-center px-4 border-r border-white/5"
                    >
                      {lead.email ? (
                        <a
                          href={`mailto:${lead.email}`}
                          className="text-white/70 hover:text-blue-400 truncate text-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {lead.email}
                        </a>
                      ) : (
                        <span className="text-white/30">—</span>
                      )}
                    </div>

                    {/* Score */}
                    <div
                      style={{ width: colWidth.score }}
                      className="flex items-center justify-center px-4 border-r border-white/5"
                    >
                      <span
                        className={cn(
                          "px-3 py-1.5 rounded-full font-bold text-sm border",
                          getPriorityColor(lead.leadScore)
                        )}
                      >
                        {lead.leadScore}
                      </span>
                    </div>

                    {/* Socials */}
                    <div
                      style={{ width: colWidth.socials }}
                      className="flex items-center px-4 gap-3 border-r border-white/5"
                    >
                      {lead.socials?.github && (
                        <a
                          href={lead.socials.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/50 hover:text-purple-400 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                          title="GitHub"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                        </a>
                      )}
                      {lead.socials?.linkedin && (
                        <a
                          href={lead.socials.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/50 hover:text-blue-400 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                          title="LinkedIn"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                          </svg>
                        </a>
                      )}
                      {lead.socials?.twitter && (
                        <a
                          href={lead.socials.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/50 hover:text-sky-400 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                          title="Twitter"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            
                          </svg>
                        </a>
                      )}
                      {lead.socials?.facebook && (
                        <a
                          href={lead.socials.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/50 hover:text-blue-500 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                          title="Facebook"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                        </a>
                      )}
                    </div>

                    {/* Date */}
                    <div
                      style={{ width: colWidth.date }}
                      className="flex items-center px-4 text-white/50 text-sm"
                    >
                      {new Date(lead.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ================= DETAILS CARD ================= */}
      {selected && (
        <div className="absolute right-6 bottom-6 z-50 w-[400px] animate-in slide-in-from-right-4 duration-300">
          <div className="bg-[#0F1117] backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl p-1">
            <div className="relative">
              <button
                onClick={() => {
                  setSelected(null);
                }}
                className="absolute top-1 right-1 z-10 p-2 rounded-lg  text-black hover:text-gray-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <LeadCard lead={selected} />
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Hint */}
      <div className="absolute bottom-4 left-4 text-xs text-white/30 space-y-1">
        <div>↑↓ Navigate • Enter Select • Esc Close</div>
      </div>
    </div>
  );
}
