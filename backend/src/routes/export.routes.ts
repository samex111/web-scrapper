import { Router } from 'express';
import { prisma } from '../db/client.js';
import { requireApiKey, requireAuthOrApiKey } from '../middleware/auth.middleware.js';

export const exportRoutes = Router();

// Export leads as CSV
exportRoutes.get('/csv',requireAuthOrApiKey, async (req, res) => {
  try {
    const { apiKey, jobId } = req.query;

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
    if (jobId) where.jobId = jobId;

    const leads = await prisma.lead.findMany({
      where,
      orderBy: { leadScore: 'desc' },
    });

    // Generate CSV
    const headers = [
      'Website', 'Name', 'Business Type', 'Lead Score', 
      'Priority', 'Confidence', 'Email', 'Phone', 
      'LinkedIn', 'Twitter'
    ];

    const rows = leads.map((lead:any) => [
      lead.website,
      lead.name || '',
      lead.businessType || '',
      lead.leadScore,
      lead.priority || '',
      lead.confidence,
      lead.email || '',
      lead.phone || '',
      (lead.socials as any)?.linkedin || '',
      (lead.socials as any)?.twitter || '',
    ]);

    const csv = [headers, ...rows]
      .map(row => row.map((cell:any) => `"${cell}"`).join(','))
      .join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="leads-${Date.now()}.csv"`);
    res.send(csv);

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Export as JSON
exportRoutes.get('/json',requireAuthOrApiKey, async (req, res) => {
  try {
    const { apiKey, jobId } = req.query;

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
    if (jobId) where.jobId = jobId;

    const leads = await prisma.lead.findMany({
      where,
      orderBy: { leadScore: 'desc' },
    });

    res.json({ total: leads.length, leads });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});