<script setup lang="ts">
import { computed } from 'vue';
import { usePracticeSession } from '@/modules/practice/composables/usePracticeSession';

const props = withDefaults(
  defineProps<{
    title?: string;
  }>(),
  {
    title: '第一頁勾選結果明細'
  }
);

const session = usePracticeSession();
const kanaItems = session.selectedKanaDetailItems;
const optionItems = session.selectedOptionDetailItems;
const hasAnySelection = computed(() => kanaItems.value.length > 0 || optionItems.value.length > 0);
</script>

<template>
  <section class="section-card space-y-3" data-testid="selection-detail-panel">
    <div class="flex items-center justify-between gap-2">
      <h2 class="text-sm font-semibold text-ink">{{ props.title }}</h2>
      <span class="text-xs text-ink/60">唯讀共享狀態</span>
    </div>

    <div v-if="hasAnySelection" class="space-y-3">
      <div class="space-y-2">
        <h3 class="text-xs font-semibold uppercase tracking-[0.12em] text-ink/60">假名</h3>
        <div class="flex flex-wrap gap-2">
          <span v-for="item in kanaItems" :key="item.id" class="detail-pill">
            {{ item.label }}
          </span>
        </div>
      </div>

      <div v-if="optionItems.length" class="space-y-2">
        <h3 class="text-xs font-semibold uppercase tracking-[0.12em] text-ink/60">功能選項</h3>
        <div class="flex flex-wrap gap-2">
          <span v-for="item in optionItems" :key="item.id" class="detail-pill">
            {{ item.label }}
          </span>
        </div>
      </div>
    </div>

    <p v-else class="text-sm text-ink/65">
      目前尚未勾選任何假名或功能選項。
    </p>
  </section>
</template>
