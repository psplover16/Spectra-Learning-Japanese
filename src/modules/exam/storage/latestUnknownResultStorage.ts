import { readJsonStorage, removeStorage, writeJsonStorage } from '@/shared/utils/storageGuard';
import type { LatestUnknownResultEntry, LatestUnknownResultSnapshot } from '@/modules/exam/types/exam';
import { latestUnknownResultsStorageKey } from '@/shared/config/storageKeys';

export { latestUnknownResultsStorageKey };

function isResultEntry(value: unknown): value is LatestUnknownResultEntry {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const entry = value as Record<string, unknown>;
  return (
    typeof entry.kanaId === 'string' &&
    typeof entry.hiragana === 'string' &&
    typeof entry.katakana === 'string' &&
    typeof entry.romaji === 'string' &&
    typeof entry.count === 'number'
  );
}

function isSnapshot(value: unknown): value is LatestUnknownResultSnapshot {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const snapshot = value as Record<string, unknown>;
  return (
    typeof snapshot.updatedAt === 'string' &&
    typeof snapshot.totalUnknownCount === 'number' &&
    Array.isArray(snapshot.results) &&
    snapshot.results.every(isResultEntry)
  );
}

export function readLatestUnknownResults(): LatestUnknownResultSnapshot | null {
  return readJsonStorage(latestUnknownResultsStorageKey, isSnapshot);
}

export function writeLatestUnknownResults(snapshot: LatestUnknownResultSnapshot): void {
  writeJsonStorage(latestUnknownResultsStorageKey, snapshot);
}

export function clearLatestUnknownResults(): void {
  removeStorage(latestUnknownResultsStorageKey);
}
