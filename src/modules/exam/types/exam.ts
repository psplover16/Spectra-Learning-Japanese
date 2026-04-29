import type { KanaCell } from '@/modules/practice/types/practice';

export interface StartExamInput {
  selectedKanaItems: KanaCell[];
  questionCount: number;
  includeHiragana: boolean;
  includeKatakana: boolean;
}

export interface ExamQuestionCard {
  id: string;
  kanaId: string;
  script: 'hiragana' | 'katakana';
  promptText: string;
  answerText: string;
  hintText: string;
  answerRevealed: boolean;
  unknownMarked: boolean;
  hiragana: string;
  katakana: string;
  romaji: string;
}

export interface LatestUnknownResultEntry {
  kanaId: string;
  hiragana: string;
  katakana: string;
  romaji: string;
  count: number;
}

export interface LatestUnknownResultSnapshot {
  updatedAt: string;
  totalUnknownCount: number;
  results: LatestUnknownResultEntry[];
}
