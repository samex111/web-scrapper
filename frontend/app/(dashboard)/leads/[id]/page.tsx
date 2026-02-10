// app/leads/[id]/page.tsx
import LeadView from '@/components/leads/SingleLead';
interface PageProps {
  params: {
    id: string;
  };
}

// ✅ Server-side data fetch
async function getLead(id: string) {
  const res = await fetch(
    `http://localhost:3001/api/leads/lead/${id}`,
    {
      credentials:"include",
      headers: {
        'Content-Type': 'application/json',
         'Authorization': `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWt2MzN5dzIwMDAxZ3VlMGRhNjhnNzl3IiwiaWF0IjoxNzcwNjU0ODY5LCJleHAiOjE3NzEyNTk2Njl9.LO1V_oNpk9WpeUaesqbgKqSqJqZWbco_EjliU-67oY8'}` // Pass token if needed
      },
      cache: "no-store", // always fresh
    }
  );

  if (!res.ok) {
    console.error("Failed to fetch lead:", await res.text());
   }
  
  return res.json();
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