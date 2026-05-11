import { createApp } from 'vue';
import AppShell from '@/app/AppShell.vue';
import router from '@/app/router';
import { triggerLaunchUpdateCheck } from '@/modules/pwa/composables/usePwaLifecycle';
import { migrateMarksFromLocalStorage } from '@/modules/vocabulary/storage/vocabularyMarksMigration';
import { prefetchVocabularyMarks } from '@/modules/vocabulary/storage/vocabularyMarksStorage';
import '@/styles/main.css';

createApp(AppShell).use(router).mount('#app');

// Best-effort vocabulary marks bootstrap: kick off localStorage → IndexedDB
// migration (idempotent if already done) and warm the IndexedDB connection so
// the first read inside the vocabulary view returns faster. Both run after
// mount, before any idle-scheduled work, and never block the app on failure.
void migrateMarksFromLocalStorage().catch((error) => {
  // eslint-disable-next-line no-console
  console.warn('[main] vocabulary marks migration failed:', error);
});
void prefetchVocabularyMarks().catch((error) => {
  // eslint-disable-next-line no-console
  console.warn('[main] vocabulary marks prefetch failed:', error);
});

const scheduleIdle =
  typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function'
    ? window.requestIdleCallback.bind(window)
    : (callback: IdleRequestCallback): number => window.setTimeout(callback, 0);

scheduleIdle(() => {
  void triggerLaunchUpdateCheck();
});
