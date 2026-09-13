import { useMemo } from 'react';
import { Tv, PlayCircle, Star, Sparkles } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { FilterPanel } from '../components/media/FilterPanel';
import { MediaGrid } from '../components/media/MediaGrid';
import { StatCard } from '../components/stats/StatCard';

export const AnimePage: React.FC = () => {
  const { filteredMedia, viewMode, openAddModal, media } = useWatchlist();

  // Filter for anime
  const animeList = useMemo(() => {
    return filteredMedia.filter((m) => m.type === 'Anime');
  }, [filteredMedia]);

  const allAnime = media.filter((m) => m.type === 'Anime');
  const watchingAnime = allAnime.filter((m) => m.status === 'Watching');
  const completedAnime = allAnime.filter((m) => m.status === 'Completed');
  const totalEpisodesWatched = allAnime.reduce((acc, a) => acc + (a.progress || 0), 0);
  const ratedAnime = allAnime.filter((m) => m.rating > 0);
  const avgRating = ratedAnime.length > 0
    ? (ratedAnime.reduce((acc, a) => acc + a.rating, 0) / ratedAnime.length).toFixed(1)
    : 'NR';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-pink-500/10 text-pink-500">
              <Tv className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-surface-900 dark:text-surface-100 tracking-tight">
              Anime
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-surface-500 dark:text-surface-400">
            Track episode milestones, seasonal series, shonen sagas, and OVA favorites.
          </p>
        </div>

        <button
          type="button"
          onClick={() => openAddModal('Anime')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <Tv className="w-4 h-4" />
          <span>Add Anime</span>
        </button>
      </div>

      {/* Anime Stats Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          icon={<Tv className="w-4 h-4 text-pink-500" />}
          label="Total Series"
          value={allAnime.length}
          subValue={`${completedAnime.length} completed`}
        />
        <StatCard
          icon={<Sparkles className="w-4 h-4 text-indigo-500" />}
          label="Episodes Watched"
          value={totalEpisodesWatched}
        />
        <StatCard
          icon={<PlayCircle className="w-4 h-4 text-amber-500" />}
          label="In Progress"
          value={watchingAnime.length}
        />
        <StatCard
          icon={<Star className="w-4 h-4 text-amber-400" />}
          label="Average Rating"
          value={avgRating !== 'NR' ? `${avgRating}★` : 'NR'}
        />
      </div>

      {/* Filter panel */}
      <FilterPanel showTypeFilter={false} titlePlaceholder="Search anime by title, genre, or tags..." />

      {/* Anime Grid */}
      <MediaGrid
        items={animeList}
        viewMode={viewMode}
        emptyTitle="No anime found"
        emptyDescription="Add an anime series to begin tracking episode milestones."
        emptyActionLabel="Add Anime"
        onEmptyAction={() => openAddModal('Anime')}
      />
    </div>
  );
};
