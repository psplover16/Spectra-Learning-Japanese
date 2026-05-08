## ADDED Requirements

### Requirement: Offline return after PWA update MUST keep lazy learning data available

After an installed PWA downloads an update and completes an online reload, the system SHALL render both the cached route shell and the route-specific lazy learning data when the user opens the app offline. This requirement applies to /n5-grammar and /vocabulary because those routes depend on lazy-loaded grammar and vocabulary data assets.

#### Scenario: N5 grammar opens offline after update

- **GIVEN** the installed PWA has completed an online update reload
- **AND** the N5 grammar route and its learning data assets have been cached by the active service worker
- **WHEN** the user opens /n5-grammar while offline
- **THEN** the application shell remains visible
- **AND** the N5 grammar route renders grammar sections from cached assets
- **AND** the route does not display the N5 grammar data load failure state caused by a missing lazy asset

#### Scenario: Vocabulary opens offline after update

- **GIVEN** the installed PWA has completed an online update reload
- **AND** the vocabulary route and its JLPT vocabulary data assets have been cached by the active service worker
- **WHEN** the user opens /vocabulary while offline
- **THEN** the application shell remains visible
- **AND** the vocabulary route renders vocabulary rows from cached assets
- **AND** the route does not fail because a JLPT vocabulary data asset is missing from cache
