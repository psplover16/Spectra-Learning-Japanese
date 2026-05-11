import { beforeEach, describe, expect, it, vi } from 'vitest';
import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';

import {
  migrateMarksFromLocalStorage,
  type VocabularyMarkDictionaryEntry
} from '@/modules/vocabulary/storage/vocabularyMarksMigration';
import {
  __resetWarnOnce,
  readAllMarks
} from '@/modules/vocabulary/storage/vocabularyMarksDb';
import { vocabularyMarksStorageKey } from '@/shared/config/storageKeys';

function writeLocalSnapshot(value: unknown): void {
  window.localStorage.setItem(vocabularyMarksStorageKey, JSON.stringify(value));
}

function readLocalSnapshotRaw(): string | null {
  return window.localStorage.getItem(vocabularyMarksStorageKey);
}

beforeEach(() => {
  globalThis.indexedDB = new IDBFactory();
  window.localStorage.clear();
  __resetWarnOnce();
  vi.restoreAllMocks();
});

describe('migrateMarksFromLocalStorage', () => {
  it('(case a) moves v2 localStorage snapshot to IndexedDB and clears localStorage', async () => {
    writeLocalSnapshot({
      version: 2,
      markedKeys: ['おい|', '会う|あう'],
      updatedAt: new Date().toISOString()
    });

    await migrateMarksFromLocalStorage();

    const stored = await readAllMarks();
    expect(stored.map((r) => r.id).sort()).toEqual(['おい|', '会う|あう']);
    expect(readLocalSnapshotRaw()).toBeNull();
  });

  it('(case b) resolves v1 numeric ids via dictionary, writes natural keys, clears localStorage', async () => {
    writeLocalSnapshot({
      version: 1,
      markedIds: [1, 2],
      updatedAt: new Date().toISOString()
    });
    const dictionary: VocabularyMarkDictionaryEntry[] = [
      { id: 1, markKey: 'おい|' },
      { id: 2, markKey: '会う|あう' }
    ];

    await migrateMarksFromLocalStorage(dictionary);

    const stored = await readAllMarks();
    expect(stored.map((r) => r.id).sort()).toEqual(['おい|', '会う|あう']);
    expect(readLocalSnapshotRaw()).toBeNull();
  });

  it('(case c) preserves localStorage when IndexedDB write fails (idempotent retry)', async () => {
    writeLocalSnapshot({
      version: 2,
      markedKeys: ['おい|'],
      updatedAt: new Date().toISOString()
    });
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    // Simulate IndexedDB unavailable mid-migration by yanking the factory
    (globalThis as { indexedDB: unknown }).indexedDB = undefined;

    await migrateMarksFromLocalStorage();

    // localStorage MUST stay intact for the next startup to retry
    expect(readLocalSnapshotRaw()).not.toBeNull();

    // Restore IndexedDB; second call must produce the same final state as a single success
    globalThis.indexedDB = new IDBFactory();
    __resetWarnOnce();
    await migrateMarksFromLocalStorage();

    const stored = await readAllMarks();
    expect(stored.map((r) => r.id)).toEqual(['おい|']);
    expect(readLocalSnapshotRaw()).toBeNull();
  });

  it('(case d) is a complete no-op when IndexedDB already contains records', async () => {
    // Pre-populate IndexedDB
    const { putMarks } = await import('@/modules/vocabulary/storage/vocabularyMarksDb');
    await putMarks([{ id: 'pre|existing' }]);

    // Also have unrelated localStorage marks — these should NOT be migrated
    writeLocalSnapshot({
      version: 2,
      markedKeys: ['おい|'],
      updatedAt: new Date().toISOString()
    });

    await migrateMarksFromLocalStorage();

    const stored = await readAllMarks();
    expect(stored.map((r) => r.id)).toEqual(['pre|existing']);
    // Untouched localStorage stays
    expect(readLocalSnapshotRaw()).not.toBeNull();
  });

  it('clears empty v2 snapshot from localStorage without writing to IndexedDB', async () => {
    writeLocalSnapshot({
      version: 2,
      markedKeys: [],
      updatedAt: new Date().toISOString()
    });

    await migrateMarksFromLocalStorage();

    expect(await readAllMarks()).toEqual([]);
    expect(readLocalSnapshotRaw()).toBeNull();
  });

  it('preserves v1 localStorage when called with no dictionary (defers to later call)', async () => {
    writeLocalSnapshot({
      version: 1,
      markedIds: [1],
      updatedAt: new Date().toISOString()
    });

    await migrateMarksFromLocalStorage();

    expect(await readAllMarks()).toEqual([]);
    expect(readLocalSnapshotRaw()).not.toBeNull();
  });

  it('discards corrupt localStorage snapshots and clears the key', async () => {
    window.localStorage.setItem(vocabularyMarksStorageKey, '{invalid-json');

    await migrateMarksFromLocalStorage();

    expect(await readAllMarks()).toEqual([]);
    expect(readLocalSnapshotRaw()).toBeNull();
  });
});
