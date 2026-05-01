import { nextTick } from 'vue';
import type { VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import VocabularyView from '@/modules/vocabulary/views/VocabularyView.vue';
import { mountWithPracticeSession } from './testUtils';

const jlptLevels = ['N1', 'N2', 'N3', 'N4', 'N5'] as const;

const jlptLevelTestIds = {
  all: 'vocabulary-filter-jlpt-level-all',
  N1: 'vocabulary-filter-jlpt-level-n1',
  N2: 'vocabulary-filter-jlpt-level-n2',
  N3: 'vocabulary-filter-jlpt-level-n3',
  N4: 'vocabulary-filter-jlpt-level-n4',
  N5: 'vocabulary-filter-jlpt-level-n5'
} as const;

function getFilterInput(wrapper: VueWrapper, testId: string) {
  return wrapper.get(`[data-testid="${testId}"] input`);
}

function expectNoWordCountSummary(wrapper: VueWrapper) {
  expect(wrapper.find('[data-testid="vocabulary-count-summary"]').exists()).toBe(false);
  expect(wrapper.find('.vocabulary-count-summary').exists()).toBe(false);
}

function expectJlptControlsChecked(wrapper: VueWrapper) {
  expect((getFilterInput(wrapper, jlptLevelTestIds.all).element as HTMLInputElement).checked).toBe(true);

  for (const level of jlptLevels) {
    expect((getFilterInput(wrapper, jlptLevelTestIds[level]).element as HTMLInputElement).checked).toBe(true);
  }
}

function visibleVocabularyRows(wrapper: VueWrapper) {
  return wrapper.findAll('tbody tr[data-testid^="vocabulary-row-"]');
}

function appearsBefore(first: Element, second: Element) {
  return Boolean(first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING);
}

describe('VocabularyViewSmoke', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    window.localStorage.clear();
  });

  it('預設 render 不會出錯，會顯示控制區與表格且不顯示單字數量', () => {
    const { wrapper } = mountWithPracticeSession(VocabularyView);

    expect(wrapper.get('.vocabulary-view').classes()).toContain('py-1');
    expect(wrapper.find('[data-testid="vocabulary-control-bar"]').exists()).toBe(true);
    expectNoWordCountSummary(wrapper);
    expectJlptControlsChecked(wrapper);
    expect(wrapper.find('[data-testid="vocabulary-table"]').exists()).toBe(true);
  });

  it('控制列將 level controls 放在 action controls 上方，並讓練習與註記靠左、儲存註記靠右', () => {
    const { wrapper } = mountWithPracticeSession(VocabularyView);

    const controlBar = wrapper.get('[data-testid="vocabulary-control-bar"]');
    const levelControls = controlBar.get('[data-testid="vocabulary-level-controls"]');
    const actionControls = controlBar.get('[data-testid="vocabulary-action-controls"]');
    const actionControlsLeft = actionControls.get('[data-testid="vocabulary-action-controls-left"]');
    const practiceMode = actionControlsLeft.get('[data-testid="vocabulary-filter-practice-mode"]');
    const markedOnly = actionControlsLeft.get('[data-testid="vocabulary-filter-show-marked-only"]');
    const saveMarks = actionControls.get('[data-testid="vocabulary-save-marks-button"]');

    expect(appearsBefore(levelControls.element, actionControls.element)).toBe(true);
    expect(appearsBefore(practiceMode.element, markedOnly.element)).toBe(true);
    expect(appearsBefore(actionControlsLeft.element, saveMarks.element)).toBe(true);
    expect(actionControls.element.firstElementChild).toBe(actionControlsLeft.element);
    expect(actionControls.element.lastElementChild).toBe(saveMarks.element);
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
    expectNoWordCountSummary(wrapper);

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

      expectNoWordCountSummary(wrapper);
      expect(visibleVocabularyRows(wrapper)).toHaveLength(1);
      expect(wrapper.get(`[data-testid="vocabulary-row-${rowId}"]`).text()).toContain(term);
    }
  });
});
