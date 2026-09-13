import React from 'react';
import { useWatchlist } from '../context/WatchlistContext';
import { FilterPanel } from '../components/media/FilterPanel';
import { MediaGrid } from '../components/media/MediaGrid';

export const LibraryPage: React.FC = () => {
  const { filteredMedia, viewMode, openAddModal } = useWatchlist();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-surface-900 dark:text-surface-100 tracking-tight">
            My Library
          </h1>
          <p className="text-xs sm:text-sm text-surface-500 dark:text-surface-400 mt-1">
            Browse, search, and manage your complete collection of movies and anime.
          </p>
        </div>
      </div>

      {/* Filter and Search Panel */}
      <FilterPanel />

      {/* Media Items */}
      <MediaGrid
        items={filteredMedia}
        viewMode={viewMode}
        emptyTitle="No matching titles found"
        emptyDescription="Try adjusting your filters or search terms, or add a new movie or anime to your library."
        emptyActionLabel="Add Title"
        onEmptyAction={() => openAddModal()}
      />
    </div>
  );
};
