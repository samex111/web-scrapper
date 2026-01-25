import { Router } from 'express';
import { config } from '../config/config.js';
import jwt from 'jsonwebtoken'
import { prisma } from '../db/client.js';
import { OAuth2Client } from "google-auth-library";
import { requireAuth } from '../middleware/auth.middleware.js';

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);


export const authRoutes = Router();
authRoutes.post("/google", async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: "Missing Google token" });
    }

    // 1️⃣ Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: config.GoogleClient.ID as string,
    });

    const payload = ticket.getPayload();
    if (!payload?.email || !payload.sub) {
      return res.status(401).json({ error: "Invalid Google token" });
    }

    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name ?? "User";
    const avatar = payload.picture ?? null;

    // 2️⃣ Atomic DB logic
    const user = await prisma.$transaction(async (tx) => {
      let user = await tx.user.findUnique({
        where: { googleId },
      });

      if (user) {
        return tx.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });
      }

      const existingUser = await tx.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return tx.user.update({
          where: { id: existingUser.id },
          data: {
            googleId,
            avatar,
            name,
            emailVerified: true,
            lastLoginAt: new Date(),
          },
        });
      }

      return tx.user.create({
        data: {
          email,
          name,
          avatar,
          googleId,
          emailVerified: true,
          plan: "FREE",
          monthlyQuota: 100,
          lastLoginAt: new Date(),
        },
      });
    });

    // 3️⃣ Create JWT
    const token = jwt.sign(
      { userId: user.id },
      config.jwtSercret.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 4️⃣ Persist session
    await prisma.session.create({
      data: {
        userId: user.id,
        sessionToken: token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        plan: user.plan,
        quota: user.monthlyQuota,
        used: user.usedThisMonth,
      },
    });
  } catch (err) {
    res.status(401).json({ error: "Google authentication failed" });
  }
});

authRoutes.get("/me",requireAuth, async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = jwt.verify(token, config.jwtSercret.JWT_SECRET) as {
      userId: string;
    };

    const session = await prisma.session.findUnique({
      where: { sessionToken: token },
    });

    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({ error: "Session expired" });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        plan: true,
        monthlyQuota: true,
        usedThisMonth: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
});

authRoutes.post("/logout",requireAuth, async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    await prisma.session.deleteMany({
      where: { sessionToken: token },
    });
  }

  res.json({ message: "Logged out" });
});
