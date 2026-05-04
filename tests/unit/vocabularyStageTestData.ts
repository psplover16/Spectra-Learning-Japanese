import jpWords_N1 from '@/modules/vocabulary/data/jpWords_N1';
import jpWords_N2 from '@/modules/vocabulary/data/jpWords_N2';
import jpWords_N3 from '@/modules/vocabulary/data/jpWords_N3';
import jpWords_N4 from '@/modules/vocabulary/data/jpWords_N4';
import jpWords_N5 from '@/modules/vocabulary/data/jpWords_N5';
import { vocabularyJlptLevels } from '@/modules/vocabulary/types/vocabulary';
import type { RawVocabularyEntry, VocabularyJlptLevel } from '@/modules/vocabulary/types/vocabulary';
import { groupVocabularyEntriesByStage, normalizeVocabularyEntries } from '@/modules/vocabulary/utils/vocabularyFilters';

export const vocabularyStageFiles: Record<VocabularyJlptLevel, RawVocabularyEntry[]> = {
  N1: jpWords_N1,
  N2: jpWords_N2,
  N3: jpWords_N3,
  N4: jpWords_N4,
  N5: jpWords_N5
};

export const rawVocabularyEntries = vocabularyJlptLevels.flatMap((level) => vocabularyStageFiles[level]);

export const vocabularyEntries = normalizeVocabularyEntries(rawVocabularyEntries);

export const vocabularyStageGroups = groupVocabularyEntriesByStage(vocabularyEntries);
