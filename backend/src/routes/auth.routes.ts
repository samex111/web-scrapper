import {Router} from 'express';
import { config } from '../config/config.js';
import jwt from 'jsonwebtoken'
import { prisma } from '../db/client.js';

export const authRoutes = Router();

authRoutes.post('/google', async (req, res) => {
  try {
    const { googleId, email, name, avatar } = req.body;

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { googleId },
    });

    if (!user) {
      // Check if email exists (user signed up with email/password)
      user = await prisma.user.findUnique({ where: { email } });
      
      if (user) {
        // Link Google account to existing user
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            googleId,
            avatar,
            name: name || user.name,
            emailVerified: true,
            lastLoginAt: new Date(),
          },
        });
      } else {
        // Create new user
        user = await prisma.user.create({
          data: {
            email,
            name,
            avatar,
            googleId,
            emailVerified: true,
            plan: 'FREE',
            monthlyQuota: 100,
            lastLoginAt: new Date(),
          },
        });
      }
    } else {
      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      config.jwtSercret.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Create session
    await prisma.session.create({
      data: {
        userId: user.id,
        sessionToken: token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        apiKey: user.apiKey,
        plan: user.plan,
        quota: user.monthlyQuota,
        used: user.usedThisMonth,
      },
    });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

authRoutes.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, config.jwtSercret.JWT_SECRET) as any;
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        apiKey: true,
        plan: true,
        monthlyQuota: true,
        usedThisMonth: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });

  } catch (error: any) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

authRoutes.post('/logout', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      // Delete session
      await prisma.session.deleteMany({
        where: { sessionToken: token },
      });
    }

    res.json({ message: 'Logged out successfully' });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});