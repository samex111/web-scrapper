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

export function LeadTable() {
  const router = useRouter();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
      <div className="rounded-xl border border-none p-6 text-[#8B8F97]">
        Loading leads…
      </div>
    );
  }

  return (
    <div className="rounded-xl  border-none  ">
      <Table>
        <TableHeader className="text-white">
          <TableRow className="border-none">
            <TableHead  className="text-white">Website</TableHead>
            <TableHead className="text-white">Name</TableHead>
            <TableHead className="text-white">Business</TableHead>
            <TableHead className="text-white">Email</TableHead>
            <TableHead className="text-white">Score</TableHead>
            <TableHead className="text-white">Priority</TableHead>
            <TableHead className="text-white">Date</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {leads.map((lead) => (
            <TableRow
              key={lead.id}
              onClick={() => router.push(`/leads/${lead.id}`)}
              className="cursor-pointer border-none hover:bg-white/5 transition-colors"
            >
              <TableCell className="font-medium text-[#E7E9EE]">
                {new URL(lead.website).hostname}
              </TableCell>

              <TableCell className="text-[#E7E9EE]">
                {lead.name || "-"}
              </TableCell>

              <TableCell className="text-[#8B8F97]">
                {lead.businessType || "-"}
              </TableCell>

              <TableCell className="text-[#8B8F97]">
                {lead.email || "-"}
              </TableCell>

              <TableCell className="font-semibold text-[#E7E9EE]">
                {lead.leadScore}
              </TableCell>

              <TableCell>
                <Badge variant={getPriorityColor(lead.priority)}>
                  {lead.priority}
                </Badge>
              </TableCell>

              <TableCell className="text-[#6F7480]">
                {new Date(lead.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
