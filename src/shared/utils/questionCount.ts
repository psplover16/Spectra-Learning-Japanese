export function calculateQuestionCount(
  selectedKanaCount: number,
  includeHiragana: boolean,
  includeKatakana: boolean
): number {
  const multiplier = Number(includeHiragana) + Number(includeKatakana);
  return selectedKanaCount * multiplier;
}
