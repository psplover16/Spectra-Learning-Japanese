import { defineComponent, nextTick } from 'vue';
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createPracticeSession, providePracticeSession } from '@/modules/practice/composables/usePracticeSession';
import { useVocabularySession, type UseVocabularySessionOptions } from '@/modules/vocabulary/composables/useVocabularySession';
import {
  vocabularyJlptLevels,
  type RawVocabularyEntry,
  type VocabularyJlptLevel
} from '@/modules/vocabulary/types/vocabulary';
import { vocabularyMarksStorageKey } from '@/shared/config/storageKeys';

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

function storedMarkedKeys() {
  return JSON.parse(window.localStorage.getItem(vocabularyMarksStorageKey) ?? '{}').markedKeys as string[] | undefined;
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
  afterEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
  });

  it('以 stable key 切換、儲存、清除註記並驅動只顯示註記過濾', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    const { session, wrapper } = mountVocabularySession();
    await session.loadVocabularyStages(vocabularyJlptLevels);
    await flushPromises();

    const markedEntry = session.vocabularyEntries.value[0]!;
    const unmarkedEntry = session.vocabularyEntries.value[1]!;

    session.toggleMarked(markedEntry.markKey, true);

    expect(session.draftMarkedKeys.value.has(markedEntry.markKey)).toBe(true);
    expect(session.hasUnsavedMarkChanges.value).toBe(true);
    expect(session.saveMarks()).toBe(true);
    expect(session.persistedMarkedKeys.value.has(markedEntry.markKey)).toBe(true);
    expect(JSON.parse(window.localStorage.getItem(vocabularyMarksStorageKey) ?? '{}')).toMatchObject({
      version: 2,
      markedKeys: [markedEntry.markKey]
    });

    session.showMarkedOnly.value = true;
    await nextTick();

    expect(session.visibleEntries.value.map((entry) => entry.markKey)).toContain(markedEntry.markKey);
    expect(session.visibleEntries.value.map((entry) => entry.markKey)).not.toContain(unmarkedEntry.markKey);

    session.clearAllMarksWithConfirmation();

    expect(session.persistedMarkedKeys.value.size).toBe(0);
    expect(session.draftMarkedKeys.value.size).toBe(0);
    expect(window.localStorage.getItem(vocabularyMarksStorageKey)).toBeNull();

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
    expect(session.saveMarks()).toBe(true);
    expect(storedMarkedKeys()?.sort()).toEqual([hiddenKey, visibleKey].sort());

    session.persistedMarkedKeys.value = new Set([visibleKey, hiddenKey]);
    session.draftMarkedKeys.value = new Set<string>();
    expect(session.saveMarks()).toBe(true);
    expect(storedMarkedKeys()).toEqual([hiddenKey]);

    wrapper.unmount();
  });

  it('清除 header 註記只移除目前可見單字，並保留不可見 persisted marks', async () => {
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
    session.draftMarkedKeys.value = new Set([visibleKey, hiddenKey]);
    session.searchText.value = 'alpha';
    await nextTick();

    session.clearAllMarksWithConfirmation();

    expect(session.persistedMarkedKeys.value.has(visibleKey)).toBe(false);
    expect(session.draftMarkedKeys.value.has(visibleKey)).toBe(false);
    expect(session.persistedMarkedKeys.value.has(hiddenKey)).toBe(true);
    expect(session.draftMarkedKeys.value.has(hiddenKey)).toBe(true);
    expect(storedMarkedKeys()).toEqual([hiddenKey]);
    expect(window.confirm).toHaveBeenCalledWith('確定要清除目前顯示單字的註記嗎？');
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
