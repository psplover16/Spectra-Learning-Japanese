import { readJsonStorage, removeStorage, writeJsonStorage } from '@/shared/utils/storageGuard';
import type { VocabularyMarkSnapshot } from '@/modules/vocabulary/types/vocabulary';
import { vocabularyMarksStorageKey } from '@/shared/config/storageKeys';

export { vocabularyMarksStorageKey };

export function isVocabularyMarkSnapshot(value: unknown): value is VocabularyMarkSnapshot {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const snapshot = value as Partial<VocabularyMarkSnapshot>;

  return (
    snapshot.version === 1 &&
    Array.isArray(snapshot.markedIds) &&
    snapshot.markedIds.every((id) => Number.isInteger(id) && id > 0) &&
    typeof snapshot.updatedAt === 'string' &&
    snapshot.updatedAt.length > 0
  );
}

export function readVocabularyMarksSnapshot() {
  return readJsonStorage(vocabularyMarksStorageKey, isVocabularyMarkSnapshot);
}

export function writeVocabularyMarksSnapshot(snapshot: VocabularyMarkSnapshot) {
  if (!isVocabularyMarkSnapshot(snapshot)) {
    return false;
  }

  writeJsonStorage(vocabularyMarksStorageKey, snapshot);
  return true;
}

export function clearVocabularyMarksSnapshot() {
  removeStorage(vocabularyMarksStorageKey);
}
