import { describe, expect, it } from 'vitest';
import { getN5GrammarHighlightedParts } from '@/modules/n5Grammar/utils/highlightParts';
import type { N5GrammarExample } from '@/modules/n5Grammar/types/grammarNotes';

function example(japanese: string, highlightTerms: string[]): N5GrammarExample {
  return {
    id: 'test-example',
    japanese,
    highlightTerms,
    translation: '',
    origin: 'supplemental',
  };
}

describe('n5Grammar highlight parts', () => {
  it('uses the longest matching highlight term first', () => {
    const parts = getN5GrammarHighlightedParts(example('ここで車を止めてください。', ['で', 'ここで']));

    expect(parts).toContainEqual({ text: 'ここで', highlighted: true });
    expect(parts.filter((part) => part.highlighted).map((part) => part.text)).toEqual(['ここで']);
  });

  it('returns the full sentence as a plain part when no terms are configured', () => {
    expect(getN5GrammarHighlightedParts(example('映画を見ます。', []))).toEqual([
      { text: '映画を見ます。', highlighted: false },
    ]);
  });
});
