## ADDED Requirements

### Requirement: Service worker SHALL use Workbox cleanupOutdatedCaches for version-aware cache replacement

The Workbox-generated service worker SHALL enable `cleanupOutdatedCaches: true` so that outdated precache entries from previous service worker versions are removed during the new service worker activation step. This requirement implements the existing "Workbox normal lifecycle" cache replacement contract: outdated caches SHALL NOT be removed during the update transition itself, only after the new service worker activates.

#### Scenario: Outdated precache is removed after activation

- **GIVEN** a previous version of the service worker has cached precache entries
- **AND** a new version of the service worker is downloaded with new precache entries
- **WHEN** the new service worker reaches the activate lifecycle event
- **THEN** the previous version's precache entries SHALL be removed by Workbox
- **AND** the new version's precache entries SHALL serve subsequent requests

#### Scenario: Update transition does not remove cached learning assets

- **GIVEN** the installed PWA has Workbox-managed precache entries for the app shell, route chunks, and learning data assets
- **WHEN** a service worker update is in progress and the new service worker has not yet activated
- **THEN** the previous version's precache entries SHALL remain available to serve offline requests
- **AND** no cache entries SHALL be removed before the new service worker activates
