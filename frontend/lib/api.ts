export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// Auth APIs


export async function loginWithGoogle(googleData: any) {
  const res = await fetch(`${API_URL}/api/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(googleData),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Google login failed');
  }

  return res.json();
}

export async function getUser() {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error('Failed to fetch user');
  }

  return res.json();
}

// job api's

export async function createJob(data: { name?: string; urls: string[] }) {
  const res = await fetch(`${API_URL}/api/scrape`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to create job');
  }

  return res.json();
}

export async function getJob(jobId: string) {
  const res = await fetch(`${API_URL}/api/scrape/job/${jobId}`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error('Failed to fetch job');
  }

  return res.json();
}

export async function getJobs(params?: { limit?: number; status?: string }) {
  const query = new URLSearchParams(params as any).toString();
  const res = await fetch(`${API_URL}/api/jobs?${query}`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error('Failed to fetch jobs');
  }

  return res.json();
}

// Leads APIs

export async function getLeads(params?: {
  jobId?: string;
  businessType?: string;
  minScore?: number;
  limit?: number;
}) {
  const query = new URLSearchParams(params as any).toString();
  const res = await fetch(`${API_URL}/api/leads?${query}`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error('Failed to fetch leads');
  }

  return res.json();
}

export async function getLead(leadId: string) {
  const res = await fetch(`${API_URL}/api/leads/${leadId}`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error('Failed to fetch lead');
  }

  return res.json();
}

// Export APIs

export async function exportCSV(jobId?: string) {
  const query = jobId ? `?jobId=${jobId}` : '';
  const res = await fetch(`${API_URL}/api/export/csv${query}`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error('Failed to export CSV');
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `leads-${Date.now()}.csv`;
  a.click();
}

// Stats APIs
export async function getStats() {
  const res = await fetch(`${API_URL}/api/stats`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error('Failed to fetch stats');
  }

  return res.json();
}