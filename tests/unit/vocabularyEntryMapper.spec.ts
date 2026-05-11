import { describe, expect, it } from 'vitest';
import { toEntry } from '@/modules/vocabulary/data/vocabularyEntryMapper';
import type { VocabularyEntryTuple } from '@/modules/vocabulary/types/vocabulary';

describe('toEntry', () => {
  it('expands a 4-tuple into a RawVocabularyEntry using the stage argument', () => {
    const result = toEntry(['あさ', 'a-sa', '朝', '早上'], 'N5');

    expect(result).toEqual({
      text: 'あさ',
      romanization: 'a-sa',
      kanji: '朝',
      meaning: '早上',
      stage: 'N5'
    });
  });

  it('preserves multi-line meaning per vocabulary-meaning-pos-format spec', () => {
    const multilineMeaning = '行く（自動詞・五段）\n去';
    const result = toEntry(['いく', 'i-ku', '行く', multilineMeaning], 'N5');

    expect(result.meaning).toBe(multilineMeaning);
    expect(result.meaning).toContain('\n');
  });

  it('uses the stage argument independently of the tuple content', () => {
    const tuple: VocabularyEntryTuple = ['あう', 'a-u', '会う', '見面'];

    expect(toEntry(tuple, 'N5').stage).toBe('N5');
    expect(toEntry(tuple, 'N3').stage).toBe('N3');
    expect(toEntry(tuple, 'N1').stage).toBe('N1');
  });

  it('preserves empty kanji and empty meaning fields verbatim', () => {
    const result = toEntry(['おい', 'o-i', '', ''], 'N5');

    expect(result.kanji).toBe('');
    expect(result.meaning).toBe('');
    expect(result.text).toBe('おい');
  });
});
