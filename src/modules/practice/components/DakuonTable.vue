<script setup lang="ts">
import { tableBRows } from '@/modules/practice/data/kanaData';
import { usePracticeSession } from '@/modules/practice/composables/usePracticeSession';
import type { KanaCell } from '@/modules/practice/types/practice';

const session = usePracticeSession();

function resolveCellKey(rowKey: string, columnIndex: number, cell: KanaCell | null): string {
  return cell?.id ?? `${rowKey}-${columnIndex}`;
}

function toggleCell(cell: KanaCell): void {
  session.toggleKana(cell, !session.isKanaChecked(cell.id));
}
</script>

<template>
  <section class="section-card space-y-2">
    <div class="flex items-center justify-between gap-2">
      <h2 class="text-sm font-semibold text-ink">濁音／半濁音</h2>
    </div>

    <div class="table-shell">
      <table data-testid="practice-dakuon-table" class="fixed-grid-table practice-kana-table">
        <tbody>
          <tr v-for="row in tableBRows" :key="row.rowKey">
            <td
              v-for="(cell, columnIndex) in row.cells"
              :key="resolveCellKey(row.rowKey, columnIndex, cell)"
              class="border-b border-l border-clay/10 p-1 align-middle text-center"
              :class="cell && session.isKanaChecked(cell.id) ? 'kana-cell-selected' : ''"
            >
              <button
                v-if="cell"
                type="button"
                class="practice-kana-button flex min-h-[58px] w-full flex-col items-center justify-center gap-1 whitespace-nowrap"
                @click="toggleCell(cell)"
              >
                <input class="pointer-events-none h-3.5 w-3.5" type="checkbox" :checked="session.isKanaChecked(cell.id)" />
                <div class="practice-kana-text-stack">
                  <div class="practice-kana-main-text font-semibold">{{ cell.hiragana }} / {{ cell.katakana }}</div>
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
