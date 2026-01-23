import { Queue } from "bullmq";
import { redis } from "../config";
export const scrapeQueue =  new Queue("scrape-queue", {
    connection:redis
});
export async function addScrapeJob(urls:string[]){
    const job = await scrapeQueue.add("scrape", {
        urls
    });
    return job.id;
} 