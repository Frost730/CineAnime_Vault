import { useMemo } from 'react';
import type { MediaItem } from '../types/media';

export interface WatchlistStats {
  totalCount: number;
  movieCount: number;
  seriesCount: number;
  animeCount: number;
  watchingCount: number;
  completedCount: number;
  planToWatchCount: number;
  onHoldCount: number;
  droppedCount: number;
  favoriteCount: number;
  
  // Averages & Rates
  averageRating: number;
  movieAverageRating: number;
  seriesAverageRating: number;
  animeAverageRating: number;
  completionRate: number; // 0 - 100%
  
  // Time & Episodes
  totalEpisodesWatched: number;
  estimatedHoursWatched: number;

  // Chart Distributions
  genreDistribution: { genre: string; count: number }[];
  ratingDistribution: { rating: number; count: number }[];
  statusDistribution: { label: string; count: number; color: string }[];
  monthlyAdditions: { month: string; count: number }[];
}

export function useStats(media: MediaItem[]): WatchlistStats {
  return useMemo(() => {
    const totalCount = media.length;
    if (totalCount === 0) {
      return {
        totalCount: 0,
        movieCount: 0,
        seriesCount: 0,
        animeCount: 0,
        watchingCount: 0,
        completedCount: 0,
        planToWatchCount: 0,
        onHoldCount: 0,
        droppedCount: 0,
        favoriteCount: 0,
        averageRating: 0,
        movieAverageRating: 0,
        seriesAverageRating: 0,
        animeAverageRating: 0,
        completionRate: 0,
        totalEpisodesWatched: 0,
        estimatedHoursWatched: 0,
        genreDistribution: [],
        ratingDistribution: Array.from({ length: 10 }, (_, i) => ({ rating: i + 1, count: 0 })),
        statusDistribution: [],
        monthlyAdditions: [],
      };
    }

    let movieCount = 0;
    let seriesCount = 0;
    let animeCount = 0;
    let watchingCount = 0;
    let completedCount = 0;
    let planToWatchCount = 0;
    let onHoldCount = 0;
    let droppedCount = 0;
    let favoriteCount = 0;

    let totalRating = 0;
    let ratedItemsCount = 0;
    let movieTotalRating = 0;
    let movieRatedCount = 0;
    let seriesTotalRating = 0;
    let seriesRatedCount = 0;
    let animeTotalRating = 0;
    let animeRatedCount = 0;

    let totalEpisodesWatched = 0;
    let totalMovieHours = 0;

    const genreMap: Record<string, number> = {};
    const ratingBuckets: Record<number, number> = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0
    };
    const monthMap: Record<string, number> = {};

    media.forEach((item) => {
      // Type breakdown
      if (item.type === 'Movie') {
        movieCount++;
        if (item.progress >= 1) totalMovieHours += 2; // Est 2h per movie
        if (item.rating > 0) {
          movieTotalRating += item.rating;
          movieRatedCount++;
        }
      } else if (item.type === 'Series') {
        seriesCount++;
        totalEpisodesWatched += Math.max(0, item.progress || 0);
        if (item.rating > 0) {
          seriesTotalRating += item.rating;
          seriesRatedCount++;
        }
      } else {
        animeCount++;
        totalEpisodesWatched += Math.max(0, item.progress || 0);
        if (item.rating > 0) {
          animeTotalRating += item.rating;
          animeRatedCount++;
        }
      }

      // Status breakdown
      switch (item.status) {
        case 'Watching':
          watchingCount++;
          break;
        case 'Completed':
          completedCount++;
          break;
        case 'Plan to Watch':
          planToWatchCount++;
          break;
        case 'On Hold':
          onHoldCount++;
          break;
        case 'Dropped':
          droppedCount++;
          break;
      }

      if (item.favorite) favoriteCount++;

      // Overall rating
      if (item.rating > 0) {
        totalRating += item.rating;
        ratedItemsCount++;
        const rounded = Math.min(10, Math.max(1, Math.round(item.rating)));
        ratingBuckets[rounded] = (ratingBuckets[rounded] || 0) + 1;
      }

      // Genres
      if (Array.isArray(item.genre)) {
        item.genre.forEach((g) => {
          genreMap[g] = (genreMap[g] || 0) + 1;
        });
      }

      // Monthly timeline
      if (item.dateAdded) {
        try {
          const d = new Date(item.dateAdded);
          if (!isNaN(d.getTime())) {
            const key = d.toLocaleDateString(undefined, { year: '2-digit', month: 'short' });
            monthMap[key] = (monthMap[key] || 0) + 1;
          }
        } catch {
          // ignore date parse err
        }
      }
    });

    const averageRating = ratedItemsCount > 0 ? Number((totalRating / ratedItemsCount).toFixed(1)) : 0;
    const movieAverageRating = movieRatedCount > 0 ? Number((movieTotalRating / movieRatedCount).toFixed(1)) : 0;
    const seriesAverageRating = seriesRatedCount > 0 ? Number((seriesTotalRating / seriesRatedCount).toFixed(1)) : 0;
    const animeAverageRating = animeRatedCount > 0 ? Number((animeTotalRating / animeRatedCount).toFixed(1)) : 0;
    const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    // Anime ~24 min per episode = 0.4 hours; Series ~45 min per episode = 0.75 hours
    const estimatedHoursWatched = Math.round(totalEpisodesWatched * 0.5 + totalMovieHours);

    // Sorted genres
    const genreDistribution = Object.entries(genreMap)
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count);

    // Rating distribution array
    const ratingDistribution = Array.from({ length: 10 }, (_, i) => ({
      rating: i + 1,
      count: ratingBuckets[i + 1] || 0,
    }));

    // Status distribution
    const statusDistribution = [
      { label: 'Completed', count: completedCount, color: '#10b981' },
      { label: 'Watching', count: watchingCount, color: '#6366f1' },
      { label: 'Plan to Watch', count: planToWatchCount, color: '#8b5cf6' },
      { label: 'On Hold', count: onHoldCount, color: '#f59e0b' },
      { label: 'Dropped', count: droppedCount, color: '#ef4444' },
    ].filter((s) => s.count > 0);

    // Monthly additions
    const monthlyAdditions = Object.entries(monthMap).map(([month, count]) => ({ month, count }));

    return {
      totalCount,
      movieCount,
      seriesCount,
      animeCount,
      watchingCount,
      completedCount,
      planToWatchCount,
      onHoldCount,
      droppedCount,
      favoriteCount,
      averageRating,
      movieAverageRating,
      seriesAverageRating,
      animeAverageRating,
      completionRate,
      totalEpisodesWatched,
      estimatedHoursWatched,
      genreDistribution,
      ratingDistribution,
      statusDistribution,
      monthlyAdditions,
    };
  }, [media]);
}
