# grammar-reading-position-bookmark Specification

## Purpose

TBD - created by archiving change 'add-grammar-reading-position-bookmark'. Update Purpose after archive.

## Requirements

### Requirement: Bookmark button appears on each grammar section header

For each JLPT grammar level page (initially N5), every section card SHALL render a bookmark button on the left side of the section header, mirroring the existing completion checkbox on the right. The button MUST have an interactive hit area of at least 44 by 44 CSS pixels and MUST be reachable as the primary clickable element on the left edge of the header.

#### Scenario: Bookmark button is rendered for an unfinished section

- **WHEN** the N5 grammar page renders a section in the unfinished zone
- **THEN** the section header MUST contain a bookmark button positioned on the left edge of the header
- **AND** the bookmark button MUST have a clickable hit area of at least 44 by 44 CSS pixels
- **AND** the existing completion checkbox MUST remain at its previous position on the right edge with unchanged behavior


<!-- @trace
source: add-grammar-reading-position-bookmark
updated: 2026-05-12
code:
  - src/styles/main.css
  - src/modules/grammar/storage/grammarBookmarkStorage.ts
  - src/modules/n5Grammar/components/N5GrammarSectionCard.vue
  - PROJECT_ARCHITECTURE.md
  - src/modules/n5Grammar/views/N5GrammarView.vue
  - _private/筆記.md
  - package.json
  - _private/propose.md
  - _private/discuss.txt
  - src/shared/config/storageKeys.ts
tests:
  - tests/unit/N5GrammarView.spec.ts
  - tests/unit/N5GrammarSectionCard.spec.ts
  - tests/e2e/n5-grammar-layout.spec.ts
  - tests/unit/grammarBookmarkStorage.spec.ts
-->

---
### Requirement: Bookmark button has two visual states

The bookmark button SHALL render in exactly one of two states: outline (no bookmark) or solid (bookmarked). The default state for every section is outline. The system MUST visually distinguish the two states so that users can tell at a glance which section is bookmarked.

#### Scenario: Default state is outline for all sections

- **WHEN** the N5 grammar page loads for a user with no stored bookmark for level N5
- **THEN** every visible bookmark button MUST render in the outline state

#### Scenario: Bookmarked section renders solid

- **GIVEN** the user has bookmarked section `particles-wa` on level N5
- **WHEN** the N5 grammar page renders
- **THEN** the bookmark button on `particles-wa` MUST render in the solid state
- **AND** every other bookmark button on the same page MUST render in the outline state


<!-- @trace
source: add-grammar-reading-position-bookmark
updated: 2026-05-12
code:
  - src/styles/main.css
  - src/modules/grammar/storage/grammarBookmarkStorage.ts
  - src/modules/n5Grammar/components/N5GrammarSectionCard.vue
  - PROJECT_ARCHITECTURE.md
  - src/modules/n5Grammar/views/N5GrammarView.vue
  - _private/筆記.md
  - package.json
  - _private/propose.md
  - _private/discuss.txt
  - src/shared/config/storageKeys.ts
tests:
  - tests/unit/N5GrammarView.spec.ts
  - tests/unit/N5GrammarSectionCard.spec.ts
  - tests/e2e/n5-grammar-layout.spec.ts
  - tests/unit/grammarBookmarkStorage.spec.ts
-->

---
### Requirement: At most one bookmark per JLPT level

Each JLPT level SHALL hold at most one bookmark at any time. Switching the bookmark by clicking the outline icon on a different section MUST atomically replace the previous bookmark for the same level. Selecting a bookmark on level N5 MUST NOT affect bookmarks stored for other levels.

#### Scenario: Switching bookmark replaces the previous one

- **GIVEN** section `particles-wa` is currently bookmarked on level N5
- **WHEN** the user clicks the outline bookmark on section `particles-ga`
- **THEN** `particles-ga` MUST render in the solid state
- **AND** `particles-wa` MUST render in the outline state
- **AND** the persisted bookmark record for level N5 MUST identify `particles-ga` as the bookmarked section

##### Example: Switching across three sections

| Step | User action | Solid section after action |
| ---- | ----------- | -------------------------- |
| 1 | Click bookmark on `particles-wa` | `particles-wa` |
| 2 | Click bookmark on `particles-ga` | `particles-ga` |
| 3 | Click bookmark on `particles-ni` | `particles-ni` |

#### Scenario: Bookmarks on different levels are independent

- **GIVEN** section `particles-wa` is bookmarked on level N5 and the storage layer also holds a bookmark record for level N4
- **WHEN** the user changes the level N5 bookmark to `particles-ga`
- **THEN** the persisted level N4 bookmark record MUST remain unchanged


<!-- @trace
source: add-grammar-reading-position-bookmark
updated: 2026-05-12
code:
  - src/styles/main.css
  - src/modules/grammar/storage/grammarBookmarkStorage.ts
  - src/modules/n5Grammar/components/N5GrammarSectionCard.vue
  - PROJECT_ARCHITECTURE.md
  - src/modules/n5Grammar/views/N5GrammarView.vue
  - _private/筆記.md
  - package.json
  - _private/propose.md
  - _private/discuss.txt
  - src/shared/config/storageKeys.ts
tests:
  - tests/unit/N5GrammarView.spec.ts
  - tests/unit/N5GrammarSectionCard.spec.ts
  - tests/e2e/n5-grammar-layout.spec.ts
  - tests/unit/grammarBookmarkStorage.spec.ts
-->

---
### Requirement: Solid bookmark can be cleared by clicking it again

Clicking the bookmark button while it is in the solid state SHALL clear the bookmark for that JLPT level, returning all sections on that level to the outline state. The system MUST delete the persisted record for that level rather than retain a stale entry.

#### Scenario: Clicking the solid bookmark removes it

- **GIVEN** section `particles-wa` is bookmarked on level N5
- **WHEN** the user clicks the solid bookmark on `particles-wa`
- **THEN** the bookmark button on `particles-wa` MUST render in the outline state
- **AND** no other section on level N5 MUST render in the solid state
- **AND** the persisted bookmark record for level N5 MUST be removed


<!-- @trace
source: add-grammar-reading-position-bookmark
updated: 2026-05-12
code:
  - src/styles/main.css
  - src/modules/grammar/storage/grammarBookmarkStorage.ts
  - src/modules/n5Grammar/components/N5GrammarSectionCard.vue
  - PROJECT_ARCHITECTURE.md
  - src/modules/n5Grammar/views/N5GrammarView.vue
  - _private/筆記.md
  - package.json
  - _private/propose.md
  - _private/discuss.txt
  - src/shared/config/storageKeys.ts
tests:
  - tests/unit/N5GrammarView.spec.ts
  - tests/unit/N5GrammarSectionCard.spec.ts
  - tests/e2e/n5-grammar-layout.spec.ts
  - tests/unit/grammarBookmarkStorage.spec.ts
-->

---
### Requirement: Bookmark persists across sessions

The system SHALL persist the bookmark for each JLPT level so that closing and reopening the application restores the bookmark exactly as it was. The persistence layer MUST use the existing localStorage-based storage mechanism under a single key shared across all JLPT levels.

#### Scenario: Bookmark restored after reload

- **GIVEN** section `particles-wa` is bookmarked on level N5
- **WHEN** the user reloads the N5 grammar page or reopens the application
- **THEN** the bookmark button on `particles-wa` MUST render in the solid state
- **AND** every other bookmark button MUST render in the outline state


<!-- @trace
source: add-grammar-reading-position-bookmark
updated: 2026-05-12
code:
  - src/styles/main.css
  - src/modules/grammar/storage/grammarBookmarkStorage.ts
  - src/modules/n5Grammar/components/N5GrammarSectionCard.vue
  - PROJECT_ARCHITECTURE.md
  - src/modules/n5Grammar/views/N5GrammarView.vue
  - _private/筆記.md
  - package.json
  - _private/propose.md
  - _private/discuss.txt
  - src/shared/config/storageKeys.ts
tests:
  - tests/unit/N5GrammarView.spec.ts
  - tests/unit/N5GrammarSectionCard.spec.ts
  - tests/e2e/n5-grammar-layout.spec.ts
  - tests/unit/grammarBookmarkStorage.spec.ts
-->

---
### Requirement: Marking a bookmarked section as completed clears its bookmark

The bookmark represents the current reading position and SHALL NOT remain on a section that the user has marked as completed. When a section that currently holds the level bookmark is marked completed via the existing checkbox, the system MUST remove the bookmark for that level.

#### Scenario: Completing a bookmarked section removes the bookmark

- **GIVEN** section `particles-wa` is bookmarked on level N5 and is in the unfinished zone
- **WHEN** the user marks `particles-wa` as completed via the existing completion checkbox
- **THEN** the bookmark for level N5 MUST be removed from storage
- **AND** when the user returns to the N5 grammar page, no section MUST render in the solid bookmark state


<!-- @trace
source: add-grammar-reading-position-bookmark
updated: 2026-05-12
code:
  - src/styles/main.css
  - src/modules/grammar/storage/grammarBookmarkStorage.ts
  - src/modules/n5Grammar/components/N5GrammarSectionCard.vue
  - PROJECT_ARCHITECTURE.md
  - src/modules/n5Grammar/views/N5GrammarView.vue
  - _private/筆記.md
  - package.json
  - _private/propose.md
  - _private/discuss.txt
  - src/shared/config/storageKeys.ts
tests:
  - tests/unit/N5GrammarView.spec.ts
  - tests/unit/N5GrammarSectionCard.spec.ts
  - tests/e2e/n5-grammar-layout.spec.ts
  - tests/unit/grammarBookmarkStorage.spec.ts
-->

---
### Requirement: Sections in the finished zone do not render the bookmark button

Sections that the user has marked as completed are rendered in the finished zone. The system SHALL NOT render any bookmark button for sections in the finished zone, because the bookmark represents a reading position for material still in progress.

#### Scenario: Finished-zone section omits the bookmark button

- **GIVEN** section `particles-wa` has been marked as completed and appears in the finished zone
- **WHEN** the N5 grammar page renders
- **THEN** the section header for `particles-wa` MUST NOT contain a bookmark button in the DOM


<!-- @trace
source: add-grammar-reading-position-bookmark
updated: 2026-05-12
code:
  - src/styles/main.css
  - src/modules/grammar/storage/grammarBookmarkStorage.ts
  - src/modules/n5Grammar/components/N5GrammarSectionCard.vue
  - PROJECT_ARCHITECTURE.md
  - src/modules/n5Grammar/views/N5GrammarView.vue
  - _private/筆記.md
  - package.json
  - _private/propose.md
  - _private/discuss.txt
  - src/shared/config/storageKeys.ts
tests:
  - tests/unit/N5GrammarView.spec.ts
  - tests/unit/N5GrammarSectionCard.spec.ts
  - tests/e2e/n5-grammar-layout.spec.ts
  - tests/unit/grammarBookmarkStorage.spec.ts
-->

---
### Requirement: Storage schema reserves all JLPT levels

The persisted bookmark snapshot SHALL use a single localStorage entry keyed `duotify.grammar.bookmark`, holding a versioned object whose `byLevel` map stores bookmark entries keyed by JLPT level (`N5`, `N4`, `N3`, `N2`, `N1`). Absent keys SHALL represent no bookmark on that level. The schema MUST support reading or writing one level without disturbing entries for other levels.

#### Scenario: Writing one level preserves other levels

- **GIVEN** the persisted snapshot contains a bookmark for level N4 only
- **WHEN** the system writes a new bookmark for level N5
- **THEN** the persisted snapshot MUST contain bookmark entries for both N4 and N5
- **AND** the N4 entry MUST be byte-identical to its pre-write value

#### Scenario: Reading an unset level returns nothing

- **WHEN** the system reads the bookmark for a level that has no entry in the persisted snapshot
- **THEN** the read operation MUST return a null result and MUST NOT throw


<!-- @trace
source: add-grammar-reading-position-bookmark
updated: 2026-05-12
code:
  - src/styles/main.css
  - src/modules/grammar/storage/grammarBookmarkStorage.ts
  - src/modules/n5Grammar/components/N5GrammarSectionCard.vue
  - PROJECT_ARCHITECTURE.md
  - src/modules/n5Grammar/views/N5GrammarView.vue
  - _private/筆記.md
  - package.json
  - _private/propose.md
  - _private/discuss.txt
  - src/shared/config/storageKeys.ts
tests:
  - tests/unit/N5GrammarView.spec.ts
  - tests/unit/N5GrammarSectionCard.spec.ts
  - tests/e2e/n5-grammar-layout.spec.ts
  - tests/unit/grammarBookmarkStorage.spec.ts
-->

---
### Requirement: Storage failures degrade gracefully

When localStorage is unavailable, for example in private browsing or when storage quota is exhausted, the system SHALL allow the user to toggle bookmarks in the current session without throwing, and MUST NOT block other features of the grammar page. If persistence fails, the system MUST NOT surface raw storage errors to the user and SHALL allow further toggling to continue in memory.

#### Scenario: localStorage unavailable

- **GIVEN** localStorage is unavailable in the current browsing context
- **WHEN** the user clicks an outline bookmark
- **THEN** the bookmark button MUST render in the solid state for the current session
- **AND** no uncaught error MUST reach the user interface
- **AND** the page MUST continue to render the rest of the grammar content normally

#### Scenario: Persisted snapshot is corrupt

- **GIVEN** the persisted bookmark snapshot fails JSON validation
- **WHEN** the system attempts to read the snapshot
- **THEN** the read operation MUST return as if no bookmarks exist
- **AND** the corrupt entry MUST be removed from storage so subsequent writes start clean

<!-- @trace
source: add-grammar-reading-position-bookmark
updated: 2026-05-12
code:
  - src/styles/main.css
  - src/modules/grammar/storage/grammarBookmarkStorage.ts
  - src/modules/n5Grammar/components/N5GrammarSectionCard.vue
  - PROJECT_ARCHITECTURE.md
  - src/modules/n5Grammar/views/N5GrammarView.vue
  - _private/筆記.md
  - package.json
  - _private/propose.md
  - _private/discuss.txt
  - src/shared/config/storageKeys.ts
tests:
  - tests/unit/N5GrammarView.spec.ts
  - tests/unit/N5GrammarSectionCard.spec.ts
  - tests/e2e/n5-grammar-layout.spec.ts
  - tests/unit/grammarBookmarkStorage.spec.ts
-->