import { Router } from 'express';
import { z } from 'zod';
import { addScrapeJob, getJobStatus } from '../queue/jobs.js';
import { prisma } from '../db/client.js';
import { checkQuota, incrementUsage } from '../middleware/quota.middleware.js';
import { requireAuthOrApiKey } from '../middleware/auth.middleware.js';
import { scrapeSchema } from './zod.routes.js';

export const scrapeRoutes = Router();



// Start new scrape job
scrapeRoutes.post('/', requireAuthOrApiKey  , checkQuota, async (req, res) => {
  try {
    const { urls } = scrapeSchema.parse(req.body);
    const user = req.user;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ error: 'URLs array required' });
    }

    if (urls.length > 100) {
      return res.status(400).json({ error: 'Maximum 100 URLs per request' });
    }

    // Add job to queue
    const jobId = await addScrapeJob(user.id, urls);

    // Increment usage
    await incrementUsage(user.id, urls.length);

    res.status(200).json({
      jobId,
      status: 'queued',
      urls: urls.length,
      creditsUsed: urls.length,
      remaining: user.monthlyQuota - user.usedThisMonth - urls.length,
    });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
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
scrapeRoutes.get('/jobs', requireAuthOrApiKey, async (req, res) => {
  try {
    const user = req.user;

    const jobs = await prisma.job.findMany({
      where: { userId: user.id },
      include: {
        leads: {
          select: {
            id: true
          }
        }
      }
    });

    res.status(200).json({
      total: jobs.length,
      jobs
    });

  } catch (e) {
    res.status(500).json('Error in getting all jobs: ' + e);
  }
});