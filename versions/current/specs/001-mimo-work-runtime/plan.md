# Implementation Plan: MIMO Work Runtime Replacement

## Summary

Use the Kun Electron/React shell as the MIMO Work desktop app and replace `mimo serve` with a managed MiMo-Code runtime behind a compatibility API. Keep renderer contracts stable while introducing MiMo credential settings, a runtime selector, a local adapter host, and MiMo session/event mapping.

## Key Decisions

- Work from `MIMO-Work-Shell` and `MIMO-Work-Core`; never modify `Before/`.
- Keep the renderer-facing `/v1/*` boundary stable.
- Prefer a shell-side compatibility layer and add MiMo-Code APIs only when no stable REST surface exists.
- Treat Tokenplan credentials as secrets and pass them only through local settings/auth files or process environment.
- Prioritize macOS development and packaging first.

## Implementation Phases

1. Foundation: clone worktrees, branch, specs, notices, credential model, runtime host abstraction.
2. Adapter MVP: health, thread/session list, create, read, send prompt, interrupt, SSE event mapping.
3. Interaction parity: approvals, questions, fork, compact, todos, goal.
4. Full parity: memory, attachments, usage, review, Write, Connect, schedule.
5. Productization: branding, packaging, notices, smoke tests, release docs.

## Verification

- Shell typecheck and targeted Vitest tests after each cross-layer change.
- Core `bun typecheck` and targeted Bun tests after MiMo-Code API changes.
- Real local `mimo serve` smoke before macOS packaging.
