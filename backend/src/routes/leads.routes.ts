import { Router } from 'express';
import { prisma } from '../db/client.js';
import { requireAuthOrApiKey } from '../middleware/auth.middleware.js';

export const leadsRoutes = Router();

// Get all leads for a user
leadsRoutes.get('/',requireAuthOrApiKey, async (req, res) => {
  try {
    const { apiKey, businessType, minScore, limit = '50' } = req.query;

    if (!apiKey) {
      return res.status(401).json({ error: 'API key required' });
    }

    const user = await prisma.user.findUnique({
      where: { apiKey: apiKey as string },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    const where: any = { userId: user.id };
    
    if (businessType) {
      where.businessType = businessType;
    }
    
    if (minScore) {
      where.leadScore = { gte: parseInt(minScore as string) };
    }

    const leads = await prisma.lead.findMany({
      where,
      orderBy: { leadScore: 'desc' },
      take: parseInt(limit as string),
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
leadsRoutes.get('/:id', requireAuthOrApiKey,async (req, res) => {
  try {
    const { id } = req.params as unknown as any;

    const lead = await prisma.lead.findUnique({
      where: { id },
    });

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    res.json(lead);

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});