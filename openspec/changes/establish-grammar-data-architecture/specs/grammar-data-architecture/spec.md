## ADDED Requirements

### Requirement: Each JLPT level grammar module SHALL classify its sections into one of five canonical categories

Each section in a JLPT level grammar data set (N1, N2, N3, N4, or N5) SHALL declare a `category` value drawn from the canonical set:

- `particles` — 助詞 (particles such as wa, ga, wo, more advanced particles in higher levels)
- `fundamentals` — 詞類補助 (demonstratives, question words, numerals, time expressions, conjunctions, adverbs)
- `sentence-patterns` — 句型 (sentence structure, conditionals, sentence-final expressions)
- `expressions` — 表達 (推測、傳聞、慣用句、書面/古典語法)
- `honorifics` — 敬語體系 (敬體、尊敬語、謙讓語、丁寧語)

The category union SHALL be enforced by a TypeScript type so invalid values fail compilation. New JLPT levels added in the future SHALL define their own category union with the same five values.

#### Scenario: Section uses a canonical category value

- **GIVEN** a JLPT N5 grammar section
- **WHEN** the section is declared in the data layer
- **THEN** its `category` field SHALL be one of `particles`, `fundamentals`, `sentence-patterns`, `expressions`, `honorifics`
- **AND** any other value SHALL fail TypeScript compilation

### Requirement: JLPT level grammar module SHALL split section data into one file per category

For each JLPT level that participates in this architecture, the section data SHALL live in `src/modules/n<L>Grammar/data/sections/<category>.ts` files (where `<L>` is the JLPT level number and `<category>` is one of the five canonical category values). Each file SHALL export a `sections` array whose entries all have `category` equal to the file's category.

A barrel file `src/modules/n<L>Grammar/data/grammarNotes.ts` SHALL re-export the merged and sorted section list (`sorted<level>GrammarSections`) and any module-wide constants (such as `particleSectionIds`, `n<L>GrammarSourceCoverage`).

If a category is empty for a JLPT level, the file SHALL still exist and export `sections: []` so the directory structure stays uniform across levels.

#### Scenario: N5 grammar module exposes five category files

- **GIVEN** the N5 grammar module is implemented
- **WHEN** a developer inspects `src/modules/n5Grammar/data/sections/`
- **THEN** the directory SHALL contain `particles.ts`, `fundamentals.ts`, `sentence-patterns.ts`, `expressions.ts`, `honorifics.ts`
- **AND** each file SHALL export `sections` whose entries all share the file's category
- **AND** the parent `grammarNotes.ts` SHALL re-export the merged `sortedN5GrammarSections` array

#### Scenario: Empty category file uses uniform structure

- **GIVEN** a JLPT level has no section in a particular category (for example N5 has no `expressions` content)
- **WHEN** the module is implemented
- **THEN** the `<category>.ts` file SHALL still exist
- **AND** export `sections: []` so the structure across levels stays uniform

### Requirement: Section sections file content consistency SHALL be enforced by tests

The unit test suite SHALL include a check, per JLPT level grammar module that participates in this architecture, that every section in `<category>.ts` has `category === '<category>'`. This catches misplaced sections that pass TypeScript compilation but break the file/category mapping.

#### Scenario: Misplaced section is caught by tests

- **GIVEN** a developer adds a `category: 'particles'` section into `fundamentals.ts` by mistake
- **WHEN** the unit test suite runs
- **THEN** the consistency test SHALL fail
- **AND** the failure message SHALL identify the misplaced section's id and its declared category vs. the file's expected category

### Requirement: Default loader SHALL load all category files in parallel and merge before sorting

The composable that provides the JLPT level grammar sections SHALL load all five category files in parallel via `Promise.all`. Once all files are loaded, the composable SHALL merge their `sections` arrays and apply the level's existing sort callback to produce the final `sorted<level>GrammarSections` array. The merged result SHALL preserve the same section order and id set that a single-file implementation would produce.

#### Scenario: Parallel load preserves merged order

- **GIVEN** the N5 grammar composable is invoked for the first time
- **WHEN** the default loader runs
- **THEN** the loader SHALL initiate parallel imports of `particles.ts`, `fundamentals.ts`, `sentence-patterns.ts`, `expressions.ts`, `honorifics.ts`
- **AND** after all imports resolve, the merged + sorted `sortedN5GrammarSections` array SHALL contain exactly the same section ids and order as a single-file `n5GrammarSections.sort(...)` would produce

#### Scenario: Any single file failure surfaces as load error

- **GIVEN** the N5 grammar composable is invoked
- **WHEN** any one of the five parallel imports rejects
- **THEN** the composable SHALL set `loadError` to the same offline message used previously
- **AND** SHALL NOT partially populate `sections` from the other four files
