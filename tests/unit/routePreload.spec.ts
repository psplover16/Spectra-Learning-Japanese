import { describe, expect, it } from 'vitest';
import { createRoutePreloadRegistry } from '@/app/routePreload';

describe('route preload registry', () => {
  it('reuses pending and completed preload work for the same route', async () => {
    let loadCount = 0;
    let resolveLoader: () => void = () => {
      throw new Error('loader was not started');
    };
    const registry = createRoutePreloadRegistry({
      '/vocabulary': () => {
        loadCount += 1;
        return new Promise<void>((resolve) => {
          resolveLoader = resolve;
        });
      }
    });

    const firstPreload = registry.preload('/vocabulary');
    const secondPreload = registry.preload('/vocabulary');

    expect(firstPreload).toBe(secondPreload);
    expect(loadCount).toBe(1);

    resolveLoader();
    await firstPreload;

    await registry.preload('/vocabulary');

    expect(loadCount).toBe(1);
  });

  it('ignores unknown routes without calling a loader', async () => {
    let loadCount = 0;
    const registry = createRoutePreloadRegistry({
      '/practice': async () => {
        loadCount += 1;
      }
    });

    await registry.preload('/unknown');

    expect(loadCount).toBe(0);
  });
});
