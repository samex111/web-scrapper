import crypto from "crypto";
import bcrypt from "bcrypt";
import { prisma } from  "../db/client.js";
import type { Request, Response, NextFunction } from 'express';

 
export const PLAN_CONFIG  = {
  FREE: {
    maxKeys: 1,
  },
  PRO: {
    maxKeys: 5,
  },
  BUSINESS: {
    maxKeys: 999999,
  }
} as any;


export async  function generateApiKey(req:Request , res:Response)  {
  try {
    const userId = req.user.id;
    const userPlan = req.user.plan;

    // const { name, permissions, expiresAt, ipWhitelist } = req.body;

    const plan = PLAN_CONFIG[userPlan] ;

    const activeKeysCount = await prisma.apiKey.count({
      where: {
        userId,
        isActive: true
      }
    });

    if (activeKeysCount >= plan.maxKeys) {
      return res.status(403).json({
        error: "API key limit reached for your plan"
      });
    }

    const rawKey =
      "srapexx_key_" + crypto.randomBytes(32).toString("hex");

    const keyPrefix = rawKey.slice(0, 16);

    const keyHash = await bcrypt.hash(rawKey, 10);

    await prisma.apiKey.create({
      data: {
        userId,
        name:  "Default key",
        keyHash,
        keyPrefix,
        permissions: { scrape: true },
        rateLimit: plan.rateLimit,
        expiresAt: null,
        ipWhitelist:  []
      }
    });

    return res.status(201).json({
      message: "API key generated successfully",
      apiKey: rawKey 
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to generate API key  " + err
    });
  }
};
