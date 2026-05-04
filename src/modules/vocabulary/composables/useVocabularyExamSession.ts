import { computed, ref, type ComputedRef, type Ref } from 'vue';
import { shuffleArray } from '@/shared/utils/questionDeck';
import type { VocabularyExamQuestionCard } from '@/modules/exam/types/exam';
import type { VocabularyEntry } from '@/modules/vocabulary/types/vocabulary';

export interface StartVocabularyExamInput {
  visibleEntries: VocabularyEntry[];
  persistedMarkedKeys: ReadonlySet<string>;
}

export interface VocabularyExamSession {
  isOpen: Ref<boolean>;
  currentIndex: Ref<number>;
  questions: Ref<VocabularyExamQuestionCard[]>;
  totalQuestions: ComputedRef<number>;
  currentQuestion: ComputedRef<VocabularyExamQuestionCard | null>;
  start: (input: StartVocabularyExamInput) => void;
  nextStep: () => void;
  markUnknown: () => void;
  confirmClose: () => void;
}

interface VocabularySense {
  kanji: string;
  meaning: string;
}

interface OriginalEntryState {
  markKey: string;
  checked: boolean;
}

function splitLines(value: string) {
  return value.split('\n').map((line) => line.trim());
}

function getVocabularySenses(entry: VocabularyEntry): VocabularySense[] {
  const kanjiLines = splitLines(entry.kanji);
  const meaningLines = splitLines(entry.meaning);

  return meaningLines.map((meaning, index) => ({
    kanji: kanjiLines[index] ?? '',
    meaning
  }));
}

function createPromptText(entry: VocabularyEntry, kanji: string) {
  return kanji ? `${entry.text}／${kanji}` : entry.text;
}

function createQuestionCards(entry: VocabularyEntry): VocabularyExamQuestionCard[] {
  const questionGroups = new Map<string, VocabularySense[]>();

  for (const sense of getVocabularySenses(entry)) {
    const groupKey = `${entry.text}\u0000${sense.kanji}`;
    const current = questionGroups.get(groupKey) ?? [];
    current.push(sense);
    questionGroups.set(groupKey, current);
  }

  return [...questionGroups.values()].map((senses, index) => {
    const firstSense = senses[0]!;
    const promptText = createPromptText(entry, firstSense.kanji);

    return {
      id: `${entry.markKey}__${index}`,
      markKey: entry.markKey,
      promptText,
      answerText: senses.map((sense) => sense.meaning).join('\n'),
      answerRevealed: false,
      unknownMarked: false,
      completed: false,
      result: null
    };
  });
}

export function useVocabularyExamSession(draftMarkedKeys: Ref<Set<string>>): VocabularyExamSession {
  const isOpen = ref(false);
  const currentIndex = ref(0);
  const questions = ref<VocabularyExamQuestionCard[]>([]);
  const originalEntryStates = ref<OriginalEntryState[]>([]);

  const totalQuestions = computed(() => questions.value.length);
  const currentQuestion = computed(() => questions.value[currentIndex.value] ?? null);

  function goToNextQuestion() {
    if (currentIndex.value >= questions.value.length - 1) {
      settle();
      return;
    }

    currentIndex.value += 1;
  }

  function recordAnswer(question: VocabularyExamQuestionCard, result: 'next' | 'unknown') {
    question.answerRevealed = true;
    question.completed = true;
    question.result = result;

    if (result === 'unknown') {
      question.unknownMarked = true;
    }
  }

  function settle() {
    const nextMarks = new Set(draftMarkedKeys.value);
    const questionsByMarkKey = new Map<string, VocabularyExamQuestionCard[]>();

    for (const question of questions.value) {
      const current = questionsByMarkKey.get(question.markKey) ?? [];
      current.push(question);
      questionsByMarkKey.set(question.markKey, current);
    }

    for (const originalState of originalEntryStates.value) {
      const entryQuestions = questionsByMarkKey.get(originalState.markKey) ?? [];
      const allAnsweredNext = entryQuestions.length > 0 && entryQuestions.every((question) => question.result === 'next');
      const anyUnknown = entryQuestions.some((question) => question.result === 'unknown');
      const allAnswered = entryQuestions.length > 0 && entryQuestions.every((question) => question.completed);

      if (allAnsweredNext) {
        nextMarks.delete(originalState.markKey);
      } else if (anyUnknown || !allAnswered || originalState.checked) {
        nextMarks.add(originalState.markKey);
      } else {
        nextMarks.delete(originalState.markKey);
      }
    }

    draftMarkedKeys.value = nextMarks;
    isOpen.value = false;
    currentIndex.value = 0;
    questions.value = [];
    originalEntryStates.value = [];
  }

  function start(input: StartVocabularyExamInput) {
    const checkedKeys = new Set([...draftMarkedKeys.value, ...input.persistedMarkedKeys]);
    const selectedEntries = input.visibleEntries.filter((entry) => checkedKeys.has(entry.markKey));

    originalEntryStates.value = selectedEntries.map((entry) => ({
      markKey: entry.markKey,
      checked: checkedKeys.has(entry.markKey)
    }));
    questions.value = shuffleArray(selectedEntries.flatMap(createQuestionCards));
    currentIndex.value = 0;
    isOpen.value = questions.value.length > 0;
  }

  function nextStep() {
    const question = currentQuestion.value;

    if (!question) {
      return;
    }

    if (!question.answerRevealed) {
      recordAnswer(question, 'next');
      return;
    }

    goToNextQuestion();
  }

  function markUnknown() {
    const question = currentQuestion.value;

    if (!question) {
      return;
    }

    if (!question.unknownMarked) {
      recordAnswer(question, 'unknown');
      return;
    }

    goToNextQuestion();
  }

  function confirmClose() {
    if (!isOpen.value) {
      return;
    }

    settle();
  }

  return {
    isOpen,
    currentIndex,
    questions,
    totalQuestions,
    currentQuestion,
    start,
    nextStep,
    markUnknown,
    confirmClose
  };
}
