## ADDED Requirements

### Requirement: Vocabulary marks persistence uses IndexedDB

The vocabulary mark persistence system SHALL store marks in an IndexedDB database named `vocabulary` with an object store named `marks`. Each record SHALL use the natural key (the entry text, a literal pipe separator, and the entry kanji value) as its primary identifier. The vocabulary mark persistence system SHALL NOT use localStorage as the primary storage for marks after the migration described in the next requirement completes.

#### Scenario: Marks persist in the IndexedDB mark store across reloads

- **WHEN** a user marks a vocabulary entry with text `おい` and empty kanji and reloads the page
- **THEN** the IndexedDB database `vocabulary` contains a record in the `marks` object store with key `おい|`
- **AND** the marks visible on the vocabulary view match the IndexedDB mark store contents

##### Example: stored record shape

| text | kanji | Stored IndexedDB record key | Stored record id field |
| ---- | ----- | --------------------------- | ---------------------- |
| `おい` | empty | `おい|` | `おい|` |
| `会う` | `あう` | `会う|あう` | `会う|あう` |

#### Scenario: IndexedDB unavailable degrades to in-memory marks

- **WHEN** IndexedDB cannot be opened (private browsing, strict browser configuration, storage quota exhausted)
- **THEN** mark read operations return an empty list
- **AND** mark write operations are no-ops at the storage layer
- **AND** mark toggling and filtering continue to work in-memory for the current session
- **AND** a single console warning is emitted the first time IndexedDB open fails per session
- **AND** marks do not persist across reloads in this degraded state

### Requirement: Marks persistence migrates from localStorage to the IndexedDB mark store on first run

On application startup, the vocabulary mark persistence system SHALL detect existing localStorage-backed marks (any prior schema version) and SHALL migrate them to the IndexedDB mark store before serving any mark read or accepting any mark write from the rest of the application. The vocabulary mark persistence system SHALL NOT remove the localStorage marks key until every mark has been successfully written to the IndexedDB mark store.

#### Scenario: Migration moves localStorage version 2 marks to IndexedDB

- **WHEN** localStorage contains a version 2 mark snapshot with keys `おい|` and `会う|あう`
- **AND** the IndexedDB `vocabulary` database is empty or absent
- **THEN** after migration completes, the IndexedDB `marks` object store contains records for `おい|` and `会う|あう`
- **AND** localStorage no longer contains the marks key

#### Scenario: Migration is idempotent across interrupted startups

- **WHEN** migration begins and fails before all keys have been written to IndexedDB
- **THEN** localStorage still contains the original marks snapshot after the failure
- **AND** the next application startup detects unfinished migration and retries
- **AND** retried migration produces the same final IndexedDB mark store contents as a single successful run

#### Scenario: Migration resolves legacy version 1 ids before writing

- **WHEN** localStorage contains a version 1 mark snapshot with `markedIds` for entries that exist in the current normalized vocabulary
- **AND** the IndexedDB `vocabulary` database is empty or absent
- **THEN** migration resolves each numeric id to a natural key via the current normalized vocabulary order
- **AND** writes the resolved natural keys to the IndexedDB `marks` object store
- **AND** removes the localStorage marks key only after all resolved keys have been written

##### Example: legacy migration path

| Source localStorage | Current normalized vocabulary | Final IndexedDB keys |
| ------------------- | ----------------------------- | -------------------- |
| version 1 with markedIds [1, 2] | position 1 = `おい|`, position 2 = `会う|あう` | `おい|`, `会う|あう` |
| version 2 with markedKeys [`おい|`] | position 1 = `おい|` | `おい|` |


## MODIFIED Requirements

### Requirement: Stored mark keys are pruned against the current dictionary

The vocabulary mark persistence system SHALL validate stored mark keys against the current dictionary key set each time marks are loaded. Keys that do not exist in the current dictionary MUST be removed from the loaded snapshot and from the mark store. The mark store SHALL be the IndexedDB `marks` object store described in the storage backend requirement; for legacy startups before migration completes, the mark store SHALL be the localStorage marks snapshot.

#### Scenario: Missing dictionary keys are removed silently

- **WHEN** the mark store contains one key that exists in the current dictionary and one key that does not exist
- **THEN** loading marks returns only the existing key
- **AND** the mark store is rewritten without the missing key
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

##### Example: valid keys remain available

| Stored key | Current dictionary contains key | Expected loaded result |
| ---------- | ------------------------------- | ---------------------- |
| `おい|` | yes | kept |
| `会う|あう` | yes | kept |

#### Scenario: Duplicate stored keys are collapsed

- **WHEN** the mark store contains the same key more than once
- **THEN** loading marks preserves the first occurrence of that key
- **AND** the mark store is rewritten with only one copy of that key

##### Example: duplicate key pruning

| Stored keys | Expected loaded result |
| ----------- | ---------------------- |
| `おい|`, `会う|あう`, `おい|` | `おい|`, `会う|あう` |

### Requirement: Saving vocabulary marks merges only visible entries

The vocabulary save-marks action SHALL persist a merge of currently visible vocabulary row keys into the existing mark snapshot in the mark store. The system MUST capture the visible row key scope at the moment the user invokes save. For each key in that scope, the system SHALL write the key when draft marks contain it and SHALL remove the key when draft marks do not contain it. The system SHALL preserve every persisted key that is outside that scope. The visible row key scope MUST reflect active search, selected JLPT levels, marked-only state, practice mode state, loaded vocabulary data, and any other filter that affects the rows currently shown on the page. The mark store SHALL be the IndexedDB `marks` object store after migration completes.

#### Scenario: Saving checked visible entry preserves hidden persisted entry

- **WHEN** entries `A(stage=N1)` and `B(stage=N5)` are persisted marks
- **AND** the current visible row scope contains only `A(stage=N1)`
- **AND** draft marks contain `A(stage=N1)`
- **AND** the user invokes save marks
- **THEN** the mark store contains the key for `A(stage=N1)`
- **AND** the mark store still contains the key for `B(stage=N5)`

#### Scenario: Saving unchecked visible entry removes only that visible entry

- **WHEN** entries `A(stage=N1)` and `B(stage=N5)` are persisted marks
- **AND** the current visible row scope contains only `A(stage=N1)`
- **AND** draft marks do not contain `A(stage=N1)`
- **AND** the user invokes save marks
- **THEN** the mark store does not contain the key for `A(stage=N1)`
- **AND** the mark store still contains the key for `B(stage=N5)`

#### Scenario: Visible scope follows active filters

- **WHEN** search text, selected JLPT levels, marked-only state, or practice mode changes the visible vocabulary rows
- **AND** the user invokes save marks
- **THEN** only keys for rows visible after those filters are applied are merged into the mark store
- **AND** persisted keys for filtered-out rows remain unchanged

### Requirement: Table header bulk toggles visible draft vocabulary marks

The table header mark checkbox SHALL control only the draft mark state for currently visible vocabulary row keys. The vocabulary session MUST capture the current visible row key scope at the moment the header checkbox changes. When the header checkbox is checked, the vocabulary session SHALL add every key in that scope to `draftMarkedKeys`. When the header checkbox is unchecked, the vocabulary session SHALL remove every key in that scope from `draftMarkedKeys`. The vocabulary session SHALL preserve every draft key outside that scope. The header checkbox SHALL NOT show a delete confirmation, SHALL NOT write to the mark store, and SHALL NOT update `persistedMarkedKeys`. The persisted snapshot in the mark store SHALL change only when the user invokes the save-marks action.

#### Scenario: Header checkbox selects currently visible draft marks

- **WHEN** the current visible row scope contains keys `A|` and `B|`
- **AND** `draftMarkedKeys` contains no key from that scope
- **AND** the user checks the table header mark checkbox
- **THEN** `draftMarkedKeys` contains `A|` and `B|`
- **AND** draft keys outside the visible row scope remain unchanged
- **AND** the mark store and `persistedMarkedKeys` remain unchanged
- **AND** no delete confirmation is shown

#### Scenario: Header checkbox unselects currently visible draft marks

- **WHEN** the current visible row scope contains keys `A|` and `B|`
- **AND** `draftMarkedKeys` contains `A|`, `B|`, and hidden key `C|`
- **AND** the user unchecks the table header mark checkbox
- **THEN** `draftMarkedKeys` does not contain `A|` or `B|`
- **AND** `draftMarkedKeys` still contains `C|`
- **AND** the mark store and `persistedMarkedKeys` remain unchanged
- **AND** no delete confirmation is shown

#### Scenario: Header checkbox preserves hidden draft marks

- **WHEN** the current visible row scope contains only key `A|`
- **AND** `draftMarkedKeys` contains visible key `A|` and hidden key `B|`
- **AND** the user unchecks the table header mark checkbox
- **THEN** `draftMarkedKeys` does not contain `A|`
- **AND** `draftMarkedKeys` still contains `B|`
