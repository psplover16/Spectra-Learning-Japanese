export const vocabularyJlptLevels = ['N1', 'N2', 'N3', 'N4', 'N5'] as const;

export type VocabularyJlptLevel = (typeof vocabularyJlptLevels)[number];

export interface RawVocabularyEntry {
  text: string;
  romanization: string;
  kanji: string;
  meaning: string;
  stage: VocabularyJlptLevel;
}

export interface VocabularyEntry {
  id: number;
  markKey: string;
  text: string;
  romanization: string;
  kanji: string;
  meaning: string;
  stage: VocabularyJlptLevel;
  textKanaUnits: string[];
  hasKanji: boolean;
}

export interface VocabularyStageGroup {
  stage: VocabularyJlptLevel;
  entries: VocabularyEntry[];
}

export type VocabularyDataColumn = 'word' | 'combined' | 'meaning';

export interface VocabularyColumnVisibility {
  word: boolean;
  combined: boolean;
  meaning: boolean;
  preserveLayoutWhenHidden: true;
}

export interface VocabularyFilterState {
  searchText: string;
  showAllSounds: boolean;
  showKanji: boolean;
  showMarkedOnly: boolean;
  columnVisibility: VocabularyColumnVisibility;
  allowedKanaSet: Set<string>;
  selectedJlptLevels: Set<VocabularyJlptLevel>;
}

export interface VocabularyMarkSnapshot {
  version: 2;
  markedKeys: string[];
  updatedAt: string;
}

export interface VisibleVocabularyStageGroup extends VocabularyStageGroup {
  visibleEntries: VocabularyEntry[];
  visibleCount: number;
}
