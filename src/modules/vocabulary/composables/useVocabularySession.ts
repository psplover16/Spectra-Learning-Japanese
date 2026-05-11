import { computed, onBeforeUnmount, onDeactivated, ref, watch } from 'vue';
import { usePracticeSession } from '@/modules/practice/composables/usePracticeSession';
import { deriveAllowedKanaSet, filterVocabularyEntries } from '@/modules/vocabulary/utils/vocabularyFilters';
import {
  vocabularyJlptLevels,
  type RawVocabularyEntry,
  type VocabularyJlptLevel
} from '@/modules/vocabulary/types/vocabulary';
import {
  clearVocabularyMarksSnapshot,
  readVocabularyMarksSnapshot,
  writeVocabularyMarksSnapshot
} from '@/modules/vocabulary/storage/vocabularyMarksStorage';
import { migrateMarksFromLocalStorage } from '@/modules/vocabulary/storage/vocabularyMarksMigration';
import { normalizeVocabularyEntries } from '@/modules/vocabulary/utils/vocabularyFilters';

type VocabularyStageLoader = () => Promise<{ default: RawVocabularyEntry[] }>;

const vocabularyStageLoaders: Record<VocabularyJlptLevel, VocabularyStageLoader> = {
  N1: () => import('@/modules/vocabulary/data/jpWords_N1'),
  N2: () => import('@/modules/vocabulary/data/jpWords_N2'),
  N3: () => import('@/modules/vocabulary/data/jpWords_N3'),
  N4: () => import('@/modules/vocabulary/data/jpWords_N4'),
  N5: () => import('@/modules/vocabulary/data/jpWords_N5')
};
const vocabularyJlptLoadOrder: VocabularyJlptLevel[] = ['N5', 'N4', 'N3', 'N2', 'N1'];

export interface UseVocabularySessionOptions {
  stageLoaders?: Partial<Record<VocabularyJlptLevel, VocabularyStageLoader>>;
}

export function useVocabularySession(options: UseVocabularySessionOptions = {}) {
  const stageLoaders = {
    ...vocabularyStageLoaders,
    ...options.stageLoaders
  };
  const practiceSession = usePracticeSession();
  const searchText = ref('');
  const showAllSounds = ref(true);
  const showKanji = ref(true);
  const showMarkedOnly = ref(false);
  const readingMode = ref(false);
  const wordColumnVisible = ref(true);
  const wordPracticeVisible = ref(false);
  const combinedColumnVisible = ref(false);
  const meaningColumnVisible = ref(false);
  const revealedEntryId = ref<number | null>(null);
  const selectedJlptLevels = ref<Set<VocabularyJlptLevel>>(new Set(vocabularyJlptLevels));
  const loadedStageEntries = ref<Partial<Record<VocabularyJlptLevel, RawVocabularyEntry[]>>>({});
  const loadingJlptLevels = ref<Set<VocabularyJlptLevel>>(new Set());
  const vocabularyLoadError = ref<string | null>(null);
  const marksHydrated = ref(false);
  const stageLoadPromises = new Map<VocabularyJlptLevel, Promise<void>>();

  const persistedMarkedKeys = ref(new Set<string>());
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
    columnVisibility: columnVisibility.value,
    allowedKanaSet: deriveAllowedKanaSet(
      practiceSession.selectedKanaItems.value,
      practiceSession.includeHiragana.value,
      practiceSession.includeKatakana.value
    ),
    selectedJlptLevels: selectedJlptLevels.value
  }));

  const vocabularyEntries = computed(() => {
    const rawEntries = vocabularyJlptLevels.flatMap((level) => loadedStageEntries.value[level] ?? []);

    return normalizeVocabularyEntries(rawEntries);
  });

  const isLoadingVocabulary = computed(() =>
    [...selectedJlptLevels.value].some((level) => loadingJlptLevels.value.has(level))
  );
  const hasVocabularyLoadError = computed(() => vocabularyLoadError.value !== null);

  const visibleEntries = computed(() =>
    filterVocabularyEntries(
      vocabularyEntries.value,
      filterState.value,
      practiceSession.includeHiragana.value,
      practiceSession.includeKatakana.value,
      persistedMarkedKeys.value
    )
  );

  const visibleEntryCount = computed(() => visibleEntries.value.length);
  const hasAnyVisibleEntries = computed(() => visibleEntryCount.value > 0);
  const hasUnsavedMarkChanges = computed(() => {
    const next = [...draftMarkedKeys.value].sort();
    const current = [...persistedMarkedKeys.value].sort();

    return JSON.stringify(next) !== JSON.stringify(current);
  });
  const allVisibleDraftMarked = computed(() => {
    const visibleMarkKeyScope = getVisibleMarkKeyScope();

    return visibleMarkKeyScope.size > 0 && [...visibleMarkKeyScope].every((key) => draftMarkedKeys.value.has(key));
  });

  function replaceLoadingJlptLevels(updater: (next: Set<VocabularyJlptLevel>) => void) {
    const next = new Set(loadingJlptLevels.value);
    updater(next);
    loadingJlptLevels.value = next;
  }

  function haveSameMarkKeys(left: ReadonlySet<string>, right: ReadonlySet<string>) {
    return left.size === right.size && [...left].every((key) => right.has(key));
  }

  async function hydrateMarksWhenAllStagesLoaded() {
    if (marksHydrated.value) {
      return;
    }

    if (!vocabularyJlptLevels.every((level) => loadedStageEntries.value[level] !== undefined)) {
      return;
    }

    // Idempotent: handles v1 (with dictionary) leftover localStorage data;
    // no-op if migration already completed at app startup.
    await migrateMarksFromLocalStorage(vocabularyEntries.value);

    const snapshot = await readVocabularyMarksSnapshot(vocabularyEntries.value);
    const nextPersistedMarkedKeys = new Set<string>(snapshot?.markedKeys ?? []);
    const hasLocalDraftChanges = !haveSameMarkKeys(draftMarkedKeys.value, persistedMarkedKeys.value);

    persistedMarkedKeys.value = nextPersistedMarkedKeys;
    draftMarkedKeys.value = hasLocalDraftChanges
      ? new Set<string>([...nextPersistedMarkedKeys, ...draftMarkedKeys.value])
      : new Set<string>(nextPersistedMarkedKeys);
    marksHydrated.value = true;
  }

  function orderRequestedJlptLevels(levels: Iterable<VocabularyJlptLevel>) {
    const requestedLevels = new Set(levels);

    return vocabularyJlptLoadOrder.filter((level) => requestedLevels.has(level));
  }

  async function loadVocabularyStages(levels: Iterable<VocabularyJlptLevel>) {
    const requestedLevels = orderRequestedJlptLevels(levels);
    const levelsToLoad = requestedLevels.filter(
      (level) => loadedStageEntries.value[level] === undefined && !stageLoadPromises.has(level)
    );

    if (levelsToLoad.length === 0) {
      await Promise.all(requestedLevels.map((level) => stageLoadPromises.get(level)).filter(Boolean));
      await hydrateMarksWhenAllStagesLoaded();
      return;
    }

    replaceLoadingJlptLevels((next) => {
      for (const level of levelsToLoad) {
        next.add(level);
      }
    });

    const pendingRequestedLoads = requestedLevels.map((level) => stageLoadPromises.get(level)).filter(Boolean);
    if (pendingRequestedLoads.length > 0) {
      await Promise.all(pendingRequestedLoads);
    }

    for (const level of levelsToLoad) {
      if (loadedStageEntries.value[level] !== undefined) {
        replaceLoadingJlptLevels((next) => {
          next.delete(level);
        });
        continue;
      }

      const loadPromise = (async () => {
        try {
          const module = await stageLoaders[level]();
          loadedStageEntries.value = {
            ...loadedStageEntries.value,
            [level]: module.default
          };

          if (vocabularyLoadError.value?.includes(level)) {
            vocabularyLoadError.value = null;
          }
        } catch {
          vocabularyLoadError.value = `單字資料載入失敗：${level}`;
        } finally {
          replaceLoadingJlptLevels((next) => {
            next.delete(level);
          });
          stageLoadPromises.delete(level);
        }
      })();

      stageLoadPromises.set(level, loadPromise);
      await loadPromise;
    }

    await hydrateMarksWhenAllStagesLoaded();
  }

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

  function getVisibleMarkKeyScope() {
    return new Set(visibleEntries.value.map((entry) => entry.markKey));
  }

  function bulkToggleVisibleDraftMarks(value: boolean) {
    const visibleMarkKeyScope = getVisibleMarkKeyScope();
    const nextMarkedKeys = new Set(draftMarkedKeys.value);

    for (const key of visibleMarkKeyScope) {
      if (value) {
        nextMarkedKeys.add(key);
      } else {
        nextMarkedKeys.delete(key);
      }
    }

    draftMarkedKeys.value = nextMarkedKeys;
  }

  async function persistMarkedKeys(markedKeys: Set<string>): Promise<boolean> {
    if (markedKeys.size === 0) {
      await clearVocabularyMarksSnapshot();
      persistedMarkedKeys.value = new Set();
      draftMarkedKeys.value = new Set();
      return true;
    }

    const snapshot = {
      version: 2 as const,
      markedKeys: [...markedKeys].sort(),
      updatedAt: new Date().toISOString()
    };

    const writeOk = await writeVocabularyMarksSnapshot(snapshot);
    if (!writeOk) {
      window.alert('儲存註記失敗，請確認資料格式是否正確。');
      return false;
    }

    persistedMarkedKeys.value = new Set(snapshot.markedKeys);
    draftMarkedKeys.value = new Set(snapshot.markedKeys);
    return true;
  }

  async function saveMarks(): Promise<boolean> {
    if (!window.confirm('確定要註記嗎？')) {
      return false;
    }

    const visibleMarkKeyScope = getVisibleMarkKeyScope();
    const nextMarkedKeys = new Set(persistedMarkedKeys.value);

    for (const key of visibleMarkKeyScope) {
      if (draftMarkedKeys.value.has(key)) {
        nextMarkedKeys.add(key);
      } else {
        nextMarkedKeys.delete(key);
      }
    }

    return persistMarkedKeys(nextMarkedKeys);
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

  function clearRevealState() {
    clearRevealTimer();
    revealedEntryId.value = null;
  }

  onBeforeUnmount(clearRevealState);
  onDeactivated(clearRevealState);

  watch(
    selectedJlptLevels,
    (levels) => {
      void loadVocabularyStages(levels);
    },
    { immediate: true }
  );

  return {
    searchText,
    showAllSounds,
    showKanji,
    showMarkedOnly,
    readingMode,
    wordColumnVisible,
    wordPracticeVisible,
    combinedColumnVisible,
    meaningColumnVisible,
    selectedJlptLevels,
    columnVisibility,
    persistedMarkedKeys,
    draftMarkedKeys,
    loadedStageEntries,
    loadingJlptLevels,
    vocabularyLoadError,
    vocabularyEntries,
    isLoadingVocabulary,
    hasVocabularyLoadError,
    visibleEntries,
    visibleEntryCount,
    hasAnyVisibleEntries,
    hasUnsavedMarkChanges,
    allVisibleDraftMarked,
    revealedEntryId,
    setSelectedJlptLevels,
    toggleJlptLevel,
    toggleMarked,
    bulkToggleVisibleDraftMarks,
    loadVocabularyStages,
    saveMarks,
    beginReveal,
    endReveal
  };
}
