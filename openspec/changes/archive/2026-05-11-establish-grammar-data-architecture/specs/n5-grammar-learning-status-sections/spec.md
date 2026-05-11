## ADDED Requirements

### Requirement: N5 grammar section content SHALL be DOM-mounted only when the section is expanded

Each `N5GrammarSectionCard` SHALL render its inner content (description, topics, tables, examples, table example groups, source coverage references) only while the section is in the expanded state. Collapsed sections SHALL NOT have their inner content present in the DOM.

The card header (title, completion checkbox, expand/collapse control, sticky background) SHALL remain present in the DOM regardless of expansion state.

#### Scenario: Collapsed section omits inner content from DOM

- **GIVEN** the N5 grammar page has fully loaded
- **AND** a section is in the collapsed state (default)
- **WHEN** the user inspects the DOM
- **THEN** the section's title, completion checkbox, and expand control SHALL be present
- **AND** the section's inner content (description, topics, tables, examples) SHALL NOT be present in the DOM

#### Scenario: Expanding a section mounts the inner content

- **GIVEN** a collapsed section
- **WHEN** the user expands the section via its expand control
- **THEN** the section's inner content SHALL mount into the DOM
- **AND** the rendered content SHALL match the section data (same title, examples, tables) it would have shown under the previous always-mounted implementation

#### Scenario: Collapsing a section unmounts the inner content

- **GIVEN** an expanded section
- **WHEN** the user collapses the section (or marks it as completed which triggers auto-collapse)
- **THEN** the section's inner content SHALL be removed from the DOM
