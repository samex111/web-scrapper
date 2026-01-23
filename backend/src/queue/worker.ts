import { Worker } from "bullmq";
import { scrapeQueue } from "./jobs";
import { ScraperEngine } from "../scraper/engine";
import { saveLeads, updateJob } from "../db/models";
const worker = new Worker(
  "scrape-queue",
  async job => {
    const { urls } = job.data;
    const engine = new ScraperEngine();
    await engine.initialize();
    const results = await engine.scrapeMultiple(urls);
    await saveLeads(results);
    await updateJob(job.id, "completed");
    return results;
  },
  { connection: redis }
);
