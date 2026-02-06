'use client';

import { useEffect, useState } from 'react';
import { getLeads } from '@/lib/api';

export function useLeads() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      const data = await getLeads();
      setLeads(data.leads);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { leads, loading, error, refetch: loadLeads };
}