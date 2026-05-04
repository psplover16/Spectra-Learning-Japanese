import { defineComponent, nextTick } from 'vue';
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createPracticeSession, providePracticeSession } from '@/modules/practice/composables/usePracticeSession';
import { useVocabularySession, type UseVocabularySessionOptions } from '@/modules/vocabulary/composables/useVocabularySession';
import { vocabularyJlptLevels } from '@/modules/vocabulary/types/vocabulary';
import { vocabularyMarksStorageKey } from '@/shared/config/storageKeys';

type VocabularySession = ReturnType<typeof useVocabularySession>;

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
});
