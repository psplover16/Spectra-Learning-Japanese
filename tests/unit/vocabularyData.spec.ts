import { describe, expect, it } from 'vitest';
import {
  rawVocabularyEntries,
  vocabularyEntries,
  vocabularyStageFiles,
  vocabularyStageGroups
} from './vocabularyStageTestData';

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
    meaning: '光滑（な形容詞）',
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
  it('依 JLPT stage 拆成五份資料檔，且每份只包含對應 stage', () => {
    expect(Object.fromEntries(Object.entries(vocabularyStageFiles).map(([stage, entries]) => [stage, entries.length]))).toEqual({
      N1: 31,
      N2: 106,
      N3: 155,
      N4: 293,
      N5: 363
    });

    for (const [stage, entries] of Object.entries(vocabularyStageFiles)) {
      expect(entries.every((entry) => entry.stage === stage)).toBe(true);
    }
  });

  it('只允許 JLPT N1 到 N5 作為 stage', () => {
    const rawStages = [...new Set(rawVocabularyEntries.map((entry) => entry.stage))];
    const normalizedStages = [...new Set(vocabularyEntries.map((entry) => entry.stage))];
    const groupedStages = vocabularyStageGroups.map((group) => group.stage);

    expect(rawStages.filter((stage) => !allowedJlptStages.has(stage))).toEqual([]);
    expect(normalizedStages.filter((stage) => !allowedJlptStages.has(stage))).toEqual([]);
    expect(groupedStages.filter((stage) => !allowedJlptStages.has(stage))).toEqual([]);
  });

  it('將字典正規化為穩定 id 與 stage 分組', () => {
    expect(rawVocabularyEntries).toHaveLength(948);
    expect(vocabularyEntries).toHaveLength(948);
    expect(vocabularyEntries[0]?.id).toBe(1);
    expect(vocabularyEntries.at(-1)?.id).toBe(948);
    expect(vocabularyStageGroups).toHaveLength(5);
    expect(vocabularyStageGroups.map((group) => group.stage)).toEqual(['N1', 'N2', 'N3', 'N4', 'N5']);
  });

  it('保留 v15 與 v16 指定詞條，並將 N5 から 放在 N5 stage 檔尾端', () => {
    const n5Entries = vocabularyStageFiles.N5;

    expect(rawVocabularyEntries).toEqual(expect.arrayContaining([...expectedTailEntries, ...expectedV16Entries]));
    expect(n5Entries.at(-1)).toMatchObject({
      text: 'から',
      romanization: 'ka-ra',
      kanji: '殻\n空',
      meaning: '外殼\n空(無內容)\n從～、因為～；助詞',
      stage: 'N5'
    });
  });

  it('沿用既有 話す -> 說話（五段動詞） 覆蓋，且不為說話新增重複詞條', () => {
    const speakingEntries = rawVocabularyEntries.filter((entry) => entry.meaning === '說話（五段動詞）');

    expect(speakingEntries).toHaveLength(1);
    expect(speakingEntries[0]).toMatchObject({
      text: 'はなす',
      kanji: '話す',
      meaning: '說話（五段動詞）',
      stage: 'N5'
    });
    expect(rawVocabularyEntries.filter((entry) => entry.kanji === '肌' && entry.meaning === '皮膚')).toHaveLength(1);
    expect(rawVocabularyEntries.filter((entry) => entry.kanji === '滑らか' && entry.meaning === '光滑（な形容詞）')).toHaveLength(1);
    expect(rawVocabularyEntries.filter((entry) => entry.kanji === '動き' && entry.meaning === '動作')).toHaveLength(1);
    expect(rawVocabularyEntries.filter((entry) => entry.kanji === '居酒屋' && entry.meaning === '居酒屋')).toHaveLength(1);
  });

  it('新增詞條若屬動詞或形容詞，meaning 必須附上既有格式的詞性標記', () => {
    const partOfSpeechMarkerPattern = /（(五段動詞|一段動詞|な形容詞|い形容詞)）$/;

    expect(rawVocabularyEntries.find((entry) => entry.kanji === '滑らか')?.meaning).toBe('光滑（な形容詞）');
    expect(rawVocabularyEntries.find((entry) => entry.kanji === '滑らか')?.meaning).toMatch(partOfSpeechMarkerPattern);
    expect(rawVocabularyEntries.find((entry) => entry.kanji === '肌')?.meaning).toBe('皮膚');
    expect(rawVocabularyEntries.find((entry) => entry.kanji === '動き')?.meaning).toBe('動作');
    expect(rawVocabularyEntries.find((entry) => entry.kanji === '居酒屋')?.meaning).toBe('居酒屋');
  });

  it('v16 方位詞與補充詞條各自唯一存在', () => {
    for (const entry of expectedV16Entries) {
      expect(rawVocabularyEntries.filter((item) => item.kanji === entry.kanji && item.text === entry.text)).toHaveLength(1);
      expect(vocabularyEntries.filter((item) => item.kanji === entry.kanji && item.text === entry.text)).toHaveLength(1);
    }
  });

  it('あげる 整併到最簡單 stage 並保留所有上げる義項', () => {
    const ageruEntries = rawVocabularyEntries.filter((entry) => entry.text === 'あげる');

    expect(ageruEntries).toHaveLength(1);
    expect(ageruEntries[0]).toMatchObject({
      kanji: '上げる\n上げる\n上げる\n挙げる\n揚げる',
      meaning: '提高（一段動詞；他動詞）\n給（一段動詞）\n舉起（一段動詞）\n列舉／舉例（一段動詞）\n油炸（一段動詞）',
      stage: 'N5'
    });
  });
});
