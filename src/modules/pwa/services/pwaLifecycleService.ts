import { ref } from 'vue';
import { registerSW } from 'virtual:pwa-register';
import type { ToastState } from '@/modules/pwa/types/pwa';
import { pwaDeferredUpdateStorageKey } from '@/shared/config/storageKeys';

const defaultToastState: ToastState = {
  visible: false,
  kind: 'success',
  message: '',
  actionLabel: null
};

function isStandaloneMobile(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.innerWidth < 768 && window.matchMedia('(display-mode: standalone)').matches;
}

export function createPwaLifecycleService() {
  const toast = ref<ToastState>({ ...defaultToastState });
  let updateServiceWorker: ((reloadPage?: boolean) => Promise<void>) | undefined;
  let serviceWorkerRegistration: ServiceWorkerRegistration | undefined;
  let launchUpdateCheckRequested = false;
  let launchUpdateCheckTriggered = false;

  function dismissToast(): void {
    toast.value = { ...defaultToastState };
  }

  async function clearCacheStorage(): Promise<void> {
    if (typeof window === 'undefined' || !('caches' in window)) {
      return;
    }

    const keys = await window.caches.keys();
    await Promise.all(keys.map((key) => window.caches.delete(key)));
  }

  async function confirmUpdate(): Promise<void> {
    if (!updateServiceWorker) {
      dismissToast();
      return;
    }

    window.localStorage.removeItem(pwaDeferredUpdateStorageKey);
    await clearCacheStorage();
    await updateServiceWorker(true);
    dismissToast();
  }

  async function triggerLaunchUpdateCheck(): Promise<void> {
    launchUpdateCheckRequested = true;

    if (launchUpdateCheckTriggered) {
      return;
    }

    if (!serviceWorkerRegistration) {
      return;
    }

    launchUpdateCheckTriggered = true;

    try {
      console.info('PWA launch update check triggered.');
      await serviceWorkerRegistration.update();
    } catch (error) {
      console.warn('PWA launch update check failed.', error);
    }
  }

  function register(): void {
    if (typeof window === 'undefined') {
      return;
    }

    updateServiceWorker = registerSW({
      immediate: true,
      onRegisteredSW(_swUrl, registration) {
        serviceWorkerRegistration = registration;

        if (launchUpdateCheckRequested) {
          void triggerLaunchUpdateCheck();
        }
      },
      onOfflineReady() {
        toast.value = {
          visible: true,
          kind: 'success',
          message: '已可離線使用',
          actionLabel: null
        };

        window.setTimeout(() => dismissToast(), 5000);
      },
      onNeedRefresh() {
        const shouldAutoUpdate = window.localStorage.getItem(pwaDeferredUpdateStorageKey) === 'true';

        if (shouldAutoUpdate || !isStandaloneMobile()) {
          void confirmUpdate();
          return;
        }

        toast.value = {
          visible: true,
          kind: 'warning',
          message: '已有新版本，5 秒後提示會先關閉',
          actionLabel: '立即更新'
        };

        window.setTimeout(() => {
          window.localStorage.setItem(pwaDeferredUpdateStorageKey, 'true');
          dismissToast();
        }, 5000);
      }
    });
  }

  return {
    toast,
    register,
    dismissToast,
    confirmUpdate,
    triggerLaunchUpdateCheck
  };
}
