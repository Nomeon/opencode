---
description: Fix build or type errors with the smallest correct change
agent: build-error-resolver
subtask: true
---

Reproduce and fix `$ARGUMENTS`. If no error is supplied, run the project's existing check, type-check, or build command.

1. Reproduce the failure and separate the root cause from cascading errors.
2. Read the relevant source and configuration before editing.
3. Apply the smallest correct fix while preserving intended behavior.
4. Do not suppress errors, weaken checks, refactor unrelated code, or add speculative dependencies.
5. Rerun the original failing command, followed by any directly relevant broader check.

Report the root cause, the focused change made, and the final verification result.
