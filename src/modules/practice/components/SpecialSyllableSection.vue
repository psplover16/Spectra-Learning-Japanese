<script setup lang="ts">
import { specialSyllableNotes } from '@/modules/practice/data/specialSyllableData';
</script>

<template>
  <section class="section-card space-y-2">
    <h2 class="text-sm font-semibold text-ink">特殊音節</h2>
    <div class="table-shell">
      <table class="content-fit-table text-sm">
        <tbody>
          <tr v-for="note in specialSyllableNotes" :key="note.kana">
            <th class="border-b border-clay/10 px-2 py-2 text-center font-semibold text-ink">
              <div>{{ note.kana }}</div>
              <div class="text-xs text-ink/60">{{ note.romaji }}</div>
            </th>
            <td class="border-b border-l border-clay/10 px-3 py-2 text-left text-ink/80">
              {{ note.description }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
