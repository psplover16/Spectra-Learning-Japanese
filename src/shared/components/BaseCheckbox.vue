<script setup lang="ts">
const props = defineProps<{ modelValue: boolean; label: string }>();
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>();
</script>

<template>
  <label class="inline-flex cursor-pointer items-center gap-2 text-sm text-ink">
    <input
      class="h-4 w-4 rounded border-clay/40 text-clay focus:ring-clay"
      type="checkbox"
      :checked="props.modelValue"
      @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <span>{{ label }}</span>
  </label>
</template>
