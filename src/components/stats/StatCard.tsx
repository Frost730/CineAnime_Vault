import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subValue?: string;
  trend?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  subValue,
  className = '',
}) => {
  return (
    <div
      className={`relative overflow-hidden p-3.5 sm:p-5 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200/80 dark:border-surface-800/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between ${className}`}
    >
      <div className="flex items-center justify-between gap-1.5 mb-2 sm:mb-3">
        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 truncate">
          {label}
        </span>
        <div className="p-1.5 sm:p-2 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 shrink-0">
          {icon}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
        <span className="text-xl sm:text-2xl lg:text-3xl font-black text-surface-900 dark:text-surface-100 tracking-tight leading-none">
          {value}
        </span>
        {subValue && (
          <span className="text-[10px] sm:text-xs font-semibold text-surface-500 dark:text-surface-400 truncate">
            {subValue}
          </span>
        )}
      </div>
    </div>
  );
};
