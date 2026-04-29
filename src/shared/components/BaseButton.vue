<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    disabled?: boolean;
  }>(),
  {
    type: 'button',
    variant: 'secondary',
    disabled: false
  }
);

const classes = computed(() => {
  const base = 'inline-flex items-center justify-center rounded text-sm font-semibold px-2 py-1 transition-colors disabled:cursor-not-allowed disabled:opacity-60';
  const variants = {
    primary: 'bg-clay text-white hover:bg-clay/90',
    secondary: 'bg-pine text-white hover:bg-pine/90',
    danger: 'bg-rose-600 text-white hover:bg-rose-500',
    ghost: 'border border-clay/25 bg-white/75 text-ink hover:bg-sand/70'
  };

  return `${base} ${variants[props.variant]}`;
});
</script>

<template>
  <button :type="type" :class="classes" :disabled="disabled">
    <slot />
  </button>
</template>
