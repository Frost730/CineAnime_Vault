import {
  BarChart3,
  Film,
  CheckCircle2,
  Star,
  Clock,
  Sparkles,
  PieChart,
  Calendar,
} from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { useStats } from '../hooks/useStats';
import { StatCard } from '../components/stats/StatCard';
import { DonutChart, RatingHistogram, GenreBarChart, MonthlyTimeline } from '../components/stats/Charts';
import { ProgressBar } from '../components/common/ProgressBar';

export const StatisticsPage: React.FC = () => {
  const { media } = useWatchlist();
  const stats = useStats(media);

  // Type donut breakdown
  const typeData = [
    { label: 'Movies', count: stats.movieCount, color: '#38bdf8' },
    { label: 'Series', count: stats.seriesCount, color: '#10b981' },
    { label: 'Anime', count: stats.animeCount, color: '#ec4899' },
  ].filter((t) => t.count > 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-brand-500">
            <BarChart3 className="w-5 h-5" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-surface-900 dark:text-surface-100 tracking-tight">
            Library Analytics
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-surface-500 dark:text-surface-400">
          Real-time metrics, viewing habits, and distribution charts calculated from your offline library.
        </p>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          icon={<Film className="w-4 h-4 text-sky-500" />}
          label="Total Catalog"
          value={stats.totalCount}
          subValue={`${stats.movieCount} movies, ${stats.seriesCount} series, ${stats.animeCount} anime`}
        />
        <StatCard
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />}
          label="Completion Rate"
          value={`${stats.completionRate}%`}
          subValue={`${stats.completedCount} of ${stats.totalCount} titles`}
        />
        <StatCard
          icon={<Star className="w-4 h-4 text-amber-500" />}
          label="Average Rating"
          value={stats.averageRating > 0 ? `${stats.averageRating}★` : 'NR'}
          subValue={`Movies ${stats.movieAverageRating || 'NR'}★ | Series ${stats.seriesAverageRating || 'NR'}★ | Anime ${stats.animeAverageRating || 'NR'}★`}
        />
        <StatCard
          icon={<Clock className="w-4 h-4 text-purple-500" />}
          label="Est. Watch Time"
          value={`${stats.estimatedHoursWatched} hrs`}
          subValue={`${stats.totalEpisodesWatched} episodes + movies`}
        />
      </div>

      {/* Completion Progress Bar Widget */}
      <div className="p-5 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200/80 dark:border-surface-800/80 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-500" />
            <h3 className="text-sm font-bold text-surface-900 dark:text-surface-100">
              Overall Library Completion
            </h3>
          </div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
            {stats.completedCount} Completed / {stats.totalCount} Total
          </span>
        </div>
        <ProgressBar
          progressPercentage={stats.completionRate}
          size="lg"
          colorScheme="success"
          showPercentage={true}
        />
      </div>

      {/* Charts Grid: Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Watch Status Breakdown */}
        <div className="p-5 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200/80 dark:border-surface-800/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-surface-500 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-indigo-500" />
              Watch Status Distribution
            </h3>
            <span className="text-xs text-surface-400 font-medium">{stats.totalCount} titles</span>
          </div>
          <DonutChart data={stats.statusDistribution} totalLabel="Titles" />
        </div>

        {/* Movies vs Anime Breakdown */}
        <div className="p-5 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200/80 dark:border-surface-800/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-surface-500 flex items-center gap-2">
              <Film className="w-4 h-4 text-sky-500" />
              Movies vs. Anime Ratio
            </h3>
            <span className="text-xs text-surface-400 font-medium">Format Breakdown</span>
          </div>
          <DonutChart data={typeData} totalLabel="Library" />
        </div>
      </div>

      {/* Charts Grid: Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rating Distribution Histogram */}
        <div className="p-5 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200/80 dark:border-surface-800/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-surface-500 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500" />
              Rating Distribution
            </h3>
            <span className="text-xs text-surface-400 font-medium">Frequency</span>
          </div>
          <RatingHistogram data={stats.ratingDistribution} />
        </div>

        {/* Top Genres Bar Chart */}
        <div className="p-5 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200/80 dark:border-surface-800/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-surface-500 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-pink-500" />
              Top Genres in Library
            </h3>
            <span className="text-xs text-surface-400 font-medium">By Frequency</span>
          </div>
          <GenreBarChart data={stats.genreDistribution} limit={7} />
        </div>
      </div>

      {/* Timeline Chart */}
      <div className="p-5 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200/80 dark:border-surface-800/80 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-surface-500 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-500" />
            Titles Added Over Time
          </h3>
          <span className="text-xs text-surface-400 font-medium">Monthly Timeline</span>
        </div>
        <MonthlyTimeline data={stats.monthlyAdditions} />
      </div>
    </div>
  );
};
