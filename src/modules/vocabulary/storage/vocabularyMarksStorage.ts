import { removeStorage, writeJsonStorage } from '@/shared/utils/storageGuard';
import type { VocabularyEntry, VocabularyMarkSnapshot } from '@/modules/vocabulary/types/vocabulary';
import { vocabularyMarksStorageKey } from '@/shared/config/storageKeys';

export { vocabularyMarksStorageKey };

type VocabularyMarkDictionaryEntry = Pick<VocabularyEntry, 'id' | 'markKey'>;

interface LegacyVocabularyMarkSnapshot {
  version: 1;
  markedIds: number[];
  updatedAt: string;
}

function isValidUpdatedAt(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

function isValidMarkKey(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0 && value.includes('|');
}

function isLegacyVocabularyMarkSnapshot(value: unknown): value is LegacyVocabularyMarkSnapshot {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const snapshot = value as Partial<LegacyVocabularyMarkSnapshot>;

  return (
    snapshot.version === 1 &&
    Array.isArray(snapshot.markedIds) &&
    snapshot.markedIds.every((id) => Number.isInteger(id) && id > 0) &&
    isValidUpdatedAt(snapshot.updatedAt)
  );
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

export function pruneMarkedKeysAgainstDictionary(keys: Iterable<string>, dictionaryKeySet: ReadonlySet<string>) {
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

function writeSnapshot(snapshot: VocabularyMarkSnapshot) {
  writeJsonStorage(vocabularyMarksStorageKey, snapshot);
}

function readRawSnapshot() {
  const rawValue = window.localStorage.getItem(vocabularyMarksStorageKey);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as unknown;
  } catch {
    removeStorage(vocabularyMarksStorageKey);
    return null;
  }
}

function createDictionaryIndexes(dictionaryEntries: VocabularyMarkDictionaryEntry[]) {
  const keySet = new Set(dictionaryEntries.map((entry) => entry.markKey));
  const keyByLegacyId = new Map(dictionaryEntries.map((entry) => [entry.id, entry.markKey] as const));

  return {
    keySet,
    keyByLegacyId
  };
}

function migrateLegacySnapshot(
  snapshot: LegacyVocabularyMarkSnapshot,
  dictionaryEntries: VocabularyMarkDictionaryEntry[]
): VocabularyMarkSnapshot {
  const { keySet, keyByLegacyId } = createDictionaryIndexes(dictionaryEntries);
  const migratedKeys = snapshot.markedIds.flatMap((id) => {
    const key = keyByLegacyId.get(id);

    return key ? [key] : [];
  });

  return {
    version: 2,
    markedKeys: pruneMarkedKeysAgainstDictionary(migratedKeys, keySet),
    updatedAt: snapshot.updatedAt
  };
}

function pruneSnapshot(
  snapshot: VocabularyMarkSnapshot,
  dictionaryEntries: VocabularyMarkDictionaryEntry[]
): VocabularyMarkSnapshot {
  const { keySet } = createDictionaryIndexes(dictionaryEntries);

  return {
    ...snapshot,
    markedKeys: pruneMarkedKeysAgainstDictionary(snapshot.markedKeys, keySet)
  };
}

function hasSameMarkedKeys(left: string[], right: string[]) {
  return left.length === right.length && left.every((key, index) => key === right[index]);
}

export function readVocabularyMarksSnapshot(dictionaryEntries: VocabularyMarkDictionaryEntry[]) {
  const rawSnapshot = readRawSnapshot();

  if (rawSnapshot === null) {
    return null;
  }

  if (isLegacyVocabularyMarkSnapshot(rawSnapshot)) {
    const migratedSnapshot = migrateLegacySnapshot(rawSnapshot, dictionaryEntries);
    writeSnapshot(migratedSnapshot);
    return migratedSnapshot;
  }

  if (!isVocabularyMarkSnapshot(rawSnapshot)) {
    removeStorage(vocabularyMarksStorageKey);
    return null;
  }

  const prunedSnapshot = pruneSnapshot(rawSnapshot, dictionaryEntries);

  if (!hasSameMarkedKeys(rawSnapshot.markedKeys, prunedSnapshot.markedKeys)) {
    writeSnapshot(prunedSnapshot);
  }

  return prunedSnapshot;
}

export function writeVocabularyMarksSnapshot(snapshot: VocabularyMarkSnapshot) {
  if (!isVocabularyMarkSnapshot(snapshot)) {
    return false;
  }

  writeSnapshot(snapshot);
  return true;
}

export function clearVocabularyMarksSnapshot() {
  removeStorage(vocabularyMarksStorageKey);
}
