import React, { useMemo } from 'react';
import { Bookmark, PlayCircle, CheckCircle2, XCircle, Film, Tv } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { FilterPanel } from '../components/media/FilterPanel';
import { Rating } from '../components/common/Rating';
import { getPlaceholderPoster } from '../utils/placeholder';
import { EmptyState } from '../components/common/EmptyState';
import type { WatchStatus } from '../types/media';

export const WatchlistPage: React.FC = () => {
  const { filteredMedia, updateStatus, openDetailModal, openAddModal } = useWatchlist();

  const planItems = useMemo(() => {
    return filteredMedia.filter((m) => m.status === 'Plan to Watch');
  }, [filteredMedia]);

  const handleTriage = (e: React.MouseEvent, id: string, newStatus: WatchStatus) => {
    e.stopPropagation();
    updateStatus(id, newStatus);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-500">
              <Bookmark className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-surface-900 dark:text-surface-100 tracking-tight">
              Watchlist (Plan to Watch)
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-surface-500 dark:text-surface-400">
            Titles queued up for future viewing. Quickly triage them into Watching, Completed, or Dropped.
          </p>
        </div>

        <button
          type="button"
          onClick={() => openAddModal()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <Bookmark className="w-4 h-4" />
          <span>Queue Title</span>
        </button>
      </div>

      <FilterPanel showStatusFilter={false} titlePlaceholder="Search queued titles..." />

      {planItems.length === 0 ? (
        <EmptyState
          icon={<Bookmark className="w-8 h-8 text-purple-500" />}
          title="Watchlist is empty"
          description="You have no titles in your Plan to Watch queue. Add upcoming movies or anime series to keep track of what to watch next."
          actionLabel="Queue a Title"
          onAction={() => openAddModal()}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {planItems.map((item) => {
            const placeholder = getPlaceholderPoster(item.title, item.type, item.genre[0]);
            const posterSrc = item.posterUrl || placeholder;

            return (
              <div
                key={item.id}
                onClick={() => openDetailModal(item)}
                className="group relative flex flex-col justify-between p-4 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200/80 dark:border-surface-800/80 hover:border-purple-500/40 hover:shadow-lg transition-all cursor-pointer overflow-hidden"
              >
                <div className="flex items-start gap-3.5 mb-4">
                  {/* Poster Thumbnail */}
                  <div className="w-16 sm:w-20 aspect-[2/3] shrink-0 rounded-xl overflow-hidden bg-surface-900 shadow-sm">
                    <img
                      src={posterSrc}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = placeholder;
                      }}
                      loading="lazy"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 flex items-center gap-1">
                        {item.type === 'Movie' ? <Film className="w-2.5 h-2.5" /> : <Tv className="w-2.5 h-2.5" />}
                        {item.type}
                      </span>
                      <span className="text-xs text-surface-400 font-medium">{item.releaseYear}</span>
                    </div>

                    <h3 className="text-base font-bold text-surface-900 dark:text-surface-100 truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {item.title}
                    </h3>

                    <div className="flex items-center gap-2 my-1.5">
                      <Rating value={item.rating} size="sm" />
                      {item.genre.slice(0, 2).map((g) => (
                        <span key={g} className="text-[10px] font-medium text-surface-500 bg-surface-100 dark:bg-surface-800 px-1.5 py-0.5 rounded">
                          {g}
                        </span>
                      ))}
                    </div>

                    {item.description && (
                      <p className="text-xs text-surface-500 line-clamp-2 mt-1">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Quick Triage Buttons (Section 11 requirement) */}
                <div className="pt-3 border-t border-surface-100 dark:border-surface-800/80 flex items-center justify-between gap-1.5 flex-wrap">
                  <span className="text-[11px] font-semibold text-surface-400">Move to:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={(e) => handleTriage(e, item.id, 'Watching')}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 active:scale-95 touch-manipulation transition-all"
                      title="Start watching"
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>Watching</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleTriage(e, item.id, 'Completed')}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 active:scale-95 touch-manipulation transition-all"
                      title="Mark completed"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Completed</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleTriage(e, item.id, 'Dropped')}
                      className="inline-flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-bold text-surface-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 active:scale-90 touch-manipulation transition-all"
                      title="Drop title"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
