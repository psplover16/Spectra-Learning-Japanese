export type GrammarLevelValue = 'N1' | 'N2' | 'N3' | 'N4' | 'N5';

export interface GrammarLevelOption {
  value: GrammarLevelValue;
  label: string;
  route: string;
  testId: string;
}

export const defaultGrammarLevelValue: GrammarLevelValue = 'N5';

export const grammarLevelOptions = [
  { value: 'N1', label: 'N1文法', route: '/n1-grammar', testId: 'route-sub-menu-option-n1-grammar' },
  { value: 'N2', label: 'N2文法', route: '/n2-grammar', testId: 'route-sub-menu-option-n2-grammar' },
  { value: 'N3', label: 'N3文法', route: '/n3-grammar', testId: 'route-sub-menu-option-n3-grammar' },
  { value: 'N4', label: 'N4文法', route: '/n4-grammar', testId: 'route-sub-menu-option-n4-grammar' },
  { value: 'N5', label: 'N5文法', route: '/n5-grammar', testId: 'route-sub-menu-option-n5-grammar' }
] as const satisfies readonly GrammarLevelOption[];

export function isGrammarLevelValue(value: unknown): value is GrammarLevelValue {
  return grammarLevelOptions.some((option) => option.value === value);
}

export function findGrammarLevelOption(
  value: GrammarLevelValue,
  options: readonly GrammarLevelOption[] = grammarLevelOptions
): GrammarLevelOption | null {
  return options.find((option) => option.value === value && option.route.length > 0) ?? null;
}

export function isGrammarLevelRoute(path: string, options: readonly GrammarLevelOption[] = grammarLevelOptions): boolean {
  return options.some((option) => option.route === path);
}
