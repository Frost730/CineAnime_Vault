import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Library,
  Film,
  Tv,
  PlayCircle,
  CheckCircle2,
  Bookmark,
  Heart,
  BarChart3,
  Settings,
  Plus,
  Clapperboard,
  Sparkles,
} from 'lucide-react';
import { useWatchlist } from '../../context/WatchlistContext';
import { useStats } from '../../hooks/useStats';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { media, openAddModal } = useWatchlist();
  const stats = useStats(media);

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'My Library', path: '/library', icon: Library, badge: stats.totalCount },
    { label: 'Movies', path: '/movies', icon: Film, badge: stats.movieCount },
    { label: 'Series', path: '/series', icon: Tv, badge: stats.seriesCount },
    { label: 'Anime', path: '/anime', icon: Sparkles, badge: stats.animeCount },
    { label: 'Currently Watching', path: '/watching', icon: PlayCircle, badge: stats.watchingCount, highlight: true },
    { label: 'Completed', path: '/completed', icon: CheckCircle2, badge: stats.completedCount },
    { label: 'Watchlist', path: '/watchlist', icon: Bookmark, badge: stats.planToWatchCount },
    { label: 'Favorites', path: '/favorites', icon: Heart, badge: stats.favoriteCount },
    { label: 'Statistics', path: '/statistics', icon: BarChart3 },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 h-full flex flex-col bg-white dark:bg-surface-950 border-r border-surface-200 dark:border-surface-850 select-none">
      {/* Brand Header */}
      <div className="p-5 flex items-center justify-between border-b border-surface-100 dark:border-surface-850">
        <NavLink
          to="/"
          onClick={onCloseMobile}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Clapperboard className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-surface-900 dark:text-white block leading-tight">
              CineAnime<span className="text-brand-500">.</span>
            </span>
            <span className="text-[10px] font-semibold tracking-wider uppercase text-surface-400">
              Personal Vault
            </span>
          </div>
        </NavLink>
      </div>

      {/* Quick Add CTA Button */}
      <div className="p-4">
        <button
          type="button"
          onClick={() => {
            openAddModal();
            onCloseMobile?.();
          }}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-sm shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/30 transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Media</span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto" aria-label="Main Navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold dark:bg-brand-500/15'
                    : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100 hover:bg-surface-100 dark:hover:bg-surface-850'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </div>
              {typeof item.badge === 'number' && item.badge > 0 && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    item.highlight
                      ? 'bg-indigo-500 text-white shadow-sm'
                      : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Storage Footer indicator */}
      <div className="p-4 border-t border-surface-100 dark:border-surface-850 text-xs text-surface-400 flex items-center justify-between">
        <span>Offline Storage</span>
        <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" /> Active
        </span>
      </div>
    </aside>
  );
};
