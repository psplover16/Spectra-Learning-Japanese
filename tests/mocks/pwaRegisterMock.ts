import { vi } from 'vitest';

export interface PwaRegisterCallbacks {
  onNeedRefresh?: () => void;
  onOfflineReady?: () => void;
  onRegisteredSW?: (swUrl: string, registration: ServiceWorkerRegistration | undefined) => void;
}

const registrationUpdate = vi.fn<() => Promise<void>>(async () => undefined);

export const pwaRegisterMock = {
  callbacks: {} as PwaRegisterCallbacks,
  deferRegistration: false,
  registration: {
    update: registrationUpdate
  } as ServiceWorkerRegistration & { update: typeof registrationUpdate },
  updateServiceWorker: vi.fn(async () => {})
};

export function registerSW(callbacks?: PwaRegisterCallbacks) {
  pwaRegisterMock.callbacks = callbacks ?? {};

  if (!pwaRegisterMock.deferRegistration) {
    pwaRegisterMock.callbacks.onRegisteredSW?.('/sw.js', pwaRegisterMock.registration);
  }

  return pwaRegisterMock.updateServiceWorker;
}
