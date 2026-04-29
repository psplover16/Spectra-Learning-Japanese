<script setup lang="ts">
import GrammarAccordionTableShell from '@/modules/grammar/components/GrammarAccordionTableShell.vue';
import type { RuleListItem } from '@/modules/grammar/types/changeRules';

defineProps<{
  title: string;
  rows: RuleListItem[];
  sectionId: string;
}>();
</script>

<template>
  <GrammarAccordionTableShell
    :title="title"
    :colspan="1"
    :table-test-id="`grammar-table-${sectionId}`"
    :toggle-test-id="`grammar-toggle-${sectionId}`"
  >
    <tr v-for="(row, index) in rows" :key="`${sectionId}-${index}`">
      <td class="grammar-body-cell grammar-no-select">
        <div class="grammar-rule-line">
          <span class="grammar-rule-index">{{ index + 1 }}.</span>
          <span class="grammar-rule-text">{{ row.rules }}</span>
        </div>
        <div
          v-if="row.examples?.length"
          :class="sectionId === 'verb-classification' && index === 3 ? 'grammar-substack-tight' : 'grammar-substack'"
        >
          <div v-for="example in row.examples" :key="`${example.verb}-${example.meaning}`" class="grammar-example-indent">
            {{ example.verb }}：{{ example.meaning }}
          </div>
        </div>
      </td>
    </tr>
  </GrammarAccordionTableShell>
</template>
