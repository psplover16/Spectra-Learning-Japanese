import { afterEach, describe, expect, it } from 'vitest';
import {
  clearN5GrammarCompletionSnapshot,
  n5GrammarCompletionStorageKey,
  readCompletedN5GrammarSectionIds,
  readN5GrammarCompletionSnapshot,
  writeCompletedN5GrammarSectionIds,
  writeN5GrammarCompletionSnapshot
} from '@/modules/n5Grammar/storage/n5GrammarCompletionStorage';

describe('n5 grammar completion storage', () => {
  afterEach(() => {
    clearN5GrammarCompletionSnapshot();
  });

  it('writes and reads a versioned completion snapshot', () => {
    const snapshot = {
      version: 1 as const,
      completedSectionIds: ['sentence-basics', 'polite-overview'],
      updatedAt: '2026-04-30T00:00:00.000Z'
    };

    expect(writeN5GrammarCompletionSnapshot(snapshot)).toBe(true);
    expect(readN5GrammarCompletionSnapshot()).toEqual(snapshot);
  });

  it('writes completed section ids with a generated timestamp', () => {
    expect(writeCompletedN5GrammarSectionIds(['sentence-basics'], new Date('2026-04-30T01:00:00.000Z'))).toBe(true);

    expect(readCompletedN5GrammarSectionIds()).toEqual(['sentence-basics']);
    expect(readN5GrammarCompletionSnapshot()).toEqual({
      version: 1,
      completedSectionIds: ['sentence-basics'],
      updatedAt: '2026-04-30T01:00:00.000Z'
    });
  });

  it('returns an empty collection when no completion data exists', () => {
    expect(readN5GrammarCompletionSnapshot()).toBeNull();
    expect(readCompletedN5GrammarSectionIds()).toEqual([]);
  });

  it('clears invalid completion data', () => {
    window.localStorage.setItem(
      n5GrammarCompletionStorageKey,
      JSON.stringify({ version: 1, completedSectionIds: [1, 'sentence-basics'], updatedAt: '' })
    );

    expect(readN5GrammarCompletionSnapshot()).toBeNull();
    expect(readCompletedN5GrammarSectionIds()).toEqual([]);
    expect(window.localStorage.getItem(n5GrammarCompletionStorageKey)).toBeNull();
  });
});
