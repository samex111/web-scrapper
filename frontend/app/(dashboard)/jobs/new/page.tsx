'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createJob } from '@/lib/api';
import { X } from 'lucide-react';

export default function NewJobPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [urls, setUrls] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addUrl = () => {
    if (urls.length < 100) {
      setUrls([...urls, '']);
    }
  };

  const removeUrl = (index: number) => {
    setUrls(urls.filter((_, i) => i !== index));
  };

  const updateUrl = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const urlList = urls.filter(u => u.trim());
      
      if (urlList.length === 0) {
        throw new Error('Please enter at least one URL');
      }

      const job = await createJob({
        name: name || undefined,
        urls: urlList,
      });

      router.push(`/jobs`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const validUrlCount = urls.filter(u => u.trim()).length;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">New Scrape Job</h1>
        <p className="text-gray-400 text-sm">
          Extract leads from multiple websites at once
        </p>
      </div>

      <div className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-800">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Job Name (optional)
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., SaaS Competitors Q1 2025"
              className="bg-[#252525] border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              URLs to Scrape
            </label>
            <div className="space-y-2">
              {urls.map((url, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500">
                      ✓
                    </span>
                    <Input
                      type="url"
                      value={url}
                      onChange={(e) => updateUrl(index, e.target.value)}
                      placeholder="https://stripe.com"
                      className="bg-[#252525] border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-600 pl-8"
                    />
                  </div>
                  {urls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeUrl(index)}
                      className="text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <button
              type="button"
              onClick={addUrl}
              disabled={urls.length >= 100}
              className="mt-3 text-sm text-blue-400 hover:text-blue-300 disabled:text-gray-600 disabled:cursor-not-allowed flex items-center gap-1"
            >
              + Add another URL
              <span className="text-gray-500 text-xs ml-1">
                ({validUrlCount}/100 URLs used)
              </span>
            </button>
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={loading || validUrlCount === 0}
              className="bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-700 disabled:text-gray-500"
            >
              {loading ? 'Starting Job...' : 'Start Scraping'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard')}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>

      <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <h3 className="font-medium text-blue-400 mb-2">💡 Tips:</h3>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Each URL consumes 1 credit</li>
          <li>• Processing takes 2-5 seconds per URL</li>
          <li>• You'll receive an email when complete</li>
          <li>• Results include emails, phones, tech stack, and lead scores</li>
        </ul>
      </div>
    </div>
  );
}