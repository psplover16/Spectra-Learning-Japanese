## MODIFIED Requirements

### Requirement: Vocabulary kanji lines align with meaning lines

Vocabulary dictionary entries SHALL align `kanji` and `meaning` lines using a meaning-led layout: `kanji` SHALL list only senses that have a kanji spelling, in order, with no empty placeholder lines; `meaning` SHALL list every sense (kanji-bearing senses first in the same order as `kanji`, kanji-less senses last). The number of `meaning` lines MUST be greater than or equal to the number of `kanji` lines, and any meaning line beyond the last `kanji` line MUST correspond to a kanji-less sense.

For position k where k is less than the number of `kanji` lines, the k-th `meaning` line SHALL describe the sense written with the k-th `kanji` line. For position k that is greater than or equal to the number of `kanji` lines, the k-th `meaning` line SHALL describe a sense that has no kanji spelling.

A single-sense entry with no kanji spelling SHALL keep `kanji` as the empty string and `meaning` as a single string with no newline. Empty placeholder lines inside a multi-line `kanji` value MUST NOT be used; such entries MUST be rewritten so that the kanji-less sense moves to the end of `meaning` and the corresponding empty `kanji` line is removed.

#### Scenario: Reused kanji is repeated for aligned senses

- **WHEN** a vocabulary entry has multiple meaning lines and two senses use the same kanji spelling
- **THEN** the `kanji` value contains one line per kanji-bearing sense in their meaning order
- **AND** the repeated kanji spelling appears on each corresponding `kanji` line

##### Example: aligned ageru senses

| Entry text | Expected kanji | Expected meaning |
| ---------- | -------------- | ---------------- |
| `あげる` | `上げる\n上げる\n挙げる\n揚げる` | `給（一段動詞）\n舉起（一段動詞）\n列舉／舉例（一段動詞）\n油炸（一段動詞）` |

#### Scenario: Kanji-less senses are appended at the end of meaning

- **WHEN** a vocabulary entry has senses that have no kanji spelling alongside senses that do
- **THEN** every kanji-less sense appears at the end of `meaning`, after all kanji-bearing senses
- **AND** `kanji` contains only the kanji-bearing senses with no empty placeholder lines
- **AND** the number of `meaning` lines is greater than or equal to the number of `kanji` lines

##### Example: kara mixed senses

| Entry text | Expected kanji | Expected meaning |
| ---------- | -------------- | ---------------- |
| `から` | `殻\n空` | `外殼\n空(無內容)\n從～、因為～；助詞` |

#### Scenario: Single-sense kanji-less entry uses empty kanji string

- **WHEN** a vocabulary entry has a single sense and no kanji spelling
- **THEN** `kanji` is the empty string with no newline
- **AND** `meaning` is a single string with no newline

##### Example: single sense kanji-less

| Entry text | Expected kanji | Expected meaning |
| ---------- | -------------- | ---------------- |
| `おい` | (empty string) | `喂（招呼語）` |

#### Scenario: Empty kanji placeholder lines are forbidden

- **WHEN** a vocabulary entry uses an empty line inside `kanji` to align with a kanji-less meaning line
- **THEN** the entry is invalid and MUST be rewritten so that the kanji-less sense moves to the end of `meaning` and the empty `kanji` line is removed

##### Example: invalid placeholder rewrite

| Entry text | Invalid kanji | Invalid meaning | Expected kanji | Expected meaning |
| ---------- | ------------- | --------------- | -------------- | ---------------- |
| `example` | `例一\n\n例三` | `第一義\n第二義\n第三義` | `例一\n例三` | `第一義\n第三義\n第二義` |

### Requirement: Vocabulary meaning format is automatically checked

The vocabulary test suite SHALL fail when current vocabulary data contains trailing shared part-of-speech markers, half-width part-of-speech markers, JMdict-classified verb/adjective entries without required markers, unresolved JMdict lookup results without explicit allowlist reasons, `kanji` line count exceeding `meaning` line count, kanji-less meaning lines that are not at the end of `meaning`, empty placeholder lines inside `kanji`, or entries that share the same `text` and `kanji` value as another entry.

#### Scenario: Invalid format is rejected by tests

- **WHEN** vocabulary data contains `工作；運作(五段動詞)`
- **THEN** the vocabulary meaning format test fails

#### Scenario: Valid format passes tests

- **WHEN** vocabulary data contains `工作（五段動詞）\n起作用（五段動詞）`
- **THEN** the vocabulary meaning format test passes for that entry

#### Scenario: Kanji-less sense in the middle is rejected

- **WHEN** a vocabulary entry has `kanji = "殻\n空"` and `meaning = "外殼\n從～、因為～；助詞\n空(無內容)"`
- **THEN** the vocabulary meaning format test fails because the kanji-less sense is not at the end

#### Scenario: Empty placeholder line in kanji is rejected

- **WHEN** a vocabulary entry has `kanji = "例一\n\n例三"`
- **THEN** the vocabulary meaning format test fails because `kanji` contains an empty placeholder line

#### Scenario: Duplicate text and kanji combination is rejected

- **WHEN** two vocabulary entries in the same dataset share identical `text` and identical `kanji` values
- **THEN** the vocabulary meaning format test fails and reports both entries

##### Example: duplicate vs same-sound-different-kanji

| Entry A text | Entry A kanji | Entry B text | Entry B kanji | Expected checker result |
| ------------ | ------------- | ------------ | ------------- | ----------------------- |
| `あつい` | `暑い` | `あつい` | `暑い` | fail: duplicate `text + kanji` |
| `あつい` | `暑い` | `あつい` | `熱い` | pass: same sound but different kanji |

## ADDED Requirements

### Requirement: Vocabulary entries are uniquely identified by text plus kanji

A vocabulary dataset SHALL treat the pair of full `text` value and full `kanji` value (including any internal newline characters) as the uniqueness key for entries. Two entries with identical `text` and identical `kanji` MUST NOT both exist in the dataset; an entry that would duplicate this pair MUST be rejected before being added. Two entries that share `text` but differ in `kanji` (homophones with different kanji spellings) SHALL be permitted as separate entries.

#### Scenario: Adding a fully duplicate entry is rejected

- **WHEN** a new vocabulary entry has the same `text` and same `kanji` as an existing entry
- **THEN** the dataset rejects the new entry and surfaces an error during validation
- **AND** the existing entry remains unchanged

##### Example: rejected duplicate

| Existing entry text | Existing entry kanji | New entry text | New entry kanji | Expected outcome |
| ------------------- | -------------------- | -------------- | --------------- | ---------------- |
| `から` | `殻\n空` | `から` | `殻\n空` | rejected |

#### Scenario: Same sound with different kanji is allowed

- **WHEN** a new vocabulary entry has the same `text` as an existing entry but a different `kanji` value
- **THEN** the dataset accepts the new entry as a separate record

##### Example: homophone accepted

| Existing entry text | Existing entry kanji | New entry text | New entry kanji | Expected outcome |
| ------------------- | -------------------- | -------------- | --------------- | ---------------- |
| `あつい` | `暑い` | `あつい` | `熱い` | accepted as separate entry |

### Requirement: New vocabulary entries are appended to their stage section

A new vocabulary entry SHALL be appended to the end of its target `stage` section in the dataset source file. The entry MUST NOT be inserted in alphabetical, kana, or any other ordered position; existing entry order within the stage section MUST NOT be modified by an addition.

#### Scenario: New entry is appended to the end of its stage section

- **WHEN** a new vocabulary entry with `stage = "N5"` is added to the dataset
- **THEN** the new entry appears as the last entry of the `N5` stage section in the source file
- **AND** the relative order of all pre-existing `N5` entries remains unchanged

##### Example: kara appended to N5

- **GIVEN** the existing N5 section ends with an entry whose `text` is `わたし`
- **WHEN** a new entry with `text = "から"`, `kanji = "殻\n空"`, `meaning = "外殼\n空(無內容)\n從～、因為～；助詞"`, `stage = "N5"` is added
- **THEN** the entry order in the N5 section ends with `..., わたし, から`
