# Nomeon Agent Instructions

## Core Principles

1. **Agent-First** — Delegate to specialized agents for domain tasks
2. **Security-First** — Never compromise on security; validate all inputs
3. **Immutability** — Always create new objects, never mutate existing ones
4. **Plan Before Execute** — Plan complex features before writing code
5. **YAGNI** — Always implement the simplest form that meets the requirements

## Available Agents

| Agent                | Purpose                          | When to Use                       |
| -------------------- | -------------------------------- | --------------------------------- |
| planner              | Implementation planning          | Complex features, refactoring     |
| architect            | System design and scalability    | Architectural decisions           |
| code-reviewer        | Code quality and maintainability | After writing/modifying code      |
| security-reviewer    | Vulnerability detection          | Before commits, sensitive code    |
| build-error-resolver | Fix build/type errors            | When build fails                  |
| refactor-cleaner     | Dead code cleanup                | Code maintenance                  |
| database-reviewer    | PostgreSQL/Supabase specialist   | Schema design, query optimization |
| skeptic              | Simplifying, YAGNI, and KISS     | Simplify code                     |


## Agent Orchestration

Use agents proactively without user prompt:

- Complex feature requests → **planner**
- Code just written/modified → **code-reviewer**
- Architectural decision → **architect**
- Security-sensitive code → **security-reviewer**
- After new feature → **skeptic**

Use parallel execution for independent operations — launch multiple agents simultaneously using subagents.

## Security Guidelines

**Before ANY commit:**

- No hardcoded secrets (API keys, passwords, tokens)
- All user inputs validated
- SQL injection prevention (parameterized queries)
- XSS prevention (sanitized HTML)
- CSRF protection enabled
- Authentication/authorization verified
- Rate limiting on all endpoints
- Error messages don't leak sensitive data

**Secret management:** NEVER hardcode secrets. Use environment variables or a secret manager. Validate required secrets at startup. Rotate any exposed secrets immediately.

**If security issue found:** STOP → use security-reviewer agent → fix CRITICAL issues → rotate exposed secrets → review codebase for similar issues.

## Coding Style

**Immutability (CRITICAL):** Always create new objects, never mutate. Return new copies with changes applied.

**KISS & YAGNI (CRITICAL)** Keep it simple; don't overengineer, overabstract, or overbuild if not explicitly required.

**Human Readability:** Keep the code lean, but don't overengineer if it reduces readability.

**File organization:** Many small files over few large ones. 200-400 lines typical, 800 max. Organize by feature/domain, not by type. High cohesion, low coupling.

**Error handling:** Handle errors at every level. Provide user-friendly messages in UI code. Log detailed context server-side. Never silently swallow errors.

**Input validation:** Validate all user input at system boundaries. Use schema-based validation. Fail fast with clear messages. Never trust external data.

**Code quality checklist:**

- Functions small (<50 lines), files focused (<800 lines)
- No deep nesting (>4 levels)
- Proper error handling, no hardcoded values
- Readable, well-named identifiers

## Development Workflow

1. **Plan** — Use planner agent, identify dependencies and risks, break into phases.
2. **Build** — Use build agent, implement, refactor.
3. **Review** — Use code-reviewer agent immediately, address CRITICAL/HIGH issues.
4. **Capture knowledge in the right place**
   - Personal debugging notes, preferences, and temporary context → auto memory.
   - Team/project knowledge (architecture decisions, API changes, runbooks) → the project's existing docs structure.
   - If the current task already produces the relevant docs or code comments, do not duplicate the same information elsewhere.
   - If there is no obvious project doc location, ask before creating a new top-level file.
5. **Simplify** - Use skeptic subagent to remain lean.

## Workflow Surface Policy

- `skills/` is the canonical workflow surface.
- New workflow contributions should land in `skills/` first.
- `commands/` is a legacy slash-entry compatibility surface and should only be added or updated when a shim is still required for migration or cross-harness parity.

## Architecture Patterns

**API response format:** Consistent envelope with success indicator, data payload, error message, and pagination metadata.

**Repository pattern:** Encapsulate data access behind standard interface (findAll, findById, create, update, delete). Business logic depends on abstract interface, not storage mechanism.

**Skeleton projects:** Search for battle-tested templates, evaluate with parallel agents (security, extensibility, relevance), clone best match, iterate within proven structure.

## Performance

**Context management:** Avoid last 20% of context window for large refactoring and multi-file features. Lower-sensitivity tasks (single edits, docs, simple fixes) tolerate higher utilization.

**Build troubleshooting:** Use build-error-resolver agent → analyze errors → fix incrementally → verify after each fix.

## Project Structure

```
agents/          — specialized subagents
skills/          — workflow skills and domain knowledge
commands/        — slash commands
rules/           — Always-follow guidelines (common + per-language)
scripts/         — Cross-platform Node.js utilities
```

`commands/` remains in the repo for compatibility, but the long-term direction is skills-first.

## Success Metrics

- No security vulnerabilities
- Code is readable and maintainable
- Performance is acceptable
- User requirements are met
