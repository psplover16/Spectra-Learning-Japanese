<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { preloadRouteComponent } from '@/app/routePreload';
import RouteSubMenu from '@/shared/components/RouteSubMenu.vue';
import { grammarLevelOptions, isGrammarLevelRoute, isGrammarLevelValue } from '@/modules/grammar/config/grammarLevels';
import { useGrammarLevel } from '@/modules/grammar/composables/useGrammarLevel';

const route = useRoute();
const router = useRouter();
const isSubMenuOpen = ref(false);
const { selectedLevel, selectedOption, setSelectedLevel } = useGrammarLevel();

const isGrammarRoute = computed(() => isGrammarLevelRoute(route.path));
const routeTabClass = computed(() => {
  return isGrammarRoute.value ? 'border-clay bg-clay text-white' : 'border-clay/20 bg-white/75 text-ink hover:bg-sand/70';
});

function closeSubMenu() {
  isSubMenuOpen.value = false;
}

function prepareRoute(routePath: string) {
  void preloadRouteComponent(routePath);
}

function prepareSelectedRoute() {
  prepareRoute(selectedOption.value.route);
}

function prepareGrammarLevelRoutes() {
  for (const option of grammarLevelOptions) {
    prepareRoute(option.route);
  }
}

function handleTriggerClick() {
  if (isGrammarRoute.value) {
    const nextIsOpen = !isSubMenuOpen.value;
    isSubMenuOpen.value = nextIsOpen;
    if (nextIsOpen) {
      prepareGrammarLevelRoutes();
    }
    return;
  }

  void router.push(selectedOption.value.route);
}

function handleSelect(value: string) {
  if (!isGrammarLevelValue(value)) {
    closeSubMenu();
    return;
  }

  const nextOption = grammarLevelOptions.find((option) => option.value === value);

  if (!nextOption || !setSelectedLevel(value)) {
    closeSubMenu();
    return;
  }

  closeSubMenu();
  prepareRoute(nextOption.route);
  void router.push(nextOption.route);
}

watch(
  () => route.path,
  () => {
    closeSubMenu();
  }
);
</script>

<template>
  <div class="grammar-level-switcher">
    <button
      type="button"
      data-testid="route-tab-grammar-level"
      class="route-tab-link"
      :class="routeTabClass"
      :aria-expanded="isSubMenuOpen"
      aria-haspopup="menu"
      @pointerenter="prepareSelectedRoute"
      @focus="prepareSelectedRoute"
      @touchstart.passive="prepareSelectedRoute"
      @click="handleTriggerClick"
    >
      {{ selectedOption.label }}
    </button>

    <RouteSubMenu
      :is-open="isSubMenuOpen"
      :options="grammarLevelOptions"
      :selected-value="selectedLevel"
      @close="closeSubMenu"
      @select="handleSelect"
    />
  </div>
</template>
