<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue';
import ExamModal from '@/modules/exam/components/ExamModal.vue';
import VocabularyControlBar from '@/modules/vocabulary/components/VocabularyControlBar.vue';
import VocabularyStageTable from '@/modules/vocabulary/components/VocabularyStageTable.vue';
import { useVocabularyExamSession } from '@/modules/vocabulary/composables/useVocabularyExamSession';
import { useVocabularySession } from '@/modules/vocabulary/composables/useVocabularySession';
import { lockBodyScroll, unlockBodyScroll } from '@/shared/utils/bodyScrollLock';

const session = useVocabularySession();
const vocabularyExamSession = useVocabularyExamSession(session.draftMarkedKeys);

const hasVisibleMarkedEntries = computed(() =>
  session.visibleEntries.value.some((entry) =>
    session.draftMarkedKeys.value.has(entry.markKey) || session.persistedMarkedKeys.value.has(entry.markKey)
  )
);

const canStartVocabularyQuiz = computed(() =>
  hasVisibleMarkedEntries.value && !session.isLoadingVocabulary.value && !session.hasVocabularyLoadError.value
);

function startVocabularyQuiz(): void {
  if (!canStartVocabularyQuiz.value) {
    return;
  }

  vocabularyExamSession.start({
    visibleEntries: session.visibleEntries.value,
    persistedMarkedKeys: session.persistedMarkedKeys.value
  });
}

onMounted(() => {
  lockBodyScroll();
});

onBeforeUnmount(() => {
  unlockBodyScroll();
});
</script>

<template>
  <div class="vocabulary-view py-1">
    <VocabularyControlBar
      v-model:search-text="session.searchText.value"
      v-model:show-all-sounds="session.showAllSounds.value"
      v-model:show-kanji="session.showKanji.value"
      v-model:show-marked-only="session.showMarkedOnly.value"
      v-model:practice-mode="session.practiceMode.value"
      v-model:selected-jlpt-levels="session.selectedJlptLevels.value"
      :can-save-marks="session.hasAnyVisibleEntries.value"
      :can-start-quiz="canStartVocabularyQuiz"
      @save-marks="session.saveMarks"
      @start-quiz="startVocabularyQuiz"
    />

    <VocabularyStageTable
      :entries="session.visibleEntries.value"
      :show-kanji="session.showKanji.value"
      :practice-mode="session.practiceMode.value"
      :column-visibility="session.columnVisibility.value"
      :saved-marked-keys="session.persistedMarkedKeys.value"
      :draft-marked-keys="session.draftMarkedKeys.value"
      :revealed-entry-id="session.revealedEntryId.value"
      @update:word-column-visible="session.wordColumnVisible.value = $event"
      @update:combined-column-visible="session.combinedColumnVisible.value = $event"
      @update:meaning-column-visible="session.meaningColumnVisible.value = $event"
      @toggle-marked="session.toggleMarked"
      @clear-marks="session.clearAllMarksWithConfirmation"
      @begin-reveal="session.beginReveal"
      @end-reveal="session.endReveal"
    />

    <ExamModal
      :open="vocabularyExamSession.isOpen.value"
      :question="vocabularyExamSession.currentQuestion.value"
      :current-index="vocabularyExamSession.currentIndex.value"
      :total-questions="vocabularyExamSession.totalQuestions.value"
      prompt-size="md"
      :show-hint="false"
      :answer-multiline="true"
      :manage-body-scroll="false"
      @next="vocabularyExamSession.nextStep"
      @unknown="vocabularyExamSession.markUnknown"
      @confirm-close="vocabularyExamSession.confirmClose"
    />
  </div>
</template>
