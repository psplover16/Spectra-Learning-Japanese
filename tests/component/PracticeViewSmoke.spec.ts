import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PracticeView from '@/modules/practice/views/PracticeView.vue';
import { mountWithPracticeSession } from './testUtils';
import { clearLatestUnknownResults, writeLatestUnknownResults } from '@/modules/exam/storage/latestUnknownResultStorage';

vi.mock('@/shared/version/appVersion', () => ({
  appVersion: '0.0.1'
}));

describe('PracticeView', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    clearLatestUnknownResults();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('預設 render 不會出錯，且古語假名位置先顯示 placeholder', () => {
    const { wrapper } = mountWithPracticeSession(PracticeView);

    expect(wrapper.text()).toContain('清音');
    expect(wrapper.text()).toContain('濁音／半濁音');
    expect(wrapper.text()).toContain('撥音的發音規則');
    expect(wrapper.text()).not.toContain('tableA');
    expect(wrapper.text()).not.toContain('tableB');
    expect(wrapper.find('[data-testid="selection-detail-panel"]').exists()).toBe(false);
    expect(wrapper.text()).toContain('-');
  });

  it('首次 render 時即可看到濁音／半濁音以下的參考區塊', () => {
    const { wrapper } = mountWithPracticeSession(PracticeView);

    expect(wrapper.find('[data-testid="practice-reference-sections"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="seion-yoon-section"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="dakuon-yoon-section"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="loanword-section"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="choon-section"]').exists()).toBe(true);
  });

  it('route root 不加入 py-1 垂直 padding', () => {
    const { wrapper } = mountWithPracticeSession(PracticeView);

    expect(wrapper.get('.practice-view').classes()).not.toContain('py-1');
  });

  it('在字母練習頁整個內容流最底部右下顯示版號並維持指定樣式', () => {
    const { wrapper } = mountWithPracticeSession(PracticeView);
    const practiceView = wrapper.get('.practice-view');
    const referenceSections = wrapper.get('[data-testid="practice-reference-sections"]');
    const versionRow = wrapper.get('[data-testid="practice-version-row"]');
    const versionLabel = versionRow.get('[data-testid="app-version-label"]');

    expect(referenceSections.classes()).toContain('space-y-1');
    expect(referenceSections.find('[data-testid="app-version-label"]').exists()).toBe(false);
    expect(versionRow.element.parentElement).toBe(practiceView.element);
    expect(practiceView.element.lastElementChild).toBe(versionRow.element);
    expect(versionRow.classes()).toEqual(expect.arrayContaining(['flex', 'w-full', 'justify-end']));
    expect(versionLabel.text()).toBe('0.0.1');
    expect(versionLabel.classes()).toEqual(expect.arrayContaining(['block', 'text-[1rem]', 'text-black']));
    expect([...versionRow.classes(), ...versionLabel.classes()]).not.toContain('fixed');
  });

  it('清音與濁音／半濁音表格維持指定字級 class 與可見性', () => {
    const { wrapper } = mountWithPracticeSession(PracticeView);

    expect(wrapper.get('[data-testid="practice-seion-table"]').classes()).toContain('practice-kana-table');
    expect(wrapper.get('[data-testid="practice-dakuon-table"]').classes()).toContain('practice-kana-table');
    expect(wrapper.findAll('.practice-kana-text-stack').length).toBeGreaterThan(0);
    expect(wrapper.findAll('.practice-kana-main-text').length).toBeGreaterThan(0);
    expect(wrapper.findAll('.practice-kana-romaji-text').length).toBeGreaterThan(0);
  });

  it('進入第一頁且已有最近一次結果時會觸發 smooth scroll', async () => {
    vi.useFakeTimers();
    const scrollSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);

    writeLatestUnknownResults({
      updatedAt: '2026-03-24T00:00:00.000Z',
      totalUnknownCount: 1,
      results: [
        {
          kanaId: 'tableA-ka',
          hiragana: 'か',
          katakana: 'カ',
          romaji: 'ka',
          count: 1
        }
      ]
    });

    mountWithPracticeSession(PracticeView);
    await vi.runAllTimersAsync();

    expect(scrollSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        behavior: 'smooth'
      })
    );
  });

  it('從上方工具列清除最近結果時不會強制回頂', async () => {
    vi.useFakeTimers();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const scrollSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);

    writeLatestUnknownResults({
      updatedAt: '2026-03-24T00:00:00.000Z',
      totalUnknownCount: 1,
      results: [
        {
          kanaId: 'tableA-ka',
          hiragana: 'か',
          katakana: 'カ',
          romaji: 'ka',
          count: 1
        }
      ]
    });

    const { wrapper } = mountWithPracticeSession(PracticeView);
    await vi.runAllTimersAsync();
    scrollSpy.mockClear();

    await wrapper.get('[data-testid="toolbar-clear-result-button"]').trigger('click');
    await vi.runAllTimersAsync();

    expect(confirmSpy).toHaveBeenCalledOnce();
    expect(scrollSpy).not.toHaveBeenCalled();
    expect(wrapper.find('[data-testid="result-panel-clear-button"]').exists()).toBe(false);
  });

  it('從下方結果區清除最近結果時會平滑回到頂部', async () => {
    vi.useFakeTimers();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const scrollSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);

    writeLatestUnknownResults({
      updatedAt: '2026-03-24T00:00:00.000Z',
      totalUnknownCount: 1,
      results: [
        {
          kanaId: 'tableA-ka',
          hiragana: 'か',
          katakana: 'カ',
          romaji: 'ka',
          count: 1
        }
      ]
    });

    const { wrapper } = mountWithPracticeSession(PracticeView);
    await vi.runAllTimersAsync();
    scrollSpy.mockClear();

    await wrapper.get('[data-testid="result-panel-clear-button"]').trigger('click');
    await vi.runAllTimersAsync();

    expect(scrollSpy).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth'
    });
    expect(wrapper.find('[data-testid="result-panel-clear-button"]').exists()).toBe(false);
  });
});
