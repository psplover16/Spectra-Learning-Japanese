import { describe, expect, it } from 'vitest';
import { rawVocabularyEntries } from './vocabularyStageTestData';

const expectedNaAdjectiveEntries = [
  { text: 'とくべつ', stage: 'N4', meaning: '特別（な形容詞）' },
  { text: 'じゆう', stage: 'N4', meaning: '自由（な形容詞）' },
  { text: 'たいせつ', stage: 'N4', meaning: '重要（な形容詞）' },
  { text: 'かんたん', stage: 'N4', meaning: '簡單（な形容詞）' },
  { text: 'きれい', stage: 'N4', meaning: '漂亮／乾淨（な形容詞）' },
  { text: 'しずか', stage: 'N4', meaning: '安靜（な形容詞）' },
  { text: 'にぎやか', stage: 'N4', meaning: '熱鬧（な形容詞）' },
  { text: 'たいへんだ', stage: 'N4', meaning: '糟糕／辛苦（な形容詞）' },
  { text: 'ひま', stage: 'N4', meaning: '有空（な形容詞）' },
  { text: 'げんき', stage: 'N4', meaning: '有精神（な形容詞）' },
  { text: 'ゆうめい', stage: 'N4', meaning: '有名（な形容詞）' },
  { text: 'けんこう', stage: 'N4', meaning: '健康（な形容詞）' },
  { text: 'だいじょうぶ', stage: 'N4', meaning: '沒問題（な形容詞）' },
  { text: 'むり', stage: 'N4', meaning: '不可能（な形容詞）' },
  { text: 'いちじてき', stage: 'N4', meaning: '暫時的（な形容詞）' },
  { text: 'とくべつ', stage: 'N4', meaning: '特別（な形容詞）' },
  { text: 'たいせつ', stage: 'N4', meaning: '重要（な形容詞）' },
  { text: 'しあわせ', stage: 'N4', meaning: '幸福（な形容詞）' },
  { text: 'じゆう', stage: 'N3', meaning: '自由（な形容詞）' },
  { text: 'へいとう', stage: 'N3', meaning: '平等（な形容詞）' },
  { text: 'こうへい', stage: 'N3', meaning: '公平（な形容詞）' },
  { text: 'ふこうへい', stage: 'N3', meaning: '不公平（な形容詞）' },
  { text: 'じゆう', stage: 'N3', meaning: '自由（な形容詞）' },
  { text: 'こうへい', stage: 'N3', meaning: '公平（な形容詞）' },
  { text: 'ふこうへい', stage: 'N3', meaning: '不公平（な形容詞）' },
  { text: 'むだ', stage: 'N3', meaning: '浪費（な形容詞）' },
  { text: 'むこう', stage: 'N3', meaning: '無效（な形容詞）' },
  { text: 'ふくざつ', stage: 'N3', meaning: '複雜（な形容詞）' },
  { text: 'たんじゅん', stage: 'N3', meaning: '單純（な形容詞）' },
  { text: 'こうりつてき', stage: 'N3', meaning: '有效率的（な形容詞）' },
  { text: 'ひこうりつてき', stage: 'N3', meaning: '沒效率的（な形容詞）' },
  { text: 'せいこうてき', stage: 'N3', meaning: '成功的（な形容詞）' },
  { text: 'しっぱいてき', stage: 'N3', meaning: '失敗的（な形容詞）' },
  { text: 'むだ', stage: 'N3', meaning: '浪費（な形容詞）' },
  { text: 'ふあんてい', stage: 'N3', meaning: '不穩定（な形容詞）' },
  { text: 'せいじょう', stage: 'N3', meaning: '正常（な形容詞）' },
  { text: 'いじょう', stage: 'N3', meaning: '異常（な形容詞）' },
  { text: 'こうりつてき', stage: 'N3', meaning: '有效率的（な形容詞）' },
  { text: 'ひこうりつてき', stage: 'N3', meaning: '沒效率的（な形容詞）' },
  { text: 'さいてき', stage: 'N3', meaning: '最佳／最適（な形容詞）' },
  { text: 'ひさいてき', stage: 'N3', meaning: '非最佳／未最適（な形容詞）' },
  { text: 'ゆうこう', stage: 'N3', meaning: '有效（な形容詞）' },
  { text: 'むこう', stage: 'N3', meaning: '無效（な形容詞）' },
  { text: 'ぐたいてき', stage: 'N2', meaning: '具體的（な形容詞）' },
  { text: 'ちゅうしょうてき', stage: 'N2', meaning: '抽象的（な形容詞）' },
  { text: 'がいねんてき', stage: 'N1', meaning: '概念性的（な形容詞）' },
];

describe('vocabulary na-adjective markers', () => {
  it('adds the な形容詞 marker to reviewed na-adjective entries in stage data files', () => {
    for (const expectedEntry of expectedNaAdjectiveEntries) {
      const entry = rawVocabularyEntries.find(
        (candidate) => candidate.text === expectedEntry.text && candidate.meaning.split('\n').includes(expectedEntry.meaning),
      );

      expect(entry, `${expectedEntry.text} (${expectedEntry.stage}) should exist`).toBeDefined();
      expect(expectedEntry.meaning.endsWith('（な形容詞）')).toBe(true);
      expect(entry!.meaning).toContain(expectedEntry.meaning);
    }
  });
});
