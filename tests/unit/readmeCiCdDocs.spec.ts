import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('README CI/CD documentation', () => {
  it('documents local validation, workflow triggers, Pages targets, and branch protection', async () => {
    const readme = await readFile('README.md', 'utf8');

    expect(readme).toContain('npm run lint');
    expect(readme).toContain('npm run typecheck');
    expect(readme).toContain('npm run test:unit');
    expect(readme).toContain('npm run build');
    expect(readme).toContain('npm run test:e2e');
    expect(readme).toContain('pull_request');
    expect(readme).toContain('push');
    expect(readme).toContain('排除 `gh-pages`');
    expect(readme).toContain('`dev` push：部署到 staging');
    expect(readme).toContain('`main` push：部署到 production');
    expect(readme).toContain('https://psplover16.github.io/Spectra-Learning-Japanese/staging/');
    expect(readme).toContain('https://psplover16.github.io/Spectra-Learning-Japanese/');
    expect(readme).toContain('發佈來源使用 `gh-pages` branch');
    expect(readme).toContain('branch protection');
    expect(readme).toContain('禁止直接 push 到 `main`');
    expect(readme).toContain('CI 通過後才能 merge');
  });
});
