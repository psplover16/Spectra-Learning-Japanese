import { afterEach, describe, expect, it } from 'vitest';
import { grammarLevelOptions } from '@/modules/grammar/config/grammarLevels';
import {
  clearGrammarLevelPreference,
  grammarLevelStorageKey,
  readGrammarLevelPreference,
  writeGrammarLevelPreference
} from '@/modules/grammar/storage/grammarLevelStorage';

describe('grammar level storage', () => {
  afterEach(() => {
    clearGrammarLevelPreference();
  });

  it('只保存選定文法等級 value，不保存 label、route 或子列表狀態', () => {
    expect(writeGrammarLevelPreference('N1')).toBe(true);

    const rawValue = window.localStorage.getItem(grammarLevelStorageKey);
    expect(rawValue).not.toBeNull();
    expect(JSON.parse(rawValue ?? 'null')).toBe('N1');
    expect(rawValue).not.toContain('/n1-grammar');
    expect(rawValue).not.toContain('N1文法');
    expect(rawValue).not.toContain('open');
  });

  it('可還原合法的文法等級偏好', () => {
    window.localStorage.setItem(grammarLevelStorageKey, JSON.stringify('N1'));

    expect(readGrammarLevelPreference()).toBe('N1');
  });

  it('遇到未知等級時會清除記憶並回傳 null', () => {
    window.localStorage.setItem(grammarLevelStorageKey, JSON.stringify('N0'));

    expect(readGrammarLevelPreference()).toBeNull();
    expect(window.localStorage.getItem(grammarLevelStorageKey)).toBeNull();
  });

  it('遇到格式錯誤的 localStorage 內容時會清除記憶並回傳 null', () => {
    window.localStorage.setItem(grammarLevelStorageKey, '{bad-json');

    expect(readGrammarLevelPreference()).toBeNull();
    expect(window.localStorage.getItem(grammarLevelStorageKey)).toBeNull();
  });

  it('遇到目前設定中不存在對應 route 的等級時會清除記憶並回傳 null', () => {
    window.localStorage.setItem(grammarLevelStorageKey, JSON.stringify('N1'));

    expect(readGrammarLevelPreference(grammarLevelOptions.filter((option) => option.value !== 'N1'))).toBeNull();
    expect(window.localStorage.getItem(grammarLevelStorageKey)).toBeNull();
  });
});
