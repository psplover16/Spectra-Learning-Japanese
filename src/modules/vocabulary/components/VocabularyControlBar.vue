<script setup lang="ts">
import { computed } from 'vue';
import BaseButton from '@/shared/components/BaseButton.vue';
import BaseCheckbox from '@/shared/components/BaseCheckbox.vue';
import {
  vocabularyJlptLevels,
  type VocabularyJlptLevel
} from '@/modules/vocabulary/types/vocabulary';

const props = withDefaults(defineProps<{
  searchText: string;
  showAllSounds: boolean;
  showKanji: boolean;
  showMarkedOnly: boolean;
  practiceMode: boolean;
  selectedJlptLevels: Set<VocabularyJlptLevel>;
  canSaveMarks?: boolean;
  canStartQuiz?: boolean;
  hasUnsavedMarkChanges?: boolean;
}>(), {
  canSaveMarks: true,
  canStartQuiz: false,
  hasUnsavedMarkChanges: false
});

const emit = defineEmits<{
  'update:searchText': [value: string];
  'update:showAllSounds': [value: boolean];
  'update:showKanji': [value: boolean];
  'update:showMarkedOnly': [value: boolean];
  'update:practiceMode': [value: boolean];
  'update:selectedJlptLevels': [value: Set<VocabularyJlptLevel>];
  saveMarks: [];
  startQuiz: [];
}>();

const allJlptLevelsSelected = computed(() =>
  vocabularyJlptLevels.every((level) => props.selectedJlptLevels.has(level))
);

function updateJlptLevel(level: VocabularyJlptLevel, value: boolean) {
  const nextLevels = new Set(props.selectedJlptLevels);

  if (value) {
    nextLevels.add(level);
  } else {
    nextLevels.delete(level);
  }

  emit('update:selectedJlptLevels', nextLevels);
}

function updateAllJlptLevels(value: boolean) {
  emit('update:selectedJlptLevels', new Set(value ? vocabularyJlptLevels : []));
}

function jlptLevelTestId(level: VocabularyJlptLevel) {
  return `vocabulary-filter-jlpt-${level.toLowerCase()}`;
}

function jlptLevelWrapperTestId(level: VocabularyJlptLevel) {
  return `vocabulary-filter-jlpt-level-${level.toLowerCase()}`;
}
</script>

<template>
  <section class="vocabulary-control-bar" data-testid="vocabulary-control-bar">
    <div class="vocabulary-control-row vocabulary-search-controls">
      <div class="vocabulary-control-left">
        <input
          data-testid="vocabulary-search-input"
          class="vocabulary-search-input"
          type="text"
          :value="props.searchText"
          placeholder="搜尋"
          @input="emit('update:searchText', ($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="vocabulary-control-right vocabulary-control-right-stack">
        <BaseCheckbox
          data-testid="vocabulary-filter-show-all-sounds"
          :model-value="props.showAllSounds"
          label="全部字音"
          @update:model-value="emit('update:showAllSounds', $event)"
        />
        <BaseCheckbox
          data-testid="vocabulary-filter-show-kanji"
          :model-value="props.showKanji"
          label="漢字"
          @update:model-value="emit('update:showKanji', $event)"
        />
      </div>
    </div>

    <div class="vocabulary-level-controls" data-testid="vocabulary-level-controls">
      <div data-testid="vocabulary-filter-jlpt-level-all">
        <BaseCheckbox
          data-testid="vocabulary-filter-jlpt-select-all"
          :model-value="allJlptLevelsSelected"
          label="全部勾選"
          @update:model-value="updateAllJlptLevels"
        />
      </div>
      <div
        v-for="level in vocabularyJlptLevels"
        :key="level"
        :data-testid="jlptLevelWrapperTestId(level)"
      >
        <BaseCheckbox
          :data-testid="jlptLevelTestId(level)"
          :model-value="props.selectedJlptLevels.has(level)"
          :label="level"
          @update:model-value="updateJlptLevel(level, $event)"
        />
      </div>
    </div>

    <div class="vocabulary-action-controls" data-testid="vocabulary-action-controls">
      <div class="vocabulary-action-controls-left" data-testid="vocabulary-action-controls-left">
        <BaseCheckbox
          data-testid="vocabulary-filter-practice-mode"
          :model-value="props.practiceMode"
          label="練習"
          @update:model-value="emit('update:practiceMode', $event)"
        />
        <BaseCheckbox
          data-testid="vocabulary-filter-show-marked-only"
          :model-value="props.showMarkedOnly"
          label="只顯示註記"
          @update:model-value="emit('update:showMarkedOnly', $event)"
        />
      </div>
      <div class="vocabulary-action-controls-right" data-testid="vocabulary-action-controls-right">
        <p
          v-if="props.hasUnsavedMarkChanges"
          data-testid="vocabulary-unsaved-marks-hint"
          class="vocabulary-unsaved-marks-hint"
        >
          尚未儲存
        </p>
        <BaseButton
          data-testid="vocabulary-start-quiz-button"
          variant="primary"
          :disabled="!props.canStartQuiz"
          @click="emit('startQuiz')"
        >
          開始測驗
        </BaseButton>
        <BaseButton
          data-testid="vocabulary-save-marks-button"
          variant="secondary"
          :class="{ invisible: !props.canSaveMarks }"
          @click="emit('saveMarks')"
        >
          儲存註記
        </BaseButton>
      </div>
    </div>
  </section>
</template>
