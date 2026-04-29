import { describe, expect, it } from 'vitest';
import SelectionDetailPanel from '@/modules/practice/components/SelectionDetailPanel.vue';
import { allKanaCells } from '@/modules/practice/data/kanaData';
import { mountWithPracticeSession } from './testUtils';

describe('SelectionDetailPanel', () => {
  it('會顯示第一頁勾選的實際文字', () => {
    const targetCell = allKanaCells.find((item) => item.id === 'tableA-ka');

    const { wrapper } = mountWithPracticeSession(SelectionDetailPanel, (createdSession) => {
      createdSession.toggleKana(targetCell!, true);
      createdSession.enableSokuon.value = true;
    });

    expect(wrapper.find('[data-testid="selection-detail-panel"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('か / カ ka');
    expect(wrapper.text()).toContain('促音');
  });
});
