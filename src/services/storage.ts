import type { MediaItem } from '../types/media';
import type { UserSettings, StorageExportSchema } from '../types/settings';
import { CURRENT_SCHEMA_VERSION } from '../types/settings';
import { isSampleMediaItem } from './sampleData';

const MEDIA_STORAGE_KEY = 'watchlist_media';
const SETTINGS_STORAGE_KEY = 'watchlist_settings';

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  viewMode: 'grid',
  compactCards: false,
  confirmDeletions: true,
};

/**
 * Validates whether an object matches the MediaItem structure.
 */
function isValidMediaItem(item: any): item is MediaItem {
  return (
    typeof item === 'object' &&
    item !== null &&
    typeof item.id === 'string' &&
    typeof item.title === 'string' &&
    (item.type === 'Movie' || item.type === 'Anime' || item.type === 'Series') &&
    Array.isArray(item.genre) &&
    typeof item.status === 'string' &&
    typeof item.rating === 'number' &&
    typeof item.releaseYear === 'number' &&
    typeof item.favorite === 'boolean' &&
    typeof item.progress === 'number'
  );
}

/**
 * Loads all media items from localStorage with crash-resilient parsing.
 * Clean initial start with an empty library (no sample data generated).
 */
export function loadMediaFromStorage(): MediaItem[] {
  try {
    const raw = localStorage.getItem(MEDIA_STORAGE_KEY);
    if (!raw) {
      // First time initialization: clean empty list
      saveMediaToStorage([]);
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      console.warn('Storage data is not an array, initializing with empty list.');
      saveMediaToStorage([]);
      return [];
    }

    // Filter out corrupted items and any legacy sample items
    const validItems = parsed
      .filter(isValidMediaItem)
      .filter((item) => !isSampleMediaItem(item));

    // If legacy sample items were purged, sync cleaned list back to storage
    if (validItems.length !== parsed.length) {
      saveMediaToStorage(validItems);
    }

    return validItems;
  } catch (error) {
    console.error('Failed to parse watchlist_media from localStorage:', error);
    return [];
  }
}

/**
 * Saves all media items to localStorage.
 */
export function saveMediaToStorage(media: MediaItem[]): boolean {
  try {
    localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(media));
    return true;
  } catch (error) {
    console.error('Failed to save watchlist_media to localStorage:', error);
    return false;
  }
}

/**
 * Loads settings from localStorage with default fallbacks.
 */
export function loadSettingsFromStorage(): UserSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;

    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
    };
  } catch (error) {
    console.error('Failed to parse watchlist_settings:', error);
    return DEFAULT_SETTINGS;
  }
}

/**
 * Saves settings to localStorage.
 */
export function saveSettingsToStorage(settings: Partial<UserSettings>): boolean {
  try {
    const current = loadSettingsFromStorage();
    const updated = { ...current, ...settings };
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Failed to save watchlist_settings:', error);
    return false;
  }
}

/**
 * Creates a complete JSON backup of media and settings.
 */
export function createBackup(): StorageExportSchema {
  const media = loadMediaFromStorage();
  const settings = loadSettingsFromStorage();

  return {
    version: CURRENT_SCHEMA_VERSION,
    appName: 'CineAnime Vault',
    exportedAt: new Date().toISOString(),
    media,
    settings,
  };
}

/**
 * Validates and imports a backup object.
 */
export function validateAndParseBackup(jsonString: string): {
  success: boolean;
  data?: StorageExportSchema;
  error?: string;
} {
  try {
    const parsed = JSON.parse(jsonString);

    if (typeof parsed !== 'object' || parsed === null) {
      return { success: false, error: 'Invalid file format: Not a valid JSON object.' };
    }

    if (!Array.isArray(parsed.media)) {
      return { success: false, error: 'Backup is missing the "media" items list.' };
    }

    // Filter valid media items
    const validMedia = parsed.media.filter(isValidMediaItem);

    const validatedData: StorageExportSchema = {
      version: typeof parsed.version === 'number' ? parsed.version : 1,
      appName: parsed.appName || 'CineAnime Vault',
      exportedAt: parsed.exportedAt || new Date().toISOString(),
      media: validMedia,
      settings: parsed.settings || {},
    };

    return { success: true, data: validatedData };
  } catch (err: any) {
    return { success: false, error: err?.message || 'JSON parsing error.' };
  }
}

/**
 * Estimates storage usage in bytes.
 */
export function getStorageUsage(): { usedBytes: number; percentage: number } {
  try {
    let total = 0;
    for (const key in localStorage) {
      if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
        total += (localStorage[key].length + key.length) * 2; // UTF-16 characters = 2 bytes
      }
    }
    // Typical localStorage quota is ~5MB (5,242,880 bytes)
    const quota = 5 * 1024 * 1024;
    return {
      usedBytes: total,
      percentage: Math.min(100, Math.round((total / quota) * 100)),
    };
  } catch {
    return { usedBytes: 0, percentage: 0 };
  }
}

/**
 * Resets storage back to clean empty library.
 */
export function resetToSampleData(): MediaItem[] {
  return clearAllMedia();
}

/**
 * Removes all sample media items, preserving user custom added items.
 */
export function deleteSampleDataFromStorage(): MediaItem[] {
  const current = loadMediaFromStorage();
  const filtered = current.filter((item) => !isSampleMediaItem(item));
  saveMediaToStorage(filtered);
  return filtered;
}

/**
 * Completely clears all stored media.
 */
export function clearAllMedia(): MediaItem[] {
  saveMediaToStorage([]);
  return [];
}

