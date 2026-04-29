<script setup lang="ts">
import { nextTick, ref } from 'vue';
import type { VocabularyColumnVisibility, VocabularyEntry } from '@/modules/vocabulary/types/vocabulary';
import { getDisplayWord } from '@/modules/vocabulary/utils/vocabularyFilters';

const props = defineProps<{
  entries: VocabularyEntry[];
  showKanji: boolean;
  practiceMode: boolean;
  columnVisibility: VocabularyColumnVisibility;
  savedMarkedIds: number[];
  draftMarkedIds: number[];
  revealedEntryId: number | null;
}>();

const emit = defineEmits<{
  'update:wordColumnVisible': [value: boolean];
  'update:combinedColumnVisible': [value: boolean];
  'update:meaningColumnVisible': [value: boolean];
  'toggle-marked': [id: number, value: boolean];
  'clear-marks': [];
  'begin-reveal': [id: number];
  'end-reveal': [id?: number];
}>();

const clearMarksChecked = ref(false);
const pressedAtMap = new Map<number, number>();
const suppressRowClickId = ref<number | null>(null);

function isDraftMarked(id: number) {
  return props.draftMarkedIds.includes(id);
}

function isSavedMarked(id: number) {
  return props.savedMarkedIds.includes(id);
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

function cellContentClasses(visible: boolean) {
  return visible ? 'vocabulary-cell-content' : 'vocabulary-cell-content vocabulary-hidden-content';
}

async function handleClearMarksChange(event: Event) {
  const target = event.target as HTMLInputElement;

  if (!target.checked) {
    return;
  }

  clearMarksChecked.value = true;
  emit('clear-marks');
  await nextTick();
  clearMarksChecked.value = false;
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

function handleRowClick(id: number) {
  if (suppressRowClickId.value === id) {
    suppressRowClickId.value = null;
    return;
  }

  emit('toggle-marked', id, !isDraftMarked(id));
}
</script>

<template>
  <div class="vocabulary-table-scroll" data-testid="vocabulary-table-scroll">
    <table class="vocabulary-table" data-testid="vocabulary-table">
      <thead>
        <tr class="vocabulary-header-row">
          <th class="vocabulary-header-cell">
            <label class="vocabulary-header-toggle">
              <input
                type="checkbox"
                :checked="props.columnVisibility.word"
                @change="emit('update:wordColumnVisible', ($event.target as HTMLInputElement).checked)"
              />
              <span>單字</span>
            </label>
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
            <div class="vocabulary-clear-marks-shell">
              <input
                data-testid="vocabulary-clear-marks-checkbox"
                type="checkbox"
                title="刪除全部註記"
                :checked="clearMarksChecked"
                @change="handleClearMarksChange"
              />
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="entry in props.entries"
          :key="entry.id"
          :data-testid="`vocabulary-row-${entry.id}`"
          :class="{ 'vocabulary-marked-row': isSavedMarked(entry.id) }"
          @click="handleRowClick(entry.id)"
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
              :class="cellContentClasses(isContentVisible('word', entry.id))"
            >
              {{ getDisplayWord(entry.text, props.practiceMode) }}
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
                :checked="isDraftMarked(entry.id)"
                @pointerdown.stop
                @click.stop
                @change="emit('toggle-marked', entry.id, ($event.target as HTMLInputElement).checked)"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
