# vocabulary-mark-persistence Specification

## Purpose

TBD - created by archiving change 'refactor-vocabulary-marks-storage-key'. Update Purpose after archive.

## Requirements

### Requirement: Vocabulary marks use stable natural keys

The vocabulary mark persistence system SHALL store marked vocabulary entries as stable natural keys composed from the entry text, a literal pipe separator, and the entry kanji value. The stored natural key SHALL NOT include the vocabulary stage, array position, numeric id, or display id.

#### Scenario: Marked entry is saved with a natural key

- **WHEN** a vocabulary entry with text `おい` and empty kanji is marked and saved
- **THEN** the persisted version 2 snapshot contains `おい|` in `markedKeys`
- **AND** the snapshot does not contain a numeric id for that mark

##### Example: natural key formation

| text | kanji | Expected key |
| ---- | ----- | ------------ |
| `おい` | `` | `おい|` |
| `会う` | `あう` | `会う|あう` |

#### Scenario: Stage changes do not change the stored key

- **WHEN** the same vocabulary entry is assigned a different JLPT stage by a later dictionary update
- **THEN** the persisted natural key for that entry remains based on text and kanji only
- **AND** the mark still matches the entry if text and kanji are unchanged

##### Example: stage-independent key

- **GIVEN** a marked entry with text `会う`, kanji `あう`, and stage `N5`
- **WHEN** a later dictionary assigns the same text and kanji to stage `N3`
- **THEN** the stored key remains `会う|あう`


<!-- @trace
source: refactor-vocabulary-marks-storage-key
updated: 2026-05-03
code:
  - scripts/vocabulary/checkVocabularyMeaningFormat.d.mts
  - src/modules/vocabulary/components/VocabularyStageTable.vue
  - _private/n4.csv
  - _private/n5.csv
  - src/modules/vocabulary/composables/useVocabularySession.ts
  - src/modules/vocabulary/storage/vocabularyMarksStorage.ts
  - src/modules/vocabulary/types/vocabulary.ts
  - src/modules/vocabulary/utils/vocabularyFilters.ts
  - src/modules/vocabulary/data/jpWords.ts
  - _private/筆記.md
  - _private/n3.csv
  - scripts/vocabulary/checkVocabularyMeaningFormat.mjs
  - _private/n2.csv
  - _private/discuss.txt
  - _private/n1.csv
  - src/modules/vocabulary/views/VocabularyView.vue
  - _private/propose.md
tests:
  - tests/unit/vocabularyFilters.spec.ts
  - tests/component/VocabularyStageTable.spec.ts
  - tests/unit/vocabularyGodanVerbMarkers.spec.ts
  - tests/unit/vocabularyMarksStorage.spec.ts
  - tests/unit/vocabularyMeaningFormat.spec.ts
  - tests/unit/vocabularyData.spec.ts
  - tests/component/useVocabularySession.spec.ts
  - tests/unit/vocabularyNaAdjectiveMarkers.spec.ts
-->

---
### Requirement: Version 1 mark snapshots migrate to version 2

The vocabulary mark persistence system MUST migrate version 1 snapshots from `markedIds: number[]` to version 2 snapshots with `markedKeys: string[]` by resolving each numeric id against the current normalized vocabulary order at migration time.

#### Scenario: Existing numeric ids are converted to natural keys

- **WHEN** localStorage contains a version 1 snapshot with `markedIds` for entries that exist in the current normalized vocabulary
- **THEN** loading marks converts those ids into the matching natural keys
- **AND** localStorage is rewritten as a version 2 snapshot

##### Example: version 1 to version 2 conversion

| Current normalized vocabulary position | text | kanji | v1 id | v2 key |
| -------------------------------------- | ---- | ----- | ----- | ------ |
| 1 | `おい` | `` | `1` | `おい|` |
| 2 | `会う` | `あう` | `2` | `会う|あう` |

#### Scenario: Unresolvable numeric ids are discarded during migration

- **WHEN** a version 1 snapshot contains a numeric id that does not resolve to an entry in the current normalized vocabulary
- **THEN** that id is not represented in the migrated `markedKeys`
- **AND** the migration completes without showing a user-facing notification


<!-- @trace
source: refactor-vocabulary-marks-storage-key
updated: 2026-05-03
code:
  - scripts/vocabulary/checkVocabularyMeaningFormat.d.mts
  - src/modules/vocabulary/components/VocabularyStageTable.vue
  - _private/n4.csv
  - _private/n5.csv
  - src/modules/vocabulary/composables/useVocabularySession.ts
  - src/modules/vocabulary/storage/vocabularyMarksStorage.ts
  - src/modules/vocabulary/types/vocabulary.ts
  - src/modules/vocabulary/utils/vocabularyFilters.ts
  - src/modules/vocabulary/data/jpWords.ts
  - _private/筆記.md
  - _private/n3.csv
  - scripts/vocabulary/checkVocabularyMeaningFormat.mjs
  - _private/n2.csv
  - _private/discuss.txt
  - _private/n1.csv
  - src/modules/vocabulary/views/VocabularyView.vue
  - _private/propose.md
tests:
  - tests/unit/vocabularyFilters.spec.ts
  - tests/component/VocabularyStageTable.spec.ts
  - tests/unit/vocabularyGodanVerbMarkers.spec.ts
  - tests/unit/vocabularyMarksStorage.spec.ts
  - tests/unit/vocabularyMeaningFormat.spec.ts
  - tests/unit/vocabularyData.spec.ts
  - tests/component/useVocabularySession.spec.ts
  - tests/unit/vocabularyNaAdjectiveMarkers.spec.ts
-->

---
### Requirement: Stored mark keys are pruned against the current dictionary

The vocabulary mark persistence system SHALL validate stored version 2 `markedKeys` against the current dictionary key set each time marks are loaded. Keys that do not exist in the current dictionary MUST be removed from the loaded snapshot and from localStorage.

#### Scenario: Missing dictionary keys are removed silently

- **WHEN** localStorage contains a version 2 snapshot with one key that exists in the current dictionary and one key that does not exist
- **THEN** loading marks returns only the existing key
- **AND** localStorage is rewritten without the missing key
- **AND** no user-facing notification is shown

##### Example: pruning stored keys

| Stored key | Current dictionary contains key | Expected loaded result |
| ---------- | ------------------------------- | ---------------------- |
| `おい|` | yes | kept |
| `missing|` | no | removed |

#### Scenario: Valid stored keys are preserved

- **WHEN** every stored key exists in the current dictionary key set
- **THEN** loading marks preserves those keys
- **AND** the mark-only filter can match those entries by key

##### Example: valid keys remain available

| Stored key | Current dictionary contains key | Expected loaded result |
| ---------- | ------------------------------- | ---------------------- |
| `おい|` | yes | kept |
| `会う|あう` | yes | kept |

#### Scenario: Duplicate stored keys are collapsed

- **WHEN** localStorage contains the same version 2 key more than once
- **THEN** loading marks preserves the first occurrence of that key
- **AND** localStorage is rewritten with only one copy of that key

##### Example: duplicate key pruning

| Stored keys | Expected loaded result |
| ----------- | ---------------------- |
| `おい|`, `会う|あう`, `おい|` | `おい|`, `会う|あう` |


<!-- @trace
source: refactor-vocabulary-marks-storage-key
updated: 2026-05-03
code:
  - scripts/vocabulary/checkVocabularyMeaningFormat.d.mts
  - src/modules/vocabulary/components/VocabularyStageTable.vue
  - _private/n4.csv
  - _private/n5.csv
  - src/modules/vocabulary/composables/useVocabularySession.ts
  - src/modules/vocabulary/storage/vocabularyMarksStorage.ts
  - src/modules/vocabulary/types/vocabulary.ts
  - src/modules/vocabulary/utils/vocabularyFilters.ts
  - src/modules/vocabulary/data/jpWords.ts
  - _private/筆記.md
  - _private/n3.csv
  - scripts/vocabulary/checkVocabularyMeaningFormat.mjs
  - _private/n2.csv
  - _private/discuss.txt
  - _private/n1.csv
  - src/modules/vocabulary/views/VocabularyView.vue
  - _private/propose.md
tests:
  - tests/unit/vocabularyFilters.spec.ts
  - tests/component/VocabularyStageTable.spec.ts
  - tests/unit/vocabularyGodanVerbMarkers.spec.ts
  - tests/unit/vocabularyMarksStorage.spec.ts
  - tests/unit/vocabularyMeaningFormat.spec.ts
  - tests/unit/vocabularyData.spec.ts
  - tests/component/useVocabularySession.spec.ts
  - tests/unit/vocabularyNaAdjectiveMarkers.spec.ts
-->

---
### Requirement: Vocabulary mark interactions compare by stable key

The vocabulary session SHALL use stable natural keys for mark toggling, saving, clearing, and mark-only filtering. Numeric vocabulary ids remain available for non-persistence concerns, but mark behavior MUST NOT depend on numeric ids.

#### Scenario: Toggling a mark updates the key set

- **WHEN** a user toggles the mark state for a vocabulary entry
- **THEN** the session adds or removes that entry natural key from the in-memory marked key set
- **AND** saving marks persists the same key set to localStorage

##### Example: toggling one key

- **GIVEN** the in-memory marked key set is empty
- **WHEN** the user marks an entry with key `おい|`
- **THEN** the in-memory marked key set contains `おい|`

#### Scenario: Mark-only filter uses keys

- **WHEN** the mark-only filter is active
- **THEN** visible vocabulary includes entries whose natural keys are present in the marked key set
- **AND** visible vocabulary excludes entries whose natural keys are absent from the marked key set

##### Example: key-based filtering

| Entry text | Entry kanji | Marked keys | Visible with mark-only |
| ---------- | ----------- | ----------- | ---------------------- |
| `おい` | `` | `おい|` | yes |
| `会う` | `あう` | `おい|` | no |

<!-- @trace
source: refactor-vocabulary-marks-storage-key
updated: 2026-05-03
code:
  - scripts/vocabulary/checkVocabularyMeaningFormat.d.mts
  - src/modules/vocabulary/components/VocabularyStageTable.vue
  - _private/n4.csv
  - _private/n5.csv
  - src/modules/vocabulary/composables/useVocabularySession.ts
  - src/modules/vocabulary/storage/vocabularyMarksStorage.ts
  - src/modules/vocabulary/types/vocabulary.ts
  - src/modules/vocabulary/utils/vocabularyFilters.ts
  - src/modules/vocabulary/data/jpWords.ts
  - _private/筆記.md
  - _private/n3.csv
  - scripts/vocabulary/checkVocabularyMeaningFormat.mjs
  - _private/n2.csv
  - _private/discuss.txt
  - _private/n1.csv
  - src/modules/vocabulary/views/VocabularyView.vue
  - _private/propose.md
tests:
  - tests/unit/vocabularyFilters.spec.ts
  - tests/component/VocabularyStageTable.spec.ts
  - tests/unit/vocabularyGodanVerbMarkers.spec.ts
  - tests/unit/vocabularyMarksStorage.spec.ts
  - tests/unit/vocabularyMeaningFormat.spec.ts
  - tests/unit/vocabularyData.spec.ts
  - tests/component/useVocabularySession.spec.ts
  - tests/unit/vocabularyNaAdjectiveMarkers.spec.ts
-->