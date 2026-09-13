export type MediaType = 'Movie' | 'Anime' | 'Series';

export type WatchStatus = 'Watching' | 'Completed' | 'Plan to Watch' | 'On Hold' | 'Dropped';

export interface MediaItem {
  id: string;
  title: string;
  type: MediaType;
  genre: string[];
  status: WatchStatus;
  rating: number; // 0 - 10
  releaseYear: number;
  posterUrl?: string;
  description: string;
  favorite: boolean;
  progress: number; // For Movie: 0 (unwatched) or 1 (watched). For Anime/Series: current episode (0..totalEpisodes)
  totalEpisodes?: number | null; // For anime/series; null or undefined for movies
  notes?: string;
  tags: string[];
  dateAdded: string; // ISO 8601 string
  lastWatched?: string; // ISO 8601 string
}

export type SortField = 'title' | 'rating' | 'releaseYear' | 'dateAdded' | 'lastWatched';
export type SortOrder = 'asc' | 'desc';

export interface FilterOptions {
  searchQuery: string;
  type?: MediaType | 'All';
  status?: WatchStatus | 'All';
  genre?: string;
  tag?: string;
  minRating?: number;
  favoriteOnly?: boolean;
  sortBy: SortField;
  sortOrder: SortOrder;
}

export const GENRE_OPTIONS = [
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Drama',
  'Fantasy',
  'Horror',
  'Mystery',
  'Psychological',
  'Romance',
  'Sci-Fi',
  'Slice of Life',
  'Supernatural',
  'Thriller',
  'Shonen',
  'Seinen',
  'Shojo',
  'Mecha',
  'Isekai',
] as const;

export const DEFAULT_TAGS = [
  'Must Watch',
  'Childhood',
  'Horror',
  'Favorite',
  'Rewatch',
  'Weekend',
  'Long Series',
  'Masterpiece',
  'Comfort Watch',
  'Recommended by Friend',
] as const;
