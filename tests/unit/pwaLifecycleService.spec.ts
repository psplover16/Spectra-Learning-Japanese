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
    pwaRegisterMock.deferRegistration = false;
    pwaRegisterMock.registration.update.mockClear();
    pwaRegisterMock.registration.update.mockResolvedValue(undefined);
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

  it('啟動更新檢查會呼叫 service worker registration update 一次', async () => {
    const service = createPwaLifecycleService();
    service.register();

    await service.triggerLaunchUpdateCheck();

    expect(pwaRegisterMock.registration.update).toHaveBeenCalledTimes(1);
  });

  it('啟動更新檢查早於 registration 完成時，會等 registration 到位後補跑一次', async () => {
    pwaRegisterMock.deferRegistration = true;
    const service = createPwaLifecycleService();
    service.register();

    await service.triggerLaunchUpdateCheck();
    expect(pwaRegisterMock.registration.update).not.toHaveBeenCalled();

    pwaRegisterMock.callbacks.onRegisteredSW?.('/sw.js', pwaRegisterMock.registration);
    await Promise.resolve();

    expect(pwaRegisterMock.registration.update).toHaveBeenCalledTimes(1);
  });

  it('啟動更新檢查失敗時只警告且不中斷流程', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    pwaRegisterMock.registration.update.mockRejectedValueOnce(new Error('offline'));
    const service = createPwaLifecycleService();
    service.register();

    await expect(service.triggerLaunchUpdateCheck()).resolves.toBeUndefined();

    expect(warnSpy).toHaveBeenCalledWith('PWA launch update check failed.', expect.any(Error));
  });
});
