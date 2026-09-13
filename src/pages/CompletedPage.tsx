import { useMemo } from 'react';
import { Trophy } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { FilterPanel } from '../components/media/FilterPanel';
import { MediaGrid } from '../components/media/MediaGrid';

export const CompletedPage: React.FC = () => {
  const { filteredMedia, viewMode, openAddModal, media } = useWatchlist();

  const completedItems = useMemo(() => {
    return filteredMedia.filter((m) => m.status === 'Completed');
  }, [filteredMedia]);

  const allCompleted = media.filter((m) => m.status === 'Completed');
  const masterPieces = allCompleted.filter((m) => m.rating >= 9.0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
              <Trophy className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-surface-900 dark:text-surface-100 tracking-tight">
              Completed Vault
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-surface-500 dark:text-surface-400">
            Your personal hall of finished movies and completed anime series ({allCompleted.length} total, {masterPieces.length} rated 9.0+).
          </p>
        </div>
      </div>

      <FilterPanel showStatusFilter={false} titlePlaceholder="Search completed titles..." />

      <MediaGrid
        items={completedItems}
        viewMode={viewMode}
        emptyTitle="No completed titles yet"
        emptyDescription="When you finish a movie or reach the final episode of an anime, it will be celebrated here!"
        emptyActionLabel="Add Title"
        onEmptyAction={() => openAddModal()}
      />
    </div>
  );
};
