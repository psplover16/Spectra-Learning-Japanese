import { describe, expect, it } from 'vitest';
import { rawVocabularyEntries } from '@/modules/vocabulary/data/jpWords';

const expectedNaAdjectiveEntries = [
  { text: 'とくべつ', stage: 'Stage2_日常強化', meaning: '特別(な形容詞)' },
  { text: 'じゆう', stage: 'Stage2_日常強化', meaning: '自由(な形容詞)' },
  { text: 'たいせつ', stage: 'Stage2_日常強化', meaning: '重要(な形容詞)' },
  { text: 'かんたん', stage: 'Stage2_日常強化', meaning: '簡單(な形容詞)' },
  { text: 'きれい', stage: 'Stage2_日常強化', meaning: '漂亮／乾淨(な形容詞)' },
  { text: 'しずか', stage: 'Stage2_日常強化', meaning: '安靜(な形容詞)' },
  { text: 'にぎやか', stage: 'Stage2_日常強化', meaning: '熱鬧(な形容詞)' },
  { text: 'たいへんだ', stage: 'Stage2_日常強化', meaning: '糟糕／辛苦(な形容詞)' },
  { text: 'ひま', stage: 'Stage2_日常強化', meaning: '有空(な形容詞)' },
  { text: 'げんき', stage: 'Stage2_日常強化', meaning: '有精神(な形容詞)' },
  { text: 'ゆうめい', stage: 'Stage2_日常強化', meaning: '有名(な形容詞)' },
  { text: 'けんこう', stage: 'Stage2_日常強化', meaning: '健康(な形容詞)' },
  { text: 'だいじょうぶ', stage: 'Stage2_高頻會話', meaning: '沒問題(な形容詞)' },
  { text: 'むり', stage: 'Stage2_高頻會話', meaning: '不可能(な形容詞)' },
  { text: 'いちじてき', stage: 'Stage2_IT職場', meaning: '暫時的(な形容詞)' },
  { text: 'とくべつ', stage: 'Stage2_聊天曖昧', meaning: '特別(な形容詞)' },
  { text: 'たいせつ', stage: 'Stage2_聊天曖昧', meaning: '重要(な形容詞)' },
  { text: 'しあわせ', stage: 'Stage2_聊天曖昧', meaning: '幸福(な形容詞)' },
  { text: 'じゆう', stage: 'Stage3_抽象概念', meaning: '自由(な形容詞)' },
  { text: 'へいとう', stage: 'Stage3_抽象概念', meaning: '平等(な形容詞)' },
  { text: 'こうへい', stage: 'Stage3_抽象概念', meaning: '公平(な形容詞)' },
  { text: 'ふこうへい', stage: 'Stage3_抽象概念', meaning: '不公平(な形容詞)' },
  { text: 'じゆう', stage: 'Stage3_對立概念', meaning: '自由(な形容詞)' },
  { text: 'こうへい', stage: 'Stage3_對立概念', meaning: '公平(な形容詞)' },
  { text: 'ふこうへい', stage: 'Stage3_對立概念', meaning: '不公平(な形容詞)' },
  { text: 'むだ', stage: 'Stage3_對立概念', meaning: '浪費(な形容詞)' },
  { text: 'むこう', stage: 'Stage3_對立概念', meaning: '無效(な形容詞)' },
  { text: 'ふくざつ', stage: 'Stage3_形容詞對立', meaning: '複雜(な形容詞)' },
  { text: 'たんじゅん', stage: 'Stage3_形容詞對立', meaning: '單純(な形容詞)' },
  { text: 'こうりつてき', stage: 'Stage3_形容詞對立', meaning: '有效率的(な形容詞)' },
  { text: 'ひこうりつてき', stage: 'Stage3_形容詞對立', meaning: '沒效率的(な形容詞)' },
  { text: 'せいこうてき', stage: 'Stage3_形容詞對立', meaning: '成功的(な形容詞)' },
  { text: 'しっぱいてき', stage: 'Stage3_形容詞對立', meaning: '失敗的(な形容詞)' },
  { text: 'むだ', stage: 'Stage3_商務對立', meaning: '浪費(な形容詞)' },
  { text: 'ふあんてい', stage: 'Stage3_IT對立', meaning: '不穩定(な形容詞)' },
  { text: 'せいじょう', stage: 'Stage3_IT對立', meaning: '正常(な形容詞)' },
  { text: 'いじょう', stage: 'Stage3_IT對立', meaning: '異常(な形容詞)' },
  { text: 'こうりつてき', stage: 'Stage3_IT對立', meaning: '有效率的(な形容詞)' },
  { text: 'ひこうりつてき', stage: 'Stage3_IT對立', meaning: '沒效率的(な形容詞)' },
  { text: 'さいてき', stage: 'Stage3_IT對立', meaning: '最佳／最適(な形容詞)' },
  { text: 'ひさいてき', stage: 'Stage3_IT對立', meaning: '非最佳／未最適(な形容詞)' },
  { text: 'ゆうこう', stage: 'Stage3_IT對立', meaning: '有效(な形容詞)' },
  { text: 'むこう', stage: 'Stage3_IT對立', meaning: '無效(な形容詞)' },
  { text: 'ぐたいてき', stage: 'Stage4_抽象理論', meaning: '具體的(な形容詞)' },
  { text: 'ちゅうしょうてき', stage: 'Stage4_抽象理論', meaning: '抽象的(な形容詞)' },
  { text: 'がいねんてき', stage: 'Stage5_抽象核心', meaning: '概念性的(な形容詞)' },
];

describe('vocabulary na-adjective markers', () => {
  it('adds the な形容詞 marker to reviewed na-adjective entries in jpWords.ts', () => {
    for (const expectedEntry of expectedNaAdjectiveEntries) {
      const entry = rawVocabularyEntries.find(
        (candidate) => candidate.text === expectedEntry.text && candidate.stage === expectedEntry.stage,
      );

      expect(entry, `${expectedEntry.text} (${expectedEntry.stage}) should exist`).toBeDefined();
      expect(entry!.meaning).toBe(expectedEntry.meaning);
      expect(entry!.meaning.endsWith('(な形容詞)')).toBe(true);
    }
  });
});
