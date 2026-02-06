
import  LeadTable from "@/components/leads/LeadTable";
import { getLeads } from "@/lib/api";


export default function LeadPage() {
  return(
      <section className="">
        <LeadTable />
      </section>
  )                         
}