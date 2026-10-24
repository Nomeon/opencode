---
description: Remove confirmed dead code, unused dependencies, and harmful duplication
agent: refactor-cleaner
subagent: true
---

Clean up `$ARGUMENTS`. If no scope is provided, use the current changes.

1. Inspect references, exports, configuration, tests, and dynamic usage before removing code.
2. Remove only confirmed dead code, unused dependencies, or duplication whose consolidation clearly simplifies the result.
3. Preserve public behavior, known consumers, persisted data, and project conventions.
4. Do not broaden the cleanup, install analysis tools, or introduce speculative abstractions.
5. Run targeted tests, checks, or builds for every change made.

Summarize what changed, what was deliberately retained due to uncertainty, and the verification performed. Do not create logs, branches, or commits.
