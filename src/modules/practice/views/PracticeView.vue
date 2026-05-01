<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import PracticeToolbar from '@/modules/practice/components/PracticeToolbar.vue';
import SeionTable from '@/modules/practice/components/SeionTable.vue';
import DakuonTable from '@/modules/practice/components/DakuonTable.vue';
import HatsuonSection from '@/modules/practice/components/HatsuonSection.vue';
import SokuonSection from '@/modules/practice/components/SokuonSection.vue';
import SeionYoonSection from '@/modules/practice/components/SeionYoonSection.vue';
import DakuonYoonSection from '@/modules/practice/components/DakuonYoonSection.vue';
import LoanwordSection from '@/modules/practice/components/LoanwordSection.vue';
import ChoonRuleSection from '@/modules/practice/components/ChoonRuleSection.vue';
import SpecialSyllableSection from '@/modules/practice/components/SpecialSyllableSection.vue';
import ExamModal from '@/modules/exam/components/ExamModal.vue';
import UnknownResultPanel from '@/modules/exam/components/UnknownResultPanel.vue';
import AppVersionLabel from '@/shared/components/AppVersionLabel.vue';
import { usePracticeSession } from '@/modules/practice/composables/usePracticeSession';
import { createExamSession } from '@/modules/exam/composables/useExamSession';

const session = usePracticeSession();
const examSession = createExamSession();
const resultPanelRef = ref<HTMLElement | null>(null);
let pendingScrollTimer: number | null = null;

function clearPendingScrollTimer(): void {
  if (pendingScrollTimer !== null) {
    window.clearTimeout(pendingScrollTimer);
    pendingScrollTimer = null;
  }
}

function scheduleScroll(callback: () => void): void {
  void nextTick(() => {
    clearPendingScrollTimer();

    pendingScrollTimer = window.setTimeout(() => {
      pendingScrollTimer = null;
      callback();
    }, 0);
  });
}

function scrollToResult(): void {
  if (!examSession.latestUnknownSnapshot.value?.results.length) {
    return;
  }

  scheduleScroll(() => {
    const resultPanel = resultPanelRef.value;

    if (!resultPanel) {
      return;
    }

    const targetTop = Math.max(resultPanel.getBoundingClientRect().top + window.scrollY - 8, 0);
    window.scrollTo({
      top: targetTop,
      behavior: 'smooth'
    });
  });
}

function scrollToTop(): void {
  scheduleScroll(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

function startExam(): void {
  if (session.effectiveQuestionCount.value < 1) {
    window.alert('值必須大於或等於1');
    return;
  }

  if (session.selectedKanaItems.value.length === 0) {
    window.alert('請至少勾選一個假名才能開始出題');
    return;
  }

  if (!session.includeHiragana.value && !session.includeKatakana.value) {
    window.alert('請至少選擇平假名或片假名其中一項才能開始出題');
    return;
  }

  examSession.start({
    selectedKanaItems: session.selectedKanaItems.value,
    questionCount: session.effectiveQuestionCount.value,
    includeHiragana: session.includeHiragana.value,
    includeKatakana: session.includeKatakana.value
  });
}

function clearLatestResult(source: 'toolbar' | 'result-panel' = 'toolbar'): void {
  if (!examSession.latestUnknownSnapshot.value) {
    return;
  }

  if (window.confirm('確定要清除所有「我不清楚的音節」紀錄嗎？')) {
    clearPendingScrollTimer();
    examSession.clearLatestResults();

    if (source === 'result-panel') {
      scrollToTop();
    }
  }
}

watch(
  () => examSession.latestUnknownSnapshot.value?.updatedAt,
  (value, previousValue) => {
    if (value && value !== previousValue) {
      scrollToResult();
    }
  },
  { flush: 'post' }
);

onMounted(() => {
  scrollToResult();
});

onBeforeUnmount(() => {
  clearPendingScrollTimer();
});
</script>

<template>
  <div class="practice-view space-y-1">
    <PracticeToolbar
      :has-latest-result="Boolean(examSession.latestUnknownSnapshot.value)"
      @start-exam="startExam"
      @clear-latest-result="clearLatestResult('toolbar')"
    />

    <div data-testid="practice-main-grid" class="practice-reference-grid grid gap-1 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.9fr)]">
      <div class="space-y-1">
        <SeionTable />
        <DakuonTable />
      </div>

      <div data-testid="practice-reference-sections" class="practice-static-stack space-y-1" v-once>
        <HatsuonSection />
        <SokuonSection />
        <SeionYoonSection />
        <DakuonYoonSection />
        <LoanwordSection />
        <ChoonRuleSection />
        <SpecialSyllableSection />
      </div>
    </div>

    <div ref="resultPanelRef">
      <UnknownResultPanel :snapshot="examSession.latestUnknownSnapshot.value" @clear="clearLatestResult('result-panel')" />
    </div>

    <div data-testid="practice-version-row" class="flex w-full justify-end">
      <AppVersionLabel class="block text-[1rem] text-black" />
    </div>

    <ExamModal
      :open="examSession.isOpen.value"
      :question="examSession.currentQuestion.value"
      :current-index="examSession.currentIndex.value"
      :total-questions="examSession.totalQuestions.value"
      @next="examSession.nextStep"
      @unknown="examSession.markUnknown"
      @confirm-close="examSession.confirmClose"
    />
  </div>
</template>
