## ADDED Requirements

### Requirement: Visible vocabulary is ordered from N5 to N1

The vocabulary practice table SHALL order visible vocabulary by JLPT stage from `N5`, `N4`, `N3`, `N2`, then `N1` after applying active filters and before rendering rows when no other explicit sort is active. The system SHALL NOT use lazy-load completion order, source file import order, or selected checkbox order as the inter-stage display order. Entries within the same JLPT stage SHALL keep their existing normalized vocabulary order.

#### Scenario: All JLPT levels render from simplest to advanced

- **WHEN** vocabulary data contains visible entries from `N5`, `N4`, `N3`, `N2`, and `N1`
- **AND** all JLPT level filters are selected
- **AND** no other explicit sort is active
- **THEN** the table renders all visible `N5` rows before `N4` rows
- **AND** it renders all visible `N4` rows before `N3` rows
- **AND** it renders all visible `N3` rows before `N2` rows
- **AND** it renders all visible `N2` rows before `N1` rows

##### Example: full JLPT ordering

| Visible entry | Stage | Expected relative group |
| ------------- | ----- | ----------------------- |
| `alpha` | `N1` | 5 |
| `beta` | `N5` | 1 |
| `gamma` | `N3` | 3 |
| `delta` | `N4` | 2 |
| `epsilon` | `N2` | 4 |

#### Scenario: Selected subset still follows JLPT learning order

- **WHEN** the visible vocabulary contains entries from `N4`, `N2`, and `N1`
- **AND** no visible entry exists for `N5` or `N3`
- **AND** no other explicit sort is active
- **THEN** the table renders `N4` rows before `N2` rows
- **AND** it renders `N2` rows before `N1` rows

#### Scenario: Lazy load completion does not change stage order

- **WHEN** `N1` vocabulary data finishes loading before `N5` vocabulary data
- **AND** both levels are selected and visible after loading completes
- **AND** no other explicit sort is active
- **THEN** the table renders visible `N5` rows before visible `N1` rows
