<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const level = computed(() => {
  const match = /^\/n([1-4])-grammar/.exec(route.path);
  return match ? `N${match[1]}` : 'N1';
});

const testId = computed(() => `${level.value.toLowerCase()}-grammar-placeholder-view`);
</script>

<template>
  <section :data-testid="testId" class="grammar-placeholder-view section-card">
    <h1 class="grammar-placeholder-title">{{ level }}文法內容準備中</h1>
  </section>
</template>
