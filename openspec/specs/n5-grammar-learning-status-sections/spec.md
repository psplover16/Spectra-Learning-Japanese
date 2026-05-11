# n5-grammar-learning-status-sections Specification

## Purpose

TBD - created by archiving change 'improve-pwa-versioning-and-n5-learning-sections'. Update Purpose after archive.

## Requirements

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


<!-- @trace
source: improve-pwa-versioning-and-n5-learning-sections
updated: 2026-05-01
code:
  - src/env.d.ts
  - src/modules/pwa/services/pwaLifecycleService.ts
  - src/shared/version/appVersion.ts
  - src/modules/n5Grammar/views/N5GrammarView.vue
  - tests/mocks/pwaRegisterMock.ts
  - src/styles/main.css
  - PROJECT_ARCHITECTURE.md
  - _private/筆記.md
  - package.json
  - src/shared/components/AppVersionLabel.vue
  - src/modules/practice/views/PracticeView.vue
  - src/app/main.ts
  - vite.config.ts
  - src/modules/grammar/views/GrammarView.vue
  - src/modules/pwa/composables/usePwaLifecycle.ts
tests:
  - tests/component/GrammarLevelRoutes.spec.ts
  - tests/unit/routeRootVerticalPadding.spec.ts
  - tests/unit/pwaLifecycleService.spec.ts
  - tests/component/N5GrammarSections.spec.ts
  - tests/component/PracticeViewSmoke.spec.ts
  - tests/component/GrammarViewSmoke.spec.ts
  - tests/unit/appMain.spec.ts
  - tests/component/VocabularyViewSmoke.spec.ts
  - tests/component/AppVersionLabel.spec.ts
  - tests/unit/appVersion.spec.ts
  - tests/unit/publicAssets.spec.ts
-->

---
### Requirement: Existing in-zone order MUST be preserved

Within each zone, sections SHALL appear in the same order they appear in the existing source data. This change MUST NOT introduce additional sorting beyond the unfinished/finished split.

#### Scenario: Order within each zone is preserved

- **GIVEN** the original section order is A, B, C, D where A and D are unchecked
- **WHEN** the page renders
- **THEN** the upper zone shows A then D
- **AND** the lower zone shows B then C


<!-- @trace
source: improve-pwa-versioning-and-n5-learning-sections
updated: 2026-05-01
code:
  - src/env.d.ts
  - src/modules/pwa/services/pwaLifecycleService.ts
  - src/shared/version/appVersion.ts
  - src/modules/n5Grammar/views/N5GrammarView.vue
  - tests/mocks/pwaRegisterMock.ts
  - src/styles/main.css
  - PROJECT_ARCHITECTURE.md
  - _private/筆記.md
  - package.json
  - src/shared/components/AppVersionLabel.vue
  - src/modules/practice/views/PracticeView.vue
  - src/app/main.ts
  - vite.config.ts
  - src/modules/grammar/views/GrammarView.vue
  - src/modules/pwa/composables/usePwaLifecycle.ts
tests:
  - tests/component/GrammarLevelRoutes.spec.ts
  - tests/unit/routeRootVerticalPadding.spec.ts
  - tests/unit/pwaLifecycleService.spec.ts
  - tests/component/N5GrammarSections.spec.ts
  - tests/component/PracticeViewSmoke.spec.ts
  - tests/component/GrammarViewSmoke.spec.ts
  - tests/unit/appMain.spec.ts
  - tests/component/VocabularyViewSmoke.spec.ts
  - tests/component/AppVersionLabel.spec.ts
  - tests/unit/appVersion.spec.ts
  - tests/unit/publicAssets.spec.ts
-->

---
### Requirement: Zone containers MUST follow specified spacing rules

Each rendered zone container SHALL have zero padding. When both the unfinished zone and the finished zone are rendered, the two zones SHALL be separated by a 1rem gap.

#### Scenario: Spacing matches the spec

- **WHEN** the N5 grammar page renders both zones
- **THEN** each zone container has padding 0
- **AND** the visual gap between the two zones is 1rem


<!-- @trace
source: improve-pwa-versioning-and-n5-learning-sections
updated: 2026-05-01
code:
  - src/env.d.ts
  - src/modules/pwa/services/pwaLifecycleService.ts
  - src/shared/version/appVersion.ts
  - src/modules/n5Grammar/views/N5GrammarView.vue
  - tests/mocks/pwaRegisterMock.ts
  - src/styles/main.css
  - PROJECT_ARCHITECTURE.md
  - _private/筆記.md
  - package.json
  - src/shared/components/AppVersionLabel.vue
  - src/modules/practice/views/PracticeView.vue
  - src/app/main.ts
  - vite.config.ts
  - src/modules/grammar/views/GrammarView.vue
  - src/modules/pwa/composables/usePwaLifecycle.ts
tests:
  - tests/component/GrammarLevelRoutes.spec.ts
  - tests/unit/routeRootVerticalPadding.spec.ts
  - tests/unit/pwaLifecycleService.spec.ts
  - tests/component/N5GrammarSections.spec.ts
  - tests/component/PracticeViewSmoke.spec.ts
  - tests/component/GrammarViewSmoke.spec.ts
  - tests/unit/appMain.spec.ts
  - tests/component/VocabularyViewSmoke.spec.ts
  - tests/component/AppVersionLabel.spec.ts
  - tests/unit/appVersion.spec.ts
  - tests/unit/publicAssets.spec.ts
-->

---
### Requirement: Checkbox semantics MUST remain unchanged

The completion checkbox in each section header SHALL continue to represent "is this section learned" as defined in the existing `n5-grammar-section-completion` capability. Toggling the checkbox SHALL move that section between zones immediately.

#### Scenario: Toggling checkbox moves a section between zones

- **GIVEN** section A is in the unfinished zone with its checkbox unchecked
- **WHEN** the user checks section A's checkbox
- **THEN** section A moves to the finished zone
- **AND** section A's content and order within the zone follow the rules above


<!-- @trace
source: improve-pwa-versioning-and-n5-learning-sections
updated: 2026-05-01
code:
  - src/env.d.ts
  - src/modules/pwa/services/pwaLifecycleService.ts
  - src/shared/version/appVersion.ts
  - src/modules/n5Grammar/views/N5GrammarView.vue
  - tests/mocks/pwaRegisterMock.ts
  - src/styles/main.css
  - PROJECT_ARCHITECTURE.md
  - _private/筆記.md
  - package.json
  - src/shared/components/AppVersionLabel.vue
  - src/modules/practice/views/PracticeView.vue
  - src/app/main.ts
  - vite.config.ts
  - src/modules/grammar/views/GrammarView.vue
  - src/modules/pwa/composables/usePwaLifecycle.ts
tests:
  - tests/component/GrammarLevelRoutes.spec.ts
  - tests/unit/routeRootVerticalPadding.spec.ts
  - tests/unit/pwaLifecycleService.spec.ts
  - tests/component/N5GrammarSections.spec.ts
  - tests/component/PracticeViewSmoke.spec.ts
  - tests/component/GrammarViewSmoke.spec.ts
  - tests/unit/appMain.spec.ts
  - tests/component/VocabularyViewSmoke.spec.ts
  - tests/component/AppVersionLabel.spec.ts
  - tests/unit/appVersion.spec.ts
  - tests/unit/publicAssets.spec.ts
-->

---
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

<!-- @trace
source: improve-pwa-versioning-and-n5-learning-sections
updated: 2026-05-01
code:
  - src/env.d.ts
  - src/modules/pwa/services/pwaLifecycleService.ts
  - src/shared/version/appVersion.ts
  - src/modules/n5Grammar/views/N5GrammarView.vue
  - tests/mocks/pwaRegisterMock.ts
  - src/styles/main.css
  - PROJECT_ARCHITECTURE.md
  - _private/筆記.md
  - package.json
  - src/shared/components/AppVersionLabel.vue
  - src/modules/practice/views/PracticeView.vue
  - src/app/main.ts
  - vite.config.ts
  - src/modules/grammar/views/GrammarView.vue
  - src/modules/pwa/composables/usePwaLifecycle.ts
tests:
  - tests/component/GrammarLevelRoutes.spec.ts
  - tests/unit/routeRootVerticalPadding.spec.ts
  - tests/unit/pwaLifecycleService.spec.ts
  - tests/component/N5GrammarSections.spec.ts
  - tests/component/PracticeViewSmoke.spec.ts
  - tests/component/GrammarViewSmoke.spec.ts
  - tests/unit/appMain.spec.ts
  - tests/component/VocabularyViewSmoke.spec.ts
  - tests/component/AppVersionLabel.spec.ts
  - tests/unit/appVersion.spec.ts
  - tests/unit/publicAssets.spec.ts
-->

---
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
