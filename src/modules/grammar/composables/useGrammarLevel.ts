import { computed, ref } from 'vue';
import {
  defaultGrammarLevelValue,
  findGrammarLevelOption,
  grammarLevelOptions
} from '@/modules/grammar/config/grammarLevels';
import type { GrammarLevelOption, GrammarLevelValue } from '@/modules/grammar/config/grammarLevels';
import { readGrammarLevelPreferenceOrDefault, writeGrammarLevelPreference } from '@/modules/grammar/storage/grammarLevelStorage';

export function useGrammarLevel(options: readonly GrammarLevelOption[] = grammarLevelOptions) {
  const selectedLevel = ref<GrammarLevelValue>(readGrammarLevelPreferenceOrDefault(options));

  function resolveFallbackOption(): GrammarLevelOption {
    const defaultOption = findGrammarLevelOption(defaultGrammarLevelValue, options);

    if (defaultOption) {
      return defaultOption;
    }

    const firstOption = options[0];

    if (firstOption) {
      return firstOption;
    }

    throw new Error('Grammar level options must not be empty.');
  }

  const selectedOption = computed(() => {
    return findGrammarLevelOption(selectedLevel.value, options) ?? resolveFallbackOption();
  });

  function setSelectedLevel(level: GrammarLevelValue): boolean {
    const option = findGrammarLevelOption(level, options);

    if (!option) {
      return false;
    }

    selectedLevel.value = option.value;
    return writeGrammarLevelPreference(option.value, options);
  }

  return {
    selectedLevel,
    selectedOption,
    setSelectedLevel
  };
}
