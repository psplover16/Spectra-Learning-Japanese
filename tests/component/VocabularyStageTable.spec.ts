import { describe, expect, it } from 'vitest';
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
  }
];

describe('VocabularyStageTable', () => {
  it('標頭 checkbox 會發出欄位顯示事件，且隱藏內容仍保留欄位', async () => {
    const wrapper = mount(VocabularyStageTable, {
      props: {
        entries,
        showKanji: true,
        practiceMode: false,
        columnVisibility: { word: false, combined: false, meaning: false, preserveLayoutWhenHidden: true },
        savedMarkedKeys: new Set<string>(),
        draftMarkedKeys: new Set<string>(),
        revealedEntryId: null
      }
    });

    const checkboxes = wrapper.findAll('thead input[type="checkbox"]');
    await checkboxes[0]!.setValue(true);
    expect(wrapper.emitted('update:wordColumnVisible')?.[0]).toEqual([true]);

    await checkboxes[1]!.setValue(true);
    expect(wrapper.emitted('update:combinedColumnVisible')?.[0]).toEqual([true]);

    expect(wrapper.find('tbody td .vocabulary-hidden-content').exists()).toBe(true);
    expect(wrapper.findAll('tbody td')).toHaveLength(4);
  });

  it('列內註記 checkbox、row click 與清除目前顯示註記 checkbox 會發出事件', async () => {
    const wrapper = mount(VocabularyStageTable, {
      props: {
        entries,
        showKanji: true,
        practiceMode: false,
        columnVisibility: { word: true, combined: false, meaning: false, preserveLayoutWhenHidden: true },
        savedMarkedKeys: new Set(['あさ|朝']),
        draftMarkedKeys: new Set(['あさ|朝']),
        revealedEntryId: null
      }
    });

    await wrapper.get('[data-testid="vocabulary-mark-checkbox-1"]').setValue(false);
    expect(wrapper.emitted('toggle-marked')?.[0]).toEqual(['あさ|朝', false]);

    await wrapper.get('[data-testid="vocabulary-row-1"]').trigger('click');
    expect(wrapper.emitted('toggle-marked')?.[1]).toEqual(['あさ|朝', false]);

    const clearMarksCheckbox = wrapper.get('[data-testid="vocabulary-clear-marks-checkbox"]');

    expect(clearMarksCheckbox.attributes('title')).toBe('清除目前顯示單字的註記');

    await clearMarksCheckbox.setValue(true);
    expect(wrapper.emitted('clear-marks')).toHaveLength(1);
  });

  it('資料列內容會發出長按揭露相關 pointer 事件', async () => {
    const wrapper = mount(VocabularyStageTable, {
      props: {
        entries,
        showKanji: true,
        practiceMode: false,
        columnVisibility: { word: true, combined: false, meaning: false, preserveLayoutWhenHidden: true },
        savedMarkedKeys: new Set<string>(),
        draftMarkedKeys: new Set<string>(),
        revealedEntryId: null
      }
    });

    await wrapper.get('[data-testid="vocabulary-row-1"]').trigger('pointerdown');
    expect(wrapper.emitted('begin-reveal')?.[0]).toEqual([1]);

    await wrapper.get('[data-testid="vocabulary-row-1"]').trigger('pointerup');
    expect(wrapper.emitted('end-reveal')?.[0]).toEqual([1]);
  });

  it('資料列會攔截 contextmenu，避免跳出右鍵選單', () => {
    const wrapper = mount(VocabularyStageTable, {
      props: {
        entries,
        showKanji: true,
        practiceMode: false,
        columnVisibility: { word: true, combined: false, meaning: false, preserveLayoutWhenHidden: true },
        savedMarkedKeys: new Set<string>(),
        draftMarkedKeys: new Set<string>(),
        revealedEntryId: null
      }
    });

    const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
    const dispatchResult = wrapper.get('[data-testid="vocabulary-row-1"]').element.dispatchEvent(event);

    expect(dispatchResult).toBe(false);
    expect(event.defaultPrevented).toBe(true);
  });
});
