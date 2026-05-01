import { access, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const repoRoot = process.cwd();

async function readWorkflow(name: string) {
  const workflowPath = join(repoRoot, '.github', 'workflows', name);
  await access(workflowPath);
  return readFile(workflowPath, 'utf8');
}

describe('GitHub Actions workflows', () => {
  it('CI validates pull requests and non-gh-pages pushes with the required npm phases', async () => {
    const workflow = await readWorkflow('ci.yml');

    expect(workflow).toContain('name: CI');
    expect(workflow).toMatch(/pull_request:\s*(?:\r?\n|$)/);
    expect(workflow).toMatch(/push:\s*\r?\n\s*branches-ignore:\s*\r?\n\s*-\s+gh-pages/);
    expect(workflow).toContain('runs-on: ubuntu-latest');
    expect(workflow).toContain('node-version: 22');
    expect(workflow).toContain('cache: npm');
    expect(workflow).toContain('npm ci');
    expect(workflow).toContain('npm run lint');
    expect(workflow).toContain('npm run typecheck');
    expect(workflow).toContain('npm run test:unit');
    expect(workflow).toContain('npm run build');
    expect(workflow).toContain('npx playwright install chromium');
    expect(workflow).toContain('npm run test:e2e');
  });

  it('CI uploads Playwright diagnostics only when e2e validation fails', async () => {
    const workflow = await readWorkflow('ci.yml');

    expect(workflow).toContain('if: failure()');
    expect(workflow).toContain('playwright-report/');
    expect(workflow).toContain('test-results/');
    expect(workflow).toContain('if-no-files-found: ignore');
  });

  it('CD deploys dev to staging and main to production with write permissions, concurrency, and full git history', async () => {
    const workflow = await readWorkflow('cd.yml');

    expect(workflow).toContain('name: CD');
    expect(workflow).toMatch(/push:\s*\r?\n\s*branches:\s*\r?\n\s*-\s+dev\s*\r?\n\s*-\s+main/);
    expect(workflow).toMatch(/contents:\s+write/);
    expect(workflow).toMatch(/concurrency:\s*\r?\n\s*group:\s*\$\{\{\s*github\.workflow\s*\}\}-\$\{\{\s*github\.ref\s*\}\}/);
    expect(workflow).toMatch(/uses:\s+actions\/checkout@v4\s*\r?\n\s*with:\s*\r?\n\s*fetch-depth:\s+0/);
    expect(workflow).toContain('node-version: 22');
    expect(workflow).toContain('npm ci');
    expect(workflow).toContain('PUBLISH_TARGET=production');
    expect(workflow).toContain('PUBLISH_TARGET=staging');
    expect(workflow).toContain('VITE_APP_BASE_PATH=/Spectra-Learning-Japanese/');
    expect(workflow).toContain('VITE_APP_BASE_PATH=/Spectra-Learning-Japanese/staging/');
    expect(workflow).toContain('npm run build');
    expect(workflow).toContain('scripts/publishPages.mjs');
    expect(workflow).toContain('git worktree add');
    expect(workflow).toMatch(/git(?:\s+-C\s+\S+)?\s+diff --cached --quiet/);
    expect(workflow).toMatch(/git(?:\s+-C\s+\S+)?\s+push origin gh-pages/);
  });
});
