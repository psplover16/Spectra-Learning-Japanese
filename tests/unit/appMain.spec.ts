import { beforeEach, describe, expect, it, vi } from 'vitest';

const mount = vi.fn();
const use = vi.fn(() => ({ mount }));
const createApp = vi.fn(() => ({ use }));
const triggerLaunchUpdateCheck = vi.fn(async () => undefined);
const migrateMarksFromLocalStorage = vi.fn(async () => undefined);
const prefetchVocabularyMarks = vi.fn(async () => undefined);

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

vi.mock('@/modules/vocabulary/storage/vocabularyMarksMigration', () => ({
  migrateMarksFromLocalStorage
}));

vi.mock('@/modules/vocabulary/storage/vocabularyMarksStorage', () => ({
  prefetchVocabularyMarks
}));

describe('app main bootstrap', () => {
  beforeEach(() => {
    vi.resetModules();
    createApp.mockClear();
    use.mockClear();
    mount.mockClear();
    triggerLaunchUpdateCheck.mockClear();
    migrateMarksFromLocalStorage.mockClear();
    prefetchVocabularyMarks.mockClear();
    migrateMarksFromLocalStorage.mockImplementation(async () => undefined);
    prefetchVocabularyMarks.mockImplementation(async () => undefined);
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

  it('掛載後立即觸發 vocabulary marks migration 與 prefetch 各一次', async () => {
    await import('@/app/main');

    expect(mount).toHaveBeenCalledWith('#app');
    // Both bootstrap calls fire synchronously right after mount, before idle.
    expect(migrateMarksFromLocalStorage).toHaveBeenCalledTimes(1);
    expect(prefetchVocabularyMarks).toHaveBeenCalledTimes(1);
  });

  it('marks migration 失敗時不阻擋 app render，只 console.warn 一次', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    migrateMarksFromLocalStorage.mockRejectedValueOnce(new Error('boom'));

    await import('@/app/main');
    // Allow the rejection handler microtask to flush
    await Promise.resolve();
    await Promise.resolve();

    expect(mount).toHaveBeenCalledWith('#app');
    expect(warnSpy).toHaveBeenCalledWith(
      '[main] vocabulary marks migration failed:',
      expect.any(Error)
    );
  });

  it('marks prefetch 失敗時不阻擋 app render，只 console.warn 一次', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    prefetchVocabularyMarks.mockRejectedValueOnce(new Error('boom'));

    await import('@/app/main');
    await Promise.resolve();
    await Promise.resolve();

    expect(mount).toHaveBeenCalledWith('#app');
    expect(warnSpy).toHaveBeenCalledWith(
      '[main] vocabulary marks prefetch failed:',
      expect.any(Error)
    );
  });

  it('二次啟動時 migration 與 prefetch 仍各被呼叫一次（migration 內部對 IndexedDB 非空時 no-op）', async () => {
    // First boot
    await import('@/app/main');
    expect(migrateMarksFromLocalStorage).toHaveBeenCalledTimes(1);
    expect(prefetchVocabularyMarks).toHaveBeenCalledTimes(1);

    // Simulate a second boot (e.g., reload). Reset modules so import re-evaluates.
    vi.resetModules();
    migrateMarksFromLocalStorage.mockClear();
    prefetchVocabularyMarks.mockClear();

    await import('@/app/main');

    expect(migrateMarksFromLocalStorage).toHaveBeenCalledTimes(1);
    expect(prefetchVocabularyMarks).toHaveBeenCalledTimes(1);
  });
});
