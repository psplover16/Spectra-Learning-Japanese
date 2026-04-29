import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildLoopedDeck, shuffleArray } from '@/shared/utils/questionDeck';

describe('questionDeck', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shuffleArray 會回傳新陣列且保留相同元素', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const source = [1, 2, 3, 4];
    const result = shuffleArray(source);

    expect(source).toEqual([1, 2, 3, 4]);
    expect(result).toHaveLength(source.length);
    expect([...result].sort((left, right) => left - right)).toEqual(source);
  });

  it('buildLoopedDeck 會重複洗牌直到題數足夠', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    expect(buildLoopedDeck(['ka', 'ki'], 5)).toEqual(['ki', 'ka', 'ki', 'ka', 'ki']);
  });

  it('在沒有題目或題數無效時回傳空陣列', () => {
    expect(buildLoopedDeck([], 3)).toEqual([]);
    expect(buildLoopedDeck(['ka'], 0)).toEqual([]);
  });
});
