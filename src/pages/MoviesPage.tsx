import React, { useMemo } from 'react';
import { Film, CheckCircle2, Star, Clock } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { FilterPanel } from '../components/media/FilterPanel';
import { MediaGrid } from '../components/media/MediaGrid';
import { StatCard } from '../components/stats/StatCard';

export const MoviesPage: React.FC = () => {
  const { filteredMedia, viewMode, openAddModal, media } = useWatchlist();

  // Filter for movies
  const movies = useMemo(() => {
    return filteredMedia.filter((m) => m.type === 'Movie');
  }, [filteredMedia]);

  const allMovies = media.filter((m) => m.type === 'Movie');
  const completedMovies = allMovies.filter((m) => m.status === 'Completed');
  const ratedMovies = allMovies.filter((m) => m.rating > 0);
  const avgRating = ratedMovies.length > 0 
    ? (ratedMovies.reduce((acc, m) => acc + m.rating, 0) / ratedMovies.length).toFixed(1)
    : 'NR';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-500">
              <Film className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-surface-900 dark:text-surface-100 tracking-tight">
              Movies
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-surface-500 dark:text-surface-400">
            Track feature films, cinema favorites, and upcoming releases.
          </p>
        </div>

        <button
          type="button"
          onClick={() => openAddModal('Movie')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <Film className="w-4 h-4" />
          <span>Add Movie</span>
        </button>
      </div>

      {/* Movie Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          icon={<Film className="w-4 h-4 text-sky-500" />}
          label="Total Movies"
          value={allMovies.length}
        />
        <StatCard
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />}
          label="Watched"
          value={completedMovies.length}
        />
        <StatCard
          icon={<Star className="w-4 h-4 text-amber-500" />}
          label="Average Rating"
          value={avgRating !== 'NR' ? `${avgRating}★` : 'NR'}
        />
        <StatCard
          icon={<Clock className="w-4 h-4 text-purple-500" />}
          label="Watch Time"
          value={`${completedMovies.length * 2} hrs`}
          subValue="est."
        />
      </div>

      {/* Filter panel with type filter hidden since we are strictly on movies */}
      <FilterPanel showTypeFilter={false} titlePlaceholder="Search movies by title, genre, or tags..." />

      {/* Movies Grid */}
      <MediaGrid
        items={movies}
        viewMode={viewMode}
        emptyTitle="No movies found"
        emptyDescription="Add a feature film to start curating your movie library."
        emptyActionLabel="Add Movie"
        onEmptyAction={() => openAddModal('Movie')}
      />
    </div>
  );
};
