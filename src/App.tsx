import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { WatchlistProvider } from './context/WatchlistContext';
import { AppLayout } from './components/layout/AppLayout';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { LibraryPage } from './pages/LibraryPage';
import { MoviesPage } from './pages/MoviesPage';
import { SeriesPage } from './pages/SeriesPage';
import { AnimePage } from './pages/AnimePage';
import { CurrentlyWatchingPage } from './pages/CurrentlyWatchingPage';
import { CompletedPage } from './pages/CompletedPage';
import { WatchlistPage } from './pages/WatchlistPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { StatisticsPage } from './pages/StatisticsPage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  return (
    <ThemeProvider>
      <WatchlistProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="library" element={<LibraryPage />} />
              <Route path="movies" element={<MoviesPage />} />
              <Route path="series" element={<SeriesPage />} />
              <Route path="anime" element={<AnimePage />} />
              <Route path="watching" element={<CurrentlyWatchingPage />} />
              <Route path="completed" element={<CompletedPage />} />
              <Route path="watchlist" element={<WatchlistPage />} />
              <Route path="favorites" element={<FavoritesPage />} />
              <Route path="statistics" element={<StatisticsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </HashRouter>
      </WatchlistProvider>
    </ThemeProvider>
  );
}

export default App;
