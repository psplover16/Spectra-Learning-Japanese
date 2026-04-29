import { vi } from 'vitest';

export interface PwaRegisterCallbacks {
  onNeedRefresh?: () => void;
  onOfflineReady?: () => void;
}

export const pwaRegisterMock = {
  callbacks: {} as PwaRegisterCallbacks,
  updateServiceWorker: vi.fn(async () => {})
};

export function registerSW(callbacks?: PwaRegisterCallbacks) {
  pwaRegisterMock.callbacks = callbacks ?? {};
  return pwaRegisterMock.updateServiceWorker;
}
