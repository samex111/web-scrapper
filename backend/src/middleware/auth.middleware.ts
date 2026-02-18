import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../db/client.js';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { config } from '../config/config.js';
import bcrypt from "bcrypt";


// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: any;
      apiKey?: any;
    }
  }
}


export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // only for dev else only cookies
    const token =req.cookies.token ?? req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, config.jwtSercret.JWT_SECRET) as JwtPayload;

    const session = await prisma.session.findUnique({
      where: { sessionToken: token },
    });
 
    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({ error: "Session expired" });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid or inactive user' });
    }

    req.user = user;
    next();

  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}


export async function requireApiKey(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const incomingKey = req.header("x-api-key");
    if (!incomingKey) {
      return res.status(401).json({ error: "API key missing" });
    }

    const prefix = incomingKey.slice(0, 12);

    const keys = await prisma.apiKey.findMany({
      where: {
        keyPrefix: prefix,
        isActive: true
      },
      include: { user: true }
    });

    const apiKey = keys.find(k =>
      bcrypt.compareSync(incomingKey, k.keyHash)
    );

    if (!apiKey) {
      return res.status(403).json({ error: "Invalid API key" });
    }

    // if (apiKey.revokedAt || apiKey.expiresAt! < new Date()) {
    //   return res.status(403).json({ error: "Key expired/revoked" });
    // }

    // IP whitelist
    // const clientIp = req.ip as string;
    // if (
    //   apiKey.ipWhitelist.length &&
    //   !apiKey.ipWhitelist.includes(clientIp)
    // ) {
    //   return res.status(403).json({ error: "IP not allowed" });
    // }

    // USER QUOTA CHECK
    // if (
    //   apiKey.user.usedThisMonth >= apiKey.user.monthlyQuota
    // ) {
    //   return res.status(429).json({ error: "Monthly quota exceeded" });
    // }

    // RATE LIMIT (per key)
    // const rateKey = `rate:${apiKey.id}`;
    // const current = await redis.incr(rateKey);

    // if (current === 1) {
    //   await redis.expire(rateKey, 3600); // 1 hour window
    // }

    // if (current > apiKey.rateLimit) {
    //   return res.status(429).json({ error: "Rate limit exceeded" });
    // }

    // PERMISSION CHECK
    // if (!apiKey.permissions?.scrape) {
    //   return res.status(403).json({ error: "Scrape not allowed" });
    // }

    req.apiKey = apiKey;
    req.user = apiKey.user;

    next();
  } catch (err) {
    res.status(500).json({ error: "Auth failed" });
  }
}

export async function requireAuthOrApiKey(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.cookies.token ?? req.headers.authorization?.split(' ')[1]; ;

  if (authHeader) {
    return requireAuth(req, res, next);
  }

  const apiKey = req.headers['x-api-key'] as string || req.query.apiKey as string;

  if (apiKey) {
    return requireApiKey(req, res, next);
  }

  return res.status(401).json({
    error: "Authentication required",
    hint: "Provide Bearer token or API key",
  });
}

