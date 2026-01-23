import { addScrapeJob } from "../queue/jobs.js";
import { z } from 'zod'
import { Router } from "express";
const router = Router();
router.post('/' async (req, res) => {
    const requireBody = z.object({
        urls: z.array().string()
    })
    const parseData = requireBody.safeParse(req.body);

    if (!parseData.success) {
        return res.status(401).json({
            error: "Error in url parsing : " + parseData.error
        })
    }
    const url = parseData.data;

    const jobId = await addScrapeJob(url);

    res.status(200).json({
        jobId,
        status: "queued"
    });


})