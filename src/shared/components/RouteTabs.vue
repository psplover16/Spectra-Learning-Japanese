<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router';

const route = useRoute();
const tabs = [
  { to: '/practice', label: '字母練習', testId: 'route-tab-practice' },
  { to: '/grammar', label: '變化規則', testId: 'route-tab-grammar' },
  { to: '/n5-grammar', label: 'N5文法', testId: 'route-tab-n5-grammar' },
  { to: '/vocabulary', label: '單字練習', testId: 'route-tab-vocabulary' }
];
</script>

<template>
  <nav data-testid="route-tabs" class="route-tabs">
    <RouterLink
      v-for="tab in tabs"
      :key="tab.to"
      :to="tab.to"
      :data-testid="tab.testId"
      class="route-tab-link"
      :class="route.path === tab.to ? 'border-clay bg-clay text-white' : 'border-clay/20 bg-white/75 text-ink hover:bg-sand/70'"
    >
      {{ tab.label }}
    </RouterLink>
  </nav>
</template>
