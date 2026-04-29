<script setup lang="ts">
import { loanwordColumnHeaders, loanwordRows } from '@/modules/practice/data/specialSyllableData';
</script>

<template>
  <section data-testid="loanword-section" class="section-card space-y-2" v-once>
    <h2 class="text-sm font-semibold text-ink">外來語擴張：片假名會用額外組合來模擬日語原本沒有的音。</h2>
    <div class="table-shell">
      <table class="fixed-grid-table practice-grid-table text-xs">
        <thead>
          <tr>
            <th class="practice-grid-header-cell border-b border-clay/10"></th>
            <th v-for="header in loanwordColumnHeaders" :key="header.key" class="practice-grid-header-cell border-b border-l border-clay/10">
              <span class="practice-kana-text">{{ header.kana }}</span>
              <span class="practice-romaji-text">{{ header.romaji }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in loanwordRows" :key="row.header.key">
            <th class="practice-grid-header-cell border-b border-clay/10">
              <span class="practice-kana-text">{{ row.header.kana }}</span>
              <span class="practice-romaji-text">{{ row.header.romaji }}</span>
            </th>
            <td v-for="(cell, index) in row.cells" :key="`${row.header.key}-${cell.romaji ?? `empty-${index}`}`" class="practice-grid-cell border-b border-l border-clay/10">
              <template v-if="cell.available === false">
                <span class="practice-placeholder-text">{{ cell.kana }}</span>
              </template>
              <template v-else>
                <span class="practice-kana-text">{{ cell.kana }}</span>
                <span class="practice-romaji-text">{{ cell.romaji }}</span>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
