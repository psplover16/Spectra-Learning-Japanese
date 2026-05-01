import { afterEach, describe, expect, it, vi } from 'vitest';

async function loadAppVersion() {
  vi.resetModules();
  return import('@/shared/version/appVersion');
}

describe('appVersion', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('讀取 build-time 注入的應用版本', async () => {
    vi.stubGlobal('__APP_VERSION__', '0.0.1+36');

    const { appVersion } = await loadAppVersion();

    expect(appVersion).toBe('0.0.1+36');
  });

  it('未注入版本時回到開發 fallback', async () => {
    const { appVersion } = await loadAppVersion();

    expect(appVersion).toBe('0.0.0-dev');
  });
});
