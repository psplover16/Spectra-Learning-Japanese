# app-version-display Specification

## Purpose

TBD - created by archiving change 'improve-pwa-versioning-and-n5-learning-sections'. Update Purpose after archive.

## Requirements

### Requirement: Practice page SHALL display the application version

The Practice page (alphabet practice route) SHALL render a version label that shows the current application version. The label SHALL be positioned at the bottom-right of the complete Practice page content flow, after all other non-overlay Practice page content. The label MUST NOT be constrained to the right-side reference column and MUST NOT use fixed viewport positioning. The label SHALL be right-aligned to the Practice page content width. The gap above the label SHALL follow the Practice page's standard vertical rhythm. The text color SHALL be black and the font size SHALL be 1rem.

#### Scenario: Version label appears on Practice page

- **WHEN** the Practice page renders
- **THEN** a version label showing the current application version is visible as the final non-overlay content item in the Practice page
- **AND** the label is not rendered inside the right-side reference section
- **AND** the label is right-aligned to the Practice page content width
- **AND** the text color is black and the font size is 1rem


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
### Requirement: Version source MUST be automatically derived from package metadata

The version string SHALL come from the project's `package.json#version` field, injected at build time as the global constant `__APP_VERSION__`. Engineers MUST NOT need to manually update any UI string when releasing a new version. The initial version MUST be `0.0.1`.

#### Scenario: Build-time version injection

- **WHEN** the project is built with `vite build`
- **THEN** the global constant `__APP_VERSION__` equals the value of `package.json#version`
- **AND** the Practice page renders that exact value at runtime

##### Example: initial version
- **GIVEN** `package.json` contains `"version": "0.0.1"`
- **WHEN** the build completes and the user opens the Practice page
- **THEN** the version label shows `0.0.1`


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
### Requirement: Version label MUST be implemented as a reusable component

The version label SHALL be implemented as `src/shared/components/AppVersionLabel.vue` so other routes can reuse it without duplication. The component SHALL only handle rendering. The component MUST NOT contain update-check logic.

#### Scenario: Component is reusable across routes

- **WHEN** another view imports `AppVersionLabel.vue`
- **THEN** the component renders the same version string without additional setup
- **AND** the component performs no update-check side effects

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