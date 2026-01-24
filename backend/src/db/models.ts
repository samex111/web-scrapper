import { prisma } from "./client.js";
export async function saveLeads(leads:any) {
  for (const lead of leads) {
    await prisma.lead.create({
      data: {
        website: lead.website,
        email: lead.email,
        phone: lead.phone,
        leadScore: lead.leadScore,
        confidence: lead.confidence
      }
    });
  }
}
