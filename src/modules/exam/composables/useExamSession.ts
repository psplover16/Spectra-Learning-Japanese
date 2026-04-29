import { computed, ref, type ComputedRef, type Ref } from 'vue';
import { buildLoopedDeck, shuffleArray } from '@/shared/utils/questionDeck';
import { clearLatestUnknownResults, readLatestUnknownResults, writeLatestUnknownResults } from '@/modules/exam/storage/latestUnknownResultStorage';
import type {
  ExamQuestionCard,
  LatestUnknownResultEntry,
  LatestUnknownResultSnapshot,
  StartExamInput
} from '@/modules/exam/types/exam';

export interface ExamSession {
  isOpen: Ref<boolean>;
  currentIndex: Ref<number>;
  totalQuestions: ComputedRef<number>;
  currentQuestion: ComputedRef<ExamQuestionCard | null>;
  latestUnknownSnapshot: Ref<LatestUnknownResultSnapshot | null>;
  start: (input: StartExamInput) => void;
  nextStep: () => void;
  markUnknown: () => void;
  confirmClose: () => void;
  clearLatestResults: () => void;
}

function createQuestionCards(input: StartExamInput): ExamQuestionCard[] {
  const cards: ExamQuestionCard[] = [];

  for (const kana of input.selectedKanaItems) {
    if (input.includeHiragana) {
      cards.push({
        id: `${kana.id}-hiragana`,
        kanaId: kana.id,
        script: 'hiragana',
        promptText: kana.hiragana,
        answerText: `${kana.romaji}（平假名）`,
        hintText: '按「下一步」顯示羅馬拼音',
        answerRevealed: false,
        unknownMarked: false,
        hiragana: kana.hiragana,
        katakana: kana.katakana,
        romaji: kana.romaji
      });
    }

    if (input.includeKatakana) {
      cards.push({
        id: `${kana.id}-katakana`,
        kanaId: kana.id,
        script: 'katakana',
        promptText: kana.katakana,
        answerText: `${kana.romaji}（片假名）`,
        hintText: '按「下一步」顯示羅馬拼音',
        answerRevealed: false,
        unknownMarked: false,
        hiragana: kana.hiragana,
        katakana: kana.katakana,
        romaji: kana.romaji
      });
    }
  }

  return buildLoopedDeck(shuffleArray(cards), input.questionCount);
}

export function createExamSession(): ExamSession {
  const isOpen = ref(false);
  const currentIndex = ref(0);
  const questionDeck = ref<ExamQuestionCard[]>([]);
  const latestUnknownSnapshot = ref<LatestUnknownResultSnapshot | null>(readLatestUnknownResults());
  const unknownMap = ref<Record<string, LatestUnknownResultEntry>>({});

  const totalQuestions = computed(() => questionDeck.value.length);
  const currentQuestion = computed(() => questionDeck.value[currentIndex.value] ?? null);

  function settle(): void {
    const results = Object.values(unknownMap.value).sort((left, right) => {
      if (right.count !== left.count) {
        return right.count - left.count;
      }

      return left.romaji.localeCompare(right.romaji);
    });

    const snapshot: LatestUnknownResultSnapshot = {
      updatedAt: new Date().toISOString(),
      totalUnknownCount: results.reduce((sum, item) => sum + item.count, 0),
      results
    };

    writeLatestUnknownResults(snapshot);
    latestUnknownSnapshot.value = snapshot;
    isOpen.value = false;
    currentIndex.value = 0;
    questionDeck.value = [];
    unknownMap.value = {};
  }

  function start(input: StartExamInput): void {
    questionDeck.value = createQuestionCards(input);
    currentIndex.value = 0;
    unknownMap.value = {};
    isOpen.value = questionDeck.value.length > 0;
  }

  function goToNextQuestion(): void {
    if (currentIndex.value >= questionDeck.value.length - 1) {
      settle();
      return;
    }

    currentIndex.value += 1;
  }

  function nextStep(): void {
    const question = currentQuestion.value;

    if (!question) {
      return;
    }

    if (!question.answerRevealed) {
      question.answerRevealed = true;
      question.hintText = '再按「下一步」進入下一題';
      return;
    }

    goToNextQuestion();
  }

  function markUnknown(): void {
    const question = currentQuestion.value;

    if (!question) {
      return;
    }

    if (!question.unknownMarked) {
      const existing = unknownMap.value[question.kanaId];
      unknownMap.value[question.kanaId] = {
        kanaId: question.kanaId,
        hiragana: question.hiragana,
        katakana: question.katakana,
        romaji: question.romaji,
        count: existing ? existing.count + 1 : 1
      };
      question.unknownMarked = true;
    }

    if (!question.answerRevealed) {
      question.answerRevealed = true;
      question.hintText = '再按「下一步」進入下一題';
      return;
    }

    goToNextQuestion();
  }

  function confirmClose(): void {
    if (!isOpen.value) {
      return;
    }

    settle();
  }

  function clearLatestResults(): void {
    clearLatestUnknownResults();
    latestUnknownSnapshot.value = null;
  }

  return {
    isOpen,
    currentIndex,
    totalQuestions,
    currentQuestion,
    latestUnknownSnapshot,
    start,
    nextStep,
    markUnknown,
    confirmClose,
    clearLatestResults
  };
}
