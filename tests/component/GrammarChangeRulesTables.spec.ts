import { describe, expect, it } from 'vitest';
import GrammarView from '@/modules/grammar/views/GrammarView.vue';
import { mountWithPracticeSession } from './testUtils';

describe('Grammar change-rules tables', () => {
  it('五段動詞表展開後保留主表、音便表與表尾說明', async () => {
    const { wrapper } = mountWithPracticeSession(GrammarView);

    await wrapper.get('[data-testid="grammar-toggle-godan-table"]').trigger('click');

    const mainTable = wrapper.get('[data-testid="grammar-table-godan-table"]');
    const subTable = wrapper.get('[data-testid="grammar-subtable-godan-table"]');

    expect(mainTable.text()).toContain('五段動詞表(詞尾母音變化)');
    expect(mainTable.text()).toContain('派生可能');
    expect(mainTable.find('td[rowspan]').exists()).toBe(true);
    expect(subTable.text()).toContain('音便 (詞尾接尾一起改變)');
    expect(subTable.text()).toContain('書く→書き→書い(い音便)→書いて/書いた');
    expect(subTable.text()).toContain('以「す」做辭書型詞尾的五段動詞，不發生音便。ex.探す');
  });

  it('カ變動詞與だ助動詞保留說明文字，但標題列只顯示標題', async () => {
    const { wrapper } = mountWithPracticeSession(GrammarView);

    await wrapper.get('[data-testid="grammar-toggle-kahen-table"]').trigger('click');
    await wrapper.get('[data-testid="grammar-toggle-da-auxiliary-table"]').trigger('click');

    expect(wrapper.get('[data-testid="grammar-toggle-kahen-table"]').text()).toContain('カ變動詞 (只有来る)');
    expect(wrapper.get('[data-testid="grammar-toggle-kahen-table"]').text()).not.toContain('漢字發音會變動');
    expect(wrapper.get('[data-testid="grammar-toggle-da-auxiliary-table"]').text()).toContain('だ助動詞');
    expect(wrapper.get('[data-testid="grammar-toggle-da-auxiliary-table"]').text()).not.toContain('名詞＋だ');
    expect(wrapper.get('[data-testid="grammar-table-kahen-table"]').text()).toContain('漢字發音會變動，標註在詞尾');
    expect(wrapper.get('[data-testid="grammar-table-da-auxiliary-table"]').text()).toContain('名詞＋だ (ex.彼は学生だ)');
    expect(wrapper.get('[data-testid="grammar-table-da-auxiliary-table"]').text()).toContain('被修飾');
  });

  it('サ變動詞展開後在表格下方顯示散歩例句', async () => {
    const { wrapper } = mountWithPracticeSession(GrammarView);

    await wrapper.get('[data-testid="grammar-toggle-sahen-table"]').trigger('click');

    const table = wrapper.get('[data-testid="grammar-table-sahen-table"]');
    const examples = table.get('[data-testid="grammar-inflection-examples-sahen-sanpo-examples"]');

    expect(table.text()).toContain('サ變動詞 (する動詞為結尾的動詞)');
    expect(table.text()).toContain('辭書形');
    expect(examples.text()).toContain('散歩する的常用否定與過去例句');
    expect(examples.text()).toContain('しません');
    expect(examples.text()).toContain('雨の日は散歩しません。');
    expect(examples.text()).toContain('しませんでした');
    expect(examples.text()).toContain('昨日は忙しかったので、散歩しませんでした。');
    expect(examples.text()).toContain('しない');
    expect(examples.text()).toContain('今日は散歩しない。');
    expect(examples.text()).toContain('した');
    expect(examples.text()).toContain('今朝、公園で散歩した。');
  });

  it('ない形容詞與だ助動詞的假名欄維持不換行，且固定兩行欄位仍保留', async () => {
    const { wrapper } = mountWithPracticeSession(GrammarView);

    await wrapper.get('[data-testid="grammar-toggle-nai-adjective-table"]').trigger('click');
    await wrapper.get('[data-testid="grammar-toggle-da-auxiliary-table"]').trigger('click');

    const naiTable = wrapper.get('[data-testid="grammar-table-nai-adjective-table"]');
    const daTable = wrapper.get('[data-testid="grammar-table-da-auxiliary-table"]');

    expect(naiTable.findAll('td').find((cell) => cell.text() === '優しく')?.classes()).toContain('grammar-kana-nowrap-cell');
    expect(naiTable.findAll('td').find((cell) => cell.text() === 'な')?.classes()).toContain('grammar-kana-nowrap-cell');
    expect(naiTable.findAll('td').find((cell) => cell.text() === 'ない')?.classes()).toContain('grammar-kana-nowrap-cell');

    expect(daTable.findAll('td').find((cell) => cell.text() === '好き')?.classes()).toContain('grammar-kana-nowrap-cell');
    expect(daTable.findAll('td').find((cell) => cell.text() === 'では')?.classes()).toContain('grammar-kana-nowrap-cell');
    expect(daTable.findAll('td').find((cell) => cell.text() === 'ない')?.classes()).toContain('grammar-kana-nowrap-cell');

    const fixedBreakCell = daTable.findAll('td').find((cell) => cell.text().includes('被修飾') && cell.text().includes('的名詞'));
    expect(fixedBreakCell).toBeDefined();
    expect(fixedBreakCell?.classes()).toContain('grammar-fixed-break-cell');
    expect(fixedBreakCell?.classes()).not.toContain('grammar-kana-nowrap-cell');
  });

  it('詞性變化規則展開後顯示巢狀條列與範例', async () => {
    const { wrapper } = mountWithPracticeSession(GrammarView);

    await wrapper.get('[data-testid="grammar-toggle-pos-conversion"]').trigger('click');

    const posTable = wrapper.get('[data-testid="grammar-table-pos-conversion"]');

    expect(posTable.text()).toContain('一. 互轉有兩個層級');
    expect(posTable.text()).toContain('V(普通形)＋こと：把『動作／事情』名詞化');
    expect(posTable.text()).toContain('範例：');
    expect(posTable.text()).toContain('勉強する');
    expect(posTable.find('ol').exists()).toBe(true);
    expect(posTable.find('ul').exists()).toBe(true);
  });
});
