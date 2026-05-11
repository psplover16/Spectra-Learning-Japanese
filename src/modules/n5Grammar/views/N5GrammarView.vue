<script setup lang="ts">
import { computed, onActivated, onMounted, ref } from 'vue';
import N5GrammarBulletBlock from '@/modules/n5Grammar/components/N5GrammarBulletBlock.vue';
import N5GrammarCompareTable from '@/modules/n5Grammar/components/N5GrammarCompareTable.vue';
import N5GrammarInfoBlock from '@/modules/n5Grammar/components/N5GrammarInfoBlock.vue';
import N5GrammarSectionCard from '@/modules/n5Grammar/components/N5GrammarSectionCard.vue';
import { defaultExpandedSectionIds } from '@/modules/n5Grammar/config/viewPreferences';
import { useN5GrammarSections } from '@/modules/n5Grammar/composables/useN5GrammarSections';
import type { N5GrammarSection } from '@/modules/n5Grammar/types/grammarNotes';
import {
  readCompletedN5GrammarSectionIds,
  writeCompletedN5GrammarSectionIds
} from '@/modules/n5Grammar/storage/n5GrammarCompletionStorage';
import {
  clearGrammarBookmark,
  readGrammarBookmark,
  writeGrammarBookmark
} from '@/modules/grammar/storage/grammarBookmarkStorage';

const bookmarkLevel = 'N5' as const;

const completedSectionIds = ref<Set<string>>(new Set());
const bookmarkedSectionId = ref<string | null>(null);
const { sections, hasSections, isLoading, loadError, loadSections } = useN5GrammarSections();
const unfinishedSections = computed<N5GrammarSection[]>(() =>
  sections.value.filter((section) => !completedSectionIds.value.has(section.id))
);
const finishedSections = computed<N5GrammarSection[]>(() =>
  sections.value.filter((section) => completedSectionIds.value.has(section.id))
);

function syncCompletedSectionIds(): void {
  completedSectionIds.value = new Set(readCompletedN5GrammarSectionIds());
}

function syncBookmarkedSectionId(): void {
  bookmarkedSectionId.value = readGrammarBookmark(bookmarkLevel)?.sectionId ?? null;
}

onMounted(() => {
  syncCompletedSectionIds();
  syncBookmarkedSectionId();
  void loadSections();
});

onActivated(() => {
  syncCompletedSectionIds();
  syncBookmarkedSectionId();
});

function isSectionCompleted(sectionId: string): boolean {
  return completedSectionIds.value.has(sectionId);
}

function isSectionBookmarked(sectionId: string): boolean {
  return bookmarkedSectionId.value === sectionId;
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

  if (completed && bookmarkedSectionId.value === sectionId) {
    clearGrammarBookmark(bookmarkLevel);
    bookmarkedSectionId.value = null;
  }
}

function updateSectionBookmarked(sectionId: string, bookmarked: boolean): void {
  if (bookmarked) {
    writeGrammarBookmark(bookmarkLevel, sectionId);
    bookmarkedSectionId.value = sectionId;
    return;
  }

  if (bookmarkedSectionId.value === sectionId) {
    clearGrammarBookmark(bookmarkLevel);
    bookmarkedSectionId.value = null;
  }
}
</script>

<template>
  <div data-testid="n5-grammar-view" class="n5-grammar-view space-y-4">
    <div
      v-if="!hasSections && !loadError"
      data-testid="n5-grammar-loading-state"
      class="section-card"
    >
      {{ isLoading ? '文法資料載入中' : '文法資料準備中' }}
    </div>

    <div
      v-if="loadError"
      data-testid="n5-grammar-load-error"
      class="section-card"
    >
      {{ loadError }}
    </div>

    <section v-if="hasSections" data-testid="n5-grammar-unfinished-zone" class="space-y-1 p-0">
      <N5GrammarSectionCard
        v-for="section in unfinishedSections"
        :key="section.id"
        :section="section"
        :completed="isSectionCompleted(section.id)"
        :bookmarked="isSectionBookmarked(section.id)"
        :show-bookmark="true"
        :default-expanded="defaultExpandedSectionIds.includes(section.id)"
        @update:completed="updateSectionCompleted(section.id, $event)"
        @update:bookmarked="updateSectionBookmarked(section.id, $event)"
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
    </section>

    <section
      v-if="finishedSections.length > 0"
      data-testid="n5-grammar-finished-zone"
      class="space-y-1 p-0"
    >
      <N5GrammarSectionCard
        v-for="section in finishedSections"
        :key="section.id"
        :section="section"
        :completed="isSectionCompleted(section.id)"
        :bookmarked="false"
        :show-bookmark="false"
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
    </section>
  </div>
</template>
