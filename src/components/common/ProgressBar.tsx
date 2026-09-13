import React from 'react';

interface ProgressBarProps {
  progressPercentage: number; // 0 to 100
  label?: string;
  subLabel?: string;
  colorScheme?: 'brand' | 'success' | 'accent' | 'default';
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progressPercentage,
  label,
  subLabel,
  colorScheme = 'brand',
  showPercentage = true,
  size = 'md',
  className = '',
}) => {
  const clamped = Math.min(100, Math.max(0, Math.round(progressPercentage)));

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-2.5',
  };

  const barColor =
    clamped === 100
      ? 'bg-emerald-500'
      : colorScheme === 'brand'
      ? 'bg-gradient-to-r from-indigo-500 to-indigo-400'
      : colorScheme === 'accent'
      ? 'bg-gradient-to-r from-pink-500 to-indigo-500'
      : 'bg-brand-500';

  return (
    <div className={`w-full ${className}`}>
      {(label || subLabel || showPercentage) && (
        <div className="flex items-center justify-between text-xs font-medium text-surface-500 dark:text-surface-400 mb-1.5">
          <span className="truncate mr-2 font-medium text-surface-700 dark:text-surface-300">
            {label}
          </span>
          <span className="shrink-0 font-semibold text-surface-800 dark:text-surface-200">
            {subLabel || (showPercentage ? `${clamped}%` : '')}
          </span>
        </div>
      )}
      <div
        className={`w-full bg-surface-200 dark:bg-surface-800 rounded-full overflow-hidden ${heightClasses[size]}`}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out ${barColor}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
