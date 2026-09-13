import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { Modal } from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="sm"
      placement="center"
      showCloseButton={false}
      zIndex={110}
    >
      <div className="flex flex-col items-center text-center p-1 sm:p-2">
        {/* Variant Icon */}
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3.5 shadow-sm ${
            variant === 'danger'
              ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50'
              : variant === 'warning'
              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50'
              : 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/50'
          }`}
        >
          {variant === 'info' ? (
            <Info className="w-6 h-6" />
          ) : (
            <AlertTriangle className="w-6 h-6" />
          )}
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-surface-900 dark:text-surface-100 mb-1.5 leading-snug">
          {title}
        </h3>

        {/* Message */}
        <p className="text-xs sm:text-sm text-surface-600 dark:text-surface-400 mb-5 max-w-xs leading-relaxed">
          {message}
        </p>

        {/* Buttons */}
        <div className="flex items-center gap-2.5 w-full">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-surface-200 dark:border-surface-700 font-semibold text-xs sm:text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 active:scale-95 transition-all touch-manipulation cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white shadow-md active:scale-95 transition-all touch-manipulation cursor-pointer ${
              variant === 'danger'
                ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/25'
                : variant === 'warning'
                ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/25'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/25'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};
