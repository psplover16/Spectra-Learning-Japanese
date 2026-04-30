# grammar-level-routing Specification

## Purpose

TBD - created by archiving change 'add-persistent-grammar-level-route-switcher'. Update Purpose after archive.

## Requirements

### Requirement: Grammar level routes

The system SHALL expose one route for each configured grammar level: `/n1-grammar`, `/n2-grammar`, `/n3-grammar`, `/n4-grammar`, and `/n5-grammar`. The `/n5-grammar` route SHALL render the existing N5 grammar learning page. The `/n1-grammar`, `/n2-grammar`, `/n3-grammar`, and `/n4-grammar` routes SHALL render placeholder pages that load without runtime errors and identify the selected grammar level.

#### Scenario: N5 grammar route keeps existing content

- **WHEN** the user navigates to `/n5-grammar`
- **THEN** the system renders the existing N5 grammar page
- **AND** the page contains N5 grammar learning content

#### Scenario: Placeholder grammar routes load

- **WHEN** the user navigates to `/n1-grammar`, `/n2-grammar`, `/n3-grammar`, or `/n4-grammar`
- **THEN** the system renders a placeholder grammar page for that level
- **AND** the route does not redirect to `/n5-grammar`
- **AND** the page does not produce a render error


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
### Requirement: Main grammar route control

The primary route tabs SHALL include one grammar level control whose label equals the currently selected grammar level label, such as `N5文法` or `N1文法`. The selected grammar level SHALL default to `N5` when no valid persisted preference exists.

#### Scenario: Default grammar control label

- **WHEN** the app starts without a valid persisted grammar level preference
- **THEN** the primary grammar route control label is `N5文法`
- **AND** its navigation target is `/n5-grammar`

#### Scenario: Grammar control follows selected level

- **WHEN** the selected grammar level is `N1`
- **THEN** the primary grammar route control label is `N1文法`
- **AND** its navigation target is `/n1-grammar`


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
### Requirement: Grammar route control navigation behavior

The primary grammar route control SHALL navigate directly to the selected grammar level route when the current route is not a configured grammar level route. The same control SHALL open the grammar level submenu instead of navigating when the current route is any configured grammar level route.

#### Scenario: Non-grammar route navigates to selected level

- **GIVEN** the selected grammar level is `N1`
- **AND** the current route is `/vocabulary`
- **WHEN** the user activates the primary grammar route control
- **THEN** the system navigates to `/n1-grammar`

#### Scenario: Grammar route opens submenu

- **GIVEN** the current route is `/n5-grammar`
- **WHEN** the user activates the primary grammar route control
- **THEN** the system opens the grammar level submenu
- **AND** the current route remains `/n5-grammar`


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
### Requirement: Grammar level option selection

The grammar level submenu SHALL contain options for `N1文法`, `N2文法`, `N3文法`, `N4文法`, and `N5文法`. Activating an option SHALL update the selected grammar level, close the submenu, and navigate to the selected option route.

#### Scenario: Selecting N1 from N5 grammar page

- **GIVEN** the current route is `/n5-grammar`
- **AND** the selected grammar level is `N5`
- **WHEN** the user opens the grammar level submenu and activates `N1文法`
- **THEN** the selected grammar level becomes `N1`
- **AND** the primary grammar route control label becomes `N1文法`
- **AND** the system navigates to `/n1-grammar`
- **AND** the grammar level submenu closes

#### Scenario: Reopening submenu on selected grammar page

- **GIVEN** the current route is `/n1-grammar`
- **AND** the selected grammar level is `N1`
- **WHEN** the user activates the primary grammar route control
- **THEN** the system opens the grammar level submenu
- **AND** the submenu contains all N1 through N5 grammar options


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
### Requirement: Route switcher layout spacing

The app shell SHALL render the primary route switcher container with spacing equivalent to Tailwind `p-1`. The outer app page container SHALL render with spacing equivalent to Tailwind `p-2`.

#### Scenario: Compact route switcher spacing

- **WHEN** the app shell renders the primary route switcher
- **THEN** the route switcher container uses uniform `p-1` spacing
- **AND** the outer app page container uses uniform `p-2` spacing

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