import type { MediaItem } from '../types/media';

export const INITIAL_SAMPLE_MEDIA: MediaItem[] = [];

export const ALL_SAMPLE_IDS = new Set([
  'sample-1',
  'sample-2',
  'sample-3',
  'sample-4',
  'sample-5',
  'sample-6',
  'sample-7',
  'sample-8',
  'sample-9',
  'sample-10',
  'sample-11',
  'sample-12',
]);

export function isSampleMediaItem(item: MediaItem): boolean {
  return item.id.startsWith('sample-') || ALL_SAMPLE_IDS.has(item.id);
}
