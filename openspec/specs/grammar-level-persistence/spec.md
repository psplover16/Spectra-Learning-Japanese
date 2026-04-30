# grammar-level-persistence Specification

## Purpose

TBD - created by archiving change 'add-persistent-grammar-level-route-switcher'. Update Purpose after archive.

## Requirements

### Requirement: Persist selected grammar level

The system SHALL persist the selected grammar level in localStorage under the key `duotify.grammar.selectedLevel`. The persisted value SHALL represent only a configured grammar level value, such as `N1` or `N5`; labels and routes SHALL be derived from the current grammar level configuration.

#### Scenario: Selection is saved

- **WHEN** the user selects `N1文法` from the grammar level submenu
- **THEN** localStorage key `duotify.grammar.selectedLevel` stores the selected level value `N1`
- **AND** the primary grammar route control uses `N1文法` as its label

#### Scenario: No route data is duplicated in storage

- **WHEN** the system saves the selected grammar level preference
- **THEN** the stored preference contains the selected grammar level value
- **AND** the stored preference does not store a route path
- **AND** the stored preference does not store a display label


<!-- @trace
source: add-persistent-grammar-level-route-switcher
updated: 2026-05-01
code:
  - src/app/router.ts
  - _private/propose.md
  - src/modules/grammar/views/N1GrammarView.vue
  - src/modules/grammar/storage/grammarLevelStorage.ts
  - src/modules/grammar/views/N3GrammarView.vue
  - src/shared/config/storageKeys.ts
  - src/modules/grammar/views/N2GrammarView.vue
  - PROJECT_ARCHITECTURE.md
  - src/modules/grammar/config/grammarLevels.ts
  - src/modules/grammar/views/N4GrammarView.vue
  - src/modules/grammar/composables/useGrammarLevel.ts
  - _private/discuss.txt
  - src/modules/grammar/components/GrammarLevelSwitcher.vue
  - src/styles/main.css
  - _private/筆記.md
  - src/shared/components/RouteSubMenu.vue
  - src/app/AppShell.vue
  - tests/e2e/testUtils.ts
  - src/shared/components/RouteTabs.vue
tests:
  - tests/component/GrammarLevelRoutes.spec.ts
  - tests/e2e/app-shell.smoke.spec.ts
  - tests/unit/grammarLevelStorage.spec.ts
  - tests/component/RouteSubMenu.spec.ts
  - tests/component/AppShellSmoke.spec.ts
-->

---
### Requirement: Restore selected grammar level

The system SHALL restore the selected grammar level from localStorage during app startup when the stored value is valid for the current grammar level configuration and its route exists. The grammar level submenu SHALL remain closed after startup.

#### Scenario: Valid preference restores after restart

- **GIVEN** localStorage key `duotify.grammar.selectedLevel` contains `N1`
- **WHEN** the app starts
- **THEN** the selected grammar level is `N1`
- **AND** the primary grammar route control label is `N1文法`
- **AND** the primary grammar route control target is `/n1-grammar`
- **AND** the grammar level submenu is closed


<!-- @trace
source: add-persistent-grammar-level-route-switcher
updated: 2026-05-01
code:
  - src/app/router.ts
  - _private/propose.md
  - src/modules/grammar/views/N1GrammarView.vue
  - src/modules/grammar/storage/grammarLevelStorage.ts
  - src/modules/grammar/views/N3GrammarView.vue
  - src/shared/config/storageKeys.ts
  - src/modules/grammar/views/N2GrammarView.vue
  - PROJECT_ARCHITECTURE.md
  - src/modules/grammar/config/grammarLevels.ts
  - src/modules/grammar/views/N4GrammarView.vue
  - src/modules/grammar/composables/useGrammarLevel.ts
  - _private/discuss.txt
  - src/modules/grammar/components/GrammarLevelSwitcher.vue
  - src/styles/main.css
  - _private/筆記.md
  - src/shared/components/RouteSubMenu.vue
  - src/app/AppShell.vue
  - tests/e2e/testUtils.ts
  - src/shared/components/RouteTabs.vue
tests:
  - tests/component/GrammarLevelRoutes.spec.ts
  - tests/e2e/app-shell.smoke.spec.ts
  - tests/unit/grammarLevelStorage.spec.ts
  - tests/component/RouteSubMenu.spec.ts
  - tests/component/AppShellSmoke.spec.ts
-->

---
### Requirement: Clear invalid grammar level preference

The system MUST remove the persisted grammar level preference when the stored value is malformed, not one of the configured grammar level values, or points to a grammar level whose route is not present in the current configuration. After removing the invalid preference, the system SHALL use `N5` as the selected grammar level.

#### Scenario: Unknown level is cleared

- **GIVEN** localStorage key `duotify.grammar.selectedLevel` contains `N0`
- **WHEN** the app starts
- **THEN** the system removes localStorage key `duotify.grammar.selectedLevel`
- **AND** the selected grammar level is `N5`
- **AND** the primary grammar route control label is `N5文法`

#### Scenario: Malformed storage payload is cleared

- **GIVEN** localStorage key `duotify.grammar.selectedLevel` contains malformed JSON
- **WHEN** the app starts
- **THEN** the system removes localStorage key `duotify.grammar.selectedLevel`
- **AND** the selected grammar level is `N5`

#### Scenario: Removed configured route is cleared

- **GIVEN** localStorage key `duotify.grammar.selectedLevel` contains `N1`
- **AND** the current grammar level configuration has no route for `N1`
- **WHEN** the app starts
- **THEN** the system removes localStorage key `duotify.grammar.selectedLevel`
- **AND** the selected grammar level is `N5`


<!-- @trace
source: add-persistent-grammar-level-route-switcher
updated: 2026-05-01
code:
  - src/app/router.ts
  - _private/propose.md
  - src/modules/grammar/views/N1GrammarView.vue
  - src/modules/grammar/storage/grammarLevelStorage.ts
  - src/modules/grammar/views/N3GrammarView.vue
  - src/shared/config/storageKeys.ts
  - src/modules/grammar/views/N2GrammarView.vue
  - PROJECT_ARCHITECTURE.md
  - src/modules/grammar/config/grammarLevels.ts
  - src/modules/grammar/views/N4GrammarView.vue
  - src/modules/grammar/composables/useGrammarLevel.ts
  - _private/discuss.txt
  - src/modules/grammar/components/GrammarLevelSwitcher.vue
  - src/styles/main.css
  - _private/筆記.md
  - src/shared/components/RouteSubMenu.vue
  - src/app/AppShell.vue
  - tests/e2e/testUtils.ts
  - src/shared/components/RouteTabs.vue
tests:
  - tests/component/GrammarLevelRoutes.spec.ts
  - tests/e2e/app-shell.smoke.spec.ts
  - tests/unit/grammarLevelStorage.spec.ts
  - tests/component/RouteSubMenu.spec.ts
  - tests/component/AppShellSmoke.spec.ts
-->

---
### Requirement: Submenu open state is not persisted

The system SHALL NOT persist whether the grammar level submenu is open. A new app session SHALL always start with the grammar level submenu closed.

#### Scenario: Open submenu does not restore

- **GIVEN** the grammar level submenu was open before the page was closed
- **WHEN** the app starts again
- **THEN** the grammar level submenu is closed

<!-- @trace
source: add-persistent-grammar-level-route-switcher
updated: 2026-05-01
code:
  - src/app/router.ts
  - _private/propose.md
  - src/modules/grammar/views/N1GrammarView.vue
  - src/modules/grammar/storage/grammarLevelStorage.ts
  - src/modules/grammar/views/N3GrammarView.vue
  - src/shared/config/storageKeys.ts
  - src/modules/grammar/views/N2GrammarView.vue
  - PROJECT_ARCHITECTURE.md
  - src/modules/grammar/config/grammarLevels.ts
  - src/modules/grammar/views/N4GrammarView.vue
  - src/modules/grammar/composables/useGrammarLevel.ts
  - _private/discuss.txt
  - src/modules/grammar/components/GrammarLevelSwitcher.vue
  - src/styles/main.css
  - _private/筆記.md
  - src/shared/components/RouteSubMenu.vue
  - src/app/AppShell.vue
  - tests/e2e/testUtils.ts
  - src/shared/components/RouteTabs.vue
tests:
  - tests/component/GrammarLevelRoutes.spec.ts
  - tests/e2e/app-shell.smoke.spec.ts
  - tests/unit/grammarLevelStorage.spec.ts
  - tests/component/RouteSubMenu.spec.ts
  - tests/component/AppShellSmoke.spec.ts
-->