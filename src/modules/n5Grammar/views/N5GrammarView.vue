<script setup lang="ts">
import N5GrammarBulletBlock from '@/modules/n5Grammar/components/N5GrammarBulletBlock.vue';
import N5GrammarCompareTable from '@/modules/n5Grammar/components/N5GrammarCompareTable.vue';
import N5GrammarInfoBlock from '@/modules/n5Grammar/components/N5GrammarInfoBlock.vue';
import N5GrammarSectionCard from '@/modules/n5Grammar/components/N5GrammarSectionCard.vue';
import { defaultExpandedSectionIds } from '@/modules/n5Grammar/config/viewPreferences';
import { sortedN5GrammarSections } from '@/modules/n5Grammar/data/grammarNotes';
</script>

<template>
  <div data-testid="n5-grammar-view" class="n5-grammar-view">
    <N5GrammarSectionCard
      v-for="section in sortedN5GrammarSections"
      :key="section.id"
      :section="section"
      :default-expanded="defaultExpandedSectionIds.includes(section.id)"
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
