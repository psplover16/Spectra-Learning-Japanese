## ADDED Requirements

### Requirement: Table header bulk toggles visible draft vocabulary marks

The table header mark checkbox SHALL control only the draft mark state for currently visible vocabulary row keys. The vocabulary session MUST capture the current visible row key scope at the moment the header checkbox changes. When the header checkbox is checked, the vocabulary session SHALL add every key in that scope to `draftMarkedKeys`. When the header checkbox is unchecked, the vocabulary session SHALL remove every key in that scope from `draftMarkedKeys`. The vocabulary session SHALL preserve every draft key outside that scope. The header checkbox SHALL NOT show a delete confirmation, SHALL NOT write localStorage, and SHALL NOT update `persistedMarkedKeys`. The persisted snapshot SHALL change only when the user invokes the save-marks action.

#### Scenario: Header checkbox selects currently visible draft marks

- **WHEN** the current visible row scope contains keys `A|` and `B|`
- **AND** `draftMarkedKeys` contains no key from that scope
- **AND** the user checks the table header mark checkbox
- **THEN** `draftMarkedKeys` contains `A|` and `B|`
- **AND** draft keys outside the visible row scope remain unchanged
- **AND** localStorage and `persistedMarkedKeys` remain unchanged
- **AND** no delete confirmation is shown

#### Scenario: Header checkbox unselects currently visible draft marks

- **WHEN** the current visible row scope contains keys `A|` and `B|`
- **AND** `draftMarkedKeys` contains `A|`, `B|`, and hidden key `C|`
- **AND** the user unchecks the table header mark checkbox
- **THEN** `draftMarkedKeys` does not contain `A|` or `B|`
- **AND** `draftMarkedKeys` still contains `C|`
- **AND** localStorage and `persistedMarkedKeys` remain unchanged
- **AND** no delete confirmation is shown

#### Scenario: Header checkbox preserves hidden draft marks

- **WHEN** the current visible row scope contains only key `A|`
- **AND** `draftMarkedKeys` contains visible key `A|` and hidden key `B|`
- **AND** the user unchecks the table header mark checkbox
- **THEN** `draftMarkedKeys` does not contain `A|`
- **AND** `draftMarkedKeys` still contains `B|`

### Requirement: Header bulk mark checkbox reflects visible draft mark state

The table header mark checkbox SHALL be checked only when at least one vocabulary row is visible and every currently visible row key is present in `draftMarkedKeys`. The table header mark checkbox SHALL be unchecked when no row is visible or at least one currently visible row key is absent from `draftMarkedKeys`.

#### Scenario: Header checkbox is checked when all visible rows are draft marked

- **WHEN** the current visible row scope contains keys `A|` and `B|`
- **AND** `draftMarkedKeys` contains `A|` and `B|`
- **THEN** the table header mark checkbox is checked

#### Scenario: Header checkbox is unchecked when one visible row is not draft marked

- **WHEN** the current visible row scope contains keys `A|` and `B|`
- **AND** `draftMarkedKeys` contains `A|`
- **AND** `draftMarkedKeys` does not contain `B|`
- **THEN** the table header mark checkbox is unchecked

#### Scenario: Header checkbox updates after a visible row is unchecked

- **WHEN** the current visible row scope contains keys `A|` and `B|`
- **AND** the table header mark checkbox is checked because `draftMarkedKeys` contains `A|` and `B|`
- **AND** the user unchecks the row mark checkbox for `B|`
- **THEN** the table header mark checkbox becomes unchecked
- **AND** `draftMarkedKeys` still contains `A|`
- **AND** `draftMarkedKeys` does not contain `B|`

## REMOVED Requirements

### Requirement: Table header clear removes only visible vocabulary marks

**Reason**: The table header checkbox no longer clears persisted marks; it is replaced by a draft-only visible bulk mark toggle.
**Migration**: Use `Table header bulk toggles visible draft vocabulary marks` for header checkbox behavior. Persisted localStorage changes continue to flow only through the save-marks action.

#### Scenario: Header clear action is unavailable

- **WHEN** the vocabulary table header renders
- **THEN** no header clear action that removes keys from localStorage or `persistedMarkedKeys` is available
- **AND** the header checkbox does not show a visible-scope delete confirmation
