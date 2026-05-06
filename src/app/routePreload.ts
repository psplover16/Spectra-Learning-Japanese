import type { Component } from 'vue';

export type PrimaryRoutePath =
  | '/practice'
  | '/grammar'
  | '/vocabulary'
  | '/n1-grammar'
  | '/n2-grammar'
  | '/n3-grammar'
  | '/n4-grammar'
  | '/n5-grammar';

export type RouteComponentModule = { default: Component };
export type RouteComponentLoader = () => Promise<RouteComponentModule>;
export type RoutePreloadLoader = () => Promise<unknown>;

export const primaryRoutePaths = [
  '/practice',
  '/grammar',
  '/vocabulary',
  '/n1-grammar',
  '/n2-grammar',
  '/n3-grammar',
  '/n4-grammar',
  '/n5-grammar'
] as const satisfies readonly PrimaryRoutePath[];

export const routeComponentLoaders: Record<PrimaryRoutePath, RouteComponentLoader> = {
  '/practice': () => import('@/modules/practice/views/PracticeView.vue'),
  '/grammar': () => import('@/modules/grammar/views/GrammarView.vue'),
  '/vocabulary': () => import('@/modules/vocabulary/views/VocabularyView.vue'),
  '/n1-grammar': () => import('@/modules/grammar/views/N1GrammarView.vue'),
  '/n2-grammar': () => import('@/modules/grammar/views/N2GrammarView.vue'),
  '/n3-grammar': () => import('@/modules/grammar/views/N3GrammarView.vue'),
  '/n4-grammar': () => import('@/modules/grammar/views/N4GrammarView.vue'),
  '/n5-grammar': () => import('@/modules/n5Grammar/views/N5GrammarView.vue')
};

export interface RoutePreloadRegistry {
  preload: (path: string) => Promise<void>;
  preloadMany: (paths: readonly string[]) => Promise<void>;
  isLoaded: (path: string) => boolean;
  isLoading: (path: string) => boolean;
}

export function createRoutePreloadRegistry(loaders: Record<string, RoutePreloadLoader>): RoutePreloadRegistry {
  const loadedRoutes = new Set<string>();
  const loadingRoutes = new Map<string, Promise<void>>();

  function preload(path: string): Promise<void> {
    if (loadedRoutes.has(path)) {
      return Promise.resolve();
    }

    const pendingPreload = loadingRoutes.get(path);
    if (pendingPreload) {
      return pendingPreload;
    }

    const loader = loaders[path];
    if (!loader) {
      return Promise.resolve();
    }

    const preloadPromise = loader()
      .then(() => {
        loadedRoutes.add(path);
      })
      .finally(() => {
        loadingRoutes.delete(path);
      });

    loadingRoutes.set(path, preloadPromise);
    return preloadPromise;
  }

  return {
    preload,
    preloadMany: async (paths) => {
      await Promise.all(paths.map((path) => preload(path)));
    },
    isLoaded: (path) => loadedRoutes.has(path),
    isLoading: (path) => loadingRoutes.has(path)
  };
}

const routePreloadRegistry = createRoutePreloadRegistry(routeComponentLoaders);
let idlePreloadScheduled = false;

export function preloadRouteComponent(path: string): Promise<void> {
  return routePreloadRegistry.preload(path);
}

export function preloadPrimaryRouteComponents(paths: readonly string[] = primaryRoutePaths): Promise<void> {
  return routePreloadRegistry.preloadMany(paths);
}

export function preloadPrimaryRouteComponentsOnIdle(): void {
  if (idlePreloadScheduled || typeof window === 'undefined') {
    return;
  }

  idlePreloadScheduled = true;
  const currentWindow = window as Window & typeof globalThis & {
    requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
  };
  const pathsToPreload = primaryRoutePaths.filter((path) => path !== '/practice');
  const preload = () => {
    void preloadPrimaryRouteComponents(pathsToPreload);
  };

  if (typeof currentWindow.requestIdleCallback === 'function') {
    currentWindow.requestIdleCallback(preload, { timeout: 2_000 });
    return;
  }

  currentWindow.setTimeout(preload, 500);
}
