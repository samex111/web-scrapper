"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { LeadCard } from "./LeadCard";

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

export function LeadTable({ leads }: { leads: Lead[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  /* -------------------- STATE -------------------- */
  const [selected, setSelected] = useState<Lead | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const [colWidth, setColWidth] = useState({
    index: 60,
    website: 160,
    name: 180,
    business: 160,
    email: 220,
    score: 80,
    socials: 260,
    date: 120,
  });

  /* -------------------- VIRTUALIZATION -------------------- */
  const rowVirtualizer = useVirtualizer({
    count: leads.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 8,
  });

  /* -------------------- KEYBOARD NAV -------------------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        setActiveIndex((i) => Math.min(i + 1, leads.length - 1));
      }
      if (e.key === "ArrowUp") {
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
        [key]: Math.max(80, startWidth + e.clientX - startX),
      }));
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <div className="relative rounded-xl bg-white/5 border border-white/10 overflow-hidden">

      {/* ================= HEADER ================= */}
      <Table>
        <TableHeader>
          <TableRow className="bg-[#0B0D12]">
            {[
              ["#", "index"],
              ["Website", "website"],
              ["Name", "name"],
              ["Business", "business"],
              ["Email", "email"],
              ["Score", "score"],
              ["Socials", "socials"],
              ["Date", "date"],
            ].map(([label, key]) => (
              <TableHead
                key={key}
                style={{ width: colWidth[key as keyof typeof colWidth] }}
                className={cn(
                  "relative select-none",
                  key === "index" && "sticky left-0 z-30 bg-[#0B0D12]"
                )}
              >
                {label}
                <div
                  className="absolute right-0 top-0 h-full w-1 cursor-col-resize"
                  onMouseDown={(e) =>
                    startResize(key as keyof typeof colWidth, e.clientX)
                  }
                />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
      </Table>

      {/* ================= BODY ================= */}
      <ScrollArea ref={parentRef} className="h-[80vh]">
        <div
          style={{
            height: rowVirtualizer.getTotalSize(),
            position: "relative",
          }}
        >
          <Table>
            <TableBody>
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const lead = leads[virtualRow.index];
                return (
                  <TableRow
                    key={lead.id}
                    style={{
                      position: "absolute",
                      top: 0,
                      transform: `translateY(${virtualRow.start}px)`,
                      width: "100%",
                    }}
                    onClick={() => setSelected(lead)}
                    className={cn(
                      "cursor-pointer transition-colors",
                      virtualRow.index === activeIndex
                        ? "bg-white/10"
                        : "hover:bg-white/5"
                    )}
                  >
                    {/* Index (sticky) */}
                    <TableCell
                      style={{ width: colWidth.index }}
                      className="sticky left-0 z-20 bg-[#0B0D12] text-[#E7E9EE]"
                    >
                      {virtualRow.index + 1}
                    </TableCell>

                    <TableCell style={{ width: colWidth.website }}>
                      {lead.website
                        ? new URL(lead.website).hostname
                        : "-"}
                    </TableCell>

                    <TableCell style={{ width: colWidth.name }}>
                      {lead.name}
                    </TableCell>

                    <TableCell
                      style={{ width: colWidth.business }}
                      className="text-[#8B8F97]"
                    >
                      {lead.businessType}
                    </TableCell>

                    <TableCell
                      style={{ width: colWidth.email }}
                      className="text-[#8B8F97] truncate"
                    >
                      {lead.email || "-"}
                    </TableCell>

                    <TableCell style={{ width: colWidth.score }}>
                      <span className="font-semibold">
                        {lead.leadScore}
                      </span>
                    </TableCell>

                    <TableCell style={{ width: colWidth.socials }}>
                      <div className="flex flex-col text-sm">
                        <span className="truncate">{lead.socials?.github}</span>
                        <span className="truncate">{lead.socials?.linkedin}</span>
                        <span className="truncate">{lead.socials?.twitter}</span>
                      </div>
                    </TableCell>

                    <TableCell
                      style={{ width: colWidth.date }}
                      className="text-[#6F7480]"
                    >
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>

      {/* ================= DETAILS CARD ================= */}
      {selected && (
        <div className="absolute right-4 bottom-4 z-50 w-[360px]">
          <LeadCard lead={selected} />
        </div>
      )}
    </div>
  );
}
