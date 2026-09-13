import React from 'react';
import { Star } from 'lucide-react';

interface RatingProps {
  value: number; // 0 to 10
  size?: 'sm' | 'md' | 'lg';
  showOutOf?: boolean;
  className?: string;
}

export const Rating: React.FC<RatingProps> = ({
  value,
  size = 'md',
  showOutOf = false,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textSizes = {
    sm: 'text-xs font-semibold',
    md: 'text-sm font-bold',
    lg: 'text-base font-bold',
  };

  const formatted = value > 0 ? value.toFixed(1) : 'NR';

  return (
    <div
      className={`inline-flex items-center gap-1 text-amber-500 dark:text-amber-400 ${className}`}
      title={`Rating: ${value > 0 ? `${value}/10` : 'Not Rated'}`}
    >
      <Star className={`${iconSizes[size]} fill-amber-400 stroke-amber-500`} />
      <span className={`${textSizes[size]} text-surface-900 dark:text-surface-100 tracking-tight`}>
        {formatted}
      </span>
      {showOutOf && value > 0 && (
        <span className="text-xs font-normal text-surface-500 dark:text-surface-400">
          /10
        </span>
      )}
    </div>
  );
};
