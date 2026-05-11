## ADDED Requirements

### Requirement: HTML head SHALL provide PWA installation and SEO metadata

The application HTML head SHALL include the following meta tags so the PWA presents consistent identity and theming across browsers, share previews, and PWA installation flows:

- `description` meta tag
- `theme-color` meta tag matching the value declared in the web manifest
- `color-scheme` meta tag

#### Scenario: Browser renders share preview

- **WHEN** the application URL is shared on a service that renders HTML metadata
- **THEN** the rendered preview SHALL show the description from the HTML head
- **AND** the theme color SHALL match the value declared in the PWA manifest

### Requirement: HTML head SHALL provide iOS PWA installation hints

The application HTML head SHALL include the following meta tags and link tags so the PWA installs correctly on iOS Safari:

- `apple-mobile-web-app-capable` set to "yes"
- `apple-mobile-web-app-status-bar-style` set to "default"
- `apple-mobile-web-app-title`
- `apple-touch-icon` link pointing to a 180x180 icon

#### Scenario: User installs the app on iOS Safari

- **WHEN** an iOS Safari user installs the PWA to the home screen
- **THEN** the home-screen icon SHALL render from the apple-touch-icon link
- **AND** the launched app SHALL run in standalone mode without browser chrome
- **AND** the home-screen label SHALL match the apple-mobile-web-app-title value

### Requirement: HTML SHALL declare viewport-fit=cover for iPhone notch support

The application viewport meta tag SHALL declare `viewport-fit=cover` so the PWA can render edge-to-edge on iPhone devices with a display notch or rounded corners.

#### Scenario: PWA opens on iPhone with notch

- **WHEN** the PWA opens on an iPhone with a display notch and viewport-fit=cover is declared
- **THEN** the viewport SHALL extend into the notch area
- **AND** the application SHALL render its background through the notch region

### Requirement: Sticky and fixed UI elements SHALL respect iPhone safe-area inset

When the viewport extends edge-to-edge under viewport-fit=cover, sticky or fixed UI elements that anchor to the top of the viewport SHALL apply `env(safe-area-inset-top)` so their content is not occluded by the device notch or rounded corners. This requirement applies to the route tabs header, the practice toolbar, and the N5 grammar section header.

#### Scenario: Sticky header is not occluded on iPhone with notch

- **GIVEN** the PWA opens on an iPhone with a display notch
- **AND** viewport-fit=cover is declared on the viewport meta tag
- **WHEN** any sticky header named in this requirement is visible
- **THEN** the header content SHALL render below the safe-area-inset-top region
- **AND** no header text or interactive control SHALL be occluded by the notch
