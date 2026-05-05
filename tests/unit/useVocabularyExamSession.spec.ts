import { describe, expect, it } from 'vitest';
import { ref } from 'vue';
import { readLatestUnknownResults, writeLatestUnknownResults } from '@/modules/exam/storage/latestUnknownResultStorage';
import { useVocabularyExamSession } from '@/modules/vocabulary/composables/useVocabularyExamSession';
import { normalizeVocabularyEntries } from '@/modules/vocabulary/utils/vocabularyFilters';
import type { RawVocabularyEntry } from '@/modules/vocabulary/types/vocabulary';

const rawEntries: RawVocabularyEntry[] = [
  { text: 'あさ', romanization: 'a-sa', kanji: '朝', meaning: '早上', stage: 'N5' },
  { text: 'あい', romanization: 'a-i', kanji: '愛', meaning: '愛', stage: 'N5' },
  {
    text: 'から',
    romanization: 'ka-ra',
    kanji: '殻\n空',
    meaning: '外殼\n空(無內容)\n從～、因為～；助詞',
    stage: 'N5'
  },
  {
    text: 'あげる',
    romanization: 'a-ge-ru',
    kanji: '上げる\n上げる\n上げる\n挙げる\n揚げる',
    meaning: '提高（一段動詞；他動詞）\n給（一段動詞）\n舉起（一段動詞）\n列舉／舉例（一段動詞）\n油炸（一段動詞）',
    stage: 'N5'
  }
];

function createSession(markedKeys: Iterable<string>) {
  const draftMarkedKeys = ref(new Set(markedKeys));
  const session = useVocabularyExamSession(draftMarkedKeys);

  return { draftMarkedKeys, session };
}

function answerCurrentWithNext(session: ReturnType<typeof useVocabularyExamSession>) {
  session.nextStep();
  session.nextStep();
}

function answerCurrentWithUnknown(session: ReturnType<typeof useVocabularyExamSession>) {
  session.markUnknown();
  session.nextStep();
}

describe('useVocabularyExamSession', () => {
  it('只從 visible 且 draft 或 persisted 已勾選的單字建立 snapshot', () => {
    const entries = normalizeVocabularyEntries(rawEntries.slice(0, 2));
    const { session } = createSession([entries[1]!.markKey]);

    session.start({
      visibleEntries: entries,
      persistedMarkedKeys: new Set()
    });

    expect(session.isOpen.value).toBe(true);
    expect(session.questions.value).toHaveLength(1);
    expect(session.questions.value[0]?.markKey).toBe(entries[1]!.markKey);
    expect(session.questions.value[0]?.promptText).toBe('あい／愛');
  });

  it('排除不在 visibleEntries 內的已勾選單字', () => {
    const entries = normalizeVocabularyEntries(rawEntries.slice(0, 2));
    const { session } = createSession([entries[1]!.markKey]);

    session.start({
      visibleEntries: [entries[0]!],
      persistedMarkedKeys: new Set([entries[1]!.markKey])
    });

    expect(session.isOpen.value).toBe(false);
    expect(session.questions.value).toEqual([]);
  });

  it('將 から 展成三題，並將 あげる／上げる 合併為一題多行答案', () => {
    const entries = normalizeVocabularyEntries(rawEntries.slice(2));
    const { session } = createSession(entries.map((entry) => entry.markKey));

    session.start({
      visibleEntries: entries,
      persistedMarkedKeys: new Set()
    });

    const questionsByPrompt = new Map(session.questions.value.map((question) => [question.promptText, question]));

    expect([...questionsByPrompt.keys()].sort()).toEqual([
      'あげる／上げる',
      'あげる／挙げる',
      'あげる／揚げる',
      'から',
      'から／殻',
      'から／空'
    ]);
    expect(questionsByPrompt.get('から／殻')?.answerText).toBe('外殼');
    expect(questionsByPrompt.get('から／空')?.answerText).toBe('空(無內容)');
    expect(questionsByPrompt.get('から')?.answerText).toBe('從～、因為～；助詞');
    expect(questionsByPrompt.get('あげる／上げる')?.answerText).toBe(
      '提高（一段動詞；他動詞）\n給（一段動詞）\n舉起（一段動詞）'
    );
  });

  it('所有題目都以下一步作答時移除該 entry 的 draft mark', () => {
    const [entry] = normalizeVocabularyEntries([rawEntries[2]!]);
    const { draftMarkedKeys, session } = createSession([entry!.markKey]);

    session.start({
      visibleEntries: [entry!],
      persistedMarkedKeys: new Set()
    });

    while (session.isOpen.value) {
      answerCurrentWithNext(session);
    }

    expect(draftMarkedKeys.value.has(entry!.markKey)).toBe(false);
  });

  it('任一題標記我不清楚時保留該 entry 的 draft mark', () => {
    const [entry] = normalizeVocabularyEntries([rawEntries[2]!]);
    const { draftMarkedKeys, session } = createSession([entry!.markKey]);

    session.start({
      visibleEntries: [entry!],
      persistedMarkedKeys: new Set()
    });

    answerCurrentWithUnknown(session);

    while (session.isOpen.value) {
      answerCurrentWithNext(session);
    }

    expect(draftMarkedKeys.value.has(entry!.markKey)).toBe(true);
  });

  it('中途關閉時未答題保持開始測驗時的勾選狀態', () => {
    const [entry] = normalizeVocabularyEntries([rawEntries[2]!]);
    const { draftMarkedKeys, session } = createSession([]);

    session.start({
      visibleEntries: [entry!],
      persistedMarkedKeys: new Set([entry!.markKey])
    });

    session.confirmClose();

    expect(draftMarkedKeys.value.has(entry!.markKey)).toBe(true);
  });

  it('單字測驗結算不更新字母測驗 latest unknown storage', () => {
    writeLatestUnknownResults({
      updatedAt: '2026-05-04T00:00:00.000Z',
      totalUnknownCount: 1,
      results: [{ kanaId: 'tableA-a', hiragana: 'あ', katakana: 'ア', romaji: 'a', count: 1 }]
    });
    const [entry] = normalizeVocabularyEntries([rawEntries[0]!]);
    const { session } = createSession([entry!.markKey]);

    session.start({
      visibleEntries: [entry!],
      persistedMarkedKeys: new Set()
    });
    answerCurrentWithUnknown(session);

    expect(readLatestUnknownResults()).toMatchObject({
      totalUnknownCount: 1,
      results: [{ kanaId: 'tableA-a', count: 1 }]
    });
  });
});
