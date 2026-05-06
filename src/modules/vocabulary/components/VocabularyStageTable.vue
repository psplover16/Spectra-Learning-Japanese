<script setup lang="ts">
import { ref } from 'vue';
import type { VocabularyColumnVisibility, VocabularyEntry } from '@/modules/vocabulary/types/vocabulary';
import { getDisplayWord } from '@/modules/vocabulary/utils/vocabularyFilters';

const props = withDefaults(
  defineProps<{
    entries: VocabularyEntry[];
    showKanji: boolean;
    wordPracticeVisible: boolean;
    columnVisibility: VocabularyColumnVisibility;
    savedMarkedKeys: ReadonlySet<string>;
    draftMarkedKeys: ReadonlySet<string>;
    allVisibleDraftMarked: boolean;
    revealedEntryId: number | null;
    isLoading?: boolean;
  }>(),
  {
    isLoading: false
  }
);

const emit = defineEmits<{
  'update:wordColumnVisible': [value: boolean];
  'update:wordPracticeVisible': [value: boolean];
  'update:combinedColumnVisible': [value: boolean];
  'update:meaningColumnVisible': [value: boolean];
  'toggle-marked': [key: string, value: boolean];
  'bulk-toggle-marked': [value: boolean];
  'begin-reveal': [id: number];
  'end-reveal': [id?: number];
}>();

const pressedAtMap = new Map<number, number>();
const suppressRowClickId = ref<number | null>(null);

function isDraftMarked(key: string) {
  return props.draftMarkedKeys.has(key);
}

function isSavedMarked(key: string) {
  return props.savedMarkedKeys.has(key);
}

function isContentVisible(column: 'word' | 'combined' | 'meaning', entryId: number) {
  return props.columnVisibility[column] || props.revealedEntryId === entryId;
}

function combinedContent(entry: VocabularyEntry) {
  if (props.showKanji) {
    return entry.kanji;
  }

  return entry.romanization;
}

function combinedColumnVisible(entryId: number) {
  return isContentVisible('combined', entryId);
}

function wordCellText(entry: VocabularyEntry) {
  return getDisplayWord(entry.text, props.columnVisibility.word, props.wordPracticeVisible);
}

function cellContentClasses(visible: boolean) {
  return visible ? 'vocabulary-cell-content' : 'vocabulary-cell-content vocabulary-hidden-content';
}

function handlePointerDown(id: number) {
  pressedAtMap.set(id, Date.now());
  emit('begin-reveal', id);
}

function handlePointerEnd(id: number) {
  const pressedAt = pressedAtMap.get(id);

  if (pressedAt !== undefined && Date.now() - pressedAt >= 400) {
    suppressRowClickId.value = id;
  }

  pressedAtMap.delete(id);
  emit('end-reveal', id);
}

function handleRowClick(entry: VocabularyEntry) {
  if (suppressRowClickId.value === entry.id) {
    suppressRowClickId.value = null;
    return;
  }

  emit('toggle-marked', entry.markKey, !isDraftMarked(entry.markKey));
}
</script>

<template>
  <div class="vocabulary-table-scroll" data-testid="vocabulary-table-scroll">
    <table class="vocabulary-table" data-testid="vocabulary-table">
      <thead>
        <tr class="vocabulary-header-row">
          <th class="vocabulary-header-cell">
            <div
              class="vocabulary-header-toggle vocabulary-word-header-controls gap-[0.5rem]"
              data-testid="vocabulary-word-header-controls"
            >
              <label class="vocabulary-word-header-toggle">
                <input
                  data-testid="vocabulary-word-column-checkbox"
                  type="checkbox"
                  :checked="props.columnVisibility.word"
                  @change="emit('update:wordColumnVisible', ($event.target as HTMLInputElement).checked)"
                />
                <span>單字</span>
              </label>
              <label class="vocabulary-word-header-toggle">
                <input
                  data-testid="vocabulary-word-practice-checkbox"
                  type="checkbox"
                  :checked="props.wordPracticeVisible"
                  @change="emit('update:wordPracticeVisible', ($event.target as HTMLInputElement).checked)"
                />
                <span>練習</span>
              </label>
            </div>
          </th>
          <th class="vocabulary-header-cell">
            <label class="vocabulary-header-toggle">
              <input
                type="checkbox"
                :checked="props.columnVisibility.combined"
                @change="emit('update:combinedColumnVisible', ($event.target as HTMLInputElement).checked)"
              />
              <span>{{ props.showKanji ? '漢字' : '拼音' }}</span>
            </label>
          </th>
          <th class="vocabulary-header-cell">
            <label class="vocabulary-header-toggle">
              <input
                type="checkbox"
                :checked="props.columnVisibility.meaning"
                @change="emit('update:meaningColumnVisible', ($event.target as HTMLInputElement).checked)"
              />
              <span>中文</span>
            </label>
          </th>
          <th class="vocabulary-mark-header-cell">
            <div class="vocabulary-bulk-mark-shell">
              <input
                data-testid="vocabulary-bulk-mark-checkbox"
                type="checkbox"
                title="勾選或取消勾選目前顯示單字"
                :checked="props.allVisibleDraftMarked"
                @change="emit('bulk-toggle-marked', ($event.target as HTMLInputElement).checked)"
              />
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-if="props.isLoading && props.entries.length === 0"
          data-testid="vocabulary-loading-row"
          class="vocabulary-loading-row"
        >
          <td colspan="4" class="vocabulary-body-cell">
            單字資料載入中
          </td>
        </tr>
        <tr
          v-for="entry in props.entries"
          :key="entry.id"
          :data-testid="`vocabulary-row-${entry.id}`"
          :class="{ 'vocabulary-marked-row': isSavedMarked(entry.markKey) }"
          @click="handleRowClick(entry)"
          @contextmenu.prevent
          @pointerdown="handlePointerDown(entry.id)"
          @pointerup="handlePointerEnd(entry.id)"
          @pointerleave="handlePointerEnd(entry.id)"
          @pointercancel="handlePointerEnd(entry.id)"
        >
          <td
            :data-testid="`vocabulary-word-cell-${entry.id}`"
            class="vocabulary-body-cell"
            width="30%"
          >
            <span
              :data-testid="`vocabulary-word-content-${entry.id}`"
              :class="cellContentClasses(props.columnVisibility.word || props.wordPracticeVisible)"
            >
              {{ wordCellText(entry) }}
            </span>
          </td>
          <td
            :data-testid="`vocabulary-combined-cell-${entry.id}`"
            class="vocabulary-body-cell"
            width="20%"
          >
            <span
              :data-testid="`vocabulary-combined-content-${entry.id}`"
              :class="cellContentClasses(combinedColumnVisible(entry.id))"
            >
              {{ combinedContent(entry) }}
            </span>
          </td>
          <td
            :data-testid="`vocabulary-meaning-cell-${entry.id}`"
            class="vocabulary-body-cell"
          >
            <span
              :data-testid="`vocabulary-meaning-content-${entry.id}`"
              :class="cellContentClasses(isContentVisible('meaning', entry.id))"
            >
              {{ entry.meaning }}
            </span>
          </td>
          <td class="vocabulary-mark-cell">
            <div class="vocabulary-mark-cell-shell">
              <input
                :data-testid="`vocabulary-mark-checkbox-${entry.id}`"
                type="checkbox"
                :checked="isDraftMarked(entry.markKey)"
                @pointerdown.stop
                @click.stop
                @change="emit('toggle-marked', entry.markKey, ($event.target as HTMLInputElement).checked)"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
