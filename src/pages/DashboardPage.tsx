import React from 'react';
import { Link } from 'react-router-dom';
import {
  Film,
  Tv,
  PlayCircle,
  CheckCircle2,
  Bookmark,
  Heart,
  Star,
  Plus,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { useStats } from '../hooks/useStats';
import { StatCard } from '../components/stats/StatCard';
import { MediaCard } from '../components/media/MediaCard';
import { EmptyState } from '../components/common/EmptyState';

export const DashboardPage: React.FC = () => {
  const { media, openAddModal } = useWatchlist();
  const stats = useStats(media);

  // Curated lists
  const continueWatching = media
    .filter((m) => m.status === 'Watching')
    .sort((a, b) => {
      const timeA = a.lastWatched ? new Date(a.lastWatched).getTime() : 0;
      const timeB = b.lastWatched ? new Date(b.lastWatched).getTime() : 0;
      return timeB - timeA;
    })
    .slice(0, 6);

  const recentlyAdded = [...media]
    .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
    .slice(0, 6);

  const recentlyCompleted = media
    .filter((m) => m.status === 'Completed')
    .sort((a, b) => {
      const timeA = a.lastWatched ? new Date(a.lastWatched).getTime() : 0;
      const timeB = b.lastWatched ? new Date(b.lastWatched).getTime() : 0;
      return timeB - timeA;
    })
    .slice(0, 6);

  const favorites = media.filter((m) => m.favorite).slice(0, 6);

  const planToWatch = media
    .filter((m) => m.status === 'Plan to Watch')
    .slice(0, 6);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-5 sm:p-8 md:p-10 shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-white/15 backdrop-blur-md text-indigo-200 mb-3 sm:mb-4">
            <TrendingUp className="w-3.5 h-3.5 text-pink-400" />
            Your Entertainment Hub
          </span>
          <h1 className="text-xl sm:text-3xl md:text-4xl font-black tracking-tight text-white mb-2 leading-tight">
            Welcome to CineAnime Vault
          </h1>
          <p className="text-indigo-100/80 text-xs sm:text-base mb-5 sm:mb-6 leading-relaxed">
            Track your cinematic journeys, anime series, and personal ratings completely offline with zero server tracking.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="button"
              onClick={() => openAddModal()}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 rounded-xl bg-white text-indigo-950 font-bold text-sm shadow-lg hover:bg-indigo-50 active:scale-[0.98] transition-all touch-manipulation"
            >
              <Plus className="w-4 h-4 text-indigo-600" />
              <span>Add New Title</span>
            </button>
            <Link
              to="/library"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm backdrop-blur-md transition-colors active:scale-[0.98] touch-manipulation"
            >
              <span>Explore Library</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-pink-500/20 blur-3xl pointer-events-none" />
        <div className="absolute right-32 -bottom-20 w-72 h-72 rounded-full bg-indigo-500/30 blur-3xl pointer-events-none" />
      </div>

      {/* Primary Key Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
        <StatCard
          icon={<Film className="w-4 h-4 text-sky-500" />}
          label="Total"
          value={stats.totalCount}
          className="col-span-1"
        />
        <StatCard
          icon={<Film className="w-4 h-4 text-sky-400" />}
          label="Movies"
          value={stats.movieCount}
          className="col-span-1"
        />
        <StatCard
          icon={<Tv className="w-4 h-4 text-emerald-400" />}
          label="Series"
          value={stats.seriesCount}
          className="col-span-1"
        />
        <StatCard
          icon={<Sparkles className="w-4 h-4 text-pink-500" />}
          label="Anime"
          value={stats.animeCount}
          className="col-span-1"
        />
        <StatCard
          icon={<PlayCircle className="w-4 h-4 text-indigo-500" />}
          label="Watching"
          value={stats.watchingCount}
          className="col-span-1 sm:col-span-2 lg:col-span-1"
        />
        <StatCard
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />}
          label="Completed"
          value={stats.completedCount}
          className="col-span-1 sm:col-span-2 lg:col-span-1"
        />
        <StatCard
          icon={<Bookmark className="w-4 h-4 text-purple-500" />}
          label="Plan to Watch"
          value={stats.planToWatchCount}
          className="col-span-1 sm:col-span-2 lg:col-span-1"
        />
        <StatCard
          icon={<Heart className="w-4 h-4 text-rose-500" />}
          label="Favorites"
          value={stats.favoriteCount}
          className="col-span-1 sm:col-span-2 lg:col-span-1"
        />
        <StatCard
          icon={<Star className="w-4 h-4 text-amber-500" />}
          label="Avg Rating"
          value={stats.averageRating > 0 ? `${stats.averageRating}★` : 'NR'}
          className="col-span-1 sm:col-span-2 lg:col-span-1"
        />
      </div>

      {/* Section 1: Continue Watching */}
      {continueWatching.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-xl font-black text-surface-900 dark:text-surface-100 tracking-tight">
                Continue Watching
              </h2>
            </div>
            <Link
              to="/watching"
              className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              <span>View all ({stats.watchingCount})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {continueWatching.map((item) => (
              <MediaCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Section 2: Recently Added */}
      {recentlyAdded.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-brand-500" />
              <h2 className="text-xl font-black text-surface-900 dark:text-surface-100 tracking-tight">
                Recently Added
              </h2>
            </div>
            <Link
              to="/library"
              className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              <span>View full library</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {recentlyAdded.map((item) => (
              <MediaCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Section 3: Recently Completed */}
      {recentlyCompleted.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <h2 className="text-xl font-black text-surface-900 dark:text-surface-100 tracking-tight">
                Recently Completed
              </h2>
            </div>
            <Link
              to="/completed"
              className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              <span>View completed ({stats.completedCount})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {recentlyCompleted.map((item) => (
              <MediaCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Section 4: Favorites */}
      {favorites.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500" />
              <h2 className="text-xl font-black text-surface-900 dark:text-surface-100 tracking-tight">
                Favorite Titles
              </h2>
            </div>
            <Link
              to="/favorites"
              className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              <span>View favorites ({stats.favoriteCount})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {favorites.map((item) => (
              <MediaCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Section 5: Plan to Watch */}
      {planToWatch.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-purple-500" />
              <h2 className="text-xl font-black text-surface-900 dark:text-surface-100 tracking-tight">
                Plan to Watch
              </h2>
            </div>
            <Link
              to="/watchlist"
              className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              <span>View watchlist ({stats.planToWatchCount})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {planToWatch.map((item) => (
              <MediaCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* If library is completely empty */}
      {media.length === 0 && (
        <EmptyState
          title="Your Vault is Empty"
          description="Start building your personal movie, TV series, and anime library by adding your first title!"
          actionLabel="Add Your First Title"
          onAction={() => openAddModal()}
        />
      )}
    </div>
  );
};
