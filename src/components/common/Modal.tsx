import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  showCloseButton?: boolean;
  placement?: 'center' | 'bottom' | 'auto';
  zIndex?: number;
}

// Module-level counter to safely manage body scroll lock across multiple/nested modals
let activeModalCount = 0;

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = '2xl',
  showCloseButton = true,
  placement = 'auto',
  zIndex = 90,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    activeModalCount++;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      activeModalCount = Math.max(0, activeModalCount - 1);
      if (activeModalCount === 0) {
        document.body.style.overflow = '';
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
  };

  // Determine if this modal should be centered on mobile or docked as a bottom sheet
  const isCentered =
    placement === 'center' || (placement === 'auto' && (maxWidth === 'sm' || maxWidth === 'md'));

  const modalContent = (
    <div
      style={{ zIndex }}
      className={`fixed inset-0 flex overflow-y-auto bg-black/65 backdrop-blur-sm animate-fade-in ${
        isCentered
          ? 'items-center justify-center p-4 sm:p-6'
          : 'items-end sm:items-center justify-center p-0 sm:p-6'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        className={`relative w-full ${maxWidthClasses[maxWidth]} bg-white dark:bg-surface-900 shadow-2xl overflow-hidden flex flex-col ${
          isCentered
            ? 'rounded-2xl border border-surface-200/90 dark:border-surface-800 animate-scale-in max-h-[90vh]'
            : 'rounded-t-3xl sm:rounded-2xl border-t sm:border border-surface-200 dark:border-surface-800 animate-slide-up sm:animate-scale-in max-h-[92vh] sm:max-h-[90vh]'
        }`}
      >
        {/* Mobile drag handle indicator - only on bottom sheet mode */}
        {!isCentered && (
          <div className="sm:hidden pt-2.5 pb-1 flex justify-center bg-surface-50/50 dark:bg-surface-900/50">
            <div className="w-10 h-1 rounded-full bg-surface-300 dark:bg-surface-700" />
          </div>
        )}

        {title && (
          <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 sm:py-4 border-b border-surface-200 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-900/50">
            <div className="text-base sm:text-lg font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
              {title}
            </div>
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        <div className={`overflow-y-auto ${isCentered ? 'p-5 sm:p-6' : 'p-4 sm:p-6 pb-safe'} flex-1`}>
          {children}
        </div>
      </div>
    </div>
  );

  // Always portal directly to document.body to escape transform, overflow clipping, and stacking context issues
  return createPortal(modalContent, document.body);
};
