import React from 'react';
import type { WatchStatus } from '../../types/media';
import { getStatusConfig } from '../../utils/formatters';

interface StatusBadgeProps {
  status: WatchStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', className = '' }) => {
  const config = getStatusConfig(status);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold',
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bgClass} ${config.textClass} ${config.borderClass} ${sizeClasses[size]} ${className} tracking-wide transition-colors`}
      title={`Status: ${config.label}`}
    >
      <span className={`rounded-full shrink-0 ${config.dotClass} ${dotSizes[size]}`} aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  );
};
