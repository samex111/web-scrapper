import { Queue } from 'bullmq';
import { config } from '../config/config.js';


const redisUrl = new URL(config.redis.url);

const connection = {
  host: redisUrl.hostname,
  port: Number(redisUrl.port),
  // username: redisUrl.username,
  // password: redisUrl.password,
  // tls: {}
};
console.log('Redis connection:', connection);

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