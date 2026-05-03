import { computed, onBeforeUnmount, ref } from 'vue';
import { usePracticeSession } from '@/modules/practice/composables/usePracticeSession';
import { vocabularyEntries } from '@/modules/vocabulary/data/jpWords';
import { deriveAllowedKanaSet, filterVocabularyEntries } from '@/modules/vocabulary/utils/vocabularyFilters';
import { vocabularyJlptLevels, type VocabularyJlptLevel } from '@/modules/vocabulary/types/vocabulary';
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
  const selectedJlptLevels = ref<Set<VocabularyJlptLevel>>(new Set(vocabularyJlptLevels));

  const persistedMarkedKeys = ref(new Set(readVocabularyMarksSnapshot(vocabularyEntries)?.markedKeys ?? []));
  const draftMarkedKeys = ref(new Set(persistedMarkedKeys.value));
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
    ),
    selectedJlptLevels: selectedJlptLevels.value
  }));

  const visibleEntries = computed(() =>
    filterVocabularyEntries(
      vocabularyEntries,
      filterState.value,
      practiceSession.includeHiragana.value,
      practiceSession.includeKatakana.value,
      persistedMarkedKeys.value
    )
  );

  const visibleEntryCount = computed(() => visibleEntries.value.length);
  const hasAnyVisibleEntries = computed(() => visibleEntryCount.value > 0);
  const allJlptLevelsSelected = computed(() =>
    vocabularyJlptLevels.every((level) => selectedJlptLevels.value.has(level))
  );
  const hasUnsavedMarkChanges = computed(() => {
    const next = [...draftMarkedKeys.value].sort();
    const current = [...persistedMarkedKeys.value].sort();

    return JSON.stringify(next) !== JSON.stringify(current);
  });

  function updateMarkedKeys(target: typeof draftMarkedKeys, key: string, value: boolean) {
    const next = new Set(target.value);

    if (value) {
      next.add(key);
    } else {
      next.delete(key);
    }

    target.value = next;
  }

  function toggleMarked(key: string, value: boolean) {
    updateMarkedKeys(draftMarkedKeys, key, value);
  }

  function setSelectedJlptLevels(levels: Iterable<VocabularyJlptLevel>) {
    selectedJlptLevels.value = new Set(levels);
  }

  function toggleJlptLevel(level: VocabularyJlptLevel, value: boolean) {
    const next = new Set(selectedJlptLevels.value);

    if (value) {
      next.add(level);
    } else {
      next.delete(level);
    }

    setSelectedJlptLevels(next);
  }

  function toggleAllJlptLevels(value: boolean) {
    setSelectedJlptLevels(value ? vocabularyJlptLevels : []);
  }

  function saveMarks() {
    if (!window.confirm('確定要註記嗎？')) {
      return false;
    }

    const snapshot = {
      version: 2 as const,
      markedKeys: [...draftMarkedKeys.value].sort(),
      updatedAt: new Date().toISOString()
    };

    if (!writeVocabularyMarksSnapshot(snapshot)) {
      window.alert('儲存註記失敗，請確認資料格式是否正確。');
      return false;
    }

    persistedMarkedKeys.value = new Set(snapshot.markedKeys);
    draftMarkedKeys.value = new Set(snapshot.markedKeys);
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
    persistedMarkedKeys.value = new Set();
    draftMarkedKeys.value = new Set();
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
    selectedJlptLevels,
    columnVisibility,
    persistedMarkedKeys,
    draftMarkedKeys,
    visibleEntries,
    visibleEntryCount,
    hasAnyVisibleEntries,
    allJlptLevelsSelected,
    hasUnsavedMarkChanges,
    revealedEntryId,
    setSelectedJlptLevels,
    toggleJlptLevel,
    toggleAllJlptLevels,
    toggleMarked,
    saveMarks,
    clearAllMarksWithConfirmation,
    beginReveal,
    endReveal
  };
}
