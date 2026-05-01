## MODIFIED Requirements

### Requirement: Version source MUST be automatically derived from package metadata

The version string SHALL come from the project's `package.json#version` field combined with the Git commit count at build time. The injected global constant `__APP_VERSION__` SHALL use the format `<package-version>+<git-commit-count>`, for example `0.0.1+36`. Engineers MUST NOT manually update any UI string when releasing a new version. Engineers MUST NOT modify `package.json#version` as part of the build process. If Git commit count cannot be resolved in a non-deployment build environment, the build SHALL inject `<package-version>+0` rather than failing the application runtime.

#### Scenario: Build-time version injection includes commit count

- **WHEN** the project is built with `vite build` in a Git checkout with full commit history
- **THEN** the global constant `__APP_VERSION__` equals the value of `package.json#version` followed by `+` and the Git commit count
- **AND** the Practice page renders that exact value at runtime

##### Example: current project commit count

- **GIVEN** `package.json` contains `"version": "0.0.1"`
- **AND** the Git commit count is `36`
- **WHEN** the build completes and the user opens the Practice page
- **THEN** the version label shows `0.0.1+36`

#### Scenario: New commit increments displayed build metadata

- **GIVEN** a build from commit count `36` displays `0.0.1+36`
- **WHEN** one new commit is added and the project is rebuilt from commit count `37`
- **THEN** the version label shows `0.0.1+37`

#### Scenario: Package version remains the semantic version base

- **GIVEN** `package.json` contains `"version": "0.0.2"`
- **AND** the Git commit count is `37`
- **WHEN** the project is built
- **THEN** the version label shows `0.0.2+37`

#### Scenario: Build without Git count keeps runtime safe

- **GIVEN** `package.json` contains `"version": "0.0.1"`
- **AND** Git commit count cannot be resolved during a non-deployment build
- **WHEN** the project is built
- **THEN** the injected version label value is `0.0.1+0`
- **AND** the application runtime does not throw because of missing Git metadata
