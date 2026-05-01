// 把 Vite 內建提供的型別載進來(但僅加載有的型別)，import.meta.env.BASE_URL 是 Vite 內建的，
/// <reference types="vite/client" />

// 在 import.meta.env 裡，除了 Vite 原本內建的變數外，還有我們自己定義的變數，這裡把它們的型別定義出來
interface ImportMetaEnv {
  readonly VITE_APP_BASE_PATH?: string;
  readonly VITE_APP_START_URL?: string;
}
// declaration merging 概念，讓 import.meta.env 同時具有 Vite 內建的型別和我們自己定義的型別
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Build-time app version string injected by Vite, for example "0.0.1+36".
declare const __APP_VERSION__: string | undefined;

declare module 'virtual:pwa-register' {
  export function registerSW(options?: {
    immediate?: boolean;
    onNeedRefresh?: () => void;
    onOfflineReady?: () => void;
    onRegisteredSW?: (swUrl: string, registration: ServiceWorkerRegistration | undefined) => void;
  }): (reloadPage?: boolean) => Promise<void>;
}
