## ADDED Requirements

### Requirement: Vocabulary quiz modal uses compact centered answer layout

The vocabulary quiz SHALL render its exam modal with a 0.5rem gap between the prompt and the answer area. The vocabulary multiline answer container `.exam-modal-answer-multiline` SHALL use flex layout and SHALL center answer content horizontally and vertically. The answer content MUST preserve newline-separated answer lines and MUST wrap long text without horizontal viewport overflow. Alphabet quiz routes that open the same modal without vocabulary-specific presentation options SHALL keep their existing default prompt size, hint text area, answer presentation, close confirmation, and actions.

#### Scenario: Vocabulary quiz centers multiline answers

- **WHEN** the vocabulary quiz displays an answer containing multiple newline-separated lines
- **THEN** the prompt and answer area are separated by 0.5rem
- **AND** `.exam-modal-answer-multiline` uses flex layout
- **AND** the answer content is centered horizontally and vertically within that container
- **AND** each answer line remains visible as a separate line without horizontal viewport overflow

#### Scenario: Alphabet quiz keeps default modal presentation

- **WHEN** the alphabet practice route opens the shared exam modal without vocabulary-specific presentation options
- **THEN** the modal keeps the default large prompt presentation
- **AND** the default hint text area remains available
- **AND** the alphabet quiz close confirmation and action behavior remain unchanged

### Requirement: Vocabulary quiz settlement does not show an unsaved hint

The vocabulary quiz SHALL settle results by updating in-page draft mark state only. The vocabulary practice page SHALL NOT render a `尚未儲存` message or any equivalent unsaved-marks hint after vocabulary quiz settlement, after draft mark changes caused by the quiz, or while draft marks differ from persisted marks.

#### Scenario: Quiz settlement changes draft marks without unsaved hint

- **WHEN** the vocabulary quiz finishes and changes one or more draft mark keys
- **THEN** the vocabulary practice page reflects the updated draft mark state
- **AND** the page does not display `尚未儲存`
- **AND** the page does not display an equivalent unsaved-marks hint
- **AND** localStorage remains unchanged until the user invokes the save-marks action
