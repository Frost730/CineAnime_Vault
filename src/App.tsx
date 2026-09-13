import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { WatchlistProvider } from './context/WatchlistContext';
import { AppLayout } from './components/layout/AppLayout';
import { PageSkeleton } from './components/common/PageSkeleton';

// Code-split route pages for fast initial load
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const LibraryPage = lazy(() => import('./pages/LibraryPage').then(m => ({ default: m.LibraryPage })));
const MoviesPage = lazy(() => import('./pages/MoviesPage').then(m => ({ default: m.MoviesPage })));
const SeriesPage = lazy(() => import('./pages/SeriesPage').then(m => ({ default: m.SeriesPage })));
const AnimePage = lazy(() => import('./pages/AnimePage').then(m => ({ default: m.AnimePage })));
const CurrentlyWatchingPage = lazy(() => import('./pages/CurrentlyWatchingPage').then(m => ({ default: m.CurrentlyWatchingPage })));
const CompletedPage = lazy(() => import('./pages/CompletedPage').then(m => ({ default: m.CompletedPage })));
const WatchlistPage = lazy(() => import('./pages/WatchlistPage').then(m => ({ default: m.WatchlistPage })));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage').then(m => ({ default: m.FavoritesPage })));
const StatisticsPage = lazy(() => import('./pages/StatisticsPage').then(m => ({ default: m.StatisticsPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));

export function App() {
  return (
    <ThemeProvider>
      <WatchlistProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route
                index
                element={
                  <Suspense fallback={<PageSkeleton />}>
                    <DashboardPage />
                  </Suspense>
                }
              />
              <Route
                path="library"
                element={
                  <Suspense fallback={<PageSkeleton />}>
                    <LibraryPage />
                  </Suspense>
                }
              />
              <Route
                path="movies"
                element={
                  <Suspense fallback={<PageSkeleton />}>
                    <MoviesPage />
                  </Suspense>
                }
              />
              <Route
                path="series"
                element={
                  <Suspense fallback={<PageSkeleton />}>
                    <SeriesPage />
                  </Suspense>
                }
              />
              <Route
                path="anime"
                element={
                  <Suspense fallback={<PageSkeleton />}>
                    <AnimePage />
                  </Suspense>
                }
              />
              <Route
                path="watching"
                element={
                  <Suspense fallback={<PageSkeleton />}>
                    <CurrentlyWatchingPage />
                  </Suspense>
                }
              />
              <Route
                path="completed"
                element={
                  <Suspense fallback={<PageSkeleton />}>
                    <CompletedPage />
                  </Suspense>
                }
              />
              <Route
                path="watchlist"
                element={
                  <Suspense fallback={<PageSkeleton />}>
                    <WatchlistPage />
                  </Suspense>
                }
              />
              <Route
                path="favorites"
                element={
                  <Suspense fallback={<PageSkeleton />}>
                    <FavoritesPage />
                  </Suspense>
                }
              />
              <Route
                path="statistics"
                element={
                  <Suspense fallback={<PageSkeleton />}>
                    <StatisticsPage />
                  </Suspense>
                }
              />
              <Route
                path="settings"
                element={
                  <Suspense fallback={<PageSkeleton />}>
                    <SettingsPage />
                  </Suspense>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </HashRouter>
      </WatchlistProvider>
    </ThemeProvider>
  );
}

export default App;
