import React from 'react';
import { Menu, Sun, Moon, Monitor, Plus, Clapperboard } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useWatchlist } from '../../context/WatchlistContext';
import type { ThemeMode } from '../../types/settings';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { openAddModal } = useWatchlist();

  const cycleTheme = () => {
    const sequence: ThemeMode[] = ['dark', 'light', 'system'];
    const nextIndex = (sequence.indexOf(theme) + 1) % sequence.length;
    setTheme(sequence[nextIndex]);
  };

  return (
    <header className="h-16 px-4 sm:px-6 flex items-center justify-between border-b border-surface-200/80 dark:border-surface-850 bg-white/80 dark:bg-surface-950/80 backdrop-blur-md sticky top-0 z-30">
      {/* Left: Mobile hamburger & Brand */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-xl text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-850 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex md:hidden items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-sm">
            <Clapperboard className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-sm tracking-tight text-surface-900 dark:text-white">
            CineAnime
          </span>
        </div>
      </div>

      {/* Right: Quick actions & Theme Switcher */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Add button */}
        <button
          type="button"
          onClick={() => openAddModal()}
          className="inline-flex items-center gap-1.5 py-2 px-3 sm:px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Title</span>
        </button>

        {/* Theme Switcher Button */}
        <button
          type="button"
          onClick={cycleTheme}
          className="p-2 rounded-xl border border-surface-200 dark:border-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-850 transition-colors"
          title={`Current theme: ${theme} (Click to change)`}
          aria-label="Change theme"
        >
          {theme === 'system' ? (
            <Monitor className="w-4 h-4" />
          ) : resolvedTheme === 'dark' ? (
            <Moon className="w-4 h-4 text-indigo-400" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500" />
          )}
        </button>
      </div>
    </header>
  );
};
