import { computed, ref } from 'vue';
import type { N5GrammarSection } from '@/modules/n5Grammar/types/grammarNotes';

export type N5GrammarSectionsLoader = () => Promise<{
  sortedN5GrammarSections: N5GrammarSection[];
}>;

const defaultSectionsLoader: N5GrammarSectionsLoader = () => import('@/modules/n5Grammar/data/grammarNotes');

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
