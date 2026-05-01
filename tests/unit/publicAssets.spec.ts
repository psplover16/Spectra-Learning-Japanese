// @vitest-environment node
import { access, mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { build, resolveConfig } from 'vite';

import {
  faviconFileName,
  publicAssetFileNames,
  pwaIconFileNames
} from '@/shared/config/publicAssets';

const repoRoot = resolve(__dirname, '..', '..');
const viteConfigPath = resolve(repoRoot, 'vite.config.ts');
const standardPublicAssetSourceDir = 'public';
const privatePublicAssetReferenceDir = '_private/_private_fileAssets/v1/public';

function toRepoPath(relativePath: string): string {
  return join(repoRoot, ...relativePath.split('/'));
}

function normalizePathForAssertion(path: string): string {
  return path.replaceAll('\\', '/');
}

async function expectRepoFileExists(relativePath: string): Promise<void> {
  await expect(access(toRepoPath(relativePath))).resolves.toBeUndefined();
}

async function withBasePath<T>(basePath: string | undefined, run: () => Promise<T>): Promise<T> {
  const previousBasePath = process.env.VITE_APP_BASE_PATH;

  if (basePath === undefined) {
    delete process.env.VITE_APP_BASE_PATH;
  } else {
    process.env.VITE_APP_BASE_PATH = basePath;
  }

  try {
    return await run();
  } finally {
    if (previousBasePath === undefined) {
      delete process.env.VITE_APP_BASE_PATH;
    } else {
      process.env.VITE_APP_BASE_PATH = previousBasePath;
    }
  }
}

async function loadResolvedProjectConfig(basePath?: string) {
  return withBasePath(basePath, async () =>
    resolveConfig(
      {
      configFile: viteConfigPath,
      root: repoRoot,
      mode: 'test'
      },
      'build'
    )
  );
}

async function buildIntoTempDir(basePath?: string): Promise<string> {
  const outDir = await mkdtemp(join(tmpdir(), 'duotify-public-assets-'));

  await withBasePath(basePath, async () => {
    await build({
      configFile: viteConfigPath,
      root: repoRoot,
      mode: 'test',
      logLevel: 'silent',
      build: {
        outDir,
        emptyOutDir: true
      }
    });
  });

  return outDir;
}

async function readBuiltFile(outDir: string, relativePath: string): Promise<string> {
  return readFile(join(outDir, ...relativePath.split('/')), 'utf8');
}

describe('public asset configuration', () => {
  let buildOutDir = '';
  let stagingBuildOutDir = '';
  const productionBasePath = '/Spectra-Learning-Japanese/';
  const stagingBasePath = '/Spectra-Learning-Japanese/staging/';

  beforeAll(async () => {
    buildOutDir = await buildIntoTempDir(productionBasePath);
    stagingBuildOutDir = await buildIntoTempDir(stagingBasePath);
  }, 120000);

  afterAll(async () => {
    if (buildOutDir) {
      await rm(buildOutDir, { recursive: true, force: true });
    }
    if (stagingBuildOutDir) {
      await rm(stagingBuildOutDir, { recursive: true, force: true });
    }
  });

  it('正式公開資產來源指向根目錄 public，而不是私人參考目錄', async () => {
    const projectConfig = await loadResolvedProjectConfig();

    expect(normalizePathForAssertion(projectConfig.publicDir)).toBe(normalizePathForAssertion(toRepoPath(standardPublicAssetSourceDir)));
    expect(normalizePathForAssertion(projectConfig.publicDir)).not.toBe(normalizePathForAssertion(toRepoPath(privatePublicAssetReferenceDir)));
  });

  it('必要 favicon 與 PWA icon 檔案都存在於根目錄 public', async () => {
    for (const assetFileName of publicAssetFileNames) {
      await expectRepoFileExists(`${standardPublicAssetSourceDir}/${assetFileName}`);
    }
  });

  it('建置後首頁會引用 favicon，且實際輸出 icon 產物', async () => {
    const builtHtml = await readBuiltFile(buildOutDir, 'index.html');

    expect(builtHtml).toMatch(/rel="icon"/);
    expect(builtHtml).toContain(`href="${productionBasePath}${faviconFileName}"`);

    await expect(access(join(buildOutDir, faviconFileName))).resolves.toBeUndefined();

    for (const iconFileName of pwaIconFileNames) {
      await expect(access(join(buildOutDir, ...iconFileName.split('/')))).resolves.toBeUndefined();
    }
  });

  it('建置後 manifest 只引用可發布的 PWA icon 路徑', async () => {
    const manifestContent = await readBuiltFile(buildOutDir, 'manifest.webmanifest');
    const manifest = JSON.parse(manifestContent) as {
      start_url?: string;
      icons?: Array<{ src: string }>;
    };

    expect(manifest.start_url).toBe(productionBasePath);
    expect(manifest.icons?.map((icon) => icon.src)).toEqual(
      expect.arrayContaining(pwaIconFileNames.map((icon) => `${productionBasePath}${icon}`))
    );
    expect(manifestContent).not.toContain(privatePublicAssetReferenceDir);
  });

  it('子路徑建置時首頁與 manifest 仍引用可公開存取的 icon 路徑', async () => {
    const builtHtml = await readBuiltFile(stagingBuildOutDir, 'index.html');
    const manifestContent = await readBuiltFile(stagingBuildOutDir, 'manifest.webmanifest');
    const manifest = JSON.parse(manifestContent) as {
      start_url?: string;
      icons?: Array<{ src: string }>;
    };

    expect(builtHtml).toContain(`href="${stagingBasePath}${faviconFileName}"`);
    expect(manifest.start_url).toBe(stagingBasePath);
    expect(manifest.icons?.map((icon) => icon.src)).toEqual(
      expect.arrayContaining(pwaIconFileNames.map((icon) => `${stagingBasePath}${icon}`))
    );
    expect(manifestContent).not.toContain(privatePublicAssetReferenceDir);
  });

  it('建置後的 source 會包含 package metadata 注入的應用版本', async () => {
    const packageJson = JSON.parse(await readFile(toRepoPath('package.json'), 'utf8')) as { version: string };
    const builtAssetNames = await readdir(join(buildOutDir, 'assets'));
    const builtJavaScriptSources = await Promise.all(
      builtAssetNames
        .filter((assetName) => assetName.endsWith('.js'))
        .map((assetName) => readBuiltFile(buildOutDir, `assets/${assetName}`))
    );

    expect(builtJavaScriptSources.join('\n')).toContain(packageJson.version);
  });
});
