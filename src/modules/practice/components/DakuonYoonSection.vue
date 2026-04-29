<script setup lang="ts">
import { dakuonYoonRows, yoonColumnHeaders } from '@/modules/practice/data/specialSyllableData';
</script>

<template>
  <section data-testid="dakuon-yoon-section" class="section-card space-y-2" v-once>
    <h2 class="text-sm font-semibold text-ink">合拗音：濁音與半濁音接上小や・ゆ・よ時，也要視為一個連續音節。</h2>
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
          <tr v-for="row in dakuonYoonRows" :key="row.header.key">
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
