<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import BaseButton from '@/shared/components/BaseButton.vue';
import type { ExamModalQuestionCard } from '@/modules/exam/types/exam';
import { lockBodyScroll, unlockBodyScroll } from '@/shared/utils/bodyScrollLock';

const props = withDefaults(defineProps<{
  open: boolean;
  question: ExamModalQuestionCard | null;
  currentIndex: number;
  totalQuestions: number;
  promptSize?: 'lg' | 'md';
  showHint?: boolean;
  answerMultiline?: boolean;
  manageBodyScroll?: boolean;
}>(), {
  promptSize: 'lg',
  showHint: true,
  answerMultiline: false,
  manageBodyScroll: true
});

const emit = defineEmits<{ next: []; unknown: []; confirmClose: [] }>();

const promptClasses = computed(() => [
  'exam-modal-prompt',
  `exam-modal-prompt-${props.promptSize}`
]);

const answerClasses = computed(() => [
  'exam-modal-answer',
  { 'exam-modal-answer-multiline': props.answerMultiline }
]);

const hintText = computed(() =>
  props.question?.answerRevealed
    ? '已顯示答案，請決定是否標記為我不清楚'
    : '請先自行作答，再決定是否按下我不清楚'
);

function requestClose(): void {
  if (window.confirm('確定要結束練習嗎？')) {
    emit('confirmClose');
  }
}

watch(
  () => props.open,
  (isOpen) => {
    if (!props.manageBodyScroll) {
      return;
    }

    if (isOpen) {
      lockBodyScroll();
      return;
    }

    unlockBodyScroll();
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  if (props.open && props.manageBodyScroll) {
    unlockBodyScroll();
  }
});
</script>

<template>
  <Teleport to="body">
    <div
      v-if="props.open"
      class="fixed inset-0 z-[100] flex h-dvh w-screen items-center justify-center bg-ink/45 px-3 py-4"
    >
      <section
        data-testid="exam-modal"
        class="exam-modal-card surface-card"
        aria-modal="true"
        role="dialog"
      >
        <div class="flex h-[48px] items-center justify-between border-b border-clay/10 px-4">
          <p class="text-sm font-semibold text-ink">
            {{ props.totalQuestions === 0 ? 0 : props.currentIndex + 1 }} / {{ props.totalQuestions }}
          </p>
          <button
            type="button"
            class="text-lg text-ink/70 hover:text-ink"
            aria-label="關閉練習"
            @click="requestClose"
          >
            <FontAwesomeIcon :icon="faXmark" />
          </button>
        </div>

        <div class="flex-1 border-b border-clay/10 px-4 py-3 sm:px-5 sm:py-4">
          <div class="exam-modal-body">
            <p data-testid="exam-prompt" :class="promptClasses">{{ props.question?.promptText ?? '-' }}</p>
            <p data-testid="exam-answer" :class="answerClasses">
              {{ props.question?.answerRevealed ? props.question.answerText : '' }}
            </p>
            <p v-if="props.showHint" data-testid="exam-hint" class="text-sm text-ink/65">
              {{ hintText }}
            </p>
          </div>
        </div>

        <div data-testid="exam-actions" class="flex h-[56px] items-center justify-between px-4">
          <BaseButton data-testid="exam-unknown-button" variant="danger" @click="emit('unknown')">
            我不清楚
          </BaseButton>
          <BaseButton data-testid="exam-next-button" variant="ghost" @click="emit('next')">
            下一步
          </BaseButton>
        </div>
      </section>
    </div>
  </Teleport>
</template>
