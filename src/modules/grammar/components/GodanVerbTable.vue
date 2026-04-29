<script setup lang="ts">
import { ref } from 'vue';
import type { GodanTableSpec, SoundChangeRule } from '@/modules/grammar/types/changeRules';

const props = defineProps<{
  sectionId: string;
  spec: GodanTableSpec;
}>();

const expanded = ref(false);

function soundRowSpan(rule: SoundChangeRule) {
  return rule.jisho.reduce((count, group) => count + group.length, 0);
}

function toggleExpanded() {
  expanded.value = !expanded.value;
}
</script>

<template>
  <div class="grammar-stack">
    <table :data-testid="`grammar-table-${sectionId}`" class="grammar-table">
      <thead>
        <tr>
          <td :colspan="props.spec.columns.length" :data-testid="`grammar-toggle-${sectionId}`" class="grammar-title-cell" @click="toggleExpanded">
            <div class="grammar-title-copy">
              {{ props.spec.title }}
              <div class="grammar-toggle-icon" aria-hidden="true">{{ expanded ? '▲' : '▼' }}</div>
            </div>
          </td>
        </tr>
      </thead>

      <tbody v-show="expanded">
        <tr>
          <th v-for="column in props.spec.columns" :key="column" class="grammar-header-cell grammar-header-cell-pre">{{ column }}</th>
        </tr>
        <template v-for="(row, rowIndex) in props.spec.mainRows" :key="`${sectionId}-main-${row.base}`">
          <tr v-for="(pair, pairIndex) in row.suffixAndMeaning" :key="`${row.base}-${pair.suffix}-${pairIndex}`">
            <td v-if="pairIndex === 0" :rowspan="row.suffixAndMeaning.length" class="grammar-row-title-cell">
              {{ row.base }}
            </td>
            <td
              v-if="rowIndex === 0 && pairIndex === 0"
              :rowspan="props.spec.mainRows.reduce((count, item) => count + item.suffixAndMeaning.length, 0)"
              class="grammar-body-cell grammar-no-select grammar-center-cell"
            >
              {{ props.spec.verb.slice(0, 1) }}
            </td>
            <td v-if="pairIndex === 0" :rowspan="row.suffixAndMeaning.length" class="grammar-body-cell grammar-no-select grammar-center-cell">
              {{ row.baseEnding }}
            </td>
            <td class="grammar-body-cell grammar-no-select grammar-center-cell" :class="{ 'grammar-highlight-cell': rowIndex === 1 && pairIndex >= 1 }">
              {{ pair.suffix }}
            </td>
            <td class="grammar-body-cell grammar-no-select grammar-center-cell">{{ pair.meaning }}</td>
          </tr>
        </template>
      </tbody>

      <tfoot v-if="expanded">
        <template v-for="(row, rowIndex) in props.spec.footerRows" :key="`${sectionId}-foot-${row.base}`">
          <tr v-for="(pair, pairIndex) in row.suffixAndMeaning" :key="`${row.base}-${pair.suffix}-${pairIndex}`" class="grammar-footer-row">
            <td
              v-if="pairIndex === 0"
              :rowspan="row.suffixAndMeaning.length"
              class="grammar-row-title-cell grammar-row-title-footer-cell"
              :class="{ 'grammar-derived-cell': props.sectionId === 'godan-table' }"
            >
              {{ row.base }}
            </td>
            <td
              v-if="rowIndex === 0 && pairIndex === 0"
              :rowspan="props.spec.footerRows.reduce((count, item) => count + item.suffixAndMeaning.length, 0)"
              class="grammar-body-cell grammar-no-select grammar-center-cell"
              :class="{ 'grammar-derived-cell': props.sectionId === 'godan-table' }"
            >
              {{ props.spec.verb.slice(0, 1) }}
            </td>
            <td
              v-if="pairIndex === 0"
              :rowspan="row.suffixAndMeaning.length"
              class="grammar-body-cell grammar-no-select grammar-center-cell"
              :class="{ 'grammar-derived-cell': props.sectionId === 'godan-table' }"
            >
              {{ row.baseEnding }}
            </td>
            <td
              class="grammar-body-cell grammar-no-select grammar-center-cell"
              :class="{ 'grammar-derived-cell': props.sectionId === 'godan-table' }"
            >
              {{ pair.suffix }}
            </td>
            <td
              class="grammar-body-cell grammar-no-select grammar-center-cell"
              :class="{ 'grammar-derived-cell': props.sectionId === 'godan-table' }"
            >
              {{ pair.meaning }}
            </td>
          </tr>
        </template>
      </tfoot>
    </table>

    <table v-show="expanded" :data-testid="`grammar-subtable-${sectionId}`" class="grammar-table">
      <thead>
        <tr>
          <td :colspan="props.spec.soundChangeColumns.length" class="grammar-subtitle-cell">
            <span class="grammar-title-copy">{{ props.spec.subtitle }}</span>
          </td>
        </tr>
      </thead>

      <tbody>
        <tr>
          <th v-for="column in props.spec.soundChangeColumns" :key="column" class="grammar-header-cell grammar-header-cell-pre">{{ column }}</th>
        </tr>
        <template v-for="rule in props.spec.soundChangeRows" :key="rule.base">
          <template v-for="(group, groupIndex) in rule.jisho" :key="`${rule.base}-${groupIndex}`">
            <tr v-for="(item, itemIndex) in group" :key="`${rule.base}-${groupIndex}-${item}`">
              <td v-if="groupIndex === 0 && itemIndex === 0" :rowspan="soundRowSpan(rule)" class="grammar-row-title-cell">
                {{ rule.base }}
              </td>
              <td class="grammar-body-cell grammar-no-select grammar-center-cell" :class="{ 'grammar-subtable-highlight-cell': rule.base === '促音便' && groupIndex === 0 && itemIndex === 0 }">
                {{ item }}
              </td>
              <td
                v-if="itemIndex === 0"
                :rowspan="group.length"
                class="grammar-body-cell grammar-no-select grammar-center-cell"
                :class="{ 'grammar-subtable-highlight-cell': rule.base === '促音便' && groupIndex === 0 }"
              >
                {{ rule.renyouTe[groupIndex] }}
              </td>
              <td
                v-if="itemIndex === 0"
                :rowspan="group.length"
                class="grammar-body-cell grammar-no-select grammar-center-cell"
                :class="{ 'grammar-subtable-highlight-cell': rule.base === '促音便' && groupIndex === 0 }"
              >
                {{ rule.renyouTa[groupIndex] }}
              </td>
            </tr>
          </template>
        </template>
      </tbody>

      <tfoot>
        <tr>
          <td :colspan="props.spec.soundChangeColumns.length" class="grammar-footnote-cell grammar-text-cell">
            <div v-for="note in props.spec.soundChangeNotes" :key="note" class="grammar-footnote-line">
              {{ note }}
            </div>
          </td>
        </tr>
        <tr>
          <td :colspan="props.spec.soundChangeColumns.length" class="grammar-footnote-cell grammar-center-cell">
            {{ props.spec.soundChangeFooter }}
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>
