<script setup lang="ts">
import { ref } from 'vue';
import type { N5GrammarSection } from '@/modules/n5Grammar/types/grammarNotes';

const props = withDefaults(
  defineProps<{
    section: N5GrammarSection;
    defaultExpanded?: boolean;
  }>(),
  {
    defaultExpanded: false
  }
);

const expanded = ref(props.defaultExpanded);

function toggleExpanded() {
  expanded.value = !expanded.value;
}
</script>

<template>
  <section :data-testid="`n5-grammar-section-${section.id}`" class="n5-grammar-section-card">
    <div class="n5-grammar-section-header">
      <h2 class="n5-grammar-section-heading">
        <button
          type="button"
          :data-testid="`n5-grammar-toggle-${section.id}`"
          class="n5-grammar-section-toggle"
          :aria-controls="`n5-grammar-body-${section.id}`"
          :aria-expanded="expanded ? 'true' : 'false'"
          @click="toggleExpanded"
        >
          <span :data-testid="`n5-grammar-title-${section.id}`" class="n5-grammar-section-title">
            {{ section.title }}
          </span>
          <span class="n5-grammar-section-toggle-icon" aria-hidden="true">{{ expanded ? '▲' : '▼' }}</span>
        </button>
      </h2>
    </div>

    <div
      v-show="expanded"
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
