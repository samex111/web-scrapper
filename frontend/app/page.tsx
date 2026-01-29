import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-blue-50 to-white">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Extract Leads from Any Website
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Automated web scraping with AI-powered lead scoring. 
              Get verified contacts, business intelligence, and tech stack analysis.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg">Start Free Trial</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg">Sign In</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon="🎯"
              title="Smart Lead Scoring"
              description="AI-powered ranking based on business type, contact quality, and confidence"
            />
            <FeatureCard
              icon="📧"
              title="Contact Extraction"
              description="Find verified emails, phone numbers, and social profiles"
            />
            <FeatureCard
              icon="🔍"
              title="Tech Detection"
              description="Identify technology stack, frameworks, and hosting platforms"
            />
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Simple, Transparent Pricing
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <PricingCard
                name="Free"
                price="$0"
                features={['100 leads/month', 'Email extraction', 'CSV export']}
              />
              <PricingCard
                name="Pro"
                price="$49"
                features={['1,000 leads/month', 'API access', 'Priority support']}
                highlighted
              />
              <PricingCard
                name="Business"
                price="$199"
                features={['10,000 leads/month', 'Webhooks', 'Dedicated support']}
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function FeatureCard({ icon, title, description }: any) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function PricingCard({ name, price, features, highlighted }: any) {
  return (
    <div className={`p-8 rounded-lg border-2 ${
      highlighted ? 'border-blue-600 shadow-lg' : 'border-gray-200'
    }`}>
      <h3 className="text-2xl font-bold mb-2">{name}</h3>
      <div className="mb-6">
        <span className="text-4xl font-bold">{price}</span>
        <span className="text-gray-600">/month</span>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature: string) => (
          <li key={feature} className="flex items-center">
            <span className="mr-2">✓</span> {feature}
          </li>
        ))}
      </ul>
      <Button className="w-full" variant={highlighted ? 'default    ' : 'outline'}>
        Get Started
      </Button>
    </div>
  );
}
