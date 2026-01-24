import { Router } from 'express';
import { z } from 'zod';
import { addScrapeJob, getJobStatus } from '../queue/jobs.js';
import { prisma } from '../db/client.js';

export const scrapeRoutes = Router();

const scrapeSchema = z.object({
  urls: z.array(z.string().url()).min(1).max(100),
  apiKey: z.string(),
});

// Start new scrape job
scrapeRoutes.post('/', async (req, res) => {
  try {
    const { urls, apiKey } = scrapeSchema.parse(req.body);

    // Verify API key
    const user = await prisma.user.findUnique({
      where: { apiKey },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    // Add job to queue
    const jobId = await addScrapeJob(user.id, urls);

    res.json({
      jobId,
      status: 'queued',
      urls: urls.length,
      message: 'Scraping job queued successfully',
    });

  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Get job status
scrapeRoutes.get('/job/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        leads: {
          select: {
            id: true,
            website: true,
            leadScore: true,
            confidence: true,
            priority: true,
          },
        },
      },
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const queueStatus = await getJobStatus(id);

    res.json({
      id: job.id,
      status: job.status,
      progress: {
        completed: job.completed,
        failed: job.failed,
        total: job.totalUrls,
      },
      queueState: queueStatus?.state,
      leads: job.leads.length,
      createdAt: job.createdAt,
      completedAt: job.completedAt,
    });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});