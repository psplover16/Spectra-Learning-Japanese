import { computed, ref } from 'vue';
import type { N5GrammarSection } from '@/modules/n5Grammar/types/grammarNotes';

export type N5GrammarSectionsLoader = () => Promise<{
  sortedN5GrammarSections: N5GrammarSection[];
}>;

const defaultSectionsLoader: N5GrammarSectionsLoader = async () => {
  const [particles, fundamentals, sentencePatterns, expressions, honorifics] = await Promise.all([
    import('@/modules/n5Grammar/data/sections/particles'),
    import('@/modules/n5Grammar/data/sections/fundamentals'),
    import('@/modules/n5Grammar/data/sections/sentence-patterns'),
    import('@/modules/n5Grammar/data/sections/expressions'),
    import('@/modules/n5Grammar/data/sections/honorifics')
  ]);
  const merged: N5GrammarSection[] = [
    ...fundamentals.sections,
    ...honorifics.sections,
    ...sentencePatterns.sections,
    ...expressions.sections,
    ...particles.sections
  ];
  return {
    sortedN5GrammarSections: [...merged].sort((left, right) => left.order - right.order)
  };
};

export function useN5GrammarSections(loadSectionsModule: N5GrammarSectionsLoader = defaultSectionsLoader) {
  const sections = ref<N5GrammarSection[]>([]);
  const isLoading = ref(false);
  const loadError = ref<string | null>(null);
  let loadPromise: Promise<void> | null = null;

  const hasSections = computed(() => sections.value.length > 0);

  async function loadSections() {
    if (hasSections.value) {
      return;
    }

    if (loadPromise) {
      return loadPromise;
    }

    isLoading.value = true;
    loadError.value = null;
    loadPromise = loadSectionsModule()
      .then((module) => {
        sections.value = module.sortedN5GrammarSections;
      })
      .catch(() => {
        loadError.value = 'N5文法資料載入失敗';
      })
      .finally(() => {
        isLoading.value = false;
        loadPromise = null;
      });

    return loadPromise;
  }

  return {
    sections,
    hasSections,
    isLoading,
    loadError,
    loadSections
  };
}
