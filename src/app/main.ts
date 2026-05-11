import { createApp } from 'vue';
import AppShell from '@/app/AppShell.vue';
import router from '@/app/router';
import { triggerLaunchUpdateCheck } from '@/modules/pwa/composables/usePwaLifecycle';
import '@/styles/main.css';

createApp(AppShell).use(router).mount('#app');

const scheduleIdle =
  typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function'
    ? window.requestIdleCallback.bind(window)
    : (callback: IdleRequestCallback): number => window.setTimeout(callback, 0);

scheduleIdle(() => {
  void triggerLaunchUpdateCheck();
});
