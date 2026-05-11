## ADDED Requirements

### Requirement: Reading mode toggle animates control bar collapse and table scroll growth in sync

When the user toggles the vocabulary view between operation mode and reading mode, the vocabulary control bar collapse animation (level controls and action controls) and the table scroll max-height growth SHALL start within the same animation frame and SHALL complete within the same animation frame. The collapse animation SHALL use a single shared `transition-duration` value so that no visual sub-region finishes before another. The table region itself SHALL NOT acquire decorative border, padding, background fill, or shadow when entering reading mode — reading mode SHALL maximize available table space rather than wrap the table in a visible container. When reading mode is active, the table scroll container SHALL also drop its default bottom padding so that scrolling to the last row leaves no extra spacer between the row and the bottom of the scroll container; operation mode SHALL retain the default bottom padding for breathing room.

#### Scenario: Entering reading mode animates the control bar collapse and table growth together

- **GIVEN** the vocabulary view is in operation mode with the level controls and action controls visible
- **WHEN** the user activates the reading mode button
- **THEN** the level controls and action controls begin collapsing within 16 ms of the click
- **AND** the table scroll region max-height begins growing within the same 16 ms window
- **AND** all three visual changes complete within 16 ms of each other
- **AND** the table region SHALL NOT show any added border, padding, background, or shadow at any point during or after the transition

#### Scenario: Exiting reading mode animates the control bar expand and table shrink together

- **GIVEN** the vocabulary view is in reading mode
- **WHEN** the user activates the operation mode button
- **THEN** the level controls and action controls begin expanding within 16 ms of the click
- **AND** the table scroll region max-height begins shrinking within the same 16 ms window
- **AND** all three visual changes complete within 16 ms of each other

#### Scenario: Reading mode drops the table scroll bottom spacer

- **GIVEN** the vocabulary view is in reading mode and the loaded vocabulary has more rows than fit on screen
- **WHEN** the user scrolls the table to the last row
- **THEN** the last row sits flush against the bottom of the scroll container (zero padding between the row and the container's bottom edge)
- **AND** the only remaining white space below the last row is the parent view padding and the device safe-area inset, neither of which this change modifies

#### Scenario: Operation mode retains the table scroll bottom spacer

- **GIVEN** the vocabulary view is in operation mode and the loaded vocabulary has more rows than fit on screen
- **WHEN** the user scrolls the table to the last row
- **THEN** the last row sits 0.75rem above the bottom edge of the scroll container, preserving the default scroll-bottom breathing space

### Requirement: Collapse animation has no leading dead zone on wide viewports

When the vocabulary view collapses the level controls or action controls during a reading mode toggle, the visible collapsing motion SHALL begin within 16 ms of the toggle activation, regardless of viewport width and regardless of whether the underlying content occupies the full height reserved by the previous styling. The system SHALL NOT use a fixed `max-height` ceiling that exceeds the natural content height by more than one animation frame's worth of travel.

#### Scenario: Wide desktop viewport shows immediate motion

- **GIVEN** the viewport width is 1280 px and the level controls fit on a single row
- **WHEN** the user enters reading mode
- **THEN** the level controls begin visibly shrinking within 16 ms of the toggle
- **AND** there is no perceptible pause between the toggle activation and the start of the collapsing motion

#### Scenario: Narrow mobile viewport behaves the same

- **GIVEN** the viewport width is 375 px and the level controls wrap onto multiple rows
- **WHEN** the user enters reading mode
- **THEN** the level controls begin visibly shrinking within 16 ms of the toggle
- **AND** the perceived smoothness matches the wide viewport behavior

### Requirement: Hidden-state visibility flips at the end of the transition

When the vocabulary view enters reading mode, the level controls and action controls SHALL remain accessible to assistive technology and pointer interactions until the collapse animation has fully completed. When the vocabulary view exits reading mode, the level controls and action controls SHALL become accessible to assistive technology and pointer interactions at the moment the expand animation begins.

#### Scenario: Visibility hides only after collapse finishes

- **GIVEN** the vocabulary view is entering reading mode
- **WHEN** the collapse animation is in progress
- **THEN** the level controls and action controls retain `visibility: visible` until the animation completes
- **AND** after the animation completes, the level controls and action controls become `visibility: hidden`

#### Scenario: Visibility restores immediately on exit

- **GIVEN** the vocabulary view is exiting reading mode
- **WHEN** the toggle is activated
- **THEN** the level controls and action controls become `visibility: visible` at the start of the expand animation
- **AND** pointer events on the level controls and action controls are enabled at the start of the expand animation

### Requirement: Reading mode toggle preserves existing button visual identity

The reading mode toggle button SHALL keep its existing color transition behavior (`bg-emerald-*` for read affordance, `bg-red-*` for operate affordance) and SHALL NOT introduce additional CSS animations on the button element itself as part of this change. The button's `transition-colors` class SHALL remain the sole driver of the button's visual change.

#### Scenario: Button color transition is unchanged

- **WHEN** the user toggles between reading mode and operation mode
- **THEN** the toggle button's background color crossfades using the existing `transition-colors` utility
- **AND** no additional animation properties are attached to the button element by this change
