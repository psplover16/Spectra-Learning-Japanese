import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const guardedTextFiles = [
  '.spectra.yaml',
  'openspec/config.yaml',
  'README.md',
  'PROJECT_ARCHITECTURE.md',
  '.editorconfig',
  'scripts/Use-ProjectUtf8.ps1',
  'scripts/Invoke-SpectraUtf8.ps1'
];

function decodeStrictUtf8(bytes: Uint8Array) {
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}

function hasUtf8Bom(bytes: Uint8Array) {
  return bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf;
}

describe('project encoding guardrails', () => {
  it.each(guardedTextFiles)('keeps %s as strict UTF-8 without BOM', async (filePath) => {
    const bytes = await readFile(filePath);
    const text = decodeStrictUtf8(bytes);

    expect(hasUtf8Bom(bytes)).toBe(false);
    expect(text).not.toContain('\u{fffd}');
    expect(text).not.toContain('\u{feff}');
  });

  it('declares editor charset as UTF-8 without BOM', async () => {
    const editorConfig = await readFile('.editorconfig', 'utf8');

    expect(editorConfig).toContain('charset = utf-8');
    expect(editorConfig).not.toContain('utf-8-bom');
  });

  it('provides a project-local PowerShell UTF-8 setup for Spectra usage', async () => {
    const setupScript = await readFile('scripts/Use-ProjectUtf8.ps1', 'utf8');
    const wrapperScript = await readFile('scripts/Invoke-SpectraUtf8.ps1', 'utf8');

    expect(setupScript).toContain('UTF8Encoding');
    expect(setupScript).toContain('chcp.com 65001');
    expect(setupScript).toContain("Get-Content:Encoding");
    expect(setupScript).not.toContain("Set-Content:Encoding");
    expect(wrapperScript).toContain('Use-ProjectUtf8.ps1');
    expect(wrapperScript).toContain('Get-Command');
    expect(wrapperScript).toContain('spectra');
  });

  it('exposes Spectra commands through the UTF-8 wrapper', async () => {
    const packageJson = JSON.parse(await readFile('package.json', 'utf8')) as {
      scripts?: Record<string, string>;
    };
    const scripts = packageJson.scripts ?? {};

    expect(scripts.spectra).toContain('Invoke-SpectraUtf8.ps1');
    expect(scripts['spectra:analyze']).toBe('npm run spectra -- analyze');
    expect(scripts['spectra:validate']).toBe('npm run spectra -- validate');
  });
});
