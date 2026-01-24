import { Queue } from 'bullmq';
import { config } from '../config.js';

const connection = {
  host: new URL(config.redis.url).hostname,
  port: parseInt(new URL(config.redis.url).port || '6379'),
};

export const scrapeQueue = new Queue('scrape-jobs', { connection });

export async function addScrapeJob(userId: string, urls: string[]) {
  const job = await scrapeQueue.add('scrape', {
    userId,
    urls,
    timestamp: new Date().toISOString(),
  }, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  });

  return job.id;
}

export async function getJobStatus(jobId: string) {
  const job = await scrapeQueue.getJob(jobId);
  if (!job) return null;

  const state = await job.getState();
  const progress = job.progress;

  return {
    id: job.id,
    state,
    progress,
    data: job.data,
    returnvalue: job.returnvalue,
    failedReason: job.failedReason,
  };
}