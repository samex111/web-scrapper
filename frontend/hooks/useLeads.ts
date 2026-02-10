'use client';

import { use, useEffect, useState } from 'react';
import { getLeads, getSingleLead } from '@/lib/api';

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

export function useSingleLead(leadId: string) {

  const [lead, setLead] = useState<any>(null);
  console.log("Lead ID in useSingleLead:", leadId); // Debug log to check the leadId value
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);  
  useEffect(() => {
    loadLead();
    
  }, [leadId]);

  const loadLead = async () => {
    try {
      const data = await getSingleLead(leadId);
      setLead(data);
     
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { lead, loading, error, refetch: loadLead }; 

}