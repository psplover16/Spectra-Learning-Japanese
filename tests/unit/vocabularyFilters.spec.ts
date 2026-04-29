import { describe, expect, it } from 'vitest';
import { allKanaCells } from '@/modules/practice/data/kanaData';
import {
  deriveAllowedKanaSet,
  filterVocabularyEntries,
  matchesSearch,
  normalizeVocabularyEntries
} from '@/modules/vocabulary/utils/vocabularyFilters';
import type { RawVocabularyEntry } from '@/modules/vocabulary/types/vocabulary';

const rawEntries: RawVocabularyEntry[] = [
  { text: 'あさ', romanization: 'a-sa', kanji: '朝', meaning: '早上', stage: 'Stage1_基礎生活' },
  { text: 'かさ', romanization: 'ka-sa', kanji: '傘', meaning: '雨傘', stage: 'Stage1_基礎生活' }
];

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
      {
        searchText: '',
        showAllSounds: false,
        showKanji: true,
        showMarkedOnly: false,
        practiceMode: false,
        columnVisibility: { word: true, combined: false, meaning: false, preserveLayoutWhenHidden: true },
        allowedKanaSet
      },
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
});
