import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  formatNoPublishChangesMessage,
  formatPublishSummary,
  syncPublishedSite
} from '../../scripts/publishPages.mjs';

async function writeTextFile(filePath: string, content: string) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, content, 'utf8');
}

async function createWorkspace() {
  const root = await mkdtemp(path.join(os.tmpdir(), 'publish-pages-'));
  const distPath = path.join(root, 'dist');
  const worktreeRoot = path.join(root, '.deploy-pages');

  await mkdir(distPath, { recursive: true });
  await mkdir(worktreeRoot, { recursive: true });
  await mkdir(path.join(worktreeRoot, '.git'), { recursive: true });

  return { root, distPath, worktreeRoot };
}

const cleanupRoots: string[] = [];

afterEach(async () => {
  await Promise.all(
    cleanupRoots.splice(0).map(async (root) => {
      await rm(root, { recursive: true, force: true });
    })
  );
});

describe('publishPages', () => {
  it('replaces production root content with dist output while preserving staging and CNAME', async () => {
    const workspace = await createWorkspace();
    cleanupRoots.push(workspace.root);

    await writeTextFile(path.join(workspace.distPath, 'index.html'), '<html><body>prod build</body></html>');
    await writeTextFile(path.join(workspace.distPath, 'assets', 'main.js'), 'console.log("prod");');
    await writeTextFile(path.join(workspace.worktreeRoot, 'index.html'), '<script src="/src/app/main.ts"></script>');
    await writeTextFile(path.join(workspace.worktreeRoot, 'README.md'), 'source repo file');
    await writeTextFile(path.join(workspace.worktreeRoot, 'src', 'app', 'main.ts'), 'console.log("source");');
    await writeTextFile(path.join(workspace.worktreeRoot, 'staging', 'index.html'), 'keep staging');
    await writeTextFile(path.join(workspace.worktreeRoot, 'CNAME'), 'example.com');

    const result = await syncPublishedSite({
      worktreeRoot: workspace.worktreeRoot,
      distPath: workspace.distPath,
      target: 'production'
    });

    const indexHtml = await readFile(path.join(workspace.worktreeRoot, 'index.html'), 'utf8');
    const stagingHtml = await readFile(path.join(workspace.worktreeRoot, 'staging', 'index.html'), 'utf8');

    expect(indexHtml).toContain('prod build');
    expect(stagingHtml).toContain('keep staging');
    expect(result.removedRootEntries).toContain('README.md');
    expect(result.removedRootEntries).toContain('src');
  });

  it('creates .nojekyll at the gh-pages root after publishing', async () => {
    const workspace = await createWorkspace();
    cleanupRoots.push(workspace.root);

    await writeTextFile(path.join(workspace.distPath, 'index.html'), '<html><body>prod build</body></html>');

    await syncPublishedSite({
      worktreeRoot: workspace.worktreeRoot,
      distPath: workspace.distPath,
      target: 'production'
    });

    await expect(readFile(path.join(workspace.worktreeRoot, '.nojekyll'), 'utf8')).resolves.toBe('');
  });

  it('keeps valid production root files when syncing staging content', async () => {
    const workspace = await createWorkspace();
    cleanupRoots.push(workspace.root);

    await writeTextFile(path.join(workspace.distPath, 'index.html'), '<html><body>staging build</body></html>');
    await writeTextFile(path.join(workspace.distPath, 'assets', 'main.js'), 'console.log("staging");');
    await writeTextFile(path.join(workspace.worktreeRoot, 'index.html'), '<html><body>production build</body></html>');
    await writeTextFile(path.join(workspace.worktreeRoot, 'assets', 'prod.js'), 'console.log("prod");');
    await writeTextFile(path.join(workspace.worktreeRoot, 'CNAME'), 'example.com');
    await writeTextFile(path.join(workspace.worktreeRoot, 'staging', 'old.txt'), 'old staging');

    await syncPublishedSite({
      worktreeRoot: workspace.worktreeRoot,
      distPath: workspace.distPath,
      target: 'staging'
    });

    const productionIndex = await readFile(path.join(workspace.worktreeRoot, 'index.html'), 'utf8');
    const stagingIndex = await readFile(path.join(workspace.worktreeRoot, 'staging', 'index.html'), 'utf8');
    const productionAsset = await readFile(path.join(workspace.worktreeRoot, 'assets', 'prod.js'), 'utf8');

    expect(productionIndex).toContain('production build');
    expect(stagingIndex).toContain('staging build');
    expect(productionAsset).toContain('prod');
  });

  it('removes unsafe source-root leftovers during staging-only publish', async () => {
    const workspace = await createWorkspace();
    cleanupRoots.push(workspace.root);

    await writeTextFile(path.join(workspace.distPath, 'index.html'), '<html><body>staging build</body></html>');
    await writeTextFile(path.join(workspace.distPath, 'assets', 'main.js'), 'console.log("staging");');
    await writeTextFile(path.join(workspace.worktreeRoot, 'index.html'), '<script type="module" src="/src/app/main.ts"></script>');
    await writeTextFile(path.join(workspace.worktreeRoot, 'package.json'), '{ "name": "bad-root" }');
    await writeTextFile(path.join(workspace.worktreeRoot, 'src', 'app', 'main.ts'), 'console.log("source");');

    const result = await syncPublishedSite({
      worktreeRoot: workspace.worktreeRoot,
      distPath: workspace.distPath,
      target: 'staging'
    });

    expect(result.removedRootEntries).toContain('index.html');
    expect(result.removedRootEntries).toContain('package.json');
    expect(result.removedRootEntries).toContain('src');
    expect(await readFile(path.join(workspace.worktreeRoot, 'staging', 'index.html'), 'utf8')).toContain(
      'staging build'
    );
  });

  it('formats readable operator messages and rejects unsupported targets', async () => {
    const workspace = await createWorkspace();
    cleanupRoots.push(workspace.root);

    await writeTextFile(path.join(workspace.distPath, 'index.html'), '<html><body>prod build</body></html>');

    const result = await syncPublishedSite({
      worktreeRoot: workspace.worktreeRoot,
      distPath: workspace.distPath,
      target: 'production'
    });

    expect(formatPublishSummary(result)).toContain('Prepared production publish content.');
    expect(formatNoPublishChangesMessage('staging')).toBe('No publish changes to commit for staging.');

    await expect(
      syncPublishedSite({
        worktreeRoot: workspace.worktreeRoot,
        distPath: workspace.distPath,
        target: 'qa'
      })
    ).rejects.toThrow('Unsupported publish target');
  });

  it('rejects missing or empty dist before changing the worktree', async () => {
    const workspace = await createWorkspace();
    cleanupRoots.push(workspace.root);

    await writeTextFile(path.join(workspace.worktreeRoot, 'index.html'), '<html><body>existing</body></html>');

    await expect(
      syncPublishedSite({
        worktreeRoot: workspace.worktreeRoot,
        distPath: path.join(workspace.root, 'missing-dist'),
        target: 'production'
      })
    ).rejects.toThrow('No build output found');

    await expect(readFile(path.join(workspace.worktreeRoot, 'index.html'), 'utf8')).resolves.toContain('existing');
  });
});
