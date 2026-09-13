import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import type { MediaItem, WatchStatus, FilterOptions, MediaType } from '../types/media';
import type { UserSettings, ViewMode } from '../types/settings';
import {
  loadMediaFromStorage,
  saveMediaToStorage,
  loadSettingsFromStorage,
  saveSettingsToStorage,
  resetToSampleData,
  deleteSampleDataFromStorage,
  clearAllMedia,
} from '../services/storage';

interface WatchlistContextType {
  media: MediaItem[];
  filteredMedia: MediaItem[];
  settings: UserSettings;
  filterOptions: FilterOptions;
  setFilterOptions: React.Dispatch<React.SetStateAction<FilterOptions>>;
  resetFilters: () => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  // CRUD
  addMedia: (item: Omit<MediaItem, 'id' | 'dateAdded'>) => MediaItem;
  updateMedia: (id: string, updates: Partial<MediaItem>) => void;
  deleteMedia: (id: string) => void;
  duplicateMedia: (item: MediaItem) => MediaItem;
  toggleFavorite: (id: string) => void;
  updateProgress: (id: string, newProgress: number) => void;
  updateStatus: (id: string, newStatus: WatchStatus) => void;
  resetLibrary: () => void;
  deleteSampleData: () => void;
  clearLibrary: () => void;
  importLibrary: (newItems: MediaItem[], replace: boolean) => void;
  // Modals
  isFormModalOpen: boolean;
  editingItem: MediaItem | null;
  detailItem: MediaItem | null;
  openAddModal: (initialType?: MediaType) => void;
  openEditModal: (item: MediaItem) => void;
  openDetailModal: (item: MediaItem) => void;
  closeModals: () => void;
}

const DEFAULT_FILTERS: FilterOptions = {
  searchQuery: '',
  type: 'All',
  status: 'All',
  genre: 'All',
  tag: 'All',
  minRating: 0,
  favoriteOnly: false,
  sortBy: 'dateAdded',
  sortOrder: 'desc',
};

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [media, setMedia] = useState<MediaItem[]>(() => loadMediaFromStorage());
  const [settings, setSettings] = useState<UserSettings>(() => loadSettingsFromStorage());
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(DEFAULT_FILTERS);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [detailItem, setDetailItem] = useState<MediaItem | null>(null);

  // Trigger celebration confetti
  const triggerCelebration = useCallback(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#ec4899', '#38bdf8', '#10b981', '#f59e0b'],
      });
    } catch {
      // Confetti fallback
    }
  }, []);

  // Update localStorage whenever media changes
  const updateMediaState = useCallback((newMedia: MediaItem[]) => {
    setMedia(newMedia);
    saveMediaToStorage(newMedia);
  }, []);

  const setViewMode = useCallback((mode: ViewMode) => {
    setSettings((prev) => {
      const updated = { ...prev, viewMode: mode };
      saveSettingsToStorage({ viewMode: mode });
      return updated;
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilterOptions(DEFAULT_FILTERS);
  }, []);

  // CRUD actions
  const addMedia = useCallback((itemData: Omit<MediaItem, 'id' | 'dateAdded'>): MediaItem => {
    const newItem: MediaItem = {
      ...itemData,
      id: 'media_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      dateAdded: new Date().toISOString(),
      lastWatched: itemData.progress > 0 ? new Date().toISOString() : itemData.lastWatched,
    };

    setMedia((prev) => {
      const updated = [newItem, ...prev];
      saveMediaToStorage(updated);
      return updated;
    });

    if (newItem.status === 'Completed') {
      triggerCelebration();
    }

    return newItem;
  }, [triggerCelebration]);

  const updateMedia = useCallback((id: string, updates: Partial<MediaItem>) => {
    setMedia((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          const merged = { ...item, ...updates };
          if (updates.status === 'Completed' && item.status !== 'Completed') {
            triggerCelebration();
          }
          return merged;
        }
        return item;
      });
      saveMediaToStorage(updated);
      return updated;
    });

    // Also update detail item if currently open
    setDetailItem((prev) => (prev && prev.id === id ? { ...prev, ...updates } : prev));
  }, [triggerCelebration]);

  const deleteMedia = useCallback((id: string) => {
    setMedia((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      saveMediaToStorage(updated);
      return updated;
    });
    setDetailItem((prev) => (prev && prev.id === id ? null : prev));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setMedia((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          return { ...item, favorite: !item.favorite };
        }
        return item;
      });
      saveMediaToStorage(updated);
      return updated;
    });
    setDetailItem((prev) => (prev && prev.id === id ? { ...prev, favorite: !prev.favorite } : prev));
  }, []);

  const updateProgress = useCallback((id: string, newProgress: number) => {
    setMedia((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          let progress = Math.max(0, newProgress);
          let newStatus = item.status;
          const now = new Date().toISOString();

          if (item.type === 'Movie') {
            progress = progress >= 1 ? 1 : 0;
            if (progress === 1 && item.status !== 'Completed') {
              newStatus = 'Completed';
              triggerCelebration();
            }
          } else if (item.type === 'Anime') {
            if (item.totalEpisodes && item.totalEpisodes > 0) {
              progress = Math.min(progress, item.totalEpisodes);
              if (progress === item.totalEpisodes && item.status !== 'Completed') {
                newStatus = 'Completed';
                triggerCelebration();
              } else if (progress > 0 && item.status === 'Plan to Watch') {
                newStatus = 'Watching';
              }
            }
          }

          return {
            ...item,
            progress,
            status: newStatus,
            lastWatched: now,
          };
        }
        return item;
      });
      saveMediaToStorage(updated);
      return updated;
    });

    setDetailItem((prev) => {
      if (!prev || prev.id !== id) return prev;
      let progress = Math.max(0, newProgress);
      let newStatus = prev.status;
      if (prev.type === 'Movie') {
        progress = progress >= 1 ? 1 : 0;
        if (progress === 1) newStatus = 'Completed';
      } else if (prev.type === 'Anime' && prev.totalEpisodes) {
        progress = Math.min(progress, prev.totalEpisodes);
        if (progress === prev.totalEpisodes) newStatus = 'Completed';
      }
      return { ...prev, progress, status: newStatus, lastWatched: new Date().toISOString() };
    });
  }, [triggerCelebration]);

  const updateStatus = useCallback((id: string, newStatus: WatchStatus) => {
    setMedia((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          let progress = item.progress;
          if (newStatus === 'Completed') {
            if (item.type === 'Movie') progress = 1;
            if (item.type === 'Anime' && item.totalEpisodes) progress = item.totalEpisodes;
            triggerCelebration();
          } else if (newStatus === 'Plan to Watch') {
            progress = 0;
          }

          return {
            ...item,
            status: newStatus,
            progress,
            lastWatched: newStatus === 'Watching' || newStatus === 'Completed' ? new Date().toISOString() : item.lastWatched,
          };
        }
        return item;
      });
      saveMediaToStorage(updated);
      return updated;
    });

    setDetailItem((prev) => {
      if (!prev || prev.id !== id) return prev;
      let progress = prev.progress;
      if (newStatus === 'Completed') {
        if (prev.type === 'Movie') progress = 1;
        if (prev.type === 'Anime' && prev.totalEpisodes) progress = prev.totalEpisodes;
      }
      return { ...prev, status: newStatus, progress };
    });
  }, [triggerCelebration]);

  const resetLibrary = useCallback(() => {
    const defaultData = resetToSampleData();
    setMedia(defaultData);
    setDetailItem(null);
  }, []);

  const deleteSampleData = useCallback(() => {
    const updated = deleteSampleDataFromStorage();
    setMedia(updated);
    setDetailItem(null);
  }, []);

  const clearLibrary = useCallback(() => {
    const emptyData = clearAllMedia();
    setMedia(emptyData);
    setDetailItem(null);
  }, []);

  const importLibrary = useCallback((newItems: MediaItem[], replace: boolean) => {
    let combined: MediaItem[] = [];
    if (replace) {
      combined = newItems;
    } else {
      const existingIds = new Set(media.map((m) => m.id));
      const filteredNew = newItems.filter((m) => !existingIds.has(m.id));
      combined = [...filteredNew, ...media];
    }
    updateMediaState(combined);
  }, [media, updateMediaState]);

  const duplicateMedia = useCallback((item: MediaItem): MediaItem => {
    const { id: _id, dateAdded: _dateAdded, ...rest } = item;
    const duplicated = addMedia({
      ...rest,
      title: `${item.title} (Copy)`,
      lastWatched: undefined,
    });
    setDetailItem(duplicated);
    return duplicated;
  }, [addMedia]);

  // Modal helpers
  const openAddModal = useCallback((initialType?: MediaType) => {
    setDetailItem(null);
    setEditingItem(initialType ? ({ type: initialType } as any) : null);
    setIsFormModalOpen(true);
  }, []);

  const openEditModal = useCallback((item: MediaItem) => {
    setDetailItem(null); // CRITICAL: close the detail modal so edit form is displayed!
    setEditingItem(item);
    setIsFormModalOpen(true);
  }, []);

  const openDetailModal = useCallback((item: MediaItem) => {
    setDetailItem(item);
  }, []);

  const closeModals = useCallback(() => {
    setIsFormModalOpen(false);
    setEditingItem(null);
    setDetailItem(null);
  }, []);

  // Filtered & Sorted Media computation
  const filteredMedia = useMemo(() => {
    const { searchQuery, type, status, genre, tag, minRating, favoriteOnly, sortBy, sortOrder } = filterOptions;
    const query = searchQuery.trim().toLowerCase();

    return media
      .filter((item) => {
        // Search
        if (query) {
          const matchTitle = item.title.toLowerCase().includes(query);
          const matchGenre = item.genre.some((g) => g.toLowerCase().includes(query));
          const matchTag = item.tags.some((t) => t.toLowerCase().includes(query));
          const matchDesc = item.description?.toLowerCase().includes(query);
          if (!matchTitle && !matchGenre && !matchTag && !matchDesc) {
            return false;
          }
        }

        // Type
        if (type && type !== 'All' && item.type !== type) {
          return false;
        }

        // Status
        if (status && status !== 'All' && item.status !== status) {
          return false;
        }

        // Genre
        if (genre && genre !== 'All' && !item.genre.includes(genre)) {
          return false;
        }

        // Tag
        if (tag && tag !== 'All' && !item.tags.includes(tag)) {
          return false;
        }

        // Min rating
        if (minRating && item.rating < minRating) {
          return false;
        }

        // Favorite
        if (favoriteOnly && !item.favorite) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        let cmp = 0;
        switch (sortBy) {
          case 'title':
            cmp = a.title.localeCompare(b.title);
            break;
          case 'rating':
            cmp = a.rating - b.rating;
            break;
          case 'releaseYear':
            cmp = a.releaseYear - b.releaseYear;
            break;
          case 'dateAdded':
            cmp = new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
            break;
          case 'lastWatched': {
            const timeA = a.lastWatched ? new Date(a.lastWatched).getTime() : 0;
            const timeB = b.lastWatched ? new Date(b.lastWatched).getTime() : 0;
            cmp = timeA - timeB;
            break;
          }
          default:
            cmp = 0;
        }
        return sortOrder === 'asc' ? cmp : -cmp;
      });
  }, [media, filterOptions]);

  return (
    <WatchlistContext.Provider
      value={{
        media,
        filteredMedia,
        settings,
        filterOptions,
        setFilterOptions,
        resetFilters,
        viewMode: settings.viewMode,
        setViewMode,
        addMedia,
        updateMedia,
        deleteMedia,
        duplicateMedia,
        toggleFavorite,
        updateProgress,
        updateStatus,
        resetLibrary,
        deleteSampleData,
        clearLibrary,
        importLibrary,
        isFormModalOpen,
        editingItem,
        detailItem,
        openAddModal,
        openEditModal,
        openDetailModal,
        closeModals,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export function useWatchlist(): WatchlistContextType {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
}
