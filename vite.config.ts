import { fileURLToPath, URL } from 'node:url';
import { createRequire } from 'node:module';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';
import {
  faviconFileName,
  pwaIconDescriptors,
  pwaIconFileNames
} from './src/shared/config/publicAssets';

const require = createRequire(import.meta.url);
const pkg = require('./package.json') as { version: string };

function normalizeBasePath(value: string | undefined): string {
  const rawValue = value?.trim() || '/';

  if (rawValue === '/') {
    return '/';
  }

  const withLeadingSlash = rawValue.startsWith('/') ? rawValue : `/${rawValue}`;
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`;
}

function normalizeStartUrl(value: string | undefined, fallback: string): string {
  const rawValue = value?.trim();

  if (!rawValue) {
    return fallback;
  }

  if (/^https?:\/\//.test(rawValue)) {
    return rawValue;
  }

  return normalizeBasePath(rawValue);
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const appBasePath = normalizeBasePath(env.VITE_APP_BASE_PATH);
  const appStartUrl = normalizeStartUrl(env.VITE_APP_START_URL, appBasePath);

  return {
    base: appBasePath,
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version)
    },
    build: {
      chunkSizeWarningLimit: 500
    },
    plugins: [
      vue(),
      VitePWA({
        registerType: 'prompt',
        includeAssets: [faviconFileName, ...pwaIconFileNames],
        manifest: {
          name: 'Duotify 日語學習 PWA',
          short_name: 'Duotify',
          start_url: appStartUrl,
          display: 'standalone',
          background_color: '#f6f0e8',
          theme_color: '#b45a32',
          icons: pwaIconDescriptors.map((icon) => ({
            ...icon,
            src: `${appBasePath}${icon.src}`
          }))
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,json}']
        }
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  };
});
