import { defineComponent, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createPracticeSession, providePracticeSession } from '@/modules/practice/composables/usePracticeSession';
import { useVocabularySession } from '@/modules/vocabulary/composables/useVocabularySession';
import { vocabularyEntries } from '@/modules/vocabulary/data/jpWords';
import { vocabularyMarksStorageKey } from '@/shared/config/storageKeys';

type VocabularySession = ReturnType<typeof useVocabularySession>;

function mountVocabularySession() {
  let session: VocabularySession | undefined;

  const SessionConsumer = defineComponent({
    setup() {
      session = useVocabularySession();

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

    const markedEntry = vocabularyEntries[0]!;
    const unmarkedEntry = vocabularyEntries[1]!;
    const { session, wrapper } = mountVocabularySession();

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
});
