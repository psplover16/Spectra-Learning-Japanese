import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import ChoonRuleSection from '@/modules/practice/components/ChoonRuleSection.vue';

describe('ChoonRuleSection', () => {
  it('以單一大表格呈現規則列與例字列，且不加入額外欄位標題', () => {
    const wrapper = mount(ChoonRuleSection);

    expect(wrapper.find('[data-testid="choon-section"]').exists()).toBe(true);
    expect(wrapper.find('thead').exists()).toBe(false);
    expect(wrapper.text()).toContain('外來語通常使用長音符ー');
    expect(wrapper.text()).toContain('ケーキ');
    expect(wrapper.text()).toContain('keki');
    expect(wrapper.text()).toContain('蛋糕');
  });

  it('將 あ段 + う 不一定屬於規則長音 呈現為多筆三段資訊例字', () => {
    const wrapper = mount(ChoonRuleSection);
    const text = wrapper.text();

    expect(text).toContain('あ段 + う 不一定屬於規則長音');
    expect(text).toContain('あう');
    expect(text).toContain('au');
    expect(text).toContain('相遇');
    expect(text).toContain('うたう');
    expect(text).toContain('utau');
    expect(text).toContain('歌唱');
  });
});
