---
description: Review scoped changes for concrete defects and regressions
agent: code-reviewer
subagent: true
---

Review `$ARGUMENTS`. If no scope is provided, review the complete current Git diff, including staged and relevant untracked files.

1. Read the changed files and enough surrounding code, call sites, and tests to understand their intended behavior.
2. Identify concrete correctness, security, data-integrity, regression, maintainability, and performance issues.
3. Report findings first, ordered by severity, with file and line references, impact, and the smallest reasonable fix.
4. Do not modify files or report subjective style preferences as defects.

If there are no findings, state that explicitly and mention any residual risks or verification gaps.
