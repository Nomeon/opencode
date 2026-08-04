# Nomeon OpenCode Setup

Global OpenCode configuration stored at `~/.config/opencode`.

## Behavior

- Built-in `plan` mode is the default so requirements, scope, and verification are agreed before implementation.
- Tiny, obvious changes can move directly to `build` when selected explicitly.
- `AGENTS.md` is the single global instruction file.
- Implementations should use the fewest concepts and abstractions needed for current requirements.
- Reviews are risk-based. The working agent always reviews its own diff; specialist agents are used only when their domain is relevant.
- Verification is targeted to the changed behavior and the checks already supported by each project.

## Configuration

`opencode.jsonc` defines:

- Update notifications through `autoupdate: "notify"`.
- Built-in `plan` as the default agent.
- `build` as the primary coding agent.
- Specialist subagents for architecture, code review, security, build failures, cleanup, databases, and simplification.
- MCP tool permissions set to `ask`.
- Globally enabled shadcn, Better Auth, and Prisma MCP servers.

## Agents

| Agent                    | Use                                                                |
| ------------------------ | ------------------------------------------------------------------ |
| `builder`              | Implementation subagent for focused tasks                          |
| `architect`            | Material design decisions spanning boundaries or trade-offs        |
| `code-reviewer`        | Broad, risky, or explicitly requested reviews                      |
| `security-reviewer`    | Meaningful attack surfaces and security remediation                |
| `build-error-resolver` | Focused build and type-error fixes                                 |
| `refactor-cleaner`     | Deliberate dead-code, dependency, and duplication cleanup          |
| `database-reviewer`    | PostgreSQL and Prisma schema, migration, integrity, and query work |
| `skeptic`              | Focused KISS and YAGNI simplification                              |

Agent behavior lives in `prompts/`. Specialist use is contextual rather than an automatic post-build pipeline.

## Commands

Native Markdown commands live in `commands/`:

| Command             | Purpose                                              |
| ------------------- | ---------------------------------------------------- |
| `/code-review`    | Review scoped changes for concrete defects           |
| `/security`       | Review a meaningful attack surface                   |
| `/build-fix`      | Fix build or type errors minimally                   |
| `/refactor-clean` | Remove confirmed dead code and harmful duplication   |
| `/skeptic`        | Simplify an implementation while preserving behavior |

Planning uses built-in plan mode rather than a duplicate `/plan` command.

## Skills

Demand-driven skills are auto-discovered under `skills/`. The installed skills cover skill discovery, frontend design, plan interrogation, Playwright automation, and React or Next.js performance guidance.

## MCP Servers

| Server      | Configuration                       |
| ----------- | ----------------------------------- |
| shadcn      | `bun x shadcn@latest mcp`         |
| Better Auth | `https://mcp.better-auth.com/mcp` |
| Prisma      | `bun x prisma mcp`                |

All three are enabled globally because they are used by most projects. MCP calls require permission by default.

## Environment Guard

`plugins/env-protection.ts` blocks direct `read` tool access to `.env` and secret-bearing `.env.*` files. Template files ending in `.example`, `.template`, or `.sample` remain readable, including variants such as `.env.production.example`.

This is a narrow guardrail, not a security boundary. It does not prevent access through Bash, another filesystem-capable tool, or an alternate path such as a symlink. Secrets must still stay out of source control and agent-readable output.

## Maintenance

- Keep global behavior in `AGENTS.md`; avoid a second instruction layer.
- Keep reusable agent behavior in `prompts/` and slash commands as thin entry points.
- Add project-specific rules and integrations to the relevant project rather than this global setup.
- Validate changes with `opencode debug config`, `opencode agent list`, and `opencode debug skill`.
- Restart OpenCode after changing configuration, prompts, commands, skills, or plugins because active sessions do not reload them.
