<script setup lang="ts">
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
  readingMode: boolean;
  selectedJlptLevels: Set<VocabularyJlptLevel>;
  canSaveMarks?: boolean;
  canShowStartQuiz?: boolean;
  canStartQuiz?: boolean;
}>(), {
  canSaveMarks: true,
  canShowStartQuiz: true,
  canStartQuiz: false
});

const emit = defineEmits<{
  'update:searchText': [value: string];
  'update:showAllSounds': [value: boolean];
  'update:showKanji': [value: boolean];
  'update:showMarkedOnly': [value: boolean];
  'update:readingMode': [value: boolean];
  'update:selectedJlptLevels': [value: Set<VocabularyJlptLevel>];
  saveMarks: [];
  startQuiz: [];
}>();

function updateJlptLevel(level: VocabularyJlptLevel, value: boolean) {
  const nextLevels = new Set(props.selectedJlptLevels);

  if (value) {
    nextLevels.add(level);
  } else {
    nextLevels.delete(level);
  }

  emit('update:selectedJlptLevels', nextLevels);
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
    <div
      class="vocabulary-control-row vocabulary-search-controls"
      data-testid="vocabulary-search-controls"
    >
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
      <div class="vocabulary-control-right">
        <button
          data-testid="vocabulary-reading-mode-button"
          type="button"
          class="vocabulary-reading-mode-button"
          :class="props.readingMode ? 'vocabulary-reading-mode-button--operate' : 'vocabulary-reading-mode-button--read'"
          @click="emit('update:readingMode', !props.readingMode)"
        >
          {{ props.readingMode ? '操作模式' : '閱讀模式' }}
        </button>
      </div>
    </div>

    <div class="vocabulary-level-controls" data-testid="vocabulary-level-controls">
      <div class="vocabulary-level-controls-left" data-testid="vocabulary-level-controls-left">
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
      <div class="vocabulary-level-controls-right" data-testid="vocabulary-level-controls-right">
        <BaseButton
          v-if="props.canShowStartQuiz"
          data-testid="vocabulary-start-quiz-button"
          variant="primary"
          :disabled="!props.canStartQuiz"
          @click="emit('startQuiz')"
        >
          開始測驗
        </BaseButton>
      </div>
    </div>

    <div class="vocabulary-action-controls" data-testid="vocabulary-action-controls">
      <div class="vocabulary-action-controls-left" data-testid="vocabulary-action-controls-left">
        <BaseCheckbox
          data-testid="vocabulary-filter-show-kanji"
          :model-value="props.showKanji"
          label="漢字"
          @update:model-value="emit('update:showKanji', $event)"
        />
        <BaseCheckbox
          data-testid="vocabulary-filter-show-all-sounds"
          :model-value="props.showAllSounds"
          label="全部字音"
          @update:model-value="emit('update:showAllSounds', $event)"
        />
        <BaseCheckbox
          data-testid="vocabulary-filter-show-marked-only"
          :model-value="props.showMarkedOnly"
          label="僅註記"
          @update:model-value="emit('update:showMarkedOnly', $event)"
        />
      </div>
      <div class="vocabulary-action-controls-right" data-testid="vocabulary-action-controls-right">
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
