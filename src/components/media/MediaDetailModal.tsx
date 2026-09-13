import React, { useState } from 'react';
import {
  Heart,
  Edit,
  Trash2,
  Calendar,
  Clock,
  Film,
  Tv,
  CheckCircle2,
  Copy,
  Check,
  CopyPlus,
  Sparkles,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { Rating } from '../common/Rating';
import { StatusBadge } from '../common/StatusBadge';
import { EpisodeTracker } from './EpisodeTracker';
import { useWatchlist } from '../../context/WatchlistContext';
import { getPlaceholderPoster } from '../../utils/placeholder';
import { formatDate, copyToClipboard } from '../../utils/formatters';
import type { WatchStatus } from '../../types/media';

export const MediaDetailModal: React.FC = () => {
  const {
    detailItem,
    closeModals,
    toggleFavorite,
    updateStatus,
    updateProgress,
    openEditModal,
    deleteMedia,
    duplicateMedia,
  } = useWatchlist();

  const [imageError, setImageError] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [duplicateSuccess, setDuplicateSuccess] = useState(false);

  if (!detailItem) return null;

  const placeholder = getPlaceholderPoster(detailItem.title, detailItem.type, detailItem.genre[0]);
  const posterSrc = !imageError && detailItem.posterUrl ? detailItem.posterUrl : placeholder;

  const handleCopyInfo = async () => {
    const text = `🎬 ${detailItem.title} (${detailItem.releaseYear})\nType: ${detailItem.type}\nStatus: ${detailItem.status}\nRating: ${detailItem.rating}/10\nGenres: ${detailItem.genre.join(', ')}${detailItem.description ? `\n\nSynopsis:\n${detailItem.description}` : ''}${detailItem.notes ? `\n\nNotes:\n${detailItem.notes}` : ''}`;
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    }
  };

  const handleDuplicate = () => {
    duplicateMedia(detailItem);
    setDuplicateSuccess(true);
    setTimeout(() => setDuplicateSuccess(false), 2500);
  };

  return (
    <>
      <Modal
        isOpen={Boolean(detailItem)}
        onClose={closeModals}
        maxWidth="3xl"
        title={
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-surface-100 dark:bg-surface-800 text-brand-600 dark:text-brand-400">
              {detailItem.type === 'Movie' ? (
                <Film className="w-4 h-4 text-sky-400" />
              ) : detailItem.type === 'Series' ? (
                <Tv className="w-4 h-4 text-emerald-400" />
              ) : (
                <Sparkles className="w-4 h-4 text-pink-400" />
              )}
            </span>
            <span className="truncate">{detailItem.title}</span>
          </div>
        }
      >
        <div className="flex flex-col gap-6">
          {/* Notification Toast for Copy & Duplicate */}
          {copySuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-scale-in">
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Copied title and details to clipboard!</span>
            </div>
          )}

          {duplicateSuccess && (
            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-500/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center gap-2 animate-scale-in">
              <Check className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>Duplicated title into your library as "{detailItem.title}"!</span>
            </div>
          )}

          {/* Header Banner & Poster Section */}
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-start">
            {/* Poster Card */}
            <div className="relative w-36 sm:w-44 aspect-[2/3] shrink-0 rounded-2xl overflow-hidden shadow-xl border border-surface-200 dark:border-surface-700 bg-surface-900 mx-auto sm:mx-0">
              <img
                src={posterSrc}
                alt={detailItem.title}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <button
                  type="button"
                  onClick={() => toggleFavorite(detailItem.id)}
                  className={`p-2 rounded-full backdrop-blur-md shadow-md transition-transform active:scale-90 ${
                    detailItem.favorite
                      ? 'bg-rose-500 text-white'
                      : 'bg-black/60 text-white hover:text-rose-400'
                  }`}
                  aria-label={detailItem.favorite ? 'Remove favorite' : 'Add favorite'}
                >
                  <Heart className={`w-4 h-4 ${detailItem.favorite ? 'fill-white' : ''}`} />
                </button>
              </div>
            </div>

            {/* Quick Metadata Column */}
            <div className="flex-1 flex flex-col justify-between w-full">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-surface-900 dark:text-surface-100 leading-tight">
                      {detailItem.title}
                    </h2>
                    <div className="flex items-center gap-2 mt-1 text-xs sm:text-sm font-medium text-surface-500">
                      <span>{detailItem.releaseYear}</span>
                      <span>•</span>
                      <span className="font-semibold text-brand-600 dark:text-brand-400">
                        {detailItem.type}
                      </span>
                    </div>
                  </div>

                  {/* Rating Badge */}
                  <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 px-3 py-1.5 rounded-xl shrink-0">
                    <Rating value={detailItem.rating} size="lg" showOutOf />
                  </div>
                </div>

                {/* Status Dropdown & Badges */}
                <div className="flex items-center gap-3 flex-wrap my-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-surface-500">Status:</span>
                    <select
                      value={detailItem.status}
                      onChange={(e) => updateStatus(detailItem.id, e.target.value as WatchStatus)}
                      className="text-xs font-bold px-3 py-1.5 rounded-xl bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-surface-100 outline-none cursor-pointer focus:ring-2 focus:ring-brand-500/20"
                    >
                      <option value="Watching">Watching</option>
                      <option value="Completed">Completed</option>
                      <option value="Plan to Watch">Plan to Watch</option>
                      <option value="On Hold">On Hold</option>
                      <option value="Dropped">Dropped</option>
                    </select>
                  </div>
                  <StatusBadge status={detailItem.status} />
                </div>

                {/* Genres */}
                <div className="flex items-center gap-1.5 flex-wrap mb-4">
                  {detailItem.genre.map((g) => (
                    <span
                      key={g}
                      className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Edit, Copy Info, Duplicate, Delete */}
              <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 pt-3 border-t border-surface-200 dark:border-surface-800 w-full">
                {/* Edit Button */}
                <button
                  type="button"
                  onClick={() => openEditModal(detailItem)}
                  className="flex items-center justify-center gap-1.5 py-2.5 sm:py-2 px-3 sm:px-3.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-all active:scale-95 touch-manipulation cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                {/* Copy Info Button */}
                <button
                  type="button"
                  onClick={handleCopyInfo}
                  className="flex items-center justify-center gap-1.5 py-2.5 sm:py-2 px-3 sm:px-3.5 rounded-xl text-xs font-bold bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-800 dark:text-surface-200 transition-all active:scale-95 touch-manipulation cursor-pointer"
                  title="Copy title and info to clipboard"
                >
                  {copySuccess ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copySuccess ? 'Copied!' : 'Copy Info'}</span>
                </button>

                {/* Duplicate Button */}
                <button
                  type="button"
                  onClick={handleDuplicate}
                  className="flex items-center justify-center gap-1.5 py-2.5 sm:py-2 px-3 sm:px-3.5 rounded-xl text-xs font-bold bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-800 dark:text-surface-200 transition-all active:scale-95 touch-manipulation cursor-pointer"
                  title="Duplicate this title into your library"
                >
                  {duplicateSuccess ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <CopyPlus className="w-3.5 h-3.5" />
                  )}
                  <span>{duplicateSuccess ? 'Duplicated!' : 'Duplicate'}</span>
                </button>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center justify-center gap-1.5 py-2.5 sm:py-2 px-3 sm:px-3.5 rounded-xl text-xs font-bold bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 transition-all active:scale-95 touch-manipulation sm:ml-auto cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>

          {/* Progress / Episode Section */}
          <div className="border-t border-surface-200 dark:border-surface-800 pt-4">
            {detailItem.type === 'Anime' || detailItem.type === 'Series' ? (
              <EpisodeTracker
                currentEpisode={detailItem.progress}
                totalEpisodes={detailItem.totalEpisodes}
                onUpdate={(newEp) => updateProgress(detailItem.id, newEp)}
                showEpisodeGrid={Boolean(detailItem.totalEpisodes && detailItem.totalEpisodes > 1)}
              />
            ) : (
              <div className="p-4 rounded-xl bg-surface-50 dark:bg-surface-800/40 border border-surface-200/80 dark:border-surface-700/60 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-surface-500 mb-0.5">
                    Viewing Status
                  </div>
                  <div className="text-sm font-bold text-surface-800 dark:text-surface-200">
                    {detailItem.progress >= 1 ? 'Watched' : 'Not yet watched'}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => updateProgress(detailItem.id, detailItem.progress >= 1 ? 0 : 1)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95 touch-manipulation cursor-pointer ${
                    detailItem.progress >= 1
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-brand-600 text-white hover:bg-brand-700'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{detailItem.progress >= 1 ? 'Mark as Unwatched' : 'Mark as Watched'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Description */}
          {detailItem.description && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-surface-500 mb-2">
                Synopsis
              </h4>
              <p className="text-sm leading-relaxed text-surface-700 dark:text-surface-300 bg-surface-50/50 dark:bg-surface-800/30 p-3.5 rounded-xl border border-surface-200/60 dark:border-surface-800/60">
                {detailItem.description}
              </p>
            </div>
          )}

          {/* Notes */}
          {detailItem.notes && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-surface-500 mb-2">
                Personal Notes & Thoughts
              </h4>
              <div className="p-3.5 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 text-sm italic text-surface-800 dark:text-surface-200">
                "{detailItem.notes}"
              </div>
            </div>
          )}

          {/* Tags */}
          {detailItem.tags && detailItem.tags.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-surface-500 mb-2">
                Tags
              </h4>
              <div className="flex items-center gap-1.5 flex-wrap">
                {detailItem.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="flex items-center justify-between text-xs text-surface-400 pt-3 border-t border-surface-200 dark:border-surface-800">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Added: {formatDate(detailItem.dateAdded)}
            </span>
            {detailItem.lastWatched && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Last watched: {formatDate(detailItem.lastWatched)}
              </span>
            )}
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          deleteMedia(detailItem.id);
          closeModals();
        }}
        title={`Delete "${detailItem.title}"?`}
        message="Are you sure you want to remove this title from your library? This action cannot be undone."
        confirmLabel="Delete Title"
        variant="danger"
      />
    </>
  );
};
