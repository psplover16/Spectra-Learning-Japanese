<script setup lang="ts">
defineProps<{
  count: number;
}>();
</script>

<template>
  <p class="vocabulary-count-summary" data-testid="vocabulary-count-summary">
    {{ count }}個單字
  </p>
</template>
