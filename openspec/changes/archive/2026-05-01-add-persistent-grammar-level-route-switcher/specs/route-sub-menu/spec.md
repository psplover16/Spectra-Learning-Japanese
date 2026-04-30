## ADDED Requirements

### Requirement: Config-driven route submenu

The system SHALL provide a reusable route submenu component that renders its options from input configuration. Each option SHALL support a label, route target, value, and test id supplied by its parent. The component SHALL emit an option selection event instead of performing business-specific persistence or route selection by itself.

#### Scenario: Options render from configuration

- **GIVEN** the parent provides five route submenu options for `N1文法` through `N5文法`
- **WHEN** the route submenu opens
- **THEN** the submenu renders one button for each provided option
- **AND** each button uses the configured label
- **AND** each button exposes the configured test id

#### Scenario: Option selection emits event

- **GIVEN** the route submenu is open
- **WHEN** the user activates the `N1文法` option
- **THEN** the route submenu emits the selected option value `N1`
- **AND** persistence and router navigation are handled outside the route submenu component

### Requirement: Route submenu positioning and visual style

The route submenu SHALL render as a floating layer that does not push or resize the primary route tab layout. The submenu SHALL appear 4px below its trigger control, align its horizontal center with the horizontal center of the trigger control, use `padding: 2px`, use a 4px gap between option buttons, and use option button styling consistent with the primary route tab button styling. The submenu background SHALL be visually close to the app background and darker than the app background.

#### Scenario: Floating submenu layout

- **WHEN** the route submenu opens
- **THEN** it appears below the trigger control with a 4px offset
- **AND** the submenu horizontal center aligns with the trigger control horizontal center
- **AND** it does not increase the height of the primary route tab container
- **AND** its container padding is `2px`
- **AND** the gap between option buttons is `4px`

#### Scenario: Submenu button style matches route tabs

- **WHEN** the route submenu opens
- **THEN** each submenu option button uses the same base visual style as a primary route tab button
- **AND** the submenu background is darker than the app page background

### Requirement: External interaction handling

When the route submenu is open, the system SHALL allow interaction with route submenu buttons and primary route tab buttons. Clicking any other page object SHALL close the submenu and MUST NOT trigger that object's original action.

#### Scenario: Outside page click only closes submenu

- **GIVEN** the route submenu is open
- **WHEN** the user clicks a page object outside the submenu and outside the primary route tabs
- **THEN** the route submenu closes
- **AND** the clicked page object action is not executed

#### Scenario: Submenu option remains interactive

- **GIVEN** the route submenu is open
- **WHEN** the user clicks a submenu option button
- **THEN** the submenu option selection event is emitted
- **AND** the outside-click close behavior does not block the option click

#### Scenario: Primary route tabs remain interactive

- **GIVEN** the route submenu is open
- **WHEN** the user clicks a primary route tab button
- **THEN** that primary route tab interaction is allowed
- **AND** the click is not treated as a blocked outside page action

### Requirement: Keyboard dismissal

The route submenu SHALL close when the user presses Escape while the submenu is open.

#### Scenario: Escape closes submenu

- **GIVEN** the route submenu is open
- **WHEN** the user presses Escape
- **THEN** the route submenu closes
