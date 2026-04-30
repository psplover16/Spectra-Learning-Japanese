import { afterEach, describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import RouteSubMenu from '@/shared/components/RouteSubMenu.vue';

const options = [
  { value: 'N1', label: 'N1文法', route: '/n1-grammar', testId: 'route-sub-menu-option-n1-grammar' },
  { value: 'N2', label: 'N2文法', route: '/n2-grammar', testId: 'route-sub-menu-option-n2-grammar' },
  { value: 'N3', label: 'N3文法', route: '/n3-grammar', testId: 'route-sub-menu-option-n3-grammar' },
  { value: 'N4', label: 'N4文法', route: '/n4-grammar', testId: 'route-sub-menu-option-n4-grammar' },
  { value: 'N5', label: 'N5文法', route: '/n5-grammar', testId: 'route-sub-menu-option-n5-grammar' }
];

const mainCss = readFileSync(resolve(process.cwd(), 'src/styles/main.css'), 'utf8');

describe('RouteSubMenu', () => {
  afterEach(() => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    document.body.innerHTML = '';
  });

  it('依 options 渲染按鈕並在點選時只 emit value', async () => {
    const wrapper = mount(RouteSubMenu, {
      attachTo: document.body,
      props: {
        isOpen: true,
        options,
        selectedValue: 'N5',
        menuTestId: 'route-sub-menu',
        overlayTestId: 'route-sub-menu-overlay'
      }
    });

    const buttons = wrapper.findAll('[data-testid^="route-sub-menu-option-"]');
    expect(buttons).toHaveLength(5);
    expect(buttons.map((button) => button.text())).toEqual(['N1文法', 'N2文法', 'N3文法', 'N4文法', 'N5文法']);
    expect(buttons.every((button) => button.classes().includes('route-tab-link'))).toBe(true);

    await wrapper.get('[data-testid="route-sub-menu-option-n1-grammar"]').trigger('click');

    expect(wrapper.emitted('select')).toEqual([['N1']]);
  });

  it('提供浮動定位與外觀 class 合約', () => {
    const wrapper = mount(RouteSubMenu, {
      props: {
        isOpen: true,
        options,
        selectedValue: 'N5',
        menuTestId: 'route-sub-menu',
        overlayTestId: 'route-sub-menu-overlay'
      }
    });

    expect(wrapper.get('[data-testid="route-sub-menu"]').classes()).toEqual(expect.arrayContaining(['route-sub-menu']));
    expect(document.querySelector('[data-testid="route-sub-menu-overlay"]')?.classList.contains('route-sub-menu-overlay')).toBe(true);
    expect(mainCss).toContain('@apply absolute left-1/2 z-40 flex -translate-x-1/2 flex-col gap-[4px]');
    expect(mainCss).toContain('p-[2px]');
    expect(mainCss).toContain('top: calc(100% + 4px);');
  });

  it('點擊 overlay 或按 Escape 會要求關閉', async () => {
    const wrapper = mount(RouteSubMenu, {
      attachTo: document.body,
      props: {
        isOpen: true,
        options,
        selectedValue: 'N5',
        menuTestId: 'route-sub-menu',
        overlayTestId: 'route-sub-menu-overlay'
      }
    });

    document.querySelector<HTMLElement>('[data-testid="route-sub-menu-overlay"]')?.click();
    await nextTick();
    expect(wrapper.emitted('close')).toHaveLength(1);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await nextTick();
    expect(wrapper.emitted('close')).toHaveLength(2);
  });
});
