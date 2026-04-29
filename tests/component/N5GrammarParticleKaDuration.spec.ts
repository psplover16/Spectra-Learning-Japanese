import { describe, expect, it } from 'vitest';
import N5GrammarView from '@/modules/n5Grammar/views/N5GrammarView.vue';
import { mountWithPracticeSession } from './testUtils';

describe('N5Grammar particle-ka duration topic', () => {
  it('renders the detailed duration comparison content inside 助詞 か', async () => {
    const { wrapper } = mountWithPracticeSession(N5GrammarView);

    await wrapper.get('[data-testid="n5-grammar-toggle-particle-ka"]').trigger('click');

    const section = wrapper.get('[data-testid="n5-grammar-section-particle-ka"]');

    expect(section.find('[data-testid="n5-grammar-topic-ka-how-long-duration"]').exists()).toBe(true);
    expect(section.text()).toContain('どれくらい / どのくらい：多少程度／多久／多大');
    expect(section.text()).toContain('「そうなんですね」與「へえ」的語氣差別');
    expect(section.text()).toContain('そうなんですね。どれくらい時間がかかりますか。');
    expect(section.text()).toContain('へえ、どのくらいかかりますか。');
  });
});
