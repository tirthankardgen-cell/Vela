# Vela studio improvement plan

## Goal
Make the studio an approachable workspace for designing a room or an entire flat, starting from measurements or an uploaded plan. Keep Vela's olive and ivory identity. Ship and validate one phase at a time.

## Reference research
Requested reference: [Floorplanner](https://floorplanner.com/). A direct request on 13 October 2026 was blocked by the environment proxy (HTTP 403). Its current interface and feature list have **not** been verified. The structure below uses established floor-planning interaction patterns; it is not a claim of feature parity or a copy of Floorplanner's interface. Revisit its public product documentation and editor walkthrough before deciding advanced drawing interactions.

## Phase 1 — Layout and icons (this change)
- Replace the text Google placeholder with the familiar four-colour G, retaining the explicit simulated sign-in label.
- Use consistent inline SVG tool icons with accessible names and keyboard focus states.
- Compact the top bar and canvas toolbar; keep project, import, save and presentation actions available.
- Remove promotional headings, repeated instructions, decorative symbols and irrelevant sample-room advice from the editor.
- Group room dimensions, template replacement and reference controls into labelled disclosures. Keep the searchable object library prominent.
- Keep empty selection guidance short. Collapse optional notes; show measurements and editing controls when an item is selected.
- Add an obvious New space route to the existing setup screen, with blank room and uploaded-plan choices. Existing projects remain saved; creating a new room is a separate flow.
- Keep 2D/3D, undo/redo, zoom, fit and export visible. Preserve stable editor bindings and all existing exports.
- At narrow widths, provide direct links to canvas, objects and properties instead of making users discover panels by scrolling.

Acceptance: working simulated Google sign-in; icons render without font glyphs; no horizontal overflow; all editor regression checks pass; creating an empty room or loading a reference still works.

## Phase 2 — Draw a room or flat from scratch
- Add dedicated Select, Draw wall and Draw room tools with clear active-tool feedback and Escape to cancel.
- Support connected wall endpoints, shared walls, numeric length entry and angle snapping.
- Name enclosed rooms, calculate areas and edit wall thickness and ceiling height.
- Place doors/windows on the correct wall; preserve undo/redo for each drawing action.
- Validate connected rooms and irregular flat outlines before adding multi-floor support.

Current boundary: Vela can resize a polygon, adjust its corners and add interior wall objects. A guided connected-room drawing system is not yet implemented.

## Phase 3 — Trace an uploaded plan
- Add reference replacement, scale calibration using a known distance, move/rotate/lock controls and opacity.
- Guide users through trace walls → openings → room names → verify dimensions.
- Preserve references in project backups and save/reopen cycles.
- Start with manual tracing; automatic image recognition is a separate research task.

Current boundary: image/PDF upload fits a first-page image to entered room bounds. Opacity and visibility are supported; distance calibration and automatic wall recognition are not.

## Phase 4 — Furnish and refine

Category research and the proposed object hierarchy are in the [catalogue research document](studio-catalogue-research.md).
- Improve categories, object previews, search and placement feedback.
- Add dimension overlays, alignment and clearance guides, room-specific finishes and better selection actions.
- Keep one geometry model for 2D and 3D; refine visual assets after drawing fundamentals work.

## Phase 5 — Project delivery
- Connect Firebase only after the owner supplies project configuration and requests activation.
- Validate authentication, per-user access rules, upload limits, cloud saves and recovery.
- Improve scaled exports, client presentations and project management after the core design workflow is stable.

## Verification
Build Next.js, run existing five browser suites, and check the new icon/layout interactions at desktop and mobile sizes. Review screenshots. Firebase remains disconnected; do not represent preview accounts as real authentication.

## Phase 1 delivery
Implemented the compact workspace, mobile panel links, grouped templates/notes, SVG tools, four-colour Google icon and New space navigation with a save before leaving. Updated the landing-page workspace screenshot and offline edition. Next.js and standalone builds pass; six browser suites and three asset/measurement checks pass. A test server needed restarting after a rebuild before the final React/onboarding checks could run. Phases 2–5 remain planned.
