import React, { useState, memo } from 'react';
import { Heart, Plus, Check, Play, Film, Tv, Sparkles, Trash2 } from 'lucide-react';
import type { MediaItem } from '../../types/media';
import { useWatchlist } from '../../context/WatchlistContext';
import { StatusBadge } from '../common/StatusBadge';
import { Rating } from '../common/Rating';
import { ProgressBar } from '../common/ProgressBar';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { getPlaceholderPoster } from '../../utils/placeholder';
import { calculateProgressPercentage, formatProgressText } from '../../utils/formatters';

interface MediaCardProps {
  item: MediaItem;
  viewMode?: 'grid' | 'list';
}

const MediaCardComponent: React.FC<MediaCardProps> = ({ item, viewMode = 'grid' }) => {
  const { toggleFavorite, updateProgress, openDetailModal, deleteMedia } = useWatchlist();
  const [imageError, setImageError] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const placeholder = getPlaceholderPoster(item.title, item.type, item.genre[0]);
  const posterSrc = !imageError && item.posterUrl ? item.posterUrl : placeholder;
  const progressPct = calculateProgressPercentage(item);

  const handleQuickProgress = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.type === 'Movie') {
      updateProgress(item.id, item.progress >= 1 ? 0 : 1);
    } else {
      updateProgress(item.id, item.progress + 1);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(item.id);
  };

  // List View Rendering
  if (viewMode === 'list') {
    return (
      <>
        <div
        onClick={() => openDetailModal(item)}
        className="media-card-item group relative flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 hover:border-brand-500/50 dark:hover:border-brand-500/50 hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-[0.99] touch-manipulation"
      >
        {/* Poster Thumbnail */}
        <div className="relative w-14 sm:w-20 aspect-[2/3] shrink-0 rounded-xl overflow-hidden bg-surface-800 shadow-sm">
          <img
            src={posterSrc}
            alt={item.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute top-1 left-1 px-1 py-0.5 rounded text-[9px] font-bold bg-black/70 backdrop-blur-sm text-white flex items-center gap-1">
            {item.type === 'Movie' ? (
              <Film className="w-2.5 h-2.5 text-sky-400" />
            ) : item.type === 'Series' ? (
              <Tv className="w-2.5 h-2.5 text-emerald-400" />
            ) : (
              <Sparkles className="w-2.5 h-2.5 text-pink-400" />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
            <h3 className="text-sm sm:text-base font-bold text-surface-900 dark:text-surface-100 truncate group-hover:text-brand-500 transition-colors">
              {item.title}
            </h3>
            <span className="text-[11px] sm:text-xs text-surface-400 font-medium">({item.releaseYear})</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mb-2">
            <StatusBadge status={item.status} size="sm" />
            <Rating value={item.rating} size="sm" />
            {item.genre.slice(0, 2).map((g) => (
              <span
                key={g}
                className="hidden sm:inline-block text-[11px] font-medium text-surface-600 dark:text-surface-400 bg-surface-100 dark:bg-surface-800 px-2 py-0.5 rounded-md"
              >
                {g}
              </span>
            ))}
          </div>

          {/* Progress row */}
          <div className="max-w-xs">
            <ProgressBar
              progressPercentage={progressPct}
              label={formatProgressText(item)}
              size="sm"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={handleQuickProgress}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 hover:bg-brand-500 hover:text-white transition-colors active:scale-95 touch-manipulation"
            title={item.type === 'Movie' ? 'Toggle watched' : '+1 Episode'}
          >
            {item.type === 'Movie' ? (
              item.progress >= 1 ? <Check className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />
            ) : (
              <Plus className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">{item.type === 'Movie' ? 'Watched' : '+1 Ep'}</span>
          </button>

          <button
            type="button"
            onClick={handleFavoriteClick}
            className={`p-2 rounded-xl transition-all active:scale-90 touch-manipulation ${
              item.favorite
                ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40'
                : 'text-surface-400 hover:text-rose-500 hover:bg-surface-100 dark:hover:bg-surface-800'
            }`}
            aria-label={item.favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-4 h-4 ${item.favorite ? 'fill-rose-500' : ''}`} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteConfirm(true);
            }}
            className="p-2 rounded-xl text-surface-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 active:scale-90 transition-all touch-manipulation"
            title={`Delete "${item.title}"`}
            aria-label={`Delete "${item.title}"`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => deleteMedia(item.id)}
        title={`Delete "${item.title}"?`}
        message="Are you sure you want to remove this title from your library? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
      />
    </>
  );
}

  // Grid View Rendering
  return (
    <>
      <div
        onClick={() => openDetailModal(item)}
        className="media-card-item group relative flex flex-col rounded-2xl bg-white dark:bg-surface-900 border border-surface-200/80 dark:border-surface-800/80 hover:border-brand-500/50 dark:hover:border-brand-500/50 shadow-sm hover:shadow-xl dark:hover:shadow-brand-950/20 transition-all duration-300 overflow-hidden cursor-pointer active:scale-[0.99] touch-manipulation"
      >
        {/* Poster Image Container */}
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-surface-900">
          <img
            src={posterSrc}
            alt={item.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
            decoding="async"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 opacity-70 group-hover:opacity-60 transition-opacity" />

          {/* Top Badges */}
          <div className="absolute top-2 left-2 right-2 sm:top-2.5 sm:left-2.5 sm:right-2.5 flex items-center justify-between pointer-events-none">
            {/* Type Badge */}
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md text-[10px] sm:text-[11px] font-bold tracking-wider uppercase bg-black/60 backdrop-blur-md text-white border border-white/10 shadow-sm">
              {item.type === 'Movie' ? (
                <Film className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-sky-400" />
              ) : item.type === 'Series' ? (
                <Tv className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400" />
              ) : (
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-pink-400" />
              )}
              {item.type}
            </span>

            {/* Top Right Actions: Favorite & Delete */}
            <div className="flex items-center gap-1 pointer-events-auto">
              <button
                type="button"
                onClick={handleFavoriteClick}
                className={`p-1.5 rounded-full backdrop-blur-md transition-transform active:scale-75 touch-manipulation ${
                  item.favorite
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                    : 'bg-black/50 text-white hover:text-rose-400 hover:bg-black/70'
                }`}
                aria-label={item.favorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className={`w-3.5 h-3.5 ${item.favorite ? 'fill-white' : ''}`} />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(true);
                }}
                className="p-1.5 rounded-full backdrop-blur-md bg-black/50 text-white/80 hover:text-rose-400 hover:bg-black/70 active:scale-75 transition-all touch-manipulation opacity-80 sm:opacity-0 sm:group-hover:opacity-100"
                title={`Delete "${item.title}"`}
                aria-label={`Delete "${item.title}"`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        {/* Bottom Poster Info (Rating & Status) */}
        <div className="absolute bottom-2 left-2 right-2 sm:bottom-2.5 sm:left-2.5 sm:right-2.5 flex items-center justify-between gap-1">
          <Rating value={item.rating} size="sm" className="bg-black/60 backdrop-blur-md px-1.5 py-0.5 sm:px-2 rounded-md border border-white/10 text-white text-[11px] sm:text-xs" />
          <StatusBadge status={item.status} size="sm" className="backdrop-blur-md scale-95 sm:scale-100 origin-right" />
        </div>

        {/* Desktop Quick Increment Overlay on Hover */}
        <div className="hidden sm:flex absolute inset-0 bg-brand-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center p-4 pointer-events-none">
          <button
            type="button"
            onClick={handleQuickProgress}
            className="pointer-events-auto transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-surface-900 font-bold text-xs shadow-lg hover:bg-brand-50 hover:scale-105 active:scale-95"
          >
            {item.type === 'Movie' ? (
              item.progress >= 1 ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Watched
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-brand-600" /> Mark Watched
                </>
              )
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 text-brand-600" /> +1 Ep ({item.progress + 1})
              </>
            )}
          </button>
        </div>
      </div>

      {/* Card Info Section */}
      <div className="p-2.5 sm:p-3.5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-1 mb-1">
          <h3
            className="font-bold text-xs sm:text-sm text-surface-900 dark:text-surface-100 line-clamp-1 group-hover:text-brand-500 transition-colors"
            title={item.title}
          >
            {item.title}
          </h3>
          <span className="text-[10px] sm:text-[11px] font-semibold text-surface-400 shrink-0">
            {item.releaseYear}
          </span>
        </div>

        {/* Genre list */}
        <div className="flex items-center gap-1 flex-wrap mb-2 sm:mb-3 min-h-[18px] sm:min-h-[22px]">
          {item.genre.slice(0, 2).map((genre) => (
            <span
              key={genre}
              className="text-[9px] sm:text-[10px] font-medium text-surface-600 dark:text-surface-400 bg-surface-100 dark:bg-surface-800 px-1.5 py-0.5 rounded"
            >
              {genre}
            </span>
          ))}
          {item.genre.length > 2 && (
            <span className="text-[9px] sm:text-[10px] text-surface-400 font-medium">
              +{item.genre.length - 2}
            </span>
          )}
        </div>

        {/* Progress Bar & Mobile Direct Quick-Increment button */}
        <div className="mt-auto pt-2 border-t border-surface-100 dark:border-surface-800/80 flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <ProgressBar
              progressPercentage={progressPct}
              label={formatProgressText(item)}
              size="sm"
              colorScheme={item.type === 'Anime' ? 'accent' : item.type === 'Series' ? 'success' : 'brand'}
            />
          </div>

          {/* Dedicated mobile tap increment button */}
          <button
            type="button"
            onClick={handleQuickProgress}
            className="sm:hidden p-1.5 rounded-lg bg-surface-100 dark:bg-surface-800 text-brand-600 dark:text-brand-400 hover:bg-brand-500 hover:text-white active:scale-75 transition-all touch-manipulation shrink-0"
            title={item.type === 'Movie' ? 'Toggle watched' : '+1 Episode'}
            aria-label={item.type === 'Movie' ? 'Toggle watched' : '+1 Episode'}
          >
            {item.type === 'Movie' ? (
              item.progress >= 1 ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Play className="w-3.5 h-3.5" />
            ) : (
              <Plus className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>

    <ConfirmDialog
      isOpen={showDeleteConfirm}
      onClose={() => setShowDeleteConfirm(false)}
      onConfirm={() => deleteMedia(item.id)}
      title={`Delete "${item.title}"?`}
      message="Are you sure you want to remove this title from your library? This action cannot be undone."
      confirmLabel="Delete"
      variant="danger"
    />
  </>
);
};

export const MediaCard = memo(MediaCardComponent);
