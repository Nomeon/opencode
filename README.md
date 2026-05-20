# Nomeon Opencode Setup

This repo is mny current global Opencode configuration stored at `~/.config/opencode`. It defines the default model, shared instructions, specialist subagents, commands, skills, MCP servers, custom tools, and plugins used by Opencode.

## Directory Layout

```text
.
├── AGENTS.md                    # High-level agent behavior and workflow rules
├── README.md                    # This setup guide
├── instructions/
│   └── INSTRUCTIONS.md          # Additional global coding, security, and workflow rules
├── opencode.jsonc               # Main Opencode configuration
├── tui.json                     # TUI theme configuration
├── commands/                    # Legacy slash command templates
├── plugins/                     # Local Opencode plugins and plugin support code
├── prompts/                     # Prompt bodies for configured subagents
├── skills/                      # Local skills auto-discovered by Opencode
└── tools/                       # Custom TypeScript tools exported to Opencode
```

## Main Config

`opencode.jsonc` is the entry point for the setup.

Key settings:

- `$schema` points to `https://opencode.ai/config.json` for editor validation.
- `autoupdate` is set to `notify`, so Opencode notifies about updates instead of applying them silently.
- `default_agent` is set to `plan`.
- `instructions` loads `AGENTS.md` and `instructions/INSTRUCTIONS.md` into sessions.
- Top-level MCP tool permissions default to `ask` through the `mcp_*` permission rule.
- Custom agents, commands, and MCP servers are declared inline.

## Instructions

The instruction layer is split across two files.

`AGENTS.md` contains the primary workflow rules:

- Agent-first delegation for planning, architecture, review, security, build fixes, cleanup, and database work.
- Security-first development and commit checks.
- Immutable coding style.
- Plan-before-execute guidance for complex work.
- Skills-first workflow policy, with `commands/` kept as compatibility shims.

`instructions/INSTRUCTIONS.md` expands those rules with examples and checklists:

- Mandatory security checks before commits.
- Secret management patterns.
- Error handling and input validation examples.
- Git workflow and conventional commit guidance.
- Manual formatting, type checking, and security checks needed in Opencode.

## Agents

Agents are configured in `opencode.jsonc`. Most custom agents are subagents backed by prompt files in `prompts/`.

| Agent | Mode | Prompt | Purpose |
| --- | --- | --- | --- |
| `build` | primary | inline config | Main coding agent for development work. |
| `planner` | subagent | `prompts/planner.txt` | Implementation planning for complex features and refactors. |
| `architect` | subagent | `prompts/architect.txt` | System design, scalability, and technical decisions. |
| `code-reviewer` | subagent | `prompts/code-reviewer.txt` | Code quality, maintainability, and security review. |
| `security-reviewer` | subagent | `prompts/security-reviewer.txt` | Security vulnerability review and remediation guidance. |
| `build-error-resolver` | subagent | `prompts/build-error-resolver.txt` | Minimal build and TypeScript error fixes. |
| `refactor-cleaner` | subagent | `prompts/refactor-cleaner.txt` | Dead code cleanup and duplicate consolidation. |
| `database-reviewer` | subagent | `prompts/database-reviewer.txt` | PostgreSQL and Supabase schema, query, security, and performance review. |

Most review and planning agents are read-only. Agents that are expected to fix issues, such as `build-error-resolver`, `refactor-cleaner`, `security-reviewer`, and `database-reviewer`, have edit/write permissions enabled.

## Commands

`commands/` contains legacy slash-entry shims. The long-term workflow surface is `skills/`, but these commands remain useful for direct invocation and cross-harness compatibility.

Configured commands:

| Command | Agent | Purpose |
| --- | --- | --- |
| `/plan` | `planner` | Produce an implementation plan and wait for confirmation. |
| `/code-review` | `code-reviewer` | Review changed code for quality, security, and maintainability. |
| `/security` | `security-reviewer` | Run an OWASP-oriented security review. |
| `/build-fix` | `build-error-resolver` | Fix build and TypeScript errors with minimal diffs. |
| `/refactor-clean` | `refactor-cleaner` | Remove dead code and consolidate duplicates safely. |
| `/orchestrate` | `planner` | Plan multi-agent execution for complex work. |

Each command template accepts `$ARGUMENTS`, then runs as a subtask with the configured agent.

## Skills

`skills/` is the canonical workflow surface. Each skill lives in its own folder with a `SKILL.md` file.

Installed local skills:

| Skill | Use Case |
| --- | --- |
| `find-skills` | Discover and install external agent skills. |
| `grill-me` | Stress-test plans by asking one decision-driving question at a time. |
| `impeccable` | Frontend design, UX critique, visual polish, accessibility, and live UI iteration. |
| `motion-foundations` | Core React and Next.js motion rules, tokens, springs, accessibility, and SSR safety. |
| `motion-patterns` | Production UI animation patterns built on `motion-foundations`. |
| `motion-advanced` | Advanced motion patterns such as drag, gestures, SVG drawing, text animation, and loaders. |
| `playwright-cli` | Browser automation and Playwright-driven page interaction. |
| `vercel-react-best-practices` | React and Next.js performance guidance from Vercel Engineering. |

Add new workflow knowledge under `skills/` first. Add or update `commands/` only when a slash-command shim is still needed.

## MCP Servers

The config enables three MCP integrations.

| Server | Type | Command or URL | Purpose |
| --- | --- | --- | --- |
| `shadcn` | local | `bun x shadcn@latest mcp` | Search, inspect, and add shadcn/ui registry components. |
| `better-auth` | remote | `https://mcp.better-auth.com/mcp` | Search and read Better Auth documentation. |
| `prisma` | local | `bun x prisma mcp` | Prisma migration and database tooling. |

MCP tool use is gated by the top-level `mcp_*: ask` permission rule.

## Custom Tools

Custom tools are implemented in `tools/` and re-exported from `tools/index.ts`.

| Tool | File | Purpose |
| --- | --- | --- |
| `changedFiles` | `tools/changed-files.ts` | Show files changed by agents in the current session as a tree or JSON. |
| `formatCode` | `tools/format-code.ts` | Detect a formatter and return the exact command to run. |
| `lintCheck` | `tools/lint-check.ts` | Detect a linter and return a lint or fix command. |
| `securityAudit` | `tools/security-audit.ts` | Scan dependencies, secrets, and common code security issues. |
| `gitSummary` | `tools/git-summary.ts` | Return branch, status, recent commits, and optional diff stats. |

`plugins/lib/changed-files-store.ts` provides shared in-memory tracking for changed-file reporting.

## Plugins

`plugins/env-protection.ts` defines `EnvProtection`, a local plugin that intercepts `read` tool calls and blocks reads of protected environment files:

- `.env`
- `.env.local`
- `.env.production`
- `.env.development`
- `.env.test`

This protects local secrets from being read into agent context by default.

## TUI

`tui.json` configures the Opencode TUI theme:

```json
{
  "$schema": "https://opencode.ai/tui.json",
  "theme": "catppuccin-macchiato"
}
```

## Dependencies

The local `package.json` only declares `@opencode-ai/plugin`, which provides types and helpers for plugins and custom tools. Local package artifacts are ignored by this repo through `.gitignore`.

Expected local tooling:

- `bun` for the configured local MCP server commands.
- `npm` or `npx` for formatter, linter, audit, and auxiliary command suggestions.
- Git, because several workflows and tools inspect repository status and diffs.

## Editing This Setup

Use these conventions when changing this configuration:

- Keep `opencode.jsonc` schema-valid and preserve the `$schema` field.
- Put reusable workflow behavior in `skills/` before adding new legacy commands.
- Put non-trivial agent behavior in prompt files under `prompts/` rather than embedding long strings in `opencode.jsonc`.
- Keep secrets out of this repository and out of agent-readable files.
- Restart Opencode after changing config-time files so the running session picks up the changes.
