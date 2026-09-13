import React, { useState, useRef } from 'react';
import { ArrowDown, RotateCcw } from 'lucide-react';

interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh?: () => Promise<void> | void;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({ children, onRefresh }) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [readyToRelease, setReadyToRelease] = useState(false);

  const startY = useRef<number | null>(null);
  const currentY = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const PULL_THRESHOLD = 64;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isRefreshing) return;

    // Only allow pull-down if container is scrolled to the absolute top
    const scrollParent = containerRef.current?.closest('main') || containerRef.current;
    if (scrollParent && scrollParent.scrollTop <= 2) {
      startY.current = e.touches[0].clientY;
      currentY.current = e.touches[0].clientY;
    } else {
      startY.current = null;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY.current === null || isRefreshing) return;

    currentY.current = e.touches[0].clientY;
    const diff = currentY.current - startY.current;

    if (diff > 0) {
      // Damped pull distance
      const distance = Math.min(diff * 0.4, 85);
      setPullDistance(distance);

      if (distance >= PULL_THRESHOLD && !readyToRelease) {
        setReadyToRelease(true);
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          navigator.vibrate?.(12);
        }
      } else if (distance < PULL_THRESHOLD && readyToRelease) {
        setReadyToRelease(false);
      }
    } else {
      setPullDistance(0);
      setReadyToRelease(false);
    }
  };

  const handleTouchEnd = async () => {
    if (startY.current === null || isRefreshing) return;

    startY.current = null;
    currentY.current = null;

    if (readyToRelease) {
      setIsRefreshing(true);
      setPullDistance(PULL_THRESHOLD);

      try {
        if (onRefresh) {
          await onRefresh();
        } else {
          // Default refresh: brief animation then state settles
          await new Promise((resolve) => setTimeout(resolve, 650));
        }
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
        setReadyToRelease(false);
      }
    } else {
      setPullDistance(0);
      setReadyToRelease(false);
    }
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative min-h-full"
    >
      {/* Pull Indicator */}
      <div
        className="overflow-hidden flex items-center justify-center transition-[height,opacity] duration-200 ease-out"
        style={{
          height: isRefreshing ? `${PULL_THRESHOLD}px` : `${pullDistance}px`,
          opacity: pullDistance > 10 || isRefreshing ? 1 : 0,
        }}
      >
        <div className="flex items-center gap-2 py-2 px-3.5 rounded-full bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-md text-xs font-bold text-surface-700 dark:text-surface-300 scale-95">
          {isRefreshing ? (
            <>
              <RotateCcw className="w-4 h-4 text-brand-500 animate-spin" />
              <span>Refreshing...</span>
            </>
          ) : (
            <>
              <ArrowDown
                className="w-4 h-4 text-brand-500 transition-transform duration-200"
                style={{
                  transform: `rotate(${readyToRelease ? 180 : Math.min(180, (pullDistance / PULL_THRESHOLD) * 180)}deg)`,
                }}
              />
              <span>{readyToRelease ? 'Release to refresh' : 'Pull down to refresh'}</span>
            </>
          )}
        </div>
      </div>

      {children}
    </div>
  );
};
