
import { LeadTable } from "@/components/leads/LeadTable";
import { getLeads } from "@/lib/api";


export default function LeadPage() {
   const leads: any = getLeads()

  return(
      <section>
        <LeadTable></LeadTable>
      </section>
  )                         
}