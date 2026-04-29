import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import VocabularyControlBar from '@/modules/vocabulary/components/VocabularyControlBar.vue';

describe('VocabularyControlBar', () => {
  it('可輸入搜尋字詞並切換控制 checkbox', async () => {
    const wrapper = mount(VocabularyControlBar, {
      props: {
        searchText: '',
        showAllSounds: true,
        showKanji: true,
        showMarkedOnly: false,
        practiceMode: false
      }
    });

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
});
