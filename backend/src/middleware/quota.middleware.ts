import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../db/client.js';

export async function checkQuota(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try{
  const user = req.user;

  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }
  const freshUser = await prisma.user.findUnique({
  where: { id: user.id },
  select: { usedThisMonth: true, monthlyQuota: true, plan: true },
});


  // Check if quota exceeded
  if (freshUser!.usedThisMonth >= freshUser!.monthlyQuota) {
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
catch(e){
  console.log("error in check quota")
  res.status(403).json({
    error:"error in check quota: " +e
  })
}
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