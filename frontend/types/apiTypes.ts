export interface GetDetailsResponse {
  success: boolean;
  data: PlanDetails[];
}

export interface PlanDetails {
  plan: string;
  monthlyQuota: number;
  usedThisMonth: number;
  apiKeys: ApiKey[];
}

export interface ApiKey {
  id: string;
  userId: string;
  keyHash: string;
  keyPrefix: string;
  name: string;

  permissions: {
    scrape: boolean;
  };

  rateLimit: number;
  isActive: boolean;
  usageCount: number;

  lastUsedAt: string | null;
  ipWhitelist: string[];

  expiresAt: string | null;
  revokedAt: string | null;
  createdAt: string;
}