# vocabulary-quiz Specification

## Purpose

TBD - created by archiving change 'vocabulary-quiz-feature'. Update Purpose after archive.

## Requirements

### Requirement: Vocabulary quiz starts from visible marked vocabulary

The vocabulary practice page SHALL provide a start-quiz control beside the save-marks control. The control SHALL be enabled only when at least one currently visible vocabulary row is marked in either the draft mark set or the persisted mark set. The quiz deck SHALL be created from a snapshot of currently visible marked vocabulary entries at the moment the quiz starts.

#### Scenario: Start quiz is disabled with no visible marked entries

- **WHEN** the vocabulary practice page has no visible row whose mark checkbox is checked
- **THEN** the start-quiz control is disabled

#### Scenario: Start quiz uses visible marked entries

- **WHEN** entries `あさ(stage=N5)` and `あい(stage=N5)` are visible
- **AND** only `あい` has a checked mark checkbox from draft or persisted marks
- **AND** the user starts the vocabulary quiz
- **THEN** the quiz deck is built from `あい`
- **AND** the quiz deck excludes `あさ`

#### Scenario: Hidden marked entries are excluded

- **WHEN** entry `あい(stage=N5)` is marked
- **AND** the `N5` level is not selected, so `あい` is not visible
- **AND** the user starts the vocabulary quiz
- **THEN** `あい` is excluded from the quiz deck


<!-- @trace
source: vocabulary-quiz-feature
updated: 2026-05-04
code:
  - src/styles/main.css
  - _private/propose.md
  - src/modules/exam/components/ExamModal.vue
  - src/modules/vocabulary/data/jpWords_N4.ts
  - src/modules/vocabulary/data/jpWords.ts
  - src/modules/vocabulary/utils/vocabularyFilters.ts
  - scripts/vocabulary/checkVocabularyMeaningFormat.mjs
  - src/modules/vocabulary/data/jpWords_N2.ts
  - src/modules/vocabulary/views/VocabularyView.vue
  - src/modules/exam/types/exam.ts
  - src/modules/vocabulary/data/jpWords_N5.ts
  - src/modules/vocabulary/data/jpWords_N1.ts
  - src/modules/vocabulary/composables/useVocabularyExamSession.ts
  - _private/discuss.txt
  - src/modules/vocabulary/composables/useVocabularySession.ts
  - src/modules/vocabulary/data/jpWords_N3.ts
  - PROJECT_ARCHITECTURE.md
  - src/modules/vocabulary/components/VocabularyControlBar.vue
  - src/modules/vocabulary/components/VocabularyStageTable.vue
  - _private/筆記.md
  - scripts/vocabulary/checkVocabularyMeaningFormat.d.mts
  - tests/unit/vocabularyStageTestData.ts
tests:
  - tests/unit/useVocabularyExamSession.spec.ts
  - tests/unit/vocabularyData.spec.ts
  - tests/unit/vocabularyGodanVerbMarkers.spec.ts
  - tests/component/VocabularyControlBar.spec.ts
  - tests/e2e/vocabulary-word-practice.spec.ts
  - tests/component/VocabularyViewSmoke.spec.ts
  - tests/component/ExamModal.spec.ts
  - tests/unit/vocabularyMeaningFormat.spec.ts
  - tests/component/VocabularyStageTable.spec.ts
  - tests/unit/vocabularyNaAdjectiveMarkers.spec.ts
  - tests/component/useVocabularySession.spec.ts
-->

---
### Requirement: Vocabulary quiz expands multi-sense entries into grouped questions

The vocabulary quiz SHALL expand each selected vocabulary entry into questions by pairing each meaning line with its corresponding single kanji line. The prompt SHALL be `text／kanji` when a kanji line exists and SHALL be `text` when the sense has no kanji. Senses with the same `text` and same kanji line SHALL be grouped into one question whose answer contains the grouped meanings separated by newline characters. The expanded deck SHALL be shuffled after grouping.

#### Scenario: Different kanji senses produce separate questions

- **WHEN** the selected entry is `から` with kanji `殻\n空` and meaning `外殼\n空(無內容)\n從～、因為～；助詞`
- **THEN** the quiz deck contains prompts `から／殻`, `から／空`, and `から`
- **AND** their answers are `外殼`, `空(無內容)`, and `從～、因為～；助詞`

#### Scenario: Repeated kanji senses are grouped into one question

- **WHEN** the selected entry is `あげる` with three `上げる` kanji lines and three different meanings for those lines
- **THEN** the quiz deck contains one prompt `あげる／上げる`
- **AND** that prompt answer contains the three meanings separated by newline characters

#### Scenario: Expanded deck is shuffled

- **WHEN** the vocabulary quiz creates more than one question
- **THEN** the final question order is randomized after all grouped questions are created
- **AND** the order is not required to preserve dictionary order, stage order, or adjacency of questions from the same entry


<!-- @trace
source: vocabulary-quiz-feature
updated: 2026-05-04
code:
  - src/styles/main.css
  - _private/propose.md
  - src/modules/exam/components/ExamModal.vue
  - src/modules/vocabulary/data/jpWords_N4.ts
  - src/modules/vocabulary/data/jpWords.ts
  - src/modules/vocabulary/utils/vocabularyFilters.ts
  - scripts/vocabulary/checkVocabularyMeaningFormat.mjs
  - src/modules/vocabulary/data/jpWords_N2.ts
  - src/modules/vocabulary/views/VocabularyView.vue
  - src/modules/exam/types/exam.ts
  - src/modules/vocabulary/data/jpWords_N5.ts
  - src/modules/vocabulary/data/jpWords_N1.ts
  - src/modules/vocabulary/composables/useVocabularyExamSession.ts
  - _private/discuss.txt
  - src/modules/vocabulary/composables/useVocabularySession.ts
  - src/modules/vocabulary/data/jpWords_N3.ts
  - PROJECT_ARCHITECTURE.md
  - src/modules/vocabulary/components/VocabularyControlBar.vue
  - src/modules/vocabulary/components/VocabularyStageTable.vue
  - _private/筆記.md
  - scripts/vocabulary/checkVocabularyMeaningFormat.d.mts
  - tests/unit/vocabularyStageTestData.ts
tests:
  - tests/unit/useVocabularyExamSession.spec.ts
  - tests/unit/vocabularyData.spec.ts
  - tests/unit/vocabularyGodanVerbMarkers.spec.ts
  - tests/component/VocabularyControlBar.spec.ts
  - tests/e2e/vocabulary-word-practice.spec.ts
  - tests/component/VocabularyViewSmoke.spec.ts
  - tests/component/ExamModal.spec.ts
  - tests/unit/vocabularyMeaningFormat.spec.ts
  - tests/component/VocabularyStageTable.spec.ts
  - tests/unit/vocabularyNaAdjectiveMarkers.spec.ts
  - tests/component/useVocabularySession.spec.ts
-->

---
### Requirement: Vocabulary quiz modal preserves alphabet quiz behavior

The shared exam modal SHALL keep the existing alphabet quiz defaults for prompt size, hint text, close confirmation, and actions. The vocabulary quiz SHALL use the same modal shell with a medium prompt size, no hint text area, and an answer area that preserves newline characters and wraps long text without overflowing the viewport.

#### Scenario: Alphabet quiz keeps default modal presentation

- **WHEN** the alphabet quiz opens the exam modal without vocabulary-specific presentation options
- **THEN** the modal displays the existing large prompt and hint text behavior

#### Scenario: Vocabulary quiz uses compact prompt and multi-line answer layout

- **WHEN** the vocabulary quiz opens a question whose answer contains newline characters
- **THEN** the prompt uses the medium vocabulary size
- **AND** the hint text area is absent
- **AND** every answer line is visible as a separate line without horizontal overflow


<!-- @trace
source: vocabulary-quiz-feature
updated: 2026-05-04
code:
  - src/styles/main.css
  - _private/propose.md
  - src/modules/exam/components/ExamModal.vue
  - src/modules/vocabulary/data/jpWords_N4.ts
  - src/modules/vocabulary/data/jpWords.ts
  - src/modules/vocabulary/utils/vocabularyFilters.ts
  - scripts/vocabulary/checkVocabularyMeaningFormat.mjs
  - src/modules/vocabulary/data/jpWords_N2.ts
  - src/modules/vocabulary/views/VocabularyView.vue
  - src/modules/exam/types/exam.ts
  - src/modules/vocabulary/data/jpWords_N5.ts
  - src/modules/vocabulary/data/jpWords_N1.ts
  - src/modules/vocabulary/composables/useVocabularyExamSession.ts
  - _private/discuss.txt
  - src/modules/vocabulary/composables/useVocabularySession.ts
  - src/modules/vocabulary/data/jpWords_N3.ts
  - PROJECT_ARCHITECTURE.md
  - src/modules/vocabulary/components/VocabularyControlBar.vue
  - src/modules/vocabulary/components/VocabularyStageTable.vue
  - _private/筆記.md
  - scripts/vocabulary/checkVocabularyMeaningFormat.d.mts
  - tests/unit/vocabularyStageTestData.ts
tests:
  - tests/unit/useVocabularyExamSession.spec.ts
  - tests/unit/vocabularyData.spec.ts
  - tests/unit/vocabularyGodanVerbMarkers.spec.ts
  - tests/component/VocabularyControlBar.spec.ts
  - tests/e2e/vocabulary-word-practice.spec.ts
  - tests/component/VocabularyViewSmoke.spec.ts
  - tests/component/ExamModal.spec.ts
  - tests/unit/vocabularyMeaningFormat.spec.ts
  - tests/component/VocabularyStageTable.spec.ts
  - tests/unit/vocabularyNaAdjectiveMarkers.spec.ts
  - tests/component/useVocabularySession.spec.ts
-->

---
### Requirement: Vocabulary quiz settlement updates draft marks only

The vocabulary quiz SHALL settle results by vocabulary entry mark key. For each tested entry, the system SHALL remove the mark key from `draftMarkedKeys` only when every question generated for that entry is answered with the next action. The system SHALL keep or add the mark key in `draftMarkedKeys` when any generated question is answered with the unknown action. When the quiz is closed before every generated question is answered, unanswered entries and partially answered entries SHALL keep their original checked state. Vocabulary quiz settlement SHALL NOT call save marks, SHALL NOT write `persistedMarkedKeys`, SHALL NOT write localStorage, and SHALL NOT write alphabet quiz unknown-result storage.

#### Scenario: All questions answered next clears the draft mark

- **WHEN** entry `から` generates three quiz questions
- **AND** the user answers all three questions with the next action
- **THEN** the `から` mark key is removed from `draftMarkedKeys`
- **AND** persisted marks remain unchanged

#### Scenario: Any unknown answer keeps the draft mark

- **WHEN** entry `から` generates three quiz questions
- **AND** the user answers one question with the unknown action and two questions with the next action
- **THEN** the `から` mark key remains in `draftMarkedKeys`

#### Scenario: Closing quiz preserves unanswered entry state

- **WHEN** a vocabulary quiz is closed before a selected entry has every generated question answered
- **THEN** that entry keeps the checked state it had when the quiz started
- **AND** no vocabulary marks are persisted automatically

#### Scenario: Vocabulary quiz does not update alphabet unknown results

- **WHEN** the vocabulary quiz settles with unknown answers
- **THEN** the alphabet quiz latest-unknown-result storage remains unchanged

<!-- @trace
source: vocabulary-quiz-feature
updated: 2026-05-04
code:
  - src/styles/main.css
  - _private/propose.md
  - src/modules/exam/components/ExamModal.vue
  - src/modules/vocabulary/data/jpWords_N4.ts
  - src/modules/vocabulary/data/jpWords.ts
  - src/modules/vocabulary/utils/vocabularyFilters.ts
  - scripts/vocabulary/checkVocabularyMeaningFormat.mjs
  - src/modules/vocabulary/data/jpWords_N2.ts
  - src/modules/vocabulary/views/VocabularyView.vue
  - src/modules/exam/types/exam.ts
  - src/modules/vocabulary/data/jpWords_N5.ts
  - src/modules/vocabulary/data/jpWords_N1.ts
  - src/modules/vocabulary/composables/useVocabularyExamSession.ts
  - _private/discuss.txt
  - src/modules/vocabulary/composables/useVocabularySession.ts
  - src/modules/vocabulary/data/jpWords_N3.ts
  - PROJECT_ARCHITECTURE.md
  - src/modules/vocabulary/components/VocabularyControlBar.vue
  - src/modules/vocabulary/components/VocabularyStageTable.vue
  - _private/筆記.md
  - scripts/vocabulary/checkVocabularyMeaningFormat.d.mts
  - tests/unit/vocabularyStageTestData.ts
tests:
  - tests/unit/useVocabularyExamSession.spec.ts
  - tests/unit/vocabularyData.spec.ts
  - tests/unit/vocabularyGodanVerbMarkers.spec.ts
  - tests/component/VocabularyControlBar.spec.ts
  - tests/e2e/vocabulary-word-practice.spec.ts
  - tests/component/VocabularyViewSmoke.spec.ts
  - tests/component/ExamModal.spec.ts
  - tests/unit/vocabularyMeaningFormat.spec.ts
  - tests/component/VocabularyStageTable.spec.ts
  - tests/unit/vocabularyNaAdjectiveMarkers.spec.ts
  - tests/component/useVocabularySession.spec.ts
-->

---
### Requirement: Vocabulary quiz modal uses compact centered answer layout

The vocabulary quiz SHALL render its exam modal with a 0.5rem gap between the prompt and the answer area. The vocabulary multiline answer container `.exam-modal-answer-multiline` SHALL use flex layout and SHALL center answer content horizontally and vertically. The answer content MUST preserve newline-separated answer lines and MUST wrap long text without horizontal viewport overflow. Alphabet quiz routes that open the same modal without vocabulary-specific presentation options SHALL keep their existing default prompt size, hint text area, answer presentation, close confirmation, and actions.

#### Scenario: Vocabulary quiz centers multiline answers

- **WHEN** the vocabulary quiz displays an answer containing multiple newline-separated lines
- **THEN** the prompt and answer area are separated by 0.5rem
- **AND** `.exam-modal-answer-multiline` uses flex layout
- **AND** the answer content is centered horizontally and vertically within that container
- **AND** each answer line remains visible as a separate line without horizontal viewport overflow

#### Scenario: Alphabet quiz keeps default modal presentation

- **WHEN** the alphabet practice route opens the shared exam modal without vocabulary-specific presentation options
- **THEN** the modal keeps the default large prompt presentation
- **AND** the default hint text area remains available
- **AND** the alphabet quiz close confirmation and action behavior remain unchanged


<!-- @trace
source: vocabulary-quiz-followup-adjustments
updated: 2026-05-04
code:
  - src/modules/exam/types/exam.ts
  - src/modules/vocabulary/data/jpWords.ts
  - PROJECT_ARCHITECTURE.md
  - src/modules/vocabulary/data/jpWords_N5.ts
  - src/modules/vocabulary/views/VocabularyView.vue
  - _private/筆記.md
  - src/modules/vocabulary/components/VocabularyStageTable.vue
  - scripts/vocabulary/checkVocabularyMeaningFormat.mjs
  - src/modules/vocabulary/data/jpWords_N2.ts
  - src/modules/vocabulary/composables/useVocabularySession.ts
  - scripts/vocabulary/checkVocabularyMeaningFormat.d.mts
  - src/modules/vocabulary/utils/vocabularyFilters.ts
  - src/styles/main.css
  - src/modules/exam/components/ExamModal.vue
  - src/modules/vocabulary/components/VocabularyControlBar.vue
  - src/modules/vocabulary/data/jpWords_N4.ts
  - src/modules/vocabulary/data/jpWords_N3.ts
  - src/modules/vocabulary/composables/useVocabularyExamSession.ts
  - src/modules/vocabulary/data/jpWords_N1.ts
  - _private/propose.md
  - tests/unit/vocabularyStageTestData.ts
  - _private/discuss.txt
tests:
  - tests/unit/vocabularyNaAdjectiveMarkers.spec.ts
  - tests/component/VocabularyStageTable.spec.ts
  - tests/component/VocabularyControlBar.spec.ts
  - tests/unit/vocabularyMeaningFormat.spec.ts
  - tests/component/VocabularyViewSmoke.spec.ts
  - tests/unit/vocabularyData.spec.ts
  - tests/e2e/vocabulary-word-practice.spec.ts
  - tests/unit/useVocabularyExamSession.spec.ts
  - tests/unit/vocabularyGodanVerbMarkers.spec.ts
  - tests/component/useVocabularySession.spec.ts
  - tests/component/ExamModal.spec.ts
-->

---
### Requirement: Vocabulary quiz settlement does not show an unsaved hint

The vocabulary quiz SHALL settle results by updating in-page draft mark state only. The vocabulary practice page SHALL NOT render a `尚未儲存` message or any equivalent unsaved-marks hint after vocabulary quiz settlement, after draft mark changes caused by the quiz, or while draft marks differ from persisted marks.

#### Scenario: Quiz settlement changes draft marks without unsaved hint

- **WHEN** the vocabulary quiz finishes and changes one or more draft mark keys
- **THEN** the vocabulary practice page reflects the updated draft mark state
- **AND** the page does not display `尚未儲存`
- **AND** the page does not display an equivalent unsaved-marks hint
- **AND** localStorage remains unchanged until the user invokes the save-marks action

<!-- @trace
source: vocabulary-quiz-followup-adjustments
updated: 2026-05-04
code:
  - src/modules/exam/types/exam.ts
  - src/modules/vocabulary/data/jpWords.ts
  - PROJECT_ARCHITECTURE.md
  - src/modules/vocabulary/data/jpWords_N5.ts
  - src/modules/vocabulary/views/VocabularyView.vue
  - _private/筆記.md
  - src/modules/vocabulary/components/VocabularyStageTable.vue
  - scripts/vocabulary/checkVocabularyMeaningFormat.mjs
  - src/modules/vocabulary/data/jpWords_N2.ts
  - src/modules/vocabulary/composables/useVocabularySession.ts
  - scripts/vocabulary/checkVocabularyMeaningFormat.d.mts
  - src/modules/vocabulary/utils/vocabularyFilters.ts
  - src/styles/main.css
  - src/modules/exam/components/ExamModal.vue
  - src/modules/vocabulary/components/VocabularyControlBar.vue
  - src/modules/vocabulary/data/jpWords_N4.ts
  - src/modules/vocabulary/data/jpWords_N3.ts
  - src/modules/vocabulary/composables/useVocabularyExamSession.ts
  - src/modules/vocabulary/data/jpWords_N1.ts
  - _private/propose.md
  - tests/unit/vocabularyStageTestData.ts
  - _private/discuss.txt
tests:
  - tests/unit/vocabularyNaAdjectiveMarkers.spec.ts
  - tests/component/VocabularyStageTable.spec.ts
  - tests/component/VocabularyControlBar.spec.ts
  - tests/unit/vocabularyMeaningFormat.spec.ts
  - tests/component/VocabularyViewSmoke.spec.ts
  - tests/unit/vocabularyData.spec.ts
  - tests/e2e/vocabulary-word-practice.spec.ts
  - tests/unit/useVocabularyExamSession.spec.ts
  - tests/unit/vocabularyGodanVerbMarkers.spec.ts
  - tests/component/useVocabularySession.spec.ts
  - tests/component/ExamModal.spec.ts
-->