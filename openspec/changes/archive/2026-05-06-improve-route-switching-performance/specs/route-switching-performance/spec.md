## ADDED Requirements

### Requirement: Route switches keep visible feedback
The system SHALL keep the application shell and navigation controls rendered while a target route component or route data is loading. The main route region MUST display either the previous route content or an explicit route loading state until the target route can render meaningful content. The system MUST NOT leave the main route region blank during normal route transitions.

#### Scenario: Switching to an unloaded route chunk

- **WHEN** the user activates a primary route whose component chunk has not loaded yet
- **THEN** the application shell remains visible
- **AND** the main route region displays previous content or an explicit route loading state
- **AND** the target route content replaces it after loading without a runtime error

#### Scenario: Returning to a visited route

- **WHEN** the user returns to a route that was already visited in the same session
- **THEN** the route displays meaningful content without repeating a full empty loading pass
- **AND** route-local interaction state that is intentionally preserved remains available

### Requirement: Primary route visits are retained during the app session
The system SHALL retain visited primary route component instances during the same app session so route returns avoid full component teardown and remount work. This retention applies to /practice, /grammar, /vocabulary, /n1-grammar, /n2-grammar, /n3-grammar, /n4-grammar, and /n5-grammar after each route has been visited. The system MUST NOT eagerly mount unvisited primary routes only to make them retainable, and route retention MUST NOT trigger heavy route data processing for routes that the user has not visited.

#### Scenario: Returning across all primary routes

- **WHEN** the user visits /practice, /grammar, /vocabulary, /n1-grammar, /n2-grammar, /n3-grammar, /n4-grammar, and /n5-grammar during one app session
- **AND** the user navigates back to any previously visited primary route
- **THEN** that route returns from the retained route instance instead of a full teardown and remount pass
- **AND** intentionally retained route-local state remains available

#### Scenario: Unvisited routes are not eagerly mounted

- **WHEN** the app starts at /practice
- **THEN** the system does not mount /vocabulary, /grammar, /n1-grammar, /n2-grammar, /n3-grammar, /n4-grammar, or /n5-grammar route instances before the user visits those routes
- **AND** heavy data processing for unvisited routes does not run as a side effect of route retention

### Requirement: Route assets are prepared from navigation intent
The system SHALL prepare route component assets when the user expresses navigation intent through pointer hover, keyboard focus, or touch start on a primary route control. The system MUST avoid duplicate preparation work for a route that is already loaded or currently loading.

#### Scenario: Preloading from route tab intent

- **WHEN** the user hovers, focuses, or touches the route tab for /n5-grammar
- **THEN** the system starts preparing the /n5-grammar route component assets before the final navigation activation
- **AND** repeated hover, focus, or touch events for /n5-grammar reuse the same pending or completed preparation work

#### Scenario: Offline return after route asset cache

- **GIVEN** the user has previously loaded /vocabulary while the PWA assets were available
- **WHEN** the user goes offline and navigates back to /vocabulary
- **THEN** the system renders /vocabulary from cached route assets without a network-only failure state

### Requirement: Heavy route data does not block the route shell
Routes that depend on large learning datasets SHALL render a stable route shell before nonessential dataset processing finishes. Dataset loading MUST be scoped to the content needed for the visible route state, selected filters, or explicit user action; background loading MUST NOT block route navigation feedback.

#### Scenario: Vocabulary route starts with selected data scope

- **WHEN** the user navigates to /vocabulary
- **THEN** the route shell and controls render before every JLPT dataset has completed processing
- **AND** visible loading or disabled states communicate any dataset segment that is still loading

#### Scenario: N5 grammar route prepares large content progressively

- **WHEN** the user navigates to /n5-grammar
- **THEN** the route renders the visible section structure before non-visible heavy content work completes
- **AND** expanding or revealing additional content completes without blocking navigation controls

### Requirement: Route switching performance is verified
The system SHALL provide automated verification for route switching across /practice, /grammar, /vocabulary, /n1-grammar, /n2-grammar, /n3-grammar, /n4-grammar, and /n5-grammar. The verification MUST assert that route transitions avoid console errors, avoid an empty route region, and keep production build chunks within the 500 KB warning budget.

#### Scenario: Primary route transition smoke coverage

- **WHEN** the route switching verification visits every primary route in sequence
- **THEN** each route renders its expected test id
- **AND** no route transition produces a console error
- **AND** no route transition leaves the main route region empty

#### Scenario: Production build chunk budget

- **WHEN** the production build completes
- **THEN** no emitted JavaScript chunk exceeds 500 KB
- **AND** any route or learning-data chunk that approaches the budget is identified before release
