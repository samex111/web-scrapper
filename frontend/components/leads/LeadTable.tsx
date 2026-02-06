"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getLeads } from "@/lib/api";
import { DashboardSkeleton } from "@/dashboardskeleton/DashboardSkeleton";
import LeadsSkeleton from "@/LeadsSkeleton/LeadsSkeleton";
import LeadCard from "./LeadCard";

export function LeadTable() {
  const router = useRouter();
  const [leads, setLeads] = useState<any[]>([]);
  const [showCard,setShowCard] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selected,setSelected] = useState<any>(null);


  useEffect(() => {
    const loadLeads = async () => {
      try {
        const data = await getLeads();
        setLeads(data.leads || []);
      } catch (err) {
        console.error("Failed to load leads", err);
      } finally {
        setLoading(false);
      }
    };

    loadLeads();
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "destructive";
      case "MEDIUM":
        return "warning";
      case "LOW":
        return "secondary";
      default:
        return "secondary";
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border  border-none p-6 text-[#8B8F97]">
        <LeadsSkeleton/>
      </div>
    );
  }

  return (
    <div className="relative flex-1 rounded-xl overflow-hidden bg-white/5 border border-white/10">

  {/* ================= HEADER (NON-SCROLL) ================= */}
  <Table>
    <TableHeader>
      <TableRow className="border-none bg-[#0B0D12]">
        <TableHead className="w-[60px]">Index</TableHead>
        <TableHead className="w-[160px]">Website</TableHead>
        <TableHead className="w-[180px]">Name</TableHead>
        <TableHead className="w-[160px]">Business</TableHead>
        <TableHead className="w-[220px]">Email</TableHead>
        <TableHead className="w-[80px knowing">Score</TableHead>
        <TableHead className="w-[260px]">Socials</TableHead>
        <TableHead className="w-[120px]">Date</TableHead>
      </TableRow>
    </TableHeader>
  </Table>

  {/* ================= BODY (SCROLLABLE) ================= */}
  <ScrollArea className="h-[80vh]">
    <Table>
      <TableBody>
        {leads.map((lead, i) => (
          <TableRow
            key={lead.id}
            onClick={() => {
              setSelected(lead);
              setShowCard(true);
            }}
            className="cursor-pointer border-none hover:bg-white/5 transition-colors"
          >
            <TableCell className="w-[60px] text-[#E7E9EE]">
              {i + 1}
            </TableCell>

            <TableCell className="w-[160px] text-[#E7E9EE]">
              {lead.website ? new URL(lead.website).hostname : "-"}
            </TableCell>

            <TableCell className="w-[180px] text-[#E7E9EE]">
              {lead.name || "-"}
            </TableCell>

            <TableCell className="w-[160px] text-[#8B8F97]">
              {lead.businessType || "-"}
            </TableCell>

            <TableCell className="w-[220px] text-[#8B8F97] truncate">
              {lead.email || "-"}
            </TableCell>

            <TableCell className="w-[80px] font-semibold text-[#E7E9EE]">
              {lead.leadScore}
            </TableCell>

            <TableCell className="w-[260px]">
              <div className="flex flex-col gap-1 text-sm text-[#E7E9EE]">
                <span className="truncate">{lead.socials?.github}</span>
                <span className="truncate">{lead.socials?.linkedin}</span>
                <span className="truncate">{lead.socials?.twitter}</span>
                <span className="truncate">{lead.socials?.facebook}</span>
              </div>
            </TableCell>

            <TableCell className="w-[120px] text-[#6F7480]">
              {new Date(lead.createdAt).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </ScrollArea>

  {/* ================= OVERLAY CARD ================= */}
  {showCard && selected && (
    <div className="absolute right-4 bottom-4 z-50">
      <LeadCard lead={selected} />
    </div>
  )}
</div>

  );
}
