## ADDED Requirements

### Requirement: N5 grammar page MUST split sections by learning status

The N5 grammar page SHALL render two top-level zones: an "unfinished" zone above and a "finished" zone below. Each existing section container SHALL be placed in the zone matching the state of its completion checkbox.

#### Scenario: Sections distribute by checkbox state

- **WHEN** the N5 grammar page renders
- **THEN** containers whose completion checkbox is unchecked appear in the upper (unfinished) zone
- **AND** containers whose completion checkbox is checked appear in the lower (finished) zone

##### Example: three sections distributed
- **GIVEN** sections in original order: A (unchecked), B (checked), C (unchecked)
- **WHEN** the page renders
- **THEN** the upper zone contains A then C in that order
- **AND** the lower zone contains B

### Requirement: Existing in-zone order MUST be preserved

Within each zone, sections SHALL appear in the same order they appear in the existing source data. This change MUST NOT introduce additional sorting beyond the unfinished/finished split.

#### Scenario: Order within each zone is preserved

- **GIVEN** the original section order is A, B, C, D where A and D are unchecked
- **WHEN** the page renders
- **THEN** the upper zone shows A then D
- **AND** the lower zone shows B then C

### Requirement: Zone containers MUST follow specified spacing rules

Each rendered zone container SHALL have zero padding. When both the unfinished zone and the finished zone are rendered, the two zones SHALL be separated by a 1rem gap.

#### Scenario: Spacing matches the spec

- **WHEN** the N5 grammar page renders both zones
- **THEN** each zone container has padding 0
- **AND** the visual gap between the two zones is 1rem

### Requirement: Checkbox semantics MUST remain unchanged

The completion checkbox in each section header SHALL continue to represent "is this section learned" as defined in the existing `n5-grammar-section-completion` capability. Toggling the checkbox SHALL move that section between zones immediately.

#### Scenario: Toggling checkbox moves a section between zones

- **GIVEN** section A is in the unfinished zone with its checkbox unchecked
- **WHEN** the user checks section A's checkbox
- **THEN** section A moves to the finished zone
- **AND** section A's content and order within the zone follow the rules above

### Requirement: Empty finished zone MUST be hidden

The N5 grammar page SHALL NOT render the finished zone when there are zero completed sections. The page SHALL render the finished zone when one or more completed sections exist.

#### Scenario: Finished zone is absent with no completed sections

- **GIVEN** every N5 grammar section is unfinished
- **WHEN** the N5 grammar page renders
- **THEN** the unfinished zone is rendered
- **AND** the finished zone is not rendered

#### Scenario: Finished zone appears after a section is completed

- **GIVEN** section A is unfinished
- **WHEN** the user checks section A's completion checkbox
- **THEN** the finished zone is rendered
- **AND** section A appears in the finished zone
