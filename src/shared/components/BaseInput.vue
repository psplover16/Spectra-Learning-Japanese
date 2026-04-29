<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: number | string;
    label?: string;
    min?: number;
    inputmode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
  }>(),
  {
    label: '',
    min: 0,
    inputmode: 'numeric'
  }
);

const emit = defineEmits<{ 'update:modelValue': [value: string] }>();
</script>

<template>
  <label class="flex w-full items-center gap-2 text-sm text-ink">
    <span v-if="label" class="shrink-0 font-medium">{{ label }}</span>
    <input
      class="w-full rounded border border-clay/20 bg-white px-2 py-[0.275rem] outline-none transition focus:border-clay"
      type="number"
      :min="min"
      :value="modelValue"
      :inputmode="inputmode"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </label>
</template>
