import { beforeEach, describe, expect, it } from 'vitest';
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils';
import { nextTick } from 'vue';
import AppShell from '@/app/AppShell.vue';
import router from '@/app/router';
import { grammarLevelStorageKey } from '@/modules/grammar/storage/grammarLevelStorage';

async function waitForN5GrammarSections(wrapper: VueWrapper) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    await flushPromises();
    await nextTick();

    if (wrapper.find('[data-testid="n5-grammar-title-core-term-usage-overview"]').exists()) {
      return;
    }

    await new Promise((resolve) => window.setTimeout(resolve, 0));
  }

  throw new Error('N5 grammar sections did not load.');
}

describe('grammar level routes', () => {
  beforeEach(async () => {
    window.localStorage.removeItem(grammarLevelStorageKey);
    await router.push('/practice');
    await router.isReady();
  });

  it('N1 到 N4 文法路由會顯示準備中 placeholder，且 N5 保留既有內容', async () => {
    const wrapper = mount(AppShell, {
      global: {
        plugins: [router]
      }
    });

    for (const level of ['n1', 'n2', 'n3', 'n4']) {
      await router.push(`/${level}-grammar`);
      await nextTick();

      const placeholderView = wrapper.get(`[data-testid="${level}-grammar-placeholder-view"]`);

      expect(placeholderView.text()).toContain(`${level.toUpperCase()}文法內容準備中`);
      expect(placeholderView.classes()).not.toContain('py-1');
      expect(router.currentRoute.value.path).toBe(`/${level}-grammar`);
      expect(wrapper.find('[data-testid="n5-grammar-view"]').exists()).toBe(false);
    }

    await router.push('/n5-grammar');
    await nextTick();
    await waitForN5GrammarSections(wrapper);

    const n5GrammarView = wrapper.get('[data-testid="n5-grammar-view"]');

    expect(n5GrammarView.classes()).not.toContain('py-1');
    expect(wrapper.text()).toContain('核心詞類用法總覽');
    expect(wrapper.text()).not.toContain('N5文法內容準備中');
  });
});
