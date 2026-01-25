import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../db/client.js';

export async function checkQuota(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Check if quota exceeded
  if (user.usedThisMonth >= user.monthlyQuota) {
    return res.status(429).json({
      error: 'Monthly quota exceeded',
      quota: {
        limit: user.monthlyQuota,
        used: user.usedThisMonth,
        plan: user.plan,
      },
      message: 'Upgrade your plan to continue',
    });
  }

  next();
}

export async function incrementUsage(userId: string, credits: number) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      usedThisMonth: { increment: credits },
    },
  });

  await prisma.usageLog.create({
    data: {
      userId,
      action: 'scrape',
      credits,
    },
  });
}