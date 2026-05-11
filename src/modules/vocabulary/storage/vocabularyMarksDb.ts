/**
 * Minimal native IndexedDB wrapper for the vocabulary marks store.
 *
 * Design notes:
 * - Database name: `vocabulary`, object store: `marks`, keyPath: `id`.
 * - `id` is the natural key (`text|kanji`) defined by the
 *   `vocabulary-mark-persistence` spec.
 * - We keep the wrapper deliberately thin — no library, no schema migration
 *   helpers, no caching of the DB handle. The marks workload is tiny (a few
 *   hundred records at most) so per-operation `open` is acceptable and keeps
 *   teardown simple for tests.
 * - When `indexedDB` is unavailable or open fails (private browsing, strict
 *   browsers, exhausted quota), the wrapper degrades to a silent no-op and
 *   emits exactly ONE `console.warn` per session.
 */

const DB_NAME = 'vocabulary';
const DB_VERSION = 1;
const STORE_NAME = 'marks';
/**
 * Sentinel id reserved for the snapshot-level metadata record (e.g. `updatedAt`).
 * Filtered out of regular mark queries so consumers never see it as a mark.
 */
const META_UPDATED_AT_ID = '__meta:updatedAt' as const;

export interface VocabularyMarkRecord {
  /** Natural key in the form `${text}|${kanji}` (per vocabulary-mark-persistence spec). */
  id: string;
}

interface VocabularyMarkMetaRecord {
  id: typeof META_UPDATED_AT_ID;
  value: string;
}

let openFailWarned = false;

/** Test helper: reset the once-only warn flag between tests. */
export function __resetWarnOnce(): void {
  openFailWarned = false;
}

function warnOnce(detail: unknown): void {
  if (openFailWarned) return;
  openFailWarned = true;
  // eslint-disable-next-line no-console
  console.warn(
    '[vocabularyMarksDb] IndexedDB unavailable; marks will not persist this session.',
    detail
  );
}

function getIndexedDB(): IDBFactory | null {
  if (typeof globalThis === 'undefined') return null;
  const factory = (globalThis as { indexedDB?: IDBFactory }).indexedDB;
  return factory ?? null;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const factory = getIndexedDB();
    if (!factory) {
      reject(new Error('indexedDB is not available in this environment'));
      return;
    }

    const req = factory.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('open failed'));
    req.onblocked = () => reject(new Error('open blocked by another connection'));
  });
}

function runReadAll(db: IDBDatabase): Promise<VocabularyMarkRecord[]> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).getAll();
    req.onsuccess = () => {
      const all = (req.result as Array<VocabularyMarkRecord | VocabularyMarkMetaRecord>) ?? [];
      // Filter out reserved meta record(s) so consumers only see real marks.
      const marks = all.filter((r): r is VocabularyMarkRecord => r.id !== META_UPDATED_AT_ID);
      resolve(marks);
    };
    req.onerror = () => reject(req.error ?? new Error('getAll failed'));
  });
}

function runReadUpdatedAt(db: IDBDatabase): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(META_UPDATED_AT_ID);
    req.onsuccess = () => {
      const record = req.result as VocabularyMarkMetaRecord | undefined;
      resolve(record?.value ?? null);
    };
    req.onerror = () => reject(req.error ?? new Error('meta get failed'));
  });
}

function runWriteUpdatedAt(db: IDBDatabase, value: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put({ id: META_UPDATED_AT_ID, value });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('meta put failed'));
  });
}

function runPutAll(db: IDBDatabase, records: readonly VocabularyMarkRecord[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    for (const record of records) {
      store.put(record);
    }
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('put failed'));
    tx.onabort = () => reject(tx.error ?? new Error('put aborted'));
  });
}

function runClear(db: IDBDatabase): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const req = tx.objectStore(STORE_NAME).clear();
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error ?? new Error('clear failed'));
  });
}

export async function readAllMarks(): Promise<VocabularyMarkRecord[]> {
  try {
    const db = await openDb();
    try {
      return await runReadAll(db);
    } finally {
      db.close();
    }
  } catch (error) {
    warnOnce(error);
    return [];
  }
}

export async function putMarks(records: readonly VocabularyMarkRecord[]): Promise<void> {
  if (records.length === 0) return;
  try {
    const db = await openDb();
    try {
      await runPutAll(db, records);
    } finally {
      db.close();
    }
  } catch (error) {
    warnOnce(error);
  }
}

export async function clearMarks(): Promise<void> {
  try {
    const db = await openDb();
    try {
      await runClear(db);
    } finally {
      db.close();
    }
  } catch (error) {
    warnOnce(error);
  }
}

export async function readUpdatedAt(): Promise<string | null> {
  try {
    const db = await openDb();
    try {
      return await runReadUpdatedAt(db);
    } finally {
      db.close();
    }
  } catch (error) {
    warnOnce(error);
    return null;
  }
}

export async function writeUpdatedAt(value: string): Promise<void> {
  try {
    const db = await openDb();
    try {
      await runWriteUpdatedAt(db, value);
    } finally {
      db.close();
    }
  } catch (error) {
    warnOnce(error);
  }
}
