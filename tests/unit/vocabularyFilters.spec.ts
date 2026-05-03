import { describe, expect, it } from 'vitest';
import { allKanaCells } from '@/modules/practice/data/kanaData';
import {
  buildVisibleStageGroups,
  deriveAllowedKanaSet,
  filterVocabularyEntries,
  groupVocabularyEntriesByStage,
  matchesSearch,
  normalizeVocabularyEntries
} from '@/modules/vocabulary/utils/vocabularyFilters';
import type { RawVocabularyEntry, VocabularyFilterState } from '@/modules/vocabulary/types/vocabulary';

const rawEntries: RawVocabularyEntry[] = [
  { text: 'あさ', romanization: 'a-sa', kanji: '朝', meaning: '早上', stage: 'N5' },
  { text: 'かさ', romanization: 'ka-sa', kanji: '傘', meaning: '雨傘', stage: 'N5' }
];

const allJlptLevels = ['N1', 'N2', 'N3', 'N4', 'N5'] as const;
type TestJlptLevel = (typeof allJlptLevels)[number];

function selectLevels(...levels: TestJlptLevel[]) {
  return new Set<TestJlptLevel>(levels);
}

function createFilterState(
  overrides: Partial<VocabularyFilterState> & { selectedJlptLevels?: Set<TestJlptLevel> } = {}
): VocabularyFilterState & { selectedJlptLevels: Set<TestJlptLevel> } {
  const { selectedJlptLevels = selectLevels(...allJlptLevels), ...filterOverrides } = overrides;

  return {
    searchText: '',
    showAllSounds: true,
    showKanji: true,
    showMarkedOnly: false,
    practiceMode: false,
    columnVisibility: { word: true, combined: false, meaning: false, preserveLayoutWhenHidden: true },
    allowedKanaSet: new Set<string>(),
    ...filterOverrides,
    selectedJlptLevels
  };
}

describe('vocabulary filters', () => {
  it('依已勾選假名過濾資料列', () => {
    const entries = normalizeVocabularyEntries(rawEntries);
    const selectedKana = [
      allKanaCells.find((cell) => cell.id === 'tableA-a')!,
      allKanaCells.find((cell) => cell.id === 'tableA-sa')!
    ];
    const allowedKanaSet = deriveAllowedKanaSet(selectedKana, true, false);

    const result = filterVocabularyEntries(
      entries,
      createFilterState({
        showAllSounds: false,
        allowedKanaSet
      }),
      true,
      false,
      []
    );

    expect(result).toHaveLength(1);
    expect(result[0]?.text).toBe('あさ');
  });

  it('搜尋可命中中文、拼音與漢字', () => {
    const entry = normalizeVocabularyEntries(rawEntries)[0]!;

    expect(matchesSearch(entry, 'あさ')).toBe(true);
    expect(matchesSearch(entry, '早上')).toBe(true);
    expect(matchesSearch(entry, 'asa')).toBe(true);
    expect(matchesSearch(entry, '朝')).toBe(true);
    expect(matchesSearch(entry, '不存在')).toBe(false);
  });

  it('只選 N5 時僅保留 N5 單字', () => {
    const entries = normalizeVocabularyEntries([
      { text: 'あさ', romanization: 'a-sa', kanji: '朝', meaning: '早上', stage: 'N5' },
      { text: 'かさ', romanization: 'ka-sa', kanji: '傘', meaning: '雨傘', stage: 'N4' },
      { text: 'ぎんこう', romanization: 'gin-kou', kanji: '銀行', meaning: '銀行', stage: 'N1' }
    ]);

    const result = filterVocabularyEntries(
      entries,
      createFilterState({ selectedJlptLevels: selectLevels('N5') }),
      true,
      true,
      []
    );

    expect(result.map((entry) => entry.text)).toEqual(['あさ']);
  });

  it('level 集合為空時回傳空清單且不拋錯', () => {
    const entries = normalizeVocabularyEntries([
      { text: 'あさ', romanization: 'a-sa', kanji: '朝', meaning: '早上', stage: 'N5' },
      { text: 'かさ', romanization: 'ka-sa', kanji: '傘', meaning: '雨傘', stage: 'N4' }
    ]);
    let result: ReturnType<typeof filterVocabularyEntries> = [];

    expect(() => {
      result = filterVocabularyEntries(
        entries,
        createFilterState({ selectedJlptLevels: selectLevels() }),
        true,
        true,
        []
      );
    }).not.toThrow();

    expect(result).toEqual([]);
  });

  it('同時套用搜尋與 level 篩選時只保留兩者皆符合的單字', () => {
    const entries = normalizeVocabularyEntries([
      { text: 'あさ', romanization: 'a-sa', kanji: '朝', meaning: '早上', stage: 'N5' },
      { text: 'あさい', romanization: 'a-sai', kanji: '浅い', meaning: '淺的', stage: 'N4' },
      { text: 'みず', romanization: 'mi-zu', kanji: '水', meaning: '水', stage: 'N5' }
    ]);

    const result = filterVocabularyEntries(
      entries,
      createFilterState({ searchText: 'asa', selectedJlptLevels: selectLevels('N5') }),
      true,
      true,
      []
    );

    expect(result.map((entry) => entry.text)).toEqual(['あさ']);
  });

  it('同時套用只顯示註記與 level 篩選時只保留已註記且符合 level 的單字', () => {
    const entries = normalizeVocabularyEntries([
      { text: 'あさ', romanization: 'a-sa', kanji: '朝', meaning: '早上', stage: 'N5' },
      { text: 'かさ', romanization: 'ka-sa', kanji: '傘', meaning: '雨傘', stage: 'N4' },
      { text: 'みず', romanization: 'mi-zu', kanji: '水', meaning: '水', stage: 'N5' }
    ]);

    const result = filterVocabularyEntries(
      entries,
      createFilterState({ showMarkedOnly: true, selectedJlptLevels: selectLevels('N5') }),
      true,
      true,
      [entries[0]!.markKey, entries[1]!.markKey]
    );

    expect(result.map((entry) => entry.text)).toEqual(['あさ']);
  });

  it('以同一份 visible vocabulary 結果產生 stage groups', () => {
    const entries = normalizeVocabularyEntries([
      { text: 'あさ', romanization: 'a-sa', kanji: '朝', meaning: '早上', stage: 'N5' },
      { text: 'あさい', romanization: 'a-sai', kanji: '浅い', meaning: '淺的', stage: 'N4' },
      { text: 'みず', romanization: 'mi-zu', kanji: '水', meaning: '水', stage: 'N5' },
      { text: 'あさひ', romanization: 'a-sa-hi', kanji: '朝日', meaning: '朝陽', stage: 'N1' }
    ]);
    const visibleEntries = filterVocabularyEntries(
      entries,
      createFilterState({
        searchText: 'asa',
        showMarkedOnly: true,
        selectedJlptLevels: selectLevels('N5')
      }),
      true,
      true,
      [entries[0]!.markKey, entries[1]!.markKey, entries[3]!.markKey]
    );
    const visibleStageGroups = buildVisibleStageGroups(groupVocabularyEntriesByStage(entries), visibleEntries);

    expect(visibleStageGroups.flatMap((group) => group.visibleEntries)).toEqual(visibleEntries);
    expect(visibleStageGroups.map((group) => ({ stage: group.stage, visibleCount: group.visibleCount }))).toEqual([
      { stage: 'N5', visibleCount: 1 }
    ]);
  });
});
