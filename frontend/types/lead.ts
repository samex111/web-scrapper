export interface Lead {
  id: string;
  userId: string;
  jobId: string;
  website: string;
  name: string;
  description: string;
  email: string;
  emailQuality: string | null;
  phone: string;
  businessType: string;
  industry: string | null;
  leadScore: number;
  confidence: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  logo: string;
  screenshot: string | null;
  keywords: string;
  pages: {
    blog: string;
    docs: string;
    about: string;
    careers: string;
    contact: string;
    pricing: string;
  };
  socials: {
    github: string;
    twitter: string;
    youtube: string;
    facebook: string;
    linkedin: string;
    instagram: string;
  };
  technologies: string[];
  seo: {
    title: string;
    h1Count: number;
    hasOgTags: boolean;
    linkCount: number;
    imageCount: number;
    hasTwitterCard: boolean;
    metaDescription: string;
  };
  performance: {
    nodes: number;
    jsHeap: number;
    documents: number;
  };
  isEnriched: boolean;
  enrichedAt: string | null;
  isFavorite: boolean;
  notes: string | null;
  tags: string[];
  exportedAt: string | null;
  exportCount: number;
  createdAt: string;
  updatedAt: string;
}