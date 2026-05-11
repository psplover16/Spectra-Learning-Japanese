import { beforeEach, describe, expect, it, vi } from 'vitest';

const mount = vi.fn();
const use = vi.fn(() => ({ mount }));
const createApp = vi.fn(() => ({ use }));
const triggerLaunchUpdateCheck = vi.fn(async () => undefined);

vi.mock('vue', async (importOriginal) => ({
  ...(await importOriginal<typeof import('vue')>()),
  createApp
}));

vi.mock('@/app/AppShell.vue', () => ({
  default: {}
}));

vi.mock('@/app/router', () => ({
  default: {}
}));

vi.mock('@/modules/pwa/composables/usePwaLifecycle', () => ({
  triggerLaunchUpdateCheck
}));

describe('app main bootstrap', () => {
  beforeEach(() => {
    vi.resetModules();
    createApp.mockClear();
    use.mockClear();
    mount.mockClear();
    triggerLaunchUpdateCheck.mockClear();
  });

  it('掛載應用後於 idle 階段觸發一次 PWA 啟動更新檢查', async () => {
    vi.useFakeTimers();
    try {
      await import('@/app/main');

      expect(createApp).toHaveBeenCalledTimes(1);
      expect(use).toHaveBeenCalledTimes(1);
      expect(mount).toHaveBeenCalledWith('#app');
      expect(triggerLaunchUpdateCheck).not.toHaveBeenCalled();

      await vi.runAllTimersAsync();

      expect(triggerLaunchUpdateCheck).toHaveBeenCalledTimes(1);
    } finally {
      vi.useRealTimers();
    }
  });
});
