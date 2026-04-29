<script setup lang="ts">
import GrammarAccordionTableShell from '@/modules/grammar/components/GrammarAccordionTableShell.vue';
import type { InflectionSeries, InflectionTableSpec } from '@/modules/grammar/types/changeRules';

defineProps<{
  sectionId: string;
  spec: InflectionTableSpec;
}>();

function rowCount(rows: InflectionSeries[]) {
  return rows.reduce((count, row) => count + row.suffixAndMeaning.length, 0);
}

function isKanaNowrapSection(sectionId: string) {
  return sectionId === 'nai-adjective-table' || sectionId === 'da-auxiliary-table';
}

function isKanaSuffixNowrap(sectionId: string, rowIndex: number) {
  if (sectionId === 'nai-adjective-table') {
    return true;
  }

  return sectionId === 'da-auxiliary-table' && rowIndex !== 4;
}
</script>

<template>
  <GrammarAccordionTableShell
    :title="spec.title"
    :subtitle="spec.subtitle"
    :colspan="spec.columns.length"
    :table-test-id="`grammar-table-${sectionId}`"
    :toggle-test-id="`grammar-toggle-${sectionId}`"
    title-cell-tag="td"
    title-cell-class="grammar-title-cell-pre"
  >
    <tr>
      <th v-for="column in spec.columns" :key="column" class="grammar-header-cell grammar-header-cell-pre">{{ column }}</th>
    </tr>

    <template v-for="(row, rowIndex) in spec.mainRows" :key="`${sectionId}-main-${row.base}`">
      <tr v-for="(pair, pairIndex) in row.suffixAndMeaning" :key="`${row.base}-${pair.suffix}-${pairIndex}`">
        <td v-if="pairIndex === 0" :rowspan="row.suffixAndMeaning.length" class="grammar-row-title-cell">
          {{ row.base }}
        </td>
        <td
          v-if="rowIndex === 0 && pairIndex === 0 && spec.prefix"
          :rowspan="rowCount(spec.mainRows)"
          class="grammar-prefix-cell"
          :class="{ 'grammar-kana-nowrap-cell': isKanaNowrapSection(sectionId) }"
        >
          {{ spec.prefix }}
        </td>
        <td
          v-if="rowIndex === 0 && pairIndex === 0 && spec.verb"
          :rowspan="rowCount(spec.mainRows)"
          class="grammar-body-cell grammar-no-select grammar-center-cell grammar-normal-space-cell"
          :class="{ 'grammar-kana-nowrap-cell': sectionId === 'nai-adjective-table' }"
        >
          {{ spec.verb }}
        </td>
        <td
          v-if="pairIndex === 0"
          :rowspan="row.suffixAndMeaning.length"
          class="grammar-body-cell grammar-no-select grammar-center-cell grammar-normal-space-cell"
          :class="{ 'grammar-kana-nowrap-cell': isKanaNowrapSection(sectionId) }"
        >
          {{ row.baseEnding }}
        </td>
        <td
          class="grammar-body-cell grammar-no-select grammar-center-cell grammar-pre-wrap-cell"
          :class="{
            'grammar-kana-nowrap-cell': isKanaSuffixNowrap(sectionId, rowIndex),
            'grammar-fixed-break-cell': sectionId === 'da-auxiliary-table' && rowIndex === 4
          }"
        >
          {{ pair.suffix }}
        </td>
        <td class="grammar-body-cell grammar-no-select grammar-center-cell grammar-pre-wrap-cell">{{ pair.meaning }}</td>
      </tr>
    </template>

    <tr v-for="group in spec.exampleGroups ?? []" :key="group.id">
      <td :colspan="spec.columns.length" :data-testid="`grammar-inflection-examples-${group.id}`" class="grammar-inflection-example-cell">
        <div class="grammar-inflection-example-title">{{ group.title }}</div>
        <div class="grammar-inflection-example-grid">
          <article v-for="example in group.examples" :key="example.id" class="grammar-inflection-example-card">
            <div class="grammar-inflection-example-form">{{ example.form }}</div>
            <div class="grammar-inflection-example-japanese">{{ example.japanese }}</div>
            <div v-if="example.reading" class="grammar-inflection-example-reading">{{ example.reading }}</div>
            <div class="grammar-inflection-example-translation">{{ example.translation }}</div>
            <div v-if="example.note" class="grammar-inflection-example-note">{{ example.note }}</div>
          </article>
        </div>
      </td>
    </tr>

    <template v-if="spec.footerRows?.length" #footer>
      <template v-for="(row, rowIndex) in spec.footerRows" :key="`${sectionId}-footer-${row.base}`">
        <tr v-for="(pair, pairIndex) in row.suffixAndMeaning" :key="`${row.base}-${pair.suffix}-${pairIndex}`" class="grammar-footer-row">
          <td
            v-if="pairIndex === 0"
            :rowspan="row.suffixAndMeaning.length"
            class="grammar-row-title-cell grammar-row-title-footer-cell"
            :class="{ 'grammar-derived-cell': sectionId === 'ichidan-table' }"
          >
            {{ row.base }}
          </td>
          <td
            v-if="rowIndex === 0 && pairIndex === 0 && spec.verb"
            :rowspan="rowCount(spec.footerRows)"
            class="grammar-body-cell grammar-no-select grammar-center-cell grammar-normal-space-cell"
            :class="{ 'grammar-derived-cell': sectionId === 'ichidan-table' }"
          >
            {{ spec.verb }}
          </td>
          <td
            v-if="pairIndex === 0"
            :rowspan="row.suffixAndMeaning.length"
            class="grammar-body-cell grammar-no-select grammar-center-cell grammar-normal-space-cell"
            :class="{ 'grammar-derived-cell': sectionId === 'ichidan-table' }"
          >
            {{ row.baseEnding }}
          </td>
          <td
            class="grammar-body-cell grammar-no-select grammar-center-cell grammar-pre-wrap-cell"
            :class="{ 'grammar-derived-cell': sectionId === 'ichidan-table' }"
          >
            {{ pair.suffix }}
          </td>
          <td
            class="grammar-body-cell grammar-no-select grammar-center-cell grammar-pre-wrap-cell"
            :class="{ 'grammar-derived-cell': sectionId === 'ichidan-table' }"
          >
            {{ pair.meaning }}
          </td>
        </tr>
      </template>
    </template>
  </GrammarAccordionTableShell>
</template>
