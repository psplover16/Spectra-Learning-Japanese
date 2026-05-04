# vocabulary-jlpt-level-filtering Specification

## Purpose

TBD - created by archiving change 'improve-vocabulary-leveling-and-performance'. Update Purpose after archive.

## Requirements

### Requirement: Vocabulary stage uses JLPT levels

The vocabulary data SHALL use `stage` values from the JLPT level set `N1`, `N2`, `N3`, `N4`, and `N5` only.

#### Scenario: Vocabulary data is validated

- **WHEN** the vocabulary data is loaded
- **THEN** every vocabulary item has a `stage` value of `N1`, `N2`, `N3`, `N4`, or `N5`
- **AND** no legacy non-JLPT stage value is present

##### Example: allowed stage values

| stage | Expected |
| ----- | -------- |
| `N1` | accepted |
| `N2` | accepted |
| `N3` | accepted |
| `N4` | accepted |
| `N5` | accepted |


<!-- @trace
source: improve-vocabulary-leveling-and-performance
updated: 2026-04-30
code:
  - _private/筆記.md
  - src/styles/main.css
tests:
  - tests/component/VocabularyControlBar.spec.ts
-->

---
### Requirement: JLPT level filter controls

The vocabulary practice page SHALL display one checkbox for each JLPT level `N1` through `N5`, plus one select-all checkbox for the full level set. Each individual JLPT checkbox SHALL correspond to the vocabulary data file for the same level, and the visible vocabulary SHALL include only entries from selected levels after those level files are loaded.

#### Scenario: Initial level filter state

- **WHEN** the vocabulary practice page first renders
- **THEN** the `N1`, `N2`, `N3`, `N4`, and `N5` checkboxes are checked
- **AND** the select-all checkbox is checked
- **AND** the visible vocabulary includes every loaded item allowed by the other active filters

#### Scenario: Level checkbox affects visible vocabulary

- **WHEN** a user leaves only the `N5` checkbox checked
- **THEN** the page loads the `N5` vocabulary data when it is not already loaded
- **AND** the visible vocabulary includes `N5` items
- **AND** the visible vocabulary excludes `N1`, `N2`, `N3`, and `N4` items

##### Example: N5-only filtering

- **GIVEN** vocabulary items `alpha(stage=N5)`, `beta(stage=N4)`, and `gamma(stage=N1)`
- **WHEN** only `N5` is selected
- **THEN** the visible vocabulary contains `alpha` only

#### Scenario: No level checkbox is selected

- **WHEN** a user clears all JLPT level checkboxes
- **THEN** the visible vocabulary is empty
- **AND** the page does not throw a console error
- **AND** the page does not start any new stage data load


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
### Requirement: Select-all level synchronization

The select-all checkbox SHALL be derived from the selected JLPT level set and SHALL synchronize changes with the individual level checkboxes.

#### Scenario: Select all is checked

- **WHEN** a user checks the select-all checkbox
- **THEN** the `N1`, `N2`, `N3`, `N4`, and `N5` checkboxes become checked
- **AND** the select-all checkbox remains checked

#### Scenario: Individual level is unchecked

- **WHEN** the select-all checkbox is checked
- **AND** a user unchecks one JLPT level checkbox
- **THEN** the select-all checkbox becomes unchecked

#### Scenario: Select all is unchecked

- **WHEN** the select-all checkbox is checked
- **AND** a user unchecks the select-all checkbox
- **THEN** the `N1`, `N2`, `N3`, `N4`, and `N5` checkboxes become unchecked
- **AND** the visible vocabulary is empty

#### Scenario: All individual levels are checked manually

- **WHEN** a user checks `N1`, `N2`, `N3`, `N4`, and `N5` individually
- **THEN** the select-all checkbox becomes checked


<!-- @trace
source: improve-vocabulary-leveling-and-performance
updated: 2026-04-30
code:
  - _private/筆記.md
  - src/styles/main.css
tests:
  - tests/component/VocabularyControlBar.spec.ts
-->

---
### Requirement: JLPT filter composes with existing vocabulary filters

JLPT level filtering SHALL compose with existing vocabulary search, mark filtering, practice mode, and long-press reveal behavior without changing their existing meanings.

#### Scenario: Search and JLPT level are both active

- **WHEN** a search query is active
- **AND** a subset of JLPT level checkboxes is selected
- **THEN** the visible vocabulary includes only items matching both the search query and the selected JLPT levels

##### Example: search plus level filtering

- **GIVEN** vocabulary items `alpha(stage=N5, text=駅)`, `beta(stage=N4, text=駅前)`, and `gamma(stage=N5, text=本)`
- **WHEN** the search query is `駅` and only `N5` is selected
- **THEN** the visible vocabulary contains `alpha` only

#### Scenario: Mark-only filter and JLPT level are both active

- **WHEN** the mark-only filter is active
- **AND** a subset of JLPT level checkboxes is selected
- **THEN** the visible vocabulary includes only marked items whose stage is in the selected JLPT levels

#### Scenario: Practice mode remains available

- **WHEN** practice mode is enabled
- **THEN** the vocabulary table keeps the existing practice-mode behavior for the currently visible vocabulary


<!-- @trace
source: improve-vocabulary-leveling-and-performance
updated: 2026-04-30
code:
  - _private/筆記.md
  - src/styles/main.css
tests:
  - tests/component/VocabularyControlBar.spec.ts
-->

---
### Requirement: Vocabulary count summary is removed

The vocabulary practice page SHALL NOT display the count summary text that reports the number of currently visible words.

#### Scenario: Count summary is absent

- **WHEN** the vocabulary practice page renders
- **THEN** no text in the page reports the visible vocabulary count in the format of a word-count summary


<!-- @trace
source: improve-vocabulary-leveling-and-performance
updated: 2026-04-30
code:
  - _private/筆記.md
  - src/styles/main.css
tests:
  - tests/component/VocabularyControlBar.spec.ts
-->

---
### Requirement: Vocabulary controls layout

The vocabulary practice page SHALL place JLPT level controls above the row containing practice mode, mark-only filter, and save marks controls.
The vocabulary practice page SHALL stack the upper non-table control blocks with an 8px vertical gap between adjacent blocks.

#### Scenario: Level controls are above action controls

- **WHEN** the vocabulary practice controls render
- **THEN** the `N1`, `N2`, `N3`, `N4`, `N5`, and select-all checkboxes appear above the row containing practice mode, mark-only filter, and save marks controls

#### Scenario: Action controls share one row

- **WHEN** the action controls render
- **THEN** the practice mode checkbox and mark-only checkbox appear on the left side with a gap between them
- **AND** the save marks button appears on the right side of the same row

#### Scenario: Upper control blocks have an 8px vertical gap

- **WHEN** the vocabulary practice controls render
- **THEN** the search/global filter block, JLPT level controls block, and action controls block are stacked vertically with an 8px gap between adjacent blocks


<!-- @trace
source: improve-vocabulary-leveling-and-performance
updated: 2026-04-30
code:
  - _private/筆記.md
  - src/styles/main.css
tests:
  - tests/component/VocabularyControlBar.spec.ts
-->

---
### Requirement: Efficient visible vocabulary derivation

The vocabulary page SHALL derive visible vocabulary through a single filtering path that applies normalized loaded vocabulary data, selected JLPT levels, search state, mark-only state, and practice mode state consistently. The filtering path SHALL handle loading and error states without rendering stale entries from unselected levels.

#### Scenario: Visible vocabulary has one source of truth

- **WHEN** a user changes JLPT level selection, search text, mark-only state, or practice mode
- **THEN** the table and vocabulary controls observe the same visible vocabulary result set
- **AND** the page does not duplicate separate visible-vocabulary derivations across unrelated components

#### Scenario: Unselected loaded stage is excluded

- **WHEN** the `N5` data file is already loaded
- **AND** the user unchecks `N5`
- **THEN** `N5` entries are excluded from visible vocabulary
- **AND** the loaded cache does not make `N5` entries visible while `N5` is unselected


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
### Requirement: Vocabulary data is split by JLPT level files

Vocabulary source data SHALL be stored in one raw data file per JLPT level: `jpWords_N1.ts`, `jpWords_N2.ts`, `jpWords_N3.ts`, `jpWords_N4.ts`, and `jpWords_N5.ts`. Each file SHALL export only entries whose `stage` matches the file level. The legacy all-in-one vocabulary data file SHALL NOT be retained as a source file or used by the vocabulary session.

#### Scenario: Stage file contains matching stage entries

- **WHEN** the `jpWords_N5.ts` data file is imported
- **THEN** every raw vocabulary entry in that file has `stage = "N5"`

#### Scenario: Vocabulary session does not import all stages eagerly

- **WHEN** the vocabulary session initializes
- **THEN** it does not load every JLPT vocabulary data file through a single eager runtime import


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
### Requirement: JLPT stage data loads lazily

The vocabulary session SHALL lazy import vocabulary data for selected JLPT levels and SHALL keep loaded stage data available for later reuse during the same page session. Loading and error state SHALL be observable by the vocabulary view so controls that depend on visible entries can remain disabled while required data is unavailable.

#### Scenario: Selecting an unloaded level loads that level

- **WHEN** a user selects `N4`
- **AND** `N4` vocabulary data has not been loaded in the current page session
- **THEN** the vocabulary session lazy imports the `N4` data file
- **AND** `N4` entries become eligible for the single visible vocabulary filtering path after loading succeeds

#### Scenario: Loading failure disables quiz start

- **WHEN** a selected JLPT level fails to load
- **THEN** the vocabulary page exposes an error state
- **AND** the start-quiz control remains disabled for entries from that failed level


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
### Requirement: Duplicate entries use the simplest JLPT stage

When vocabulary entries with the same `text` and same `kanji` are consolidated across multiple JLPT levels, the resulting entry SHALL use the simplest level among the source entries according to `N5`, `N4`, `N3`, `N2`, then `N1`.

#### Scenario: Duplicate N3 and N5 entry becomes N5

- **WHEN** matching entries exist in `N3` and `N5`
- **THEN** the consolidated vocabulary entry has `stage = "N5"`

#### Scenario: Duplicate N1 and N3 entry becomes N3

- **WHEN** matching entries exist in `N1` and `N3`
- **THEN** the consolidated vocabulary entry has `stage = "N3"`

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
### Requirement: Visible vocabulary is ordered from N5 to N1

The vocabulary practice table SHALL order visible vocabulary by JLPT stage from `N5`, `N4`, `N3`, `N2`, then `N1` after applying active filters and before rendering rows when no other explicit sort is active. The system SHALL NOT use lazy-load completion order, source file import order, or selected checkbox order as the inter-stage display order. Entries within the same JLPT stage SHALL keep their existing normalized vocabulary order.

#### Scenario: All JLPT levels render from simplest to advanced

- **WHEN** vocabulary data contains visible entries from `N5`, `N4`, `N3`, `N2`, and `N1`
- **AND** all JLPT level filters are selected
- **AND** no other explicit sort is active
- **THEN** the table renders all visible `N5` rows before `N4` rows
- **AND** it renders all visible `N4` rows before `N3` rows
- **AND** it renders all visible `N3` rows before `N2` rows
- **AND** it renders all visible `N2` rows before `N1` rows

##### Example: full JLPT ordering

| Visible entry | Stage | Expected relative group |
| ------------- | ----- | ----------------------- |
| `alpha` | `N1` | 5 |
| `beta` | `N5` | 1 |
| `gamma` | `N3` | 3 |
| `delta` | `N4` | 2 |
| `epsilon` | `N2` | 4 |

#### Scenario: Selected subset still follows JLPT learning order

- **WHEN** the visible vocabulary contains entries from `N4`, `N2`, and `N1`
- **AND** no visible entry exists for `N5` or `N3`
- **AND** no other explicit sort is active
- **THEN** the table renders `N4` rows before `N2` rows
- **AND** it renders `N2` rows before `N1` rows

#### Scenario: Lazy load completion does not change stage order

- **WHEN** `N1` vocabulary data finishes loading before `N5` vocabulary data
- **AND** both levels are selected and visible after loading completes
- **AND** no other explicit sort is active
- **THEN** the table renders visible `N5` rows before visible `N1` rows

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