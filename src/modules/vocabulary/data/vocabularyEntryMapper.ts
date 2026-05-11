import type {
  RawVocabularyEntry,
  VocabularyEntryTuple,
  VocabularyJlptLevel
} from '@/modules/vocabulary/types/vocabulary';

/**
 * Expand a compact `VocabularyEntryTuple` into the runtime `RawVocabularyEntry`
 * shape consumed by the rest of the vocabulary module.
 *
 * `stage` is provided by the caller (the data file's JLPT level) rather than
 * carried inside the tuple — this removes the most repeated string from every
 * entry and lets the tuple stay as a compact `[text, romanization, kanji, meaning]`.
 */
export function toEntry(
  tuple: VocabularyEntryTuple,
  stage: VocabularyJlptLevel
): RawVocabularyEntry {
  const [text, romanization, kanji, meaning] = tuple;
  return { text, romanization, kanji, meaning, stage };
}
