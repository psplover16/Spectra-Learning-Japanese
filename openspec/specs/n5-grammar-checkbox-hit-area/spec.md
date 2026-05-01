# n5-grammar-checkbox-hit-area Specification

## Purpose

TBD - created by archiving change 'expand-n5-grammar-checkbox-hit-area'. Update Purpose after archive.

## Requirements

### Requirement: Checkbox hit area MUST be expanded without visual redesign

The N5 grammar section completion checkbox SHALL provide a larger clickable and touchable hit area than the visible checkbox control. The visible checkbox control MUST keep its existing visual size and styling.

#### Scenario: Expanded hit area toggles completion

- **GIVEN** an N5 grammar section is visible on a mobile-width viewport
- **WHEN** the user activates the expanded checkbox hit area around the visible checkbox
- **THEN** the section completion checkbox state toggles
- **AND** the visible checkbox styling remains unchanged


<!-- @trace
source: expand-n5-grammar-checkbox-hit-area
updated: 2026-05-01
code:
  - PROJECT_ARCHITECTURE.md
  - _private/discuss.txt
  - _private/筆記.md
  - _private/propose.md
  - src/styles/main.css
  - src/modules/n5Grammar/components/N5GrammarSectionCard.vue
tests:
  - tests/component/N5GrammarSections.spec.ts
-->

---
### Requirement: Checkbox hit area MUST NOT toggle section expansion

Activating the expanded checkbox hit area SHALL NOT trigger the section expand or collapse action.

#### Scenario: Checkbox activation does not expand a collapsed section

- **GIVEN** an N5 grammar section is collapsed and its completion checkbox is unchecked
- **WHEN** the user activates the expanded checkbox hit area
- **THEN** the completion checkbox becomes checked
- **AND** the section remains collapsed

#### Scenario: Checkbox activation does not collapse an expanded section

- **GIVEN** an N5 grammar section is expanded and its completion checkbox is unchecked
- **WHEN** the user activates the expanded checkbox hit area
- **THEN** the completion checkbox becomes checked
- **AND** the section remains expanded unless completed-state behavior explicitly locks it collapsed


<!-- @trace
source: expand-n5-grammar-checkbox-hit-area
updated: 2026-05-01
code:
  - PROJECT_ARCHITECTURE.md
  - _private/discuss.txt
  - _private/筆記.md
  - _private/propose.md
  - src/styles/main.css
  - src/modules/n5Grammar/components/N5GrammarSectionCard.vue
tests:
  - tests/component/N5GrammarSections.spec.ts
-->

---
### Requirement: Section expand control MUST NOT toggle checkbox state

Activating the N5 grammar section expand or collapse control SHALL NOT toggle the completion checkbox state.

#### Scenario: Expand control opens section without checking checkbox

- **GIVEN** an N5 grammar section is collapsed and its completion checkbox is unchecked
- **WHEN** the user activates the section expand control
- **THEN** the section expands
- **AND** the completion checkbox remains unchecked

#### Scenario: Collapse control closes section without checking checkbox

- **GIVEN** an N5 grammar section is expanded and its completion checkbox is unchecked
- **WHEN** the user activates the section collapse control
- **THEN** the section collapses
- **AND** the completion checkbox remains unchecked

<!-- @trace
source: expand-n5-grammar-checkbox-hit-area
updated: 2026-05-01
code:
  - PROJECT_ARCHITECTURE.md
  - _private/discuss.txt
  - _private/筆記.md
  - _private/propose.md
  - src/styles/main.css
  - src/modules/n5Grammar/components/N5GrammarSectionCard.vue
tests:
  - tests/component/N5GrammarSections.spec.ts
-->