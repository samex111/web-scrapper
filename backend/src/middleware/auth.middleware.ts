import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../db/client.js';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';



// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}


export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, config.jwtSercret.JWT_SECRET) as any;
    
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

    const user = await prisma.user.findUnique({
      where: { apiKey },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    req.user = user;
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
  // Try JWT first
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token) {
    try {
      const decoded = jwt.verify(token, config.jwtSercret.JWT_SECRET) as any;
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });
      
      if (user && user.isActive) {
        req.user = user;
        return next();
      }
    } catch (e) {
      // Continue to API key check
    }
  }

  // Try API key
  const apiKey = req.headers['x-api-key'] as string || 
                 req.query.apiKey as string;
  
  if (apiKey) {
    const user = await prisma.user.findUnique({
      where: { apiKey },
    });

    if (user && user.isActive) {
      req.user = user;
      return next();
    }
  }

  return res.status(401).json({ 
    error: 'Authentication required',
    hint: 'Provide JWT token or API key'
  });
}