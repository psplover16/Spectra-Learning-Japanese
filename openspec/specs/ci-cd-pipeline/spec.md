# ci-cd-pipeline Specification

## Purpose

Define the CI/CD contract for validating this project with GitHub Actions and publishing staging and production builds to GitHub Pages.

## Requirements

### Requirement: CI workflow validation
The system SHALL provide a GitHub Actions workflow named `CI` that validates the project on every pull request and on every push except pushes to the `gh-pages` branch.

#### Scenario: Pull request validation
- **WHEN** a pull request targets any branch
- **THEN** the `CI` workflow SHALL run on `ubuntu-latest` with Node.js 22

#### Scenario: Push validation excludes deployment branch
- **WHEN** a push targets a branch other than `gh-pages`
- **THEN** the `CI` workflow SHALL run validation jobs

#### Scenario: Deployment branch push is ignored
- **WHEN** a push targets `gh-pages`
- **THEN** the `CI` workflow SHALL NOT run

#### Scenario: Validation step order
- **WHEN** the `CI` workflow runs
- **THEN** it SHALL checkout the repository, set up Node.js with dependency cache, install dependencies, run lint, run typecheck, run unit tests, build the static site, install the Playwright browser when e2e tests exist, and run e2e tests when e2e tests exist in that order


<!-- @trace
source: setting-ci-cd
updated: 2026-04-29
code:
  - .github/workflows/ci.yml
  - scripts/publishPages.mjs
  - _private/筆記.md
  - .github/workflows/cd.yml
  - _private/propose.md
  - README.md
tests:
  - tests/unit/publicAssets.spec.ts
  - tests/unit/publishPages.spec.ts
  - tests/unit/packageScripts.spec.ts
  - tests/unit/readmeCiCdDocs.spec.ts
  - tests/unit/githubActionsWorkflows.spec.ts
-->

---
### Requirement: CI diagnostics artifact upload
The system SHALL preserve Playwright diagnostics when e2e validation fails in CI.

#### Scenario: E2E failure uploads diagnostics
- **WHEN** the `CI` workflow e2e step fails
- **THEN** the workflow SHALL upload available `playwright-report/` and `test-results/` content as diagnostics artifacts

#### Scenario: E2E success skips diagnostics upload
- **WHEN** the `CI` workflow e2e step succeeds
- **THEN** the workflow SHALL complete without requiring a diagnostics artifact upload


<!-- @trace
source: setting-ci-cd
updated: 2026-04-29
code:
  - .github/workflows/ci.yml
  - scripts/publishPages.mjs
  - _private/筆記.md
  - .github/workflows/cd.yml
  - _private/propose.md
  - README.md
tests:
  - tests/unit/publicAssets.spec.ts
  - tests/unit/publishPages.spec.ts
  - tests/unit/packageScripts.spec.ts
  - tests/unit/readmeCiCdDocs.spec.ts
  - tests/unit/githubActionsWorkflows.spec.ts
-->

---
### Requirement: CD workflow deployment targets
The system SHALL provide a GitHub Actions workflow named `CD` that deploys `dev` to staging and `main` to production through the `gh-pages` branch.

#### Scenario: Dev deploys to staging
- **WHEN** a push targets `dev`
- **THEN** the `CD` workflow SHALL build the site with staging configuration and publish the build output to `gh-pages/staging/`

#### Scenario: Main deploys to production
- **WHEN** a push targets `main`
- **THEN** the `CD` workflow SHALL build the site with production configuration and publish the build output to the `gh-pages` root

#### Scenario: Non deployment branch is ignored
- **WHEN** a push targets any branch other than `dev` or `main`
- **THEN** the `CD` workflow SHALL NOT deploy

#### Scenario: Deployment permissions and concurrency
- **WHEN** the `CD` workflow runs
- **THEN** it SHALL use `permissions.contents: write` and a concurrency group that prevents overlapping deployments for the same workflow and ref


<!-- @trace
source: setting-ci-cd
updated: 2026-04-29
code:
  - .github/workflows/ci.yml
  - scripts/publishPages.mjs
  - _private/筆記.md
  - .github/workflows/cd.yml
  - _private/propose.md
  - README.md
tests:
  - tests/unit/publicAssets.spec.ts
  - tests/unit/publishPages.spec.ts
  - tests/unit/packageScripts.spec.ts
  - tests/unit/readmeCiCdDocs.spec.ts
  - tests/unit/githubActionsWorkflows.spec.ts
-->

---
### Requirement: GitHub Pages base path alignment
The system SHALL use one build-time base path source for Vite assets, PWA manifest start URL, and Vue Router history configuration.

#### Scenario: Production base path
- **WHEN** the `CD` workflow builds production from `main`
- **THEN** the build base path SHALL be `/Spectra-Learning-Japanese/`

#### Scenario: Staging base path
- **WHEN** the `CD` workflow builds staging from `dev`
- **THEN** the build base path SHALL be `/Spectra-Learning-Japanese/staging/`

#### Scenario: Router and PWA use the build base path
- **WHEN** the application is built for staging or production
- **THEN** the Vue Router history base and PWA manifest start URL SHALL use the same base path as Vite static assets

##### Example: target to base path mapping
| Deployment target | Source branch | Base path |
| ----------------- | ------------- | --------- |
| staging | dev | `/Spectra-Learning-Japanese/staging/` |
| production | main | `/Spectra-Learning-Japanese/` |


<!-- @trace
source: setting-ci-cd
updated: 2026-04-29
code:
  - .github/workflows/ci.yml
  - scripts/publishPages.mjs
  - _private/筆記.md
  - .github/workflows/cd.yml
  - _private/propose.md
  - README.md
tests:
  - tests/unit/publicAssets.spec.ts
  - tests/unit/publishPages.spec.ts
  - tests/unit/packageScripts.spec.ts
  - tests/unit/readmeCiCdDocs.spec.ts
  - tests/unit/githubActionsWorkflows.spec.ts
-->

---
### Requirement: Protected GitHub Pages publishing
The system SHALL publish build output through a script that safely synchronizes production and staging content in a `gh-pages` worktree.

#### Scenario: Publish production root
- **WHEN** the publish script receives target `production`
- **THEN** it SHALL publish `dist/` content to the `gh-pages` root while preserving `.git`, `.nojekyll`, `CNAME`, and `staging`

#### Scenario: Publish staging subdirectory
- **WHEN** the publish script receives target `staging`
- **THEN** it SHALL publish `dist/` content to `gh-pages/staging/` without modifying production root files

#### Scenario: Empty dist fails
- **WHEN** the publish script receives an empty or missing dist directory
- **THEN** it SHALL fail before changing the `gh-pages` worktree

#### Scenario: No content change avoids empty commit
- **WHEN** the publish script produces no file changes in the `gh-pages` worktree
- **THEN** the `CD` workflow SHALL finish without creating an empty commit


<!-- @trace
source: setting-ci-cd
updated: 2026-04-29
code:
  - .github/workflows/ci.yml
  - scripts/publishPages.mjs
  - _private/筆記.md
  - .github/workflows/cd.yml
  - _private/propose.md
  - README.md
tests:
  - tests/unit/publicAssets.spec.ts
  - tests/unit/publishPages.spec.ts
  - tests/unit/packageScripts.spec.ts
  - tests/unit/readmeCiCdDocs.spec.ts
  - tests/unit/githubActionsWorkflows.spec.ts
-->

---
### Requirement: Package script contract
The system SHALL expose package scripts that allow local execution of the same validation phases used by CI.

#### Scenario: Required scripts exist
- **WHEN** package scripts are inspected
- **THEN** `lint`, `typecheck`, `test:unit`, `build`, `test:e2e`, and `test:ci` SHALL exist or be added

#### Scenario: CI script order
- **WHEN** `test:ci` runs
- **THEN** it SHALL execute lint, typecheck, unit tests, build, and e2e tests in that order


<!-- @trace
source: setting-ci-cd
updated: 2026-04-29
code:
  - .github/workflows/ci.yml
  - scripts/publishPages.mjs
  - _private/筆記.md
  - .github/workflows/cd.yml
  - _private/propose.md
  - README.md
tests:
  - tests/unit/publicAssets.spec.ts
  - tests/unit/publishPages.spec.ts
  - tests/unit/packageScripts.spec.ts
  - tests/unit/readmeCiCdDocs.spec.ts
  - tests/unit/githubActionsWorkflows.spec.ts
-->

---
### Requirement: CI/CD documentation
The system SHALL document how maintainers run validation and configure deployment.

#### Scenario: README documents CI and CD operation
- **WHEN** the README is updated for this change
- **THEN** it SHALL describe local test commands, CI triggers, CD triggers, `dev` to staging deployment, `main` to production deployment, GitHub Pages `gh-pages` source setup, and branch protection guidance requiring CI before merge

#### Scenario: Completion summary includes verification results
- **WHEN** the change implementation is completed
- **THEN** the implementation summary SHALL list modified files, CI trigger behavior, CD branch-to-target mapping, and local verification results

<!-- @trace
source: setting-ci-cd
updated: 2026-04-29
code:
  - .github/workflows/ci.yml
  - scripts/publishPages.mjs
  - _private/筆記.md
  - .github/workflows/cd.yml
  - _private/propose.md
  - README.md
tests:
  - tests/unit/publicAssets.spec.ts
  - tests/unit/publishPages.spec.ts
  - tests/unit/packageScripts.spec.ts
  - tests/unit/readmeCiCdDocs.spec.ts
  - tests/unit/githubActionsWorkflows.spec.ts
-->
