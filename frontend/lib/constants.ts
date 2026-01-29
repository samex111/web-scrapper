export const PLANS = {
  FREE: {
    name: 'Free',
    quota: 100,
    price: 0,
    features: ['100 leads/month', 'Email extraction', 'CSV export'],
  },
  PRO: {
    name: 'Pro',
    quota: 1000,
    price: 49,
    features: ['1,000 leads/month', 'API access', 'Priority support', 'Tech detection'],
  },
  BUSINESS: {
    name: 'Business',
    quota: 10000,
    price: 199,
    features: ['10,000 leads/month', 'Webhooks', 'Dedicated support', 'Custom integrations'],
  },
};

export const BUSINESS_TYPES = [
  'Developer Platform',
  'B2B SaaS',
  'Consumer SaaS',
  'E-Commerce',
  'Agency',
  'EdTech',
  'Service Business',
  'Media/Blog',
  'General Business',
];