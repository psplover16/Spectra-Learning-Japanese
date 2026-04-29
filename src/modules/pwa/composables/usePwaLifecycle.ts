import { onMounted } from 'vue';
import { createPwaLifecycleService } from '@/modules/pwa/services/pwaLifecycleService';

export function usePwaLifecycle() {
  const service = createPwaLifecycleService();

  onMounted(() => {
    service.register();
  });

  return service;
}
