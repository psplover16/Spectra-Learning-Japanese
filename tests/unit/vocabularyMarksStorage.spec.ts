import { afterEach, describe, expect, it } from 'vitest';
import {
  clearVocabularyMarksSnapshot,
  readVocabularyMarksSnapshot,
  vocabularyMarksStorageKey,
  writeVocabularyMarksSnapshot
} from '@/modules/vocabulary/storage/vocabularyMarksStorage';

describe('vocabulary marks storage', () => {
  afterEach(() => {
    clearVocabularyMarksSnapshot();
  });

  it('可讀寫合法註記資料', () => {
    const snapshot = {
      version: 1 as const,
      markedIds: [1, 3, 5],
      updatedAt: '2026-04-02T00:00:00.000Z'
    };

    expect(writeVocabularyMarksSnapshot(snapshot)).toBe(true);
    expect(readVocabularyMarksSnapshot()).toEqual(snapshot);
  });

  it('遇到格式錯誤的資料會自動清除', () => {
    window.localStorage.setItem(vocabularyMarksStorageKey, JSON.stringify({ version: 1, markedIds: ['bad'], updatedAt: '' }));

    expect(readVocabularyMarksSnapshot()).toBeNull();
    expect(window.localStorage.getItem(vocabularyMarksStorageKey)).toBeNull();
  });
});
