## ADDED Requirements

### Requirement: Saving vocabulary marks merges only visible entries

The vocabulary save-marks action SHALL persist a merge of currently visible vocabulary row keys into the existing version 2 localStorage mark snapshot. The system MUST capture the visible row key scope at the moment the user invokes save. For each key in that scope, the system SHALL write the key when draft marks contain it and SHALL remove the key when draft marks do not contain it. The system SHALL preserve every persisted key that is outside that scope. The visible row key scope MUST reflect active search, selected JLPT levels, marked-only state, practice mode state, loaded vocabulary data, and any other filter that affects the rows currently shown on the page.

#### Scenario: Saving checked visible entry preserves hidden persisted entry

- **WHEN** entries `A(stage=N1)` and `B(stage=N5)` are persisted marks
- **AND** the current visible row scope contains only `A(stage=N1)`
- **AND** draft marks contain `A(stage=N1)`
- **AND** the user invokes save marks
- **THEN** localStorage contains the key for `A(stage=N1)`
- **AND** localStorage still contains the key for `B(stage=N5)`

#### Scenario: Saving unchecked visible entry removes only that visible entry

- **WHEN** entries `A(stage=N1)` and `B(stage=N5)` are persisted marks
- **AND** the current visible row scope contains only `A(stage=N1)`
- **AND** draft marks do not contain `A(stage=N1)`
- **AND** the user invokes save marks
- **THEN** localStorage does not contain the key for `A(stage=N1)`
- **AND** localStorage still contains the key for `B(stage=N5)`

#### Scenario: Visible scope follows active filters

- **WHEN** search text, selected JLPT levels, marked-only state, or practice mode changes the visible vocabulary rows
- **AND** the user invokes save marks
- **THEN** only keys for rows visible after those filters are applied are merged into localStorage
- **AND** persisted keys for filtered-out rows remain unchanged

### Requirement: Table header clear removes only visible vocabulary marks

The table header clear-mark checkbox SHALL clear mark state only for the currently visible vocabulary row keys. The system MUST capture the visible row key scope at the moment the user invokes the clear action. After confirmation, the system SHALL remove keys in that scope from localStorage, persisted marks, and draft marks. The system SHALL preserve every key outside that scope. If a confirmation message is shown, the message MUST identify the current page or currently visible vocabulary rows and MUST NOT state that all marks are being cleared.

#### Scenario: Header clear preserves hidden persisted entry

- **WHEN** entries `A(stage=N1)` and `B(stage=N5)` are persisted marks
- **AND** the current visible row scope contains only `A(stage=N1)`
- **AND** the user invokes the table header clear-mark checkbox and confirms
- **THEN** localStorage does not contain the key for `A(stage=N1)`
- **AND** localStorage still contains the key for `B(stage=N5)`
- **AND** draft marks do not contain the key for `A(stage=N1)`

#### Scenario: Header clear confirmation describes visible scope

- **WHEN** the user invokes the table header clear-mark checkbox
- **THEN** any confirmation message identifies the operation as clearing the current page or currently visible vocabulary rows
- **AND** the confirmation message does not describe the operation as clearing all marks
