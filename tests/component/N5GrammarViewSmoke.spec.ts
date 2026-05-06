import { describe, expect, it } from 'vitest';
import { flushPromises } from '@vue/test-utils';
import { nextTick } from 'vue';
import N5GrammarView from '@/modules/n5Grammar/views/N5GrammarView.vue';
import { mountWithPracticeSession } from './testUtils';

async function waitForN5GrammarSections(wrapper: ReturnType<typeof mountWithPracticeSession>['wrapper']) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    await flushPromises();
    await nextTick();

    if (wrapper.find('[data-testid="n5-grammar-title-core-term-usage-overview"]').exists()) {
      return;
    }

    await new Promise((resolve) => window.setTimeout(resolve, 5));
  }

  throw new Error('N5 grammar sections did not load.');
}

describe('N5GrammarViewSmoke', () => {
  it('先 render 穩定 shell，再載入 N5 文法資料', () => {
    const { wrapper } = mountWithPracticeSession(N5GrammarView);

    expect(wrapper.find('[data-testid="n5-grammar-view"]').exists()).toBe(true);
    expect(wrapper.get('[data-testid="n5-grammar-loading-state"]').text()).toMatch(/文法資料(準備|載入)中/);
    expect(wrapper.find('[data-testid="n5-grammar-title-core-term-usage-overview"]').exists()).toBe(false);

    wrapper.unmount();
  });

  it('預設 render 顯示新的前兩個 N5 文法群組，且不出現其他 route 的內容', async () => {
    const { wrapper } = mountWithPracticeSession(N5GrammarView);
    await waitForN5GrammarSections(wrapper);

    expect(wrapper.find('[data-testid="n5-grammar-view"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('核心詞類用法總覽');
    expect(wrapper.text()).toContain('敬體變化速覽');
    expect(wrapper.text()).toContain('敬體句型：現在型與詞類基礎');
    expect(wrapper.text()).toContain('敬體句型：過去、狀態與補充表現');
    expect(wrapper.text()).toContain('邀約與勸誘：ませんか 與 ましょう');
    expect(wrapper.text()).toContain('できる：能力、可能與完成');
    expect(wrapper.text()).toContain('狀態變化：～くなります / ～になります');
    expect(wrapper.text()).toContain('人為改變：～くします / ～にします');
    expect(wrapper.text()).toContain('常見疑問詞');
    expect(wrapper.text()).toContain('指示詞：こそあど系列');
    expect(wrapper.text()).toContain('數字與促音讀法');
    expect(wrapper.text()).toContain('時間表現：月日星期與時分');
    expect(wrapper.text()).toContain('助詞 は：主題標記與句子焦點');
    expect(wrapper.text()).not.toContain('句型與詞類敬體基礎');
    expect(wrapper.text()).not.toContain('製作中');
    expect(wrapper.text()).not.toContain('語法系統差異');
    expect(wrapper.text()).not.toContain('單字練習預備區');
    expect(wrapper.find('[data-testid="selection-detail-panel"]').exists()).toBe(false);
  });
});
