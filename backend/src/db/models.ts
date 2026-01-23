import { prisma } from "./client";
export async function saveLeads(leads) {
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
