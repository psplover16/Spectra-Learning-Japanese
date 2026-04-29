import { describe, expect, it } from 'vitest';
import { rawVocabularyEntries } from '@/modules/vocabulary/data/jpWords';

const expectedGodanEntries = [
  { text: 'かく', stage: 'Stage1_基礎生活', meaning: '寫(五段動詞)\n描繪(五段動詞)' },
  { text: 'かす', stage: 'Stage1_基礎生活', meaning: '渣／碎屑(名詞)\n借出(五段動詞)' },
  { text: 'さす', stage: 'Stage1_基礎生活', meaning: '刺／扎(五段動詞)' },
  { text: 'あるく', stage: 'Stage1_基礎生活', meaning: '走路(五段動詞)' },
  { text: 'かえる', stage: 'Stage1_基礎生活', meaning: '回家(五段動詞)\n改變' },
  { text: 'ある', stage: 'Stage1_基礎生活', meaning: '有(非生物)(五段動詞)' },
  { text: 'きく', stage: 'Stage1_基礎生活', meaning: '聽／問(五段動詞)' },
  { text: 'はなす', stage: 'Stage1_基礎生活', meaning: '說話(五段動詞)' },
  { text: 'よむ', stage: 'Stage1_基礎生活', meaning: '讀(五段動詞)' },
  { text: 'かう', stage: 'Stage1_基礎生活', meaning: '買／購買(五段動詞)' },
  { text: 'はらう', stage: 'Stage1_基礎生活', meaning: '付款(五段動詞)' },
  { text: 'もらう', stage: 'Stage1_基礎生活', meaning: '收到(五段動詞)' },
  { text: 'つかう', stage: 'Stage1_基礎生活', meaning: '使用(五段動詞)' },
  { text: 'つくる', stage: 'Stage1_基礎生活', meaning: '製作(五段動詞)' },
  { text: 'こわす', stage: 'Stage1_基礎生活', meaning: '弄壞(五段動詞)' },
  { text: 'のむ', stage: 'Stage1_基礎生活', meaning: '喝(五段動詞)' },
  { text: 'すわる', stage: 'Stage1_基礎生活', meaning: '坐下(五段動詞)' },
  { text: 'たつ', stage: 'Stage1_基礎生活', meaning: '站立(五段動詞)' },
  { text: 'やすむ', stage: 'Stage1_基礎生活', meaning: '休息(五段動詞)' },
  { text: 'つなぐ', stage: 'Stage1_基礎生活', meaning: '連接(五段動詞)' },
  { text: 'だす', stage: 'Stage1_基礎生活', meaning: '送出／拿出(五段動詞)' },
  { text: 'おくる', stage: 'Stage1_基礎生活', meaning: '送出(五段動詞)' },
  { text: 'うけとる', stage: 'Stage1_基礎生活', meaning: '接收(五段動詞)' },
  { text: 'ひらく', stage: 'Stage1_基礎生活', meaning: '打開(五段動詞)' },
  { text: 'おす', stage: 'Stage1_基礎生活', meaning: '按(五段動詞)' },
  { text: 'ひく', stage: 'Stage1_基礎生活', meaning: '拉(五段動詞)' },
  { text: 'うごく', stage: 'Stage1_基礎生活', meaning: '動(五段動詞)' },
  { text: 'とまる', stage: 'Stage1_基礎生活', meaning: '停止(五段動詞)' },
  { text: 'はじまる', stage: 'Stage1_基礎生活', meaning: '開始(自動)(五段動詞)' },
  { text: 'おわる', stage: 'Stage1_基礎生活', meaning: '結束(五段動詞)' },
  { text: 'もどる', stage: 'Stage1_基礎生活', meaning: '返回(五段動詞)' },
  { text: 'すすむ', stage: 'Stage1_基礎生活', meaning: '前進(五段動詞)' },
  { text: 'まつ', stage: 'Stage1_基礎生活', meaning: '等待(五段動詞)' },
  { text: 'えらぶ', stage: 'Stage1_基礎生活', meaning: '選擇(五段動詞)' },
  { text: 'なおる', stage: 'Stage1_基礎生活', meaning: '修好(自動)(五段動詞)' },
  { text: 'うごかす', stage: 'Stage1_基礎生活', meaning: '操作(五段動詞)' },
  { text: 'よびだす', stage: 'Stage1_基礎生活', meaning: '呼叫(函式)(五段動詞)' },
  { text: 'あらう', stage: 'Stage1_基礎生活', meaning: '洗(五段動詞)' },
  { text: 'なやむ', stage: 'Stage2_日常強化', meaning: '煩惱(五段動詞)' },
  { text: 'おどろく', stage: 'Stage2_日常強化', meaning: '驚訝(五段動詞)' },
  { text: 'わらう', stage: 'Stage2_日常強化', meaning: '笑(五段動詞)' },
  { text: 'なく', stage: 'Stage2_日常強化', meaning: '哭(五段動詞)' },
  { text: 'しかる', stage: 'Stage2_日常強化', meaning: '責罵(五段動詞)' },
  { text: 'うたう', stage: 'Stage2_日常強化', meaning: '唱歌(五段動詞)' },
  { text: 'おどる', stage: 'Stage2_日常強化', meaning: '跳舞(五段動詞)' },
  { text: 'ちがう', stage: 'Stage2_日常強化', meaning: '不同(五段動詞)' },
  { text: 'やくにたつ', stage: 'Stage2_高頻會話', meaning: '有幫助(五段動詞)' },
  { text: 'あまる', stage: 'Stage2_高頻會話', meaning: '剩下(五段動詞)' },
  { text: 'きになる', stage: 'Stage2_聊天曖昧', meaning: '在意／有好感(五段動詞)' },
  { text: 'きずつく', stage: 'Stage2_聊天曖昧', meaning: '受傷(情緒)(五段動詞)' },
  { text: 'えらぶ', stage: 'Stage3_抽象動詞', meaning: '選擇(五段動詞)' },
  { text: 'のうりょくをのばす', stage: 'Stage3_抽象動詞', meaning: '提升能力(五段動詞)' },
  { text: 'うたがう', stage: 'Stage3_抽象動詞', meaning: '懷疑(五段動詞)' },
  { text: 'ふやす', stage: 'Stage3_動詞對立', meaning: '增加(他動)(五段動詞)' },
  { text: 'へらす', stage: 'Stage3_動詞對立', meaning: '減少(他動)(五段動詞)' },
  { text: 'あがる', stage: 'Stage3_動詞對立', meaning: '上升(自動)(五段動詞)' },
  { text: 'さがる', stage: 'Stage3_動詞對立', meaning: '下降(自動)(五段動詞)' },
  { text: 'はじまる', stage: 'Stage3_動詞對立', meaning: '開始(自動)(五段動詞)' },
  { text: 'おわる', stage: 'Stage3_動詞對立', meaning: '結束(自動)(五段動詞)' },
  { text: 'かくす', stage: 'Stage3_動詞對立', meaning: '隱藏(他動)(五段動詞)' },
  { text: 'あらわす', stage: 'Stage3_動詞對立', meaning: '表現／顯示(五段動詞)' },
];

describe('vocabulary godan verb markers', () => {
  it('adds the 五段動詞 marker to reviewed godan verb entries in jpWords.ts', () => {
    for (const expectedEntry of expectedGodanEntries) {
      const entry = rawVocabularyEntries.find(
        (candidate) => candidate.text === expectedEntry.text && candidate.stage === expectedEntry.stage,
      );

      expect(entry, `${expectedEntry.text} (${expectedEntry.stage}) should exist`).toBeDefined();
      expect(entry!.meaning).toBe(expectedEntry.meaning);
      expect(entry!.meaning).toContain('(五段動詞)');
    }
  });

  it('keeps the mixed かえる entry marker in meaning instead of the kanji field', () => {
    const entry = rawVocabularyEntries.find(
      (candidate) => candidate.text === 'かえる' && candidate.stage === 'Stage1_基礎生活',
    );

    expect(entry).toBeDefined();
    expect(entry!.kanji).toBe('帰る\n変える');
    expect(entry!.meaning).toBe('回家(五段動詞)\n改變');
  });
});
