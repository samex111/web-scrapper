import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../db/client.js';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { config } from '../config/config.js';



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
    const apiKey = req.headers['x-api-key'] as string ||
      req.query.apiKey as string;

    if (!apiKey) {
      return res.status(401).json({
        error: 'API key required',
        hint: 'Pass as X-API-Key header or ?apiKey query param'
      });
    }

    const apiKeyRecord = await prisma.apiKey.findUnique({
      where: { key: apiKey },
      include: { user: true },
    });

    if (!apiKeyRecord || !apiKeyRecord.isActive) {
      return res.status(401).json({ error: "Invalid API key" });
    }

    req.user = apiKeyRecord.user;
    req.apiKey = apiKeyRecord;

    next();

  } catch (error: any) {
    res.status(500).json({ error: error.message });
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

