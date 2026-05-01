import { fileURLToPath, URL } from 'node:url';
import { execFileSync } from 'node:child_process';
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

type GitCommitCountReader = () => string;

function normalizeGitCommitCount(value: string): string {
  const commitCount = value.trim();
  return /^\d+$/.test(commitCount) ? commitCount : '0';
}

export function resolveGitCommitCount(
  readCommitCount: GitCommitCountReader = () =>
    execFileSync('git', ['rev-list', '--count', 'HEAD'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    })
): string {
  try {
    return normalizeGitCommitCount(readCommitCount());
  } catch {
    return '0';
  }
}

export function formatAppVersion(packageVersion: string, gitCommitCount: string): string {
  return `${packageVersion}+${normalizeGitCommitCount(gitCommitCount)}`;
}

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
  const appVersion = formatAppVersion(pkg.version, resolveGitCommitCount());

  return {
    base: appBasePath,
    define: {
      __APP_VERSION__: JSON.stringify(appVersion)
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
