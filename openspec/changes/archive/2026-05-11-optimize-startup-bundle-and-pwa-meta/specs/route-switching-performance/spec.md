## ADDED Requirements

### Requirement: Service worker SHALL enable navigation preload for faster route transitions

The Workbox-generated service worker SHALL enable `navigationPreload: true` so the browser begins fetching the navigation request in parallel with service worker startup. This reduces the perceived latency of SPA route changes when the service worker has not been recently active.

#### Scenario: Navigation request begins during service worker startup

- **GIVEN** the service worker has not been recently active
- **WHEN** the user navigates to a route handled by the SPA
- **THEN** the browser SHALL initiate the navigation network request in parallel with service worker startup
- **AND** the resolved navigation response SHALL serve the route shell

### Requirement: Service worker SHALL use the application base path for navigation fallback

The Workbox-generated service worker SHALL configure `navigateFallback` to the value of the application base path appended with `index.html`, so SPA navigation fallback works correctly when the application is deployed under a non-root path such as `/Spectra-Learning-Japanese/` or `/Spectra-Learning-Japanese/staging/`. The service worker SHALL also configure a `navigateFallbackDenylist` that excludes API-style paths from this fallback.

#### Scenario: Offline navigation under base-path deployment

- **GIVEN** the application is deployed at a base path such as `/Spectra-Learning-Japanese/staging/`
- **AND** the user has previously visited an SPA route under that base path
- **WHEN** the user opens or refreshes the SPA route while offline
- **THEN** the service worker SHALL serve the precached `index.html` from the base path
- **AND** the SPA shell SHALL render successfully

#### Scenario: API-style path is excluded from navigation fallback

- **GIVEN** the navigateFallback is configured at the application base path
- **WHEN** a navigation request matches the API denylist pattern such as a path starting with `/api/`
- **THEN** the service worker SHALL NOT serve the SPA shell as a fallback
- **AND** the request SHALL pass through to the network or its dedicated handler
