## ADDED Requirements

### Requirement: Vocabulary data rejects duplicate text and kanji entries across stages

Vocabulary source data SHALL NOT contain more than one raw vocabulary entry with the same `text` and the same `kanji` value across JLPT stage files. When duplicate source entries share the same `text` and same `kanji`, the data SHALL be consolidated into one entry at the simplest source JLPT stage according to `N5`, `N4`, `N3`, `N2`, then `N1`. The consolidated entry MUST preserve valid distinct meanings as separate `meaning` lines and MUST preserve kanji-to-meaning line alignment.

#### Scenario: Duplicate text and kanji across stages fails validation

- **WHEN** raw vocabulary data contains one entry with `text = "あげる"`, `kanji = "上げる"`, and `stage = "N3"`
- **AND** raw vocabulary data also contains another entry with `text = "あげる"`, `kanji = "上げる"`, and `stage = "N5"`
- **THEN** vocabulary data validation reports the duplicate text-and-kanji entries
- **AND** implementation is not complete until the entries are consolidated into one `N5` entry

#### Scenario: Consolidated duplicate keeps aligned senses

- **WHEN** duplicate entries with the same `text` and same `kanji` are consolidated
- **THEN** the consolidated entry keeps every verified distinct meaning as its own `meaning` line
- **AND** each kanji-bearing meaning line has the corresponding `kanji` line
- **AND** the consolidated entry uses the simplest source JLPT stage

#### Scenario: Future additions cannot reintroduce duplicate text and kanji

- **WHEN** a new raw vocabulary entry is added to any JLPT stage file
- **AND** another raw vocabulary entry already has the same `text` and same `kanji`
- **THEN** vocabulary data validation fails until the entries are consolidated

#### Scenario: Same text with different kanji remains separate

- **WHEN** raw vocabulary data contains two entries with the same `text`
- **AND** the entries have different `kanji` values
- **THEN** vocabulary data validation does not require those entries to be consolidated by this requirement
