<script setup lang="ts">
import { sokuonRows } from '@/modules/practice/data/specialSyllableData';
</script>

<template>
  <section class="section-card space-y-2">
    <h2 class="text-sm font-semibold text-ink">促音的發音規則：先短暫停頓，再把後面的子音清楚推出來。</h2>
    <div class="table-shell">
      <table class="content-fit-table text-sm">
        <tbody>
          <tr v-for="row in sokuonRows" :key="row.label">
            <th class="whitespace-nowrap border-b border-clay/10 px-2 py-2 text-center font-semibold text-ink">
              {{ row.label }}
            </th>
            <td class="border-b border-l border-clay/10 px-2 py-2 text-center text-ink/80">
              <div class="space-y-1">
                <p v-for="value in row.values" :key="value">{{ value }}</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
