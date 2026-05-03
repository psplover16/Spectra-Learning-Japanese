export type ProjectPosMarker = '五段動詞' | '一段動詞' | 'い形容詞' | 'な形容詞' | 'の形容詞';

export interface RawVocabularyEntryLike {
  text: string;
  romanization?: string;
  kanji: string;
  meaning: string;
  stage: string;
}

export interface JmdictEntryLike {
  reb?: string | string[];
  keb?: string | string[];
  reading?: string | string[];
  readings?: string | string[];
  kana?: string | string[];
  kanji?: string | string[];
  kanjis?: string | string[];
  pos?: string | string[];
  partOfSpeech?: string | string[];
  part_of_speech?: string | string[];
  r_ele?: Array<{ reb?: string | string[] }>;
  k_ele?: Array<{ keb?: string | string[] }>;
  sense?: Array<{
    pos?: string | string[];
    partOfSpeech?: string | string[];
    part_of_speech?: string | string[];
  }>;
}

export interface VocabularyMeaningDiagnostic {
  text: string;
  kanji: string;
  stage: string;
  meaning: string;
}

export interface MissingPosMarkerDiagnostic extends VocabularyMeaningDiagnostic {
  expectedMarker: ProjectPosMarker;
  jmdictPos: string[];
}

export interface UnresolvedJmdictDiagnostic extends VocabularyMeaningDiagnostic {
  candidateMarkers: ProjectPosMarker[];
  jmdictPos: string[];
  reason?: string;
}

export interface MisalignedMeaningDiagnostic extends VocabularyMeaningDiagnostic {
  kanjiLineCount: number;
  meaningLineCount: number;
}

export interface VocabularyMeaningDiagnostics {
  halfWidthMarkerEntries: VocabularyMeaningDiagnostic[];
  sharedMarkerEntries: VocabularyMeaningDiagnostic[];
  misalignedMeaningEntries: MisalignedMeaningDiagnostic[];
  missingPosMarkers: MissingPosMarkerDiagnostic[];
  unresolvedJmdictEntries: UnresolvedJmdictDiagnostic[];
  allowlistedUnresolvedEntries: UnresolvedJmdictDiagnostic[];
}

export interface AnalyzeVocabularyMeaningFormatOptions {
  unresolvedAllowlist?: Record<string, string>;
}

export const PROJECT_POS_MARKERS: readonly ProjectPosMarker[];

export function mapJmdictPosToProjectMarker(posCode: string): ProjectPosMarker | null;

export function analyzeVocabularyMeaningFormat(
  rawVocabularyEntries: RawVocabularyEntryLike[],
  rawJmdictEntries: JmdictEntryLike[],
  options?: AnalyzeVocabularyMeaningFormatOptions,
): VocabularyMeaningDiagnostics;

export function hasFullWidthProjectMarker(meaning: string): boolean;

export function assertJmdictSourceAvailable(sourceDirectoryPath: string): Promise<void>;

export function loadJmdictEntriesFromDirectory(sourceDirectoryPath: string): Promise<JmdictEntryLike[]>;
