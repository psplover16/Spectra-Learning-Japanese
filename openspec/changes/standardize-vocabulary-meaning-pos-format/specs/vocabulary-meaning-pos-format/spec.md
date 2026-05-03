## ADDED Requirements

### Requirement: Vocabulary meanings use per-sense lines

Vocabulary dictionary entries SHALL format multiple meanings as separate lines in `meaning`. A vocabulary meaning SHALL NOT place multiple verb or adjective senses on one line with a single trailing part-of-speech marker.

#### Scenario: Multiple verb senses are split into separate lines

- **WHEN** a vocabulary entry has more than one verb sense
- **THEN** each sense is stored on its own `meaning` line
- **AND** each line contains its own verb class marker

##### Example: hataraku senses

| Entry text | Entry kanji | Expected meaning |
| ---------- | ----------- | ---------------- |
| `はたらく` | `働く` | `工作（五段動詞）\n起作用（五段動詞）` |

#### Scenario: Mixed multi-line meanings keep part-of-speech markers on every verb sense

- **WHEN** a vocabulary entry contains multiple lines and at least one line is a verb sense
- **THEN** every verb sense line contains a verb class marker

##### Example: kaeru senses

| Entry text | Entry kanji | Expected meaning |
| ---------- | ----------- | ---------------- |
| `かえる` | `帰る\n変える` | `回家（五段動詞）\n改變（一段動詞）` |

### Requirement: Vocabulary part-of-speech markers use full-width parentheses

Vocabulary dictionary part-of-speech markers in `meaning` SHALL use full-width Chinese parentheses. Half-width part-of-speech markers such as `(五段動詞)`, `(一段動詞)`, `(い形容詞)`, and `(な形容詞)` MUST NOT appear in vocabulary meanings.

#### Scenario: Verb marker uses full-width parentheses

- **WHEN** a vocabulary meaning contains a verb class marker
- **THEN** the marker is written with full-width parentheses

##### Example: full-width marker

| Invalid meaning | Expected meaning |
| --------------- | ---------------- |
| `給(一段動詞)` | `給（一段動詞）` |

### Requirement: Confirmed verbs and adjectives include part-of-speech markers

Confirmed vocabulary entries that are verbs or adjectives SHALL include a part-of-speech marker on every verb or adjective meaning line.

#### Scenario: Ichidan verb meanings are marked

- **WHEN** an entry is the confirmed ichidan verb `あげる`
- **THEN** every meaning line for that entry contains `（一段動詞）`

##### Example: ageru senses

| Entry text | Entry kanji | Expected meaning |
| ---------- | ----------- | ---------------- |
| `あげる` | `上げる\n挙げる` | `給（一段動詞）\n舉起（一段動詞）\n提出（一段動詞）` |

#### Scenario: Transitivity annotation does not replace verb class

- **WHEN** a meaning contains a transitivity annotation such as `他動` or `自動`
- **THEN** the same meaning line also contains a verb class marker when the entry is a confirmed verb

##### Example: transitive ageru

| Entry text | Entry kanji | Expected meaning |
| ---------- | ----------- | ---------------- |
| `あげる` | `上げる` | `提高（一段動詞；他動詞）` |

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

### Requirement: Vocabulary meaning format is automatically checked

The vocabulary test suite SHALL fail when current vocabulary data contains trailing shared part-of-speech markers, half-width part-of-speech markers, JMdict-classified verb/adjective entries without required markers, or unresolved JMdict lookup results without explicit allowlist reasons.

#### Scenario: Invalid format is rejected by tests

- **WHEN** vocabulary data contains `工作；運作(五段動詞)`
- **THEN** the vocabulary meaning format test fails

#### Scenario: Valid format passes tests

- **WHEN** vocabulary data contains `工作（五段動詞）\n起作用（五段動詞）`
- **THEN** the vocabulary meaning format test passes for that entry
