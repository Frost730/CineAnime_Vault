import React from 'react';

// -------------------------------------------------------------
// 1. Donut Chart for Status Breakdown
// -------------------------------------------------------------
interface DonutSlice {
  label: string;
  count: number;
  color: string;
}

interface DonutChartProps {
  data: DonutSlice[];
  totalLabel?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({ data, totalLabel = 'Total' }) => {
  const total = data.reduce((sum, d) => sum + d.count, 0);

  if (total === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-sm text-surface-400">
        No data available
      </div>
    );
  }

  // Calculate SVG paths for donut segments
  const size = 200;
  const strokeWidth = 28;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedOffset = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-4">
      <div className="relative w-48 h-48 shrink-0">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full -rotate-90 transform">
          {/* Base background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-surface-100 dark:text-surface-800"
          />

          {data.map((slice) => {
            const strokeDasharray = `${(slice.count / total) * circumference} ${circumference}`;
            const strokeDashoffset = -accumulatedOffset;
            accumulatedOffset += (slice.count / total) * circumference;

            return (
              <circle
                key={slice.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={slice.color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-500 hover:opacity-80"
              />
            );
          })}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-black text-surface-900 dark:text-surface-100">{total}</span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-surface-400">
            {totalLabel}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-2 w-full max-w-xs">
        {data.map((slice) => {
          const pct = Math.round((slice.count / total) * 100);
          return (
            <div key={slice.label} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="font-medium text-surface-700 dark:text-surface-300">
                  {slice.label}
                </span>
              </div>
              <div className="flex items-center gap-2 font-bold text-surface-900 dark:text-surface-100">
                <span>{slice.count}</span>
                <span className="text-surface-400 font-normal w-9 text-right">{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 2. Rating Distribution Histogram (Ratings 1 to 10)
// -------------------------------------------------------------
interface RatingHistogramProps {
  data: { rating: number; count: number }[];
}

export const RatingHistogram: React.FC<RatingHistogramProps> = ({ data }) => {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="flex items-end gap-1.5 sm:gap-2 h-48 pt-6 pb-2">
        {data.map((d) => {
          const heightPct = Math.round((d.count / maxCount) * 100);
          return (
            <div key={d.rating} className="flex-1 flex flex-col items-center h-full justify-end group">
              {/* Count tooltip on hover or bar */}
              <span className="text-[10px] font-bold text-surface-400 opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                {d.count}
              </span>
              <div
                className="w-full rounded-t-md bg-amber-400 dark:bg-amber-500/80 group-hover:bg-amber-500 transition-all duration-300 min-h-[4px]"
                style={{ height: `${heightPct}%` }}
              />
              <span className="text-[11px] font-bold text-surface-500 dark:text-surface-400 mt-2">
                {d.rating}★
              </span>
            </div>
          );
        })}
      </div>
      <div className="text-center text-xs font-semibold text-surface-400 uppercase tracking-wider">
        Ratings (1★ to 10★)
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 3. Genre Distribution Horizontal Bar Chart
// -------------------------------------------------------------
interface GenreBarChartProps {
  data: { genre: string; count: number }[];
  limit?: number;
}

export const GenreBarChart: React.FC<GenreBarChartProps> = ({ data, limit = 8 }) => {
  const displayed = data.slice(0, limit);
  const maxCount = Math.max(...displayed.map((d) => d.count), 1);

  if (displayed.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-sm text-surface-400">
        No genre data recorded yet
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-2">
      {displayed.map((item) => {
        const widthPct = Math.round((item.count / maxCount) * 100);
        return (
          <div key={item.genre} className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-xs font-semibold text-surface-700 dark:text-surface-300">
              <span>{item.genre}</span>
              <span className="text-surface-500 dark:text-surface-400">{item.count} titles</span>
            </div>
            <div className="w-full h-2 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 transition-all duration-500"
                style={{ width: `${widthPct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// -------------------------------------------------------------
// 4. Monthly Additions Timeline Bar Chart
// -------------------------------------------------------------
interface MonthlyTimelineProps {
  data: { month: string; count: number }[];
}

export const MonthlyTimeline: React.FC<MonthlyTimelineProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-sm text-surface-400">
        No addition history available yet
      </div>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="flex items-end gap-3 h-44 pt-6 pb-2 overflow-x-auto">
        {data.map((d) => {
          const heightPct = Math.round((d.count / maxCount) * 100);
          return (
            <div key={d.month} className="min-w-[48px] flex-1 flex flex-col items-center h-full justify-end group">
              <span className="text-[10px] font-bold text-surface-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {d.count}
              </span>
              <div
                className="w-full rounded-t-lg bg-brand-500/80 hover:bg-brand-500 transition-all duration-300 min-h-[4px]"
                style={{ height: `${heightPct}%` }}
              />
              <span className="text-[10px] font-semibold text-surface-400 mt-2 truncate max-w-full">
                {d.month}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
