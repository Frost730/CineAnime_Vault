import type { MediaItem, WatchStatus } from '../types/media';

/**
 * Computes progress percentage for a media item.
 * For Movie: 100% if progress === 1, else 0%.
 * For Anime: (progress / totalEpisodes) * 100%
 */
export function calculateProgressPercentage(item: MediaItem): number {
  if (item.type === 'Movie') {
    return item.progress >= 1 ? 100 : 0;
  }
  if (!item.totalEpisodes || item.totalEpisodes <= 0) {
    return item.progress > 0 ? 100 : 0;
  }
  const pct = Math.round((item.progress / item.totalEpisodes) * 100);
  return Math.min(100, Math.max(0, pct));
}

/**
 * Format progress label e.g., "Ep 7 / 24" or "Watched" / "Unwatched"
 */
export function formatProgressText(item: MediaItem): string {
  if (item.type === 'Movie') {
    return item.progress >= 1 ? 'Watched' : 'Unwatched';
  }
  if (item.totalEpisodes && item.totalEpisodes > 0) {
    return `Ep ${item.progress} / ${item.totalEpisodes}`;
  }
  return `Ep ${item.progress}`;
}

/**
 * Format date string nicely: "Sep 13, 2026"
 */
export function formatDate(dateStr?: string): string {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'N/A';
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return 'N/A';
  }
}

/**
 * Status color badge config
 */
export function getStatusConfig(status: WatchStatus): {
  label: string;
  bgClass: string;
  textClass: string;
  dotClass: string;
  borderClass: string;
} {
  switch (status) {
    case 'Watching':
      return {
        label: 'Watching',
        bgClass: 'bg-indigo-500/15 dark:bg-indigo-500/20',
        textClass: 'text-indigo-600 dark:text-indigo-400',
        dotClass: 'bg-indigo-500 animate-pulse',
        borderClass: 'border-indigo-500/30'
      };
    case 'Completed':
      return {
        label: 'Completed',
        bgClass: 'bg-emerald-500/15 dark:bg-emerald-500/20',
        textClass: 'text-emerald-600 dark:text-emerald-400',
        dotClass: 'bg-emerald-500',
        borderClass: 'border-emerald-500/30'
      };
    case 'Plan to Watch':
      return {
        label: 'Plan to Watch',
        bgClass: 'bg-purple-500/15 dark:bg-purple-500/20',
        textClass: 'text-purple-600 dark:text-purple-400',
        dotClass: 'bg-purple-500',
        borderClass: 'border-purple-500/30'
      };
    case 'On Hold':
      return {
        label: 'On Hold',
        bgClass: 'bg-amber-500/15 dark:bg-amber-500/20',
        textClass: 'text-amber-600 dark:text-amber-400',
        dotClass: 'bg-amber-500',
        borderClass: 'border-amber-500/30'
      };
    case 'Dropped':
      return {
        label: 'Dropped',
        bgClass: 'bg-rose-500/15 dark:bg-rose-500/20',
        textClass: 'text-rose-600 dark:text-rose-400',
        dotClass: 'bg-rose-500',
        borderClass: 'border-rose-500/30'
      };
  }
}

/**
 * Robust copy-to-clipboard function supporting modern clipboard API and legacy fallback.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fallback to execCommand below
  }

  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch {
    return false;
  }
}
