<script setup lang="ts">
import GrammarAccordionTableShell from '@/modules/grammar/components/GrammarAccordionTableShell.vue';
import type { SystemDifferenceRow } from '@/modules/grammar/types/changeRules';

defineProps<{
  title: string;
  rows: SystemDifferenceRow[];
  sectionId: string;
}>();
</script>

<template>
  <GrammarAccordionTableShell
    :title="title"
    :colspan="3"
    :table-test-id="`grammar-table-${sectionId}`"
    :toggle-test-id="`grammar-toggle-${sectionId}`"
  >
    <tr>
      <td class="grammar-header-cell grammar-header-cell-wide">項目</td>
      <td class="grammar-header-cell grammar-header-cell-wide">中文</td>
      <td class="grammar-header-cell grammar-header-cell-wide">日文</td>
    </tr>

    <tr v-for="row in rows" :key="row.name">
      <td class="grammar-body-cell grammar-no-select grammar-center-cell">{{ row.name }}</td>
      <td class="grammar-body-cell grammar-no-select">
        <span>{{ row.cn.content }}</span>
        <div v-for="example in row.cn.examples" :key="example" class="grammar-example-line">-{{ example }}</div>
      </td>
      <td class="grammar-body-cell grammar-no-select">
        <span>{{ row.jp.content }}</span>
        <div v-for="example in row.jp.examples" :key="example" class="grammar-example-line">-{{ example }}</div>
      </td>
    </tr>
  </GrammarAccordionTableShell>
</template>
