import { createApp } from 'vue';
import AppShell from '@/app/AppShell.vue';
import router from '@/app/router';
import { triggerLaunchUpdateCheck } from '@/modules/pwa/composables/usePwaLifecycle';
import '@/styles/main.css';

createApp(AppShell).use(router).mount('#app');
void triggerLaunchUpdateCheck();
