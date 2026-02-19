import { Router } from "express";
import { requireApiKey, requireAuth } from "../middleware/auth.middleware.js";
import { generateApiKey } from "../controllers/apiKeys.controller.js";
import { scrapeSchema } from "./zod.routes.js";
import ScraperEngine from "../scrape/engine.js";
import { config } from "../config/config.js";
import { prisma } from "../db/client.js";
import { checkQuota } from "../middleware/quota.middleware.js";
export const apiKeyRoutes = Router();

apiKeyRoutes.post('/generate', requireAuth, generateApiKey)
apiKeyRoutes.post("/scrape", requireApiKey, checkQuota, async (req, res) => {
  const start = Date.now();

  let engine;

  try {
    const { urls } = scrapeSchema.parse(req.body);
    if (urls.length == 0) {
      return res.status(404).json({
        success: false,
        error: "Plaese provide atleast one url"
      })
    }
    if (urls.length > 5) {
      return res.status(400).json({
        success: false,
        error: "Max 5 URLs allowed in sync mode",
      });
    }

    engine = new ScraperEngine({
      recycleAfter: config.scraper.recycleAfter,
      timeout: config.scraper.timeout,
    });

    await engine.initialize();

    const results = [];
    const failed = [];

    for (const url of urls) {
      try {
        const result = await engine.scrape(url);

        results.push({
          url,
          success: true,
          data: result,
        });

      } catch (err: any) {
        failed.push({
          url,
          success: false,
          error: err.message,
        });
      }
    }

    console.log(req.apiKey)
    console.log(req.user.id)
    await prisma.apiKey.update({
      where: { id: req.apiKey },
      data: {
        usageCount: { increment: urls.length },
        lastUsedAt: new Date(),
      },
    });
    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        usedThisMonth: { increment: urls.length }
      }
    })

    const duration = Date.now() - start;

    return res.status(200).json({
      success: true,
      data: results,
      meta: {
        total: urls.length,
        completed: results.length,
        failed: failed.length,
        duration,
        creditsUsed: urls.length,
      },
      errors: failed,
    });

  } catch (err: any) {
    return res.status(400).json({
      success: false,
      error: err.message + " in the catch last",
    });

  } finally {
    if (engine) {
      await engine.close();
    }
  }
});
apiKeyRoutes.get('/get-details', requireAuth, async (req, res) => {
  try {
     const userDetails = await prisma.user.findMany({
      where : {id : req.user.id},
      select : {
        plan : true,
        monthlyQuota : true,
        usedThisMonth :true,
        apiKeys : true
      }
     })
     res.status(200).json({
      success : true,
      data :  userDetails
     })
  }
  catch (e) {
  res.status(500).json(
    {
      msg : "error in get details -- " + e
    }
  )
  }
})