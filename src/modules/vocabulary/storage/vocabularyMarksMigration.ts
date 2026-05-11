/**
 * One-time migration: move vocabulary marks from localStorage to the IndexedDB
 * mark store described in vocabularyMarksDb.
 *
 * Strategy is "write-then-delete":
 * 1. If IndexedDB already has any records → no-op.
 * 2. Read localStorage snapshot (v1 with numeric ids OR v2 with natural keys).
 * 3. For v1, resolve numeric ids via the caller-supplied dictionary; without a
 *    dictionary, v1 cannot be resolved and we leave localStorage intact so a
 *    later call (after vocabulary stages load) can retry.
 * 4. Put records into IndexedDB, verify via read-back, then `removeItem` the
 *    localStorage key. Verification means a silent IndexedDB failure cannot
 *    cause data loss.
 *
 * Per `vocabulary-mark-persistence` spec:
 * - Acceptance scenarios cover v1 resolution, v2 direct move, idempotent retry
 *   after interruption, and full no-op when IndexedDB already populated.
 * - Empty v2 snapshots and corrupt JSON are cleared from localStorage (no
 *   IndexedDB write needed); v1 with unresolvable ids stays for later retry.
 */

import {
  putMarks,
  readAllMarks,
  type VocabularyMarkRecord
} from '@/modules/vocabulary/storage/vocabularyMarksDb';
import { vocabularyMarksStorageKey } from '@/shared/config/storageKeys';

export interface VocabularyMarkDictionaryEntry {
  id: number;
  markKey: string;
}

interface LegacyV1Snapshot {
  version: 1;
  markedIds: number[];
}

interface V2Snapshot {
  version: 2;
  markedKeys: string[];
}

function isV1Snapshot(value: unknown): value is LegacyV1Snapshot {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Partial<LegacyV1Snapshot>;
  return v.version === 1 && Array.isArray(v.markedIds);
}

function isV2Snapshot(value: unknown): value is V2Snapshot {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Partial<V2Snapshot>;
  return v.version === 2 && Array.isArray(v.markedKeys);
}

function readRawSnapshot(): unknown | undefined {
  if (typeof window === 'undefined') return undefined;
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(vocabularyMarksStorageKey);
  } catch {
    return undefined;
  }
  if (raw === null) return undefined;
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null; // sentinel: snapshot exists but is corrupt
  }
}

function clearLocalStorage(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(vocabularyMarksStorageKey);
  } catch {
    // ignore — localStorage failures are non-fatal here
  }
}

export async function migrateMarksFromLocalStorage(
  dictionaryEntries: ReadonlyArray<VocabularyMarkDictionaryEntry> = []
): Promise<void> {
  // Guard 1: IndexedDB already populated → migration already completed earlier.
  const existing = await readAllMarks();
  if (existing.length > 0) return;

  const raw = readRawSnapshot();

  // Case: no snapshot at all → nothing to migrate.
  if (raw === undefined) return;

  // Case: corrupt JSON → clear key (matches existing storageGuard contract).
  if (raw === null) {
    clearLocalStorage();
    return;
  }

  let keysToMigrate: string[];

  if (isV2Snapshot(raw)) {
    keysToMigrate = raw.markedKeys;
  } else if (isV1Snapshot(raw)) {
    if (raw.markedIds.length === 0) {
      clearLocalStorage();
      return;
    }
    const keyByLegacyId = new Map(
      dictionaryEntries.map((entry) => [entry.id, entry.markKey] as const)
    );
    const resolvedKeys = raw.markedIds.flatMap((id) => {
      const key = keyByLegacyId.get(id);
      return key ? [key] : [];
    });
    // No dictionary OR no ids resolve → keep localStorage for retry with full dictionary.
    if (resolvedKeys.length === 0) return;
    keysToMigrate = resolvedKeys;
  } else {
    // Unrecognized shape → discard.
    clearLocalStorage();
    return;
  }

  if (keysToMigrate.length === 0) {
    // Legit-empty v2 — safe to drop localStorage; nothing to write.
    clearLocalStorage();
    return;
  }

  const records: VocabularyMarkRecord[] = keysToMigrate.map((id) => ({ id }));

  await putMarks(records);

  // Verify before clearing: a silent IndexedDB failure must not erase localStorage.
  const written = await readAllMarks();
  const writtenIds = new Set(written.map((r) => r.id));
  const allRecordsPersisted = records.every((r) => writtenIds.has(r.id));

  if (allRecordsPersisted) {
    clearLocalStorage();
  }
}
