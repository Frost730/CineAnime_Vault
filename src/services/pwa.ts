import { useEffect, useState } from 'react';

// BeforeInstallPromptEvent interface
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const listeners = new Set<(canInstall: boolean) => void>();

function notifyListeners() {
  const canInstall = deferredPrompt !== null;
  listeners.forEach((listener) => listener(canInstall));
}

/**
 * Registers the Service Worker for PWA offline functionality.
 */
export function registerServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  // Intercept the browser install prompt event
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    notifyListeners();
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    notifyListeners();
    console.log('[PWA] CineAnime Vault installed successfully.');
  });

  // Register sw on window load
  window.addEventListener('load', () => {
    const swUrl = './sw.js';
    navigator.serviceWorker
      .register(swUrl, { scope: './' })
      .then((reg) => {
        console.log('[PWA] Service Worker registered with scope:', reg.scope);
      })
      .catch((err) => {
        console.warn('[PWA] Service Worker registration failed:', err);
      });
  });
}

/**
 * Triggers the native browser install dialog if available.
 */
export async function promptAppInstall(): Promise<boolean> {
  if (!deferredPrompt) return false;

  try {
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    deferredPrompt = null;
    notifyListeners();
    return choice.outcome === 'accepted';
  } catch (err) {
    console.error('[PWA] Install prompt error:', err);
    return false;
  }
}

/**
 * Hook providing live installable state and trigger action.
 */
export function usePWAInstall() {
  const [canInstall, setCanInstall] = useState<boolean>(deferredPrompt !== null);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed PWA)
    const isRunningStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(isRunningStandalone);

    const updateState = (avail: boolean) => setCanInstall(avail);
    listeners.add(updateState);

    return () => {
      listeners.delete(updateState);
    };
  }, []);

  return {
    canInstall: canInstall && !isStandalone,
    isStandalone,
    promptInstall: promptAppInstall,
  };
}
