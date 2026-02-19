import { Router } from 'express';
import { prisma } from '../db/client.js';
import { requireApiKey, requireAuthOrApiKey } from '../middleware/auth.middleware.js';
import { exportSchema } from './zod.routes.js';

export const exportRoutes = Router();

// Export leads as CSV
exportRoutes.get('/csv', requireAuthOrApiKey, async (req, res) => {
  try {
    const { jobId } = req.query;


    const where: any = { jobId: jobId };


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

    const rows = leads.map((lead: any) => [
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
      .map(row => row.map((cell: any) => `"${cell}"`).join(','))
      .join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="leads-${Date.now()}.csv"`);
    res.send(csv);

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Export as JSON
exportRoutes.get('/json', requireAuthOrApiKey, async (req, res) => {
  try {
    const { apiKey, jobId } = req.query;


    const where: any = { userId: req.user.id };
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
exportRoutes.get('/leads', requireAuthOrApiKey, async (req, res) => {
  try {
    const parsed = exportSchema.safeParse(req.query);

    if (!parsed.success) {
      return res.status(400).json(parsed.error.format());
    }

    const {
      isEmail,
      businessType,
      minLeadScore,
      from,
      to,
      lastSevenDays,
      today,
    } = parsed.data;

    const where: any = {
      userId: req.user.id,
    };

    if (isEmail) {
      where.email = { contains: '@' };
    }

    if (minLeadScore !== undefined) {
      where.leadScore = { gt: minLeadScore };
    }

    if (businessType) {
      where.businessType = businessType;
    }

    if (from && to) {
      where.createdAt = { gte: from, lte: to };
    } else if (lastSevenDays) {
      const date = new Date();
      date.setDate(date.getDate() - 7);

      where.createdAt = { gte: date };
    } else if (today) {
      const start = new Date();
      start.setHours(0, 0, 0, 0);

      const end = new Date();
      end.setHours(23, 59, 59, 999);

      where.createdAt = { gte: start, lte: end };
    }

    const leads = await prisma.lead.findMany({
      where,
      select: {
        website: true,
        name: true,
        businessType: true,
        leadScore: true,
        priority: true,
        confidence: true,
        email: true,
        phone: true,
        socials: true,
      },
    });

    const headers = [
      'Website', 'Name', 'Business Type', 'Lead Score',
      'Priority', 'Confidence', 'Email', 'Phone',
      'LinkedIn', 'Twitter'
    ];

    const rows = leads.map((lead) => [
      lead.website ?? '',
      lead.name ?? '',
      lead.businessType ?? '',
      lead.leadScore ?? '',
      lead.priority ?? '',
      lead.confidence ?? '',
      lead.email ?? '',
      lead.phone ?? '',
      (lead.socials as any)?.linkedin ?? '',
      (lead.socials as any)?.twitter ?? '',
    ]);

    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="leads-${Date.now()}.csv"`
    );

    res.send(csv);

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
