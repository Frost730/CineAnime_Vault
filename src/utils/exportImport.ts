import type { MediaItem } from '../types/media';
import { createBackup } from '../services/storage';

/**
 * Initiates browser download of the JSON backup.
 */
export function downloadJsonBackup(): void {
  const backup = createBackup();
  const jsonStr = JSON.stringify(backup, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const timestamp = new Date().toISOString().split('T')[0];
  const a = document.createElement('a');
  a.href = url;
  a.download = `cineanime-vault-backup-${timestamp}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Exports media list as a CSV file.
 */
export function downloadCsvExport(media: MediaItem[]): void {
  const headers = ['ID', 'Title', 'Type', 'Status', 'Rating', 'Release Year', 'Progress', 'Total Episodes', 'Genres', 'Tags', 'Date Added', 'Notes'];
  
  const rows = media.map(item => [
    escapeCsv(item.id),
    escapeCsv(item.title),
    escapeCsv(item.type),
    escapeCsv(item.status),
    item.rating.toString(),
    item.releaseYear.toString(),
    item.progress.toString(),
    (item.totalEpisodes ?? '').toString(),
    escapeCsv(item.genre.join(', ')),
    escapeCsv(item.tags.join(', ')),
    escapeCsv(item.dateAdded),
    escapeCsv(item.notes || '')
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const timestamp = new Date().toISOString().split('T')[0];
  const a = document.createElement('a');
  a.href = url;
  a.download = `cineanime-watchlist-${timestamp}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function escapeCsv(field: string): string {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}
