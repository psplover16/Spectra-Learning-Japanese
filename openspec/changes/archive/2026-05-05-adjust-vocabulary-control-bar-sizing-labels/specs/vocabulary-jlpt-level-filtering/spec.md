## ADDED Requirements

### Requirement: Vocabulary control sizing and concise mark filter label

The vocabulary practice page SHALL render the search input with a visible height of `2rem`. The vocabulary practice page SHALL render the mode toggle button in both `閱讀模式` and `操作模式` states with the same visible width and height as the start-quiz control. The mark-only filter control SHALL render the label `僅註記` and SHALL NOT render the label `只顯示註記`. These visual adjustments SHALL NOT change search filtering, mark-only filtering, reading mode toggling, or quiz start behavior.

#### Scenario: Search input uses compact height

- **WHEN** the vocabulary practice controls render
- **THEN** the search input visible height is `2rem`

#### Scenario: Mode toggle matches start quiz button size

- **WHEN** the vocabulary practice controls render with the mode toggle button labeled `閱讀模式` and the start-quiz control visible
- **THEN** the mode toggle button visible width and height match the start-quiz control visible width and height
- **WHEN** the user activates `閱讀模式` and the mode toggle button label changes to `操作模式`
- **THEN** the mode toggle button visible width and height still match the start-quiz control visible width and height

#### Scenario: Mark-only filter uses concise label

- **WHEN** the vocabulary practice action controls render
- **THEN** the mark-only filter control displays `僅註記`
- **AND** the action controls do not display `只顯示註記`
