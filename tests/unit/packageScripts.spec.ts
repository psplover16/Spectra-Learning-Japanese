import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

interface PackageJson {
  scripts?: Record<string, string>;
}

async function readPackageScripts() {
  const packageJson = JSON.parse(await readFile('package.json', 'utf8')) as PackageJson;
  return packageJson.scripts ?? {};
}

describe('package scripts', () => {
  it('exposes the validation phases used by CI', async () => {
    const scripts = await readPackageScripts();

    expect(scripts).toMatchObject({
      lint: expect.any(String),
      typecheck: expect.any(String),
      'test:unit': expect.any(String),
      build: expect.any(String),
      'test:e2e': expect.any(String),
      'test:ci': expect.any(String)
    });
  });

  it('runs test:ci in lint, typecheck, unit, build, e2e order', async () => {
    const scripts = await readPackageScripts();
    const ciScript = scripts['test:ci'] ?? '';

    const expectedOrder = [
      'npm run lint',
      'npm run typecheck',
      'npm run test:unit',
      'npm run build',
      'npm run test:e2e'
    ];

    const commandPositions = expectedOrder.map((command) => ciScript.indexOf(command));

    expect(commandPositions.every((position) => position >= 0)).toBe(true);
    expect(commandPositions).toEqual([...commandPositions].sort((left, right) => left - right));
  });
});
