# Nomeon Global Instructions

## Working Approach

- Plan before implementing features, behavioral changes, or non-trivial refactors. Inspect the relevant code, resolve material ambiguity, define the intended scope, and identify how the result will be verified.
- Keep plans proportional. A plan should establish shared understanding, not add ceremony. Tiny, obvious changes may be handled directly when the user chooses build mode.
- Implement only the agreed requirements. Do not add speculative features, extension points, compatibility layers, or infrastructure for hypothetical future use.
- Read the existing implementation before proposing new structure. Follow established project conventions unless they are the source of the problem.
- Prefer the fewest concepts, layers, files, dependencies, and abstractions that make the current solution clear. Optimize for human readability and local reasoning, not the fewest lines.
- Ask a concise question when a decision materially affects behavior or scope. Otherwise, make the smallest reasonable choice and proceed.
- For web research, use the available `web-search` plugin rather than the built-in `websearch` tool, which may prompt the user to configure a provider. Do not ask the user to set up another provider when `web-search` is available.

## Engineering Standards

- Use direct control flow, descriptive names, and cohesive functions. Extract code only when reuse or current readability clearly improves.
- Keep related code together. Do not split files or functions to satisfy arbitrary size limits, and do not combine unrelated responsibilities merely to reduce file count.
- Reuse existing project code when it is a natural fit. Small, obvious duplication is preferable to an awkward shared abstraction.
- Avoid surprising mutation of inputs or shared state. Local mutation is acceptable when it is contained, intentional, and clearer or required by the framework.
- Validate untrusted data at system boundaries. Use the project's existing validation approach; add a schema library only when the current requirement justifies it.
- Handle errors where the code can recover, translate them for a caller, or add useful context. Do not add catch-and-rethrow blocks or defensive branches without a concrete failure mode.
- Preserve existing behavior and public APIs unless the request requires a change. Add backward compatibility only for known consumers or persisted data, not hypothetical ones.
- Add dependencies only when they provide clear value for the current task. Prefer platform and framework capabilities already in use.
- Comment non-obvious reasons, invariants, or constraints. Do not narrate straightforward code.

## Security

- Never hardcode, expose, log, or commit credentials, tokens, private keys, or other secrets.
- Preserve authentication, authorization, tenant isolation, data integrity, and transaction boundaries when they are part of the affected behavior.
- Parameterize database queries and safely handle untrusted HTML, paths, commands, URLs, and redirects at their trust boundaries.
- Apply controls such as CSRF protection, rate limiting, security headers, encryption, and audit logging when the application architecture and threat model require them, not as universal boilerplate.
- If a real secret is exposed or a critical vulnerability is discovered, stop the affected work, report it clearly, and prioritize containment and remediation.

## Workflow

1. **Plan** - Understand the requirement, inspect relevant code, state assumptions, choose the smallest viable approach, and define targeted verification.
2. **Build** - Implement the approved scope with focused changes. Do not rewrite unrelated code or disturb changes made by others.
3. **Verify** - Review the resulting diff and run the narrowest meaningful tests, type checks, lint checks, formatting, or build commands supported by the project.
4. **Review by risk** - Use specialist agents only when the task benefits from their domain expertise. Do not launch agents merely because they are available.

Use specialists contextually:


- `builder` for focused implementation tasks. 
- `architect` for a genuine design decision spanning meaningful boundaries or trade-offs.
- `code-reviewer` for broad, risky, or explicitly requested reviews.
- `security-reviewer` for authentication, authorization, sensitive data, exposed APIs, untrusted input, or other meaningful attack surfaces.
- `database-reviewer` for schema, migration, transaction, RLS, or query-performance work.
- `build-error-resolver` when a build or type check fails and needs a focused fix.
- `refactor-cleaner` for deliberate dead-code or dependency cleanup.
- `skeptic` when an implementation warrants a focused KISS/YAGNI simplification pass.

Always review your own changes, even when no specialist is used. Do not invent findings or broaden the task to justify additional work.

## Repository Safety

- Do not stage, commit, push, amend, or create pull requests unless explicitly requested.
- Never use destructive Git or database commands without explicit approval.
- Do not revert or overwrite unrelated worktree changes.
- Put durable project knowledge in the project's existing documentation structure only when the task requires it. Do not create process documents, logs, or top-level files by default.
