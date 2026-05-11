import { defineComponent, nextTick } from 'vue';
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { createPracticeSession, providePracticeSession } from '@/modules/practice/composables/usePracticeSession';
import { useVocabularySession, type UseVocabularySessionOptions } from '@/modules/vocabulary/composables/useVocabularySession';
import {
  vocabularyJlptLevels,
  type RawVocabularyEntry,
  type VocabularyJlptLevel
} from '@/modules/vocabulary/types/vocabulary';
import { vocabularyMarksStorageKey } from '@/shared/config/storageKeys';
import {
  __resetWarnOnce,
  putMarks,
  readAllMarks,
  writeUpdatedAt
} from '@/modules/vocabulary/storage/vocabularyMarksDb';

type VocabularySession = ReturnType<typeof useVocabularySession>;

const emptyStageEntries: Record<VocabularyJlptLevel, RawVocabularyEntry[]> = {
  N1: [],
  N2: [],
  N3: [],
  N4: [],
  N5: []
};

function createStageLoaders(entriesByStage: Partial<Record<VocabularyJlptLevel, RawVocabularyEntry[]>>) {
  const stageEntries = {
    ...emptyStageEntries,
    ...entriesByStage
  };

  return Object.fromEntries(
    vocabularyJlptLevels.map((level) => [
      level,
      () => Promise.resolve({ default: stageEntries[level] })
    ])
  ) as Record<VocabularyJlptLevel, () => Promise<{ default: RawVocabularyEntry[] }>>;
}

function rawVocabularyEntry(
  text: string,
  stage: VocabularyJlptLevel,
  meaning = text
): RawVocabularyEntry {
  return {
    text,
    romanization: text,
    kanji: text.toUpperCase(),
    meaning,
    stage
  };
}

async function storedMarkedKeys(): Promise<string[]> {
  const records = await readAllMarks();
  return records.map((r) => r.id);
}

function mountVocabularySession(options?: UseVocabularySessionOptions) {
  let session: VocabularySession | undefined;

  const SessionConsumer = defineComponent({
    setup() {
      session = useVocabularySession(options);

      return () => null;
    }
  });

  const TestHarness = defineComponent({
    components: { SessionConsumer },
    setup() {
      providePracticeSession(createPracticeSession());

      return {};
    },
    template: '<SessionConsumer />'
  });

  const wrapper = mount(TestHarness);

  if (!session) {
    throw new Error('Vocabulary session was not created.');
  }

  return {
    session,
    wrapper
  };
}

describe('useVocabularySession', () => {
  beforeEach(() => {
    globalThis.indexedDB = new IDBFactory();
    window.localStorage.clear();
    __resetWarnOnce();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
  });

  it('以 stable key 切換、儲存、取消註記並驅動只顯示註記過濾', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    const { session, wrapper } = mountVocabularySession();
    await session.loadVocabularyStages(vocabularyJlptLevels);
    await flushPromises();

    const markedEntry = session.vocabularyEntries.value[0]!;
    const unmarkedEntry = session.vocabularyEntries.value[1]!;

    session.toggleMarked(markedEntry.markKey, true);

    expect(session.draftMarkedKeys.value.has(markedEntry.markKey)).toBe(true);
    expect(session.hasUnsavedMarkChanges.value).toBe(true);
    expect(await session.saveMarks()).toBe(true);
    expect(session.persistedMarkedKeys.value.has(markedEntry.markKey)).toBe(true);
    expect(await storedMarkedKeys()).toEqual([markedEntry.markKey]);
    // localStorage SHALL NOT be used as the primary mark store after migration
    expect(window.localStorage.getItem(vocabularyMarksStorageKey)).toBeNull();

    session.showMarkedOnly.value = true;
    await nextTick();

    expect(session.visibleEntries.value.map((entry) => entry.markKey)).toContain(markedEntry.markKey);
    expect(session.visibleEntries.value.map((entry) => entry.markKey)).not.toContain(unmarkedEntry.markKey);

    session.showMarkedOnly.value = false;
    await nextTick();
    session.toggleMarked(markedEntry.markKey, false);

    expect(await session.saveMarks()).toBe(true);
    expect(session.persistedMarkedKeys.value.size).toBe(0);
    expect(session.draftMarkedKeys.value.size).toBe(0);
    expect(await storedMarkedKeys()).toEqual([]);

    wrapper.unmount();
  });

  it('依 selectedJlptLevels lazy load stage data，且取消已載入 stage 不會顯示 stale entries', async () => {
    const { session, wrapper } = mountVocabularySession();
    await session.loadVocabularyStages(vocabularyJlptLevels);
    await flushPromises();

    expect(session.isLoadingVocabulary.value).toBe(false);
    expect(Object.keys(session.loadedStageEntries.value).sort()).toEqual([...vocabularyJlptLevels].sort());

    session.setSelectedJlptLevels(['N5']);
    await nextTick();

    expect(new Set(session.visibleEntries.value.map((entry) => entry.stage))).toEqual(new Set(['N5']));

    session.setSelectedJlptLevels([]);
    await nextTick();

    expect(session.visibleEntries.value).toEqual([]);
    expect(session.hasAnyVisibleEntries.value).toBe(false);

    wrapper.unmount();
  });

  it('依學習順序分段載入 selected JLPT 資料，讓 shell 可先顯示 loading 狀態', async () => {
    const startedLevels: VocabularyJlptLevel[] = [];
    const resolvers = new Map<VocabularyJlptLevel, (value: { default: RawVocabularyEntry[] }) => void>();
    const stageLoaders = Object.fromEntries(
      vocabularyJlptLevels.map((level) => [
        level,
        () => {
          startedLevels.push(level);
          return new Promise<{ default: RawVocabularyEntry[] }>((resolve) => {
            resolvers.set(level, resolve);
          });
        }
      ])
    ) as Record<VocabularyJlptLevel, () => Promise<{ default: RawVocabularyEntry[] }>>;
    const { session, wrapper } = mountVocabularySession({ stageLoaders });

    await nextTick();

    expect(startedLevels).toEqual(['N5']);
    expect(session.isLoadingVocabulary.value).toBe(true);
    expect(session.visibleEntries.value).toEqual([]);

    resolvers.get('N5')?.({ default: [rawVocabularyEntry('beta', 'N5')] });
    await flushPromises();
    await nextTick();

    expect(startedLevels).toEqual(['N5', 'N4']);
    expect(session.visibleEntries.value.map((entry) => entry.stage)).toEqual(['N5']);

    resolvers.get('N4')?.({ default: [rawVocabularyEntry('delta', 'N4')] });
    await flushPromises();
    await nextTick();

    expect(startedLevels).toEqual(['N5', 'N4', 'N3']);

    for (const level of ['N3', 'N2', 'N1'] as const) {
      resolvers.get(level)?.({ default: [rawVocabularyEntry(level.toLowerCase(), level)] });
      await flushPromises();
      await nextTick();
    }

    expect(startedLevels).toEqual(['N5', 'N4', 'N3', 'N2', 'N1']);
    expect(session.isLoadingVocabulary.value).toBe(false);

    wrapper.unmount();
  });

  it('暴露 stage lazy import 失敗狀態，避免依賴 unavailable entries', async () => {
    const { session, wrapper } = mountVocabularySession({
      stageLoaders: {
        N5: () => Promise.reject(new Error('boom'))
      }
    });

    session.setSelectedJlptLevels(['N5']);
    await flushPromises();

    expect(session.isLoadingVocabulary.value).toBe(false);
    expect(session.hasVocabularyLoadError.value).toBe(true);
    expect(session.vocabularyLoadError.value).toBe('單字資料載入失敗：N5');
    expect(session.visibleEntries.value).toEqual([]);

    wrapper.unmount();
  });

  it('儲存註記只合併目前可見單字，並保留不可見 persisted marks', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    const visibleEntry = rawVocabularyEntry('alpha', 'N1');
    const hiddenEntry = rawVocabularyEntry('beta', 'N5');
    const { session, wrapper } = mountVocabularySession({
      stageLoaders: createStageLoaders({
        N1: [visibleEntry],
        N5: [hiddenEntry]
      })
    });
    await session.loadVocabularyStages(vocabularyJlptLevels);
    await flushPromises();

    const visibleKey = 'alpha|ALPHA';
    const hiddenKey = 'beta|BETA';
    session.persistedMarkedKeys.value = new Set([visibleKey, hiddenKey]);
    session.draftMarkedKeys.value = new Set([visibleKey]);
    session.searchText.value = 'alpha';
    await nextTick();

    expect(session.visibleEntries.value.map((entry) => entry.markKey)).toEqual([visibleKey]);
    expect(await session.saveMarks()).toBe(true);
    expect((await storedMarkedKeys()).sort()).toEqual([hiddenKey, visibleKey].sort());

    session.persistedMarkedKeys.value = new Set([visibleKey, hiddenKey]);
    session.draftMarkedKeys.value = new Set<string>();
    expect(await session.saveMarks()).toBe(true);
    expect(await storedMarkedKeys()).toEqual([hiddenKey]);

    wrapper.unmount();
  });

  it('header 批次註記只更新目前可見 draft marks，並保留不可見 draft 與 persisted marks', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => undefined);
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    const visibleEntry = rawVocabularyEntry('alpha', 'N1');
    const hiddenEntry = rawVocabularyEntry('beta', 'N5');
    const { session, wrapper } = mountVocabularySession({
      stageLoaders: createStageLoaders({
        N1: [visibleEntry],
        N5: [hiddenEntry]
      })
    });
    await session.loadVocabularyStages(vocabularyJlptLevels);
    await flushPromises();

    const visibleKey = 'alpha|ALPHA';
    const hiddenKey = 'beta|BETA';
    // Pre-populate the IndexedDB mark store (post-migration baseline)
    await putMarks([{ id: hiddenKey }]);
    await writeUpdatedAt('2026-05-04T00:00:00.000Z');
    session.persistedMarkedKeys.value = new Set([hiddenKey]);
    session.draftMarkedKeys.value = new Set([hiddenKey]);
    session.searchText.value = 'alpha';
    await nextTick();

    expect(session.visibleEntries.value.map((entry) => entry.markKey)).toEqual([visibleKey]);
    expect(session.allVisibleDraftMarked.value).toBe(false);

    session.bulkToggleVisibleDraftMarks(true);

    expect(session.draftMarkedKeys.value.has(visibleKey)).toBe(true);
    expect(session.draftMarkedKeys.value.has(hiddenKey)).toBe(true);
    expect(session.persistedMarkedKeys.value).toEqual(new Set([hiddenKey]));
    // Header bulk toggle SHALL NOT write to the mark store
    expect(await storedMarkedKeys()).toEqual([hiddenKey]);
    expect(session.allVisibleDraftMarked.value).toBe(true);

    session.bulkToggleVisibleDraftMarks(false);

    expect(session.draftMarkedKeys.value.has(visibleKey)).toBe(false);
    expect(session.draftMarkedKeys.value.has(hiddenKey)).toBe(true);
    expect(session.persistedMarkedKeys.value).toEqual(new Set([hiddenKey]));
    expect(await storedMarkedKeys()).toEqual([hiddenKey]);
    expect(session.allVisibleDraftMarked.value).toBe(false);
    expect(alertSpy).not.toHaveBeenCalled();
    expect(window.confirm).not.toHaveBeenCalledWith('確定要清除目前顯示單字的註記嗎？');
    expect(window.confirm).not.toHaveBeenCalledWith('確定要刪除全部註記嗎？');

    wrapper.unmount();
  });

  it('可見單字依 N5、N4、N3、N2、N1 排序，且不受 lazy load 完成順序影響', async () => {
    const { session, wrapper } = mountVocabularySession({
      stageLoaders: createStageLoaders({
        N1: [rawVocabularyEntry('alpha', 'N1')],
        N2: [rawVocabularyEntry('epsilon', 'N2')],
        N3: [rawVocabularyEntry('gamma', 'N3')],
        N4: [rawVocabularyEntry('delta', 'N4')],
        N5: [rawVocabularyEntry('beta', 'N5')]
      })
    });
    await session.loadVocabularyStages(vocabularyJlptLevels);
    await flushPromises();

    expect(session.visibleEntries.value.map((entry) => entry.stage)).toEqual(['N5', 'N4', 'N3', 'N2', 'N1']);
    expect(session.visibleEntries.value.map((entry) => entry.text)).toEqual(['beta', 'delta', 'gamma', 'epsilon', 'alpha']);

    session.setSelectedJlptLevels(['N4', 'N2', 'N1']);
    await nextTick();

    expect(session.visibleEntries.value.map((entry) => entry.stage)).toEqual(['N4', 'N2', 'N1']);

    wrapper.unmount();
  });
});
