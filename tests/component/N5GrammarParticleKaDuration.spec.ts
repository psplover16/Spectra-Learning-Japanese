import { describe, expect, it } from 'vitest';
import { flushPromises } from '@vue/test-utils';
import { nextTick } from 'vue';
import N5GrammarView from '@/modules/n5Grammar/views/N5GrammarView.vue';
import { mountWithPracticeSession } from './testUtils';

async function mountLoadedN5GrammarView() {
  const mounted = mountWithPracticeSession(N5GrammarView);

  for (let attempt = 0; attempt < 50; attempt += 1) {
    await flushPromises();
    await nextTick();

    if (mounted.wrapper.find('[data-testid="n5-grammar-toggle-particle-ka"]').exists()) {
      return mounted;
    }

    await new Promise((resolve) => window.setTimeout(resolve, 0));
  }

  throw new Error('N5 grammar sections did not load.');
}

describe('N5Grammar particle-ka duration topic', () => {
  it('renders the detailed duration comparison content inside 助詞 か', async () => {
    const { wrapper } = await mountLoadedN5GrammarView();

    await wrapper.get('[data-testid="n5-grammar-toggle-particle-ka"]').trigger('click');

    const section = wrapper.get('[data-testid="n5-grammar-section-particle-ka"]');

    expect(section.find('[data-testid="n5-grammar-topic-ka-how-long-duration"]').exists()).toBe(true);
    expect(section.text()).toContain('どれくらい / どのくらい：多少程度／多久／多大');
    expect(section.text()).toContain('「そうなんですね」與「へえ」的語氣差別');
    expect(section.text()).toContain('そうなんですね。どれくらい時間がかかりますか。');
    expect(section.text()).toContain('へえ、どのくらいかかりますか。');
  });
});
