<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router';
import { preloadRouteComponent } from '@/app/routePreload';
import GrammarLevelSwitcher from '@/modules/grammar/components/GrammarLevelSwitcher.vue';

const route = useRoute();
const leadingTabs = [
  { to: '/practice', label: '字母練習', testId: 'route-tab-practice' },
  { to: '/grammar', label: '變化規則', testId: 'route-tab-grammar' }
];
const trailingTabs = [
  { to: '/vocabulary', label: '單字練習', testId: 'route-tab-vocabulary' }
];

function prepareRoute(to: string) {
  void preloadRouteComponent(to);
}
</script>

<template>
  <nav data-testid="route-tabs" class="route-tabs">
    <RouterLink
      v-for="tab in leadingTabs"
      :key="tab.to"
      :to="tab.to"
      :data-testid="tab.testId"
      class="route-tab-link"
      :class="route.path === tab.to ? 'border-clay bg-clay text-white' : 'border-clay/20 bg-white/75 text-ink hover:bg-sand/70'"
      @pointerenter="prepareRoute(tab.to)"
      @focus="prepareRoute(tab.to)"
      @touchstart.passive="prepareRoute(tab.to)"
    >
      {{ tab.label }}
    </RouterLink>

    <GrammarLevelSwitcher />

    <RouterLink
      v-for="tab in trailingTabs"
      :key="tab.to"
      :to="tab.to"
      :data-testid="tab.testId"
      class="route-tab-link"
      :class="route.path === tab.to ? 'border-clay bg-clay text-white' : 'border-clay/20 bg-white/75 text-ink hover:bg-sand/70'"
      @pointerenter="prepareRoute(tab.to)"
      @focus="prepareRoute(tab.to)"
      @touchstart.passive="prepareRoute(tab.to)"
    >
      {{ tab.label }}
    </RouterLink>
  </nav>
</template>
