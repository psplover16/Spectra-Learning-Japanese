<script setup lang="ts">
import { computed, ref } from 'vue';

const props = withDefaults(
  defineProps<{
    title: string;
    subtitle?: string;
    colspan: number;
    defaultExpanded?: boolean;
    tableTestId?: string;
    toggleTestId?: string;
    titleCellTag?: 'th' | 'td';
    titleCellClass?: string;
  }>(),
  {
    subtitle: '',
    defaultExpanded: false,
    tableTestId: '',
    toggleTestId: '',
    titleCellTag: 'th',
    titleCellClass: ''
  }
);

const expanded = ref(props.defaultExpanded);
const headerColspan = computed(() => Math.max(props.colspan, 1));
const titleCellClasses = computed(() => ['grammar-title-cell', props.titleCellClass].filter(Boolean).join(' '));

function toggleExpanded() {
  expanded.value = !expanded.value;
}
</script>

<template>
  <table :data-testid="tableTestId || undefined" class="grammar-table">
    <thead>
      <tr>
        <component
          :is="titleCellTag"
          :colspan="headerColspan"
          :data-testid="toggleTestId || undefined"
          :class="titleCellClasses"
          @click="toggleExpanded"
        >
          <div class="grammar-title-copy">
            {{ title }}
            <div class="grammar-toggle-icon" aria-hidden="true">{{ expanded ? '▲' : '▼' }}</div>
          </div>
        </component>
      </tr>
    </thead>
    <tbody v-show="expanded">
      <tr v-if="subtitle">
        <td :colspan="headerColspan" class="grammar-subtitle-cell">
          <span class="grammar-title-copy">{{ subtitle }}</span>
        </td>
      </tr>
      <slot />
    </tbody>
    <tfoot v-if="expanded && $slots.footer">
      <slot name="footer" />
    </tfoot>
  </table>
</template>
