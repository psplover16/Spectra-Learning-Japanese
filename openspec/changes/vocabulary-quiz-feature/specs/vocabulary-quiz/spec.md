## ADDED Requirements

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
