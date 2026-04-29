import { nextTick } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import VocabularyView from '@/modules/vocabulary/views/VocabularyView.vue';
import { mountWithPracticeSession } from './testUtils';

describe('VocabularyViewSmoke', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    window.localStorage.clear();
  });

  it('預設 render 不會出錯，且會顯示控制區與單字數量', () => {
    const { wrapper } = mountWithPracticeSession(VocabularyView);

    expect(wrapper.find('[data-testid="vocabulary-control-bar"]').exists()).toBe(true);
    expect(wrapper.get('[data-testid="vocabulary-count-summary"]').text()).toContain('1086個單字');
    expect(wrapper.find('[data-testid="vocabulary-table"]').exists()).toBe(true);
  });

  it('可儲存註記並清除全部註記', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    const { wrapper } = mountWithPracticeSession(VocabularyView);

    await wrapper.get('[data-testid="vocabulary-mark-checkbox-1"]').setValue(true);
    await wrapper.get('[data-testid="vocabulary-save-marks-button"]').trigger('click');

    expect(window.localStorage.getItem('vocabulary-mark-snapshot')).not.toBeNull();
    expect(wrapper.html()).toContain('vocabulary-marked-row');

    await wrapper.get('[data-testid="vocabulary-clear-marks-checkbox"]').setValue(true);
    expect(window.localStorage.getItem('vocabulary-mark-snapshot')).toBeNull();
  });

  it('長按約 0.4 秒會暫時揭露隱藏欄位，放開後恢復', async () => {
    vi.useFakeTimers();

    const { wrapper } = mountWithPracticeSession(VocabularyView);
    const combinedContent = wrapper.get('[data-testid="vocabulary-combined-content-1"]');

    expect(combinedContent.classes()).toContain('vocabulary-hidden-content');

    await wrapper.get('[data-testid="vocabulary-row-1"]').trigger('pointerdown');
    vi.advanceTimersByTime(400);
    await nextTick();

    expect(combinedContent.classes()).not.toContain('vocabulary-hidden-content');

    await wrapper.get('[data-testid="vocabulary-row-1"]').trigger('pointerup');
    await nextTick();

    expect(combinedContent.classes()).toContain('vocabulary-hidden-content');
  });

  it('只顯示註記只會顯示已儲存且有背景色的資料列', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    const { wrapper } = mountWithPracticeSession(VocabularyView);

    await wrapper.get('[data-testid="vocabulary-mark-checkbox-1"]').setValue(true);
    await wrapper.get('[data-testid="vocabulary-filter-show-marked-only"] input').setValue(true);

    expect(wrapper.find('[data-testid="vocabulary-row-1"]').exists()).toBe(false);
    expect(wrapper.get('[data-testid="vocabulary-count-summary"]').text()).toContain('0個單字');

    await wrapper.get('[data-testid="vocabulary-filter-show-marked-only"] input').setValue(false);
    await wrapper.get('[data-testid="vocabulary-save-marks-button"]').trigger('click');
    await wrapper.get('[data-testid="vocabulary-filter-show-marked-only"] input').setValue(true);

    expect(wrapper.find('[data-testid="vocabulary-row-1"]').exists()).toBe(true);
    expect(wrapper.html()).toContain('vocabulary-marked-row');
  });

  it('可搜尋 v16 新增的四個方位出口詞', async () => {
    const { wrapper } = mountWithPracticeSession(VocabularyView);

    for (const [term, rowId] of [
      ['東口', 1083],
      ['西口', 1084],
      ['北口', 1085],
      ['南口', 1086]
    ] as const) {
      await wrapper.get('[data-testid="vocabulary-search-input"]').setValue(term);

      expect(wrapper.get('[data-testid="vocabulary-count-summary"]').text()).toContain('1個單字');
      expect(wrapper.get(`[data-testid="vocabulary-row-${rowId}"]`).text()).toContain(term);
    }
  });
});
