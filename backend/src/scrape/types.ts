export interface EngineOptions {
    recycleAfter?: number;
    enableSmartJS?: boolean;
    timeout?: number;
    retries?: number;
    [key: string]: any;
}

export interface ScrapedData {
    website: string;
    scrapedAt: string;
    logo: string;
    name: string;
    description: string;
    businessType: string;
    keywords: string;
    email: string;
    phone: string;
    pages: {
        pricing: string;
        about: string;
        contact: string;
        blog: string;
        careers: string;
        docs: string;
    };
    socials: {
        twitter: string;
        linkedin: string;
        facebook: string;
        instagram: string;
        youtube: string;
        github: string;
    };
    technologies: string[];
    seo: {
        title: string;
        metaDescription: string;
        h1Count: number;
        hasOgTags: boolean;
        hasTwitterCard: boolean;
        imageCount: number;
        linkCount: number;
    };
    performance: {
        jsHeap: number;
        nodes: number;
        documents: number;
    };
    confidence: number;
    leadScore?: number;
    priority?: string;
    error?: string;
}

export interface ScrapeMultipleOptions {
    batchSize?: number;
    delay?: number;
    screenshotHighPriority?: boolean;
}
