import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { MediaFormModal } from '../media/MediaFormModal';
import { MediaDetailModal } from '../media/MediaDetailModal';
import { PWAInstallBanner } from '../common/PWAInstallBanner';
import { PWAUpdateToast } from '../common/PWAUpdateToast';
import { PullToRefresh } from '../common/PullToRefresh';
import { X } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-surface-50 dark:bg-surface-950 text-surface-900 dark:text-surface-100">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex shrink-0 h-full">
        <Sidebar />
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden bg-black/60 backdrop-blur-sm flex animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="w-72 h-full bg-white dark:bg-surface-950 shadow-2xl relative animate-slide-up flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-4 right-4 z-10">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-surface-400 hover:text-surface-700 dark:hover:text-surface-200"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <Sidebar onCloseMobile={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

        <main className="flex-1 overflow-y-auto p-3.5 sm:p-6 lg:p-8 pb-28 md:pb-8 overscroll-contain">
          <div className="max-w-7xl mx-auto min-h-full">
            <PullToRefresh>
              <Outlet />
            </PullToRefresh>
          </div>
        </main>

        <MobileNav />
      </div>

      {/* Global Modals & Notifications */}
      <MediaFormModal />
      <MediaDetailModal />
      <PWAInstallBanner />
      <PWAUpdateToast />
    </div>
  );
};
