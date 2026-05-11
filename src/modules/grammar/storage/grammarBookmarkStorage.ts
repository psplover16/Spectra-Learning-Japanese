import { grammarBookmarkStorageKey } from '@/shared/config/storageKeys';
import {
  grammarLevelOptions,
  isGrammarLevelValue
} from '@/modules/grammar/config/grammarLevels';
import type { GrammarLevelValue } from '@/modules/grammar/config/grammarLevels';
import { readJsonStorage, removeStorage, writeJsonStorage } from '@/shared/utils/storageGuard';

export { grammarBookmarkStorageKey };

const grammarBookmarkSnapshotVersion = 1;

export interface GrammarBookmarkEntry {
  sectionId: string;
  updatedAt: string;
}

interface GrammarBookmarkSnapshot {
  version: typeof grammarBookmarkSnapshotVersion;
  byLevel: Partial<Record<GrammarLevelValue, GrammarBookmarkEntry>>;
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

function isBookmarkEntry(value: unknown): value is GrammarBookmarkEntry {
  return (
    isRecord(value) &&
    typeof value.sectionId === 'string' &&
    value.sectionId.length > 0 &&
    isIsoTimestamp(value.updatedAt)
  );
}

function isByLevelMap(value: unknown): value is Partial<Record<GrammarLevelValue, GrammarBookmarkEntry>> {
  if (!isRecord(value)) {
    return false;
  }

  for (const [key, entry] of Object.entries(value)) {
    if (!isGrammarLevelValue(key)) {
      return false;
    }
    if (entry !== undefined && !isBookmarkEntry(entry)) {
      return false;
    }
  }

  return true;
}

function isGrammarBookmarkSnapshot(value: unknown): value is GrammarBookmarkSnapshot {
  return (
    isRecord(value) &&
    value.version === grammarBookmarkSnapshotVersion &&
    isByLevelMap(value.byLevel)
  );
}

function readSnapshot(): GrammarBookmarkSnapshot | null {
  return readJsonStorage(grammarBookmarkStorageKey, isGrammarBookmarkSnapshot);
}

export function readGrammarBookmark(level: GrammarLevelValue): GrammarBookmarkEntry | null {
  const snapshot = readSnapshot();
  return snapshot?.byLevel[level] ?? null;
}

export function writeGrammarBookmark(
  level: GrammarLevelValue,
  sectionId: string,
  updatedAt: Date = new Date()
): boolean {
  const normalizedSectionId = sectionId.trim();
  if (!normalizedSectionId) {
    return false;
  }

  const current = readSnapshot();
  const nextSnapshot: GrammarBookmarkSnapshot = {
    version: grammarBookmarkSnapshotVersion,
    byLevel: {
      ...(current?.byLevel ?? {}),
      [level]: {
        sectionId: normalizedSectionId,
        updatedAt: updatedAt.toISOString()
      }
    }
  };

  try {
    writeJsonStorage(grammarBookmarkStorageKey, nextSnapshot);
    return true;
  } catch {
    return false;
  }
}

export function clearGrammarBookmark(level: GrammarLevelValue): void {
  const current = readSnapshot();
  if (!current || !(level in current.byLevel)) {
    return;
  }

  const nextByLevel = { ...current.byLevel };
  delete nextByLevel[level];

  try {
    if (Object.keys(nextByLevel).length === 0) {
      removeStorage(grammarBookmarkStorageKey);
    } else {
      writeJsonStorage(grammarBookmarkStorageKey, {
        version: grammarBookmarkSnapshotVersion,
        byLevel: nextByLevel
      });
    }
  } catch {
    // Storage failure — clear is best-effort, do not surface error
  }
}

export const supportedGrammarBookmarkLevels: readonly GrammarLevelValue[] = grammarLevelOptions.map(
  (option) => option.value
);
