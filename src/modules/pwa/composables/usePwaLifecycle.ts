import { onMounted } from 'vue';
import { createPwaLifecycleService } from '@/modules/pwa/services/pwaLifecycleService';

const pwaLifecycleService = createPwaLifecycleService();

export function usePwaLifecycle() {
  onMounted(() => {
    pwaLifecycleService.register();
  });

  return pwaLifecycleService;
}

export function triggerLaunchUpdateCheck(): Promise<void> {
  return pwaLifecycleService.triggerLaunchUpdateCheck();
}
