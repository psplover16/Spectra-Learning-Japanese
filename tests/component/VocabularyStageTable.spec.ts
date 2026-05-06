import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import VocabularyStageTable from '@/modules/vocabulary/components/VocabularyStageTable.vue';
import type { VocabularyEntry } from '@/modules/vocabulary/types/vocabulary';

const entries: VocabularyEntry[] = [
  {
    id: 1,
    markKey: 'あさ|朝',
    text: 'あさ',
    romanization: 'a-sa',
    kanji: '朝',
    meaning: '早上',
    stage: 'N5',
    textKanaUnits: ['あ', 'さ'],
    hasKanji: true
  },
  {
    id: 2,
    markKey: 'あい|',
    text: 'あい',
    romanization: 'a-i',
    kanji: '',
    meaning: '愛',
    stage: 'N5',
    textKanaUnits: ['あ', 'い'],
    hasKanji: false
  },
  {
    id: 3,
    markKey: 'あサ|',
    text: 'あサ',
    romanization: 'a-sa',
    kanji: '',
    meaning: '混合假名',
    stage: 'N5',
    textKanaUnits: ['あ', 'サ'],
    hasKanji: false
  }
];

type StageTableProps = Partial<InstanceType<typeof VocabularyStageTable>['$props']> & {
  allVisibleDraftMarked?: boolean;
};

function mountTable(props: StageTableProps = {}) {
  return mount(VocabularyStageTable, {
    props: {
      entries,
      showKanji: true,
      wordPracticeVisible: false,
      columnVisibility: { word: true, combined: false, meaning: false, preserveLayoutWhenHidden: true },
      savedMarkedKeys: new Set<string>(),
      draftMarkedKeys: new Set<string>(),
      allVisibleDraftMarked: false,
      revealedEntryId: null,
      ...props
    }
  });
}

describe('VocabularyStageTable', () => {
  it('標頭 checkbox 會發出欄位顯示事件，且隱藏內容仍保留欄位', async () => {
    const wrapper = mountTable({
      columnVisibility: { word: false, combined: false, meaning: false, preserveLayoutWhenHidden: true }
    });

    const checkboxes = wrapper.findAll('thead input[type="checkbox"]');
    await checkboxes[0]!.setValue(true);
    expect(wrapper.emitted('update:wordColumnVisible')?.[0]).toEqual([true]);

    await checkboxes[2]!.setValue(true);
    expect(wrapper.emitted('update:combinedColumnVisible')?.[0]).toEqual([true]);

    expect(wrapper.find('tbody td .vocabulary-hidden-content').exists()).toBe(true);
    expect(wrapper.findAll('tbody td')).toHaveLength(12);
  });

  it('單字表頭同時提供單字與練習 checkbox，並使用指定間距 class', async () => {
    const wrapper = mountTable();
    const wordHeader = wrapper.get('[data-testid="vocabulary-word-header-controls"]');
    const wordCheckbox = wrapper.get('[data-testid="vocabulary-word-column-checkbox"]');
    const practiceCheckbox = wrapper.get('[data-testid="vocabulary-word-practice-checkbox"]');

    expect(wordHeader.classes()).toContain('vocabulary-word-header-controls');
    expect(wordHeader.classes()).toContain('gap-[0.5rem]');
    expect((wordCheckbox.element as HTMLInputElement).checked).toBe(true);
    expect((practiceCheckbox.element as HTMLInputElement).checked).toBe(false);

    await practiceCheckbox.setValue(true);
    expect(wrapper.emitted('update:wordPracticeVisible')?.[0]).toEqual([true]);
  });

  it('載入中且尚無資料列時顯示穩定 loading row', () => {
    const wrapper = mountTable({
      entries: [],
      isLoading: true
    });

    expect(wrapper.get('[data-testid="vocabulary-loading-row"]').text()).toContain('單字資料載入中');
    expect(wrapper.findAll('tbody tr[data-testid^="vocabulary-row-"]')).toHaveLength(0);
  });

  it('單字欄位顯示原假名、假名互換與空白狀態', async () => {
    const wrapper = mountTable({
      wordPracticeVisible: true
    });

    expect(wrapper.get('[data-testid="vocabulary-word-content-1"]').text()).toBe('あさ');
    expect(wrapper.get('[data-testid="vocabulary-word-content-3"]').text()).toBe('あサ');

    await wrapper.setProps({
      columnVisibility: { word: false, combined: false, meaning: false, preserveLayoutWhenHidden: true },
      wordPracticeVisible: true
    });

    expect(wrapper.get('[data-testid="vocabulary-word-content-1"]').text()).toBe('アサ');
    expect(wrapper.get('[data-testid="vocabulary-word-content-3"]').text()).toBe('アさ');

    await wrapper.setProps({
      columnVisibility: { word: false, combined: false, meaning: false, preserveLayoutWhenHidden: true },
      wordPracticeVisible: false
    });

    expect(wrapper.get('[data-testid="vocabulary-word-content-1"]').text()).toBe('');
    expect(wrapper.get('[data-testid="vocabulary-word-content-3"]').text()).toBe('');
  });

  it('列內註記 checkbox、row click 與 header 批次註記 checkbox 會發出 draft mark 事件', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => undefined);
    const wrapper = mountTable({
      savedMarkedKeys: new Set(['あさ|朝']),
      draftMarkedKeys: new Set(['あさ|朝'])
    });

    await wrapper.get('[data-testid="vocabulary-mark-checkbox-1"]').setValue(false);
    expect(wrapper.emitted('toggle-marked')?.[0]).toEqual(['あさ|朝', false]);

    await wrapper.get('[data-testid="vocabulary-row-1"]').trigger('click');
    expect(wrapper.emitted('toggle-marked')?.[1]).toEqual(['あさ|朝', false]);

    expect(wrapper.find('[data-testid="vocabulary-clear-marks-checkbox"]').exists()).toBe(false);

    const bulkMarkCheckbox = wrapper.get('[data-testid="vocabulary-bulk-mark-checkbox"]');

    expect(bulkMarkCheckbox.attributes('title')).toBe('勾選或取消勾選目前顯示單字');
    expect((bulkMarkCheckbox.element as HTMLInputElement).checked).toBe(false);

    await bulkMarkCheckbox.setValue(true);
    expect(wrapper.emitted('bulk-toggle-marked')?.[0]).toEqual([true]);
    expect(alertSpy).not.toHaveBeenCalled();
  });

  it('header 批次註記 checkbox 會反映全部可見 draft marks，任一列取消後會同步取消 checked', async () => {
    const wrapper = mountTable({
      draftMarkedKeys: new Set(['あさ|朝', 'あい|']),
      allVisibleDraftMarked: true
    });
    const bulkMarkCheckbox = wrapper.get('[data-testid="vocabulary-bulk-mark-checkbox"]');

    expect((bulkMarkCheckbox.element as HTMLInputElement).checked).toBe(true);

    await wrapper.get('[data-testid="vocabulary-mark-checkbox-2"]').setValue(false);
    expect(wrapper.emitted('toggle-marked')?.[0]).toEqual(['あい|', false]);

    await wrapper.setProps({
      draftMarkedKeys: new Set(['あさ|朝']),
      allVisibleDraftMarked: false
    });

    expect((wrapper.get('[data-testid="vocabulary-bulk-mark-checkbox"]').element as HTMLInputElement).checked).toBe(false);
  });

  it('資料列內容會發出長按揭露相關 pointer 事件', async () => {
    const wrapper = mountTable();

    await wrapper.get('[data-testid="vocabulary-row-1"]').trigger('pointerdown');
    expect(wrapper.emitted('begin-reveal')?.[0]).toEqual([1]);

    await wrapper.get('[data-testid="vocabulary-row-1"]').trigger('pointerup');
    expect(wrapper.emitted('end-reveal')?.[0]).toEqual([1]);
  });

  it('資料列會攔截 contextmenu，避免跳出右鍵選單', () => {
    const wrapper = mountTable();

    const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
    const dispatchResult = wrapper.get('[data-testid="vocabulary-row-1"]').element.dispatchEvent(event);

    expect(dispatchResult).toBe(false);
    expect(event.defaultPrevented).toBe(true);
  });
});
