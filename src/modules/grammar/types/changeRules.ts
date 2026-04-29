export interface ExamplePair {
  verb: string;
  meaning: string;
}

export interface RuleListItem {
  rules: string;
  examples?: ExamplePair[];
}

export interface SystemDifferenceContent {
  content: string;
  examples: string[];
}

export interface SystemDifferenceRow {
  name: string;
  cn: SystemDifferenceContent;
  jp: SystemDifferenceContent;
}

export interface SuffixMeaning {
  suffix: string;
  meaning: string;
}

export interface InflectionSeries {
  base: string;
  baseEnding: string;
  suffixAndMeaning: SuffixMeaning[];
}

export interface InflectionExample {
  id: string;
  form: string;
  japanese: string;
  reading?: string;
  translation: string;
  note?: string;
}

export interface InflectionExampleGroup {
  id: string;
  title: string;
  examples: InflectionExample[];
}

export interface SoundChangeRule {
  base: string;
  jisho: string[][];
  renyouTe: string[];
  renyouTa: string[];
}

export interface GodanTableSpec {
  title: string;
  subtitle: string;
  verb: string;
  columns: string[];
  mainRows: InflectionSeries[];
  footerRows: InflectionSeries[];
  soundChangeColumns: string[];
  soundChangeRows: SoundChangeRule[];
  soundChangeNotes: string[];
  soundChangeFooter: string;
}

export interface InflectionTableSpec {
  title: string;
  subtitle?: string;
  prefix?: string;
  verb?: string;
  columns: string[];
  mainRows: InflectionSeries[];
  footerRows?: InflectionSeries[];
  exampleGroups?: InflectionExampleGroup[];
}

export interface PosConversionEntry {
  subTitle: string;
  subContents: string[];
  examples: string[];
}

export interface PosConversionGroup {
  title: string;
  contents: PosConversionEntry[];
}

export type GrammarSectionKind = 'system-difference' | 'rule-list' | 'godan-table' | 'inflection-table' | 'pos-conversion';

export interface GrammarSectionSpec {
  id: string;
  title: string;
  kind: GrammarSectionKind;
  payloadKey: string;
  dataTestId: string;
}
