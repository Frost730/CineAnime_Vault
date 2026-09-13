import React, { useState } from 'react';
import { Plus, Minus, Check, CheckCircle2, FastForward } from 'lucide-react';
import { ProgressBar } from '../common/ProgressBar';

interface EpisodeTrackerProps {
  currentEpisode: number;
  totalEpisodes?: number | null;
  onUpdate: (newEpisode: number) => void;
  className?: string;
  showEpisodeGrid?: boolean;
}

export const EpisodeTracker: React.FC<EpisodeTrackerProps> = ({
  currentEpisode,
  totalEpisodes,
  onUpdate,
  className = '',
  showEpisodeGrid = false,
}) => {
  const [isCustomInput, setIsCustomInput] = useState(false);
  const [inputValue, setInputValue] = useState(currentEpisode.toString());

  const total = totalEpisodes && totalEpisodes > 0 ? totalEpisodes : null;
  const progressPct = total ? Math.min(100, Math.round((currentEpisode / total) * 100)) : 100;

  const triggerHaptic = () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(10);
      }
    } catch {
      // Ignore haptic errors
    }
  };

  const handleIncrement = () => {
    if (total && currentEpisode >= total) return;
    triggerHaptic();
    onUpdate(currentEpisode + 1);
  };

  const handleDecrement = () => {
    if (currentEpisode <= 0) return;
    triggerHaptic();
    onUpdate(currentEpisode - 1);
  };

  const handleSkipFive = () => {
    triggerHaptic();
    const nextVal = total ? Math.min(currentEpisode + 5, total) : currentEpisode + 5;
    onUpdate(nextVal);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(inputValue, 10);
    if (!isNaN(val) && val >= 0) {
      const finalVal = total ? Math.min(val, total) : val;
      triggerHaptic();
      onUpdate(finalVal);
      setInputValue(finalVal.toString());
    } else {
      setInputValue(currentEpisode.toString());
    }
    setIsCustomInput(false);
  };

  // Generate episode pills if total is defined and reasonable
  const renderEpisodeGrid = () => {
    if (!total || total <= 0) return null;

    const displayCount = Math.min(total, 64);
    const episodes = Array.from({ length: displayCount }, (_, i) => i + 1);

    return (
      <div className="mt-4 pt-4 border-t border-surface-200 dark:border-surface-800">
        <div className="flex items-center justify-between text-xs font-semibold text-surface-500 mb-2.5">
          <span>EPISODE SELECTOR</span>
          <span className="text-[11px] font-normal">Tap episode to update</span>
        </div>
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-1.5 max-h-48 overflow-y-auto pr-1">
          {episodes.map((epNum) => {
            const isWatched = epNum <= currentEpisode;
            const isCurrent = epNum === currentEpisode;

            return (
              <button
                key={epNum}
                type="button"
                onClick={() => {
                  triggerHaptic();
                  onUpdate(epNum);
                }}
                className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center active:scale-90 touch-manipulation min-h-[38px] ${
                  isCurrent
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-2 ring-indigo-400'
                    : isWatched
                    ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/60'
                    : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700'
                }`}
                title={`Episode ${epNum}${isWatched ? ' (Watched)' : ''}`}
              >
                {epNum}
              </button>
            );
          })}
        </div>
        {total > 64 && (
          <p className="text-[11px] text-surface-400 text-center mt-2">
            Showing first 64 of {total} episodes. Tap the episode text to enter higher numbers.
          </p>
        )}
      </div>
    );
  };

  return (
    <div className={`rounded-2xl bg-surface-100/70 dark:bg-surface-800/50 p-4 sm:p-5 border border-surface-200/80 dark:border-surface-700/60 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400">
            Episode Progress
          </span>
          {total && currentEpisode >= total && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3" /> Completed
            </span>
          )}
        </div>

        {total && (
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
            {progressPct}%
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Stepper Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={currentEpisode <= 0}
            className="w-10 h-10 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center bg-white dark:bg-surface-700 text-surface-700 dark:text-surface-200 border border-surface-200 dark:border-surface-600 hover:bg-surface-50 dark:hover:bg-surface-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-90 touch-manipulation shadow-sm"
            aria-label="Previous episode"
          >
            <Minus className="w-4 h-4" />
          </button>

          {isCustomInput ? (
            <form onSubmit={handleCustomSubmit} className="flex items-center gap-1">
              <input
                type="number"
                min="0"
                max={total || undefined}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                autoFocus
                onBlur={handleCustomSubmit}
                className="w-20 px-2.5 py-1.5 text-center font-bold text-base bg-white dark:bg-surface-900 border border-indigo-500 rounded-xl focus:outline-none"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95"
                title="Save episode"
              >
                <Check className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => {
                setInputValue(currentEpisode.toString());
                setIsCustomInput(true);
              }}
              className="px-3.5 py-2 text-sm sm:text-base font-bold text-surface-900 dark:text-surface-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer rounded-xl hover:bg-surface-200/50 dark:hover:bg-surface-700/50 active:scale-95 touch-manipulation"
              title="Click to manually edit episode"
            >
              Episode {currentEpisode}
              {total ? ` / ${total}` : ''}
            </button>
          )}

          <button
            type="button"
            onClick={handleIncrement}
            disabled={Boolean(total && currentEpisode >= total)}
            className="w-10 h-10 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center bg-white dark:bg-surface-700 text-surface-700 dark:text-surface-200 border border-surface-200 dark:border-surface-600 hover:bg-surface-50 dark:hover:bg-surface-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-90 touch-manipulation shadow-sm"
            aria-label="Next episode (+1)"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Skip +5 button for long series */}
          {total && total > 10 && currentEpisode < total - 1 && (
            <button
              type="button"
              onClick={handleSkipFive}
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-surface-200/70 dark:bg-surface-700/60 text-xs font-bold text-surface-700 dark:text-surface-300 hover:bg-indigo-500 hover:text-white transition-colors active:scale-95"
              title="Skip +5 episodes"
            >
              <FastForward className="w-3.5 h-3.5" />
              <span>+5</span>
            </button>
          )}
        </div>

        {/* Quick Complete Button */}
        {total && currentEpisode < total && (
          <button
            type="button"
            onClick={() => {
              triggerHaptic();
              onUpdate(total);
            }}
            className="text-xs font-bold text-surface-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors py-1.5 px-2 rounded-lg hover:bg-surface-200/50 dark:hover:bg-surface-800"
          >
            Mark All Watched
          </button>
        )}
      </div>

      {/* Visual Progress Bar */}
      <div className="mt-3.5">
        <ProgressBar
          progressPercentage={progressPct}
          size="sm"
          colorScheme="brand"
          showPercentage={false}
        />
      </div>

      {/* Grid of episodes if expanded */}
      {showEpisodeGrid && renderEpisodeGrid()}
    </div>
  );
};
