// app/leads/[id]/page.tsx
import LeadView from '@/components/leads/SingleLead';
import { API_URL } from '@/lib/api';
interface PageProps {
  params: {
    id: string;
  };
}

import { cookies } from "next/headers";

export async function getLead(id: string) {
  try {
    const cookieStore = await cookies();  

    const res = await fetch(`${API_URL}/api/leads/lead/${id}`, {
      method: "GET",
      headers: {
        Cookie: cookieStore.toString() 
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Failed to fetch lead:", text);
      return null;
    }

    return res.json();
  } catch (e) {
    console.error("Error fetching lead:", e);
  }
}

export default async function LeadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  console.log("Server Fetching lead with ID:", id);

  const lead = await getLead(id);


  return (
    <div className="p-6">
      <LeadView lead={lead} />
    </div>
  );
}