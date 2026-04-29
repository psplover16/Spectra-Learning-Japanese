import { beforeEach, describe, expect, it } from 'vitest';
import {
  clearLatestUnknownResults,
  readLatestUnknownResults,
  writeLatestUnknownResults,
  latestUnknownResultsStorageKey
} from '@/modules/exam/storage/latestUnknownResultStorage';

describe('latestUnknownResultStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('可寫入並讀回最近一次結果', () => {
    writeLatestUnknownResults({
      updatedAt: '2026-03-23T00:00:00.000Z',
      totalUnknownCount: 2,
      results: [
        {
          kanaId: 'tableA-ka',
          hiragana: 'か',
          katakana: 'カ',
          romaji: 'ka',
          count: 2
        }
      ]
    });

    expect(readLatestUnknownResults()?.results[0]?.romaji).toBe('ka');
  });

  it('無效資料會被自動清除', () => {
    window.localStorage.setItem(latestUnknownResultsStorageKey, '{"broken":true}');

    expect(readLatestUnknownResults()).toBeNull();
    expect(window.localStorage.getItem(latestUnknownResultsStorageKey)).toBeNull();
  });

  it('可清除最近一次結果', () => {
    writeLatestUnknownResults({
      updatedAt: '2026-03-23T00:00:00.000Z',
      totalUnknownCount: 1,
      results: []
    });

    clearLatestUnknownResults();

    expect(readLatestUnknownResults()).toBeNull();
  });
});
