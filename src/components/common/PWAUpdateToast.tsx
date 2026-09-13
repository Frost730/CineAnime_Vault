import React from 'react';
import { RotateCcw, Sparkles } from 'lucide-react';
import { usePWAUpdate } from '../../services/pwa';

export const PWAUpdateToast: React.FC = () => {
  const { hasUpdate, reloadToUpdate } = usePWAUpdate();

  if (!hasUpdate) return null;

  const handleReload = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.(20);
    }
    reloadToUpdate();
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-slide-down px-4 w-full max-w-sm">
      <div className="p-3 rounded-2xl bg-indigo-900/95 dark:bg-indigo-950/95 text-white border border-indigo-400/40 shadow-2xl backdrop-blur-md flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-300 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">
              Update Available
            </p>
            <p className="text-[10px] text-indigo-200/80 truncate">
              A newer version of CineAnime is ready.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReload}
          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-indigo-950 font-bold text-xs shadow-md hover:bg-indigo-50 active:scale-95 transition-all touch-manipulation"
        >
          <RotateCcw className="w-3.5 h-3.5 text-indigo-600 animate-spin-slow" />
          <span>Reload</span>
        </button>
      </div>
    </div>
  );
};
