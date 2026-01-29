'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createJob } from '@/lib/api';

export default function NewJobPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [urls, setUrls] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const urlList = urls.split('\n').filter(u => u.trim());
      
      if (urlList.length === 0) {
        throw new Error('Please enter at least one URL');
      }

      const job = await createJob({
        name: name || undefined,
        urls: urlList,
      });

      router.push(`/jobs/${job.jobId}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">New Scrape Job</h1>
        <p className="text-gray-600">
          Extract leads from multiple websites at once
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">
              Job Name (optional)
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., SaaS Competitors Q1 2025"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              URLs to Scrape
            </label>
            <textarea
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              className="w-full h-64 p-4 border rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://stripe.com&#10;https://vercel.com&#10;https://supabase.com&#10;&#10;One URL per line (max 100)"
              required
            />
            <p className="text-sm text-gray-500 mt-2">
              {urls.split('\n').filter(u => u.trim()).length} URLs entered
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              loading={loading}
              className="flex-1"
            >
              {loading ? 'Starting Job...' : 'Start Scraping'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium mb-2">💡 Tips:</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Each URL consumes 1 credit</li>
          <li>• Processing takes 2-5 seconds per URL</li>
          <li>• You'll receive an email when complete</li>
          <li>• Results include emails, phones, tech stack, and lead scores</li>
        </ul>
      </div>
    </div>
  );
}