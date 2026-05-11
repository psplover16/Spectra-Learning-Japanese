import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';

import {
  __resetWarnOnce,
  clearMarks,
  putMarks,
  readAllMarks,
  type VocabularyMarkRecord
} from '@/modules/vocabulary/storage/vocabularyMarksDb';

beforeEach(() => {
  // Fresh in-memory database per test
  globalThis.indexedDB = new IDBFactory();
  __resetWarnOnce();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('vocabularyMarksDb happy path', () => {
  it('returns an empty array when the marks store is empty', async () => {
    const result = await readAllMarks();
    expect(result).toEqual([]);
  });

  it('returns the records written via putMarks in subsequent reads', async () => {
    const records: VocabularyMarkRecord[] = [
      { id: 'おい|' },
      { id: '会う|あう' }
    ];
    await putMarks(records);

    const read = await readAllMarks();
    // JS string sort is codepoint-based: hiragana (お U+304A) precedes CJK (会 U+4F1A)
    expect(read.map((r) => r.id).sort()).toEqual(['おい|', '会う|あう']);
  });

  it('returns an empty array after clearMarks wipes all records', async () => {
    await putMarks([{ id: 'おい|' }, { id: '会う|あう' }]);
    await clearMarks();

    const read = await readAllMarks();
    expect(read).toEqual([]);
  });
});

describe('vocabularyMarksDb degraded path (IndexedDB unavailable)', () => {
  beforeEach(() => {
    // Simulate IndexedDB unavailable
    (globalThis as { indexedDB: unknown }).indexedDB = undefined;
    __resetWarnOnce();
  });

  it('readAllMarks returns [] and warns once when IndexedDB is undefined', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const first = await readAllMarks();
    const second = await readAllMarks();

    expect(first).toEqual([]);
    expect(second).toEqual([]);
    expect(warnSpy).toHaveBeenCalledTimes(1);
  });

  it('putMarks is a no-op (does not throw) when IndexedDB is undefined', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    await expect(putMarks([{ id: 'おい|' }])).resolves.toBeUndefined();
  });

  it('does not warn again on subsequent calls after the first failure', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    await readAllMarks();
    await putMarks([{ id: 'おい|' }]);
    await clearMarks();
    expect(warnSpy).toHaveBeenCalledTimes(1);
  });
});
