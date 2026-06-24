# Tasks: MIMO Work Runtime Replacement

## Phase 1: Foundation

- [x] T001 Create MIMO Work shell/core working copies and development branches.
- [x] T002 Create Speckit-style spec, plan, and task tracking documents.
- [x] T003 Add MIMO Work notices and upstream attribution docs.
- [x] T004 Add MiMo credential mode types, defaults, normalization, and redaction tests.
- [x] T005 Add runtime host abstraction that can select Kun or MiMo Work runtime.

## Phase 2: Adapter MVP

- [x] T006 Implement MiMo runtime process host for dev mode.
- [x] T007 Implement compatibility health and `/v1/threads` list/create/read mapping.
- [x] T008 Implement `/v1/threads/:id/turns` prompt mapping to MiMo `prompt_async`.
- [x] T009 Implement MiMo `/event` to Kun per-thread SSE conversion.
- [x] T010 Add adapter contract tests for the MVP mapping layer.

## Phase 3: Interaction Parity

- [x] T011 Map approvals to MiMo permission replies.
- [x] T012 Map user inputs to MiMo question replies/rejections.
- [x] T013 Map fork, interrupt, compact, todos, and goal operations.
- [x] T014 Add targeted UI tests for runtime interaction flows.

## Phase 4: Full Parity

- [x] T015 Implement or bridge memory APIs.
- [x] T016 Implement or bridge attachments APIs.
- [x] T017 Implement usage summary aggregation.
- [x] T018 Implement review/diff/checkpoint mapping.
- [x] T019 Verify Write, Connect, and schedule flows against the compatibility API.

## Phase 5: Productization

- [x] T020 Rebrand package metadata, app id, artifact names, menus, and user-facing runtime messages.
- [x] T021 Bundle or locate the macOS MiMo runtime executable for packaged app launch.
- [x] T022 Run macOS dev smoke and package smoke.
- [x] T023 Update public README with setup, credential modes, notices, and key-rotation guidance.
