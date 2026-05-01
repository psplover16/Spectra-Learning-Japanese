import { describe, expect, it } from 'vitest';
import GrammarView from '@/modules/grammar/views/GrammarView.vue';
import { grammarSections } from '@/modules/grammar/data/changeRules';
import { mountWithPracticeSession } from './testUtils';

describe('GrammarView', () => {
  it('預設 render 顯示 11 個規則容器，且不再顯示舊 placeholder 區塊', () => {
    const { wrapper } = mountWithPracticeSession(GrammarView);

    expect(wrapper.get('[data-testid="grammar-sections"]').classes()).not.toContain('py-1');
    expect(wrapper.find('[data-testid="grammar-view-intro"]').exists()).toBe(false);
    expect(wrapper.findAll('[data-testid^="grammar-section-"]')).toHaveLength(grammarSections.length);
    expect(wrapper.find('[data-testid="selection-detail-panel"]').exists()).toBe(false);
    expect(wrapper.text()).not.toContain('撥音的發音規則');
    expect(wrapper.text()).not.toContain('促音的發音規則');
    expect(wrapper.text()).toContain('語法系統差異');
    expect(wrapper.text()).toContain('詞性變化規則');
  });

  it('預設為收合，點擊後才展開內容', async () => {
    const { wrapper } = mountWithPracticeSession(GrammarView);

    const tbody = wrapper.get('[data-testid="grammar-table-system-difference"] tbody');
    expect(tbody.attributes('style')).toContain('display: none;');

    await wrapper.get('[data-testid="grammar-toggle-system-difference"]').trigger('click');

    expect(tbody.attributes('style')).not.toContain('display: none;');
    expect(wrapper.text()).toContain('主詞＋動詞＋受詞（SVO）');
    expect(wrapper.text()).toContain('私はリンゴを食べます');
  });

  it('活用表 shell 標題與說明分離，且收合操作維持', async () => {
    const { wrapper } = mountWithPracticeSession(GrammarView);
    const kahenToggle = wrapper.get('[data-testid="grammar-toggle-kahen-table"]');
    const kahenBody = wrapper.get('[data-testid="grammar-table-kahen-table"] tbody');

    expect(kahenToggle.text()).toContain('カ變動詞 (只有来る)');
    expect(kahenToggle.text()).not.toContain('漢字發音會變動');
    expect(kahenBody.attributes('style')).toContain('display: none;');

    await kahenToggle.trigger('click');

    expect(kahenBody.attributes('style')).not.toContain('display: none;');
    expect(wrapper.get('[data-testid="grammar-table-kahen-table"]').text()).toContain('漢字發音會變動，標註在詞尾');
  });
});
