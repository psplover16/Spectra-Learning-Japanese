import type { KanaCell } from '@/modules/practice/types/practice';
import type {
  RawVocabularyEntry,
  VocabularyEntry,
  VocabularyStageGroup,
  VisibleVocabularyStageGroup,
  VocabularyJlptLevel,
  VocabularyFilterState
} from '@/modules/vocabulary/types/vocabulary';

const smallKanaSet = new Set(['ゃ', 'ゅ', 'ょ', 'ぁ', 'ぃ', 'ぅ', 'ぇ', 'ぉ', 'ゎ', 'っ', 'ャ', 'ュ', 'ョ', 'ァ', 'ィ', 'ゥ', 'ェ', 'ォ', 'ヮ', 'ッ', 'ー']);
const punctuationSet = new Set([' ', '\n', '\r', '\t', '・', '／', '/', '〜', '～', '(', ')', '（', '）', '　']);
const vocabularyJlptLearningOrder: Record<VocabularyJlptLevel, number> = {
  N5: 0,
  N4: 1,
  N3: 2,
  N2: 3,
  N1: 4
};

function convertKanaByCodePoint(text: string, offset: number, start: number, end: number) {
  return Array.from(text)
    .map((char) => {
      const codePoint = char.codePointAt(0);

      if (codePoint === undefined || codePoint < start || codePoint > end) {
        return char;
      }

      return String.fromCodePoint(codePoint + offset);
    })
    .join('');
}

export function toHiragana(text: string) {
  return convertKanaByCodePoint(text, -0x60, 0x30a1, 0x30f6);
}

export function toKatakana(text: string) {
  return convertKanaByCodePoint(text, 0x60, 0x3041, 0x3096);
}

export function swapKanaScripts(text: string) {
  return Array.from(text)
    .map((char) => {
      const codePoint = char.codePointAt(0);

      if (codePoint === undefined) {
        return char;
      }

      if (codePoint >= 0x3041 && codePoint <= 0x3096) {
        return String.fromCodePoint(codePoint + 0x60);
      }

      if (codePoint >= 0x30a1 && codePoint <= 0x30f6) {
        return String.fromCodePoint(codePoint - 0x60);
      }

      return char;
    })
    .join('');
}

export function normalizeSearchText(text: string) {
  return text.trim().replace(/\s+/g, '').toLowerCase();
}

export function extractKanaUnits(text: string) {
  return Array.from(text).filter((char) => !punctuationSet.has(char));
}

export function createVocabularyMarkKey(entry: Pick<RawVocabularyEntry, 'text' | 'kanji'>) {
  return `${entry.text}|${entry.kanji}`;
}

export function normalizeVocabularyEntries(entries: RawVocabularyEntry[]): VocabularyEntry[] {
  return entries.map((entry, index) => ({
    id: index + 1,
    markKey: createVocabularyMarkKey(entry),
    text: entry.text,
    romanization: entry.romanization,
    kanji: entry.kanji,
    meaning: entry.meaning,
    stage: entry.stage,
    textKanaUnits: extractKanaUnits(entry.text),
    hasKanji: entry.kanji.trim().length > 0
  }));
}

export function groupVocabularyEntriesByStage(entries: VocabularyEntry[]): VocabularyStageGroup[] {
  const groups = new Map<VocabularyJlptLevel, VocabularyEntry[]>();

  for (const entry of entries) {
    const current = groups.get(entry.stage) ?? [];
    current.push(entry);
    groups.set(entry.stage, current);
  }

  return Array.from(groups.entries()).map(([stage, stageEntries]) => ({
    stage,
    entries: stageEntries
  }));
}

export function deriveAllowedKanaSet(
  selectedKanaItems: KanaCell[],
  includeHiragana: boolean,
  includeKatakana: boolean
) {
  void includeHiragana;
  void includeKatakana;

  const allowedKana = new Set<string>();

  for (const item of selectedKanaItems) {
    allowedKana.add(item.hiragana);
    allowedKana.add(item.katakana);
  }

  return allowedKana;
}

function allUnitsAllowed(text: string, allowedKanaSet: Set<string>) {
  return extractKanaUnits(text).every((char) => smallKanaSet.has(char) || allowedKanaSet.has(char));
}

export function matchesPracticeSelection(
  entry: VocabularyEntry,
  allowedKanaSet: Set<string>,
  includeHiragana: boolean,
  includeKatakana: boolean,
  showAllSounds: boolean
) {
  void includeHiragana;
  void includeKatakana;

  if (showAllSounds) {
    return true;
  }

  if (allowedKanaSet.size === 0) {
    return false;
  }

  return allUnitsAllowed(entry.text, allowedKanaSet);
}

export function matchesSearch(entry: VocabularyEntry, searchText: string) {
  const normalizedSearch = normalizeSearchText(searchText);

  if (!normalizedSearch) {
    return true;
  }

  const haystacks = [
    normalizeSearchText(entry.text),
    normalizeSearchText(entry.kanji),
    normalizeSearchText(entry.meaning),
    normalizeSearchText(entry.romanization),
    normalizeSearchText(entry.romanization.replace(/-/g, ''))
  ];

  return haystacks.some((haystack) => haystack.includes(normalizedSearch));
}

export function matchesJlptLevel(entry: VocabularyEntry, selectedJlptLevels: Set<VocabularyJlptLevel>) {
  return selectedJlptLevels.has(entry.stage);
}

export function filterVocabularyEntries(
  entries: VocabularyEntry[],
  filterState: VocabularyFilterState,
  includeHiragana: boolean,
  includeKatakana: boolean,
  markedKeys: Iterable<string>
) {
  const markedKeySet = new Set(markedKeys);

  return entries
    .filter((entry) => {
      if (!matchesJlptLevel(entry, filterState.selectedJlptLevels)) {
        return false;
      }

      if (!matchesPracticeSelection(entry, filterState.allowedKanaSet, includeHiragana, includeKatakana, filterState.showAllSounds)) {
        return false;
      }

      if (!matchesSearch(entry, filterState.searchText)) {
        return false;
      }

      if (filterState.showMarkedOnly && !markedKeySet.has(entry.markKey)) {
        return false;
      }

      return true;
    })
    .sort((left, right) => {
      const stageOrder = vocabularyJlptLearningOrder[left.stage] - vocabularyJlptLearningOrder[right.stage];

      if (stageOrder !== 0) {
        return stageOrder;
      }

      return left.id - right.id;
    });
}

export function buildVisibleStageGroups(
  stageGroups: VocabularyStageGroup[],
  visibleEntries: VocabularyEntry[]
): VisibleVocabularyStageGroup[] {
  const visibleIds = new Set(visibleEntries.map((entry) => entry.id));

  return stageGroups
    .map((group) => {
      const groupVisibleEntries = group.entries.filter((entry) => visibleIds.has(entry.id));

      return {
        ...group,
        visibleEntries: groupVisibleEntries,
        visibleCount: groupVisibleEntries.length
      };
    })
    .filter((group) => group.visibleCount > 0);
}

export function getDisplayWord(text: string, wordVisible: boolean, wordPracticeVisible: boolean) {
  if (wordVisible) {
    return text;
  }

  if (wordPracticeVisible) {
    return swapKanaScripts(text);
  }

  return '';
}

export function createStageSlug(stage: string) {
  return stage.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
