import { describe, expect, it } from 'vitest';
import jpWords_N1 from '@/modules/vocabulary/data/jpWords_N1';
import jpWords_N2 from '@/modules/vocabulary/data/jpWords_N2';
import jpWords_N3 from '@/modules/vocabulary/data/jpWords_N3';
import jpWords_N4 from '@/modules/vocabulary/data/jpWords_N4';
import jpWords_N5 from '@/modules/vocabulary/data/jpWords_N5';

/**
 * Regression guard for the tuple-format conversion of the vocabulary data files.
 *
 * The snapshot is captured ONCE while the data files are still in their original
 * object-array form. After each `jpWords_N*.ts` is converted to the compact
 * tuple+mapper form, this test re-runs and must produce an identical snapshot.
 *
 * If any tuple's positional order is rotated (e.g. romanization swapped with
 * kanji), the snapshot will diverge and the test will fail loudly.
 */
describe('jpWords_N* tuple regression', () => {
  it('N1 default export matches baseline snapshot', () => {
    expect(jpWords_N1).toMatchSnapshot();
  });

  it('N2 default export matches baseline snapshot', () => {
    expect(jpWords_N2).toMatchSnapshot();
  });

  it('N3 default export matches baseline snapshot', () => {
    expect(jpWords_N3).toMatchSnapshot();
  });

  it('N4 default export matches baseline snapshot', () => {
    expect(jpWords_N4).toMatchSnapshot();
  });

  it('N5 default export matches baseline snapshot', () => {
    expect(jpWords_N5).toMatchSnapshot();
  });

  it('each level export has its expected stage attached', () => {
    expect(jpWords_N1.every((entry) => entry.stage === 'N1')).toBe(true);
    expect(jpWords_N2.every((entry) => entry.stage === 'N2')).toBe(true);
    expect(jpWords_N3.every((entry) => entry.stage === 'N3')).toBe(true);
    expect(jpWords_N4.every((entry) => entry.stage === 'N4')).toBe(true);
    expect(jpWords_N5.every((entry) => entry.stage === 'N5')).toBe(true);
  });
});
