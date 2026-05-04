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
    expect(prompt.classes()).toContain('exam-modal-prompt-lg');
    expect(wrapper.find('[data-testid="exam-hint"]').exists()).toBe(true);
    expect(actionButtons).toHaveLength(2);
    expect(actionButtons[0]?.text()).toContain('我不清楚');
    expect(actionButtons[1]?.text()).toContain('下一步');

    await wrapper.find('button[aria-label="關閉練習"]').trigger('click');

    expect(confirmSpy).toHaveBeenCalledOnce();
    expect(wrapper.emitted('confirmClose')).toHaveLength(1);

    wrapper.unmount();
    expect(document.body.style.overflow).toBe('');
  });

  it('supports compact vocabulary presentation without changing the shared shell', () => {
    const wrapper = mount(ExamModal, {
      props: {
        open: true,
        question: {
          id: 'vocabulary-1',
          markKey: 'あげる|上げる',
          promptText: 'あげる／上げる',
          answerText: '提高（一段動詞；他動詞）\n給（一段動詞）\n舉起（一段動詞）',
          answerRevealed: true,
          unknownMarked: false,
          completed: false,
          result: null
        },
        currentIndex: 0,
        totalQuestions: 1,
        promptSize: 'md',
        showHint: false,
        answerMultiline: true,
        manageBodyScroll: false
      },
      global: {
        stubs: {
          teleport: true
        }
      }
    });

    expect(document.body.style.overflow).toBe('');
    expect(wrapper.get('[data-testid="exam-prompt"]').classes()).toContain('exam-modal-prompt-md');
    expect(wrapper.find('[data-testid="exam-hint"]').exists()).toBe(false);
    expect(wrapper.get('[data-testid="exam-answer"]').classes()).toContain('exam-modal-answer-multiline');
    expect(wrapper.get('[data-testid="exam-answer"]').text()).toContain('舉起（一段動詞）');
  });
});
