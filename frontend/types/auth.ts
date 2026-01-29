export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  apiKey: string;
  plan: 'FREE' | 'PRO' | 'BUSINESS' | 'ENTERPRISE';
  monthlyQuota: number;
  usedThisMonth: number;
  createdAt: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface SignupRequest {
  email: string;
  password: string;
  name?: string;
}