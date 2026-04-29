<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';
import BaseButton from '@/shared/components/BaseButton.vue';
import VocabularyControlBar from '@/modules/vocabulary/components/VocabularyControlBar.vue';
import VocabularyCountSummary from '@/modules/vocabulary/components/VocabularyCountSummary.vue';
import VocabularyStageTable from '@/modules/vocabulary/components/VocabularyStageTable.vue';
import { useVocabularySession } from '@/modules/vocabulary/composables/useVocabularySession';
import { lockBodyScroll, unlockBodyScroll } from '@/shared/utils/bodyScrollLock';

const session = useVocabularySession();

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
    />

    <section class="vocabulary-toolbar" data-testid="vocabulary-toolbar">
      <VocabularyCountSummary :count="session.visibleEntryCount.value" />
      <BaseButton
        data-testid="vocabulary-save-marks-button"
        variant="secondary"
        :class="{ invisible: !session.hasAnyVisibleEntries.value }"
        @click="session.saveMarks"
      >
        儲存註記
      </BaseButton>
    </section>

    <VocabularyStageTable
      :entries="session.visibleEntries.value"
      :show-kanji="session.showKanji.value"
      :practice-mode="session.practiceMode.value"
      :column-visibility="session.columnVisibility.value"
      :saved-marked-ids="session.persistedMarkedIds.value"
      :draft-marked-ids="session.draftMarkedIds.value"
      :revealed-entry-id="session.revealedEntryId.value"
      @update:word-column-visible="session.wordColumnVisible.value = $event"
      @update:combined-column-visible="session.combinedColumnVisible.value = $event"
      @update:meaning-column-visible="session.meaningColumnVisible.value = $event"
      @toggle-marked="session.toggleMarked"
      @clear-marks="session.clearAllMarksWithConfirmation"
      @begin-reveal="session.beginReveal"
      @end-reveal="session.endReveal"
    />
  </div>
</template>
