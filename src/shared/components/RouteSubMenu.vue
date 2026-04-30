<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';

export interface RouteSubMenuOption {
  value: string;
  label: string;
  route: string;
  testId: string;
}

const props = withDefaults(
  defineProps<{
    isOpen: boolean;
    options: readonly RouteSubMenuOption[];
    selectedValue?: string;
    menuTestId?: string;
    overlayTestId?: string;
  }>(),
  {
    selectedValue: '',
    menuTestId: 'route-sub-menu',
    overlayTestId: 'route-sub-menu-overlay'
  }
);

const emit = defineEmits<{
  close: [];
  select: [value: string];
}>();

function closeSubMenu() {
  emit('close');
}

function selectOption(value: string) {
  emit('select', value);
}

function handleKeydown(event: KeyboardEvent) {
  if (props.isOpen && event.key === 'Escape') {
    closeSubMenu();
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" :data-testid="overlayTestId" class="route-sub-menu-overlay" @click="closeSubMenu" />
  </Teleport>

  <div v-if="isOpen" :data-testid="menuTestId" class="route-sub-menu" role="menu">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      :data-testid="option.testId"
      class="route-tab-link"
      :class="option.value === selectedValue ? 'border-clay bg-clay text-white' : 'border-clay/20 bg-white/75 text-ink hover:bg-sand/70'"
      role="menuitem"
      @click="selectOption(option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>
