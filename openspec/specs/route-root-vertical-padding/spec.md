# route-root-vertical-padding Specification

## Purpose

TBD - created by archiving change 'improve-pwa-versioning-and-n5-learning-sections'. Update Purpose after archive.

## Requirements

### Requirement: Non-vocabulary route roots MUST NOT add py-1 vertical padding

Practice, Grammar, N1 Grammar, N2 Grammar, N3 Grammar, N4 Grammar, and N5 Grammar route root containers MUST NOT include the Tailwind `py-1` utility. This requirement applies only to the top-level route root container. Inner cards, sections, tables, and feature components SHALL keep their own padding rules.

#### Scenario: Non-vocabulary routes render without root py-1

- **WHEN** the application renders a non-vocabulary route root
- **THEN** the route root does not include `py-1`
- **AND** nested cards, sections, tables, and feature components are outside this route-root restriction

##### Example: non-vocabulary route root expectations

| Route | Root selector | Expected root `py-1` |
| --- | --- | --- |
| `/practice` | `.practice-view` | absent |
| `/grammar` | `[data-testid="grammar-sections"]` | absent |
| `/n1-grammar` | `[data-testid="n1-grammar-placeholder-view"]` | absent |
| `/n2-grammar` | `[data-testid="n2-grammar-placeholder-view"]` | absent |
| `/n3-grammar` | `[data-testid="n3-grammar-placeholder-view"]` | absent |
| `/n4-grammar` | `[data-testid="n4-grammar-placeholder-view"]` | absent |
| `/n5-grammar` | `[data-testid="n5-grammar-view"]` | absent |


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
### Requirement: N5 Grammar route root MUST NOT receive stylesheet vertical padding

The N5 Grammar route root selector `.n5-grammar-view` MUST NOT apply Tailwind vertical padding utilities (`py-*`, `pt-*`, `pb-*`) or raw `padding-top` / `padding-bottom` declarations through `src/styles/main.css`. The N5 Grammar route root MUST use the template root `space-y-4` class for route-level group spacing.

#### Scenario: N5 Grammar root stylesheet has no vertical padding

- **WHEN** `src/styles/main.css` defines styles for `.n5-grammar-view`
- **THEN** the selector does not apply `py-*`, `pt-*`, `pb-*`, `padding-top`, or `padding-bottom`
- **AND** `/n5-grammar` route-level group spacing is controlled by the template root `space-y-4` class

##### Example: forbidden N5 Grammar route-root declarations

| Selector | Forbidden declaration source | Expected |
| --- | --- | --- |
| `.n5-grammar-view` | `@apply py-1` | absent |
| `.n5-grammar-view` | `@apply pt-*` | absent |
| `.n5-grammar-view` | `@apply pb-*` | absent |
| `.n5-grammar-view` | `padding-top: ...` | absent |
| `.n5-grammar-view` | `padding-bottom: ...` | absent |


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
### Requirement: Vocabulary route root MUST keep py-1 vertical padding

The Vocabulary route root container SHALL keep the Tailwind `py-1` utility. The Vocabulary route is the only route-root exception to the no-root-`py-1` rule.

#### Scenario: Vocabulary route preserves root py-1

- **WHEN** the application renders the Vocabulary route root
- **THEN** `.vocabulary-view` includes `py-1`

##### Example: vocabulary route root expectation

| Route | Root selector | Expected root `py-1` |
| --- | --- | --- |
| `/vocabulary` | `.vocabulary-view` | present |

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