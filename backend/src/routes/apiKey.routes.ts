import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { generateApiKey } from "../controllers/apiKeys.controller.js";
export const apiKeyRoutes = Router();

apiKeyRoutes.post('/generate',requireAuth , generateApiKey)

