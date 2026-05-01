// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { formatAppVersion, resolveGitCommitCount } from '../../vite.config';

describe('vite app version helpers', () => {
  it('formats package version with numeric git commit count', () => {
    expect(formatAppVersion('0.0.1', '36')).toBe('0.0.1+36');
    expect(formatAppVersion('0.0.1', ' 37\n')).toBe('0.0.1+37');
  });

  it('falls back to zero when git commit count is unavailable or invalid', () => {
    expect(formatAppVersion('0.0.1', '')).toBe('0.0.1+0');
    expect(formatAppVersion('0.0.1', 'not-a-number')).toBe('0.0.1+0');
    expect(resolveGitCommitCount(() => {
      throw new Error('git unavailable');
    })).toBe('0');
  });
});
