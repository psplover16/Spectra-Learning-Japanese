export type N5GrammarPresentationMode = 'bullet-list' | 'info-stack' | 'compare-table';

export interface N5GrammarExample {
  id: string;
  japanese: string;
  highlightTerms?: string[];
  reading?: string;
  translation: string;
  note?: string;
  origin: 'source' | 'supplemental';
}

export interface N5GrammarSharedNote {
  id: string;
  title: string;
  content: string;
}

export interface N5GrammarTopic {
  id: string;
  title: string;
  summary: string;
  details: string[];
  detailHighlightTerms?: string[];
  examples: N5GrammarExample[];
  sourceRefs: string[];
  sharedNoteIds: string[];
}

export interface N5GrammarCompareTableRow {
  id: string;
  label: string;
  values: string[];
}

export interface N5GrammarCompareTable {
  columns: string[];
  rows: N5GrammarCompareTableRow[];
}

export interface N5GrammarTableExampleGroup {
  id: string;
  rowId: string;
  columnIndex: number;
  forms: string[];
  examples: N5GrammarExample[];
  note?: string;
}

export type N5GrammarCategory =
  | 'particles'
  | 'fundamentals'
  | 'sentence-patterns'
  | 'expressions'
  | 'honorifics';

export interface N5GrammarSection {
  id: string;
  title: string;
  description: string;
  presentationMode: N5GrammarPresentationMode;
  order: number;
  category: N5GrammarCategory;
  topics: N5GrammarTopic[];
  sharedNotes: N5GrammarSharedNote[];
  table?: N5GrammarCompareTable;
  tableExampleGroups?: N5GrammarTableExampleGroup[];
}

export interface N5GrammarSourceCoverageItem {
  sourceId: string;
  summary: string;
  mappedSectionId: string;
  mappedTopicIds: string[];
  status: 'covered' | 'merged' | 'supplemented';
}
