import React from 'react';
import type { MediaItem } from '../../types/media';
import { MediaCard } from './MediaCard';
import { EmptyState } from '../common/EmptyState';
import { Film } from 'lucide-react';

interface MediaGridProps {
  items: MediaItem[];
  viewMode?: 'grid' | 'list';
  emptyTitle?: string;
  emptyDescription?: string;
  onEmptyAction?: () => void;
  emptyActionLabel?: string;
}

export const MediaGrid: React.FC<MediaGridProps> = ({
  items,
  viewMode = 'grid',
  emptyTitle = 'No media found',
  emptyDescription = 'Try adjusting your filters or search query, or add a new title to your library.',
  onEmptyAction,
  emptyActionLabel,
}) => {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={<Film className="w-8 h-8 text-brand-500" />}
        title={emptyTitle}
        description={emptyDescription}
        onAction={onEmptyAction}
        actionLabel={emptyActionLabel}
      />
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <MediaCard key={item.id} item={item} viewMode="list" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5">
      {items.map((item) => (
        <MediaCard key={item.id} item={item} viewMode="grid" />
      ))}
    </div>
  );
};
