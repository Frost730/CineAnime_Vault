import React, { useState, useRef } from 'react';
import {
  Settings,
  Download,
  Upload,
  Trash2,
  HardDrive,
  FileSpreadsheet,
  Sun,
  Moon,
  Monitor,
  CheckCircle2,
  AlertTriangle,
  Smartphone,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useWatchlist } from '../context/WatchlistContext';
import { usePWAInstall } from '../services/pwa';
import { downloadJsonBackup, downloadCsvExport } from '../utils/exportImport';
import { getStorageUsage, validateAndParseBackup } from '../services/storage';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Modal } from '../components/common/Modal';
import type { MediaItem } from '../types/media';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { media, clearLibrary, importLibrary } = useWatchlist();
  const { canInstall, isStandalone, promptInstall } = usePWAInstall();

  // Storage info
  const storageInfo = getStorageUsage();

  // Dialog triggers
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Import preview modal
  const [importCandidate, setImportCandidate] = useState<{
    media: MediaItem[];
    version: number;
    appName: string;
    exportedAt: string;
  } | null>(null);
  const [importReplace, setImportReplace] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const result = validateAndParseBackup(content);

      if (!result.success || !result.data) {
        setImportError(result.error || 'Failed to validate backup file.');
        return;
      }

      setImportCandidate({
        media: result.data.media,
        version: result.data.version,
        appName: result.data.appName,
        exportedAt: result.data.exportedAt,
      });
      setImportError(null);
    };

    reader.onerror = () => {
      setImportError('Failed to read file from disk.');
    };

    reader.readAsText(file);
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const handleExecuteImport = () => {
    if (!importCandidate) return;
    importLibrary(importCandidate.media, importReplace);
    setImportCandidate(null);
    setImportSuccess(true);
    setTimeout(() => setImportSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 rounded-lg bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300">
            <Settings className="w-5 h-5" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-surface-900 dark:text-surface-100 tracking-tight">
            Settings & Storage
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-surface-500 dark:text-surface-400">
          Manage visual preferences, data backups, import/export, and offline storage.
        </p>
      </div>

      {/* Success Notification */}
      {importSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-sm font-semibold flex items-center gap-2 animate-scale-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>Library backup imported successfully!</span>
        </div>
      )}

      {/* Error Notification */}
      {importError && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-sm font-semibold flex items-center gap-2 animate-scale-in">
          <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
          <span>{importError}</span>
        </div>
      )}

      {/* Section 1: Appearance & Theme */}
      <section className="p-6 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200/80 dark:border-surface-800/80 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
          <Sun className="w-4 h-4 text-amber-500" />
          Theme & Appearance
        </h2>
        <p className="text-xs sm:text-sm text-surface-500">
          Select your preferred interface color mode. Dark theme is the default for CineAnime Vault.
        </p>

        <div className="grid grid-cols-3 gap-3 max-w-md">
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 text-xs font-bold transition-all ${
              theme === 'dark'
                ? 'bg-brand-500/10 border-brand-500 text-brand-600 dark:text-brand-400 ring-2 ring-brand-500/20'
                : 'bg-surface-50 dark:bg-surface-800 border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700'
            }`}
          >
            <Moon className="w-5 h-5" />
            <span>Dark</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 text-xs font-bold transition-all ${
              theme === 'light'
                ? 'bg-brand-500/10 border-brand-500 text-brand-600 dark:text-brand-400 ring-2 ring-brand-500/20'
                : 'bg-surface-50 dark:bg-surface-800 border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700'
            }`}
          >
            <Sun className="w-5 h-5" />
            <span>Light</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme('system')}
            className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 text-xs font-bold transition-all ${
              theme === 'system'
                ? 'bg-brand-500/10 border-brand-500 text-brand-600 dark:text-brand-400 ring-2 ring-brand-500/20'
                : 'bg-surface-50 dark:bg-surface-800 border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700'
            }`}
          >
            <Monitor className="w-5 h-5" />
            <span>System</span>
          </button>
        </div>
      </section>

      {/* Section 2: Progressive Web App */}
      <section className="p-6 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200/80 dark:border-surface-800/80 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-pink-500" />
          Progressive Web App (PWA)
        </h2>
        <p className="text-xs sm:text-sm text-surface-500">
          CineAnime Vault is an installable PWA that works offline on phones, tablets, and computers.
        </p>

        <div className="p-4 rounded-xl bg-surface-50 dark:bg-surface-800/40 border border-surface-200/80 dark:border-surface-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-surface-900 dark:text-surface-100">
                Installation Status
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isStandalone
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800'
                }`}
              >
                {isStandalone ? 'Installed (Standalone)' : canInstall ? 'Ready to Install' : 'Web Browser'}
              </span>
            </div>
            <p className="text-xs text-surface-500 mt-1">
              {isStandalone
                ? 'You are currently using CineAnime Vault as an installed standalone app with offline caching active.'
                : canInstall
                ? 'Click the install button to add CineAnime Vault directly to your device home screen.'
                : 'To install on iOS Safari, tap "Share" → "Add to Home Screen". On Chrome/Edge, click the install icon in the URL bar.'}
            </p>
          </div>

          {canInstall && (
            <button
              type="button"
              onClick={() => promptInstall()}
              className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-brand-600/20 transition-all touch-manipulation"
            >
              <Download className="w-4 h-4" />
              <span>Install to Device</span>
            </button>
          )}
        </div>
      </section>

      {/* Section 3: Backup & Export / Import */}
      <section className="p-6 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200/80 dark:border-surface-800/80 shadow-sm space-y-5">
        <div>
          <h2 className="text-base font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-indigo-500" />
            Data Backup & Restore
          </h2>
          <p className="text-xs sm:text-sm text-surface-500 mt-1">
            Export your entire collection as a portable JSON backup file or spreadsheet, or restore from a previous backup.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* JSON Export */}
          <button
            type="button"
            onClick={downloadJsonBackup}
            className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-brand-50 dark:bg-brand-950/40 hover:bg-brand-100 dark:hover:bg-brand-900/50 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 font-bold text-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON Backup</span>
          </button>

          {/* CSV Export */}
          <button
            type="button"
            onClick={() => downloadCsvExport(media)}
            className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-surface-50 dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700 border border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300 font-bold text-xs transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            <span>Export to CSV</span>
          </button>

          {/* JSON Import */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl bg-surface-50 dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700 border border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300 font-bold text-xs transition-colors"
            >
              <Upload className="w-4 h-4 text-indigo-500" />
              <span>Import Backup JSON</span>
            </button>
          </div>
        </div>

        {/* Storage stats */}
        <div className="p-4 rounded-xl bg-surface-50 dark:bg-surface-800/40 border border-surface-200/80 dark:border-surface-700/60 flex items-center justify-between text-xs">
          <div>
            <span className="font-semibold text-surface-700 dark:text-surface-300 block">
              Local Storage Usage
            </span>
            <span className="text-surface-400">
              Approx. {(storageInfo.usedBytes / 1024).toFixed(1)} KB used
            </span>
          </div>
          <span className="font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-2.5 py-1 rounded-full border border-brand-200 dark:border-brand-800">
            {storageInfo.percentage}% of quota
          </span>
        </div>
      </section>

      {/* Section 3: Danger Zone */}
      <section className="p-6 rounded-2xl bg-white dark:bg-surface-900 border border-rose-200 dark:border-rose-950/50 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-500" />
          Danger Zone
        </h2>
        <p className="text-xs sm:text-sm text-surface-500">
          Permanently clear your offline library data and cached entries. This action cannot be undone.
        </p>

        {/* Wipe button */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowClearConfirm(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/50 font-bold text-xs transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Wipe Entire Library</span>
          </button>
        </div>
      </section>

      {/* Confirmation Dialog: Clear All */}
      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={() => clearLibrary()}
        title="Clear All Library Data?"
        message="Are you completely sure you want to wipe all movies, TV series, anime, and notes? This will delete all items from your browser storage."
        confirmLabel="Wipe Library"
        variant="danger"
      />

      {/* Import Candidate Modal */}
      {importCandidate && (
        <Modal
          isOpen={Boolean(importCandidate)}
          onClose={() => setImportCandidate(null)}
          title="Confirm Library Import"
          maxWidth="lg"
        >
          <div className="space-y-4">
            <p className="text-sm text-surface-600 dark:text-surface-300">
              Found a valid CineAnime backup file containing{' '}
              <strong className="text-surface-900 dark:text-white">
                {importCandidate.media.length} titles
              </strong>
              .
            </p>

            <div className="p-3.5 rounded-xl bg-surface-50 dark:bg-surface-800/60 border border-surface-200 dark:border-surface-700 text-xs space-y-1">
              <div><strong>Exported:</strong> {new Date(importCandidate.exportedAt).toLocaleString()}</div>
              <div><strong>Schema Version:</strong> {importCandidate.version}</div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-surface-500 block">
                Import Mode
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-surface-800 dark:text-surface-200">
                  <input
                    type="radio"
                    name="importMode"
                    checked={!importReplace}
                    onChange={() => setImportReplace(false)}
                    className="accent-brand-600"
                  />
                  <span>Merge with current library (skip duplicates)</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-rose-600 dark:text-rose-400">
                  <input
                    type="radio"
                    name="importMode"
                    checked={importReplace}
                    onChange={() => setImportReplace(true)}
                    className="accent-rose-600"
                  />
                  <span>Replace entire current library with this backup</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-200 dark:border-surface-800">
              <button
                type="button"
                onClick={() => setImportCandidate(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-surface-600 hover:bg-surface-100 dark:hover:bg-surface-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteImport}
                className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md"
              >
                Confirm & Import
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
