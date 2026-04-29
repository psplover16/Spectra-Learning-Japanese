<script setup lang="ts">
import { seionYoonRows, yoonColumnHeaders } from '@/modules/practice/data/specialSyllableData';
</script>

<template>
  <section data-testid="seion-yoon-section" class="section-card space-y-2" v-once>
    <h2 class="text-sm font-semibold text-ink">清音拗音：由 i 段假名接上小や・ゆ・よ，整體要一口氣連讀。</h2>
    <div class="table-shell">
      <table class="fixed-grid-table practice-grid-table text-xs">
        <thead>
          <tr>
            <th class="practice-grid-header-cell border-b border-clay/10"></th>
            <th v-for="header in yoonColumnHeaders" :key="header.key" class="practice-grid-header-cell border-b border-l border-clay/10">
              <span class="practice-kana-text">{{ header.kana }}</span>
              <span class="practice-romaji-text">{{ header.romaji }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in seionYoonRows" :key="row.header.key">
            <th class="practice-grid-header-cell border-b border-clay/10">
              <span class="practice-kana-text">{{ row.header.kana }}</span>
              <span class="practice-romaji-text">{{ row.header.romaji }}</span>
            </th>
            <td v-for="cell in row.cells" :key="cell.kana" class="practice-grid-cell border-b border-l border-clay/10">
              <span class="practice-kana-text">{{ cell.kana }}</span>
              <span class="practice-romaji-text">{{ cell.romaji }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
