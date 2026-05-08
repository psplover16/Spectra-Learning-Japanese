## ADDED Requirements

### Requirement: PWA update confirmation MUST retain offline caches

When the application applies an available service worker update from either the update action or a deferred automatic update, the system SHALL NOT delete all CacheStorage entries before invoking the service worker update. The system SHALL leave Workbox-managed precache entries available until Workbox replaces outdated caches through its normal lifecycle. The system SHALL remove the deferred update flag from localStorage when applying the update.

#### Scenario: User-confirmed update keeps cached learning assets

- **GIVEN** the installed PWA has Workbox-managed precache entries for the app shell, primary route chunks, N5 grammar assets, and vocabulary data assets
- **WHEN** the user activates the update action
- **THEN** the system invokes the service worker update with reload enabled
- **AND** the system does not delete every CacheStorage entry before the reload
- **AND** the cached learning assets remain available for offline requests during the update transition

#### Scenario: Deferred automatic update keeps cached learning assets

- **GIVEN** the deferred PWA update flag is stored in localStorage
- **AND** a service worker update is available
- **WHEN** the system applies the deferred update automatically
- **THEN** the system invokes the same cache-retaining update path as a user-confirmed update
- **AND** the deferred update flag is removed from localStorage
