## MODIFIED Requirements

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

## ADDED Requirements

### Requirement: Vocabulary duplicate senses are consolidated before quiz use

Vocabulary data SHALL consolidate entries with the same `text` and same `kanji` value when their meanings are valid distinct senses. The consolidated entry SHALL keep all verified meanings as separate meaning lines and SHALL keep repeated kanji lines when those meanings share the same kanji spelling. The consolidated entry SHALL use the simplest JLPT stage among the duplicate source entries according to `N5`, `N4`, `N3`, `N2`, then `N1`.

#### Scenario: Same text and kanji across stages are merged

- **WHEN** `あげる` with the same `kanji` spelling appears in `N3` and `N5`
- **THEN** the vocabulary data contains one consolidated `あげる` entry in `N5`
- **AND** the entry keeps each verified distinct meaning as its own meaning line

#### Scenario: Different kanji homophones remain separate entries

- **WHEN** two entries have the same `text` but different `kanji` values
- **THEN** the vocabulary data keeps them as separate entries

### Requirement: New vocabulary senses are appended without violating kanji ordering

New kanji or meaning senses SHALL be appended at the end of the current entry editing operation, then normalized so every kanji-bearing sense appears before every kanji-less sense. The normalized entry MUST preserve one meaning line per sense and MUST preserve repeated kanji lines for distinct meanings that share the same kanji.

#### Scenario: New kanji-bearing sense is inserted before kanji-less tail

- **WHEN** a new kanji-bearing sense is added to an entry that already has a kanji-less final sense
- **THEN** the resulting entry places the new kanji-bearing sense before the kanji-less final sense
- **AND** the kanji-less sense remains at the end of `meaning`

### Requirement: Vocabulary meaning format is automatically checked

The vocabulary test suite SHALL fail when current vocabulary data contains trailing shared part-of-speech markers, half-width part-of-speech markers, JMdict-classified verb/adjective entries without required markers, unresolved JMdict lookup results without explicit allowlist reasons, kanji-bearing senses after kanji-less senses, missing required empty placeholder lines for non-final kanji-less tail senses, or duplicate unconsolidated entries with the same `text` and same `kanji` value.

#### Scenario: Invalid format is rejected by tests

- **WHEN** vocabulary data contains `工作；運作(五段動詞)`
- **THEN** the vocabulary meaning format test fails

#### Scenario: Valid format passes tests

- **WHEN** vocabulary data contains `工作（五段動詞）\n起作用（五段動詞）`
- **THEN** the vocabulary meaning format test passes for that entry

#### Scenario: Kanji-bearing sense after kanji-less sense is rejected

- **WHEN** vocabulary data contains `kanji = "例一\n\n例三"` and `meaning = "第一義\n第二義無漢字\n第三義"`
- **THEN** the vocabulary meaning format test fails

#### Scenario: Unconsolidated duplicate text and kanji is rejected

- **WHEN** two vocabulary entries have the same `text` and same complete `kanji` value
- **THEN** the vocabulary meaning format test fails and reports both entries
