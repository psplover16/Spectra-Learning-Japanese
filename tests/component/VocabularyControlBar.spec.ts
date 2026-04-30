import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import VocabularyControlBar from '@/modules/vocabulary/components/VocabularyControlBar.vue';

const jlptLevels = ['N1', 'N2', 'N3', 'N4', 'N5'] as const;
type JlptLevel = (typeof jlptLevels)[number];

const jlptLevelTestIds: Record<JlptLevel | 'all', string> = {
  all: 'vocabulary-filter-jlpt-level-all',
  N1: 'vocabulary-filter-jlpt-level-n1',
  N2: 'vocabulary-filter-jlpt-level-n2',
  N3: 'vocabulary-filter-jlpt-level-n3',
  N4: 'vocabulary-filter-jlpt-level-n4',
  N5: 'vocabulary-filter-jlpt-level-n5'
};

function mountControlBar(selectedJlptLevels: Iterable<JlptLevel> = jlptLevels) {
  const props = {
    searchText: '',
    showAllSounds: true,
    showKanji: true,
    showMarkedOnly: false,
    practiceMode: false,
    selectedJlptLevels: new Set(selectedJlptLevels)
  };

  return mount(VocabularyControlBar, { props });
}

function getFilterInput(wrapper: VueWrapper, testId: string) {
  return wrapper.get(`[data-testid="${testId}"] input`);
}

function getJlptInput(wrapper: VueWrapper, level: JlptLevel | 'all') {
  return getFilterInput(wrapper, jlptLevelTestIds[level]);
}

function checked(wrapper: VueWrapper, level: JlptLevel | 'all') {
  return (getJlptInput(wrapper, level).element as HTMLInputElement).checked;
}

function expectJlptControlsChecked(wrapper: VueWrapper, expected: boolean) {
  for (const level of jlptLevels) {
    expect(checked(wrapper, level)).toBe(expected);
  }

  expect(checked(wrapper, 'all')).toBe(expected);
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

    await wrapper.get('[data-testid="vocabulary-filter-show-all-sounds"] input').setValue(false);
    expect(wrapper.emitted('update:showAllSounds')?.[0]).toEqual([false]);

    await wrapper.get('[data-testid="vocabulary-filter-show-kanji"] input').setValue(false);
    expect(wrapper.emitted('update:showKanji')?.[0]).toEqual([false]);

    await wrapper.get('[data-testid="vocabulary-filter-practice-mode"] input').setValue(true);
    expect(wrapper.emitted('update:practiceMode')?.[0]).toEqual([true]);

    await wrapper.get('[data-testid="vocabulary-filter-show-marked-only"] input').setValue(true);
    expect(wrapper.emitted('update:showMarkedOnly')?.[0]).toEqual([true]);
  });

  it('預設勾選 N1-N5 與全部勾選，並把 level controls 排在 action controls 上方', () => {
    const wrapper = mountControlBar();

    expect(wrapper.get(`[data-testid="${jlptLevelTestIds.all}"]`).text()).toContain('全部勾選');

    for (const level of jlptLevels) {
      expect(wrapper.get(`[data-testid="${jlptLevelTestIds[level]}"]`).text()).toContain(level);
    }

    expectJlptControlsChecked(wrapper, true);

    const levelControls = wrapper.get('[data-testid="vocabulary-level-controls"]');
    const actionControls = wrapper.get('[data-testid="vocabulary-action-controls"]');

    expect(appearsBefore(levelControls.element, actionControls.element)).toBe(true);
  });

  it('全部勾選會批次取消與回復 N1-N5，取消任一 level 也會取消全部勾選', async () => {
    const wrapper = mountControlBar();

    await getJlptInput(wrapper, 'N3').setValue(false);
    expectLastSelectedJlptLevels(wrapper, ['N1', 'N2', 'N4', 'N5']);

    await wrapper.setProps({ selectedJlptLevels: new Set<JlptLevel>(['N1', 'N2', 'N4', 'N5']) });
    expect(checked(wrapper, 'all')).toBe(false);

    await wrapper.setProps({ selectedJlptLevels: new Set<JlptLevel>(jlptLevels) });
    expect(checked(wrapper, 'all')).toBe(true);

    await getJlptInput(wrapper, 'all').setValue(false);
    expectLastSelectedJlptLevels(wrapper, []);

    await wrapper.setProps({ selectedJlptLevels: new Set<JlptLevel>() });
    expectJlptControlsChecked(wrapper, false);

    await getJlptInput(wrapper, 'all').setValue(true);
    expectLastSelectedJlptLevels(wrapper, jlptLevels);

    await wrapper.setProps({ selectedJlptLevels: new Set<JlptLevel>(jlptLevels) });
    expectJlptControlsChecked(wrapper, true);
  });

  it('手動把 N1-N5 全部勾回時會回復全部勾選', async () => {
    const wrapper = mountControlBar([]);
    const selected = new Set<JlptLevel>();

    expectJlptControlsChecked(wrapper, false);

    for (const level of jlptLevels) {
      await getJlptInput(wrapper, level).setValue(true);
      selected.add(level);

      expectLastSelectedJlptLevels(wrapper, selected);

      await wrapper.setProps({ selectedJlptLevels: new Set(selected) });
    }

    expect(checked(wrapper, 'all')).toBe(true);
  });

  it('keeps 8px outer gap between upper control blocks while action checkboxes keep a gap', () => {
    const wrapper = mountControlBar();
    const controlBar = wrapper.get('[data-testid="vocabulary-control-bar"]');
    const controlBlocks = Array.from(controlBar.element.children);

    expect(controlBlocks).toHaveLength(3);
    expect(controlBlocks[0]?.classList.contains('vocabulary-search-controls')).toBe(true);
    expect(controlBlocks[1]).toBe(wrapper.get('[data-testid="vocabulary-level-controls"]').element);
    expect(controlBlocks[2]).toBe(wrapper.get('[data-testid="vocabulary-action-controls"]').element);

    const css = readMainCss();
    const controlBarCss = cssBodyForSelector(css, '.vocabulary-control-bar');
    const actionControlsLeftCss = cssBodyForSelector(css, '.vocabulary-action-controls-left');

    expect(controlBarCss).toContain('gap-2');
    expect(controlBarCss).not.toContain('gap-0');
    expect(controlBarCss).not.toMatch(/\bspace-y-/);
    expect(actionControlsLeftCss).toContain('gap-3');
  });
});
