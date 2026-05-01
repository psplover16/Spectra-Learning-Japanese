import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import AppVersionLabel from '@/shared/components/AppVersionLabel.vue';

vi.mock('@/shared/version/appVersion', () => ({
  appVersion: '0.0.1'
}));

describe('AppVersionLabel', () => {
  it('渲染目前應用版本且不包含更新檢查互動', () => {
    const wrapper = mount(AppVersionLabel);

    expect(wrapper.get('[data-testid="app-version-label"]').text()).toBe('0.0.1');
    expect(wrapper.find('button').exists()).toBe(false);
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false);
  });
});
