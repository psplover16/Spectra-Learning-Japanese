## MODIFIED Requirements

### Requirement: Vocabulary quiz starts from visible marked vocabulary

The vocabulary practice page SHALL provide a start-quiz control on the right side of the JLPT level controls row. The control SHALL be hidden when there are no currently visible vocabulary rows. The control SHALL be visible but disabled when at least one vocabulary row is currently visible and no currently visible vocabulary row is marked in either the draft mark set or the persisted mark set. The control SHALL be enabled only when at least one currently visible vocabulary row is marked in either the draft mark set or the persisted mark set. The quiz deck SHALL be created from a snapshot of currently visible marked vocabulary entries at the moment the quiz starts.

#### Scenario: Start quiz is hidden with no visible entries

- **WHEN** the vocabulary practice page has no visible vocabulary rows
- **THEN** the start-quiz control is hidden

#### Scenario: Start quiz is disabled with visible entries but no visible marked entries

- **WHEN** the vocabulary practice page has at least one visible vocabulary row
- **AND** no visible vocabulary row has a checked mark checkbox from draft or persisted marks
- **THEN** the start-quiz control is visible
- **AND** the start-quiz control is disabled

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
