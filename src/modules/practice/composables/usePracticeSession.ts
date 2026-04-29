import { computed, inject, provide, reactive, ref, watch, type ComputedRef, type InjectionKey, type Ref } from 'vue';
import { calculateQuestionCount } from '@/shared/utils/questionCount';
import { allKanaCells, tableARows, tableAColumnHeaders, tableBRows } from '@/modules/practice/data/kanaData';
import type { KanaCell, SelectionDetailItem } from '@/modules/practice/types/practice';

export interface PracticeSession {
  includeHiragana: Ref<boolean>;
  includeKatakana: Ref<boolean>;
  showArchaicKana: Ref<boolean>;
  enableSokuon: Ref<boolean>;
  enableYoonChoon: Ref<boolean>;
  questionCountInput: Ref<string>;
  selectedKanaCount: ComputedRef<number>;
  recommendedQuestionCount: ComputedRef<number>;
  effectiveQuestionCount: ComputedRef<number>;
  selectedKanaItems: ComputedRef<KanaCell[]>;
  selectedKanaDetailItems: ComputedRef<SelectionDetailItem[]>;
  selectedOptionDetailItems: ComputedRef<SelectionDetailItem[]>;
  allKanaSelected: ComputedRef<boolean>;
  dakuonSelected: ComputedRef<boolean>;
  canStartExam: ComputedRef<boolean>;
  isKanaChecked: (kanaId: string) => boolean;
  isCellSelectable: (cell: KanaCell) => boolean;
  toggleKana: (cell: KanaCell, value: boolean) => void;
  isRowChecked: (rowKey: string) => boolean;
  toggleRow: (rowKey: string, value: boolean) => void;
  isColumnChecked: (columnKey: string) => boolean;
  toggleColumn: (columnKey: string, value: boolean) => void;
  toggleAllKana: (value: boolean) => void;
  toggleDakuon: (value: boolean) => void;
  setQuestionCount: (value: string) => void;
  resetAll: () => void;
}

const practiceSessionKey: InjectionKey<PracticeSession> = Symbol('practice-session');

const tableARowMembers = tableARows.reduce<Record<string, string[]>>((accumulator, row) => {
  accumulator[row.rowKey] = row.cells.filter((cell): cell is KanaCell => cell !== null).map((cell) => cell.id);
  return accumulator;
}, {});

const tableAColumnMembers = tableAColumnHeaders.reduce<Record<string, string[]>>((accumulator, column) => {
  accumulator[column.key] = allKanaCells
    .filter((cell) => cell.table === 'tableA' && cell.columnKey === column.key)
    .map((cell) => cell.id);
  return accumulator;
}, {});

const tableBMembers = tableBRows.flatMap((row) => row.cells.filter((cell): cell is KanaCell => cell !== null).map((cell) => cell.id));

export function createPracticeSession(): PracticeSession {
  const includeHiragana = ref(true);
  const includeKatakana = ref(true);
  const showArchaicKana = ref(false);
  const enableSokuon = ref(false);
  const enableYoonChoon = ref(false);
  const questionCountInput = ref('0');
  const selectedKanaMap = reactive<Record<string, boolean>>({});
  const useAutoQuestionCount = ref(true);

  const selectedKanaItems = computed(() =>
    allKanaCells.filter((cell) => {
      if (!selectedKanaMap[cell.id]) {
        return false;
      }

      if (cell.archaic && !showArchaicKana.value) {
        return false;
      }

      return cell.selectable !== false;
    })
  );

  const selectedKanaCount = computed(() => selectedKanaItems.value.length);

  const recommendedQuestionCount = computed(() =>
    calculateQuestionCount(selectedKanaCount.value, includeHiragana.value, includeKatakana.value)
  );

  const effectiveQuestionCount = computed(() => {
    const parsed = Number.parseInt(questionCountInput.value, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  });

  const selectedKanaDetailItems = computed<SelectionDetailItem[]>(() =>
    selectedKanaItems.value.map((cell) => ({
      id: cell.id,
      kind: 'kana',
      label: `${cell.hiragana} / ${cell.katakana} ${cell.romaji}`
    }))
  );

  const selectedOptionDetailItems = computed<SelectionDetailItem[]>(() => {
    const items: SelectionDetailItem[] = [];

    if (enableSokuon.value) {
      items.push({ id: 'sokuon', kind: 'option', label: '促音' });
    }

    if (enableYoonChoon.value) {
      items.push({ id: 'yoon-choon', kind: 'option', label: '拗音／合拗音／長音符' });
    }

    return items;
  });

  const allSelectableKanaIds = computed(() =>
    allKanaCells
      .filter((cell) => cell.selectable !== false)
      .filter((cell) => showArchaicKana.value || !cell.archaic)
      .map((cell) => cell.id)
  );

  const allKanaSelected = computed(
    () => allSelectableKanaIds.value.length > 0 && allSelectableKanaIds.value.every((id) => selectedKanaMap[id])
  );

  const dakuonSelectableIds = computed(() =>
    tableBMembers.filter((id) => {
      const cell = allKanaCells.find((item) => item.id === id);
      return cell ? showArchaicKana.value || !cell.archaic : false;
    })
  );

  const dakuonSelected = computed(
    () => dakuonSelectableIds.value.length > 0 && dakuonSelectableIds.value.every((id) => selectedKanaMap[id])
  );

  const canStartExam = computed(
    () =>
      selectedKanaCount.value > 0 &&
      effectiveQuestionCount.value >= 1 &&
      (includeHiragana.value || includeKatakana.value)
  );

  function syncQuestionCount(): void {
    if (!useAutoQuestionCount.value) {
      return;
    }

    questionCountInput.value = String(recommendedQuestionCount.value);
  }

  watch(recommendedQuestionCount, () => {
    syncQuestionCount();
  });

  watch([includeHiragana, includeKatakana], () => {
    useAutoQuestionCount.value = true;
    syncQuestionCount();
  });

  watch(showArchaicKana, (value) => {
    if (value) {
      return;
    }

    for (const cell of allKanaCells) {
      if (cell.archaic) {
        selectedKanaMap[cell.id] = false;
      }
    }
  });

  syncQuestionCount();

  function isCellSelectable(cell: KanaCell): boolean {
    if (cell.selectable === false) {
      return false;
    }

    if (cell.archaic && !showArchaicKana.value) {
      return false;
    }

    return true;
  }

  function isKanaChecked(kanaId: string): boolean {
    return selectedKanaMap[kanaId] ?? false;
  }

  function toggleKana(cell: KanaCell, value: boolean): void {
    if (!isCellSelectable(cell)) {
      selectedKanaMap[cell.id] = false;
      return;
    }

    selectedKanaMap[cell.id] = value;
    useAutoQuestionCount.value = true;
    syncQuestionCount();
  }

  function isRowChecked(rowKey: string): boolean {
    const rowIds = tableARowMembers[rowKey] ?? [];
    const activeIds = rowIds.filter((id) => {
      const cell = allKanaCells.find((item) => item.id === id);
      return cell ? isCellSelectable(cell) : false;
    });

    return activeIds.length > 0 && activeIds.every((id) => selectedKanaMap[id]);
  }

  function toggleRow(rowKey: string, value: boolean): void {
    for (const id of tableARowMembers[rowKey] ?? []) {
      const cell = allKanaCells.find((item) => item.id === id);

      if (cell) {
        toggleKana(cell, value);
      }
    }
  }

  function isColumnChecked(columnKey: string): boolean {
    const columnIds = tableAColumnMembers[columnKey] ?? [];
    const activeIds = columnIds.filter((id) => {
      const cell = allKanaCells.find((item) => item.id === id);
      return cell ? isCellSelectable(cell) : false;
    });

    return activeIds.length > 0 && activeIds.every((id) => selectedKanaMap[id]);
  }

  function toggleColumn(columnKey: string, value: boolean): void {
    for (const id of tableAColumnMembers[columnKey] ?? []) {
      const cell = allKanaCells.find((item) => item.id === id);

      if (cell) {
        toggleKana(cell, value);
      }
    }
  }

  function toggleAllKana(value: boolean): void {
    for (const cell of allKanaCells) {
      if (cell.table === 'tableA' || cell.table === 'tableB') {
        toggleKana(cell, value);
      }
    }
  }

  function toggleDakuon(value: boolean): void {
    for (const id of tableBMembers) {
      const cell = allKanaCells.find((item) => item.id === id);

      if (cell) {
        toggleKana(cell, value);
      }
    }
  }

  function setQuestionCount(value: string): void {
    const sanitized = value.replace(/[^\d]/g, '');
    questionCountInput.value = sanitized;
    useAutoQuestionCount.value = false;
  }

  function resetAll(): void {
    for (const cell of allKanaCells) {
      selectedKanaMap[cell.id] = false;
    }

    includeHiragana.value = true;
    includeKatakana.value = true;
    enableSokuon.value = false;
    enableYoonChoon.value = false;
    showArchaicKana.value = false;
    useAutoQuestionCount.value = true;
    syncQuestionCount();
  }

  const publicApi: PracticeSession = {
    includeHiragana,
    includeKatakana,
    showArchaicKana,
    enableSokuon,
    enableYoonChoon,
    questionCountInput,
    selectedKanaCount,
    recommendedQuestionCount,
    effectiveQuestionCount,
    selectedKanaItems,
    selectedKanaDetailItems,
    selectedOptionDetailItems,
    allKanaSelected,
    dakuonSelected,
    canStartExam,
    isKanaChecked,
    isCellSelectable,
    toggleKana,
    isRowChecked,
    toggleRow,
    isColumnChecked,
    toggleColumn,
    toggleAllKana,
    toggleDakuon,
    setQuestionCount,
    resetAll
  };

  return publicApi;
}

export function providePracticeSession(session: PracticeSession): void {
  provide(practiceSessionKey, session);
}

export function usePracticeSession(): PracticeSession {
  const session = inject(practiceSessionKey);

  if (!session) {
    throw new Error('Practice session has not been provided.');
  }

  return session;
}
