import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('constitution compliance guardrails', () => {
  it('keeps the architecture document aligned with the current Spectra repo layout', async () => {
    const architectureDoc = await readFile('PROJECT_ARCHITECTURE.md', 'utf8');

    expect(architectureDoc).toContain('├─ .agents/');
    expect(architectureDoc).toContain('├─ .claude/');
    expect(architectureDoc).toContain('├─ .spectra/');
    expect(architectureDoc).toContain('├─ openspec/');
    expect(architectureDoc).not.toMatch(/^├─ \.codex\/.*$/m);
    expect(architectureDoc).not.toMatch(/^├─ \.specify\/.*$/m);
    expect(architectureDoc).not.toContain('specs/ (每個功能需求的規格資料夾)');
    expect(architectureDoc).not.toContain('## specs / .specify / scripts 的角色');
  });

  it('documents the Vite build chunk warning budget in project config', async () => {
    const viteConfig = await readFile('vite.config.ts', 'utf8');

    expect(viteConfig).toMatch(/chunkSizeWarningLimit:\s*500/);
  });

  it('lazy-loads primary route views to stay under the build chunk warning budget', async () => {
    const routerSource = await readFile('src/app/router.ts', 'utf8');
    const routePreloadSource = await readFile('src/app/routePreload.ts', 'utf8');

    expect(routerSource).not.toMatch(/^import \w+View from '@\/modules\/.*\/views\/.*\.vue';$/m);
    expect(routerSource).toContain("component: routeComponentLoaders['/practice']");
    expect(routerSource).toContain("component: routeComponentLoaders['/vocabulary']");
    expect(routePreloadSource).toContain("'/practice': () => import('@/modules/practice/views/PracticeView.vue')");
    expect(routePreloadSource).toContain("'/grammar': () => import('@/modules/grammar/views/GrammarView.vue')");
    expect(routePreloadSource).toContain("'/vocabulary': () => import('@/modules/vocabulary/views/VocabularyView.vue')");
    expect(routePreloadSource).toContain("'/n5-grammar': () => import('@/modules/n5Grammar/views/N5GrammarView.vue')");
  });
});
