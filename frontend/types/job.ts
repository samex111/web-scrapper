export interface JobResult {
  seo: {
    title: string;
    h1Count: number;
    hasOgTags: boolean;
    linkCount: number;
    imageCount: number;
    hasTwitterCard: boolean;
    metaDescription: string;
  };
  logo: string;
  name: string;
  email: string;
  website: string;
  priority: string;
  leadScore: number;
  scrapedAt: string;
  confidence: number;
  description: string;
  businessType: string;
  technologies: string[];
}

export interface Job {
  id: string;
  userId: string;
  name: string | null;
  status: 'COMPLETED' | 'PROCESSING' | 'PENDING' | 'QUEUED' | 'FAILED';
  urls: string[];
  totalUrls: number;
  completed: number;
  failed: number;
  results: JobResult[];
  errors: any;  
  source: string;
  priority: string;
  createdAt: string;
  startedAt: string;
  completedAt: string;
}

export interface JobsResponse {
  total: number;
  jobs: Job[];
}