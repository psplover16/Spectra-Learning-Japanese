<!--
Sync Impact Report
Version change: 1.5.1 -> 1.6.0
Modified principles:
- V. Documentation & Repository Hygiene (expanded to require valid UTF-8 text and to forbid garbled characters, replacement glyphs, or visible BOM corruption in human-readable artifacts)
Added sections: none
Removed sections: none
Templates requiring updates:
- .specify/templates/plan-template.md (validated, no change)
- .specify/templates/spec-template.md (validated, no change)
- .specify/templates/tasks-template.md (validated, no change)
- .specify/templates/constitution-template.md (validated, no change)
- .specify/templates/commands/ (not present, no update required)
Deferred items: none
-->

# Japanese Word Practice Vue AI Constitution

## Core Principles

### I. Code Quality & Maintainability
Code MUST remain easy to read, review, and modify. New or changed code MUST
use clear naming, focused responsibilities, low coupling, and the simplest
viable implementation for the requirement at hand. Any intentionally introduced
complexity MUST be justified in the relevant plan or specification. Externally
visible behavior changes MUST have explicit verification evidence before the
work is considered complete.

### II. Test-First Verification
Changes MUST be verified by tests whenever automated testing is feasible. Bug
fixes MUST reproduce the failure before the fix is accepted. New behavior MUST
include verification appropriate to its risk and surface area. Legal default
states, empty states, hidden states, and placeholder states MUST never cause
runtime errors, render failures, or browser console errors. Each primary route
and each high-risk interactive component MUST include at least one smoke test
that verifies successful default initial render.

### III. UX Consistency
User-facing experiences MUST preserve consistent terminology, tone, layout
patterns, and interaction models across the product. Shared styles, layout
primitives, and reusable UI abstractions MAY only be used when the visual
behavior and layout requirements are materially the same. Convenience or
delivery speed MUST NOT justify forcing a screen or component into a shared
style system that conflicts with its explicit specification. When a route,
view, or component has explicit layout, sizing, or interaction rules, those
rules take precedence over reusable abstractions. Loading, empty, error, and
success states MUST receive the same design and implementation care as the
primary path.

### IV. Performance Budgets
Any change that can affect latency, memory usage, render performance, bundle
size, or other resource consumption MUST define its expected impact before
implementation is complete. When a change risks exceeding an acceptable budget,
the implementation MUST include measurement, mitigation, and explicit
justification. Performance regressions are defects and MUST be addressed before
release.

### V. Documentation & Repository Hygiene
This constitution MUST remain in English only. All specifications, plans, and
user-facing documentation MUST be written in Traditional Chinese (zh-TW). All
human-readable repository artifacts produced for this project, including Git
commit messages, MUST preserve their intended characters using valid UTF-8
text. Garbled characters, replacement glyphs (for example `?` replacing
intended text), or visible BOM corruption in committed content are compliance
failures and MUST be corrected before the work is considered complete. Every
new project MUST include a `.gitignore` file. `node_modules/` MUST never be
committed to Git. Re-installable or re-generatable artifacts such as `build/`,
`dist/`, and `coverage/` MUST be excluded from version control by default.
Generated files SHOULD remain untracked unless a documented product reason
explicitly requires otherwise. `PROJECT_ARCHITECTURE.md` is a required living
document and MUST accurately reflect the current repository structure, major
directories, modules, and significant file responsibilities. Any work that
changes repository structure, file responsibilities, shared modules, route
composition, test structure, or deployment structure MUST update
`PROJECT_ARCHITECTURE.md` in the same work item.

### VI. Scope Ownership & Reuse Boundaries
Features MUST appear only in the routes, views, components, and other surfaces
explicitly assigned by the specification or approved clarifications. Shared
state, shared data sources, or shared logic MUST NOT imply shared UI by
default. When a feature is assigned to specific surfaces, all unassigned
surfaces are out of scope unless the specification explicitly includes them.
Plans, tasks, and tests MUST record both positive ownership and negative
ownership so that the implementation proves where a feature appears and where
it does not appear. Reuse MUST NOT override route-specific or
component-specific requirements.

## Additional Constraints

Documentation and implementation MUST remain aligned. If a change affects user
behavior, data shape, performance characteristics, scope boundaries, or test
strategy, the corresponding specification and plan MUST be updated in the same
work item. If functionality originally implemented from an existing `spec.md`
is later refined in a way that changes user-visible behavior, layout, content,
interaction, acceptance criteria, or scope interpretation, that same work item
MUST update the originating `spec.md`. Those refinements MUST NOT be left only
in source code, review discussion, or chat history. Specification write-backs
MUST be clear and complete enough to serve as the authoritative record of the
current behavior, including affected user flows, acceptance criteria, edge
cases, and scope decisions. Pure internal refactoring MAY omit a specification
update only when it does not change external behavior, acceptance criteria, or
scope interpretation, and it MUST NOT leave the specification inaccurate. When
the repository defines linting, formatting, type checking, or CI validation,
those checks MUST pass before the change is considered complete.

## Development Workflow

Every meaningful change MUST be traceable to a specification or explicit
maintenance task. Post-implementation refinements that change user-visible
behavior, layout, content, interaction, acceptance criteria, or scope
interpretation MUST update the originating specification so it can still stand
alone as the authoritative behavior reference. Test additions and
documentation write-backs are part of the definition of done, not optional
polish. Reviews MUST verify compliance with language requirements, testing
requirements, performance expectations, scope boundaries, reuse boundaries,
repository hygiene, and specification-sync rules. Incomplete specification
write-backs are compliance failures.

## Governance

This constitution overrides informal conventions, ad hoc practices, and any
conflicting local guidance. Amendments require an explicit update to this file
and a brief rationale in the sync impact report. Versioning follows semantic
rules: MAJOR for incompatible governance changes, principle removals, or major
redefinitions; MINOR for new principles, new sections, or materially expanded
guidance; PATCH for clarifications, wording improvements, structural cleanup,
or non-semantic refinements. Compliance review is mandatory for specifications,
plans, tasks, and implementation work. Any exception MUST be documented with a
clear expiration, condition for removal, or remediation path.

**Version**: 1.6.0 | **Ratified**: 2026-03-21 | **Last Amended**: 2026-04-15
