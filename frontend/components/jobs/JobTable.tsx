'use client';

import { useState, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';

// Types based on your API response
interface JobResult {
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

interface Job {
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

interface JobsResponse {
  total: number;
  jobs: Job[];
}

export default function JobsDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    PROCESSING: 0,
    completed: 0,
    failed: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3001/api/scrape/jobs' ,{
        headers: {
          'Content-Type': 'application/json',        
    },
    credentials:"include"
});
      const data: JobsResponse = await response.json();
      console.log(data)
      setJobs(data.jobs);
      
      // Calculate stats
      const PROCESSING = data.jobs.filter(job => job?.status === 'PROCESSING').length;
      const completed = data.jobs.filter(job => job?.status === 'COMPLETED').length;
      const failed = data.jobs.filter(job => job?.status === 'FAILED').length;
      
      setStats({
        total: data.total,
        PROCESSING,
        completed,
        failed,
      });
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-emerald-400 bg-emerald-400/10';
      case 'PROCESSING':
        return 'text-blue-400 bg-blue-400/10';
      case 'PENDING':
        return 'text-amber-400 bg-amber-400/10';
      case 'QUEUED':
        return 'text-purple-400 bg-purple-400/10';
      case 'FAILED':
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })}`;
    }
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatDuration = (startedAt: string, completedAt: string) => {
    const start = new Date(startedAt);
    const end = new Date(completedAt);
    const diffMs = end.getTime() - start.getTime();
    
    const minutes = Math.floor(diffMs / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  const filteredJobs = jobs.filter(job => 
    job.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.urls.some(url => url.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-[#111827] rounded-lg p-6 border border-gray-800">
            <div className="text-gray-400 text-sm mb-2">Total Jobs</div>
            <div className="text-3xl font-bold">{stats.total}</div>
          </div>
          
          <div className="bg-[#111827] rounded-lg p-6 border border-gray-800">
            <div className="flex items-center gap-2 text-sm mb-2">
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <span className="text-gray-400">PROCESSING</span>
            </div>
            <div className="text-3xl font-bold">{stats.PROCESSING}</div>
          </div>
          
          <div className="bg-[#111827] rounded-lg p-6 border border-gray-800">
            <div className="flex items-center gap-2 text-sm mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <span className="text-gray-400">Completed</span>
            </div>
            <div className="text-3xl font-bold">{stats.completed}</div>
          </div>
          
          <div className="bg-[#111827] rounded-lg p-6 border border-gray-800">
            <div className="flex items-center gap-2 text-sm mb-2">
              <div className="w-2 h-2 rounded-full bg-red-400"></div>
              <span className="text-gray-400">Failed</span>
            </div>
            <div className="text-3xl font-bold">{stats.failed}</div>
          </div>
        </div>

        {/* Jobs Table */}
        <div className="bg-[#111827] rounded-lg border border-gray-800">
          {/* Table Header */}
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <button className="flex items-center gap-2 text-sm font-medium">
              Job Name
              <ChevronDown className="w-4 h-4" />
            </button>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search scraping jobs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#0a0e1a] border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    <button className="flex items-center gap-1">
                      Job Name
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    URLs Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    <button className="flex items-center gap-1">
                      Status
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    <button className="flex items-center gap-1">
                      Created At
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      Loading jobs...
                    </td>
                  </tr>
                ) : filteredJobs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8">
                      <div className="flex flex-col items-center justify-center">
                        <div className="mb-4">
                          <svg className="w-32 h-32 text-gray-700" viewBox="0 0 200 200" fill="none">
                            <rect x="60" y="80" width="80" height="60" rx="4" fill="currentColor" opacity="0.3"/>
                            <rect x="70" y="100" width="20" height="30" rx="2" fill="currentColor" opacity="0.5"/>
                            <rect x="110" y="100" width="20" height="30" rx="2" fill="currentColor" opacity="0.5"/>
                            <path d="M80 50 L120 50 L100 70 Z" fill="currentColor" opacity="0.4"/>
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No scraping jobs yet</h3>
                        <p className="text-gray-400 mb-6">Create your first job to start extracting leads.</p>
                        <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                          + Create New Job
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium">
                          {job.name || `Job #${job.id}`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        {job.totalUrls}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            job.status === 'COMPLETED' ? 'bg-emerald-400' :
                            job.status === 'PROCESSING' ? 'bg-blue-400' :
                            job.status === 'PENDING' ? 'bg-amber-400' :
                            job.status === 'QUEUED' ? 'bg-purple-400' :
                            'bg-red-400'
                          }`}></div>
                          {job.status === 'PROCESSING' 
                            ? `Processing ${job.completed} / ${job.totalUrls}` 
                            : job.status.charAt(0) + job.status.slice(1).toLowerCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        {formatDate(job.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        {job.status === 'PROCESSING' 
                          ? `⏱️ ${Math.floor((new Date().getTime() - new Date(job.startedAt).getTime()) / 1000)}s left`
                          : job.completedAt 
                            ? formatDuration(job.startedAt, job.completedAt)
                            : '-'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {job.status === 'COMPLETED' && (
                            <>
                              <button className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors">
                                View Results
                              </button>
                              <button className="text-gray-400 hover:text-gray-300 text-sm font-medium transition-colors">
                                Export
                              </button>
                            </>
                          )}
                          {job.status === 'PROCESSING' && (
                            <>
                              <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
                                View Progress
                              </button>
                              <button className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors">
                                Cancel
                              </button>
                            </>
                          )}
                          {job.status === 'PENDING' && (
                            <button className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors">
                              Cancel
                            </button>
                          )}
                          {job.status === 'QUEUED' && (
                            <>
                              <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
                                View Results
                              </button>
                              <button className="text-gray-400 hover:text-gray-300 text-sm font-medium transition-colors">
                                Export
                              </button>
                            </>
                          )}
                          {job.status === 'FAILED' && (
                            <>
                              <button className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors">
                                Retry
                              </button>
                              <button className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors">
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}