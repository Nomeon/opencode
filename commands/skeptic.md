---
description: Simplify the current implementation while preserving behavior
agent: skeptic
subagent: true
---

Review and simplify `$ARGUMENTS`. If no scope is provided, use the current changes.

1. Understand the intended behavior and relevant project conventions before editing.
2. Remove unnecessary concepts, layers, state, indirection, duplication, and runtime work.
3. Prefer existing project code and direct local logic over new abstractions.
4. Preserve observable behavior, public APIs, validation, authorization, and data integrity.
5. Make only clear net improvements and keep the diff within the original scope.
6. Review the resulting diff and run targeted verification for any edits.

If no meaningful simplification is warranted, leave the implementation unchanged and say so explicitly.
