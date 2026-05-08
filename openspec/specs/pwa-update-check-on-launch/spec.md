# pwa-update-check-on-launch Specification

## Purpose

TBD - created by archiving change 'improve-pwa-versioning-and-n5-learning-sections'. Update Purpose after archive.

## Requirements

### Requirement: PWA App MUST check for service-worker updates on every launch

When the application starts (each time the user opens the installed PWA), the system SHALL trigger a Service Worker update check by calling `registration.update()` on the active SW registration. This check SHALL run exactly once per launch.

#### Scenario: Launch update check runs once

- **WHEN** the user opens the installed PWA App
- **THEN** the system invokes `registration.update()` exactly once during startup


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
### Requirement: Update delivery MUST NOT require opening the website entry

When a new version is correctly deployed, users with the installed PWA App SHALL receive the update without manually opening the website. The launch update check SHALL be the trigger that surfaces the new SW to the existing update-prompt UI.

#### Scenario: Installed App user receives new version on launch

- **GIVEN** a new version has been deployed and the user has the previous version installed as a PWA App
- **WHEN** the user opens the App
- **THEN** the launch update check detects the new SW
- **AND** the existing update-prompt UI surfaces


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
### Requirement: Existing update-prompt UI MUST be preserved

This change SHALL NOT modify the existing update-prompt UI behavior. The launch update check SHALL only feed the existing detection mechanism with timelier signals.

#### Scenario: UI is unchanged after update detection

- **WHEN** an update is detected after launch
- **THEN** the same update-prompt UI that existed before this change is shown
- **AND** no new prompts, dialogs, or banners are introduced


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
### Requirement: Update check MUST fail silently when offline or unreachable

When the user is offline or the update check rejects with an error, the system SHALL catch the error and continue normal startup. The user MUST NOT see a stack trace, error toast, or blocked screen.

#### Scenario: Offline launch

- **GIVEN** the user is offline
- **WHEN** the App launches and triggers the update check
- **THEN** the check fails silently without affecting subsequent app behavior
- **AND** no error UI is shown

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
### Requirement: PWA update confirmation MUST retain offline caches

When the application applies an available service worker update from either the update action or a deferred automatic update, the system SHALL NOT delete all CacheStorage entries before invoking the service worker update. The system SHALL leave Workbox-managed precache entries available until Workbox replaces outdated caches through its normal lifecycle. The system SHALL remove the deferred update flag from localStorage when applying the update.

#### Scenario: User-confirmed update keeps cached learning assets

- **GIVEN** the installed PWA has Workbox-managed precache entries for the app shell, primary route chunks, N5 grammar assets, and vocabulary data assets
- **WHEN** the user activates the update action
- **THEN** the system invokes the service worker update with reload enabled
- **AND** the system does not delete every CacheStorage entry before the reload
- **AND** the cached learning assets remain available for offline requests during the update transition

#### Scenario: Deferred automatic update keeps cached learning assets

- **GIVEN** the deferred PWA update flag is stored in localStorage
- **AND** a service worker update is available
- **WHEN** the system applies the deferred update automatically
- **THEN** the system invokes the same cache-retaining update path as a user-confirmed update
- **AND** the deferred update flag is removed from localStorage

<!-- @trace
source: fix-pwa-update-cache-retention
updated: 2026-05-08
code:
  - PROJECT_ARCHITECTURE.md
  - src/modules/pwa/services/pwaLifecycleService.ts
tests:
  - tests/unit/pwaLifecycleService.spec.ts
  - tests/e2e/pwa-offline-route-cache.spec.ts
-->