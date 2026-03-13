import { Worker, Job } from 'bullmq';
import { config } from '../config/config.js';
import { ScraperEngine } from '../scrape/engine.js';
import { prisma } from '../db/client.js';


const redisUrl = new URL(config.redis.url);

const connection = {
  host: redisUrl.hostname,
  port: Number(redisUrl.port),
  username: redisUrl.username,
  password: redisUrl.password,
  tls: {},
   maxRetriesPerRequest: null
};

const worker = new Worker('scrape-jobs', async (job: Job) => {
  const { userId, urls } = job.data;

  console.log(`Processing job ${job.id} for user ${userId}`);
  console.log(` URLs to scrape: ${urls.length}`);

  // Create job record
 const dbJob = await prisma.job.upsert({
  where: { id: job.id as string },
  update: {
    status: "PROCESSING",
    startedAt: new Date(),
  },
  create: {
    id: job.id as string,
    userId,
    urls,
    totalUrls: urls.length,
    status: "PROCESSING",
    startedAt: new Date(),
  },
})


  try {
    const engine = new ScraperEngine({
      recycleAfter: config.scraper.recycleAfter,
      timeout: config.scraper.timeout,
    });

    await engine.initialize();

    const results = [];
    let completed = 0;
    let failed = 0;

    for (const url of urls) {
      try {
        const result = await engine.scrape(url);
        results.push(result);
        completed++;

        // Save lead to database
        await prisma.lead.create({
          data: {
            userId,
            jobId: dbJob.id,
            website: result.website,
            name: result.name,
            description: result.description,
            email: result.email,
            phone: result.phone,
            businessType: result.businessType,
            leadScore: result.leadScore ?? 0,
            confidence: result.confidence,
            priority: result.priority as any ,
            logo: result.logo,
            keywords: result.keywords,
            pages: result.pages as any,
            socials: result.socials as any,
            technologies: result.technologies as any,
            seo: result.seo as any,
            performance: result.performance as any
          },
        });

        // Update progress
        await prisma.job.update({
          where: { id: dbJob.id },
          data: { completed },
        });

        await job.updateProgress({
          completed,
          total: urls.length,
          current: url,
        });

      } catch (error: any) {
        console.error(` Failed to scrape ${url}:`, error.message);
        failed++;
        
        await prisma.job.update({
          where: { id: dbJob.id },
          data: { failed },
        });
      }
    }

    await engine.close();

    // Update job as completed
    await prisma.job.update({
      where: { id: dbJob.id },
      data: {
        status: 'COMPLETED',
        completed,
        failed,
        completedAt: new Date(),
        results: results as any,
      },
    });

    console.log(` Job ${job.id} completed: ${completed}/${urls.length} successful`);

    return {
      completed,
      failed,
      total: urls.length,
      results,
    };

  } catch (error: any) {
    console.error(` Job ${job.id} failed:`, error);

    await prisma.job.update({
      where: { id: dbJob.id },
      data: {
        status: 'FAILED',
        errors: error.message ,
        completedAt: new Date(),
      },
    });

    throw error;
  }
}, { connection , concurrency: 3 });

worker.on('completed', (job) => {
  console.log(`Worker completed job ${job.id} `);
});

worker.on('failed', (job, err) => {
  console.error(` Worker failed job ${job?.id}:`, err.message);
});
worker.on('error', (err) => {
  console.error('Worker error:', err);
});

console.log(' Worker started and listening for jobs...');
// import http from "http";

// const server = http.createServer((req, res) => {
//   if (req.url === "/health") {
//     res.writeHead(200, { "Content-Type": "text/plain" });
//     res.end("ok");
//   } else {
//     res.writeHead(404);
//     res.end();
//   }
// });

// const PORT = Number(process.env.PORT) || 3005;

// server.listen(PORT, () => {
//   console.log(`Worker health server running on port ${PORT}`);
// });