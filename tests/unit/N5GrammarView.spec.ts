import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { ref } from 'vue';
import N5GrammarView from '@/modules/n5Grammar/views/N5GrammarView.vue';
import type { N5GrammarSection } from '@/modules/n5Grammar/types/grammarNotes';
import { grammarBookmarkStorageKey, n5GrammarCompletionStorageKey } from '@/shared/config/storageKeys';
import {
  readGrammarBookmark,
  writeGrammarBookmark
} from '@/modules/grammar/storage/grammarBookmarkStorage';
import { writeCompletedN5GrammarSectionIds } from '@/modules/n5Grammar/storage/n5GrammarCompletionStorage';

const fakeSections: N5GrammarSection[] = [
  {
    id: 'particles-wa',
    title: '主題助詞 は',
    description: '',
    presentationMode: 'info-stack',
    order: 1,
    category: 'particles',
    topics: [],
    sharedNotes: []
  },
  {
    id: 'particles-ga',
    title: '主格助詞 が',
    description: '',
    presentationMode: 'info-stack',
    order: 2,
    category: 'particles',
    topics: [],
    sharedNotes: []
  }
];

vi.mock('@/modules/n5Grammar/composables/useN5GrammarSections', () => ({
  useN5GrammarSections: () => ({
    sections: ref(fakeSections),
    hasSections: ref(true),
    isLoading: ref(false),
    loadError: ref<string | null>(null),
    loadSections: vi.fn().mockResolvedValue(undefined)
  })
}));

describe('N5GrammarView bookmark integration', () => {
  beforeEach(() => {
    window.localStorage.removeItem(grammarBookmarkStorageKey);
    window.localStorage.removeItem(n5GrammarCompletionStorageKey);
  });

  afterEach(() => {
    window.localStorage.removeItem(grammarBookmarkStorageKey);
    window.localStorage.removeItem(n5GrammarCompletionStorageKey);
  });

  describe('Bookmark persists across sessions', () => {
    it('renders the solid bookmark on the persisted section on mount', async () => {
      writeGrammarBookmark('N5', 'particles-wa');

      const wrapper = mount(N5GrammarView);
      await flushPromises();

      expect(wrapper.find('[data-testid="n5-grammar-bookmark-solid-particles-wa"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="n5-grammar-bookmark-outline-particles-ga"]').exists()).toBe(true);
    });

    it('shows outline state for every section when no bookmark is stored', async () => {
      const wrapper = mount(N5GrammarView);
      await flushPromises();

      expect(wrapper.find('[data-testid="n5-grammar-bookmark-outline-particles-wa"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="n5-grammar-bookmark-outline-particles-ga"]').exists()).toBe(true);
      expect(wrapper.findAll('[data-testid^="n5-grammar-bookmark-solid-"]')).toHaveLength(0);
    });
  });

  describe('At most one bookmark per JLPT level', () => {
    it('writes a new bookmark to storage when an outline button is clicked', async () => {
      const wrapper = mount(N5GrammarView);
      await flushPromises();

      await wrapper.find('[data-testid="n5-grammar-bookmark-hit-area-particles-wa"]').trigger('click');
      await flushPromises();

      expect(readGrammarBookmark('N5')?.sectionId).toBe('particles-wa');
      expect(wrapper.find('[data-testid="n5-grammar-bookmark-solid-particles-wa"]').exists()).toBe(true);
    });

    it('replaces the previous bookmark when a different section is clicked', async () => {
      writeGrammarBookmark('N5', 'particles-wa');

      const wrapper = mount(N5GrammarView);
      await flushPromises();

      await wrapper.find('[data-testid="n5-grammar-bookmark-hit-area-particles-ga"]').trigger('click');
      await flushPromises();

      expect(readGrammarBookmark('N5')?.sectionId).toBe('particles-ga');
      expect(wrapper.find('[data-testid="n5-grammar-bookmark-solid-particles-ga"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="n5-grammar-bookmark-solid-particles-wa"]').exists()).toBe(false);
    });
  });

  describe('Solid bookmark can be cleared by clicking it again', () => {
    it('clears the bookmark and returns the button to outline state', async () => {
      writeGrammarBookmark('N5', 'particles-wa');

      const wrapper = mount(N5GrammarView);
      await flushPromises();

      await wrapper.find('[data-testid="n5-grammar-bookmark-hit-area-particles-wa"]').trigger('click');
      await flushPromises();

      expect(readGrammarBookmark('N5')).toBeNull();
      expect(wrapper.find('[data-testid="n5-grammar-bookmark-solid-particles-wa"]').exists()).toBe(false);
      expect(wrapper.find('[data-testid="n5-grammar-bookmark-outline-particles-wa"]').exists()).toBe(true);
    });
  });

  describe('Marking a bookmarked section as completed clears its bookmark', () => {
    it('removes the bookmark when the bookmarked section is marked completed', async () => {
      writeGrammarBookmark('N5', 'particles-wa');

      const wrapper = mount(N5GrammarView);
      await flushPromises();

      await wrapper.find('[data-testid="n5-grammar-completion-hit-area-particles-wa"]').trigger('click');
      await flushPromises();

      expect(readGrammarBookmark('N5')).toBeNull();
    });

    it('keeps the bookmark when an unrelated section is marked completed', async () => {
      writeGrammarBookmark('N5', 'particles-wa');

      const wrapper = mount(N5GrammarView);
      await flushPromises();

      await wrapper.find('[data-testid="n5-grammar-completion-hit-area-particles-ga"]').trigger('click');
      await flushPromises();

      expect(readGrammarBookmark('N5')?.sectionId).toBe('particles-wa');
    });
  });

  describe('Sections in the finished zone do not render the bookmark button', () => {
    it('hides the bookmark button for sections in the finished zone but keeps it for unfinished ones', async () => {
      writeCompletedN5GrammarSectionIds(['particles-wa']);

      const wrapper = mount(N5GrammarView);
      await flushPromises();

      expect(wrapper.find('[data-testid="n5-grammar-bookmark-hit-area-particles-wa"]').exists()).toBe(false);
      expect(wrapper.find('[data-testid="n5-grammar-bookmark-hit-area-particles-ga"]').exists()).toBe(true);
    });
  });
});
