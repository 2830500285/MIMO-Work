# Feature Specification: MIMO Work Runtime Replacement

## User Need

MIMO Work should keep the Kun desktop workbench experience while replacing the active agent runtime with MiMo-Code. Users can use MiMo recharge credentials or Tokenplan credentials, start coding sessions, stream agent progress, approve risky actions, answer agent questions, and continue existing sessions from the desktop app.

## Functional Requirements

- The app presents itself as MIMO Work in public-facing metadata, documentation, and runtime status surfaces.
- The app stores and uses MiMo credentials without committing or logging secrets.
- Users can choose MiMo recharge mode or Tokenplan mode. Tokenplan supports cn, sgp, and ams regions.
- The desktop shell can start, stop, restart, and health-check a local MiMo-Code runtime.
- Existing Kun renderer calls to `/v1/*` continue to work through a compatibility adapter.
- Threads map to MiMo sessions, turns map to MiMo prompts, and SSE maps from MiMo global events to per-thread GUI events.
- Approvals and user-input prompts map to MiMo permission and question APIs.
- Fork, interrupt, compact, review, goal, todos, memory, attachments, and usage are covered before declaring complete parity.

## Success Criteria

- A fresh macOS dev checkout can start the desktop app and create a MiMo-backed coding session.
- A Tokenplan credential can complete a minimal prompt smoke test without the key appearing in repo files, logs, or snapshots.
- Renderer tests and runtime adapter tests cover credential normalization, API mapping, and SSE conversion.
- MIMO Work can be packaged on macOS with the MiMo runtime started from the app bundle.

## Assumptions

- Kun authorization for this derivative work is already handled by the project owner.
- `Before/` is a read-only reference area and must not be edited.
- The first complete implementation prioritizes macOS, then expands to Windows and Linux.
