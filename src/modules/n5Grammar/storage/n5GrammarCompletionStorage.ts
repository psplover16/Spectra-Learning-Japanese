import { n5GrammarCompletionStorageKey } from '@/shared/config/storageKeys';
import { readJsonStorage, removeStorage, writeJsonStorage } from '@/shared/utils/storageGuard';

export { n5GrammarCompletionStorageKey };

const n5GrammarCompletionSnapshotVersion = 1;

export interface N5GrammarCompletionSnapshot {
  version: typeof n5GrammarCompletionSnapshotVersion;
  completedSectionIds: string[];
  updatedAt: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isIsoTimestamp(value: unknown): value is string {
  if (typeof value !== 'string' || value.length === 0) {
    return false;
  }

  const parsedTime = Date.parse(value);
  return !Number.isNaN(parsedTime) && new Date(parsedTime).toISOString() === value;
}

function isCompletedSectionIds(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((sectionId) => typeof sectionId === 'string' && sectionId.length > 0);
}

function isN5GrammarCompletionSnapshot(value: unknown): value is N5GrammarCompletionSnapshot {
  return (
    isRecord(value) &&
    value.version === n5GrammarCompletionSnapshotVersion &&
    isCompletedSectionIds(value.completedSectionIds) &&
    isIsoTimestamp(value.updatedAt)
  );
}

function normalizeCompletedSectionIds(completedSectionIds: readonly string[]): string[] {
  const normalizedSectionIds: string[] = [];
  const seenSectionIds = new Set<string>();

  for (const sectionId of completedSectionIds) {
    const normalizedSectionId = sectionId.trim();

    if (!normalizedSectionId || seenSectionIds.has(normalizedSectionId)) {
      continue;
    }

    seenSectionIds.add(normalizedSectionId);
    normalizedSectionIds.push(normalizedSectionId);
  }

  return normalizedSectionIds;
}

export function readN5GrammarCompletionSnapshot(): N5GrammarCompletionSnapshot | null {
  return readJsonStorage(n5GrammarCompletionStorageKey, isN5GrammarCompletionSnapshot);
}

export function readCompletedN5GrammarSectionIds(): string[] {
  return readN5GrammarCompletionSnapshot()?.completedSectionIds ?? [];
}

export function writeN5GrammarCompletionSnapshot(snapshot: N5GrammarCompletionSnapshot): boolean {
  if (!isN5GrammarCompletionSnapshot(snapshot)) {
    return false;
  }

  try {
    writeJsonStorage(n5GrammarCompletionStorageKey, snapshot);
    return true;
  } catch {
    return false;
  }
}

export function writeCompletedN5GrammarSectionIds(completedSectionIds: readonly string[], updatedAt = new Date()): boolean {
  return writeN5GrammarCompletionSnapshot({
    version: n5GrammarCompletionSnapshotVersion,
    completedSectionIds: normalizeCompletedSectionIds(completedSectionIds),
    updatedAt: updatedAt.toISOString()
  });
}

export function clearN5GrammarCompletionSnapshot(): void {
  removeStorage(n5GrammarCompletionStorageKey);
}
