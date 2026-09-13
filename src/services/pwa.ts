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
let swRegistration: ServiceWorkerRegistration | null = null;
let isUpdateAvailable = false;

const installListeners = new Set<(canInstall: boolean) => void>();
const updateListeners = new Set<(hasUpdate: boolean) => void>();

function notifyInstallListeners() {
  const canInstall = deferredPrompt !== null;
  installListeners.forEach((listener) => listener(canInstall));
}

function notifyUpdateListeners() {
  updateListeners.forEach((listener) => listener(isUpdateAvailable));
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
    notifyInstallListeners();
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    notifyInstallListeners();
    console.log('[PWA] CineAnime Vault installed successfully.');
  });

  // Register sw on window load
  window.addEventListener('load', () => {
    const swUrl = './sw.js';
    navigator.serviceWorker
      .register(swUrl, { scope: './' })
      .then((reg) => {
        swRegistration = reg;
        console.log('[PWA] Service Worker registered with scope:', reg.scope);

        // Check for updates periodically when user switches tabs/apps
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') {
            reg.update().catch(() => {/* offline */});
          }
        });

        // Listen for new worker installation
        reg.addEventListener('updatefound', () => {
          const installingWorker = reg.installing;
          if (!installingWorker) return;

          installingWorker.addEventListener('statechange', () => {
            if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
              isUpdateAvailable = true;
              notifyUpdateListeners();
              console.log('[PWA] New version ready for activation.');
            }
          });
        });
      })
      .catch((err) => {
        console.warn('[PWA] Service Worker registration failed:', err);
      });

    // Auto reload when newly activated worker takes control
    let isReloading = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!isReloading) {
        isReloading = true;
        window.location.reload();
      }
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
    notifyInstallListeners();
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
    installListeners.add(updateState);

    return () => {
      installListeners.delete(updateState);
    };
  }, []);

  return {
    canInstall: canInstall && !isStandalone,
    isStandalone,
    promptInstall: promptAppInstall,
  };
}

/**
 * Forces the waiting Service Worker to activate and reloads the window.
 */
export function reloadToUpdate() {
  if (swRegistration && swRegistration.waiting) {
    swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
  } else {
    window.location.reload();
  }
}

/**
 * Hook providing live update status when a new version of the app is ready.
 */
export function usePWAUpdate() {
  const [hasUpdate, setHasUpdate] = useState<boolean>(isUpdateAvailable);

  useEffect(() => {
    const handler = (avail: boolean) => setHasUpdate(avail);
    updateListeners.add(handler);
    return () => {
      updateListeners.delete(handler);
    };
  }, []);

  return {
    hasUpdate,
    reloadToUpdate,
  };
}

