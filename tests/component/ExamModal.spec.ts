import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import ExamModal from '@/modules/exam/components/ExamModal.vue';

describe('ExamModal', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    document.body.style.overflow = '';
  });

  it('renders by default, locks body scroll, and emits confirmClose after confirmation', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

    const wrapper = mount(ExamModal, {
      props: {
        open: true,
        question: {
          id: 'q1',
          kanaId: 'tableA-ka',
          script: 'hiragana',
          promptText: 'か',
          answerText: 'ka (か / カ)',
          hintText: '請先自行作答，再決定是否按下我不清楚',
          answerRevealed: false,
          unknownMarked: false,
          hiragana: 'か',
          katakana: 'カ',
          romaji: 'ka'
        },
        currentIndex: 0,
        totalQuestions: 3
      },
      global: {
        stubs: {
          teleport: true
        }
      }
    });

    const actionButtons = wrapper.findAll('[data-testid="exam-actions"] button');
    const prompt = wrapper.get('[data-testid="exam-prompt"]');

    expect(document.body.style.overflow).toBe('hidden');
    expect(prompt.text()).toBe('か');
    expect(prompt.classes()).toContain('exam-modal-prompt');
    expect(actionButtons).toHaveLength(2);
    expect(actionButtons[0]?.text()).toContain('我不清楚');
    expect(actionButtons[1]?.text()).toContain('下一步');

    await wrapper.find('button[aria-label="關閉練習"]').trigger('click');

    expect(confirmSpy).toHaveBeenCalledOnce();
    expect(wrapper.emitted('confirmClose')).toHaveLength(1);

    wrapper.unmount();
    expect(document.body.style.overflow).toBe('');
  });
});
