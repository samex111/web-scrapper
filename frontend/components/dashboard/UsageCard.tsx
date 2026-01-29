'use client';

import { useEffect, useState } from 'react';
import { getUser } from '@/lib/api';

export function UsageCard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const data = await getUser();
      setUser(data.user);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;

  const percentage = (user.usedThisMonth / user.monthlyQuota) * 100;
  const isNearLimit = percentage >= 80;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-semibold">Usage This Month</h2>
          <p className="text-sm text-gray-600">
            Resets on {new Date(user.resetDate).toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">
            {user.usedThisMonth} / {user.monthlyQuota}
          </div>
          <div className="text-sm text-gray-600">credits</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className="overflow-hidden h-4 text-xs flex rounded-full bg-gray-200">
          <div
            style={{ width: `${Math.min(percentage, 100)}%` }}
            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-300 ${
              isNearLimit ? 'bg-red-500' : 'bg-blue-600'
            }`}
          />
        </div>
      </div>

      {isNearLimit && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            ⚠️ You're running low on credits. 
            <a href="/settings/billing" className="font-medium underline ml-1">
              Upgrade your plan
            </a>
          </p>
        </div>
      )}
    </div>
  );
}