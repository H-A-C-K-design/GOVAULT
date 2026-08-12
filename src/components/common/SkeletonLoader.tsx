import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-full w-16"></div>
      </div>
      <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
      <div className="flex items-center justify-between pt-2">
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-24"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-20"></div>
      </div>
    </div>
  );
};

export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex justify-between animate-pulse">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-32"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24"></div>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex items-center justify-between animate-pulse space-x-4">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-16"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-20"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
