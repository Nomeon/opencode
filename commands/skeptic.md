---
description: Simplify the current implementation while preserving behavior
agent: skeptic
subtask: true
---

# Skeptic Command

Review and simplify the current implementation.

Scope: $ARGUMENTS

## Your Task

Review the current changes and improve them by reducing unnecessary complexity while preserving behavior.

Focus on:

- Removing unnecessary abstractions
- Reusing existing project utilities and patterns
- Eliminating duplicate logic
- Removing redundant state
- Simplifying APIs and parameter flow
- Removing dead code related to the current changes
- Improving readability
- Eliminating unnecessary runtime work
- Keeping the implementation easy for humans to understand

## Constraints

Always:

- Preserve behavior
- Preserve public APIs unless explicitly requested
- Keep changes minimal and focused
- Verify changes before finishing
- Prefer deleting code over adding code
- Prefer existing project patterns over new abstractions

Never:

- Introduce architecture for hypothetical future requirements
- Rewrite unrelated parts of the codebase
- Add dependencies
- Stage, commit, or push changes
- Weaken tests or validation
- Replace simple code with "enterprise" abstractions

If the implementation is already close to the simplest reasonable solution, make no changes and explicitly state that no meaningful simplification was needed.
