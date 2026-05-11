import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import N5GrammarSectionCard from '@/modules/n5Grammar/components/N5GrammarSectionCard.vue';
import type { N5GrammarSection } from '@/modules/n5Grammar/types/grammarNotes';

const baseSection: N5GrammarSection = {
  id: 'particles-wa',
  title: '主題助詞 は',
  description: '用於標示句子主題',
  presentationMode: 'info-stack',
  order: 1,
  category: 'particles',
  topics: [],
  sharedNotes: []
};

function renderCard(overrides: Partial<{ bookmarked: boolean; showBookmark: boolean; completed: boolean }> = {}) {
  return mount(N5GrammarSectionCard, {
    props: {
      section: baseSection,
      completed: overrides.completed ?? false,
      bookmarked: overrides.bookmarked ?? false,
      showBookmark: overrides.showBookmark ?? true
    }
  });
}

describe('N5GrammarSectionCard bookmark behavior', () => {
  describe('Bookmark button appears on each grammar section header', () => {
    it('renders the bookmark button on the header by default', () => {
      const wrapper = renderCard();

      const button = wrapper.find('[data-testid="n5-grammar-bookmark-hit-area-particles-wa"]');
      expect(button.exists()).toBe(true);
      expect(button.element.tagName).toBe('BUTTON');
    });

    it('keeps the existing checkbox at the right edge unchanged', () => {
      const wrapper = renderCard();

      const checkbox = wrapper.find('[data-testid="n5-grammar-completion-particles-wa"]');
      expect(checkbox.exists()).toBe(true);
      expect((checkbox.element as HTMLInputElement).type).toBe('checkbox');
    });
  });

  describe('Bookmark button has two visual states', () => {
    it('renders the outline state when bookmarked is false', () => {
      const wrapper = renderCard({ bookmarked: false });

      const button = wrapper.find('[data-testid="n5-grammar-bookmark-hit-area-particles-wa"]');
      expect(button.attributes('aria-pressed')).toBe('false');
      expect(button.classes()).not.toContain('is-bookmarked');
      expect(button.find('[data-testid="n5-grammar-bookmark-outline-particles-wa"]').exists()).toBe(true);
      expect(button.find('[data-testid="n5-grammar-bookmark-solid-particles-wa"]').exists()).toBe(false);
    });

    it('renders the solid state when bookmarked is true', () => {
      const wrapper = renderCard({ bookmarked: true });

      const button = wrapper.find('[data-testid="n5-grammar-bookmark-hit-area-particles-wa"]');
      expect(button.attributes('aria-pressed')).toBe('true');
      expect(button.classes()).toContain('is-bookmarked');
      expect(button.find('[data-testid="n5-grammar-bookmark-solid-particles-wa"]').exists()).toBe(true);
      expect(button.find('[data-testid="n5-grammar-bookmark-outline-particles-wa"]').exists()).toBe(false);
    });

    it('emits update:bookmarked with the toggled value on click', async () => {
      const wrapper = renderCard({ bookmarked: false });

      const button = wrapper.find('[data-testid="n5-grammar-bookmark-hit-area-particles-wa"]');
      await button.trigger('click');

      const emitted = wrapper.emitted('update:bookmarked');
      expect(emitted).toBeTruthy();
      expect(emitted?.[0]).toEqual([true]);
    });

    it('emits update:bookmarked with false when clicked while solid', async () => {
      const wrapper = renderCard({ bookmarked: true });

      const button = wrapper.find('[data-testid="n5-grammar-bookmark-hit-area-particles-wa"]');
      await button.trigger('click');

      const emitted = wrapper.emitted('update:bookmarked');
      expect(emitted).toBeTruthy();
      expect(emitted?.[0]).toEqual([false]);
    });

    it('does not toggle the expansion when the bookmark button is clicked', async () => {
      const wrapper = renderCard({ bookmarked: false });

      const button = wrapper.find('[data-testid="n5-grammar-bookmark-hit-area-particles-wa"]');
      await button.trigger('click');

      expect(wrapper.emitted('update:bookmarked')).toBeTruthy();
      const toggleButton = wrapper.find('[data-testid="n5-grammar-toggle-particles-wa"]');
      expect(toggleButton.attributes('aria-expanded')).toBe('false');
    });
  });

  describe('Sections in the finished zone do not render the bookmark button', () => {
    it('omits the bookmark button when showBookmark is false', () => {
      const wrapper = renderCard({ showBookmark: false, completed: true });

      const button = wrapper.find('[data-testid="n5-grammar-bookmark-hit-area-particles-wa"]');
      expect(button.exists()).toBe(false);
    });

    it('preserves the existing checkbox when bookmark is hidden', () => {
      const wrapper = renderCard({ showBookmark: false, completed: true });

      const checkbox = wrapper.find('[data-testid="n5-grammar-completion-particles-wa"]');
      expect(checkbox.exists()).toBe(true);
    });
  });
});
