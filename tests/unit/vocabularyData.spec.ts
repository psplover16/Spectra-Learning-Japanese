import { describe, expect, it } from 'vitest';
import { rawVocabularyEntries, vocabularyEntries, vocabularyStageGroups } from '@/modules/vocabulary/data/jpWords';

const allowedJlptStages = new Set(['N1', 'N2', 'N3', 'N4', 'N5']);

const expectedTailEntries = [
  {
    text: 'はだ',
    romanization: 'ha-da',
    kanji: '肌',
    meaning: '皮膚',
    stage: 'N5'
  },
  {
    text: 'なめらか',
    romanization: 'na-me-ra-ka',
    kanji: '滑らか',
    meaning: '光滑(な形容詞)',
    stage: 'N4'
  },
  {
    text: 'うごき',
    romanization: 'u-go-ki',
    kanji: '動き',
    meaning: '動作',
    stage: 'N4'
  },
  {
    text: 'いざかや',
    romanization: 'i-za-ka-ya',
    kanji: '居酒屋',
    meaning: '居酒屋',
    stage: 'N5'
  }
];

const expectedV16Entries = [
  {
    text: 'たばこ',
    romanization: 'ta-ba-ko',
    kanji: '煙草',
    meaning: '香菸',
    stage: 'N5'
  },
  {
    text: 'しょくじかい',
    romanization: 'sho-ku-ji-ka-i',
    kanji: '食事会',
    meaning: '餐會／聚餐',
    stage: 'N4'
  },
  {
    text: 'ひがしぐち',
    romanization: 'hi-ga-shi-gu-chi',
    kanji: '東口',
    meaning: '東口／東邊出口',
    stage: 'N5'
  },
  {
    text: 'にしぐち',
    romanization: 'ni-shi-gu-chi',
    kanji: '西口',
    meaning: '西口／西邊出口',
    stage: 'N5'
  },
  {
    text: 'きたぐち',
    romanization: 'ki-ta-gu-chi',
    kanji: '北口',
    meaning: '北口／北邊出口',
    stage: 'N5'
  },
  {
    text: 'みなみぐち',
    romanization: 'mi-na-mi-gu-chi',
    kanji: '南口',
    meaning: '南口／南邊出口',
    stage: 'N5'
  }
];

describe('vocabulary data', () => {
  it('只允許 JLPT N1 到 N5 作為 stage', () => {
    const rawStages = [...new Set(rawVocabularyEntries.map((entry) => entry.stage))];
    const normalizedStages = [...new Set(vocabularyEntries.map((entry) => entry.stage))];
    const groupedStages = vocabularyStageGroups.map((group) => group.stage);

    expect(rawStages.filter((stage) => !allowedJlptStages.has(stage))).toEqual([]);
    expect(normalizedStages.filter((stage) => !allowedJlptStages.has(stage))).toEqual([]);
    expect(groupedStages.filter((stage) => !allowedJlptStages.has(stage))).toEqual([]);
  });

  it('將字典正規化為穩定 id 與 stage 分組', () => {
    expect(rawVocabularyEntries).toHaveLength(1086);
    expect(vocabularyEntries).toHaveLength(1086);
    expect(vocabularyEntries[0]?.id).toBe(1);
    expect(vocabularyEntries[1075]).toMatchObject({
      id: 1076,
      text: 'がいねんてき',
      kanji: '概念的',
      meaning: '概念性的(な形容詞)',
      stage: 'N1'
    });
    expect(vocabularyEntries.at(-1)?.id).toBe(1086);
    expect(vocabularyStageGroups).toHaveLength(5);
    expect(vocabularyStageGroups[0]?.stage).toBe('N5');
    expect(vocabularyStageGroups.at(-1)?.stage).toBe('N1');
  });

  it('只在字典檔尾端追加 v15 與 v16 指定詞條，且不改動既有尾端資料', () => {
    expect(rawVocabularyEntries.at(-11)).toMatchObject({
      text: 'がいねんてき',
      romanization: 'ga-i-nen-te-ki',
      kanji: '概念的',
      meaning: '概念性的(な形容詞)',
      stage: 'N1'
    });
    expect(rawVocabularyEntries.slice(-10, -6)).toEqual(expectedTailEntries);
    expect(rawVocabularyEntries.slice(-6)).toEqual(expectedV16Entries);
    expect(vocabularyEntries.slice(-10, -6)).toMatchObject([
      { id: 1077, ...expectedTailEntries[0] },
      { id: 1078, ...expectedTailEntries[1] },
      { id: 1079, ...expectedTailEntries[2] },
      { id: 1080, ...expectedTailEntries[3] }
    ]);
    expect(vocabularyEntries.slice(-6)).toMatchObject([
      { id: 1081, ...expectedV16Entries[0] },
      { id: 1082, ...expectedV16Entries[1] },
      { id: 1083, ...expectedV16Entries[2] },
      { id: 1084, ...expectedV16Entries[3] },
      { id: 1085, ...expectedV16Entries[4] },
      { id: 1086, ...expectedV16Entries[5] }
    ]);
  });

  it('沿用既有 話す -> 說話(五段動詞) 覆蓋，且不為說話新增重複詞條', () => {
    const speakingEntries = rawVocabularyEntries.filter((entry) => entry.meaning === '說話(五段動詞)');

    expect(speakingEntries).toHaveLength(1);
    expect(speakingEntries[0]).toMatchObject({
      text: 'はなす',
      kanji: '話す',
      meaning: '說話(五段動詞)',
      stage: 'N5'
    });
    expect(rawVocabularyEntries.filter((entry) => entry.kanji === '肌' && entry.meaning === '皮膚')).toHaveLength(1);
    expect(rawVocabularyEntries.filter((entry) => entry.kanji === '滑らか' && entry.meaning === '光滑(な形容詞)')).toHaveLength(1);
    expect(rawVocabularyEntries.filter((entry) => entry.kanji === '動き' && entry.meaning === '動作')).toHaveLength(1);
    expect(rawVocabularyEntries.filter((entry) => entry.kanji === '居酒屋' && entry.meaning === '居酒屋')).toHaveLength(1);
  });

  it('新增詞條若屬動詞或形容詞，meaning 必須附上既有格式的詞性標記', () => {
    const appendedEntries = rawVocabularyEntries.slice(-10);
    const partOfSpeechMarkerPattern = /\((五段動詞|一段動詞|な形容詞|い形容詞)\)$/;

    expect(appendedEntries.find((entry) => entry.kanji === '滑らか')?.meaning).toBe('光滑(な形容詞)');
    expect(appendedEntries.find((entry) => entry.kanji === '滑らか')?.meaning).toMatch(partOfSpeechMarkerPattern);
    expect(appendedEntries.find((entry) => entry.kanji === '肌')?.meaning).toBe('皮膚');
    expect(appendedEntries.find((entry) => entry.kanji === '動き')?.meaning).toBe('動作');
    expect(appendedEntries.find((entry) => entry.kanji === '居酒屋')?.meaning).toBe('居酒屋');
  });

  it('v16 方位詞與補充詞條各自唯一存在', () => {
    for (const entry of expectedV16Entries) {
      expect(rawVocabularyEntries.filter((item) => item.kanji === entry.kanji && item.text === entry.text)).toHaveLength(1);
      expect(vocabularyEntries.filter((item) => item.kanji === entry.kanji && item.text === entry.text)).toHaveLength(1);
    }
  });
});
