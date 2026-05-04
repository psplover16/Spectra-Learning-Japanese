## MODIFIED Requirements

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

## ADDED Requirements

### Requirement: Vocabulary data is split by JLPT level files

Vocabulary source data SHALL be stored in one raw data file per JLPT level: `jpWords_N1.ts`, `jpWords_N2.ts`, `jpWords_N3.ts`, `jpWords_N4.ts`, and `jpWords_N5.ts`. Each file SHALL export only entries whose `stage` matches the file level. The legacy all-in-one vocabulary data file SHALL NOT be retained as a source file or used by the vocabulary session.

#### Scenario: Stage file contains matching stage entries

- **WHEN** the `jpWords_N5.ts` data file is imported
- **THEN** every raw vocabulary entry in that file has `stage = "N5"`

#### Scenario: Vocabulary session does not import all stages eagerly

- **WHEN** the vocabulary session initializes
- **THEN** it does not load every JLPT vocabulary data file through a single eager runtime import

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

### Requirement: Duplicate entries use the simplest JLPT stage

When vocabulary entries with the same `text` and same `kanji` are consolidated across multiple JLPT levels, the resulting entry SHALL use the simplest level among the source entries according to `N5`, `N4`, `N3`, `N2`, then `N1`.

#### Scenario: Duplicate N3 and N5 entry becomes N5

- **WHEN** matching entries exist in `N3` and `N5`
- **THEN** the consolidated vocabulary entry has `stage = "N5"`

#### Scenario: Duplicate N1 and N3 entry becomes N3

- **WHEN** matching entries exist in `N1` and `N3`
- **THEN** the consolidated vocabulary entry has `stage = "N3"`
