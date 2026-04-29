<script setup lang="ts">
import { longVowelRows } from '@/modules/practice/data/specialSyllableData';
</script>

<template>
  <section data-testid="choon-section" class="section-card space-y-2" v-once>
    <h2 class="text-sm font-semibold text-ink">長音規則：不同拼寫形式都在提醒同一個母音要拉長。</h2>
    <div class="table-shell">
      <table class="content-fit-table practice-long-vowel-table text-sm">
        <tbody>
          <template v-for="row in longVowelRows" :key="row.id">
            <tr v-if="row.kind === 'rule'" class="practice-long-vowel-rule-row">
              <th colspan="3" class="practice-long-vowel-rule-cell">
                <span class="font-semibold text-ink">{{ row.groupTitle }}</span>
                <span class="text-ink/80">：{{ row.ruleText }}</span>
              </th>
            </tr>
            <tr v-else class="practice-long-vowel-example-row">
              <td class="practice-long-vowel-cell practice-long-vowel-example-cell">
                <span class="practice-kana-text practice-long-vowel-kana-text">{{ row.example?.kana }}</span>
              </td>
              <td class="practice-long-vowel-cell practice-long-vowel-example-cell">
                <span class="practice-long-vowel-romaji-text">{{ row.example?.romaji }}</span>
              </td>
              <td class="practice-long-vowel-cell practice-long-vowel-example-cell">
                <span class="practice-long-vowel-translation-text">{{ row.example?.translation }}</span>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </section>
</template>
