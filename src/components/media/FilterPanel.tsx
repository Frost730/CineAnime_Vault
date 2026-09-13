import React, { useState } from 'react';
import {
  LayoutGrid,
  List,
  RotateCcw,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import { useWatchlist } from '../../context/WatchlistContext';
import { SearchBar } from '../common/SearchBar';
import { GENRE_OPTIONS, DEFAULT_TAGS } from '../../types/media';
import type { MediaType, WatchStatus, SortField } from '../../types/media';

interface FilterPanelProps {
  showTypeFilter?: boolean;
  showStatusFilter?: boolean;
  titlePlaceholder?: string;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  showTypeFilter = true,
  showStatusFilter = true,
  titlePlaceholder,
}) => {
  const { filterOptions, setFilterOptions, resetFilters, viewMode, setViewMode, filteredMedia } =
    useWatchlist();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearchChange = (val: string) => {
    setFilterOptions((prev) => ({ ...prev, searchQuery: val }));
  };

  const handleTypeChange = (type: MediaType | 'All') => {
    setFilterOptions((prev) => ({ ...prev, type }));
  };

  const handleStatusChange = (status: WatchStatus | 'All') => {
    setFilterOptions((prev) => ({ ...prev, status }));
  };

  const handleGenreChange = (genre: string) => {
    setFilterOptions((prev) => ({ ...prev, genre }));
  };

  const handleTagToggle = (tag: string) => {
    setFilterOptions((prev) => ({
      ...prev,
      tag: prev.tag === tag ? 'All' : tag,
    }));
  };

  const handleSortFieldChange = (sortBy: SortField) => {
    setFilterOptions((prev) => ({ ...prev, sortBy }));
  };

  const toggleSortOrder = () => {
    setFilterOptions((prev) => ({
      ...prev,
      sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  };

  const isFiltered =
    filterOptions.searchQuery !== '' ||
    (showTypeFilter && filterOptions.type !== 'All') ||
    (showStatusFilter && filterOptions.status !== 'All') ||
    filterOptions.genre !== 'All' ||
    filterOptions.tag !== 'All' ||
    (filterOptions.minRating || 0) > 0 ||
    filterOptions.favoriteOnly;

  return (
    <div className="flex flex-col gap-3 mb-6">
      {/* Top Search & Controls Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <SearchBar
          value={filterOptions.searchQuery}
          onChange={handleSearchChange}
          placeholder={titlePlaceholder || 'Search title, genre, or tags...'}
          className="flex-1"
        />

        <div className="flex items-center justify-between sm:justify-start gap-2 shrink-0">
          {/* Advanced Filter Toggle Button */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all active:scale-95 touch-manipulation ${
              showAdvanced || isFiltered
                ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 border-brand-300 dark:border-brand-800'
                : 'bg-white dark:bg-surface-850 text-surface-700 dark:text-surface-300 border-surface-200 dark:border-surface-750 hover:bg-surface-50 dark:hover:bg-surface-800'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
            {isFiltered && (
              <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0" />
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center rounded-xl bg-white dark:bg-surface-850 border border-surface-200 dark:border-surface-750 p-1 text-xs">
            <select
              value={filterOptions.sortBy}
              onChange={(e) => handleSortFieldChange(e.target.value as SortField)}
              className="bg-transparent text-surface-700 dark:text-surface-300 font-medium px-2 py-1 outline-none cursor-pointer text-base sm:text-xs"
            >
              <option value="dateAdded" className="dark:bg-surface-900">Date Added</option>
              <option value="lastWatched" className="dark:bg-surface-900">Last Watched</option>
              <option value="rating" className="dark:bg-surface-900">Rating</option>
              <option value="title" className="dark:bg-surface-900">Title</option>
              <option value="releaseYear" className="dark:bg-surface-900">Release Year</option>
            </select>
            <button
              type="button"
              onClick={toggleSortOrder}
              className="p-1 text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 active:scale-90 touch-manipulation"
              title={`Sort direction: ${filterOptions.sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Grid / List View Toggle */}
          <div className="flex items-center rounded-xl bg-surface-100 dark:bg-surface-800 p-1">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-surface-700 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-surface-400 hover:text-surface-700 dark:hover:text-surface-300'
              }`}
              aria-label="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-surface-700 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-surface-400 hover:text-surface-700 dark:hover:text-surface-300'
              }`}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filter Expansion Panel */}
      {showAdvanced && (
        <div className="p-4 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 flex flex-col gap-4 animate-scale-in shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* Type Filter */}
            {showTypeFilter && (
              <div>
                <label className="block text-xs font-semibold text-surface-500 dark:text-surface-400 mb-1.5">
                  Media Type
                </label>
                <select
                  value={filterOptions.type}
                  onChange={(e) => handleTypeChange(e.target.value as any)}
                  className="w-full text-base sm:text-xs font-medium p-2.5 sm:p-2 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-surface-100 outline-none"
                >
                  <option value="All">All Types (Movie, Series, Anime)</option>
                  <option value="Movie">Movies Only</option>
                  <option value="Series">TV Series Only</option>
                  <option value="Anime">Anime Only</option>
                </select>
              </div>
            )}

            {/* Status Filter */}
            {showStatusFilter && (
              <div>
                <label className="block text-xs font-semibold text-surface-500 dark:text-surface-400 mb-1.5">
                  Watch Status
                </label>
                <select
                  value={filterOptions.status}
                  onChange={(e) => handleStatusChange(e.target.value as any)}
                  className="w-full text-base sm:text-xs font-medium p-2.5 sm:p-2 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-surface-100 outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Watching">Currently Watching</option>
                  <option value="Completed">Completed</option>
                  <option value="Plan to Watch">Plan to Watch</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Dropped">Dropped</option>
                </select>
              </div>
            )}

            {/* Genre Filter */}
            <div>
              <label className="block text-xs font-semibold text-surface-500 dark:text-surface-400 mb-1.5">
                Genre
              </label>
              <select
                value={filterOptions.genre}
                onChange={(e) => handleGenreChange(e.target.value)}
                className="w-full text-base sm:text-xs font-medium p-2.5 sm:p-2 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-surface-100 outline-none"
              >
                <option value="All">All Genres</option>
                {GENRE_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* Minimum Rating Filter */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-surface-500 dark:text-surface-400">
                  Min Rating
                </label>
                <span className="text-xs font-bold text-amber-500">
                  {(filterOptions.minRating || 0) > 0 ? `≥ ${filterOptions.minRating} ★` : 'Any'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="9"
                step="0.5"
                value={filterOptions.minRating}
                onChange={(e) =>
                  setFilterOptions((prev) => ({ ...prev, minRating: parseFloat(e.target.value) }))
                }
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Quick Tag Pills */}
          <div>
            <span className="block text-xs font-semibold text-surface-500 dark:text-surface-400 mb-2">
              Filter by Tags
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {DEFAULT_TAGS.map((t) => {
                const isActive = filterOptions.tag === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleTagToggle(t)}
                    className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700'
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Clear / Reset Row */}
          {isFiltered && (
            <div className="flex items-center justify-between pt-3 border-t border-surface-100 dark:border-surface-800">
              <span className="text-xs text-surface-500">
                Found <strong className="text-surface-800 dark:text-surface-200">{filteredMedia.length}</strong> matching items
              </span>
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset all filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
