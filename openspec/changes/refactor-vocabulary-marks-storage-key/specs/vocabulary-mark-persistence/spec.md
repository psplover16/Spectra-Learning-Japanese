## ADDED Requirements

### Requirement: Vocabulary marks use stable natural keys

The vocabulary mark persistence system SHALL store marked vocabulary entries as stable natural keys composed from the entry text, a literal pipe separator, and the entry kanji value. The stored natural key SHALL NOT include the vocabulary stage, array position, numeric id, or display id.

#### Scenario: Marked entry is saved with a natural key

- **WHEN** a vocabulary entry with text `おい` and empty kanji is marked and saved
- **THEN** the persisted version 2 snapshot contains `おい|` in `markedKeys`
- **AND** the snapshot does not contain a numeric id for that mark

##### Example: natural key formation

| text | kanji | Expected key |
| ---- | ----- | ------------ |
| `おい` | `` | `おい|` |
| `会う` | `あう` | `会う|あう` |

#### Scenario: Stage changes do not change the stored key

- **WHEN** the same vocabulary entry is assigned a different JLPT stage by a later dictionary update
- **THEN** the persisted natural key for that entry remains based on text and kanji only
- **AND** the mark still matches the entry if text and kanji are unchanged

### Requirement: Version 1 mark snapshots migrate to version 2

The vocabulary mark persistence system MUST migrate version 1 snapshots from `markedIds: number[]` to version 2 snapshots with `markedKeys: string[]` by resolving each numeric id against the current normalized vocabulary order at migration time.

#### Scenario: Existing numeric ids are converted to natural keys

- **WHEN** localStorage contains a version 1 snapshot with `markedIds` for entries that exist in the current normalized vocabulary
- **THEN** loading marks converts those ids into the matching natural keys
- **AND** localStorage is rewritten as a version 2 snapshot

##### Example: version 1 to version 2 conversion

| Current normalized vocabulary position | text | kanji | v1 id | v2 key |
| -------------------------------------- | ---- | ----- | ----- | ------ |
| 1 | `おい` | `` | `1` | `おい|` |
| 2 | `会う` | `あう` | `2` | `会う|あう` |

#### Scenario: Unresolvable numeric ids are discarded during migration

- **WHEN** a version 1 snapshot contains a numeric id that does not resolve to an entry in the current normalized vocabulary
- **THEN** that id is not represented in the migrated `markedKeys`
- **AND** the migration completes without showing a user-facing notification

### Requirement: Stored mark keys are pruned against the current dictionary

The vocabulary mark persistence system SHALL validate stored version 2 `markedKeys` against the current dictionary key set each time marks are loaded. Keys that do not exist in the current dictionary MUST be removed from the loaded snapshot and from localStorage.

#### Scenario: Missing dictionary keys are removed silently

- **WHEN** localStorage contains a version 2 snapshot with one key that exists in the current dictionary and one key that does not exist
- **THEN** loading marks returns only the existing key
- **AND** localStorage is rewritten without the missing key
- **AND** no user-facing notification is shown

##### Example: pruning stored keys

| Stored key | Current dictionary contains key | Expected loaded result |
| ---------- | ------------------------------- | ---------------------- |
| `おい|` | yes | kept |
| `missing|` | no | removed |

#### Scenario: Valid stored keys are preserved

- **WHEN** every stored key exists in the current dictionary key set
- **THEN** loading marks preserves those keys
- **AND** the mark-only filter can match those entries by key

### Requirement: Vocabulary mark interactions compare by stable key

The vocabulary session SHALL use stable natural keys for mark toggling, saving, clearing, and mark-only filtering. Numeric vocabulary ids remain available for non-persistence concerns, but mark behavior MUST NOT depend on numeric ids.

#### Scenario: Toggling a mark updates the key set

- **WHEN** a user toggles the mark state for a vocabulary entry
- **THEN** the session adds or removes that entry natural key from the in-memory marked key set
- **AND** saving marks persists the same key set to localStorage

#### Scenario: Mark-only filter uses keys

- **WHEN** the mark-only filter is active
- **THEN** visible vocabulary includes entries whose natural keys are present in the marked key set
- **AND** visible vocabulary excludes entries whose natural keys are absent from the marked key set

##### Example: key-based filtering

| Entry text | Entry kanji | Marked keys | Visible with mark-only |
| ---------- | ----------- | ----------- | ---------------------- |
| `おい` | `` | `おい|` | yes |
| `会う` | `あう` | `おい|` | no |
