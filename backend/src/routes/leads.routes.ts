import { Router } from 'express';
import { prisma } from '../db/client.js';
import { requireAuthOrApiKey } from '../middleware/auth.middleware.js';

export const leadsRoutes = Router();

// Get all leads for a user
leadsRoutes.get('/allLeads', requireAuthOrApiKey, async (req, res) => {
  try {

    const user = req.user;

    const where: any = { userId: user.id };


    const leads = await prisma.lead.findMany({
      where
    });

    res.json({
      total: leads.length,
      leads,
    });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get single lead
leadsRoutes.get('/lead/:id', requireAuthOrApiKey, async (req, res) => {
  try {
    const { id } = req.params as unknown as any;
    console.log(req.cookies)
    console.log(req.user)

    const lead = await prisma.lead.findUnique({
      where: { id: id },
    });

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    res.json(lead);

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
leadsRoutes.get('/lead/jobId/:id', requireAuthOrApiKey, async (req, res) => {
  try {
    const { id } = req.params as unknown as any;
    const where: any = { jobId: id }
    const lead = await prisma.lead.findMany({
      where
    })
    if (!lead) {
      return res.status(404).json({
        msg: "Lead not found"
      })
    }
    res.json(
      { leadId: lead.map(l => l.id) }
    )
  }
  catch (e) {
    res.status(500).json({
      msg: "error in fincodng lead id via job id : " + e
    })
  }
})