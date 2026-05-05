# vocabulary-meaning-pos-format Specification

## Purpose

TBD - created by archiving change 'standardize-vocabulary-meaning-pos-format'. Update Purpose after archive.

## Requirements

### Requirement: Vocabulary meanings use per-sense lines

Vocabulary dictionary entries SHALL format multiple meanings as separate lines in `meaning`. A vocabulary meaning SHALL NOT place multiple verb or adjective senses on one line with a single trailing part-of-speech marker.

#### Scenario: Multiple verb senses are split into separate lines

- **WHEN** a vocabulary entry has more than one verb sense
- **THEN** each sense is stored on its own `meaning` line
- **AND** each line contains its own verb class marker

##### Example: hataraku senses

| Entry text | Entry kanji | Expected meaning |
| ---------- | ----------- | ---------------- |
| `はたらく` | `働く\n働く` | `工作（五段動詞）\n起作用（五段動詞）` |

#### Scenario: Mixed multi-line meanings keep part-of-speech markers on every verb sense

- **WHEN** a vocabulary entry contains multiple lines and at least one line is a verb sense
- **THEN** every verb sense line contains a verb class marker

##### Example: kaeru senses

| Entry text | Entry kanji | Expected meaning |
| ---------- | ----------- | ---------------- |
| `かえる` | `帰る\n変える` | `回家（五段動詞）\n改變（一段動詞）` |


<!-- @trace
source: standardize-vocabulary-meaning-pos-format
updated: 2026-05-03
code:
  - src/modules/vocabulary/storage/vocabularyMarksStorage.ts
  - src/modules/vocabulary/composables/useVocabularySession.ts
  - src/modules/vocabulary/types/vocabulary.ts
  - src/modules/vocabulary/components/VocabularyStageTable.vue
  - scripts/vocabulary/checkVocabularyMeaningFormat.mjs
  - src/modules/vocabulary/utils/vocabularyFilters.ts
  - scripts/vocabulary/checkVocabularyMeaningFormat.d.mts
  - src/modules/vocabulary/views/VocabularyView.vue
  - src/modules/vocabulary/data/jpWords_N1.ts～jpWords_N5.ts
tests:
  - tests/unit/vocabularyData.spec.ts
  - tests/component/useVocabularySession.spec.ts
  - tests/unit/vocabularyNaAdjectiveMarkers.spec.ts
  - tests/unit/vocabularyMeaningFormat.spec.ts
  - tests/component/VocabularyStageTable.spec.ts
  - tests/unit/vocabularyFilters.spec.ts
  - tests/unit/vocabularyMarksStorage.spec.ts
  - tests/unit/vocabularyGodanVerbMarkers.spec.ts
-->

---
### Requirement: Vocabulary kanji lines align with meaning lines

Vocabulary dictionary entries SHALL align `kanji` and `meaning` lines so that kanji-bearing senses appear before kanji-less senses. When a sense has a kanji spelling, the corresponding `kanji` line MUST contain that spelling. When multiple senses use the same kanji spelling, that spelling MUST be repeated on each corresponding `kanji` line. When a sense has no kanji spelling, its meaning line MUST appear after every kanji-bearing sense. A kanji-less sense that is followed by another meaning line MUST have an empty `kanji` placeholder line; the final kanji-less sense is valid with an omitted trailing `kanji` line.

#### Scenario: Reused kanji is repeated for aligned senses

- **WHEN** a vocabulary entry has multiple meaning lines and two senses use the same kanji spelling
- **THEN** the `kanji` value contains one line for each kanji-bearing meaning line
- **AND** the repeated kanji spelling appears on each corresponding `kanji` line

##### Example: aligned ageru senses

| Entry text | Expected kanji | Expected meaning |
| ---------- | -------------- | ---------------- |
| `あげる` | `上げる\n上げる\n上げる\n挙げる\n揚げる` | `提高（一段動詞；他動詞）\n給（一段動詞）\n舉起（一段動詞）\n列舉／舉例（一段動詞）\n油炸（一段動詞）` |

#### Scenario: Kanji-less final sense omits trailing placeholder

- **WHEN** a vocabulary entry has kanji-bearing senses followed by one final kanji-less sense
- **THEN** the `kanji` value lists only the kanji-bearing senses
- **AND** the final meaning line represents the kanji-less sense

##### Example: kara senses

| Entry text | Expected kanji | Expected meaning |
| ---------- | -------------- | ---------------- |
| `から` | `殻\n空` | `外殼\n空(無內容)\n從～、因為～；助詞` |

#### Scenario: Kanji-less non-final tail sense keeps placeholder

- **WHEN** a vocabulary entry has more than one kanji-less sense after all kanji-bearing senses
- **THEN** every kanji-less sense except the final meaning line has an empty `kanji` placeholder line
- **AND** no kanji-bearing sense appears after an empty `kanji` placeholder line

##### Example: two kanji-less tail senses

| Entry text | Expected kanji | Expected meaning |
| ---------- | -------------- | ---------------- |
| `example` | `例一\n` | `第一義\n第二義無漢字\n第三義無漢字` |


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
### Requirement: Vocabulary meaning labels are concise and learner-readable

Vocabulary meaning lines SHALL use concise Traditional Chinese labels that identify the sense without requiring hidden context. A meaning label MUST avoid standalone ambiguous verbs when a short contextual label can distinguish the sense more clearly.

#### Scenario: Ambiguous standalone label is replaced with contextual wording

- **WHEN** a vocabulary sense label would be ambiguous as a standalone Traditional Chinese verb
- **THEN** the `meaning` line uses a short contextual label that clarifies the sense
- **AND** the line keeps its required part-of-speech marker

##### Example: ageru listing sense

| Entry text | Entry kanji | Invalid meaning | Expected meaning |
| ---------- | ----------- | --------------- | ---------------- |
| `あげる` | `挙げる` | `提出（一段動詞）` | `列舉／舉例（一段動詞）` |


<!-- @trace
source: standardize-vocabulary-meaning-pos-format
updated: 2026-05-03
code:
  - src/modules/vocabulary/storage/vocabularyMarksStorage.ts
  - src/modules/vocabulary/composables/useVocabularySession.ts
  - src/modules/vocabulary/types/vocabulary.ts
  - src/modules/vocabulary/components/VocabularyStageTable.vue
  - scripts/vocabulary/checkVocabularyMeaningFormat.mjs
  - src/modules/vocabulary/utils/vocabularyFilters.ts
  - scripts/vocabulary/checkVocabularyMeaningFormat.d.mts
  - src/modules/vocabulary/views/VocabularyView.vue
  - src/modules/vocabulary/data/jpWords_N1.ts～jpWords_N5.ts
tests:
  - tests/unit/vocabularyData.spec.ts
  - tests/component/useVocabularySession.spec.ts
  - tests/unit/vocabularyNaAdjectiveMarkers.spec.ts
  - tests/unit/vocabularyMeaningFormat.spec.ts
  - tests/component/VocabularyStageTable.spec.ts
  - tests/unit/vocabularyFilters.spec.ts
  - tests/unit/vocabularyMarksStorage.spec.ts
  - tests/unit/vocabularyGodanVerbMarkers.spec.ts
-->

---
### Requirement: Vocabulary part-of-speech markers use full-width parentheses

Vocabulary dictionary part-of-speech markers in `meaning` SHALL use full-width Chinese parentheses. Half-width part-of-speech markers such as `(五段動詞)`, `(一段動詞)`, `(い形容詞)`, and `(な形容詞)` MUST NOT appear in vocabulary meanings.

#### Scenario: Verb marker uses full-width parentheses

- **WHEN** a vocabulary meaning contains a verb class marker
- **THEN** the marker is written with full-width parentheses

##### Example: full-width marker

| Invalid meaning | Expected meaning |
| --------------- | ---------------- |
| `給(一段動詞)` | `給（一段動詞）` |


<!-- @trace
source: standardize-vocabulary-meaning-pos-format
updated: 2026-05-03
code:
  - src/modules/vocabulary/storage/vocabularyMarksStorage.ts
  - src/modules/vocabulary/composables/useVocabularySession.ts
  - src/modules/vocabulary/types/vocabulary.ts
  - src/modules/vocabulary/components/VocabularyStageTable.vue
  - scripts/vocabulary/checkVocabularyMeaningFormat.mjs
  - src/modules/vocabulary/utils/vocabularyFilters.ts
  - scripts/vocabulary/checkVocabularyMeaningFormat.d.mts
  - src/modules/vocabulary/views/VocabularyView.vue
  - src/modules/vocabulary/data/jpWords_N1.ts～jpWords_N5.ts
tests:
  - tests/unit/vocabularyData.spec.ts
  - tests/component/useVocabularySession.spec.ts
  - tests/unit/vocabularyNaAdjectiveMarkers.spec.ts
  - tests/unit/vocabularyMeaningFormat.spec.ts
  - tests/component/VocabularyStageTable.spec.ts
  - tests/unit/vocabularyFilters.spec.ts
  - tests/unit/vocabularyMarksStorage.spec.ts
  - tests/unit/vocabularyGodanVerbMarkers.spec.ts
-->

---
### Requirement: Confirmed verbs and adjectives include part-of-speech markers

Confirmed vocabulary entries that are verbs or adjectives SHALL include a part-of-speech marker on every verb or adjective meaning line.

#### Scenario: Ichidan verb meanings are marked

- **WHEN** an entry is the confirmed ichidan verb `あげる`
- **THEN** every meaning line for that entry contains `（一段動詞）`

##### Example: ageru senses

| Entry text | Entry kanji | Expected meaning |
| ---------- | ----------- | ---------------- |
| `あげる` | `上げる\n上げる\n挙げる\n揚げる` | `給（一段動詞）\n舉起（一段動詞）\n列舉／舉例（一段動詞）\n油炸（一段動詞）` |

#### Scenario: Transitivity annotation does not replace verb class

- **WHEN** a meaning contains a transitivity annotation such as `他動` or `自動`
- **THEN** the same meaning line also contains a verb class marker when the entry is a confirmed verb

##### Example: transitive ageru

| Entry text | Entry kanji | Expected meaning |
| ---------- | ----------- | ---------------- |
| `あげる` | `上げる` | `提高（一段動詞；他動詞）` |

#### Scenario: No-adjective meanings are marked

- **WHEN** JMdict maps an entry to `adj-no`
- **THEN** every adjective meaning line for that entry contains `（の形容詞）`

##### Example: nama no-adjective

| Entry text | Entry kanji | Expected meaning |
| ---------- | ----------- | ---------------- |
| `なま` | `生` | `生的／未煮熟的／新鮮的（の形容詞）` |


<!-- @trace
source: standardize-vocabulary-meaning-pos-format
updated: 2026-05-03
code:
  - src/modules/vocabulary/storage/vocabularyMarksStorage.ts
  - src/modules/vocabulary/composables/useVocabularySession.ts
  - src/modules/vocabulary/types/vocabulary.ts
  - src/modules/vocabulary/components/VocabularyStageTable.vue
  - scripts/vocabulary/checkVocabularyMeaningFormat.mjs
  - src/modules/vocabulary/utils/vocabularyFilters.ts
  - scripts/vocabulary/checkVocabularyMeaningFormat.d.mts
  - src/modules/vocabulary/views/VocabularyView.vue
  - src/modules/vocabulary/data/jpWords_N1.ts～jpWords_N5.ts
tests:
  - tests/unit/vocabularyData.spec.ts
  - tests/component/useVocabularySession.spec.ts
  - tests/unit/vocabularyNaAdjectiveMarkers.spec.ts
  - tests/unit/vocabularyMeaningFormat.spec.ts
  - tests/component/VocabularyStageTable.spec.ts
  - tests/unit/vocabularyFilters.spec.ts
  - tests/unit/vocabularyMarksStorage.spec.ts
  - tests/unit/vocabularyGodanVerbMarkers.spec.ts
-->

---
### Requirement: JMdict is the primary part-of-speech source

The vocabulary meaning format checker SHALL use JMdict lookup as the primary source for verb and adjective part-of-speech classification. When a vocabulary entry has exactly one compatible JMdict verb or adjective class, the checker MUST use that class automatically and MUST NOT require manual confirmation for that entry.

#### Scenario: Unambiguous JMdict verb class is applied automatically

- **WHEN** JMdict maps `あげる` / `上げる` to `v1`
- **THEN** the checker classifies the entry as `一段動詞`
- **AND** the entry does not appear in the unresolved manual review report

##### Example: JMdict POS mapping

| JMdict POS code | Expected project marker |
| --------------- | ----------------------- |
| `v1` | `一段動詞` |
| `v5k` | `五段動詞` |
| `adj-i` | `い形容詞` |
| `adj-na` | `な形容詞` |
| `adj-no` | `の形容詞` |

#### Scenario: Ambiguous JMdict result is reported as unresolved

- **WHEN** JMdict lookup returns multiple incompatible verb or adjective classes for one vocabulary entry
- **THEN** the checker records that entry in the unresolved report with the candidate JMdict classes
- **AND** implementation cannot mark the full vocabulary meaning format validation complete until the unresolved report is empty or the entry has an explicit allowlist reason

##### Example: unresolved JMdict conflict

| Entry text | Entry kanji | JMdict candidate classes | Expected checker result |
| ---------- | ----------- | ------------------------ | ----------------------- |
| `example` | `例` | `v1`, `v5r` | unresolved with candidates `一段動詞`, `五段動詞` |

#### Scenario: JMdict missing data fails loudly

- **WHEN** the JMdict source data required by the checker is not available
- **THEN** the checker fails with a setup error
- **AND** the checker does not fall back to asking the user to manually confirm all entries

##### Example: missing JMdict source

| JMdict source state | Expected checker result |
| ------------------- | ----------------------- |
| `_private/_tools/jmdict/` is missing | setup error before vocabulary validation |


<!-- @trace
source: standardize-vocabulary-meaning-pos-format
updated: 2026-05-03
code:
  - src/modules/vocabulary/storage/vocabularyMarksStorage.ts
  - src/modules/vocabulary/composables/useVocabularySession.ts
  - src/modules/vocabulary/types/vocabulary.ts
  - src/modules/vocabulary/components/VocabularyStageTable.vue
  - scripts/vocabulary/checkVocabularyMeaningFormat.mjs
  - src/modules/vocabulary/utils/vocabularyFilters.ts
  - scripts/vocabulary/checkVocabularyMeaningFormat.d.mts
  - src/modules/vocabulary/views/VocabularyView.vue
  - src/modules/vocabulary/data/jpWords_N1.ts～jpWords_N5.ts
tests:
  - tests/unit/vocabularyData.spec.ts
  - tests/component/useVocabularySession.spec.ts
  - tests/unit/vocabularyNaAdjectiveMarkers.spec.ts
  - tests/unit/vocabularyMeaningFormat.spec.ts
  - tests/component/VocabularyStageTable.spec.ts
  - tests/unit/vocabularyFilters.spec.ts
  - tests/unit/vocabularyMarksStorage.spec.ts
  - tests/unit/vocabularyGodanVerbMarkers.spec.ts
-->

---
### Requirement: Vocabulary meaning format is automatically checked

The vocabulary test suite SHALL fail when current vocabulary data contains trailing shared part-of-speech markers, half-width part-of-speech markers, JMdict-classified verb/adjective entries without required markers, unresolved JMdict lookup results without explicit allowlist reasons, or `kanji` and `meaning` values with mismatched line counts.

#### Scenario: Invalid format is rejected by tests

- **WHEN** vocabulary data contains `工作；運作(五段動詞)`
- **THEN** the vocabulary meaning format test fails

#### Scenario: Valid format passes tests

- **WHEN** vocabulary data contains `工作（五段動詞）\n起作用（五段動詞）`
- **THEN** the vocabulary meaning format test passes for that entry

<!-- @trace
source: standardize-vocabulary-meaning-pos-format
updated: 2026-05-03
code:
  - src/modules/vocabulary/storage/vocabularyMarksStorage.ts
  - src/modules/vocabulary/composables/useVocabularySession.ts
  - src/modules/vocabulary/types/vocabulary.ts
  - src/modules/vocabulary/components/VocabularyStageTable.vue
  - scripts/vocabulary/checkVocabularyMeaningFormat.mjs
  - src/modules/vocabulary/utils/vocabularyFilters.ts
  - scripts/vocabulary/checkVocabularyMeaningFormat.d.mts
  - src/modules/vocabulary/views/VocabularyView.vue
  - src/modules/vocabulary/data/jpWords_N1.ts～jpWords_N5.ts
tests:
  - tests/unit/vocabularyData.spec.ts
  - tests/component/useVocabularySession.spec.ts
  - tests/unit/vocabularyNaAdjectiveMarkers.spec.ts
  - tests/unit/vocabularyMeaningFormat.spec.ts
  - tests/component/VocabularyStageTable.spec.ts
  - tests/unit/vocabularyFilters.spec.ts
  - tests/unit/vocabularyMarksStorage.spec.ts
  - tests/unit/vocabularyGodanVerbMarkers.spec.ts
-->


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
### Requirement: Vocabulary duplicate senses are consolidated before quiz use

Vocabulary data SHALL consolidate entries with the same `text` and same `kanji` value when their meanings are valid distinct senses. The consolidated entry SHALL keep all verified meanings as separate meaning lines and SHALL keep repeated kanji lines when those meanings share the same kanji spelling. The consolidated entry SHALL use the simplest JLPT stage among the duplicate source entries according to `N5`, `N4`, `N3`, `N2`, then `N1`.

#### Scenario: Same text and kanji across stages are merged

- **WHEN** `あげる` with the same `kanji` spelling appears in `N3` and `N5`
- **THEN** the vocabulary data contains one consolidated `あげる` entry in `N5`
- **AND** the entry keeps each verified distinct meaning as its own meaning line

#### Scenario: Different kanji homophones remain separate entries

- **WHEN** two entries have the same `text` but different `kanji` values
- **THEN** the vocabulary data keeps them as separate entries


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
### Requirement: New vocabulary senses are appended without violating kanji ordering

New kanji or meaning senses SHALL be appended at the end of the current entry editing operation, then normalized so every kanji-bearing sense appears before every kanji-less sense. The normalized entry MUST preserve one meaning line per sense and MUST preserve repeated kanji lines for distinct meanings that share the same kanji.

#### Scenario: New kanji-bearing sense is inserted before kanji-less tail

- **WHEN** a new kanji-bearing sense is added to an entry that already has a kanji-less final sense
- **THEN** the resulting entry places the new kanji-bearing sense before the kanji-less final sense
- **AND** the kanji-less sense remains at the end of `meaning`

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
### Requirement: Vocabulary data rejects duplicate text and kanji entries across stages

Vocabulary source data SHALL NOT contain more than one raw vocabulary entry with the same `text` and the same `kanji` value across JLPT stage files. When duplicate source entries share the same `text` and same `kanji`, the data SHALL be consolidated into one entry at the simplest source JLPT stage according to `N5`, `N4`, `N3`, `N2`, then `N1`. The consolidated entry MUST preserve valid distinct meanings as separate `meaning` lines and MUST preserve kanji-to-meaning line alignment.

#### Scenario: Duplicate text and kanji across stages fails validation

- **WHEN** raw vocabulary data contains one entry with `text = "あげる"`, `kanji = "上げる"`, and `stage = "N3"`
- **AND** raw vocabulary data also contains another entry with `text = "あげる"`, `kanji = "上げる"`, and `stage = "N5"`
- **THEN** vocabulary data validation reports the duplicate text-and-kanji entries
- **AND** implementation is not complete until the entries are consolidated into one `N5` entry

#### Scenario: Consolidated duplicate keeps aligned senses

- **WHEN** duplicate entries with the same `text` and same `kanji` are consolidated
- **THEN** the consolidated entry keeps every verified distinct meaning as its own `meaning` line
- **AND** each kanji-bearing meaning line has the corresponding `kanji` line
- **AND** the consolidated entry uses the simplest source JLPT stage

#### Scenario: Future additions cannot reintroduce duplicate text and kanji

- **WHEN** a new raw vocabulary entry is added to any JLPT stage file
- **AND** another raw vocabulary entry already has the same `text` and same `kanji`
- **THEN** vocabulary data validation fails until the entries are consolidated

#### Scenario: Same text with different kanji remains separate

- **WHEN** raw vocabulary data contains two entries with the same `text`
- **AND** the entries have different `kanji` values
- **THEN** vocabulary data validation does not require those entries to be consolidated by this requirement

<!-- @trace
source: adjust-vocabulary-practice-reading-mode
updated: 2026-05-05
code:
  - src/modules/vocabulary/utils/vocabularyFilters.ts
  - src/modules/vocabulary/components/VocabularyStageTable.vue
  - src/modules/vocabulary/components/VocabularyControlBar.vue
  - src/modules/vocabulary/composables/useVocabularySession.ts
  - src/modules/vocabulary/types/vocabulary.ts
  - src/styles/main.css
  - src/modules/vocabulary/views/VocabularyView.vue
  - _private/propose.md
  - _private/discuss.txt
tests:
  - tests/component/VocabularyViewSmoke.spec.ts
  - tests/e2e/vocabulary-word-practice.spec.ts
  - tests/component/VocabularyControlBar.spec.ts
  - tests/unit/vocabularyData.spec.ts
  - tests/unit/vocabularyFilters.spec.ts
  - tests/component/VocabularyStageTable.spec.ts
-->