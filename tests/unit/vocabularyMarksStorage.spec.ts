import { afterEach, describe, expect, it } from 'vitest';
import {
  clearVocabularyMarksSnapshot,
  pruneMarkedKeysAgainstDictionary,
  readVocabularyMarksSnapshot,
  vocabularyMarksStorageKey,
  writeVocabularyMarksSnapshot
} from '@/modules/vocabulary/storage/vocabularyMarksStorage';
import { normalizeVocabularyEntries } from '@/modules/vocabulary/utils/vocabularyFilters';

const dictionaryEntries = normalizeVocabularyEntries([
  { text: 'おい', romanization: 'o-i', kanji: '', meaning: '嘿', stage: 'N5' },
  { text: '会う', romanization: 'a-u', kanji: 'あう', meaning: '見面', stage: 'N5' }
]);

describe('vocabulary marks storage', () => {
  afterEach(() => {
    clearVocabularyMarksSnapshot();
  });

  it('以 text 與 kanji 組成 stable natural key 並儲存 version 2 註記資料', () => {
    expect(dictionaryEntries.map((entry) => entry.markKey)).toEqual(['おい|', '会う|あう']);

    const snapshot = {
      version: 2 as const,
      markedKeys: dictionaryEntries.map((entry) => entry.markKey),
      updatedAt: '2026-04-02T00:00:00.000Z'
    };

    expect(writeVocabularyMarksSnapshot(snapshot)).toBe(true);
    expect(readVocabularyMarksSnapshot(dictionaryEntries)).toEqual(snapshot);
    expect(JSON.parse(window.localStorage.getItem(vocabularyMarksStorageKey) ?? '{}')).not.toHaveProperty('markedIds');
  });

  it('遇到格式錯誤的資料會自動清除', () => {
    window.localStorage.setItem(vocabularyMarksStorageKey, JSON.stringify({ version: 1, markedIds: ['bad'], updatedAt: '' }));

    expect(readVocabularyMarksSnapshot(dictionaryEntries)).toBeNull();
    expect(window.localStorage.getItem(vocabularyMarksStorageKey)).toBeNull();
  });

  it('把 version 1 markedIds 依當下字典順序遷移為 version 2 markedKeys', () => {
    window.localStorage.setItem(
      vocabularyMarksStorageKey,
      JSON.stringify({
        version: 1,
        markedIds: [1, 2, 99],
        updatedAt: '2026-04-02T00:00:00.000Z'
      })
    );

    expect(readVocabularyMarksSnapshot(dictionaryEntries)).toEqual({
      version: 2,
      markedKeys: ['おい|', '会う|あう'],
      updatedAt: '2026-04-02T00:00:00.000Z'
    });
    expect(JSON.parse(window.localStorage.getItem(vocabularyMarksStorageKey) ?? '{}')).toEqual({
      version: 2,
      markedKeys: ['おい|', '会う|あう'],
      updatedAt: '2026-04-02T00:00:00.000Z'
    });
  });

  it('載入 version 2 時會靜默修剪當下字典不存在的 markedKeys 並寫回', () => {
    window.localStorage.setItem(
      vocabularyMarksStorageKey,
      JSON.stringify({
        version: 2,
        markedKeys: ['おい|', 'missing|'],
        updatedAt: '2026-04-02T00:00:00.000Z'
      })
    );

    expect(readVocabularyMarksSnapshot(dictionaryEntries)).toEqual({
      version: 2,
      markedKeys: ['おい|'],
      updatedAt: '2026-04-02T00:00:00.000Z'
    });
    expect(JSON.parse(window.localStorage.getItem(vocabularyMarksStorageKey) ?? '{}')).toEqual({
      version: 2,
      markedKeys: ['おい|'],
      updatedAt: '2026-04-02T00:00:00.000Z'
    });
  });

  it('pruneMarkedKeysAgainstDictionary 保留輸入順序並移除不存在的 key', () => {
    expect(
      pruneMarkedKeysAgainstDictionary(
        ['会う|あう', 'missing|', 'おい|'],
        new Set(dictionaryEntries.map((entry) => entry.markKey))
      )
    ).toEqual(['会う|あう', 'おい|']);
  });

  it('pruneMarkedKeysAgainstDictionary 遇到重複 key 時只保留第一次出現的位置', () => {
    expect(
      pruneMarkedKeysAgainstDictionary(
        ['おい|', '会う|あう', 'おい|'],
        new Set(dictionaryEntries.map((entry) => entry.markKey))
      )
    ).toEqual(['おい|', '会う|あう']);
  });
});
