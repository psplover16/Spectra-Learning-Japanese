<script setup lang="ts">
import { hatsuonRows } from '@/modules/practice/data/specialSyllableData';
</script>

<template>
  <section class="section-card space-y-2">
    <h2 class="text-sm font-semibold text-ink">撥音的發音規則：通常會依後方音節自然轉成接近鼻音的發音。</h2>
    <div class="table-shell">
      <table class="content-fit-table text-sm">
        <tbody>
          <tr v-for="row in hatsuonRows" :key="row.label">
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
