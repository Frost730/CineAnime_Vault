import React, { useState, useEffect } from 'react';
import { Film, Tv, Sparkles, X, Star } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useWatchlist } from '../../context/WatchlistContext';
import { GENRE_OPTIONS, DEFAULT_TAGS } from '../../types/media';
import type { MediaType, WatchStatus } from '../../types/media';
import { getPlaceholderPoster } from '../../utils/placeholder';

export const MediaFormModal: React.FC = () => {
  const { isFormModalOpen, editingItem, closeModals, addMedia, updateMedia } = useWatchlist();

  const isEditing = Boolean(editingItem && editingItem.id);

  // Form states
  const [title, setTitle] = useState('');
  const [type, setType] = useState<MediaType>('Movie');
  const [status, setStatus] = useState<WatchStatus>('Plan to Watch');
  const [genres, setGenres] = useState<string[]>([]);
  const [rating, setRating] = useState<number>(8.0);
  const [releaseYear, setReleaseYear] = useState<number>(new Date().getFullYear());
  const [posterUrl, setPosterUrl] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  // Anime specific
  const [currentEpisode, setCurrentEpisode] = useState<number>(0);
  const [totalEpisodes, setTotalEpisodes] = useState<string>('');

  // Movie specific
  const [movieWatched, setMovieWatched] = useState<boolean>(false);

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset or populate fields when modal opens or editingItem changes
  useEffect(() => {
    if (editingItem && editingItem.id) {
      setTitle(editingItem.title || '');
      setType(editingItem.type || 'Movie');
      setStatus(editingItem.status || 'Plan to Watch');
      setGenres(editingItem.genre || []);
      setRating(editingItem.rating || 0);
      setReleaseYear(editingItem.releaseYear || new Date().getFullYear());
      setPosterUrl(editingItem.posterUrl || '');
      setDescription(editingItem.description || '');
      setNotes(editingItem.notes || '');
      setTags(editingItem.tags || []);
      setCurrentEpisode(editingItem.progress || 0);
      setTotalEpisodes(editingItem.totalEpisodes ? editingItem.totalEpisodes.toString() : '');
      setMovieWatched(editingItem.type === 'Movie' && editingItem.progress >= 1);
    } else if (editingItem && editingItem.type) {
      resetForm();
      setType(editingItem.type);
    } else {
      resetForm();
    }
    setErrors({});
  }, [editingItem, isFormModalOpen]);

  const resetForm = () => {
    setTitle('');
    setType('Movie');
    setStatus('Plan to Watch');
    setGenres([]);
    setRating(8.0);
    setReleaseYear(new Date().getFullYear());
    setPosterUrl('');
    setDescription('');
    setNotes('');
    setTags([]);
    setTagInput('');
    setCurrentEpisode(0);
    setTotalEpisodes('');
    setMovieWatched(false);
  };

  const toggleGenre = (genre: string) => {
    setGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleAddTag = (tagToAdd?: string) => {
    const t = (tagToAdd || tagInput).trim();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required.';
    }

    if (isNaN(rating) || rating < 0 || rating > 10) {
      newErrors.rating = 'Rating must be between 0 and 10.';
    }

    const currentYear = new Date().getFullYear();
    if (isNaN(releaseYear) || releaseYear < 1888 || releaseYear > currentYear + 10) {
      newErrors.releaseYear = `Release year must be between 1888 and ${currentYear + 10}.`;
    }

    if (type === 'Anime' || type === 'Series') {
      const total = totalEpisodes ? parseInt(totalEpisodes, 10) : null;
      if (currentEpisode < 0) {
        newErrors.currentEpisode = 'Current episode cannot be negative.';
      }
      if (total !== null) {
        if (isNaN(total) || total < 0) {
          newErrors.totalEpisodes = 'Total episodes cannot be negative.';
        } else if (currentEpisode > total) {
          newErrors.currentEpisode = `Current episode (${currentEpisode}) cannot exceed total episodes (${total}).`;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const parsedTotal = totalEpisodes && !isNaN(parseInt(totalEpisodes, 10)) ? parseInt(totalEpisodes, 10) : null;
    const progressVal = type === 'Movie' ? (movieWatched || status === 'Completed' ? 1 : 0) : currentEpisode;

    let finalStatus = status;
    if ((type === 'Anime' || type === 'Series') && parsedTotal && progressVal >= parsedTotal) {
      finalStatus = 'Completed';
    } else if (type === 'Movie' && progressVal === 1 && status === 'Plan to Watch') {
      finalStatus = 'Completed';
    }

    const mediaData = {
      title: title.trim(),
      type,
      genre: genres.length > 0 ? genres : ['General'],
      status: finalStatus,
      rating: Number(rating.toFixed(1)),
      releaseYear,
      posterUrl: posterUrl.trim() || undefined,
      description: description.trim(),
      favorite: editingItem ? editingItem.favorite : false,
      progress: progressVal,
      totalEpisodes: type !== 'Movie' ? parsedTotal : null,
      notes: notes.trim(),
      tags,
    };

    if (isEditing && editingItem?.id) {
      updateMedia(editingItem.id, mediaData);
    } else {
      addMedia(mediaData);
    }

    closeModals();
  };

  return (
    <Modal
      isOpen={isFormModalOpen}
      onClose={closeModals}
      maxWidth="3xl"
      title={isEditing ? `Edit "${editingItem?.title}"` : 'Add Title to Library'}
    >
      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        {/* Type Selector (Movie vs Anime) */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-surface-500 mb-2">
            Media Type
          </label>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => {
                setType('Movie');
                if (errors.currentEpisode) {
                  setErrors((prev) => {
                    const copy = { ...prev };
                    delete copy.currentEpisode;
                    return copy;
                  });
                }
              }}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 p-2.5 sm:p-3 rounded-2xl border text-xs sm:text-sm font-bold transition-all active:scale-95 touch-manipulation ${
                type === 'Movie'
                  ? 'bg-sky-500/10 border-sky-500 text-sky-600 dark:text-sky-400 ring-2 ring-sky-500/20 shadow-sm'
                  : 'bg-surface-50 dark:bg-surface-800/60 border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
              }`}
            >
              <Film className="w-4 h-4 text-sky-400" />
              <span>Movie</span>
            </button>

            <button
              type="button"
              onClick={() => setType('Series')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 p-2.5 sm:p-3 rounded-2xl border text-xs sm:text-sm font-bold transition-all active:scale-95 touch-manipulation ${
                type === 'Series'
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/20 shadow-sm'
                  : 'bg-surface-50 dark:bg-surface-800/60 border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
              }`}
            >
              <Tv className="w-4 h-4 text-emerald-400" />
              <span>TV Series</span>
            </button>

            <button
              type="button"
              onClick={() => setType('Anime')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 p-2.5 sm:p-3 rounded-2xl border text-xs sm:text-sm font-bold transition-all active:scale-95 touch-manipulation ${
                type === 'Anime'
                  ? 'bg-pink-500/10 border-pink-500 text-pink-600 dark:text-pink-400 ring-2 ring-pink-500/20 shadow-sm'
                  : 'bg-surface-50 dark:bg-surface-800/60 border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
              }`}
            >
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span>Anime</span>
            </button>
          </div>
        </div>

        {/* Title & Release Year */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-surface-500 mb-1.5">
              Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={type === 'Movie' ? 'e.g. Interstellar' : 'e.g. Attack on Titan'}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-800/80 border text-surface-900 dark:text-surface-100 text-base sm:text-sm focus:outline-none transition-all ${
                errors.title
                  ? 'border-rose-500 ring-2 ring-rose-500/20'
                  : 'border-surface-200 dark:border-surface-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
              }`}
            />
            {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-surface-500 mb-1.5">
              Release Year <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="1888"
              max={new Date().getFullYear() + 10}
              value={releaseYear}
              onChange={(e) => setReleaseYear(parseInt(e.target.value, 10))}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-800/80 border text-surface-900 dark:text-surface-100 text-base sm:text-sm focus:outline-none transition-all ${
                errors.releaseYear
                  ? 'border-rose-500 ring-2 ring-rose-500/20'
                  : 'border-surface-200 dark:border-surface-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
              }`}
            />
            {errors.releaseYear && (
              <p className="text-xs text-rose-500 mt-1">{errors.releaseYear}</p>
            )}
          </div>
        </div>

        {/* Status & Rating */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-surface-500 mb-1.5">
              Watch Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as WatchStatus)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-800/80 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-surface-100 text-base sm:text-sm outline-none focus:border-brand-500"
            >
              <option value="Watching">Watching</option>
              <option value="Completed">Completed</option>
              <option value="Plan to Watch">Plan to Watch</option>
              <option value="On Hold">On Hold</option>
              <option value="Dropped">Dropped</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-surface-500">
                Rating
              </label>
              <span className="inline-flex items-center gap-1 text-sm font-bold text-amber-500">
                <Star className="w-4 h-4 fill-amber-400 stroke-amber-500" />
                {rating > 0 ? `${rating.toFixed(1)} / 10` : 'Not Rated'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={rating}
                onChange={(e) => setRating(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-2"
              />
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={rating}
                onChange={(e) => setRating(Math.max(0, Math.min(10, parseFloat(e.target.value) || 0)))}
                className="w-16 px-2 py-1.5 text-center font-bold text-base sm:text-xs rounded-xl bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700"
              />
            </div>
            {errors.rating && <p className="text-xs text-rose-500 mt-1">{errors.rating}</p>}
          </div>
        </div>

        {/* Dynamic Progress / Episodes Fields */}
        <div className="p-4 rounded-2xl bg-surface-50 dark:bg-surface-800/40 border border-surface-200/80 dark:border-surface-700/60">
          <h4 className="text-xs font-bold uppercase tracking-wider text-surface-600 dark:text-surface-300 mb-3">
            {type === 'Movie' ? 'Movie Progress' : type === 'Series' ? 'Series Episode Tracking' : 'Anime Episode Tracking'}
          </h4>

          {type === 'Movie' ? (
            <div className="flex items-center gap-3">
              <label className="relative flex items-center gap-2.5 cursor-pointer select-none py-1">
                <input
                  type="checkbox"
                  checked={movieWatched || status === 'Completed'}
                  onChange={(e) => {
                    setMovieWatched(e.target.checked);
                    if (e.target.checked && status === 'Plan to Watch') {
                      setStatus('Completed');
                    }
                  }}
                  className="w-5 h-5 rounded-md text-brand-600 focus:ring-brand-500 accent-brand-600 cursor-pointer"
                />
                <span className="text-sm font-semibold text-surface-800 dark:text-surface-200">
                  Mark this movie as Watched
                </span>
              </label>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-surface-500 mb-1">
                  Current Episode Watched
                </label>
                <input
                  type="number"
                  min="0"
                  value={currentEpisode}
                  onChange={(e) => setCurrentEpisode(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-base sm:text-sm font-semibold"
                />
                {errors.currentEpisode && (
                  <p className="text-xs text-rose-500 mt-1">{errors.currentEpisode}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-surface-500 mb-1">
                  Total Episodes (optional)
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="e.g. 12, 24, 87..."
                  value={totalEpisodes}
                  onChange={(e) => setTotalEpisodes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-base sm:text-sm font-semibold"
                />
                {errors.totalEpisodes && (
                  <p className="text-xs text-rose-500 mt-1">{errors.totalEpisodes}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Poster URL with Preview */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-surface-500 mb-1.5">
            Poster Image URL (Optional)
          </label>
          <div className="flex gap-3 items-start">
            <div className="flex-1">
              <input
                type="url"
                value={posterUrl}
                onChange={(e) => setPosterUrl(e.target.value)}
                placeholder="https://... (leave empty for procedural poster)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-800/80 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-surface-100 text-base sm:text-sm outline-none focus:border-brand-500"
              />
              <p className="text-[11px] text-surface-400 mt-1">
                If omitted or broken, a stylized monogram poster will automatically be rendered.
              </p>
            </div>

            {/* Live thumbnail preview */}
            <div className="w-12 h-16 sm:w-14 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-surface-200 dark:border-surface-700 bg-surface-800 shadow-sm">
              <img
                src={posterUrl || getPlaceholderPoster(title || 'New Title', type, genres[0])}
                alt="Poster preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getPlaceholderPoster(title || 'New Title', type, genres[0]);
                }}
              />
            </div>
          </div>
        </div>

        {/* Genre Selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-surface-500 mb-2">
            Genres (Tap to select)
          </label>
          <div className="flex items-center gap-1.5 flex-wrap max-h-32 overflow-y-auto p-2 rounded-2xl bg-surface-50 dark:bg-surface-800/40 border border-surface-200/80 dark:border-surface-700/60">
            {GENRE_OPTIONS.map((g) => {
              const isSelected = genres.includes(g);
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => toggleGenre(g)}
                  className={`text-xs px-2.5 py-1.5 rounded-xl font-semibold transition-all active:scale-95 touch-manipulation min-h-[34px] ${
                    isSelected
                      ? 'bg-brand-600 text-white shadow-sm ring-1 ring-brand-400'
                      : 'bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-400 border border-surface-200 dark:border-surface-700'
                  }`}
                >
                  {g}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-surface-500 mb-1.5">
            Custom Tags
          </label>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              placeholder="e.g. 'Must Watch', 'Childhood'..."
              className="flex-1 px-3 py-2 text-base sm:text-xs rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 outline-none"
            />
            <button
              type="button"
              onClick={() => handleAddTag()}
              className="px-3.5 py-2 rounded-xl bg-surface-200 dark:bg-surface-700 text-surface-800 dark:text-surface-200 text-xs font-bold hover:bg-brand-500 hover:text-white active:scale-95 transition-all"
            >
              Add
            </button>
          </div>

          {/* Quick suggestions */}
          <div className="flex items-center gap-1.5 flex-wrap mb-2">
            <span className="text-[11px] text-surface-400 mr-1">Suggestions:</span>
            {DEFAULT_TAGS.slice(0, 6).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleAddTag(s)}
                className="text-[11px] text-brand-600 dark:text-brand-400 hover:underline p-0.5"
              >
                +{s}
              </button>
            ))}
          </div>

          {/* Active Tags */}
          {tags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="p-0.5 hover:text-rose-500 active:scale-75"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Description / Synopsis */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-surface-500 mb-1.5">
            Description / Synopsis
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Plot summary, premise, or overview..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-800/80 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-surface-100 text-base sm:text-sm outline-none focus:border-brand-500 resize-none"
          />
        </div>

        {/* Notes / Thoughts */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-surface-500 mb-1.5">
            Personal Notes & Thoughts
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Favorite scene, quotes, viewing date, friend recommendation..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-800/80 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-surface-100 text-base sm:text-sm outline-none focus:border-brand-500 resize-none"
          />
        </div>

        {/* Sticky Action Footer */}
        <div className="sticky bottom-0 bg-white/95 dark:bg-surface-900/95 backdrop-blur-md pt-3 pb-2 border-t border-surface-200 dark:border-surface-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={closeModals}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 active:scale-95 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold shadow-lg shadow-brand-600/25 transition-all active:scale-95 touch-manipulation"
          >
            {isEditing ? 'Save Changes' : 'Add to Watchlist'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
