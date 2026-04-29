export type TableKey = 'tableA' | 'tableB';

export interface KanaCell {
  id: string;
  table: TableKey;
  rowKey: string;
  columnKey: string;
  romaji: string;
  hiragana: string;
  katakana: string;
  archaic?: boolean;
  selectable?: boolean;
}

export interface KanaMatrixRow {
  rowKey: string;
  label: string;
  cells: Array<KanaCell | null>;
}

export interface TableHeaderOption {
  key: string;
  label: string;
}

export interface ExampleRuleRow {
  label: string;
  values: string[];
}

export interface ExampleTriple {
  kana: string;
  romaji: string;
  translation: string;
}

export interface LongVowelRuleRow {
  id: string;
  kind: 'rule' | 'example';
  groupTitle: string;
  ruleText?: string;
  example?: ExampleTriple;
}

export interface RomajiHeader {
  key: string;
  kana: string;
  romaji: string;
}

export interface RomajiGridCell {
  kana: string;
  romaji: string;
}

export interface SyllableRomajiRow {
  header: RomajiHeader;
  cells: RomajiGridCell[];
}

export interface LoanwordMatrixCell {
  kana: string;
  romaji?: string;
  available?: boolean;
}

export interface LoanwordMatrixRow {
  header: RomajiHeader;
  cells: LoanwordMatrixCell[];
}

export interface SpecialSyllableNote {
  kana: string;
  romaji: string;
  description: string;
}

export interface CheckboxOption {
  id: string;
  label: string;
}

export interface SelectionDetailItem {
  id: string;
  label: string;
  kind: 'kana' | 'option';
}
