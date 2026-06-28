<h1 align="center">MIMO Work</h1>

<p align="center">
  <img src="assets/mimo-work-wordmark.png" alt="MIMO Work" width="435">
</p>

<p align="center"><strong>基于 MiMo-Code runtime 的桌面 AI 软件工程工作台。</strong></p>

<p align="center">
  <a href="README.md">English</a> | 中文
</p>

---

MIMO Work 是一个面向软件工程任务的桌面智能体工作台，目标场景包括代码编写、调试、架构设计、文档生成、代码审查、自动化任务，以及需要工具持续执行的长任务。

这个项目把桌面壳、本地 runtime host、MiMo 模型和供应商配置、MCP 工具、Skill、记忆、权限审批、项目工作区等能力放在同一个应用里。当前实现保留桌面壳的本地 `/v1/*` 兼容边界，再把真实智能体工作转发到基于 MiMo-Code 的 runtime。

这个公开仓库是三个准备好的源码工作区合集，不是一个扁平化的单一 monorepo。因此根目录看起来会比较简洁，真正的应用源码在 `versions/*` 目录里。

---

## 版本目录

| 路径 | 用途 |
| --- | --- |
| `versions/macos-intel` | Mac Intel 桌面应用源码与 x64 构建工作区。 |
| `versions/macos-apple-silicon` | 独立的 Apple Silicon macOS 构建工作区。 |
| `versions/windows` | 独立的 Windows 构建工作区。 |

每个版本目录都是相对独立的，包含自己的 `package.json`、Electron/Vite 配置、脚本、资源和桌面端源码树。

构建产物、安装包、依赖目录、日志、缓存、本地环境文件和本地密钥文件都被刻意排除在仓库之外。

---

## 下载

预构建应用安装包发布在 [GitHub Releases](https://github.com/2830500285/MIMO-Work/releases)。

首个 release 分别提供 macOS Apple Silicon、macOS Intel 和 Windows x64 下载。安装包不会直接提交到源码目录里。

---

## 核心能力

- **MiMo 优先的供应商流程**：支持小米 MiMo 充值模式、Tokenplan 模式，以及自定义 OpenAI 兼容供应商。
- **桌面工作台**：Electron 应用，包含项目、会话、设置、模型选择、权限、MCP、Skill、用量和生成文件等界面。
- **Runtime 适配层**：保留桌面壳本地 `/v1/*` 请求和 SSE 事件边界，同时映射到 MiMo session、event、question、permission 等能力。
- **软件工程智能体流程**：支持代码任务、文档生成、架构讨论、调试、审查和长任务进度展示。
- **权限与工作区安全**：本地 runtime 执行、文件访问范围控制、审批处理和敏感信息脱敏。
- **Skills 与 MCP**：支持内置 Skill、外部 Skill 扫描、MCP 工具管理，并参考 Hermes Agent 的 Skill 组织方式。
- **规格驱动工作流**：支持 Speckit 风格的规格、计划、任务和验证流程，作为工程执行护栏。
- **Codex 风格交互参考**：项目导航、对话/任务流程、设置布局、权限选择和进度展示参考了 coding-agent 桌面工具的产品经验。

---

## 仓库结构

```text
MIMO-Work/
  README.md
  README.zh.md
  versions/
    macos-intel/
      src/
        main/           Electron 主进程、runtime host、IPC、服务
        preload/        渲染进程桥接
        renderer/       桌面 UI
        shared/         共享类型与工具
      resources/        应用资源、内置 Skills、runtime 资源
      docs/             开发与功能文档
      scripts/          构建、打包与发布脚本
      package.json
    macos-apple-silicon/
      ...
    windows/
      ...
```

为什么 GitHub 根目录看起来文件少：

- 根目录只是发布源码包的外壳。
- 真正的应用源码都在三个 `versions/*` 目录里。
- `node_modules`、`dist`、日志、缓存、`.env`、安装包和本地测试产物都没有提交。
- 这样可以让公开仓库更干净，也避免把本机密钥或机器相关构建产物发出去。

---

## 快速开始

日常开发建议使用 Mac Intel 版本目录：

```bash
cd versions/macos-intel
npm install
npm run dev
```

常用检查：

```bash
npm run typecheck
npm run test
npm run build
```

各版本的打包命令写在对应目录的 `package.json` 中，例如：

```bash
npm run dist:mac:arm64
npm run dist:mac:x64
npm run dist:win
```

部分打包任务需要对应操作系统、签名证书或外部打包工具。

---

## Runtime 与供应商说明

MIMO Work 以 MiMo 模型接入和自定义供应商接入为核心：

- Tokenplan 和充值模式是 MiMo 的一等供应商模式。
- 自定义供应商支持 OpenAI 兼容 API。
- API Key 属于敏感凭据，应只保存在本地用户设置或环境文件中。
- 真实 Key、`.env` 文件、日志、安装包和本地缓存不应提交到仓库。

桌面壳启动本地 runtime 时应只监听本机回环地址，不要求用户配置全局代理。

---

## 开发说明

MIMO Work 来自桌面壳与 MiMo-Code runtime 的整合。当前架构优先使用兼容适配层，而不是完全重写 UI：

1. 渲染进程继续使用桌面应用本地请求和事件边界。
2. 主进程负责 runtime 进程管理与设置持久化。
3. 适配层把线程、回合、SSE 事件、审批、问题、工具、补丁、checkpoint 和用量映射到 runtime 概念。
4. Runtime 负责 session、模型调用、工具执行、记忆、Skill、MCP 和长任务。

这样可以在保持桌面体验稳定的同时，替换底层智能体 runtime。

---

## 参考与致谢

MIMO Work 是一个独立的集成与适配项目。项目直接或间接参考、学习或受到以下开源项目与社区启发：

- [XiaomiMiMo/MiMo-Code](https://github.com/XiaomiMiMo/MiMo-Code) - MiMo-Code runtime 与 MiMo 模型接入基础。
- [anomalyco/opencode](https://github.com/anomalyco/opencode) - MiMo-Code 所参考的上游 agent runtime、provider、TUI、LSP、MCP 与插件架构。
- [KunAgent/Kun](https://github.com/KunAgent/Kun) - MIMO Work 桌面壳和产品流程参考；这也是 DeepSeek-GUI 仓库当前重定向到的目标。
- [Hmbown/CodeWhale](https://github.com/Hmbown/CodeWhale) - DeepSeek-TUI / CodeWhale 风格终端智能体工作流参考。
- [openai/codex](https://github.com/openai/codex) - Codex 智能体交互、任务流程和 coding assistant 体验参考。
- [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) - Hermes Agent 与官方 Skill 组织方式参考。
- [Yeachan-Heo/oh-my-codex](https://github.com/Yeachan-Heo/oh-my-codex) - Oh My Codex 工作流、prompt 与 Skill 灵感参考。
- [github/spec-kit](https://github.com/github/spec-kit) - Spec Kit / Speckit 风格的规格、计划与任务工作流参考。

以上致谢不代表这些上游项目对 MIMO Work 的背书。各上游项目保留其版权、许可证、商标和分发条款；二次分发或继续衍生开发前，请分别查看对应仓库的许可证和使用限制。

---

## 许可证与声明

每个版本目录内的源码文件保留其对应的 license 与 notice 文件。重新分发 MIMO Work 或衍生构建时，请保留上游声明、许可证文件和适用的使用限制。
