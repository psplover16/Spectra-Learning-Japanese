import { computed, onBeforeUnmount, ref } from 'vue';
import { usePracticeSession } from '@/modules/practice/composables/usePracticeSession';
import { vocabularyEntries } from '@/modules/vocabulary/data/jpWords';
import { deriveAllowedKanaSet, filterVocabularyEntries } from '@/modules/vocabulary/utils/vocabularyFilters';
import {
  clearVocabularyMarksSnapshot,
  readVocabularyMarksSnapshot,
  writeVocabularyMarksSnapshot
} from '@/modules/vocabulary/storage/vocabularyMarksStorage';

export function useVocabularySession() {
  const practiceSession = usePracticeSession();
  const searchText = ref('');
  const showAllSounds = ref(true);
  const showKanji = ref(true);
  const showMarkedOnly = ref(false);
  const practiceMode = ref(false);
  const wordColumnVisible = ref(true);
  const combinedColumnVisible = ref(false);
  const meaningColumnVisible = ref(false);
  const revealedEntryId = ref<number | null>(null);

  const persistedMarkedIds = ref(readVocabularyMarksSnapshot()?.markedIds ?? []);
  const draftMarkedIds = ref([...persistedMarkedIds.value]);
  let revealTimer: number | null = null;

  const columnVisibility = computed(() => ({
    word: wordColumnVisible.value,
    combined: combinedColumnVisible.value,
    meaning: meaningColumnVisible.value,
    preserveLayoutWhenHidden: true as const
  }));

  const filterState = computed(() => ({
    searchText: searchText.value,
    showAllSounds: showAllSounds.value,
    showKanji: showKanji.value,
    showMarkedOnly: showMarkedOnly.value,
    practiceMode: practiceMode.value,
    columnVisibility: columnVisibility.value,
    allowedKanaSet: deriveAllowedKanaSet(
      practiceSession.selectedKanaItems.value,
      practiceSession.includeHiragana.value,
      practiceSession.includeKatakana.value
    )
  }));

  const visibleEntries = computed(() =>
    filterVocabularyEntries(
      vocabularyEntries,
      filterState.value,
      practiceSession.includeHiragana.value,
      practiceSession.includeKatakana.value,
      persistedMarkedIds.value
    )
  );

  const visibleEntryCount = computed(() => visibleEntries.value.length);
  const hasAnyVisibleEntries = computed(() => visibleEntryCount.value > 0);
  const hasUnsavedMarkChanges = computed(() => {
    const next = [...draftMarkedIds.value].sort((a, b) => a - b);
    const current = [...persistedMarkedIds.value].sort((a, b) => a - b);

    return JSON.stringify(next) !== JSON.stringify(current);
  });

  function updateMarkedIds(target: typeof draftMarkedIds, id: number, value: boolean) {
    const next = new Set(target.value);

    if (value) {
      next.add(id);
    } else {
      next.delete(id);
    }

    target.value = [...next].sort((a, b) => a - b);
  }

  function toggleMarked(id: number, value: boolean) {
    updateMarkedIds(draftMarkedIds, id, value);
  }

  function saveMarks() {
    if (!window.confirm('確定要註記嗎？')) {
      return false;
    }

    const snapshot = {
      version: 1 as const,
      markedIds: [...new Set(draftMarkedIds.value)].sort((a, b) => a - b),
      updatedAt: new Date().toISOString()
    };

    if (!writeVocabularyMarksSnapshot(snapshot)) {
      window.alert('儲存註記失敗，請確認資料格式是否正確。');
      return false;
    }

    persistedMarkedIds.value = [...snapshot.markedIds];
    draftMarkedIds.value = [...snapshot.markedIds];
    return true;
  }

  function clearAllMarksWithConfirmation() {
    if (!window.confirm('確定要刪除全部註記嗎？')) {
      return;
    }

    if (!window.confirm('刪除後，無法復原，確定要刪除嗎？')) {
      return;
    }

    clearVocabularyMarksSnapshot();
    persistedMarkedIds.value = [];
    draftMarkedIds.value = [];
  }

  function clearRevealTimer() {
    if (revealTimer !== null) {
      window.clearTimeout(revealTimer);
      revealTimer = null;
    }
  }

  function beginReveal(id: number) {
    clearRevealTimer();

    revealTimer = window.setTimeout(() => {
      revealedEntryId.value = id;
      revealTimer = null;
    }, 400);
  }

  function endReveal(id?: number) {
    clearRevealTimer();

    if (id === undefined || revealedEntryId.value === id) {
      revealedEntryId.value = null;
    }
  }

  onBeforeUnmount(() => {
    clearRevealTimer();
  });

  return {
    searchText,
    showAllSounds,
    showKanji,
    showMarkedOnly,
    practiceMode,
    wordColumnVisible,
    combinedColumnVisible,
    meaningColumnVisible,
    columnVisibility,
    persistedMarkedIds,
    draftMarkedIds,
    visibleEntries,
    visibleEntryCount,
    hasAnyVisibleEntries,
    hasUnsavedMarkChanges,
    revealedEntryId,
    toggleMarked,
    saveMarks,
    clearAllMarksWithConfirmation,
    beginReveal,
    endReveal
  };
}
