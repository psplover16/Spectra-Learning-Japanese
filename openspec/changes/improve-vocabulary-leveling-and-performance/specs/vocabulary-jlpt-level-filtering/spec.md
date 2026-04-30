## ADDED Requirements

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

### Requirement: JLPT level filter controls

The vocabulary practice page SHALL display one checkbox for each JLPT level `N1` through `N5`, plus one select-all checkbox for the full level set.

#### Scenario: Initial level filter state

- **WHEN** the vocabulary practice page first renders
- **THEN** the `N1`, `N2`, `N3`, `N4`, and `N5` checkboxes are checked
- **AND** the select-all checkbox is checked
- **AND** the visible vocabulary includes every item allowed by the other active filters

#### Scenario: Level checkbox affects visible vocabulary

- **WHEN** a user leaves only the `N5` checkbox checked
- **THEN** the visible vocabulary includes `N5` items
- **AND** the visible vocabulary excludes `N1`, `N2`, `N3`, and `N4` items

##### Example: N5-only filtering

- **GIVEN** vocabulary items `alpha(stage=N5)`, `beta(stage=N4)`, and `gamma(stage=N1)`
- **WHEN** only `N5` is selected
- **THEN** the visible vocabulary contains `alpha` only

#### Scenario: No level checkbox is selected

- **WHEN** a user clears all JLPT level checkboxes
- **THEN** the visible vocabulary is empty
- **AND** the page does not throw a console error

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

### Requirement: Vocabulary count summary is removed

The vocabulary practice page SHALL NOT display the count summary text that reports the number of currently visible words.

#### Scenario: Count summary is absent

- **WHEN** the vocabulary practice page renders
- **THEN** no text in the page reports the visible vocabulary count in the format of a word-count summary

### Requirement: Vocabulary controls layout

The vocabulary practice page SHALL place JLPT level controls above the row containing practice mode, mark-only filter, and save marks controls.

#### Scenario: Level controls are above action controls

- **WHEN** the vocabulary practice controls render
- **THEN** the `N1`, `N2`, `N3`, `N4`, `N5`, and select-all checkboxes appear above the row containing practice mode, mark-only filter, and save marks controls

#### Scenario: Action controls share one row

- **WHEN** the action controls render
- **THEN** the practice mode checkbox and mark-only checkbox appear on the left side with a gap between them
- **AND** the save marks button appears on the right side of the same row

### Requirement: Efficient visible vocabulary derivation

The vocabulary page SHALL derive visible vocabulary through a single filtering path that applies normalized vocabulary data, selected JLPT levels, search state, mark-only state, and practice mode state consistently.

#### Scenario: Visible vocabulary has one source of truth

- **WHEN** a user changes JLPT level selection, search text, mark-only state, or practice mode
- **THEN** the table and vocabulary controls observe the same visible vocabulary result set
- **AND** the page does not duplicate separate visible-vocabulary derivations across unrelated components
