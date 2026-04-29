## ADDED Requirements

### Requirement: Fixed Source Target
The system SHALL use `C:\Users\Gary\Documents\Japanese_Word_Practice_Vue_AI` on branch `017-refine-n5-content` as the authoritative source target for this parity change.

#### Scenario: Source target verification

- **WHEN** implementation work starts
- **THEN** the source path and branch SHALL be verified before any parity inventory item is marked ready for recreation

### Requirement: Source Parity Inventory
The system SHALL create a parity inventory that records every user-visible page, route, component group, interaction flow, UI state, visible copy category, visual rule, data flow, offline persistence behavior, import or export flow, setting, and progress behavior discovered in the source target.

#### Scenario: Inventory item creation

- **WHEN** a user-visible source behavior is discovered
- **THEN** the parity inventory SHALL record its source location, expected observable behavior, UI states, data dependencies, offline behavior, and acceptance evidence

##### Example: Page states

- **GIVEN** a source page has empty, active, and completed states
- **WHEN** the page is added to the parity inventory
- **THEN** the inventory entry contains empty, active, and completed states as separate acceptance items

### Requirement: Observable Behavior Parity
The system SHALL recreate every parity inventory item in this project so that the user-visible behavior matches the source target.

#### Scenario: Recreated interaction flow

- **WHEN** a user performs an inventoried source flow in this project
- **THEN** the same visible actions, state transitions, persisted results, and completion outcomes SHALL be available in the same user-facing order

### Requirement: Visual And Responsive Parity
The system SHALL match the source target's layout, control hierarchy, visible text meaning, colors, spacing, typography scale, UI states, and responsive behavior for every parity inventory item unless a documented project constraint prevents exact matching.

#### Scenario: Visual parity acceptance

- **WHEN** a recreated screen is reviewed against its source inventory entry
- **THEN** the parity checklist SHALL include evidence for layout, controls, visible text meaning, state coverage, and mobile responsive behavior

#### Scenario: Documented unavoidable difference

- **WHEN** an exact visual match is blocked by a project constraint
- **THEN** the parity checklist SHALL document the source behavior, the project constraint, the user-visible difference, and the acceptance decision

### Requirement: Offline Data Parity
The system SHALL make recreated core learning flows, settings, progress, and persisted user data available without network access. The system SHALL NOT add cloud synchronization for this change.

#### Scenario: Offline core flow

- **WHEN** network access is unavailable
- **THEN** recreated core learning flows SHALL load from local application assets and persisted local data

#### Scenario: Local-only persistence

- **WHEN** a recreated flow changes settings, progress, or user-owned learning data
- **THEN** the system SHALL persist the change locally and SHALL NOT require remote conflict resolution

### Requirement: Parity Verification Checklist
The system SHALL maintain a parity checklist that links each parity inventory item to implementation status, functional evidence, visual evidence, responsive evidence, offline evidence, and known differences.

#### Scenario: Checklist completion gate

- **WHEN** implementation reaches the final verification step
- **THEN** every parity inventory item SHALL be marked complete or documented as an accepted difference with supporting evidence
