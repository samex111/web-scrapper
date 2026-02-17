// app/leads/[id]/page.tsx
import LeadView from '@/components/leads/SingleLead';
interface PageProps {
  params: {
    id: string;
  };
}

async function getLead(id: string) {
  const res = await fetch(
    `http://localhost:3001/api/leads/lead/${id}`,
    {
      credentials:"include",
      headers: {
        'Content-Type': 'application/json',
         'Authorization': `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWt2MzN5dzIwMDAxZ3VlMGRhNjhnNzl3IiwiaWF0IjoxNzcxMjU0NjMyLCJleHAiOjE3NzE4NTk0MzJ9.rTyzn4b5iYs8xaGBbpzNCtg2x6GRCkkPfycqwWjRggA'}` // Pass token if needed
      },
      // cache: "no-store", // always fresh
    }
  );
 
  if (!res.ok) {
    const text = await res.text();
    console.error("Failed to fetch lead:", text);
   }
  
  return await res.json();
}

export default async function LeadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ✅ UNWRAP params
  const { id } = await params;

  console.log("Server Fetching lead with ID:", id);

  const lead = await getLead(id);

  return (
    <div className="p-6">
      <LeadView lead={lead} />
    </div>
  );
}