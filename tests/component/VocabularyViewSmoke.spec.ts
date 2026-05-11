import { nextTick } from 'vue';
import { flushPromises, type VueWrapper } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import VocabularyView from '@/modules/vocabulary/views/VocabularyView.vue';
import { __resetWarnOnce, readAllMarks } from '@/modules/vocabulary/storage/vocabularyMarksDb';
import { mountWithPracticeSession } from './testUtils';

async function indexedDbHasMarks(): Promise<boolean> {
  return (await readAllMarks()).length > 0;
}

/**
 * Wait until the IndexedDB mark store has at least N records (or 0 if expected = 0).
 * The async save chain (event → composable → storage → 3 IndexedDB transactions)
 * does not settle in a single `flushPromises()` cycle.
 */
async function waitForIndexedDbMarkCount(expected: number, maxAttempts = 50): Promise<void> {
  for (let i = 0; i < maxAttempts; i += 1) {
    const count = (await readAllMarks()).length;
    if (count === expected) return;
    await flushPromises();
    await nextTick();
    await new Promise((resolve) => window.setTimeout(resolve, 0));
  }
}

const jlptLevels = ['N1', 'N2', 'N3', 'N4', 'N5'] as const;

const jlptLevelTestIds = {
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
  for (const level of jlptLevels) {
    expect((getFilterInput(wrapper, jlptLevelTestIds[level]).element as HTMLInputElement).checked).toBe(true);
  }
}

function visibleVocabularyRows(wrapper: VueWrapper) {
  return wrapper.findAll('tbody tr[data-testid^="vocabulary-row-"]');
}

async function mountVocabularyView() {
  const mounted = mountWithPracticeSession(VocabularyView, undefined, {
    global: {
      stubs: {
        teleport: true
      }
    }
  });

  await waitForVocabularyRows(mounted.wrapper);

  return mounted;
}

async function waitForVocabularyRows(wrapper: VueWrapper, expectedMinimum = 1) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    await flushPromises();
    await nextTick();

    if (visibleVocabularyRows(wrapper).length >= expectedMinimum) {
      return;
    }

    await new Promise((resolve) => window.setTimeout(resolve, 0));
  }
}

async function waitForVisibleVocabularyRowCount(wrapper: VueWrapper, expectedCount: number) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    await flushPromises();
    await nextTick();

    if (visibleVocabularyRows(wrapper).length === expectedCount) {
      return;
    }

    await new Promise((resolve) => window.setTimeout(resolve, 0));
  }
}

function firstVisibleVocabularyRow(wrapper: VueWrapper) {
  const [row] = visibleVocabularyRows(wrapper);

  expect(row).toBeDefined();

  return row!;
}

async function markFirstVisibleVocabularyRow(wrapper: VueWrapper) {
  await firstVisibleVocabularyRow(wrapper).get('input[type="checkbox"]').setValue(true);
  await flushPromises();
  await nextTick();
}

async function clearAllJlptLevels(wrapper: VueWrapper) {
  for (const level of jlptLevels) {
    await getFilterInput(wrapper, jlptLevelTestIds[level]).setValue(false);
  }

  await waitForVisibleVocabularyRowCount(wrapper, 0);
}

function appearsBefore(first: Element, second: Element) {
  return Boolean(first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING);
}

describe('VocabularyViewSmoke', () => {
  beforeEach(() => {
    globalThis.indexedDB = new IDBFactory();
    window.localStorage.clear();
    __resetWarnOnce();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    window.localStorage.clear();
  });

  it('預設 render 不會出錯，會顯示控制區與表格且不顯示單字數量', async () => {
    const { wrapper } = await mountVocabularyView();

    expect(wrapper.get('.vocabulary-view').classes()).toContain('py-1');
    expect(wrapper.find('[data-testid="vocabulary-control-bar"]').exists()).toBe(true);
    expectNoWordCountSummary(wrapper);
    expect(wrapper.find('[data-testid="vocabulary-filter-jlpt-select-all"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="vocabulary-filter-jlpt-level-all"]').exists()).toBe(false);
    expectJlptControlsChecked(wrapper);
    expect(wrapper.find('[data-testid="vocabulary-table"]').exists()).toBe(true);
  });

  it('控制列將 level controls 放在 action controls 上方，並讓 JLPT 與測驗共用同一列', async () => {
    const { wrapper } = await mountVocabularyView();

    const controlBar = wrapper.get('[data-testid="vocabulary-control-bar"]');
    const levelControls = controlBar.get('[data-testid="vocabulary-level-controls"]');
    const levelControlsLeft = levelControls.get('[data-testid="vocabulary-level-controls-left"]');
    const levelControlsRight = levelControls.get('[data-testid="vocabulary-level-controls-right"]');
    const actionControls = controlBar.get('[data-testid="vocabulary-action-controls"]');
    const actionControlsLeft = actionControls.get('[data-testid="vocabulary-action-controls-left"]');
    const actionControlsRight = actionControls.get('[data-testid="vocabulary-action-controls-right"]');
    const n1Level = levelControlsLeft.get('[data-testid="vocabulary-filter-jlpt-level-n1"]');
    const n5Level = levelControlsLeft.get('[data-testid="vocabulary-filter-jlpt-level-n5"]');
    const showKanji = actionControlsLeft.get('[data-testid="vocabulary-filter-show-kanji"]');
    const showAllSounds = actionControlsLeft.get('[data-testid="vocabulary-filter-show-all-sounds"]');
    const markedOnly = actionControlsLeft.get('[data-testid="vocabulary-filter-show-marked-only"]');
    const startQuiz = levelControlsRight.get('[data-testid="vocabulary-start-quiz-button"]');
    const saveMarks = actionControls.get('[data-testid="vocabulary-save-marks-button"]');

    expect(appearsBefore(levelControls.element, actionControls.element)).toBe(true);
    expect(appearsBefore(n1Level.element, n5Level.element)).toBe(true);
    expect(appearsBefore(levelControlsLeft.element, levelControlsRight.element)).toBe(true);
    expect(appearsBefore(showKanji.element, showAllSounds.element)).toBe(true);
    expect(appearsBefore(showAllSounds.element, markedOnly.element)).toBe(true);
    expect(appearsBefore(actionControlsLeft.element, actionControlsRight.element)).toBe(true);
    expect(appearsBefore(levelControls.element, saveMarks.element)).toBe(true);
    expect(startQuiz.element).toBeInstanceOf(HTMLElement);
    expect(actionControlsRight.find('[data-testid="vocabulary-start-quiz-button"]').exists()).toBe(false);
    expect(actionControls.element.firstElementChild).toBe(actionControlsLeft.element);
    expect(actionControls.element.lastElementChild).toBe(actionControlsRight.element);
    expect(controlBar.find('[data-testid="vocabulary-filter-practice-mode"]').exists()).toBe(false);
    expect(markedOnly.text()).toContain('僅註記');
    expect(actionControls.text()).not.toContain('只顯示註記');
  });

  it('預設為操作模式，並可切換閱讀模式且保留搜尋列與模式按鈕列', async () => {
    const { wrapper } = await mountVocabularyView();
    const view = wrapper.get('[data-testid="vocabulary-view"]');
    const tableRegion = wrapper.get('[data-testid="vocabulary-table-region"]');
    const searchControls = wrapper.get('[data-testid="vocabulary-search-controls"]');
    const modeButton = wrapper.get('[data-testid="vocabulary-reading-mode-button"]');

    expect(view.classes()).not.toContain('vocabulary-view-reading-mode');
    expect(tableRegion.classes()).not.toContain('vocabulary-table-region-reading-mode');
    expect(modeButton.text()).toBe('閱讀模式');
    expect(modeButton.classes()).toContain('vocabulary-reading-mode-button--read');
    expect(searchControls.isVisible()).toBe(true);

    await modeButton.trigger('click');
    await nextTick();

    const operationButton = wrapper.get('[data-testid="vocabulary-reading-mode-button"]');

    expect(wrapper.get('[data-testid="vocabulary-view"]').classes()).toContain('vocabulary-view-reading-mode');
    expect(wrapper.get('[data-testid="vocabulary-table-region"]').classes()).toContain('vocabulary-table-region-reading-mode');
    expect(operationButton.text()).toBe('操作模式');
    expect(operationButton.classes()).toContain('vocabulary-reading-mode-button--operate');
    expect(wrapper.get('[data-testid="vocabulary-search-controls"]').isVisible()).toBe(true);

    await operationButton.trigger('click');
    await nextTick();

    expect(wrapper.get('[data-testid="vocabulary-view"]').classes()).not.toContain('vocabulary-view-reading-mode');
    expect(wrapper.get('[data-testid="vocabulary-table-region"]').classes()).not.toContain('vocabulary-table-region-reading-mode');
  });

  it('可儲存註記，header 批次取消只更新目前 visible draft marks', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    const { wrapper } = await mountVocabularyView();

    await wrapper.get('[data-testid="vocabulary-search-input"]').setValue('早上');
    await waitForVisibleVocabularyRowCount(wrapper, 1);
    const markCheckbox = firstVisibleVocabularyRow(wrapper).get('input[type="checkbox"]');

    await markCheckbox.setValue(true);
    await wrapper.get('[data-testid="vocabulary-save-marks-button"]').trigger('click');
    await waitForIndexedDbMarkCount(1);
    await nextTick();

    expect(await indexedDbHasMarks()).toBe(true);
    expect(window.localStorage.getItem('vocabulary-mark-snapshot')).toBeNull();
    expect(wrapper.html()).toContain('vocabulary-marked-row');
    expect((wrapper.get('[data-testid="vocabulary-bulk-mark-checkbox"]').element as HTMLInputElement).checked).toBe(true);

    await wrapper.get('[data-testid="vocabulary-bulk-mark-checkbox"]').setValue(false);

    expect((firstVisibleVocabularyRow(wrapper).get('input[type="checkbox"]').element as HTMLInputElement).checked).toBe(false);
    // Header bulk toggle SHALL NOT write to the mark store; IndexedDB marks remain unchanged
    expect(await indexedDbHasMarks()).toBe(true);
    expect(wrapper.html()).toContain('vocabulary-marked-row');
  });

  it('長按約 0.4 秒會暫時揭露隱藏欄位，放開後恢復', async () => {
    const { wrapper } = await mountVocabularyView();

    vi.useFakeTimers();

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

    const { wrapper } = await mountVocabularyView();

    await wrapper.get('[data-testid="vocabulary-mark-checkbox-1"]').setValue(true);
    await wrapper.get('[data-testid="vocabulary-filter-show-marked-only"] input').setValue(true);

    expect(wrapper.find('[data-testid="vocabulary-row-1"]').exists()).toBe(false);
    expectNoWordCountSummary(wrapper);

    await wrapper.get('[data-testid="vocabulary-filter-show-marked-only"] input').setValue(false);
    await wrapper.get('[data-testid="vocabulary-save-marks-button"]').trigger('click');
    await waitForIndexedDbMarkCount(1);
    // Allow the composable's persistedMarkedKeys reactive update (after await chain)
    // to propagate to the filter computed.
    await flushPromises();
    await nextTick();
    await flushPromises();
    await nextTick();
    await wrapper.get('[data-testid="vocabulary-filter-show-marked-only"] input').setValue(true);
    await flushPromises();
    await nextTick();

    expect(wrapper.find('[data-testid="vocabulary-row-1"]').exists()).toBe(true);
    expect(wrapper.html()).toContain('vocabulary-marked-row');
  });

  it('可搜尋 v16 新增的四個方位出口詞', async () => {
    const { wrapper } = await mountVocabularyView();

    for (const term of [
      '東口',
      '西口',
      '北口',
      '南口'
    ] as const) {
      await wrapper.get('[data-testid="vocabulary-search-input"]').setValue(term);
      await waitForVisibleVocabularyRowCount(wrapper, 1);

      expectNoWordCountSummary(wrapper);
      expect(visibleVocabularyRows(wrapper)).toHaveLength(1);
      expect(firstVisibleVocabularyRow(wrapper).text()).toContain(term);
    }
  });

  it('可從目前可見且已勾選的單字開始測驗，結算後只更新 draft 且不顯示未儲存提示', async () => {
    const { wrapper } = await mountVocabularyView();
    const startQuizButton = wrapper.get('[data-testid="vocabulary-start-quiz-button"]');

    expect(startQuizButton.attributes('disabled')).toBeDefined();

    await clearAllJlptLevels(wrapper);
    expect(wrapper.find('[data-testid="vocabulary-start-quiz-button"]').exists()).toBe(false);

    await getFilterInput(wrapper, jlptLevelTestIds.N5).setValue(true);
    await waitForVocabularyRows(wrapper);

    await wrapper.get('[data-testid="vocabulary-search-input"]').setValue('早上');
    await waitForVisibleVocabularyRowCount(wrapper, 1);
    expect(visibleVocabularyRows(wrapper)).toHaveLength(1);
    expect(wrapper.get('[data-testid="vocabulary-start-quiz-button"]').attributes('disabled')).toBeDefined();

    await markFirstVisibleVocabularyRow(wrapper);
    expect(wrapper.get('[data-testid="vocabulary-start-quiz-button"]').attributes('disabled')).toBeUndefined();

    await wrapper.get('[data-testid="vocabulary-start-quiz-button"]').trigger('click');
    expect(wrapper.find('[data-testid="exam-modal"]').exists()).toBe(true);
    await wrapper.get('[data-testid="vocabulary-reading-mode-button"]').trigger('click');
    await nextTick();
    expect(wrapper.get('[data-testid="exam-modal"]').classes()).toContain('surface-card');
    expect(wrapper.get('[data-testid="vocabulary-table-region"]').classes()).toContain('vocabulary-table-region-reading-mode');
    expect(wrapper.get('[data-testid="exam-prompt"]').classes()).toContain('exam-modal-prompt-md');
    expect(wrapper.find('[data-testid="exam-hint"]').exists()).toBe(false);

    await wrapper.get('[data-testid="exam-unknown-button"]').trigger('click');
    await wrapper.get('[data-testid="exam-next-button"]').trigger('click');

    expect(wrapper.find('[data-testid="exam-modal"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="vocabulary-unsaved-marks-hint"]').exists()).toBe(false);
    expect(wrapper.text()).not.toContain('尚未儲存');
    // Mark store SHALL remain empty when the user did not save during the quiz flow
    expect(await indexedDbHasMarks()).toBe(false);
    expect(window.localStorage.getItem('vocabulary-mark-snapshot')).toBeNull();
  });
});
