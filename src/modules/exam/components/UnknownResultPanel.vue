<script setup lang="ts">
import BaseButton from '@/shared/components/BaseButton.vue';
import type { LatestUnknownResultSnapshot } from '@/modules/exam/types/exam';

defineProps<{ snapshot: LatestUnknownResultSnapshot | null }>();
const emit = defineEmits<{ clear: [] }>();
</script>

<template>
  <section v-if="snapshot" class="section-card space-y-3">
    <div class="flex items-center justify-between gap-2">
      <div>
        <h2 class="text-sm font-semibold text-ink">我不清楚的音節</h2>
        <p class="text-xs text-ink/60">你按下「我不清楚」的音節如下（顯示：平／片／羅馬拼音）</p>
      </div>
      <BaseButton data-testid="result-panel-clear-button" variant="ghost" class="whitespace-nowrap" @click="emit('clear')">清除</BaseButton>
    </div>

    <div class="flex flex-wrap gap-2">
      <span v-for="item in snapshot.results" :key="item.kanaId" class="detail-pill">
        <span>{{ item.hiragana }} / {{ item.katakana }} {{ item.romaji }}</span>
        <span class="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[11px] text-white">
          {{ item.count }}
        </span>
      </span>
    </div>
  </section>
</template>
