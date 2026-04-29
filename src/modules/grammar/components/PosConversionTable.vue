<script setup lang="ts">
import GrammarAccordionTableShell from '@/modules/grammar/components/GrammarAccordionTableShell.vue';
import type { PosConversionGroup } from '@/modules/grammar/types/changeRules';

defineProps<{
  title: string;
  groups: PosConversionGroup[];
  sectionId: string;
}>();

function toChineseNumber(value: number) {
  if (value === 0) return '零';

  const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const units = ['', '十', '百', '千'];
  const raw = String(value);
  let result = '';

  for (let index = 0; index < raw.length; index += 1) {
    const digit = Number(raw[index]);
    const unitIndex = raw.length - index - 1;

    if (digit === 0) {
      if (!result.endsWith('零') && index !== raw.length - 1) result += '零';
    } else {
      result += (digits[digit] ?? '') + (units[unitIndex] ?? '');
    }
  }

  return result.replace(/^一十/u, '十').replace(/零$/u, '');
}
</script>

<template>
  <GrammarAccordionTableShell
    :title="title"
    :colspan="1"
    :table-test-id="`grammar-table-${sectionId}`"
    :toggle-test-id="`grammar-toggle-${sectionId}`"
  >
    <tr v-for="(group, groupIndex) in groups" :key="group.title">
      <td class="grammar-body-cell grammar-no-select">
        <div class="grammar-pos-group-title">{{ toChineseNumber(groupIndex + 1) }}. {{ group.title }}</div>
        <ol class="grammar-alpha-list">
          <li v-for="entry in group.contents" :key="entry.subTitle" class="grammar-alpha-item">
            <span>{{ `${entry.subTitle} ` }}</span>
            <ul class="grammar-square-list">
              <li v-for="content in entry.subContents" :key="content">{{ content }}</li>
              <div class="grammar-example-heading">範例：</div>
              <ul class="grammar-disc-list">
                <li v-for="example in entry.examples" :key="example">{{ example }}</li>
              </ul>
            </ul>
          </li>
        </ol>
      </td>
    </tr>
  </GrammarAccordionTableShell>
</template>
