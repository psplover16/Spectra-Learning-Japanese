<script setup lang="ts">
import { onMounted, ref } from 'vue';
import N5GrammarBulletBlock from '@/modules/n5Grammar/components/N5GrammarBulletBlock.vue';
import N5GrammarCompareTable from '@/modules/n5Grammar/components/N5GrammarCompareTable.vue';
import N5GrammarInfoBlock from '@/modules/n5Grammar/components/N5GrammarInfoBlock.vue';
import N5GrammarSectionCard from '@/modules/n5Grammar/components/N5GrammarSectionCard.vue';
import { defaultExpandedSectionIds } from '@/modules/n5Grammar/config/viewPreferences';
import { sortedN5GrammarSections } from '@/modules/n5Grammar/data/grammarNotes';
import {
  readCompletedN5GrammarSectionIds,
  writeCompletedN5GrammarSectionIds
} from '@/modules/n5Grammar/storage/n5GrammarCompletionStorage';

const completedSectionIds = ref<Set<string>>(new Set());

onMounted(() => {
  completedSectionIds.value = new Set(readCompletedN5GrammarSectionIds());
});

function isSectionCompleted(sectionId: string): boolean {
  return completedSectionIds.value.has(sectionId);
}

function updateSectionCompleted(sectionId: string, completed: boolean): void {
  const nextCompletedSectionIds = new Set(completedSectionIds.value);

  if (completed) {
    nextCompletedSectionIds.add(sectionId);
  } else {
    nextCompletedSectionIds.delete(sectionId);
  }

  completedSectionIds.value = nextCompletedSectionIds;
  writeCompletedN5GrammarSectionIds([...nextCompletedSectionIds]);
}
</script>

<template>
  <div data-testid="n5-grammar-view" class="n5-grammar-view">
    <N5GrammarSectionCard
      v-for="section in sortedN5GrammarSections"
      :key="section.id"
      :section="section"
      :completed="isSectionCompleted(section.id)"
      :default-expanded="defaultExpandedSectionIds.includes(section.id)"
      @update:completed="updateSectionCompleted(section.id, $event)"
    >
      <N5GrammarCompareTable
        v-if="section.presentationMode === 'compare-table'"
        :section="section"
      />
      <N5GrammarBulletBlock
        v-else-if="section.presentationMode === 'bullet-list'"
        :topics="section.topics"
        :shared-notes="section.sharedNotes"
      />
      <N5GrammarInfoBlock
        v-else
        :topics="section.topics"
        :shared-notes="section.sharedNotes"
      />
    </N5GrammarSectionCard>
  </div>
</template>
