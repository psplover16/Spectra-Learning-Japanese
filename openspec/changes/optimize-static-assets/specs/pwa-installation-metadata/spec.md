## ADDED Requirements

### Requirement: Favicon SHALL be a multi-size ICO sized appropriately for browser tabs

The application SHALL provide its favicon as a multi-size ICO file containing entries sized for browser tab and bookmark contexts (at minimum 16x16 and 32x32, optionally 48x48 and 64x64). The HTML head `<link rel="icon">` SHALL reference this multi-size ICO. A 256x256 PNG-in-ICO file is too large for typical favicon use and SHALL NOT be the primary favicon source.

#### Scenario: Browser tab loads small favicon

- **GIVEN** the application is opened in a browser tab
- **WHEN** the browser fetches the favicon referenced by `<link rel="icon">`
- **THEN** the fetched ICO file SHALL contain at least one entry sized 16x16 or 32x32
- **AND** the file size SHALL be less than 5 KB

#### Scenario: Bookmark tile renders favicon at correct resolution

- **GIVEN** the user has bookmarked the application
- **WHEN** the browser displays the bookmark tile or favorites bar
- **THEN** the rendered icon SHALL come from the multi-size ICO without requiring browser-side downscaling of a much larger source image
