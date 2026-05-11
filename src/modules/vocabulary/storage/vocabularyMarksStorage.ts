/**
 * Async, IndexedDB-backed marks storage façade.
 *
 * After this change:
 * - Marks are persisted to the IndexedDB `vocabulary/marks` object store via
 *   `vocabularyMarksDb`. localStorage is no longer the primary mark store.
 * - Legacy v1 / v2 localStorage data is moved over by
 *   `migrateMarksFromLocalStorage()` (see `vocabularyMarksMigration.ts`) at
 *   application startup, before any read or write here happens.
 * - The public function names are kept (`readVocabularyMarksSnapshot`,
 *   `writeVocabularyMarksSnapshot`, `clearVocabularyMarksSnapshot`) so existing
 *   call sites only need to add `await`. The dictionary pruning behavior is
 *   preserved verbatim per `vocabulary-mark-persistence` spec.
 */

import {
  clearMarks,
  putMarks,
  readAllMarks,
  readUpdatedAt,
  writeUpdatedAt
} from '@/modules/vocabulary/storage/vocabularyMarksDb';
import type { VocabularyEntry, VocabularyMarkSnapshot } from '@/modules/vocabulary/types/vocabulary';
import { vocabularyMarksStorageKey } from '@/shared/config/storageKeys';

export { vocabularyMarksStorageKey };

type VocabularyMarkDictionaryEntry = Pick<VocabularyEntry, 'id' | 'markKey'>;

function isValidUpdatedAt(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

function isValidMarkKey(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0 && value.includes('|');
}

export function isVocabularyMarkSnapshot(value: unknown): value is VocabularyMarkSnapshot {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const snapshot = value as Partial<VocabularyMarkSnapshot> & { markedIds?: unknown };

  return (
    snapshot.version === 2 &&
    !('markedIds' in snapshot) &&
    Array.isArray(snapshot.markedKeys) &&
    snapshot.markedKeys.every(isValidMarkKey) &&
    isValidUpdatedAt(snapshot.updatedAt)
  );
}

export function pruneMarkedKeysAgainstDictionary(
  keys: Iterable<string>,
  dictionaryKeySet: ReadonlySet<string>
): string[] {
  const seenKeys = new Set<string>();
  const prunedKeys: string[] = [];

  for (const key of keys) {
    if (!dictionaryKeySet.has(key) || seenKeys.has(key)) {
      continue;
    }

    seenKeys.add(key);
    prunedKeys.push(key);
  }

  return prunedKeys;
}

async function syncMarkStoreToKeys(keys: readonly string[], updatedAt: string): Promise<void> {
  // Atomicity note: clear + put + meta are issued sequentially. A browser crash
  // between them is theoretically possible but the workload is tiny (<1ms),
  // single-user, and the user just initiated this write so a retry is trivial.
  await clearMarks();
  if (keys.length > 0) {
    await putMarks(keys.map((id) => ({ id })));
  }
  await writeUpdatedAt(updatedAt);
}

export async function readVocabularyMarksSnapshot(
  dictionaryEntries: VocabularyMarkDictionaryEntry[]
): Promise<VocabularyMarkSnapshot | null> {
  const [records, storedUpdatedAt] = await Promise.all([readAllMarks(), readUpdatedAt()]);

  if (records.length === 0) {
    return null;
  }

  const dictionaryKeySet = new Set(dictionaryEntries.map((entry) => entry.markKey));
  const rawKeys = records.map((record) => record.id);
  const prunedKeys = pruneMarkedKeysAgainstDictionary(rawKeys, dictionaryKeySet);

  // Persist pruning so the mark store and the loaded snapshot agree.
  if (prunedKeys.length !== rawKeys.length) {
    const persistedUpdatedAt = storedUpdatedAt ?? new Date().toISOString();
    await syncMarkStoreToKeys(prunedKeys, persistedUpdatedAt);
    if (prunedKeys.length === 0) {
      return null;
    }
    return {
      version: 2,
      markedKeys: prunedKeys,
      updatedAt: persistedUpdatedAt
    };
  }

  return {
    version: 2,
    markedKeys: prunedKeys,
    updatedAt: storedUpdatedAt ?? new Date().toISOString()
  };
}

export async function writeVocabularyMarksSnapshot(
  snapshot: VocabularyMarkSnapshot
): Promise<boolean> {
  if (!isVocabularyMarkSnapshot(snapshot)) {
    return false;
  }

  await syncMarkStoreToKeys(snapshot.markedKeys, snapshot.updatedAt);
  return true;
}

export async function clearVocabularyMarksSnapshot(): Promise<void> {
  await clearMarks();
}

/**
 * Warm-up read against the IndexedDB mark store so the first user-visible
 * access in `useVocabularySession.hydrateMarksWhenAllStagesLoaded()` returns
 * faster. Intentionally discards the result — the composable will read again
 * with the dictionary in hand.
 */
export async function prefetchVocabularyMarks(): Promise<void> {
  await readAllMarks();
}
