import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import LoanwordSection from '@/modules/practice/components/LoanwordSection.vue';

describe('LoanwordSection', () => {
  it('以母音標頭與基底音列呈現矩陣', () => {
    const wrapper = mount(LoanwordSection);
    const text = wrapper.text();

    expect(wrapper.find('[data-testid="loanword-section"]').exists()).toBe(true);
    expect(text).toContain('ア');
    expect(text).toContain('a');
    expect(text).toContain('フ系');
    expect(text).toContain('f');
    expect(text).toContain('ヴ系');
    expect(text).toContain('v');
    expect(text).toContain('ト系');
    expect(text).toContain('トゥ');
    expect(wrapper.findAll('.practice-grid-cell').length).toBeGreaterThan(20);
  });

  it('內容格以假名在上、羅馬音在下顯示，且假名不換行', () => {
    const wrapper = mount(LoanwordSection);
    const [firstCell] = wrapper.findAll('.practice-grid-cell');

    expect(firstCell).toBeDefined();
    if (!firstCell) {
      return;
    }

    expect(firstCell.text()).toContain('ファ');
    expect(firstCell.text()).toContain('fa');
    expect(firstCell.find('.practice-kana-text').exists()).toBe(true);
  });

  it('沒有對應用法的格位以單一 - 代替', () => {
    const wrapper = mount(LoanwordSection);
    const text = wrapper.text();

    expect(text).toContain('ト系');
    expect(text).toContain('ティ');
    expect(text).toContain('トゥ');
    expect(wrapper.findAll('.practice-placeholder-text').length).toBeGreaterThan(0);
  });
});
