import type { N5GrammarExample } from '@/modules/n5Grammar/types/grammarNotes';

export interface N5GrammarHighlightedPart {
  text: string;
  highlighted: boolean;
}

export function getN5GrammarTextHighlightedParts(text: string, highlightTerms?: string[]): N5GrammarHighlightedPart[] {
  const terms = [...(highlightTerms ?? [])].filter(Boolean).sort((left, right) => right.length - left.length);

  if (terms.length === 0) {
    return [{ text, highlighted: false }];
  }

  const parts: N5GrammarHighlightedPart[] = [];
  let cursor = 0;

  while (cursor < text.length) {
    const match = terms.find((term) => text.startsWith(term, cursor));

    if (match) {
      parts.push({ text: match, highlighted: true });
      cursor += match.length;
      continue;
    }

    parts.push({ text: text.charAt(cursor), highlighted: false });
    cursor += 1;
  }

  return parts;
}

export function getN5GrammarHighlightedParts(example: N5GrammarExample): N5GrammarHighlightedPart[] {
  return getN5GrammarTextHighlightedParts(example.japanese, example.highlightTerms);
}
