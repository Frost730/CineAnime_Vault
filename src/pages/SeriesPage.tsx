import { useMemo } from 'react';
import { Tv, PlayCircle, Star, Sparkles } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { FilterPanel } from '../components/media/FilterPanel';
import { MediaGrid } from '../components/media/MediaGrid';
import { StatCard } from '../components/stats/StatCard';

export const SeriesPage: React.FC = () => {
  const { filteredMedia, viewMode, openAddModal, media } = useWatchlist();

  // Filter for Series
  const seriesList = useMemo(() => {
    return filteredMedia.filter((m) => m.type === 'Series');
  }, [filteredMedia]);

  const allSeries = media.filter((m) => m.type === 'Series');
  const watchingSeries = allSeries.filter((m) => m.status === 'Watching');
  const completedSeries = allSeries.filter((m) => m.status === 'Completed');
  const totalEpisodesWatched = allSeries.reduce((acc, s) => acc + (s.progress || 0), 0);
  const ratedSeries = allSeries.filter((m) => m.rating > 0);
  const avgRating = ratedSeries.length > 0
    ? (ratedSeries.reduce((acc, s) => acc + s.rating, 0) / ratedSeries.length).toFixed(1)
    : 'NR';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
              <Tv className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-surface-900 dark:text-surface-100 tracking-tight">
              TV Series
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-surface-500 dark:text-surface-400">
            Track seasons, episode milestones, binge-worthy dramas, and episodic favorites.
          </p>
        </div>

        <button
          type="button"
          onClick={() => openAddModal('Series')}
          className="inline-flex items-center gap-2 px-4 py-2.5 sm:py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all self-start sm:self-auto touch-manipulation active:scale-95"
        >
          <Tv className="w-4 h-4" />
          <span>Add Series</span>
        </button>
      </div>

      {/* Series Stats Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          icon={<Tv className="w-4 h-4 text-emerald-500" />}
          label="Total Series"
          value={allSeries.length}
          subValue={`${completedSeries.length} completed`}
        />
        <StatCard
          icon={<Sparkles className="w-4 h-4 text-indigo-500" />}
          label="Episodes Watched"
          value={totalEpisodesWatched}
        />
        <StatCard
          icon={<PlayCircle className="w-4 h-4 text-amber-500" />}
          label="In Progress"
          value={watchingSeries.length}
        />
        <StatCard
          icon={<Star className="w-4 h-4 text-amber-400" />}
          label="Average Rating"
          value={avgRating !== 'NR' ? `${avgRating}★` : 'NR'}
        />
      </div>

      {/* Filter and Search */}
      <FilterPanel showTypeFilter={false} titlePlaceholder="Search TV series..." />

      {/* Media Grid */}
      <MediaGrid
        items={seriesList}
        viewMode={viewMode}
        emptyTitle="No TV series found"
        emptyDescription="Your series collection is currently empty. Start tracking your favorite shows and episode progress!"
        onEmptyAction={() => openAddModal('Series')}
        emptyActionLabel="Add Your First Series"
      />
    </div>
  );
};
