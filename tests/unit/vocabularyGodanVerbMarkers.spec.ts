import { describe, expect, it } from 'vitest';
import { rawVocabularyEntries } from '@/modules/vocabulary/data/jpWords';

const expectedGodanEntries = [
  { text: 'かく', stage: 'N5', meaning: '寫(五段動詞)\n描繪(五段動詞)' },
  { text: 'かす', stage: 'N5', meaning: '渣／碎屑(名詞)\n借出(五段動詞)' },
  { text: 'さす', stage: 'N5', meaning: '刺／扎(五段動詞)' },
  { text: 'あるく', stage: 'N5', meaning: '走路(五段動詞)' },
  { text: 'かえる', stage: 'N5', meaning: '回家(五段動詞)\n改變' },
  { text: 'ある', stage: 'N5', meaning: '有(非生物)(五段動詞)' },
  { text: 'きく', stage: 'N5', meaning: '聽／問(五段動詞)' },
  { text: 'はなす', stage: 'N5', meaning: '說話(五段動詞)' },
  { text: 'よむ', stage: 'N5', meaning: '讀(五段動詞)' },
  { text: 'かう', stage: 'N5', meaning: '買／購買(五段動詞)' },
  { text: 'はらう', stage: 'N5', meaning: '付款(五段動詞)' },
  { text: 'もらう', stage: 'N5', meaning: '收到(五段動詞)' },
  { text: 'つかう', stage: 'N5', meaning: '使用(五段動詞)' },
  { text: 'つくる', stage: 'N5', meaning: '製作(五段動詞)' },
  { text: 'こわす', stage: 'N5', meaning: '弄壞(五段動詞)' },
  { text: 'のむ', stage: 'N5', meaning: '喝(五段動詞)' },
  { text: 'すわる', stage: 'N5', meaning: '坐下(五段動詞)' },
  { text: 'たつ', stage: 'N5', meaning: '站立(五段動詞)' },
  { text: 'やすむ', stage: 'N5', meaning: '休息(五段動詞)' },
  { text: 'つなぐ', stage: 'N5', meaning: '連接(五段動詞)' },
  { text: 'だす', stage: 'N5', meaning: '送出／拿出(五段動詞)' },
  { text: 'おくる', stage: 'N5', meaning: '送出(五段動詞)' },
  { text: 'うけとる', stage: 'N5', meaning: '接收(五段動詞)' },
  { text: 'ひらく', stage: 'N5', meaning: '打開(五段動詞)' },
  { text: 'おす', stage: 'N5', meaning: '按(五段動詞)' },
  { text: 'ひく', stage: 'N5', meaning: '拉(五段動詞)' },
  { text: 'うごく', stage: 'N5', meaning: '動(五段動詞)' },
  { text: 'とまる', stage: 'N5', meaning: '停止(五段動詞)' },
  { text: 'はじまる', stage: 'N5', meaning: '開始(自動)(五段動詞)' },
  { text: 'おわる', stage: 'N5', meaning: '結束(五段動詞)' },
  { text: 'もどる', stage: 'N5', meaning: '返回(五段動詞)' },
  { text: 'すすむ', stage: 'N5', meaning: '前進(五段動詞)' },
  { text: 'まつ', stage: 'N5', meaning: '等待(五段動詞)' },
  { text: 'えらぶ', stage: 'N5', meaning: '選擇(五段動詞)' },
  { text: 'なおる', stage: 'N5', meaning: '修好(自動)(五段動詞)' },
  { text: 'うごかす', stage: 'N5', meaning: '操作(五段動詞)' },
  { text: 'よびだす', stage: 'N5', meaning: '呼叫(函式)(五段動詞)' },
  { text: 'あらう', stage: 'N5', meaning: '洗(五段動詞)' },
  { text: 'なやむ', stage: 'N4', meaning: '煩惱(五段動詞)' },
  { text: 'おどろく', stage: 'N4', meaning: '驚訝(五段動詞)' },
  { text: 'わらう', stage: 'N4', meaning: '笑(五段動詞)' },
  { text: 'なく', stage: 'N4', meaning: '哭(五段動詞)' },
  { text: 'しかる', stage: 'N4', meaning: '責罵(五段動詞)' },
  { text: 'うたう', stage: 'N4', meaning: '唱歌(五段動詞)' },
  { text: 'おどる', stage: 'N4', meaning: '跳舞(五段動詞)' },
  { text: 'ちがう', stage: 'N4', meaning: '不同(五段動詞)' },
  { text: 'やくにたつ', stage: 'N4', meaning: '有幫助(五段動詞)' },
  { text: 'あまる', stage: 'N4', meaning: '剩下(五段動詞)' },
  { text: 'きになる', stage: 'N4', meaning: '在意／有好感(五段動詞)' },
  { text: 'きずつく', stage: 'N4', meaning: '受傷(情緒)(五段動詞)' },
  { text: 'えらぶ', stage: 'N3', meaning: '選擇(五段動詞)' },
  { text: 'のうりょくをのばす', stage: 'N3', meaning: '提升能力(五段動詞)' },
  { text: 'うたがう', stage: 'N3', meaning: '懷疑(五段動詞)' },
  { text: 'ふやす', stage: 'N3', meaning: '增加(他動)(五段動詞)' },
  { text: 'へらす', stage: 'N3', meaning: '減少(他動)(五段動詞)' },
  { text: 'あがる', stage: 'N3', meaning: '上升(自動)(五段動詞)' },
  { text: 'さがる', stage: 'N3', meaning: '下降(自動)(五段動詞)' },
  { text: 'はじまる', stage: 'N3', meaning: '開始(自動)(五段動詞)' },
  { text: 'おわる', stage: 'N3', meaning: '結束(自動)(五段動詞)' },
  { text: 'かくす', stage: 'N3', meaning: '隱藏(他動)(五段動詞)' },
  { text: 'あらわす', stage: 'N3', meaning: '表現／顯示(五段動詞)' },
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
      (candidate) => candidate.text === 'かえる' && candidate.stage === 'N5',
    );

    expect(entry).toBeDefined();
    expect(entry!.kanji).toBe('帰る\n変える');
    expect(entry!.meaning).toBe('回家(五段動詞)\n改變');
  });
});
