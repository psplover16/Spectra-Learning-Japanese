## ADDED Requirements

### Requirement: Section completion checkbox

The N5 grammar page SHALL show a completion checkbox in each section header at the position formerly occupied by the expand/collapse arrow. The system MUST NOT show the arrow glyphs for section expansion state.

#### Scenario: Checkbox is rendered without arrow glyphs

- **WHEN** the N5 grammar page renders a section header
- **THEN** the header contains one completion checkbox
- **AND** the header does not contain an expand/collapse arrow glyph

### Requirement: Completion checkbox does not toggle expansion

Checking or unchecking the completion checkbox MUST NOT toggle the section expansion state by click event propagation.

#### Scenario: Checking a collapsed section

- **WHEN** a user checks the completion checkbox on a collapsed section
- **THEN** the section remains collapsed
- **AND** the section is marked completed

##### Example: collapsed section checked

- **GIVEN** section id `sentence-basics` is collapsed and not completed
- **WHEN** the user checks its completion checkbox
- **THEN** section id `sentence-basics` remains collapsed and completed

#### Scenario: Unchecking a completed section

- **WHEN** a user unchecks the completion checkbox on a completed section
- **THEN** the section remains collapsed
- **AND** the section is no longer marked completed

##### Example: completed section unchecked

- **GIVEN** section id `sentence-basics` is collapsed and completed
- **WHEN** the user unchecks its completion checkbox
- **THEN** section id `sentence-basics` remains collapsed and not completed

### Requirement: Completed sections are locked closed

A section marked completed SHALL be collapsed and MUST NOT expand until the user removes the completed mark.

#### Scenario: Completing an expanded section

- **WHEN** a user checks the completion checkbox on an expanded section
- **THEN** the section collapses immediately
- **AND** title toggle activation does not expand the section while the checkbox remains checked

##### Example: expanded section completed

- **GIVEN** section id `polite-overview` is expanded and not completed
- **WHEN** the user checks its completion checkbox
- **THEN** section id `polite-overview` becomes collapsed and completed

#### Scenario: Completed section title is activated

- **WHEN** a user activates the title toggle of a completed section
- **THEN** the section remains collapsed

### Requirement: Expansion state uses header background only

The N5 grammar section expansion state SHALL be communicated by the section header background color, with a near-white gray collapsed background and a darker background while expanded than while collapsed. The system MUST NOT rely on arrow glyphs to communicate expansion state.

#### Scenario: Section expands

- **WHEN** a user expands an uncompleted section
- **THEN** the section header uses the expanded background style
- **AND** the expanded background is darker than the collapsed background style

#### Scenario: Section collapses

- **WHEN** a user collapses an uncompleted section
- **THEN** the section header uses the collapsed background style
- **AND** the collapsed background is a near-white gray

### Requirement: Completion persistence

The N5 grammar completion state SHALL persist in localStorage using the key `duotify.n5Grammar.completed`. The persisted payload MUST include a version number, completed section ids, and an update timestamp.

#### Scenario: Completion is restored after reload

- **WHEN** a user marks section id `sentence-basics` completed and reloads the page
- **THEN** the section checkbox remains checked after reload
- **AND** the section remains collapsed and locked closed

##### Example: persisted completion payload

- **GIVEN** localStorage key `duotify.n5Grammar.completed` contains version 1 with completedSectionIds [`sentence-basics`]
- **WHEN** the N5 grammar page loads
- **THEN** section id `sentence-basics` renders completed, checked, collapsed, and locked closed

#### Scenario: Invalid persisted data is encountered

- **WHEN** localStorage contains an invalid completion payload
- **THEN** the system clears the invalid payload
- **AND** the N5 grammar page renders all sections as not completed

### Requirement: Sticky section headers

Each N5 grammar section header SHALL remain sticky at the top of the viewport while its section is the current visible section. The sticky header MUST use an opaque background.

#### Scenario: Scrolling within a section

- **WHEN** a user scrolls through an expanded N5 grammar section
- **THEN** that section header remains visible at the top of the viewport while the section remains current

#### Scenario: Scrolling into the next section

- **WHEN** a user scrolls past the current section into the next section
- **THEN** the next section header becomes the sticky header

### Requirement: Accessible section completion controls

The completion checkbox and title toggle SHALL expose accessible names and states. The title toggle MUST expose expansion state for uncompleted sections and MUST expose disabled state for completed sections.

#### Scenario: Checkbox accessible label

- **WHEN** assistive technology reads a completion checkbox
- **THEN** the checkbox accessible name includes the section title and indicates that it marks the section as completed

#### Scenario: Completed section accessibility state

- **WHEN** assistive technology reads the title toggle of a completed section
- **THEN** the title toggle exposes disabled state
- **AND** the section content remains collapsed
