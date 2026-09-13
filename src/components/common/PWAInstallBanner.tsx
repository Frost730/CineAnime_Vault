import React, { useState } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../../services/pwa';

export const PWAInstallBanner: React.FC = () => {
  const { canInstall, promptInstall } = usePWAInstall();
  const [dismissed, setDismissed] = useState<boolean>(() => {
    return sessionStorage.getItem('pwa_prompt_dismissed') === 'true';
  });

  if (!canInstall || dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  const handleInstall = async () => {
    const installed = await promptInstall();
    if (installed) {
      setDismissed(true);
    }
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 left-4 sm:left-auto sm:right-6 sm:w-96 z-40 animate-slide-up">
      <div className="p-4 rounded-2xl bg-white dark:bg-surface-900 border border-brand-500/30 dark:border-brand-500/30 shadow-2xl shadow-brand-950/20 backdrop-blur-lg flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-pink-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-500/30">
          <Smartphone className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <h4 className="text-xs font-bold text-surface-900 dark:text-surface-100">
              Install CineAnime App
            </h4>
            <button
              type="button"
              onClick={handleDismiss}
              className="p-1 rounded-md text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-surface-500 dark:text-surface-400 mt-0.5 leading-snug">
            Install to your home screen or desktop for instant full-screen offline access.
          </p>

          <div className="flex items-center gap-2 mt-2.5">
            <button
              type="button"
              onClick={handleInstall}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 active:scale-95 text-white font-bold text-xs shadow-sm shadow-brand-600/30 transition-all touch-manipulation"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install Now</span>
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="px-2.5 py-1.5 rounded-lg text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 text-xs font-medium transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
