## ADDED Requirements

### Requirement: Vocabulary practice controls separate operation filters from table word practice

The vocabulary practice page SHALL remove the operation-area practice checkbox. The vocabulary table header SHALL provide a separate practice checkbox inside the word column header next to the word checkbox. The `.vocabulary-header-toggle` gap SHALL be `0.4rem`, and the word checkbox and table practice checkbox SHALL have `0.5rem` spacing between them. The word checkbox SHALL be checked by default and the table practice checkbox SHALL be unchecked by default.

#### Scenario: Operation-area practice checkbox is absent

- **WHEN** the vocabulary practice page renders in operation mode
- **THEN** the operation area does not render a practice checkbox
- **AND** the vocabulary table word header renders both the word checkbox and the table practice checkbox

#### Scenario: Table header spacing is fixed

- **WHEN** the vocabulary table word header renders
- **THEN** `.vocabulary-header-toggle` uses a `0.4rem` gap
- **AND** the word checkbox and table practice checkbox are separated by `0.5rem`

#### Scenario: Word header defaults to normal word display

- **WHEN** the vocabulary practice page first renders
- **THEN** the word checkbox is checked
- **AND** the table practice checkbox is unchecked

### Requirement: Vocabulary word display supports kana swap practice

The vocabulary table SHALL use the word checkbox and table practice checkbox to control the word cell. When the word checkbox is checked, the word cell SHALL display the entry's original `text` kana regardless of the table practice checkbox state. When only the table practice checkbox is checked, the word cell SHALL display the entry's `text` with hiragana converted to katakana and katakana converted to hiragana per kana character. When neither checkbox is checked, the word cell SHALL render no word text.

#### Scenario: Word checkbox takes precedence

- **WHEN** the word checkbox is checked
- **AND** the table practice checkbox is checked
- **THEN** each vocabulary word cell displays the original entry `text`

#### Scenario: Practice-only display swaps kana scripts

- **WHEN** the word checkbox is unchecked
- **AND** the table practice checkbox is checked
- **THEN** each vocabulary word cell displays the entry `text` with hiragana and katakana swapped

##### Example: kana swap cases

| Entry text | Displayed word |
| ---------- | -------------- |
| `あさ` | `アサ` |
| `あサ` | `アさ` |

#### Scenario: Both word controls hidden

- **WHEN** the word checkbox is unchecked
- **AND** the table practice checkbox is unchecked
- **THEN** each vocabulary word cell renders no word text

### Requirement: Vocabulary operation filters use fixed order and defaults

The vocabulary operation area SHALL place the kanji checkbox, all-sounds checkbox, and marked-only checkbox in that order. The kanji checkbox and all-sounds checkbox SHALL be checked by default.

#### Scenario: Operation filters render in fixed order

- **WHEN** the vocabulary practice operation area renders
- **THEN** the filter checkboxes appear in the order kanji, all sounds, marked only

#### Scenario: Operation filters use required defaults

- **WHEN** the vocabulary practice page first renders
- **THEN** the kanji checkbox is checked
- **AND** the all-sounds checkbox is checked

### Requirement: Vocabulary reading mode overlays the table without hiding search controls

The vocabulary practice page SHALL default to operation mode and SHALL render a mode button labeled `閱讀模式` with a light green background. Activating that button SHALL enter reading mode and change the button label to `操作模式` with a bright red background. In reading mode, the vocabulary table SHALL animate upward and cover the operation area with an opaque background using the current project background color. The table overlay SHALL NOT cover the search input row or the mode button row. Activating `操作模式` SHALL animate the table downward and return the page to operation mode.

#### Scenario: Operation mode is the initial mode

- **WHEN** the vocabulary practice page first renders
- **THEN** the page is in operation mode
- **AND** the mode button displays `閱讀模式`
- **AND** the mode button has a light green background

#### Scenario: Reading mode keeps search controls visible

- **WHEN** the user activates the `閱讀模式` button
- **THEN** the page enters reading mode
- **AND** the mode button displays `操作模式`
- **AND** the mode button has a bright red background
- **AND** the vocabulary table covers the operation area with an opaque project-background surface
- **AND** the search input row and mode button row remain visible above the table overlay

#### Scenario: Operation mode restores normal layout

- **WHEN** the page is in reading mode
- **AND** the user activates the `操作模式` button
- **THEN** the vocabulary table animates downward
- **AND** the page returns to the normal operation-mode layout

### Requirement: Vocabulary table bottom row remains visible

The vocabulary table SHALL allow the final visible vocabulary row to be fully visible when the table is scrolled to the bottom in both operation mode and reading mode.

#### Scenario: Final row is visible in operation mode

- **WHEN** the vocabulary table is in operation mode
- **AND** the user scrolls the table to the bottom
- **THEN** the final visible vocabulary row is not covered by page controls or table chrome

#### Scenario: Final row is visible in reading mode

- **WHEN** the vocabulary table is in reading mode
- **AND** the user scrolls the table to the bottom
- **THEN** the final visible vocabulary row is not covered by page controls or table chrome

### Requirement: Vocabulary quiz layer stays above reading mode

Vocabulary quiz UI SHALL render above the vocabulary reading-mode table overlay and mode controls.

#### Scenario: Quiz modal is above reading mode overlay

- **WHEN** the vocabulary quiz UI is open while the vocabulary practice page is in reading mode
- **THEN** the quiz UI appears above the reading-mode table overlay
- **AND** the reading-mode table overlay does not block quiz interactions
