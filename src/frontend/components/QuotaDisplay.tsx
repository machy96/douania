'use client';

import { AuthService } from '../lib/auth';

interface QuotaDisplayProps {
  used: number;
  quota: number;
  remaining: number;
  percentage: number;
}

export function QuotaDisplay({ used, quota, remaining, percentage }: QuotaDisplayProps) {
  const getColor = () => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          Quota mensuel
        </span>
        <span className="text-sm text-gray-500">
          {remaining} / {quota} requêtes
        </span>
      </div>
      
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor()} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {percentage >= 90 && (
        <p className="text-xs text-red-600 mt-2">
          ⚠️ Quota presque épuisé. Passez au plan Pro pour plus de requêtes.
        </p>
      )}
    </div>
  );
}
