import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPwaLifecycleService } from '@/modules/pwa/services/pwaLifecycleService';
import { pwaDeferredUpdateStorageKey } from '@/shared/config/storageKeys';
import { pwaRegisterMock } from '../mocks/pwaRegisterMock';

describe('pwaLifecycleService', () => {
  const originalMatchMedia = window.matchMedia;
  const originalInnerWidth = window.innerWidth;
  const originalCaches = window.caches;

  beforeEach(() => {
    vi.useFakeTimers();
    window.localStorage.clear();
    pwaRegisterMock.updateServiceWorker.mockClear();
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 375 });
    window.matchMedia = vi.fn().mockReturnValue({ matches: true });
    Object.defineProperty(window, 'caches', {
      configurable: true,
      value: {
        keys: vi.fn(async () => ['v1']),
        delete: vi.fn(async () => true)
      }
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    window.matchMedia = originalMatchMedia;
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: originalInnerWidth });
    Object.defineProperty(window, 'caches', { configurable: true, value: originalCaches });
  });

  it('符合條件時會顯示更新提示，5 秒後隱藏並延後到下次更新', async () => {
    const service = createPwaLifecycleService();
    service.register();

    pwaRegisterMock.callbacks.onNeedRefresh?.();

    expect(service.toast.value.visible).toBe(true);
    expect(service.toast.value.kind).toBe('warning');

    await vi.advanceTimersByTimeAsync(5000);

    expect(service.toast.value.visible).toBe(false);
    expect(window.localStorage.getItem(pwaDeferredUpdateStorageKey)).toBe('true');
  });

  it('按下立即更新會清除 cache 並呼叫 update service worker', async () => {
    const service = createPwaLifecycleService();
    service.register();

    pwaRegisterMock.callbacks.onNeedRefresh?.();
    await service.confirmUpdate();

    expect(window.localStorage.getItem(pwaDeferredUpdateStorageKey)).toBeNull();
    expect(pwaRegisterMock.updateServiceWorker).toHaveBeenCalledWith(true);
  });
});
