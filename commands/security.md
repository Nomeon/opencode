---
description: Review a meaningful attack surface using its actual threat model
agent: security-reviewer
subtask: true
---

Review the security of `$ARGUMENTS`. If no scope is provided, use the current Git changes and their relevant trust boundaries.

1. Identify untrusted inputs, identities, privileges, sensitive data, and attacker-controlled paths involved in the change.
2. Apply only the security checks relevant to the actual architecture and threat model.
3. Report confirmed vulnerabilities separately from defense-in-depth suggestions.
4. For each finding, include severity, location, exploit prerequisites, realistic impact, and the smallest effective remediation.

Do not modify files unless remediation is explicitly requested. If remediation is requested, keep it focused and run targeted verification.
