<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { N5GrammarSection } from '@/modules/n5Grammar/types/grammarNotes';

const props = withDefaults(
  defineProps<{
    section: N5GrammarSection;
    defaultExpanded?: boolean;
    completed?: boolean;
  }>(),
  {
    completed: false,
    defaultExpanded: false
  }
);

const emit = defineEmits<{
  'update:completed': [completed: boolean];
}>();

const expanded = ref(props.defaultExpanded && !props.completed);
const contentVisible = computed(() => expanded.value && !props.completed);
const completionLabel = computed(() => `標記 ${props.section.title} 為已學完`);

watch(
  () => props.completed,
  (completed) => {
    if (completed) {
      expanded.value = false;
    }
  }
);

function toggleExpanded() {
  if (props.completed) {
    return;
  }

  expanded.value = !expanded.value;
}

function toggleCompleted(event: Event) {
  event.preventDefault();
  event.stopPropagation();

  const nextCompleted = !props.completed;
  if (nextCompleted) {
    expanded.value = false;
  }

  emit('update:completed', nextCompleted);
}
</script>

<template>
  <section :data-testid="`n5-grammar-section-${section.id}`" class="n5-grammar-section-card">
    <div
      :data-testid="`n5-grammar-header-${section.id}`"
      class="n5-grammar-section-header"
      :class="{ 'is-expanded': contentVisible, 'is-completed': completed }"
    >
      <h2 class="n5-grammar-section-heading">
        <label
          :data-testid="`n5-grammar-completion-hit-area-${section.id}`"
          class="n5-grammar-section-completion-hit-area"
          @click="toggleCompleted"
        >
          <input
            type="checkbox"
            :data-testid="`n5-grammar-completion-${section.id}`"
            class="n5-grammar-section-completion"
            :checked="completed"
            :aria-label="completionLabel"
          />
        </label>
        <button
          type="button"
          :data-testid="`n5-grammar-toggle-${section.id}`"
          class="n5-grammar-section-toggle"
          :aria-controls="`n5-grammar-body-${section.id}`"
          :aria-expanded="contentVisible ? 'true' : 'false'"
          :aria-disabled="completed ? 'true' : undefined"
          @click="toggleExpanded"
        >
          <span :data-testid="`n5-grammar-title-${section.id}`" class="n5-grammar-section-title">
            {{ section.title }}
          </span>
        </button>
      </h2>
    </div>

    <div
      v-if="contentVisible"
      :id="`n5-grammar-body-${section.id}`"
      :data-testid="`n5-grammar-body-${section.id}`"
      class="n5-grammar-section-body"
    >
      <p v-if="section.description" :data-testid="`n5-grammar-description-${section.id}`" class="n5-grammar-section-description">
        {{ section.description }}
      </p>
      <slot />
    </div>
  </section>
</template>
