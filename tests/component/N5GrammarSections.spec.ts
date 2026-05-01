import { afterEach, describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import { n5GrammarCompletionStorageKey } from '@/modules/n5Grammar/storage/n5GrammarCompletionStorage';
import N5GrammarView from '@/modules/n5Grammar/views/N5GrammarView.vue';
import { mountWithPracticeSession } from './testUtils';

describe('N5GrammarSections', () => {
  afterEach(() => {
    window.localStorage.removeItem(n5GrammarCompletionStorageKey);
  });

  it('敬體變化速覽預設收合，展開後顯示 compare table 與 12 組儲存格例句', async () => {
    const { wrapper } = mountWithPracticeSession(N5GrammarView);
    const toggle = wrapper.get('[data-testid="n5-grammar-toggle-polite-overview"]');
    const body = wrapper.find('[data-testid="n5-grammar-body-polite-overview"]');

    expect(wrapper.get('[data-testid="n5-grammar-title-core-term-usage-overview"]').text()).toBe('核心詞類用法總覽');
    expect(wrapper.get('[data-testid="n5-grammar-title-polite-overview"]').text()).toBe('敬體變化速覽');
    expect(wrapper.get('[data-testid="n5-grammar-title-sentence-basics"]').text()).toBe('敬體句型：現在型與詞類基礎');
    expect(toggle.attributes('aria-expanded')).toBe('false');
    expect(body.attributes('style')).toContain('display: none;');

    await toggle.trigger('click');

    expect(toggle.attributes('aria-expanded')).toBe('true');
    expect(body.attributes('style') ?? '').not.toContain('display: none;');
    const politeOverview = wrapper.get('[data-testid="n5-grammar-section-polite-overview"]');

    expect(politeOverview.find('[data-testid="n5-grammar-compare-table-polite-overview"]').exists()).toBe(true);
    expect(politeOverview.findAll('[data-testid^="n5-grammar-table-example-"]')).toHaveLength(12);
    expect(politeOverview.text()).toContain('對應變化');
    expect(politeOverview.text()).toContain('この部屋は静かです。');
  });

  it('不同 section 仍依 mode 顯示對應 renderer，且 sentence-basics 不再有 compare table', async () => {
    const { wrapper } = mountWithPracticeSession(N5GrammarView);
    const sentenceBasics = wrapper.get('[data-testid="n5-grammar-section-sentence-basics"]');
    const sentenceBasicsToggle = wrapper.get('[data-testid="n5-grammar-toggle-sentence-basics"]');

    expect(sentenceBasicsToggle.attributes('aria-expanded')).toBe('false');
    await sentenceBasicsToggle.trigger('click');
    await wrapper.get('[data-testid="n5-grammar-toggle-particle-wa"]').trigger('click');
    await wrapper.get('[data-testid="n5-grammar-toggle-particle-mo"]').trigger('click');

    expect(sentenceBasicsToggle.attributes('aria-expanded')).toBe('true');
    expect(sentenceBasics.text()).toContain('名詞與な形容詞的句尾變化與接名詞差異');
    expect(sentenceBasics.find('[data-testid="n5-grammar-topic-noun-na-basics"]').exists()).toBe(true);
    expect(sentenceBasics.find('[data-testid="n5-grammar-compare-table-sentence-basics"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="n5-grammar-topic-wa-topic-marker"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="n5-grammar-compare-table-particle-mo"]').exists()).toBe(true);
  });

  it('新增的邀約與變化表現區塊可依 mode 正確展開', async () => {
    const { wrapper } = mountWithPracticeSession(N5GrammarView);

    const invitationToggle = wrapper.get('[data-testid="n5-grammar-toggle-invitation-comparison"]');
    const naruToggle = wrapper.get('[data-testid="n5-grammar-toggle-state-change-naru"]');
    expect(invitationToggle.attributes('aria-expanded')).toBe('false');
    expect(naruToggle.attributes('aria-expanded')).toBe('false');
    await invitationToggle.trigger('click');
    await naruToggle.trigger('click');

    const invitationSection = wrapper.get('[data-testid="n5-grammar-section-invitation-comparison"]');
    const naruSection = wrapper.get('[data-testid="n5-grammar-section-state-change-naru"]');

    expect(invitationSection.text()).toContain('邀約與勸誘：ませんか 與 ましょう');
    expect(invitationSection.find('[data-testid="n5-grammar-compare-table-invitation-comparison"]').exists()).toBe(true);
    expect(invitationSection.text()).toContain('疲れましたね。ちょっと休みませんか。');
    expect(invitationSection.text()).toContain('一緒に映画を見ない？');
    expect(invitationSection.findAll('[data-testid^="n5-grammar-table-example-"]')).toHaveLength(2);
    expect(invitationSection.find('[data-testid="n5-grammar-topic-mashou-plain-volitional"]').exists()).toBe(true);
    expect(invitationSection.text()).toContain('一緒に帰ろう。');
    expect(invitationSection.text()).toContain('この週末、食事に行きませんか。');
    expect(invitationSection.text()).toContain('山の中ではごみは捨てないで、ちゃんと持って帰りましょう。');

    expect(naruToggle.attributes('aria-expanded')).toBe('true');
    expect(naruSection.text()).toContain('狀態變化：～くなります / ～になります');
    expect(naruSection.find('[data-testid="n5-grammar-topic-naru-i-adjective"]').exists()).toBe(true);
    expect(naruSection.text()).toContain('髪が長くなりました。');
    expect(naruSection.text()).toContain('辞める / 止める / やめる');
  });

  it('v16 新增 section 依預設展開設定顯示說明、表格與例句', async () => {
    const { wrapper } = mountWithPracticeSession(N5GrammarView);
    const targetIds = ['core-term-usage-overview', 'dekiru-ability', 'demonstratives', 'numbers', 'time-expressions'];

    for (const id of targetIds) {
      const toggle = wrapper.get(`[data-testid="n5-grammar-toggle-${id}"]`);
      const body = wrapper.get(`[data-testid="n5-grammar-body-${id}"]`);

      expect(toggle.attributes('aria-expanded')).toBe('false');
      expect(body.attributes('style')).toContain('display: none;');
    }

    expect(wrapper.get('[data-testid="n5-grammar-toggle-question-words"]').attributes('aria-expanded')).toBe('false');
    expect(wrapper.get('[data-testid="n5-grammar-body-question-words"]').attributes('style')).toContain('display: none;');

    await wrapper.get('[data-testid="n5-grammar-toggle-core-term-usage-overview"]').trigger('click');
    await wrapper.get('[data-testid="n5-grammar-toggle-dekiru-ability"]').trigger('click');
    await wrapper.get('[data-testid="n5-grammar-toggle-demonstratives"]').trigger('click');
    await wrapper.get('[data-testid="n5-grammar-toggle-numbers"]').trigger('click');
    await wrapper.get('[data-testid="n5-grammar-toggle-time-expressions"]').trigger('click');

    const coreTermSection = wrapper.get('[data-testid="n5-grammar-section-core-term-usage-overview"]');
    const dekiruSection = wrapper.get('[data-testid="n5-grammar-section-dekiru-ability"]');
    const demonstrativesSection = wrapper.get('[data-testid="n5-grammar-section-demonstratives"]');
    const numbersSection = wrapper.get('[data-testid="n5-grammar-section-numbers"]');
    const timeSection = wrapper.get('[data-testid="n5-grammar-section-time-expressions"]');

    expect(coreTermSection.find('[data-testid="n5-grammar-compare-table-core-term-usage-overview"]').exists()).toBe(true);
    expect(coreTermSection.text()).toContain('い形容詞');
    expect(dekiruSection.text()).toContain('日本語ができます。');
    expect(demonstrativesSection.find('[data-testid="n5-grammar-compare-table-demonstratives"]').exists()).toBe(true);
    expect(demonstrativesSection.text()).toContain('こちら');
    expect(numbersSection.find('[data-testid="n5-grammar-compare-table-numbers"]').exists()).toBe(true);
    expect(numbersSection.text()).toContain('じゅっ / じっ');
    expect(timeSection.find('[data-testid="n5-grammar-compare-table-time-expressions"]').exists()).toBe(false);
    expect(timeSection.text()).toContain('月份');
    expect(timeSection.text()).toContain('日期');
    expect(timeSection.text()).toContain('星期');
    expect(timeSection.text()).toContain('小時');
    expect(timeSection.text()).toContain('分鐘');
    expect(timeSection.text()).toContain('其他常用表現');
    expect(timeSection.text()).toContain('午後三時半です。');
    expect(timeSection.text()).toContain('午前八時十五分です。');
    expect(timeSection.findAll('.n5-grammar-shared-note-box')).toHaveLength(1);
    expect(timeSection.get('[data-testid="n5-grammar-topic-time-months"]').find('.n5-grammar-example-box').exists()).toBe(false);
    expect(timeSection.get('[data-testid="n5-grammar-topic-time-dates"]').find('.n5-grammar-example-box').exists()).toBe(false);
    expect(timeSection.get('[data-testid="n5-grammar-topic-time-weekdays"]').find('.n5-grammar-example-box').exists()).toBe(true);
    expect(timeSection.get('[data-testid="n5-grammar-topic-time-common-expressions"]').find('.n5-grammar-example-box').exists()).toBe(true);
    expect(timeSection.findAll('.n5-grammar-detail-highlight').map((node) => node.text())).toEqual(
      expect.arrayContaining(['しがつ', 'しちがつ', 'くがつ', 'よじ', 'くじ', 'いっぷん', 'じゅっぷん'])
    );
  });

  it('指示詞例句以 class 標記紅色重點字，標題列不夾帶 description', async () => {
    const { wrapper } = mountWithPracticeSession(N5GrammarView);

    expect(wrapper.get('[data-testid="n5-grammar-title-demonstratives"]').text()).toBe('指示詞：こそあど系列');
    expect(wrapper.get('[data-testid="n5-grammar-title-demonstratives"]').text()).not.toContain('here.png');

    if (wrapper.get('[data-testid="n5-grammar-toggle-demonstratives"]').attributes('aria-expanded') === 'false') {
      await wrapper.get('[data-testid="n5-grammar-toggle-demonstratives"]').trigger('click');
    }

    const section = wrapper.get('[data-testid="n5-grammar-section-demonstratives"]');
    expect(section.get('[data-testid="n5-grammar-description-demonstratives"]').text()).toContain('N5常見指示詞');
    expect(section.findAll('.n5-grammar-example-highlight').map((node) => node.text())).toContain('これ');
    expect(section.text()).toContain('これは誰の傘ですか。');
  });

  it('完成 checkbox 不會觸發展開，且會以 section 標題提供無障礙標籤', async () => {
    const { wrapper } = mountWithPracticeSession(N5GrammarView);
    const toggle = wrapper.get('[data-testid="n5-grammar-toggle-sentence-basics"]');
    const checkbox = wrapper.get('[data-testid="n5-grammar-completion-sentence-basics"]');
    const body = wrapper.get('[data-testid="n5-grammar-body-sentence-basics"]');

    expect(toggle.text()).not.toContain('▼');
    expect(toggle.text()).not.toContain('▲');
    expect(checkbox.attributes('aria-label')).toBe('標記 敬體句型：現在型與詞類基礎 為已學完');
    expect(toggle.attributes('aria-expanded')).toBe('false');
    expect(body.attributes('style')).toContain('display: none;');

    await checkbox.trigger('click');

    const completedToggle = wrapper.get('[data-testid="n5-grammar-toggle-sentence-basics"]');
    const completedCheckbox = wrapper.get('[data-testid="n5-grammar-completion-sentence-basics"]');
    const completedBody = wrapper.get('[data-testid="n5-grammar-body-sentence-basics"]');

    expect((completedCheckbox.element as HTMLInputElement).checked).toBe(true);
    expect(completedToggle.attributes('aria-expanded')).toBe('false');
    expect(completedToggle.attributes('aria-disabled')).toBe('true');
    expect(completedBody.attributes('style')).toContain('display: none;');
  });

  it('會從 localStorage 還原完成狀態，並在變更後寫回 snapshot', async () => {
    window.localStorage.setItem(
      n5GrammarCompletionStorageKey,
      JSON.stringify({
        version: 1,
        completedSectionIds: ['sentence-basics'],
        updatedAt: '2026-04-30T00:00:00.000Z'
      })
    );

    const { wrapper } = mountWithPracticeSession(N5GrammarView);
    await nextTick();

    const toggle = wrapper.get('[data-testid="n5-grammar-toggle-sentence-basics"]');
    const checkbox = wrapper.get('[data-testid="n5-grammar-completion-sentence-basics"]');
    const body = wrapper.get('[data-testid="n5-grammar-body-sentence-basics"]');

    expect((checkbox.element as HTMLInputElement).checked).toBe(true);
    expect(toggle.attributes('aria-expanded')).toBe('false');
    expect(toggle.attributes('aria-disabled')).toBe('true');
    expect(body.attributes('style')).toContain('display: none;');

    await checkbox.trigger('click');
    const snapshot = JSON.parse(window.localStorage.getItem(n5GrammarCompletionStorageKey) ?? 'null') as {
      completedSectionIds: string[];
    } | null;
    const restoredCheckbox = wrapper.get('[data-testid="n5-grammar-completion-sentence-basics"]');
    const restoredToggle = wrapper.get('[data-testid="n5-grammar-toggle-sentence-basics"]');

    expect(snapshot?.completedSectionIds).toEqual([]);
    expect((restoredCheckbox.element as HTMLInputElement).checked).toBe(false);
    expect(restoredToggle.attributes('aria-disabled')).toBeUndefined();
  });

  it('依完成 checkbox 狀態分成未學習與已學習區，並維持各區原始順序', async () => {
    window.localStorage.setItem(
      n5GrammarCompletionStorageKey,
      JSON.stringify({
        version: 1,
        completedSectionIds: ['polite-overview', 'past-and-state'],
        updatedAt: '2026-04-30T00:00:00.000Z'
      })
    );

    const { wrapper } = mountWithPracticeSession(N5GrammarView);
    await nextTick();

    const unfinishedZone = wrapper.get('[data-testid="n5-grammar-unfinished-zone"]');
    const finishedZone = wrapper.get('[data-testid="n5-grammar-finished-zone"]');
    const unfinishedIds = unfinishedZone
      .findAll('[data-testid^="n5-grammar-section-"]')
      .map((section) => section.attributes('data-testid')?.replace('n5-grammar-section-', ''));
    const finishedIds = finishedZone
      .findAll('[data-testid^="n5-grammar-section-"]')
      .map((section) => section.attributes('data-testid')?.replace('n5-grammar-section-', ''));

    expect(unfinishedIds.slice(0, 3)).toEqual(['core-term-usage-overview', 'sentence-basics', 'invitation-comparison']);
    expect(unfinishedIds).not.toContain('polite-overview');
    expect(unfinishedIds).not.toContain('past-and-state');
    expect(finishedIds).toEqual(['polite-overview', 'past-and-state']);
  });

  it('沒有已學習 section 時不 render 已學習區', () => {
    const { wrapper } = mountWithPracticeSession(N5GrammarView);

    expect(wrapper.find('[data-testid="n5-grammar-unfinished-zone"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="n5-grammar-finished-zone"]').exists()).toBe(false);
  });

  it('分區容器不加 padding，兩區之間維持 1rem 間距', async () => {
    window.localStorage.setItem(
      n5GrammarCompletionStorageKey,
      JSON.stringify({
        version: 1,
        completedSectionIds: ['sentence-basics'],
        updatedAt: '2026-04-30T00:00:00.000Z'
      })
    );

    const { wrapper } = mountWithPracticeSession(N5GrammarView);
    await nextTick();
    const view = wrapper.get('[data-testid="n5-grammar-view"]');

    expect(view.classes()).toContain('space-y-4');
    expect(wrapper.get('[data-testid="n5-grammar-unfinished-zone"]').classes()).toContain('p-0');
    expect(wrapper.get('[data-testid="n5-grammar-finished-zone"]').classes()).toContain('p-0');
  });

  it('勾選完成 checkbox 後 section 會立即移到已學習區', async () => {
    const { wrapper } = mountWithPracticeSession(N5GrammarView);
    const unfinishedZone = wrapper.get('[data-testid="n5-grammar-unfinished-zone"]');

    expect(unfinishedZone.find('[data-testid="n5-grammar-section-sentence-basics"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="n5-grammar-finished-zone"]').exists()).toBe(false);

    await wrapper.get('[data-testid="n5-grammar-completion-sentence-basics"]').trigger('click');
    await nextTick();

    expect(wrapper.get('[data-testid="n5-grammar-unfinished-zone"]').find('[data-testid="n5-grammar-section-sentence-basics"]').exists()).toBe(false);
    expect(wrapper.get('[data-testid="n5-grammar-finished-zone"]').find('[data-testid="n5-grammar-section-sentence-basics"]').exists()).toBe(true);
  });

  it('完成後會立即收合並鎖定，取消完成後不會自動展開', async () => {
    const { wrapper } = mountWithPracticeSession(N5GrammarView);
    const header = wrapper.get('[data-testid="n5-grammar-header-polite-overview"]');
    const toggle = wrapper.get('[data-testid="n5-grammar-toggle-polite-overview"]');
    const checkbox = wrapper.get('[data-testid="n5-grammar-completion-polite-overview"]');
    const body = wrapper.get('[data-testid="n5-grammar-body-polite-overview"]');

    expect(header.classes()).not.toContain('is-expanded');
    await toggle.trigger('click');
    expect(toggle.attributes('aria-expanded')).toBe('true');
    expect(header.classes()).toContain('is-expanded');
    expect(body.attributes('style') ?? '').not.toContain('display: none;');

    await checkbox.trigger('click');

    const completedHeader = wrapper.get('[data-testid="n5-grammar-header-polite-overview"]');
    const completedToggle = wrapper.get('[data-testid="n5-grammar-toggle-polite-overview"]');
    const completedCheckbox = wrapper.get('[data-testid="n5-grammar-completion-polite-overview"]');
    const completedBody = wrapper.get('[data-testid="n5-grammar-body-polite-overview"]');

    expect((completedCheckbox.element as HTMLInputElement).checked).toBe(true);
    expect(completedToggle.attributes('aria-expanded')).toBe('false');
    expect(completedToggle.attributes('aria-disabled')).toBe('true');
    expect(completedHeader.classes()).toContain('is-completed');
    expect(completedHeader.classes()).not.toContain('is-expanded');
    expect(completedBody.attributes('style')).toContain('display: none;');

    await completedToggle.trigger('click');
    expect(completedToggle.attributes('aria-expanded')).toBe('false');
    expect(completedBody.attributes('style')).toContain('display: none;');

    await completedCheckbox.trigger('click');
    const unfinishedToggle = wrapper.get('[data-testid="n5-grammar-toggle-polite-overview"]');
    const unfinishedCheckbox = wrapper.get('[data-testid="n5-grammar-completion-polite-overview"]');
    const unfinishedBody = wrapper.get('[data-testid="n5-grammar-body-polite-overview"]');

    expect((unfinishedCheckbox.element as HTMLInputElement).checked).toBe(false);
    expect(unfinishedToggle.attributes('aria-disabled')).toBeUndefined();
    expect(unfinishedToggle.attributes('aria-expanded')).toBe('false');
    expect(unfinishedBody.attributes('style')).toContain('display: none;');
  });
});
