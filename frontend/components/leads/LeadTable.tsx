"use client";

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
    <div className="rounded-xl flex-1 h-fit overflow-x-auto">
  <Table className="table-fixed w-full">

    {/* ---------- HEADER ---------- */}
    <TableHeader>
      <TableRow className="border-none bg-yellow-300">
        <TableHead className="w-[60px]">Index</TableHead>
        <TableHead className="w-[160px]">Website</TableHead>
        <TableHead className="w-[180px]">Name</TableHead>
        <TableHead className="w-[160px]">Business</TableHead>
        <TableHead className="w-[220px]">Email</TableHead>
        <TableHead className="w-[80px]">Score</TableHead>
        <TableHead className="w-[260px]">Socials</TableHead>
        <TableHead className="w-[120px]">Date</TableHead>
      </TableRow>
    </TableHeader>

    {/* ---------- BODY ---------- */}
    <TableBody>
      {leads.map((lead , i) => (
        <TableRow
          key={lead.id}
          // onClick={() => router.push(`/leads/${lead.id}`)}
          onClick={()=>{setSelected(lead); setShowCard(true)}}
          className="cursor-pointer border-none hover:bg-white/5 transition-colors"
        >
         
          {/* Website */}
          <TableCell className="break-words whitespace-normal  text-[#E7E9EE]">
              {i}
          </TableCell>
          <TableCell className="break-words whitespace-normal  text-[#E7E9EE]">
              {  lead.website
              ? new URL(lead.website).hostname
              : "-"}
          </TableCell>

          {/* Name */}
          <TableCell className="break-words whitespace-normal text-[#E7E9EE]">
            {lead.name || "-"}
          </TableCell>

          {/* Business */}
          <TableCell className="break-words whitespace-normal text-[#8B8F97]">
            {lead.businessType || "-"}
          </TableCell>

          {/* Email */}
          <TableCell className="break-words whitespace-normal text-[#8B8F97]">
            {lead.email || "-"}
          </TableCell>

          {/* Score */}
          <TableCell className="font-semibold text-[#E7E9EE]">
            {lead.leadScore}
          </TableCell>

          {/* Socials (THIS IS IMPORTANT) */}
          <TableCell className="whitespace-normal break-words">
            <div className="flex flex-col gap-1 text-sm text-[#E7E9EE]">
              <span className="truncate">{lead?.socials?.github}</span>
              <span className="truncate">{lead?.socials?.linkedin}</span>
              <span className="truncate">{lead?.socials?.twitter}</span>
              <span className="truncate">{lead?.socials?.facebook}</span>
            </div>
          </TableCell>

          {/* Date */}
          <TableCell className="text-[#6F7480]">
            {new Date(lead.createdAt).toLocaleDateString()}
          </TableCell>

        </TableRow>
      ))}

    

    </TableBody>

  </Table>
    {
        showCard && (
          <div key={selected?.id} className="absolute right-2 bottom-2  z-100 ">
            <LeadCard lead={selected} />
          </div>
        )
      }
</div>

  );
}
