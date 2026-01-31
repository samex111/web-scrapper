import express from 'express';
import cors from 'cors';
import { config } from './config/config.js';
import { scrapeRoutes } from './routes/scrape.routes.js';
import { leadsRoutes } from './routes/leads.routes.js';
import { exportRoutes } from './routes/export.routes.js';
import { authRoutes } from './routes/auth.routes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// Routes
app.use('/api/scrape', scrapeRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/auth',authRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
  });
});

// Root
app.get('/', (req, res) => {
  res.json({
    name: 'Scraper API',
    version: '1.0.0',
    endpoints: {
      scrape: 'POST /api/scrape',
      jobStatus: 'GET /api/scrape/job/:id',
      leads: 'GET /api/leads',
      export: 'GET /api/export/csv|json',
    },
  });
});

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});
console.log(config.GoogleClient.ID)
// Start server
app.listen(config.port, () => {
  console.log(` Server running on port ${config.port}`);
  console.log(`Environment: ${config.nodeEnv}`);
});