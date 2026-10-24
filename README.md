# Nomeon OpenCode Setup

Global, native OpenCode V2 configuration stored at `~/.config/opencode`.

## Behavior

- Built-in `plan` mode is the default so requirements, scope, and verification are agreed before implementation.
- Tiny, obvious changes can move directly to `build` when selected explicitly.
- `AGENTS.md` is the single global instruction file.
- Implementations should use the fewest concepts and abstractions needed for current requirements.
- Reviews are risk-based. The working agent always reviews its own diff; specialist agents are used only when their domain is relevant.
- Verification is targeted to the changed behavior and the checks already supported by each project.

## Configuration

`opencode.jsonc` defines:

- Update notifications through `update: "notify"`.
- Built-in `plan` as the default agent.
- `build` and `builder` use `openai/gpt-6-luna-fast#high`.
- Specialist subagents for architecture, code review, security, build failures, cleanup, databases, and simplification.
- MCP tool permissions set to `ask`.
- Globally enabled shadcn, Better Auth, Prisma, and Railway MCP servers.

Terminal preferences live in `cli.json`; notifier preferences live in `opencode-notifier.json`.

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

Agent behavior lives in `prompts/`. Architecture, code review, and security use `openai/gpt-6.1-sol-fast#high`; the other specialists use `openai/gpt-6.1-sol-fast#medium`. Specialist use is contextual rather than an automatic post-build pipeline.

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

Skills are managed by the Skills CLI as complete directories under `.agents/skills/`, without symlinks or duplicate copies. `opencode.jsonc` explicitly loads `~/.config/opencode/.agents/skills` so they are available globally, regardless of the active project.

Installed skills cover skill discovery, frontend design, plan interrogation (`grill-me` delegates to `grilling`), Playwright automation, React or Next.js performance, and Railway. Sources and upstream hashes are recorded in `skills-lock.json`.

Run these commands from `~/.config/opencode`:

```sh
npx skills add <source> --agent opencode
npx skills list --agent opencode
npx skills update --project
npx skills remove <skill> --agent opencode
```

Use project scope here, not `--global`: the configuration repository owns the skill files and `skills-lock.json`, while OpenCode loads them globally. Updates use the recorded sources without reselecting skills. Commit `.agents/skills/` and `skills-lock.json` together after reviewing changes.

## MCP Servers

| Server      | Configuration                       |
| ----------- | ----------------------------------- |
| shadcn      | `bun x shadcn@4.22.1 mcp`         |
| Better Auth | `https://mcp.better-auth.com/mcp` |
| Prisma      | `bun x prisma@6.19.0 mcp`         |
| Railway     | `railway mcp`                    |

All four are configured in `opencode.jsonc`. MCP calls and resource access require permission by default. Bun and the Railway CLI must be installed; credentials and OAuth sign-ins remain local to the machine.

Prisma is pinned to retain the local MCP tools; current Prisma CLI releases no longer include `mcp`. shadcn is pinned to the verified release rather than relying on a floating `latest` cache.

## Environment Guard

`plugins/env-protection/index.ts` uses the V2 plugin API to block direct `read` tool access to `.env` and secret-bearing `.env.*` files. Template files ending in `.example`, `.template`, or `.sample` remain readable, including variants such as `.env.production.example`.

This is a narrow guardrail, not a security boundary. It does not prevent access through Bash, another filesystem-capable tool, or an alternate path such as a symlink. Secrets must still stay out of source control and agent-readable output.

## Maintenance

- Run `npm ci` after cloning or pulling dependency changes. `package.json` and `package-lock.json` define the V2 plugin dependency, `@opencode/plugin`.
- The notifier is pinned to `@mohak34/opencode-notifier@1.1.0`; check for compatible releases before updating the pin. The environment guard is maintained locally.
- Commit configuration, dependency manifests, plugin source, prompts, commands, and complete skill directories. Never commit `service.json` (service password), `opencode-notifier-state.json` (runtime state), or `node_modules/`; these are ignored.
- Keep global behavior in `AGENTS.md`; avoid a second instruction layer.
- Keep reusable agent behavior in `prompts/` and slash commands as thin entry points.
- Add project-specific rules and integrations to the relevant project rather than this global setup.
- Validate changes with `opencode api get /api/agent`, `opencode api get /api/command`, `opencode api get /api/plugin`, and `opencode mcp list`.
- Configuration reloads automatically. Use `/reload` to force a full reload; a service restart is not needed for configuration changes.
