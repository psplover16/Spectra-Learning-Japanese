import { grammarLevelStorageKey } from '@/shared/config/storageKeys';
import {
  defaultGrammarLevelValue,
  findGrammarLevelOption,
  grammarLevelOptions,
  isGrammarLevelValue
} from '@/modules/grammar/config/grammarLevels';
import type { GrammarLevelOption, GrammarLevelValue } from '@/modules/grammar/config/grammarLevels';
import { readJsonStorage, removeStorage, writeJsonStorage } from '@/shared/utils/storageGuard';

export { grammarLevelStorageKey };

function isStoredGrammarLevelValue(value: unknown): value is GrammarLevelValue {
  return isGrammarLevelValue(value);
}

export function readGrammarLevelPreference(options: readonly GrammarLevelOption[] = grammarLevelOptions): GrammarLevelValue | null {
  const storedLevel = readJsonStorage(grammarLevelStorageKey, isStoredGrammarLevelValue);

  if (!storedLevel) {
    return null;
  }

  if (!findGrammarLevelOption(storedLevel, options)) {
    removeStorage(grammarLevelStorageKey);
    return null;
  }

  return storedLevel;
}

export function writeGrammarLevelPreference(level: GrammarLevelValue, options: readonly GrammarLevelOption[] = grammarLevelOptions): boolean {
  if (!findGrammarLevelOption(level, options)) {
    removeStorage(grammarLevelStorageKey);
    return false;
  }

  try {
    writeJsonStorage(grammarLevelStorageKey, level);
    return true;
  } catch {
    return false;
  }
}

export function clearGrammarLevelPreference(): void {
  removeStorage(grammarLevelStorageKey);
}

export function readGrammarLevelPreferenceOrDefault(options: readonly GrammarLevelOption[] = grammarLevelOptions): GrammarLevelValue {
  return readGrammarLevelPreference(options) ?? defaultGrammarLevelValue;
}
