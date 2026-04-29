<script setup lang="ts">
import BaseButton from '@/shared/components/BaseButton.vue';
import BaseCheckbox from '@/shared/components/BaseCheckbox.vue';
import BaseInput from '@/shared/components/BaseInput.vue';
import { usePracticeSession } from '@/modules/practice/composables/usePracticeSession';

defineProps<{ hasLatestResult: boolean }>();

const emit = defineEmits<{ startExam: []; clearLatestResult: [] }>();
const session = usePracticeSession();

const includeHiragana = session.includeHiragana;
const includeKatakana = session.includeKatakana;
const enableSokuon = session.enableSokuon;
const enableYoonChoon = session.enableYoonChoon;
const showArchaicKana = session.showArchaicKana;
const questionCountInput = session.questionCountInput;
const allKanaSelected = session.allKanaSelected;
const dakuonSelected = session.dakuonSelected;
const canStartExam = session.canStartExam;
const selectedKanaCount = session.selectedKanaCount;
const recommendedQuestionCount = session.recommendedQuestionCount;
</script>

<template>
  <section data-testid="practice-toolbar" class="section-card space-y-3">
    <div class="flex flex-wrap gap-3">
      <BaseCheckbox v-model="includeHiragana" label="題目包含：平假名" />
      <BaseCheckbox v-model="includeKatakana" label="題目包含：片假名" />
      <BaseCheckbox
        data-testid="toggle-all-kana"
        :model-value="allKanaSelected"
        label="全選／全不選"
        @update:model-value="session.toggleAllKana"
      />
      <BaseCheckbox :model-value="dakuonSelected" label="濁音／半濁音" @update:model-value="session.toggleDakuon" />
    </div>

    <div class="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
      <BaseInput
        data-testid="question-count-input"
        label="題數"
        :model-value="questionCountInput"
        @update:model-value="session.setQuestionCount"
      />
      <p class="flex items-center text-xs text-ink/70">
        目前勾選 {{ selectedKanaCount }} 個假名，依範圍建議 {{ recommendedQuestionCount }} 題。
      </p>
    </div>

    <div class="flex flex-wrap gap-3">
      <BaseCheckbox v-model="enableSokuon" label="促音" />
      <BaseCheckbox v-model="enableYoonChoon" label="拗音／合拗音／長音符" />
    </div>

    <div>
      <BaseCheckbox v-model="showArchaicKana" label="古語假名" />
    </div>

    <div class="flex items-center justify-between gap-2">
      <div class="flex flex-wrap gap-2">
        <BaseButton data-testid="start-exam-button" variant="primary" :disabled="!canStartExam" @click="emit('startExam')">
          送出
        </BaseButton>
        <BaseButton variant="secondary" @click="session.resetAll">重置</BaseButton>
      </div>

      <BaseButton data-testid="toolbar-clear-result-button" variant="ghost" :disabled="!hasLatestResult" @click="emit('clearLatestResult')">
        清除結果
      </BaseButton>
    </div>
  </section>
</template>
