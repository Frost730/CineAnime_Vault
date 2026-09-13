import React, { useMemo } from 'react';
import { PlayCircle, Plus } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { FilterPanel } from '../components/media/FilterPanel';
import { MediaGrid } from '../components/media/MediaGrid';

export const CurrentlyWatchingPage: React.FC = () => {
  const { filteredMedia, viewMode, openAddModal } = useWatchlist();

  const watchingItems = useMemo(() => {
    return filteredMedia.filter((m) => m.status === 'Watching');
  }, [filteredMedia]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500">
              <PlayCircle className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-surface-900 dark:text-surface-100 tracking-tight">
              Currently Watching
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-surface-500 dark:text-surface-400">
            Keep track of what you're actively viewing. Hover or tap cards to increment episodes!
          </p>
        </div>

        <button
          type="button"
          onClick={() => openAddModal()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Title</span>
        </button>
      </div>

      <FilterPanel showStatusFilter={false} titlePlaceholder="Search active titles..." />

      <MediaGrid
        items={watchingItems}
        viewMode={viewMode}
        emptyTitle="Nothing currently watching"
        emptyDescription="Pick a movie or anime from your Plan to Watch list to start watching."
        emptyActionLabel="Add Title"
        onEmptyAction={() => openAddModal()}
      />
    </div>
  );
};
