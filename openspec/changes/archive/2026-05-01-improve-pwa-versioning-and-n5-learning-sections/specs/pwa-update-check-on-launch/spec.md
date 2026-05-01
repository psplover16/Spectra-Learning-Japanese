## ADDED Requirements

### Requirement: PWA App MUST check for service-worker updates on every launch

When the application starts (each time the user opens the installed PWA), the system SHALL trigger a Service Worker update check by calling `registration.update()` on the active SW registration. This check SHALL run exactly once per launch.

#### Scenario: Launch update check runs once

- **WHEN** the user opens the installed PWA App
- **THEN** the system invokes `registration.update()` exactly once during startup

### Requirement: Update delivery MUST NOT require opening the website entry

When a new version is correctly deployed, users with the installed PWA App SHALL receive the update without manually opening the website. The launch update check SHALL be the trigger that surfaces the new SW to the existing update-prompt UI.

#### Scenario: Installed App user receives new version on launch

- **GIVEN** a new version has been deployed and the user has the previous version installed as a PWA App
- **WHEN** the user opens the App
- **THEN** the launch update check detects the new SW
- **AND** the existing update-prompt UI surfaces

### Requirement: Existing update-prompt UI MUST be preserved

This change SHALL NOT modify the existing update-prompt UI behavior. The launch update check SHALL only feed the existing detection mechanism with timelier signals.

#### Scenario: UI is unchanged after update detection

- **WHEN** an update is detected after launch
- **THEN** the same update-prompt UI that existed before this change is shown
- **AND** no new prompts, dialogs, or banners are introduced

### Requirement: Update check MUST fail silently when offline or unreachable

When the user is offline or the update check rejects with an error, the system SHALL catch the error and continue normal startup. The user MUST NOT see a stack trace, error toast, or blocked screen.

#### Scenario: Offline launch

- **GIVEN** the user is offline
- **WHEN** the App launches and triggers the update check
- **THEN** the check fails silently without affecting subsequent app behavior
- **AND** no error UI is shown
