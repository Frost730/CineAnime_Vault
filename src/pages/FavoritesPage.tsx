import React, { useMemo } from 'react';
import { Heart } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { FilterPanel } from '../components/media/FilterPanel';
import { MediaGrid } from '../components/media/MediaGrid';

export const FavoritesPage: React.FC = () => {
  const { filteredMedia, viewMode, openAddModal, media } = useWatchlist();

  const favoriteItems = useMemo(() => {
    return filteredMedia.filter((m) => m.favorite);
  }, [filteredMedia]);

  const allFavorites = media.filter((m) => m.favorite);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500">
              <Heart className="w-5 h-5 fill-rose-500" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-surface-900 dark:text-surface-100 tracking-tight">
              Favorites
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-surface-500 dark:text-surface-400">
            Your most cherished films and anime series ({allFavorites.length} starred).
          </p>
        </div>
      </div>

      <FilterPanel titlePlaceholder="Search your favorites..." />

      <MediaGrid
        items={favoriteItems}
        viewMode={viewMode}
        emptyTitle="No favorite titles yet"
        emptyDescription="Click the heart icon on any movie or anime card to add it to your favorites."
        emptyActionLabel="Explore Library"
        onEmptyAction={() => openAddModal()}
      />
    </div>
  );
};
