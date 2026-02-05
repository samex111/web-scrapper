'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { TopNav } from '@/components/dashboard/TopNav';
import { DashboardSkeleton } from '@/skeleton/DashboardSkeleton';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const userData  =JSON.parse(localStorage.getItem('user') as string) ;

    if (!userData) {
      router.push('/auth');
      return;
    }

    setUser(userData);
    setLoading(false);
  }, [router]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#0B0D12]">
      <Sidebar user={user} />
      
      <div className="lg:pl-64">
        <TopNav user={user} />
        
        <main  className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}