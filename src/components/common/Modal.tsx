import React, { useState, useEffect, useRef } from 'react';
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
  const contentRef = useRef<HTMLDivElement>(null);

  // Drag-to-dismiss gesture state for mobile bottom sheet
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const startY = useRef<number | null>(null);
  const startX = useRef<number | null>(null);
  const startTime = useRef<number>(0);
  const isDragFromHeader = useRef<boolean>(false);

  // Determine if this modal should be centered on mobile or docked as a bottom sheet
  const isCentered =
    placement === 'center' || (placement === 'auto' && (maxWidth === 'sm' || maxWidth === 'md'));

  const handleClose = React.useCallback(() => {
    setDragY(0);
    setIsDragging(false);
    setIsClosing(false);
    startY.current = null;
    startX.current = null;
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    activeModalCount++;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
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
  }, [isOpen, handleClose]);

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

  // Touch handlers for swipe-down to dismiss on mobile
  const handleTouchStart = (e: React.TouchEvent, fromHeader = false) => {
    if (isCentered || isClosing) return;
    const touch = e.touches[0];
    startY.current = touch.clientY;
    startX.current = touch.clientX;
    startTime.current = Date.now();
    isDragFromHeader.current = fromHeader;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY.current === null || isCentered || isClosing) return;
    const touch = e.touches[0];
    const diffY = touch.clientY - startY.current;
    const diffX = touch.clientX - (startX.current ?? touch.clientX);

    // If the movement is mostly horizontal, don't hijack vertical scrolling
    if (!isDragging && Math.abs(diffX) > Math.abs(diffY)) {
      return;
    }

    // Only allow downward drag
    if (diffY > 0) {
      // If drag started in content area, only allow pull-down if scrolled to top
      if (!isDragFromHeader.current && contentRef.current && contentRef.current.scrollTop > 2) {
        return;
      }

      setIsDragging(true);
      setDragY(diffY);
    } else {
      if (isDragging) {
        setDragY(0);
        setIsDragging(false);
      }
    }
  };

  const handleTouchEnd = () => {
    if (startY.current === null || isCentered || isClosing) return;

    const elapsed = Date.now() - startTime.current;
    const velocity = elapsed > 0 ? dragY / elapsed : 0;
    // Dismiss threshold: either dragged down > 75px or swiped downwards with velocity
    const shouldClose = dragY > 75 || (dragY > 30 && velocity > 0.4);

    startY.current = null;
    startX.current = null;
    setIsDragging(false);

    if (shouldClose) {
      setIsClosing(true);
      setDragY(window.innerHeight);
      setTimeout(() => {
        handleClose();
      }, 220);
    } else {
      setDragY(0);
    }
  };

  const modalContent = (
    <div
      style={{
        zIndex,
        opacity: !isCentered && dragY > 0 ? Math.max(0.2, 1 - dragY / 400) : 1,
      }}
      className={`fixed inset-0 flex overflow-y-auto bg-black/65 backdrop-blur-sm animate-fade-in ${
        isCentered
          ? 'items-center justify-center p-4 sm:p-6'
          : 'items-end sm:items-center justify-center p-0 sm:p-6'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        style={
          !isCentered && (isDragging || isClosing || dragY > 0)
            ? {
                transform: `translateY(${dragY}px)`,
                transition: isDragging ? 'none' : 'transform 0.22s cubic-bezier(0.32, 0.72, 0, 1)',
              }
            : undefined
        }
        onTouchStart={(e) => handleTouchStart(e, false)}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`relative w-full ${maxWidthClasses[maxWidth]} bg-white dark:bg-surface-900 shadow-2xl overflow-hidden flex flex-col ${
          isCentered
            ? 'rounded-2xl border border-surface-200/90 dark:border-surface-800 animate-scale-in max-h-[90vh]'
            : 'rounded-t-3xl sm:rounded-2xl border-t sm:border border-surface-200 dark:border-surface-800 animate-slide-up sm:animate-scale-in max-h-[92vh] sm:max-h-[90vh]'
        }`}
      >
        {/* Mobile drag handle indicator - interactive pull down to dismiss or tap to close */}
        {!isCentered && (
          <div
            className="sm:hidden pt-3 pb-2 flex flex-col items-center justify-center bg-surface-50/80 dark:bg-surface-900/80 cursor-grab active:cursor-grabbing touch-manipulation select-none border-b border-surface-100 dark:border-surface-800/40"
            onTouchStart={(e) => handleTouchStart(e, true)}
            onClick={handleClose}
            role="button"
            tabIndex={0}
            aria-label="Slide down to close"
          >
            <div className="w-12 h-1.5 rounded-full bg-surface-300 dark:bg-surface-600 transition-colors" />
            <span className="text-[10px] text-surface-400 dark:text-surface-500 mt-1 font-medium">
              Slide down to close
            </span>
          </div>
        )}

        {title && (
          <div
            onTouchStart={(e) => handleTouchStart(e, true)}
            className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-surface-200 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-900/50 touch-manipulation"
          >
            <div className="text-base sm:text-lg font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2 flex-1 min-w-0 pr-2">
              {title}
            </div>
            {showCloseButton && (
              <button
                type="button"
                onClick={handleClose}
                className="p-2 sm:p-1.5 rounded-xl bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100 transition-colors shrink-0 active:scale-90 touch-manipulation cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        <div
          ref={contentRef}
          className={`overflow-y-auto overscroll-contain ${isCentered ? 'p-5 sm:p-6' : 'p-4 sm:p-6 pb-safe'} flex-1`}
        >
          {children}
        </div>
      </div>
    </div>
  );

  // Always portal directly to document.body to escape transform, overflow clipping, and stacking context issues
  return createPortal(modalContent, document.body);
};
