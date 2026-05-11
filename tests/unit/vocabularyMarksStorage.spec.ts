import { beforeEach, describe, expect, it } from 'vitest';
import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';

import {
  clearVocabularyMarksSnapshot,
  pruneMarkedKeysAgainstDictionary,
  readVocabularyMarksSnapshot,
  vocabularyMarksStorageKey,
  writeVocabularyMarksSnapshot
} from '@/modules/vocabulary/storage/vocabularyMarksStorage';
import { __resetWarnOnce, readAllMarks } from '@/modules/vocabulary/storage/vocabularyMarksDb';
import { normalizeVocabularyEntries } from '@/modules/vocabulary/utils/vocabularyFilters';

const dictionaryEntries = normalizeVocabularyEntries([
  { text: 'おい', romanization: 'o-i', kanji: '', meaning: '嘿', stage: 'N5' },
  { text: '会う', romanization: 'a-u', kanji: 'あう', meaning: '見面', stage: 'N5' }
]);

beforeEach(() => {
  globalThis.indexedDB = new IDBFactory();
  window.localStorage.clear();
  __resetWarnOnce();
});

describe('vocabulary marks storage (IndexedDB-backed)', () => {
  it('以 text 與 kanji 組成 stable natural key 並儲存 version 2 註記資料', async () => {
    expect(dictionaryEntries.map((entry) => entry.markKey)).toEqual(['おい|', '会う|あう']);

    const snapshot = {
      version: 2 as const,
      markedKeys: dictionaryEntries.map((entry) => entry.markKey),
      updatedAt: '2026-04-02T00:00:00.000Z'
    };

    expect(await writeVocabularyMarksSnapshot(snapshot)).toBe(true);
    expect(await readVocabularyMarksSnapshot(dictionaryEntries)).toEqual(snapshot);
    // IndexedDB SHALL be the primary mark store after migration
    expect((await readAllMarks()).map((r) => r.id).sort()).toEqual(['おい|', '会う|あう']);
    // localStorage SHALL NOT be used as the primary store
    expect(window.localStorage.getItem(vocabularyMarksStorageKey)).toBeNull();
  });

  it('讀取時靜默修剪當下字典不存在的 markedKeys (per spec: Stored mark keys are pruned against the current dictionary)', async () => {
    await writeVocabularyMarksSnapshot({
      version: 2,
      markedKeys: ['おい|', 'missing|'],
      updatedAt: '2026-04-02T00:00:00.000Z'
    });
    // Force-inject a stale key to simulate a stored mark that fell out of the dictionary
    const { putMarks } = await import('@/modules/vocabulary/storage/vocabularyMarksDb');
    await putMarks([{ id: 'missing|' }]);

    expect(await readVocabularyMarksSnapshot(dictionaryEntries)).toEqual({
      version: 2,
      markedKeys: ['おい|'],
      updatedAt: '2026-04-02T00:00:00.000Z'
    });
    // Pruned key SHALL be removed from the mark store
    expect((await readAllMarks()).map((r) => r.id)).toEqual(['おい|']);
  });

  it('返回 null 當 mark store 為空', async () => {
    expect(await readVocabularyMarksSnapshot(dictionaryEntries)).toBeNull();
  });

  it('清除快照後 mark store 為空', async () => {
    await writeVocabularyMarksSnapshot({
      version: 2,
      markedKeys: ['おい|'],
      updatedAt: '2026-04-02T00:00:00.000Z'
    });

    await clearVocabularyMarksSnapshot();

    expect(await readVocabularyMarksSnapshot(dictionaryEntries)).toBeNull();
    expect(await readAllMarks()).toEqual([]);
  });

  it('writeVocabularyMarksSnapshot 拒絕格式錯誤的 snapshot', async () => {
    const invalidSnapshot = {
      version: 1,
      markedIds: [1, 2],
      updatedAt: ''
    } as unknown;
    expect(await writeVocabularyMarksSnapshot(invalidSnapshot as never)).toBe(false);
  });

  it('pruneMarkedKeysAgainstDictionary 保留輸入順序並移除不存在的 key', () => {
    expect(
      pruneMarkedKeysAgainstDictionary(
        ['会う|あう', 'missing|', 'おい|'],
        new Set(dictionaryEntries.map((entry) => entry.markKey))
      )
    ).toEqual(['会う|あう', 'おい|']);
  });

  it('pruneMarkedKeysAgainstDictionary 遇到重複 key 時只保留第一次出現的位置 (per spec: Duplicate stored keys are collapsed)', () => {
    expect(
      pruneMarkedKeysAgainstDictionary(
        ['おい|', '会う|あう', 'おい|'],
        new Set(dictionaryEntries.map((entry) => entry.markKey))
      )
    ).toEqual(['おい|', '会う|あう']);
  });
});
