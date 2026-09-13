import React from 'react';

export const PageSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse py-2">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-48 sm:w-64 bg-surface-200 dark:bg-surface-800 rounded-xl" />
          <div className="h-4 w-72 sm:w-96 bg-surface-100 dark:bg-surface-850 rounded-lg" />
        </div>
        <div className="h-10 w-32 bg-surface-200 dark:bg-surface-800 rounded-xl" />
      </div>

      {/* Filter / Stat bar skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-20 rounded-2xl bg-surface-100 dark:bg-surface-850 border border-surface-200/50 dark:border-surface-800/50"
          />
        ))}
      </div>

      {/* Media cards grid skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex flex-col rounded-2xl bg-white dark:bg-surface-900 border border-surface-200/70 dark:border-surface-800/70 overflow-hidden shadow-sm"
          >
            <div className="aspect-[2/3] w-full bg-surface-200 dark:bg-surface-800" />
            <div className="p-3 space-y-2">
              <div className="h-4 w-3/4 bg-surface-200 dark:bg-surface-800 rounded" />
              <div className="h-3 w-1/2 bg-surface-100 dark:bg-surface-850 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
