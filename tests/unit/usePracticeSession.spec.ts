import { describe, expect, it, beforeEach } from 'vitest';
import { nextTick } from 'vue';
import { createPracticeSession } from '@/modules/practice/composables/usePracticeSession';
import { allKanaCells } from '@/modules/practice/data/kanaData';

describe('usePracticeSession', () => {
  let session: ReturnType<typeof createPracticeSession>;

  beforeEach(() => {
    session = createPracticeSession();
  });

  it('預設只勾選題目範圍，不勾選任何假名', () => {
    expect(session.includeHiragana.value).toBe(true);
    expect(session.includeKatakana.value).toBe(true);
    expect(session.selectedKanaCount.value).toBe(0);
    expect(session.questionCountInput.value).toBe('0');
  });

  it('勾選假名後會重新計算題數', async () => {
    const cell = allKanaCells.find((item) => item.id === 'tableA-ka');

    expect(cell).toBeTruthy();
    session.toggleKana(cell!, true);
    await nextTick();

    expect(session.selectedKanaCount.value).toBe(1);
    expect(session.recommendedQuestionCount.value).toBe(2);
    expect(session.questionCountInput.value).toBe('2');
  });

  it('關閉題目範圍後題數會重新同步', async () => {
    const cell = allKanaCells.find((item) => item.id === 'tableA-ka');
    session.toggleKana(cell!, true);
    await nextTick();

    session.includeKatakana.value = false;
    await nextTick();

    expect(session.recommendedQuestionCount.value).toBe(1);
    expect(session.questionCountInput.value).toBe('1');
  });

  it('古語假名顯示開關不會讓古語假名變成可勾選', () => {
    const archaicCell = allKanaCells.find((item) => item.id === 'tableA-wi');

    expect(archaicCell).toBeTruthy();
    expect(session.isCellSelectable(archaicCell!)).toBe(false);

    session.showArchaicKana.value = true;

    expect(session.isCellSelectable(archaicCell!)).toBe(false);
  });
});
