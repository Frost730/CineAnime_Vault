import React, { useMemo } from 'react';
import { Bookmark } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { FilterPanel } from '../components/media/FilterPanel';
import { MediaGrid } from '../components/media/MediaGrid';

export const WatchlistPage: React.FC = () => {
  const { filteredMedia, viewMode, openAddModal } = useWatchlist();

  const planItems = useMemo(() => {
    return filteredMedia.filter((m) => m.status === 'Plan to Watch');
  }, [filteredMedia]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
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
            Titles queued up for future viewing.
          </p>
        </div>

        <button
          type="button"
          onClick={() => openAddModal()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto touch-manipulation cursor-pointer"
        >
          <Bookmark className="w-4 h-4" />
          <span>Queue Title</span>
        </button>
      </div>

      {/* Filter and Search Panel */}
      <FilterPanel showStatusFilter={false} titlePlaceholder="Search queued titles..." />

      {/* Media Grid supporting both Grid & List view modes */}
      <MediaGrid
        items={planItems}
        viewMode={viewMode}
        emptyTitle="Watchlist is empty"
        emptyDescription="You have no titles in your Plan to Watch queue. Add upcoming movies, TV series, or anime to keep track of what to watch next."
        emptyActionLabel="Queue a Title"
        onEmptyAction={() => openAddModal()}
      />
    </div>
  );
};
