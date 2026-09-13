import type { MediaItem } from './media';

export type ThemeMode = 'dark' | 'light' | 'system';
export type ViewMode = 'grid' | 'list';

export interface UserSettings {
  theme: ThemeMode;
  viewMode: ViewMode;
  compactCards: boolean;
  confirmDeletions: boolean;
}

export interface StorageExportSchema {
  version: number;
  exportedAt: string;
  appName: string;
  media: MediaItem[];
  settings: Partial<UserSettings>;
}

export const CURRENT_SCHEMA_VERSION = 1;
