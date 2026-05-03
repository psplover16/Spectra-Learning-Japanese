import { describe, expect, it } from 'vitest';
import {
  analyzeVocabularyMeaningFormat,
  assertJmdictSourceAvailable,
  mapJmdictPosToProjectMarker,
} from '../../scripts/vocabulary/checkVocabularyMeaningFormat.mjs';
import { rawVocabularyEntries } from '@/modules/vocabulary/data/jpWords';

function findVocabularyEntry(text: string, stage: string) {
  return rawVocabularyEntries.find((entry) => entry.text === text && entry.stage === stage);
}

const jmdictFixture = [
  { reb: ['あげる'], keb: ['上げる', '挙げる'], pos: ['v1'] },
  { reb: ['はたらく'], keb: ['働く'], pos: ['v5k'] },
  { reb: ['かえる'], keb: ['帰る'], pos: ['v5r'] },
  { reb: ['かえる'], keb: ['変える'], pos: ['v1'] },
  { reb: ['なめらか'], keb: ['滑らか'], pos: ['adj-na'] },
  { reb: ['はやい'], keb: ['早い'], pos: ['adj-i'] },
];

describe('vocabulary meaning format', () => {
  it('splits multiple verb senses into separate meaning lines with markers', () => {
    const entry = findVocabularyEntry('はたらく', 'N4');

    expect(entry).toBeDefined();
    expect(entry!.kanji).toBe('働く');
    expect(entry!.meaning).toBe('工作（五段動詞）\n起作用（五段動詞）');
  });

  it('marks every verb sense line in mixed multi-line meanings', () => {
    const entry = findVocabularyEntry('かえる', 'N5');

    expect(entry).toBeDefined();
    expect(entry!.kanji).toBe('帰る\n変える');
    expect(entry!.meaning).toBe('回家（五段動詞）\n改變（一段動詞）');
  });

  it('rejects half-width part-of-speech markers in raw vocabulary meanings', () => {
    const halfWidthMarkers = rawVocabularyEntries
      .filter((entry) => /\((五段動詞|一段動詞|い形容詞|な形容詞)\)/.test(entry.meaning))
      .map((entry) => `${entry.text} (${entry.stage}): ${entry.meaning}`);

    expect(halfWidthMarkers).toEqual([]);
  });

  it.each([
    ['v1', '一段動詞'],
    ['v5k', '五段動詞'],
    ['adj-i', 'い形容詞'],
    ['adj-na', 'な形容詞'],
  ])('maps JMdict POS %s to the project marker %s', (jmdictPos, expectedMarker) => {
    expect(mapJmdictPosToProjectMarker(jmdictPos)).toBe(expectedMarker);
  });

  it('uses a unique JMdict verb class without adding the entry to manual review', () => {
    const diagnostics = analyzeVocabularyMeaningFormat(
      [
        {
          text: 'あげる',
          romanization: 'a-ge-ru',
          kanji: '上げる',
          meaning: '給',
          stage: 'N5',
        },
      ],
      jmdictFixture,
    );

    expect(diagnostics.unresolvedJmdictEntries).toEqual([]);
    expect(diagnostics.missingPosMarkers).toEqual([
      {
        text: 'あげる',
        kanji: '上げる',
        stage: 'N5',
        meaning: '給',
        expectedMarker: '一段動詞',
        jmdictPos: ['v1'],
      },
    ]);
  });

  it('reports ambiguous JMdict verb or adjective classes as unresolved', () => {
    const diagnostics = analyzeVocabularyMeaningFormat(
      [
        {
          text: 'example',
          romanization: 'example',
          kanji: '例',
          meaning: '例',
          stage: 'N5',
        },
      ],
      [
        { reb: ['example'], keb: ['例'], pos: ['v1'] },
        { reb: ['example'], keb: ['例'], pos: ['v5r'] },
      ],
    );

    expect(diagnostics.unresolvedJmdictEntries).toEqual([
      {
        text: 'example',
        kanji: '例',
        stage: 'N5',
        meaning: '例',
        candidateMarkers: ['一段動詞', '五段動詞'],
        jmdictPos: ['v1', 'v5r'],
      },
    ]);
  });

  it('fails loudly when the JMdict source directory is unavailable', async () => {
    await expect(assertJmdictSourceAvailable('__missing_jmdict_fixture__')).rejects.toThrow(
      'JMdict source data is required',
    );
  });

  it('reports JMdict-classified raw entries that still miss required POS markers', () => {
    const diagnostics = analyzeVocabularyMeaningFormat(rawVocabularyEntries, jmdictFixture);

    expect(diagnostics.missingPosMarkers).toEqual([]);
  });

  it('scans every raw vocabulary meaning for deterministic format errors', () => {
    const diagnostics = analyzeVocabularyMeaningFormat(rawVocabularyEntries, jmdictFixture);

    expect(diagnostics.halfWidthMarkerEntries).toEqual([]);
    expect(diagnostics.sharedMarkerEntries).toEqual([]);
    expect(diagnostics.missingPosMarkers).toEqual([]);
    expect(diagnostics.unresolvedJmdictEntries).toEqual([]);
    expect(
      diagnostics.allowlistedUnresolvedEntries.every((entry) => Boolean(entry.reason?.trim())),
    ).toBe(true);
  });
});
