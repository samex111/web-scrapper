export type JobStatus = 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface Job {
  id: string;
  userId: string;
  name?: string;
  status: JobStatus;
  urls: string[];
  totalUrls: number;
  completed: number;
  failed: number;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
}