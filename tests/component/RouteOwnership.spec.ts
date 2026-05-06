import { describe, expect, it } from 'vitest';
import { flushPromises } from '@vue/test-utils';
import { nextTick } from 'vue';
import PracticeView from '@/modules/practice/views/PracticeView.vue';
import GrammarView from '@/modules/grammar/views/GrammarView.vue';
import VocabularyView from '@/modules/vocabulary/views/VocabularyView.vue';
import N5GrammarView from '@/modules/n5Grammar/views/N5GrammarView.vue';
import { mountWithPracticeSession } from './testUtils';

async function waitForN5GrammarSections(wrapper: ReturnType<typeof mountWithPracticeSession>['wrapper']) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    await flushPromises();
    await nextTick();

    if (wrapper.find('[data-testid="n5-grammar-title-core-term-usage-overview"]').exists()) {
      return;
    }

    await new Promise((resolve) => window.setTimeout(resolve, 0));
  }

  throw new Error('N5 grammar sections did not load.');
}

describe('route ownership', () => {
  it('第一頁不得顯示共享明細 panel', () => {
    const { wrapper } = mountWithPracticeSession(PracticeView);
    expect(wrapper.find('[data-testid="selection-detail-panel"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="choon-section"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="loanword-section"]').exists()).toBe(true);
  });

  it('文法頁、單字頁與 N5 文法頁各自維持正確 ownership', async () => {
    const grammar = mountWithPracticeSession(GrammarView).wrapper;
    const vocabulary = mountWithPracticeSession(VocabularyView).wrapper;
    const n5Grammar = mountWithPracticeSession(N5GrammarView).wrapper;
    await waitForN5GrammarSections(n5Grammar);

    expect(grammar.find('[data-testid="selection-detail-panel"]').exists()).toBe(false);
    expect(vocabulary.find('[data-testid="selection-detail-panel"]').exists()).toBe(false);
    expect(n5Grammar.find('[data-testid="selection-detail-panel"]').exists()).toBe(false);
    expect(grammar.find('[data-testid="choon-section"]').exists()).toBe(false);
    expect(grammar.find('[data-testid="loanword-section"]').exists()).toBe(false);
    expect(vocabulary.find('[data-testid="choon-section"]').exists()).toBe(false);
    expect(vocabulary.find('[data-testid="loanword-section"]').exists()).toBe(false);
    expect(n5Grammar.find('[data-testid="choon-section"]').exists()).toBe(false);
    expect(n5Grammar.find('[data-testid="loanword-section"]').exists()).toBe(false);
    expect(grammar.text()).toContain('語法系統差異');
    expect(grammar.text()).toContain('詞性變化規則');
    expect(grammar.text()).not.toContain('敬體變化速覽');
    expect(vocabulary.find('[data-testid="vocabulary-control-bar"]').exists()).toBe(true);
    expect(vocabulary.find('[data-testid="vocabulary-table"]').exists()).toBe(true);
    expect(vocabulary.text()).not.toContain('敬體變化速覽');
    expect(vocabulary.text()).not.toContain('核心詞類用法總覽');
    expect(vocabulary.text()).not.toContain('できる：能力、可能與完成');
    expect(vocabulary.text()).not.toContain('邀約與勸誘：ませんか 與 ましょう');
    expect(vocabulary.text()).not.toContain('狀態變化：～くなります / ～になります');
    expect(vocabulary.text()).not.toContain('人為改變：～くします / ～にします');
    expect(vocabulary.text()).not.toContain('單字練習預備區');
    expect(vocabulary.text()).not.toContain('語法系統差異');
    expect(n5Grammar.find('[data-testid="n5-grammar-view"]').exists()).toBe(true);
    expect(n5Grammar.text()).toContain('核心詞類用法總覽');
    expect(n5Grammar.text()).toContain('敬體變化速覽');
    expect(n5Grammar.text()).toContain('敬體句型：現在型與詞類基礎');
    expect(n5Grammar.text()).toContain('敬體句型：過去、狀態與補充表現');
    expect(n5Grammar.text()).toContain('邀約與勸誘：ませんか 與 ましょう');
    expect(n5Grammar.text()).toContain('狀態變化：～くなります / ～になります');
    expect(n5Grammar.text()).toContain('人為改變：～くします / ～にします');
    expect(n5Grammar.text()).toContain('できる：能力、可能與完成');
    expect(n5Grammar.text()).toContain('常見疑問詞');
    expect(n5Grammar.text()).toContain('指示詞：こそあど系列');
    expect(n5Grammar.text()).toContain('數字與促音讀法');
    expect(n5Grammar.text()).toContain('時間表現：月日星期與時分');
    expect(n5Grammar.text()).toContain('助詞 も：也、同樣，與其他助詞的搭配');
    expect(n5Grammar.text()).not.toContain('句型與詞類敬體基礎');
    expect(n5Grammar.text()).not.toContain('製作中');
    expect(n5Grammar.text()).not.toContain('語法系統差異');
    expect(n5Grammar.text()).not.toContain('單字練習預備區');
    expect(grammar.text()).not.toContain('邀約與勸誘：ませんか 與 ましょう');
    expect(grammar.text()).not.toContain('できる：能力、可能與完成');
    expect(grammar.text()).not.toContain('東口／東邊出口');
    expect(grammar.text()).not.toContain('狀態變化：～くなります / ～になります');
    expect(grammar.text()).not.toContain('人為改變：～くします / ～にします');
  });
});
