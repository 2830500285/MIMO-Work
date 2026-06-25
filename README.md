# MIMO Work

<p align="center"><strong>A desktop AI engineering workbench built around a MiMo-Code runtime.</strong></p>

<p align="center">
  English | <a href="README.zh.md">中文</a>
</p>

---

MIMO Work is a desktop agent workbench for software engineering tasks. It is designed for coding, debugging, architecture design, document generation, review, automation, and long-running tool-assisted workflows.

The project combines a desktop shell, a local runtime host, MiMo model/provider configuration, MCP tools, skills, memory, permissions, and project workspaces into one application. The current implementation keeps a desktop `/v1/*` compatibility boundary in the shell while forwarding real agent work to the MiMo-Code-based runtime.

This public repository is a source bundle for three prepared workspaces, not a single flattened monorepo. The top level is intentionally small; the application source lives under `versions/*`.

---

## Versions

| Path | Purpose |
| --- | --- |
| `versions/current` | Current MIMO Work desktop app source. This is the main development snapshot. |
| `versions/macos-apple-silicon` | Independent Apple Silicon macOS build workspace. |
| `versions/windows` | Independent Windows build workspace. |

Each version is self-contained and has its own `package.json`, Electron/Vite config, scripts, resources, and desktop source tree.

Generated installers, build outputs, dependency folders, logs, caches, local environment files, and local secret files are intentionally excluded from this repository.

---

## Core Capabilities

- **MiMo-first provider flow**: supports Xiaomi MiMo recharge mode, Tokenplan mode, and custom OpenAI-compatible providers.
- **Desktop shell**: Electron workbench with projects, sessions, settings, model selection, permissions, MCP, skills, usage, and generated artifact surfaces.
- **Runtime adapter**: preserves the shell's local `/v1/*` request and SSE event boundary while mapping work to MiMo sessions, events, questions, and permissions.
- **Agent engineering workflow**: supports code work, document generation, architecture discussion, debugging, review, and long-running task progress.
- **Permissions and workspace safety**: local runtime execution, file access controls, approval handling, and secret redaction.
- **Skills and MCP**: bundled skill support, external skill scanning, MCP tool management, and references to Hermes Agent style skills.
- **Spec-driven work**: Speckit-style specification, planning, task, and verification workflows are supported as engineering guardrails.
- **Codex-style interaction ideas**: project navigation, chat/task flow, settings layout, permissions, and progress display take inspiration from coding-agent desktop tools.

---

## Repository Layout

```text
MIMO-Work/
  README.md
  README.zh.md
  versions/
    current/
      src/
        main/           Electron main process, runtime host, IPC, services
        preload/        Renderer bridge
        renderer/       Desktop UI
        shared/         Shared types and helpers
      resources/        App assets, bundled skills, runtime resources
      docs/             Development and feature documentation
      scripts/          Build, packaging, and release helpers
      package.json
    macos-apple-silicon/
      ...
    windows/
      ...
```

Why the GitHub root looks small:

- The root is a release/source bundle wrapper.
- The actual app code is inside the three `versions/*` folders.
- Dependency folders such as `node_modules`, generated `dist` folders, logs, caches, `.env` files, installers, and local test artifacts are deliberately not committed.
- This keeps the public repository reviewable and avoids publishing local credentials or machine-specific build output.

---

## Quick Start

Use the current desktop workspace for normal development:

```bash
cd versions/current
npm install
npm run dev
```

Common checks:

```bash
npm run typecheck
npm run test
npm run build
```

Packaging commands are defined in each version's `package.json`. For example:

```bash
npm run dist:mac:arm64
npm run dist:mac:x64
npm run dist:win
```

Some packaging tasks require the matching operating system, signing credentials, or external packaging tools.

---

## Runtime and Provider Notes

MIMO Work is centered on MiMo model access and custom provider access:

- Tokenplan and recharge-style MiMo endpoints are treated as first-class provider modes.
- Custom providers can be added for OpenAI-compatible APIs.
- API keys are sensitive credentials and must stay in local user settings or environment files.
- Real keys, `.env` files, logs, generated installers, and local caches should not be committed.

The shell should only start local runtime services on loopback addresses and should not require users to configure global proxy settings.

---

## Development Notes

MIMO Work is derived from a desktop shell plus a MiMo-Code-based runtime integration. The current architecture favors a compatibility adapter over a full UI rewrite:

1. The renderer keeps using the desktop app's local request/event boundary.
2. The main process owns runtime process management and settings persistence.
3. The adapter maps desktop threads, turns, SSE events, approvals, questions, tools, patches, checkpoints, and usage to runtime concepts.
4. The runtime handles sessions, model calls, tool execution, memory, skills, MCP, and long-running work.

This layout makes it possible to keep the desktop user experience stable while replacing the underlying runtime behavior.

---

## References & Acknowledgements

MIMO Work is an independent integration and adaptation project. It builds on, studies, or takes product and engineering inspiration from the following open-source projects and communities:

- [XiaomiMiMo/MiMo-Code](https://github.com/XiaomiMiMo/MiMo-Code) - MiMo-Code runtime and MiMo model integration foundation.
- [anomalyco/opencode](https://github.com/anomalyco/opencode) - upstream agent runtime, provider, TUI, LSP, MCP, and plugin architecture referenced by MiMo-Code.
- [KunAgent/Kun](https://github.com/KunAgent/Kun) - desktop shell and product workflow reference for the MIMO Work shell; this is also the current target for the DeepSeek-GUI repository redirect.
- [Hmbown/CodeWhale](https://github.com/Hmbown/CodeWhale) - DeepSeek-TUI / CodeWhale-style terminal agent workflow reference.
- [openai/codex](https://github.com/openai/codex) - Codex agent UX, task flow, and coding-assistant interaction reference.
- [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) - Hermes Agent and official skill organization reference.
- [Yeachan-Heo/oh-my-codex](https://github.com/Yeachan-Heo/oh-my-codex) - Oh My Codex workflow and prompt/skill inspiration.
- [github/spec-kit](https://github.com/github/spec-kit) - Spec Kit / Speckit-style specification, planning, and task workflow reference.

These acknowledgements do not imply endorsement by the upstream projects. Each upstream project keeps its own copyright, license, trademarks, and distribution terms; please review the corresponding repository license before redistribution or further derivative work.

---

## License and Notices

Source files inside each version keep their own license and notice files. When redistributing MIMO Work or derivative builds, keep upstream notices, license files, and applicable use restrictions intact.
