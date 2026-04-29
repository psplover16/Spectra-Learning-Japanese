import { beforeEach, describe, expect, it } from 'vitest';
import { createExamSession } from '@/modules/exam/composables/useExamSession';
import { clearLatestUnknownResults } from '@/modules/exam/storage/latestUnknownResultStorage';
import { allKanaCells } from '@/modules/practice/data/kanaData';

describe('useExamSession', () => {
  beforeEach(() => {
    clearLatestUnknownResults();
  });

  it('下一步先揭曉答案，再進入下一題', () => {
    const session = createExamSession();
    session.start({
      selectedKanaItems: [allKanaCells[0]!],
      questionCount: 1,
      includeHiragana: true,
      includeKatakana: false
    });

    expect(session.currentQuestion.value?.answerRevealed).toBe(false);
    session.nextStep();
    expect(session.currentQuestion.value?.answerRevealed).toBe(true);
    session.nextStep();
    expect(session.isOpen.value).toBe(false);
  });

  it('同一題前後都按我不清楚只記錄一次', () => {
    const session = createExamSession();
    session.start({
      selectedKanaItems: [allKanaCells[0]!],
      questionCount: 1,
      includeHiragana: true,
      includeKatakana: false
    });

    session.markUnknown();
    expect(session.currentQuestion.value?.unknownMarked).toBe(true);
    session.markUnknown();

    expect(session.latestUnknownSnapshot.value?.totalUnknownCount).toBe(1);
    expect(session.latestUnknownSnapshot.value?.results[0]?.count).toBe(1);
  });

  it('confirmClose 會直接結算', () => {
    const session = createExamSession();
    session.start({
      selectedKanaItems: [allKanaCells[0]!],
      questionCount: 1,
      includeHiragana: true,
      includeKatakana: false
    });

    session.markUnknown();
    session.confirmClose();

    expect(session.isOpen.value).toBe(false);
    expect(session.latestUnknownSnapshot.value?.results[0]?.romaji).toBe('a');
  });
});
