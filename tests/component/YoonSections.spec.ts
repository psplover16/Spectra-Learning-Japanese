import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import SeionYoonSection from '@/modules/practice/components/SeionYoonSection.vue';
import DakuonYoonSection from '@/modules/practice/components/DakuonYoonSection.vue';

describe('Yoon sections', () => {
  it('清音拗音的標頭列、列標頭與內容格都有羅馬音', () => {
    const wrapper = mount(SeionYoonSection);
    const text = wrapper.text();

    expect(wrapper.find('[data-testid="seion-yoon-section"]').exists()).toBe(true);
    expect(text).toContain('ya');
    expect(text).toContain('yu');
    expect(text).toContain('yo');
    expect(text).toContain('ki');
    expect(text).toContain('kya');
    expect(text).toContain('sha');
    expect(wrapper.findAll('.practice-romaji-text').length).toBeGreaterThan(10);
  });

  it('合拗音的標頭列、列標頭與內容格都有羅馬音', () => {
    const wrapper = mount(DakuonYoonSection);
    const text = wrapper.text();

    expect(wrapper.find('[data-testid="dakuon-yoon-section"]').exists()).toBe(true);
    expect(text).toContain('gi');
    expect(text).toContain('gya');
    expect(text).toContain('ji');
    expect(text).toContain('ja');
    expect(text).toContain('pi');
    expect(text).toContain('pyo');
    expect(wrapper.findAll('.practice-romaji-text').length).toBeGreaterThan(8);
  });
});
