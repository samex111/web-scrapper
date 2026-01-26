import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  database: {
    url: process.env.DATABASE_URL!  ,
  },
  jwtSercret: {
    JWT_SECRET: process.env.DATABASE_URL!  ,
  },
  
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  
  scraper: {
    maxPages: parseInt(process.env.MAX_CONCURRENT_PAGES || '6'),
    recycleAfter: parseInt(process.env.BROWSER_RECYCLE_AFTER || '25'),
    timeout: parseInt(process.env.SCRAPER_TIMEOUT || '35000'),
  },
  GoogleClient:{
    ID : process.env.GOOGLE_CLIENT_ID
  }
};


if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}
