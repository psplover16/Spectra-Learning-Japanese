## MODIFIED Requirements

### Requirement: JLPT level filter controls

The vocabulary practice page SHALL display one checkbox for each JLPT level `N1` through `N5` and SHALL NOT display a select-all checkbox for the full level set. Each individual JLPT checkbox SHALL correspond to the vocabulary data file for the same level, and the visible vocabulary SHALL include only entries from selected levels after those level files are loaded. The JLPT level controls row SHALL place the `N1`, `N2`, `N3`, `N4`, and `N5` checkboxes on the left side of the row and SHALL reserve the right side of the same row for the start-quiz control.

#### Scenario: Initial level filter state

- **WHEN** the vocabulary practice page first renders
- **THEN** the `N1`, `N2`, `N3`, `N4`, and `N5` checkboxes are checked
- **AND** no select-all checkbox is displayed
- **AND** the visible vocabulary includes every loaded item allowed by the other active filters
- **AND** the start-quiz control appears on the right side of the same JLPT level controls row

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

### Requirement: Vocabulary controls layout

The vocabulary practice page SHALL place JLPT level controls above the action controls row. The JLPT level controls row SHALL place individual JLPT level checkboxes on the left side and the start-quiz control on the right side. The action controls row SHALL place practice mode and mark-only controls on the left side and the save-marks control on the right side. The action controls row SHALL use the same padding, background color, border treatment, and rounded corners as the JLPT level controls row so both rows align from the same visual starting edge and read as one consistent control group. The vocabulary practice page SHALL stack the upper non-table control blocks with an 8px vertical gap between adjacent blocks.

#### Scenario: Level controls are above action controls

- **WHEN** the vocabulary practice controls render
- **THEN** the `N1`, `N2`, `N3`, `N4`, and `N5` checkboxes appear above the row containing practice mode, mark-only filter, and save marks controls
- **AND** no select-all checkbox appears in the level controls row

#### Scenario: JLPT row shares start quiz control

- **WHEN** the JLPT level controls row renders with at least one visible vocabulary row
- **THEN** the `N1`, `N2`, `N3`, `N4`, and `N5` checkboxes appear on the left side of that row
- **AND** the start-quiz control appears on the right side of that row

#### Scenario: Action controls share one row

- **WHEN** the action controls render
- **THEN** the practice mode checkbox and mark-only checkbox appear on the left side with a gap between them
- **AND** the save marks button appears on the right side of the same row
- **AND** the action controls row uses the same padding, background color, border treatment, and rounded corners as the JLPT level controls row

#### Scenario: Upper control blocks have an 8px vertical gap

- **WHEN** the vocabulary practice controls render
- **THEN** the search/global filter block, JLPT level controls block, and action controls block are stacked vertically with an 8px gap between adjacent blocks

## REMOVED Requirements

### Requirement: Select-all level synchronization

**Reason**: The JLPT select-all checkbox is removed so individual `N1`, `N2`, `N3`, `N4`, and `N5` checkboxes are the only level-selection controls.
**Migration**: Users change the selected JLPT level set by toggling individual level checkboxes. Tests and UI interactions that targeted the select-all level checkbox SHALL target the individual JLPT level checkboxes instead.

#### Scenario: Select-all checkbox is absent

- **WHEN** the vocabulary practice controls render
- **THEN** no select-all level checkbox is displayed
- **AND** level selection is controlled only by the `N1`, `N2`, `N3`, `N4`, and `N5` checkboxes
