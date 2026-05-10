<script setup lang="ts">
import { tableAColumnHeaders, tableARows } from '@/modules/practice/data/kanaData';
import { usePracticeSession } from '@/modules/practice/composables/usePracticeSession';
import type { KanaCell } from '@/modules/practice/types/practice';

const session = usePracticeSession();

function isHiddenArchaic(cell: KanaCell): boolean {
  return cell.archaic === true && !session.showArchaicKana.value;
}

function resolveCellKey(rowKey: string, columnIndex: number, cell: KanaCell | null): string {
  return cell?.id ?? `${rowKey}-${columnIndex}`;
}

function toggleCell(cell: KanaCell): void {
  session.toggleKana(cell, !session.isKanaChecked(cell.id));
}

function renderKana(cell: KanaCell): string {
  return `${cell.hiragana} / ${cell.katakana}`;
}
</script>

<template>
  <section class="section-card space-y-2">
    <div class="flex items-center justify-between gap-2">
      <h2 class="text-sm font-semibold text-ink">清音</h2>
    </div>

    <div class="table-shell">
      <table data-testid="practice-seion-table" class="fixed-grid-table practice-kana-table">
        <thead>
          <tr>
            <th class="kana-header border-b border-clay/15 px-1 py-2">行／段</th>
            <th
              v-for="column in tableAColumnHeaders"
              :key="column.key"
              class="kana-header border-b border-l border-clay/15 px-1 py-2"
            >
              <button
                type="button"
                class="practice-kana-header-button flex w-full flex-col items-center justify-center gap-1 whitespace-nowrap"
                :aria-pressed="session.isColumnChecked(column.key) ? 'true' : 'false'"
                @click="session.toggleColumn(column.key, !session.isColumnChecked(column.key))"
              >
                <span aria-hidden="true" class="practice-kana-checkbox-visual" :class="{ 'is-checked': session.isColumnChecked(column.key) }"></span>
                <span>{{ column.label }}</span>
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in tableARows" :key="row.rowKey">
            <th class="kana-header border-b border-clay/10 px-1 py-2">
              <button
                type="button"
                class="practice-kana-header-button flex w-full flex-col items-center justify-center gap-1 whitespace-nowrap"
                :aria-pressed="session.isRowChecked(row.rowKey) ? 'true' : 'false'"
                @click="session.toggleRow(row.rowKey, !session.isRowChecked(row.rowKey))"
              >
                <span aria-hidden="true" class="practice-kana-checkbox-visual" :class="{ 'is-checked': session.isRowChecked(row.rowKey) }"></span>
                <span>{{ row.label }}</span>
              </button>
            </th>
            <td
              v-for="(cell, columnIndex) in row.cells"
              :key="resolveCellKey(row.rowKey, columnIndex, cell)"
              class="border-b border-l border-clay/10 p-1 align-middle text-center"
              :class="cell && session.isKanaChecked(cell.id) ? 'kana-cell-selected' : ''"
            >
              <button
                v-if="cell && !isHiddenArchaic(cell)"
                type="button"
                class="practice-kana-button flex min-h-[58px] w-full flex-col items-center justify-center gap-1 whitespace-nowrap"
                :aria-pressed="cell.selectable !== false ? (session.isKanaChecked(cell.id) ? 'true' : 'false') : undefined"
                :aria-disabled="cell.selectable === false ? 'true' : undefined"
                @click="cell.selectable === false ? undefined : toggleCell(cell)"
              >
                <span
                  v-if="cell.selectable !== false"
                  aria-hidden="true"
                  class="practice-kana-checkbox-visual"
                  :class="{ 'is-checked': session.isKanaChecked(cell.id) }"
                ></span>
                <div class="practice-kana-text-stack">
                  <div class="practice-kana-main-text font-semibold">{{ renderKana(cell) }}</div>
                  <div class="practice-kana-romaji-text text-ink/70">{{ cell.romaji }}</div>
                </div>
              </button>
              <div
                v-else
                class="practice-kana-placeholder flex min-h-[58px] items-center justify-center whitespace-nowrap text-ink/40"
              >
                -
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
