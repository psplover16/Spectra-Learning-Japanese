<script setup lang="ts">
import BaseCheckbox from '@/shared/components/BaseCheckbox.vue';

const props = defineProps<{
  searchText: string;
  showAllSounds: boolean;
  showKanji: boolean;
  showMarkedOnly: boolean;
  practiceMode: boolean;
}>();

const emit = defineEmits<{
  'update:searchText': [value: string];
  'update:showAllSounds': [value: boolean];
  'update:showKanji': [value: boolean];
  'update:showMarkedOnly': [value: boolean];
  'update:practiceMode': [value: boolean];
}>();
</script>

<template>
  <section class="vocabulary-control-bar" data-testid="vocabulary-control-bar">
    <div class="vocabulary-control-row">
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

    <div class="vocabulary-control-row">
      <div class="vocabulary-control-left">
        <BaseCheckbox
          data-testid="vocabulary-filter-practice-mode"
          :model-value="props.practiceMode"
          label="練習"
          @update:model-value="emit('update:practiceMode', $event)"
        />
      </div>
      <div class="vocabulary-control-right">
        <BaseCheckbox
          data-testid="vocabulary-filter-show-marked-only"
          :model-value="props.showMarkedOnly"
          label="只顯示註記"
          @update:model-value="emit('update:showMarkedOnly', $event)"
        />
      </div>
    </div>
  </section>
</template>
