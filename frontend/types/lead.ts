export interface Lead {
  id: string;
  userId: string;
  jobId: string;
  website: string;
  name?: string;
  description?: string;
  email?: string;
  phone?: string;
  businessType?: string;
  leadScore: number;
  confidence: number;
  priority: 'High' | 'Medium' | 'Low';
  logo?: string;
  keywords?: string;
  pages: {
    pricing?: string;
    about?: string;
    contact?: string;
    blog?: string;
    careers?: string;
    docs?: string;
  };
  socials: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
    github?: string;
  };
  technologies: string[];
  createdAt: string;
}