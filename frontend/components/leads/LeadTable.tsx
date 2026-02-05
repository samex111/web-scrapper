'use client';

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

interface LeadTableProps {
  leads: any[];
}

export function LeadTable({ leads }: LeadTableProps) {
  const router = useRouter();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'success';
      case 'Medium': return 'warning';
      case 'Low': return 'default';
      default: return 'default';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Website</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Business Type</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                No leads found
              </TableCell>
            </TableRow>
          ) : (
            leads.map((lead) => (
              <TableRow
                key={lead.id}
                className="cursor-pointer"
                onClick={() => router.push(`/leads/${lead.id}`)}
              >
                <TableCell className="font-medium">{lead.website}</TableCell>
                <TableCell>{lead.name || '-'}</TableCell>
                <TableCell>{lead.businessType || '-'}</TableCell>
                <TableCell className="text-sm">{lead.email || '-'}</TableCell>
                <TableCell>
                  <span className="font-semibold">{lead.leadScore}</span>
                </TableCell>
                <TableCell>
                  <Badge variant={getPriorityColor(lead.priority)}>
                    {lead.priority}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {new Date(lead.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}