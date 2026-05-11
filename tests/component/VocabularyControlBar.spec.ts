import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import VocabularyControlBar from '@/modules/vocabulary/components/VocabularyControlBar.vue';

const jlptLevels = ['N1', 'N2', 'N3', 'N4', 'N5'] as const;
type JlptLevel = (typeof jlptLevels)[number];

const jlptLevelTestIds: Record<JlptLevel, string> = {
  N1: 'vocabulary-filter-jlpt-level-n1',
  N2: 'vocabulary-filter-jlpt-level-n2',
  N3: 'vocabulary-filter-jlpt-level-n3',
  N4: 'vocabulary-filter-jlpt-level-n4',
  N5: 'vocabulary-filter-jlpt-level-n5'
};

type ControlBarProps = Partial<InstanceType<typeof VocabularyControlBar>['$props']> & {
  canShowStartQuiz?: boolean;
};

function mountControlBar(selectedJlptLevels: Iterable<JlptLevel> = jlptLevels) {
  const props = {
    searchText: '',
    showAllSounds: true,
    showKanji: true,
    showMarkedOnly: false,
    readingMode: false,
    selectedJlptLevels: new Set(selectedJlptLevels)
  };

  return mount(VocabularyControlBar, { props });
}

function mountControlBarWithProps(props: ControlBarProps) {
  return mount(VocabularyControlBar, {
    props: {
      searchText: '',
      showAllSounds: true,
      showKanji: true,
      showMarkedOnly: false,
      readingMode: false,
      selectedJlptLevels: new Set(jlptLevels),
      ...props
    }
  });
}

function getFilterInput(wrapper: VueWrapper, testId: string) {
  return wrapper.get(`[data-testid="${testId}"] input`);
}

function getJlptInput(wrapper: VueWrapper, level: JlptLevel) {
  return getFilterInput(wrapper, jlptLevelTestIds[level]);
}

function checked(wrapper: VueWrapper, level: JlptLevel) {
  return (getJlptInput(wrapper, level).element as HTMLInputElement).checked;
}

function expectJlptControlsChecked(wrapper: VueWrapper, expected: boolean) {
  for (const level of jlptLevels) {
    expect(checked(wrapper, level)).toBe(expected);
  }
}

function expectLastSelectedJlptLevels(wrapper: VueWrapper, expected: Iterable<JlptLevel>) {
  const events = wrapper.emitted('update:selectedJlptLevels');
  const payload = events?.at(-1)?.[0];

  expect(payload).toBeInstanceOf(Set);
  expect([...(payload as Set<JlptLevel>)].sort()).toEqual([...expected].sort());
}

function appearsBefore(first: Element, second: Element) {
  return Boolean(first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING);
}

function readMainCss() {
  return readFileSync(join(process.cwd(), 'src/styles/main.css'), 'utf8');
}

function cssBlocksForSelector(css: string, selector: string) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const selectorBlockPattern = new RegExp(`${escapedSelector}\\s*\\{([^}]*)\\}`, 'g');

  return Array.from(css.matchAll(selectorBlockPattern), (match) => match[1]);
}

function cssBodyForSelector(css: string, selector: string) {
  const blocks = cssBlocksForSelector(css, selector);

  expect(blocks.length).toBeGreaterThan(0);

  return blocks.join('\n');
}

describe('VocabularyControlBar', () => {
  it('可輸入搜尋字詞並切換控制 checkbox', async () => {
    const wrapper = mountControlBar();

    await wrapper.get('[data-testid="vocabulary-search-input"]').setValue('概念');
    expect(wrapper.emitted('update:searchText')?.[0]).toEqual(['概念']);

    expect(wrapper.find('[data-testid="vocabulary-filter-practice-mode"]').exists()).toBe(false);

    await wrapper.get('[data-testid="vocabulary-filter-show-kanji"] input').setValue(false);
    expect(wrapper.emitted('update:showKanji')?.[0]).toEqual([false]);

    await wrapper.get('[data-testid="vocabulary-filter-show-all-sounds"] input').setValue(false);
    expect(wrapper.emitted('update:showAllSounds')?.[0]).toEqual([false]);

    await wrapper.get('[data-testid="vocabulary-filter-show-marked-only"] input').setValue(true);
    expect(wrapper.emitted('update:showMarkedOnly')?.[0]).toEqual([true]);
  });

  it('操作區依序顯示漢字、全部字音、僅註記，且預設勾選漢字與全部字音', () => {
    const wrapper = mountControlBar();
    const actionControlsLeft = wrapper.get('[data-testid="vocabulary-action-controls-left"]');
    const showKanji = actionControlsLeft.get('[data-testid="vocabulary-filter-show-kanji"]');
    const showAllSounds = actionControlsLeft.get('[data-testid="vocabulary-filter-show-all-sounds"]');
    const markedOnly = actionControlsLeft.get('[data-testid="vocabulary-filter-show-marked-only"]');

    expect(appearsBefore(showKanji.element, showAllSounds.element)).toBe(true);
    expect(appearsBefore(showAllSounds.element, markedOnly.element)).toBe(true);
    expect((showKanji.get('input').element as HTMLInputElement).checked).toBe(true);
    expect((showAllSounds.get('input').element as HTMLInputElement).checked).toBe(true);
    expect((markedOnly.get('input').element as HTMLInputElement).checked).toBe(false);
    expect(markedOnly.text()).toContain('僅註記');
    expect(actionControlsLeft.text()).not.toContain('只顯示註記');
  });

  it('模式按鈕在閱讀模式與操作模式之間切換文字、顏色與事件', async () => {
    const wrapper = mountControlBar();
    const modeButton = wrapper.get('[data-testid="vocabulary-reading-mode-button"]');

    expect(modeButton.text()).toBe('閱讀模式');
    expect(modeButton.classes()).toContain('vocabulary-reading-mode-button--read');

    await modeButton.trigger('click');
    expect(wrapper.emitted('update:readingMode')?.[0]).toEqual([true]);

    await wrapper.setProps({ readingMode: true });
    const operationButton = wrapper.get('[data-testid="vocabulary-reading-mode-button"]');

    expect(operationButton.text()).toBe('操作模式');
    expect(operationButton.classes()).toContain('vocabulary-reading-mode-button--operate');

    await operationButton.trigger('click');
    expect(wrapper.emitted('update:readingMode')?.[1]).toEqual([false]);
  });

  it('預設勾選 N1-N5、不顯示全部勾選，並把開始測驗放在 JLPT row 右側', () => {
    const wrapper = mountControlBar();

    expect(wrapper.find('[data-testid="vocabulary-filter-jlpt-level-all"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="vocabulary-filter-jlpt-select-all"]').exists()).toBe(false);

    for (const level of jlptLevels) {
      expect(wrapper.get(`[data-testid="${jlptLevelTestIds[level]}"]`).text()).toContain(level);
    }

    expectJlptControlsChecked(wrapper, true);

    const levelControls = wrapper.get('[data-testid="vocabulary-level-controls"]');
    const levelControlsLeft = wrapper.get('[data-testid="vocabulary-level-controls-left"]');
    const levelControlsRight = wrapper.get('[data-testid="vocabulary-level-controls-right"]');
    const actionControls = wrapper.get('[data-testid="vocabulary-action-controls"]');
    const startQuiz = levelControlsRight.get('[data-testid="vocabulary-start-quiz-button"]');

    expect(appearsBefore(levelControls.element, actionControls.element)).toBe(true);
    expect(appearsBefore(levelControlsLeft.element, levelControlsRight.element)).toBe(true);
    // After the reading-mode-transition refactor, level-controls wraps its
    // children in `.vocabulary-level-controls-inner` so the outer grid can
    // collapse via grid-template-rows without disrupting the inner flex
    // layout. Assert via the inner wrapper.
    const levelControlsInner = levelControls.get('.vocabulary-level-controls-inner');
    expect(levelControls.element.firstElementChild).toBe(levelControlsInner.element);
    expect(levelControls.element.lastElementChild).toBe(levelControlsInner.element);
    expect(levelControlsInner.element.firstElementChild).toBe(levelControlsLeft.element);
    expect(levelControlsInner.element.lastElementChild).toBe(levelControlsRight.element);
    expect(startQuiz.element).toBeInstanceOf(HTMLElement);
  });

  it('individual JLPT checkbox 可以逐一更新選取集合，也可以清空全部 level', async () => {
    const wrapper = mountControlBar();
    const selected = new Set<JlptLevel>(jlptLevels);

    await getJlptInput(wrapper, 'N3').setValue(false);
    selected.delete('N3');
    expectLastSelectedJlptLevels(wrapper, selected);

    await wrapper.setProps({ selectedJlptLevels: new Set(selected) });
    expect(checked(wrapper, 'N3')).toBe(false);

    for (const level of ['N1', 'N2', 'N4', 'N5'] as const) {
      await getJlptInput(wrapper, level).setValue(false);
      selected.delete(level);
      expectLastSelectedJlptLevels(wrapper, selected);

      await wrapper.setProps({ selectedJlptLevels: new Set(selected) });
    }

    expectJlptControlsChecked(wrapper, false);

    await getJlptInput(wrapper, 'N5').setValue(true);
    expectLastSelectedJlptLevels(wrapper, ['N5']);
  });

  it('keeps 8px outer gap between upper control blocks while action row padding aligns controls', () => {
    const wrapper = mountControlBar();
    const controlBar = wrapper.get('[data-testid="vocabulary-control-bar"]');
    const controlBlocks = Array.from(controlBar.element.children);

    expect(controlBlocks).toHaveLength(3);
    expect(controlBlocks[0]?.classList.contains('vocabulary-search-controls')).toBe(true);
    expect(controlBlocks[1]).toBe(wrapper.get('[data-testid="vocabulary-level-controls"]').element);
    expect(controlBlocks[2]).toBe(wrapper.get('[data-testid="vocabulary-action-controls"]').element);

    const css = readMainCss();
    const controlBarCss = cssBodyForSelector(css, '.vocabulary-control-bar');
    const levelControlsCss = cssBodyForSelector(css, '.vocabulary-level-controls');
    const levelControlsInnerCss = cssBodyForSelector(css, '.vocabulary-level-controls-inner');
    const levelControlsLeftCss = cssBodyForSelector(css, '.vocabulary-level-controls-left');
    const levelControlsRightCss = cssBodyForSelector(css, '.vocabulary-level-controls-right');
    const actionControlsCss = cssBodyForSelector(css, '.vocabulary-action-controls');
    const actionControlsInnerCss = cssBodyForSelector(css, '.vocabulary-action-controls-inner');
    const actionControlsLeftCss = cssBodyForSelector(css, '.vocabulary-action-controls-left');
    const actionControlsRightCss = cssBodyForSelector(css, '.vocabulary-action-controls-right');

    expect(controlBarCss).toContain('gap-2');
    expect(controlBarCss).not.toContain('gap-0');
    expect(controlBarCss).not.toMatch(/\bspace-y-/);
    // After the reading-mode-transition refactor, outer level/action controls
    // are grid containers driving the collapse animation; their flex layout
    // (including `justify-between`) moved to the new `-inner` wrapper.
    expect(levelControlsInnerCss).toContain('justify-between');
    expect(levelControlsCss).toContain('rounded-md');
    expect(levelControlsCss).toContain('border');
    expect(levelControlsCss).toContain('border-gray-200');
    expect(levelControlsCss).toContain('bg-neutral-50');
    expect(levelControlsCss).toContain('px-2');
    expect(levelControlsCss).toContain('py-2');
    expect(levelControlsLeftCss).toContain('gap-2');
    expect(levelControlsRightCss).toContain('gap-2');
    expect(actionControlsInnerCss).toContain('justify-between');
    expect(actionControlsCss).toContain('rounded-md');
    expect(actionControlsCss).toContain('border');
    expect(actionControlsCss).toContain('border-gray-200');
    expect(actionControlsCss).toContain('bg-neutral-50');
    expect(actionControlsCss).toContain('px-2');
    expect(actionControlsCss).toContain('py-2');
    expect(actionControlsLeftCss).toContain('gap-3');
    expect(actionControlsLeftCss).not.toContain('px-2');
    expect(actionControlsLeftCss).not.toContain('py-2');
    expect(actionControlsRightCss).toContain('gap-2');
  });

  it('keeps compact search height and mode button sizing aligned with start quiz', () => {
    const css = readMainCss();
    const searchInputCss = cssBodyForSelector(css, '.vocabulary-search-input');
    const modeButtonCss = cssBodyForSelector(css, '.vocabulary-reading-mode-button');

    expect(searchInputCss).toContain('h-8');
    expect(searchInputCss).not.toContain('h-10');
    expect(modeButtonCss).toContain('px-2');
    expect(modeButtonCss).toContain('py-1');
    expect(modeButtonCss).not.toContain('h-10');
    expect(modeButtonCss).not.toContain('px-3');
    expect(modeButtonCss).not.toContain('rounded-md');
  });

  it('依 props 隱藏開始測驗按鈕，顯示時可停用或送出事件，且不顯示未儲存提示', async () => {
    const wrapper = mountControlBarWithProps({
      canShowStartQuiz: false,
      canStartQuiz: false
    });

    expect(wrapper.find('[data-testid="vocabulary-start-quiz-button"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="vocabulary-unsaved-marks-hint"]').exists()).toBe(false);
    expect(wrapper.text()).not.toContain('尚未儲存');

    await wrapper.setProps({ canShowStartQuiz: true });
    expect(wrapper.get('[data-testid="vocabulary-start-quiz-button"]').attributes('disabled')).toBeDefined();

    await wrapper.setProps({ canStartQuiz: true });
    await wrapper.get('[data-testid="vocabulary-start-quiz-button"]').trigger('click');

    expect(wrapper.emitted('startQuiz')).toHaveLength(1);
  });
});
