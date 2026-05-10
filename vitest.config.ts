import { fileURLToPath, URL } from 'node:url';
import { configDefaults, defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import Icons from 'unplugin-icons/vite';

export default defineConfig({
  plugins: [vue(), Icons({ compiler: 'vue3' })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'virtual:pwa-register': fileURLToPath(new URL('./tests/mocks/pwaRegisterMock.ts', import.meta.url))
    }
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    css: true,
    exclude: [...configDefaults.exclude, 'tests/e2e/**']
  }
});
