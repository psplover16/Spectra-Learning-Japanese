<script setup lang="ts">
import BaseButton from '@/shared/components/BaseButton.vue';

const props = withDefaults(
  defineProps<{
    visible: boolean;
    kind?: 'success' | 'warning';
    message: string;
    actionLabel?: string | null;
  }>(),
  {
    kind: 'success',
    actionLabel: null
  }
);

const emit = defineEmits<{ action: []; dismiss: [] }>();
</script>

<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="fixed inset-x-0 bottom-4 z-50 mx-auto flex max-w-[calc(100%-16px)] items-center justify-between gap-3 rounded-lg border px-3 py-2 shadow-soft sm:max-w-md"
      :class="props.kind === 'warning' ? 'border-clay/25 bg-ink text-white' : 'border-moss/25 bg-pine text-white'"
    >
      <p class="text-sm">{{ message }}</p>
      <div class="flex items-center gap-2">
        <BaseButton v-if="actionLabel" variant="ghost" @click="emit('action')">
          {{ actionLabel }}
        </BaseButton>
        <button class="text-sm underline underline-offset-2" type="button" @click="emit('dismiss')">
          關閉
        </button>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
