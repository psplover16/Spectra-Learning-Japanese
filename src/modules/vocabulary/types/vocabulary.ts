export interface RawVocabularyEntry {
  text: string;
  romanization: string;
  kanji: string;
  meaning: string;
  stage: string;
}

export interface VocabularyEntry {
  id: number;
  text: string;
  romanization: string;
  kanji: string;
  meaning: string;
  stage: string;
  textKanaUnits: string[];
  hasKanji: boolean;
}

export interface VocabularyStageGroup {
  stage: string;
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
  practiceMode: boolean;
  columnVisibility: VocabularyColumnVisibility;
  allowedKanaSet: Set<string>;
}

export interface VocabularyMarkSnapshot {
  version: 1;
  markedIds: number[];
  updatedAt: string;
}

export interface VisibleVocabularyStageGroup extends VocabularyStageGroup {
  visibleEntries: VocabularyEntry[];
  visibleCount: number;
}
