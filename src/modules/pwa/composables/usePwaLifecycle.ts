import { onMounted } from 'vue';
import { createPwaLifecycleService } from '@/modules/pwa/services/pwaLifecycleService';

const pwaLifecycleService = createPwaLifecycleService();

function scheduleIdle(callback: () => void): void {
  if (typeof window === 'undefined') {
    callback();
    return;
  }

  const idleApi = window as Window & typeof globalThis & {
    requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
  };

  if (typeof idleApi.requestIdleCallback === 'function') {
    idleApi.requestIdleCallback(() => callback(), { timeout: 2_000 });
    return;
  }

  window.setTimeout(callback, 0);
}

export function usePwaLifecycle() {
  onMounted(() => {
    scheduleIdle(() => {
      pwaLifecycleService.register();
    });
  });

  return pwaLifecycleService;
}

export function triggerLaunchUpdateCheck(): Promise<void> {
  return pwaLifecycleService.triggerLaunchUpdateCheck();
}
