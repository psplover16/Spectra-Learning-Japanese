## ADDED Requirements

### Requirement: Constitution Source

The project SHALL use `openspec/config.yaml` as the authoritative source for compliance rules during this change.

#### Scenario: Compliance audit starts

- **WHEN** implementation work begins for `align-with-constitution`
- **THEN** the implementation MUST extract the applicable compliance rules from `openspec/config.yaml` before modifying governed code

### Requirement: Governed Code Alignment

All governed project code SHALL comply with the applicable rules extracted from `openspec/config.yaml`.

#### Scenario: Confirmed violation is found

- **WHEN** the audit identifies governed code that violates an applicable rule
- **THEN** the implementation MUST resolve the violation with the smallest code change that preserves existing behavior

#### Scenario: No violation is found

- **WHEN** the audit finds that a governed code area already complies with the applicable rules
- **THEN** the implementation MUST leave that code behavior unchanged

### Requirement: Conflict Handling

The implementation MUST document any conflict between `openspec/config.yaml` rules and existing design, requirements, or behavior, and MUST NOT change `openspec/config.yaml` in this change.

#### Scenario: Rule conflicts with existing behavior

- **WHEN** applying an applicable rule would require changing existing behavior or requirements
- **THEN** the implementation MUST document the conflict instead of silently changing the constitution

### Requirement: Compliance Verification

The implementation SHALL provide verification evidence for completed compliance fixes.

#### Scenario: Compliance fix is completed

- **WHEN** a confirmed violation has been fixed
- **THEN** the implementation MUST run the relevant existing validation or test command and record the result

#### Scenario: Validation cannot be run

- **WHEN** the relevant validation or test command cannot be run
- **THEN** the implementation MUST record the command, the failure reason, and the residual risk
