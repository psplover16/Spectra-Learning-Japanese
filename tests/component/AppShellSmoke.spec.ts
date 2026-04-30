import { beforeEach, describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import AppShell from '@/app/AppShell.vue';
import router from '@/app/router';

describe('AppShell', () => {
  beforeEach(async () => {
    await router.push('/practice');
    await router.isReady();
  });

  it('可在四個主要路由之間切換，且頁首只顯示主路由按鈕', async () => {
    const wrapper = mount(AppShell, {
      global: {
        plugins: [router]
      }
    });

    const header = wrapper.get('[data-testid="app-header"]');
    expect(header.find('h1').exists()).toBe(false);
    expect(wrapper.findAll('[data-testid^="route-tab-"]')).toHaveLength(4);
    expect(wrapper.get('[data-testid="route-tab-practice"]').text()).toBe('字母練習');
    expect(wrapper.get('[data-testid="route-tab-grammar"]').text()).toBe('變化規則');
    expect(wrapper.get('[data-testid="route-tab-vocabulary"]').text()).toBe('單字練習');
    expect(wrapper.get('[data-testid="route-tab-n5-grammar"]').text()).toBe('N5文法');
    expect(wrapper.text()).toContain('清音');

    await router.push('/grammar');
    await nextTick();
    expect(wrapper.text()).toContain('語法系統差異');

    await router.push('/vocabulary');
    await nextTick();
    expect(wrapper.find('[data-testid="vocabulary-control-bar"]').exists()).toBe(true);

    await router.push('/n5-grammar');
    await nextTick();
    expect(wrapper.find('[data-testid="n5-grammar-view"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('核心詞類用法總覽');
    expect(wrapper.text()).toContain('敬體變化速覽');
    expect(wrapper.text()).toContain('敬體句型：現在型與詞類基礎');
    expect(wrapper.text()).toContain('敬體句型：過去、狀態與補充表現');
    expect(wrapper.text()).toContain('できる：能力、可能與完成');
    expect(wrapper.text()).not.toContain('句型與詞類敬體基礎');
    expect(wrapper.text()).toContain('助詞 へ：移動的方向');
    expect(wrapper.text()).not.toContain('製作中');
  }, 15000);
});
