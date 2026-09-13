import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Library,
  PlayCircle,
  Plus,
  MoreHorizontal,
  Film,
  Tv,
  CheckCircle2,
  Bookmark,
  Heart,
  BarChart3,
  Settings,
  X,
  Sun,
  Moon,
  Monitor,
  Sparkles,
} from 'lucide-react';
import { useWatchlist } from '../../context/WatchlistContext';
import { useTheme } from '../../context/ThemeContext';
import { useStats } from '../../hooks/useStats';

export const MobileNav: React.FC = () => {
  const { openAddModal, media } = useWatchlist();
  const { theme, setTheme } = useTheme();
  const stats = useStats(media);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const moreItems = [
    { label: 'Movies', path: '/movies', icon: Film, count: stats.movieCount, color: 'text-sky-500' },
    { label: 'Series', path: '/series', icon: Tv, count: stats.seriesCount, color: 'text-emerald-500' },
    { label: 'Anime', path: '/anime', icon: Sparkles, count: stats.animeCount, color: 'text-pink-500' },
    { label: 'Completed', path: '/completed', icon: CheckCircle2, count: stats.completedCount, color: 'text-emerald-500' },
    { label: 'Watchlist', path: '/watchlist', icon: Bookmark, count: stats.planToWatchCount, color: 'text-purple-500' },
    { label: 'Favorites', path: '/favorites', icon: Heart, count: stats.favoriteCount, color: 'text-rose-500' },
    { label: 'Statistics', path: '/statistics', icon: BarChart3, count: null, color: 'text-indigo-500' },
    { label: 'Settings', path: '/settings', icon: Settings, count: null, color: 'text-surface-400' },
  ];

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-surface-950/95 backdrop-blur-xl border-t border-surface-200/80 dark:border-surface-850 px-3 py-1.5 pb-safe flex items-center justify-around shadow-2xl">
        {/* Home */}
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex flex-col items-center justify-center p-1.5 rounded-xl text-[10px] font-semibold transition-transform active:scale-95 ${
              isActive
                ? 'text-brand-600 dark:text-brand-400 font-bold'
                : 'text-surface-500 hover:text-surface-900 dark:hover:text-surface-200'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </NavLink>

        {/* Library */}
        <NavLink
          to="/library"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center p-1.5 rounded-xl text-[10px] font-semibold transition-transform active:scale-95 ${
              isActive
                ? 'text-brand-600 dark:text-brand-400 font-bold'
                : 'text-surface-500 hover:text-surface-900 dark:hover:text-surface-200'
            }`
          }
        >
          <Library className="w-5 h-5 mb-0.5" />
          <span>Library</span>
        </NavLink>

        {/* Floating Center Add Button */}
        <button
          type="button"
          onClick={() => openAddModal()}
          className="w-12 h-12 -mt-5 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/40 hover:scale-105 active:scale-90 transition-transform ring-4 ring-white dark:ring-surface-950"
          aria-label="Add new title"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Watching */}
        <NavLink
          to="/watching"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center p-1.5 rounded-xl text-[10px] font-semibold transition-transform active:scale-95 relative ${
              isActive
                ? 'text-brand-600 dark:text-brand-400 font-bold'
                : 'text-surface-500 hover:text-surface-900 dark:hover:text-surface-200'
            }`
          }
        >
          <PlayCircle className="w-5 h-5 mb-0.5" />
          <span>Watching</span>
          {stats.watchingCount > 0 && (
            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-white dark:ring-surface-950" />
          )}
        </NavLink>

        {/* More Menu */}
        <button
          type="button"
          onClick={() => setIsMoreOpen(true)}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl text-[10px] font-semibold transition-transform active:scale-95 ${
            isMoreOpen
              ? 'text-brand-600 dark:text-brand-400 font-bold'
              : 'text-surface-500 hover:text-surface-900 dark:hover:text-surface-200'
          }`}
        >
          <MoreHorizontal className="w-5 h-5 mb-0.5" />
          <span>More</span>
        </button>
      </nav>

      {/* Mobile More Sheet */}
      {isMoreOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden bg-black/60 backdrop-blur-sm flex items-end animate-fade-in"
          onClick={() => setIsMoreOpen(false)}
        >
          <div
            className="w-full bg-white dark:bg-surface-900 rounded-t-3xl shadow-2xl border-t border-surface-200 dark:border-surface-800 p-5 pb-safe animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle & Close Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-surface-900 dark:text-white">
                  Navigate & Tools
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsMoreOpen(false)}
                className="p-1 rounded-lg text-surface-400 hover:text-surface-700 dark:hover:text-surface-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Grid of All Remaining Sections */}
            <div className="grid grid-cols-2 gap-2.5 mb-5">
              {moreItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMoreOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between p-3 rounded-2xl border text-xs font-bold transition-all active:scale-95 ${
                        isActive
                          ? 'bg-brand-500/10 border-brand-500/50 text-brand-600 dark:text-brand-400'
                          : 'bg-surface-50 dark:bg-surface-800/70 border-surface-200/80 dark:border-surface-700/60 text-surface-700 dark:text-surface-300'
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${item.color}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.count !== null && item.count > 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface-200/80 dark:bg-surface-700 text-surface-600 dark:text-surface-300 font-semibold">
                        {item.count}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>

            {/* Theme quick toggle row in More Sheet */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-100/70 dark:bg-surface-800/50 border border-surface-200/80 dark:border-surface-700/60">
              <span className="text-xs font-bold text-surface-600 dark:text-surface-300">Theme</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 ${
                    theme === 'dark' ? 'bg-indigo-600 text-white shadow-sm' : 'text-surface-400'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>Dark</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 ${
                    theme === 'light' ? 'bg-indigo-600 text-white shadow-sm' : 'text-surface-400'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>Light</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('system')}
                  className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 ${
                    theme === 'system' ? 'bg-indigo-600 text-white shadow-sm' : 'text-surface-400'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
